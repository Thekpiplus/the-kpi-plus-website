"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { setLeadArchived } from "./archive";
import { ACTIVITY_TYPES } from "./constants";
import { currentUser, logout, requireUser } from "./auth";
import { prisma } from "./db";
import { retryNotification } from "./intake";
import { normalizePhone } from "./security";

function parseServices(value: FormDataEntryValue | FormDataEntryValue[] | null) {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string" && value) return [value];
  return [];
}

export async function moveLeadStage(leadId: string, stageId: string, reason = "") {
  const user = await requireUser();
  const db = prisma();
  const [lead, stage] = await Promise.all([
    db.lead.findUnique({ where: { id: leadId }, include: { stage: true } }),
    db.stage.findUnique({ where: { id: stageId } }),
  ]);
  if (!lead || !stage) return { ok: false as const };
  await db.lead.update({
    where: { id: leadId },
    data: {
      stageId,
      outcome: stage.isWon ? "won" : stage.isLost ? "lost" : "",
      outcomeReason: stage.isLost ? reason : "",
    },
  });
  await db.leadEvent.create({
    data: {
      leadId,
      userId: user.id,
      type: "stage_change",
      detail: `${lead.stage.nameTh} → ${stage.nameTh}`,
    },
  });
  if (lead.referralId) {
    try {
      await db.referral.update({
        where: { id: lead.referralId },
        data: { status: stage.isWon ? "won" : stage.isLost ? "lost" : lead.referralStatus || "accepted" },
      });
    } catch {
      // Referral tables may not be generated yet.
    }
  }
  if (stage.isWon) {
    try {
      const { refreshCommissions } = await import("@/lib/partners/actions");
      await refreshCommissions(leadId);
    } catch {
      // Commission refresh is optional if partner tables are not ready.
    }
  }
  revalidatePath("/crm");
  revalidatePath("/crm/pipeline");
  revalidatePath(`/crm/leads/${leadId}`);
  return { ok: true as const };
}

export async function createManualLead(formData: FormData) {
  const user = await requireUser();
  const db = prisma();
  const contactName = String(formData.get("contactName") ?? "").trim();
  if (!contactName) {
    return { ok: false as const, error: "missing_name" };
  }
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const phoneNormalized = normalizePhone(phone);
  const force = formData.get("confirmDuplicate") === "1";

  const duplicateWhere = [
    email ? { email } : undefined,
    phoneNormalized ? { phoneNormalized } : undefined,
  ].filter(Boolean) as { email?: string; phoneNormalized?: string }[];
  const duplicate =
    duplicateWhere.length > 0
      ? await db.lead.findFirst({ where: { OR: duplicateWhere } })
      : null;
  if (duplicate && !force) {
    return { ok: false as const, error: "duplicate", duplicateId: duplicate.id };
  }

  const stage = await db.stage.findFirst({ where: { sortOrder: 1 } });
  if (!stage) return { ok: false as const, error: "missing_stages" };

  const services = formData.getAll("services").map(String);
  const ownerId = String(formData.get("ownerId") ?? "") || user.id;
  const lead = await db.lead.create({
    data: {
      stageId: stage.id,
      ownerId,
      contactName,
      businessName: String(formData.get("businessName") ?? "").trim(),
      businessType: String(formData.get("businessType") ?? "").trim(),
      phone,
      phoneNormalized,
      email,
      location: String(formData.get("location") ?? "").trim(),
      website: String(formData.get("website") ?? "").trim(),
      services: JSON.stringify(services),
      source: String(formData.get("source") ?? "manual"),
      formName: "manual",
      message: String(formData.get("notes") ?? ""),
      estimatedValue: formData.get("estimatedValue") ? Number(formData.get("estimatedValue")) : null,
      decisionDate: formData.get("decisionDate") ? new Date(String(formData.get("decisionDate"))) : null,
      partnerId: String(formData.get("partnerId") ?? "") || null,
      referredAt: formData.get("referredAt") ? new Date(String(formData.get("referredAt"))) : null,
      creditNote: String(formData.get("creditNote") ?? ""),
    },
  });
  await db.leadEvent.create({
    data: { leadId: lead.id, userId: user.id, type: "created", detail: "คีย์ลีดจากแหล่งอื่น" },
  });
  const firstNote = String(formData.get("notes") ?? "").trim();
  if (firstNote) {
    await db.leadEvent.create({
      data: { leadId: lead.id, userId: user.id, type: "note", detail: firstNote },
    });
  }
  const due = new Date();
  due.setDate(due.getDate() + 1);
  await db.activity.create({
    data: {
      leadId: lead.id,
      ownerId,
      type: "call",
      title: "ติดตามลีดใหม่",
      dueAt: due,
    },
  });
  await db.lead.update({ where: { id: lead.id }, data: { nextActivityAt: due } });
  revalidatePath("/crm");
  revalidatePath("/crm/sales");
  revalidatePath("/crm/leads");
  revalidatePath("/crm/pipeline");
  return { ok: true as const, id: lead.id };
}

export async function createLeadAndOpen(formData: FormData) {
  const result = await createManualLead(formData);
  if (result.ok && result.id) redirect(`/crm/leads/${result.id}`);
  if (result.error === "duplicate" && result.duplicateId) {
    redirect(`/crm/leads/new?duplicate=${result.duplicateId}`);
  }
  redirect("/crm/leads/new?error=1");
}

export async function assignLeadOwner(formData: FormData) {
  const user = await requireUser();
  const leadId = String(formData.get("leadId") ?? "");
  const ownerId = String(formData.get("ownerId") ?? "") || null;
  if (!leadId) return;
  const owner = ownerId ? await prisma().user.findUnique({ where: { id: ownerId }, select: { name: true } }) : null;
  await prisma().lead.update({ where: { id: leadId }, data: { ownerId } });
  await prisma().leadEvent.create({
    data: { leadId, userId: user.id, type: "assigned", detail: owner ? `มอบหมายให้ ${owner.name}` : "เอาผู้ดูแลออก" },
  });
  revalidatePath("/crm/leads");
  revalidatePath(`/crm/leads/${leadId}`);
  revalidatePath("/crm/sales");
  revalidatePath("/crm/pipeline");
}

export async function updateLead(formData: FormData) {
  const user = await requireUser();
  const leadId = String(formData.get("leadId") ?? "");
  if (!leadId) return;
  const phone = String(formData.get("phone") ?? "").trim();
  await prisma().lead.update({
    where: { id: leadId },
    data: {
      contactName: String(formData.get("contactName") ?? "").trim(),
      businessName: String(formData.get("businessName") ?? "").trim(),
      businessType: String(formData.get("businessType") ?? "").trim(),
      phone,
      phoneNormalized: normalizePhone(phone),
      email: String(formData.get("email") ?? "").trim().toLowerCase(),
      location: String(formData.get("location") ?? "").trim(),
      website: String(formData.get("website") ?? "").trim(),
      services: JSON.stringify(formData.getAll("services").map(String)),
      ownerId: String(formData.get("ownerId") ?? "") || null,
      estimatedValue: formData.get("estimatedValue") ? Number(formData.get("estimatedValue")) : null,
      decisionDate: formData.get("decisionDate") ? new Date(String(formData.get("decisionDate"))) : null,
      message: String(formData.get("message") ?? ""),
    },
  });
  await prisma().leadEvent.create({
    data: { leadId, userId: user.id, type: "updated", detail: "แก้ไขข้อมูลลีด" },
  });
  revalidatePath("/crm/leads");
  revalidatePath(`/crm/leads/${leadId}`);
  revalidatePath("/crm/pipeline");
  revalidatePath("/crm/sales");
}

export async function changeLeadStage(formData: FormData) {
  const leadId = String(formData.get("leadId") ?? "");
  const stageId = String(formData.get("stageId") ?? "");
  const reason = String(formData.get("outcomeReason") ?? "");
  await moveLeadStage(leadId, stageId, reason);
}

export async function setLeadArchiveState(formData: FormData) {
  const user = await requireUser();
  const leadId = String(formData.get("leadId") ?? "");
  const archived = String(formData.get("archived") ?? "") === "1";
  if (!leadId) return;
  await setLeadArchived(leadId, archived);
  await prisma().leadEvent.create({
    data: {
      leadId,
      userId: user.id,
      type: archived ? "archived" : "restored",
      detail: archived ? "เก็บลีดออกจากรายการหลัก" : "นำลีดกลับมาใช้",
    },
  });
  revalidatePath("/crm");
  revalidatePath("/crm/leads");
  revalidatePath("/crm/sales");
  revalidatePath("/crm/pipeline");
  revalidatePath("/crm/activities");
  revalidatePath(`/crm/leads/${leadId}`);
  redirect(archived ? "/crm/leads" : `/crm/leads/${leadId}`);
}

export async function addNote(leadId: string, note: string) {
  const user = await requireUser();
  if (!note.trim()) return;
  await prisma().leadEvent.create({
    data: { leadId, userId: user.id, type: "note", detail: note.trim() },
  });
  revalidatePath(`/crm/leads/${leadId}`);
}

export async function addNoteFromForm(formData: FormData) {
  await addNote(String(formData.get("leadId") ?? ""), String(formData.get("note") ?? ""));
}

export async function scheduleActivity(formData: FormData) {
  const user = await requireUser();
  const leadId = String(formData.get("leadId") ?? "");
  const type = String(formData.get("type") ?? "task");
  const dueAt = String(formData.get("dueAt") ?? "");
  if (!leadId || !dueAt || !ACTIVITY_TYPES.includes(type as (typeof ACTIVITY_TYPES)[number])) {
    return;
  }
  const db = prisma();
  const activity = await db.activity.create({
    data: {
      leadId,
      ownerId: user.id,
      type,
      title: String(formData.get("title") ?? type),
      dueAt: new Date(dueAt),
      notes: String(formData.get("notes") ?? ""),
    },
  });
  await db.lead.update({
    where: { id: leadId },
    data: { nextActivityAt: new Date(dueAt), noFollowUp: false, noFollowUpReason: "" },
  });
  await db.leadEvent.create({
    data: { leadId, userId: user.id, type: "activity_created", detail: `${type} · ${activity.title}` },
  });
  revalidatePath("/crm");
  revalidatePath("/crm/sales");
  revalidatePath("/crm/activities");
  revalidatePath(`/crm/leads/${leadId}`);
}

export async function completeActivity(formData: FormData) {
  const user = await requireUser();
  const activityId = String(formData.get("activityId") ?? "");
  const outcome = String(formData.get("outcome") ?? "").trim();
  const nextDue = String(formData.get("nextDueAt") ?? "");
  const nextType = String(formData.get("nextType") ?? "call");
  const noFollowUp = formData.get("noFollowUp") === "1";
  const noFollowUpReason = String(formData.get("noFollowUpReason") ?? "").trim();
  const db = prisma();
  const activity = await db.activity.findUnique({ where: { id: activityId } });
  if (!activity) return;

  await db.activity.update({
    where: { id: activityId },
    data: { status: "done", outcome, completedAt: new Date() },
  });
  await db.lead.update({
    where: { id: activity.leadId },
    data: { lastContactAt: new Date() },
  });
  await db.leadEvent.create({
    data: {
      leadId: activity.leadId,
      userId: user.id,
      type: "activity_done",
      detail: outcome || activity.title,
    },
  });

  if (noFollowUp) {
    await db.lead.update({
      where: { id: activity.leadId },
      data: { nextActivityAt: null, noFollowUp: true, noFollowUpReason },
    });
  } else if (nextDue) {
    await db.activity.create({
      data: {
        leadId: activity.leadId,
        ownerId: user.id,
        type: nextType,
        title: String(formData.get("nextTitle") ?? "Follow-up"),
        dueAt: new Date(nextDue),
      },
    });
    await db.lead.update({
      where: { id: activity.leadId },
      data: { nextActivityAt: new Date(nextDue), noFollowUp: false },
    });
  } else {
    const next = await db.activity.findFirst({
      where: { leadId: activity.leadId, status: "open" },
      orderBy: { dueAt: "asc" },
    });
    await db.lead.update({
      where: { id: activity.leadId },
      data: { nextActivityAt: next?.dueAt ?? null },
    });
  }

  revalidatePath("/crm");
  revalidatePath("/crm/sales");
  revalidatePath("/crm/activities");
  revalidatePath(`/crm/leads/${activity.leadId}`);
}

export async function retryFailedNotification(id: string) {
  await requireUser();
  await retryNotification(id);
  revalidatePath("/crm/settings");
}

export async function renameStage(id: string, nameTh: string, name: string) {
  await requireUser();
  await prisma().stage.update({ where: { id }, data: { nameTh, name } });
  revalidatePath("/crm/pipeline");
  revalidatePath("/crm/settings");
}

export async function currentSessionUser() {
  return currentUser();
}

export async function loginAction(formData: FormData) {
  const { ensureCrmSeed } = await import("./seed");
  const { startLogin } = await import("./auth");
  await ensureCrmSeed();
  const result = await startLogin(String(formData.get("email") ?? ""), String(formData.get("password") ?? ""));
  if (!result.ok) redirect(`/admin?error=${result.error}`);
  redirect(result.next);
}

export async function logoutAction() {
  await logout();
  redirect("/admin");
}

export async function logoutPartnerAction() {
  await logout();
  redirect("/partners/login");
}

void parseServices;
