"use server";

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import { prisma } from "@/lib/crm/db";
import { randomToken } from "@/lib/crm/security";
import { b2bAccessFor, canOpenB2b } from "./access";
import { ensureB2bOpsSchema } from "./ensure";
import { activityStatusFromProgress, b2bSubtaskProgress } from "./progress";
import {
  isActivityStatus,
  isActivityType,
  isDepartment,
  isPartnerType,
  isPriority,
  isRateStatus,
  isStatus,
  isSubtaskStatus,
  MAX_B2B_SUBTASKS,
  normalizeActivityStatus,
  type B2bSaveResult,
} from "./types";

const MAX_FILE_BYTES = 5 * 1024 * 1024;

async function requireB2b() {
  const user = await requireUser();
  if (!canOpenB2b(user)) redirect("/crm?error=forbidden");
  await ensureB2bOpsSchema();
  const access = await b2bAccessFor(user);
  return { user, access };
}

function revalidateB2b(id?: string) {
  revalidatePath("/crm");
  revalidatePath("/crm/b2b");
  revalidatePath("/crm/b2b/directory");
  revalidatePath("/crm/b2b/rates");
  revalidatePath("/crm/b2b/materials");
  revalidatePath("/crm/b2b/activities");
  revalidatePath("/crm/b2b/bookings");
  revalidatePath("/crm/b2b/reports");
  revalidatePath("/crm/b2b/settings");
  if (id) revalidatePath(`/crm/b2b/partners/${id}`);
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function optionalDate(value: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function audit(partnerId: string, actorId: string, action: string, detail: string) {
  await prisma().b2bAudit.create({ data: { partnerId, actorId, action, detail } });
}

async function storePrivateFile(
  file: File,
  folder: string,
): Promise<{ error: "invalid_file" } | { filename: string; mime: string; size: number; path: string } | null> {
  if (!file.size) return null;
  if (file.size > MAX_FILE_BYTES) return { error: "invalid_file" };
  const original = file.name || "file";
  const dot = original.lastIndexOf(".");
  const ext = dot >= 0 ? original.slice(dot).toLowerCase() : "";
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = `${randomToken(8)}${ext || ""}`;
  const dir = join(process.cwd(), "private", "b2b-ops", folder);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, name), buffer);
  return {
    filename: original,
    mime: file.type || "application/octet-stream",
    size: file.size,
    path: `private/b2b-ops/${folder}/${name}`,
  };
}

export async function saveB2bPartner(formData: FormData): Promise<B2bSaveResult> {
  const { user, access } = await requireB2b();
  if (!access.canEditPipeline) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const name = text(formData, "name");
  const type = text(formData, "type") || "other";
  const status = text(formData, "status") || "new_lead";
  const priority = text(formData, "priority") || "normal";
  const department = text(formData, "department") || "sales";
  const rateApproval = text(formData, "rateApproval") || "draft";
  if (!name) return { ok: false, error: "missing_name" };
  if (!isPartnerType(type) || !isStatus(status) || !isPriority(priority) || !isDepartment(department) || !isRateStatus(rateApproval)) {
    return { ok: false, error: "invalid" };
  }

  const payload = {
    name,
    type,
    market: text(formData, "market"),
    contactChannel: access.canContacts ? text(formData, "contactChannel") : undefined,
    contactPerson: access.canContacts ? text(formData, "contactPerson") : undefined,
    ownerId: text(formData, "ownerId"),
    department,
    priority,
    status,
    nextAction: text(formData, "nextAction"),
    nextActionAt: optionalDate(text(formData, "nextActionAt")),
    lastContactAt: optionalDate(text(formData, "lastContactAt")),
    notes: text(formData, "notes"),
    hotels: text(formData, "hotels"),
    rateApproval: access.canEditCommercial ? rateApproval : undefined,
    updatedBy: user.id,
  };

  const db = prisma();
  if (id) {
    const existing = await db.b2bPartner.findUnique({ where: { id } });
    if (!existing) return { ok: false, error: "missing" };
    const data = Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));
    await db.b2bPartner.update({ where: { id }, data });
    await audit(id, user.id, "save", `บันทึก ${name}`);
    revalidateB2b(id);
    return { ok: true, id };
  }

  const created = await db.b2bPartner.create({
    data: {
      name,
      type,
      market: payload.market,
      contactPerson: payload.contactPerson ?? "",
      contactChannel: payload.contactChannel ?? "",
      ownerId: payload.ownerId,
      department,
      priority,
      status,
      nextAction: payload.nextAction,
      nextActionAt: payload.nextActionAt,
      lastContactAt: payload.lastContactAt,
      notes: payload.notes,
      hotels: payload.hotels,
      rateApproval: payload.rateApproval ?? "draft",
      createdBy: user.id,
      updatedBy: user.id,
    },
  });
  await audit(created.id, user.id, "create", `สร้างพาร์ตเนอร์ ${name}`);
  revalidateB2b(created.id);
  return { ok: true, id: created.id };
}

export async function changeB2bStatus(formData: FormData): Promise<B2bSaveResult> {
  const { user, access } = await requireB2b();
  if (!access.canEditPipeline) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const status = text(formData, "status");
  if (!id || !isStatus(status)) return { ok: false, error: "invalid" };
  const existing = await prisma().b2bPartner.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "missing" };
  await prisma().b2bPartner.update({ where: { id }, data: { status, updatedBy: user.id } });
  await audit(id, user.id, "status", `เปลี่ยนสถานะเป็น ${status}`);
  revalidateB2b(id);
  return { ok: true, id };
}

export async function deleteB2bPartner(formData: FormData): Promise<B2bSaveResult> {
  const { user, access } = await requireB2b();
  if (!access.canEditPipeline && !access.isManagement) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false, error: "invalid" };
  const existing = await prisma().b2bPartner.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "missing" };
  await prisma().b2bPartner.delete({ where: { id } });
  revalidateB2b();
  return { ok: true, id };
}

export async function saveB2bContact(formData: FormData): Promise<B2bSaveResult> {
  const { user, access } = await requireB2b();
  if (!access.canContacts || !access.canEditPipeline) return { ok: false, error: "forbidden" };
  const partnerId = text(formData, "partnerId");
  const id = text(formData, "id");
  const name = text(formData, "name");
  if (!partnerId || !name) return { ok: false, error: "missing_name" };
  const data = {
    name,
    role: text(formData, "role"),
    email: text(formData, "email"),
    phone: text(formData, "phone"),
    channel: text(formData, "channel"),
    isPrimary: text(formData, "isPrimary") === "1",
  };
  const db = prisma();
  const saved = id
    ? await db.b2bContact.update({ where: { id }, data })
    : await db.b2bContact.create({ data: { ...data, partnerId } });
  await audit(partnerId, user.id, "contact", `บันทึกผู้ติดต่อ ${name}`);
  revalidateB2b(partnerId);
  return { ok: true, id: saved.id };
}

export async function deleteB2bContact(formData: FormData): Promise<B2bSaveResult> {
  const { user, access } = await requireB2b();
  if (!access.canContacts || !access.canEditPipeline) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const row = await prisma().b2bContact.findUnique({ where: { id } });
  if (!row) return { ok: false, error: "missing" };
  await prisma().b2bContact.delete({ where: { id } });
  await audit(row.partnerId, user.id, "contact", `ลบผู้ติดต่อ ${row.name}`);
  revalidateB2b(row.partnerId);
  return { ok: true, id };
}

export async function saveB2bTerm(formData: FormData): Promise<B2bSaveResult> {
  const { user, access } = await requireB2b();
  if (!access.canEditCommercial) return { ok: false, error: "forbidden" };
  const partnerId = text(formData, "partnerId");
  const id = text(formData, "id");
  const status = text(formData, "status") || "draft";
  if (!partnerId) return { ok: false, error: "invalid" };
  if (!isRateStatus(status)) return { ok: false, error: "invalid" };
  const data = {
    hotelName: text(formData, "hotelName"),
    ratePlan: text(formData, "ratePlan"),
    commissionText: text(formData, "commissionText"),
    availability: text(formData, "availability"),
    channel: text(formData, "channel"),
    status,
    notes: text(formData, "notes"),
    approvedBy: status === "approved" ? user.id : "",
    approvedAt: status === "approved" ? new Date() : null,
    updatedBy: user.id,
  };
  const db = prisma();
  const saved = id
    ? await db.b2bCommercialTerm.update({ where: { id }, data })
    : await db.b2bCommercialTerm.create({ data: { ...data, partnerId, createdBy: user.id } });
  await db.b2bPartner.update({ where: { id: partnerId }, data: { rateApproval: status, updatedBy: user.id } });
  await audit(partnerId, user.id, "commercial", `บันทึกเงื่อนไขราคา ${data.hotelName || saved.id}`);
  revalidateB2b(partnerId);
  return { ok: true, id: saved.id };
}

export async function deleteB2bTerm(formData: FormData): Promise<B2bSaveResult> {
  const { user, access } = await requireB2b();
  if (!access.canEditCommercial) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const row = await prisma().b2bCommercialTerm.findUnique({ where: { id } });
  if (!row) return { ok: false, error: "missing" };
  await prisma().b2bCommercialTerm.delete({ where: { id } });
  await audit(row.partnerId, user.id, "commercial", "ลบเงื่อนไขราคา");
  revalidateB2b(row.partnerId);
  return { ok: true, id };
}

async function syncActivityStatus(activityId: string) {
  const row = await prisma().b2bActivity.findUnique({
    where: { id: activityId },
    include: { subtasks: true },
  });
  if (!row) return;
  const current = normalizeActivityStatus(row.status);
  const next = activityStatusFromProgress(current, b2bSubtaskProgress(row.subtasks));
  if (next === current) return;
  const completed = next === "completed" || next === "closed";
  await prisma().b2bActivity.update({
    where: { id: activityId },
    data: {
      status: next,
      completedAt: completed ? row.completedAt || new Date() : null,
      closedAt: next === "closed" ? row.closedAt || new Date() : row.closedAt,
    },
  });
}

export async function saveB2bActivity(formData: FormData): Promise<B2bSaveResult> {
  const { user, access } = await requireB2b();
  if (!access.canEditActivities) return { ok: false, error: "forbidden" };
  const partnerId = text(formData, "partnerId");
  const id = text(formData, "id");
  const title = text(formData, "title");
  const type = text(formData, "type") || "follow_up";
  const status = text(formData, "status") || "planned";
  if (!partnerId || !title) return { ok: false, error: "missing_title" };
  if (!isActivityType(type) || !isActivityStatus(status)) return { ok: false, error: "invalid" };
  const dueAt = optionalDate(text(formData, "dueAt"));
  const completedAt = status === "completed" || status === "closed" ? optionalDate(text(formData, "completedAt")) || new Date() : null;
  const data = {
    type,
    title,
    hotelName: text(formData, "hotelName"),
    dueAt,
    status,
    notes: text(formData, "notes"),
    ownerId: text(formData, "ownerId") || user.id,
    completedAt,
    closedAt: status === "closed" ? new Date() : null,
    escalatedAt: status === "escalated" ? new Date() : undefined,
  };
  const db = prisma();
  const saved = id
    ? await db.b2bActivity.update({ where: { id }, data })
    : await db.b2bActivity.create({ data: { ...data, partnerId, createdBy: user.id } });
  await db.b2bPartner.update({
    where: { id: partnerId },
    data: {
      nextAction: title,
      nextActionAt: dueAt,
      lastContactAt: completedAt || undefined,
      updatedBy: user.id,
    },
  });
  await syncActivityStatus(saved.id);
  await audit(partnerId, user.id, "activity", `บันทึกกิจกรรม ${title}`);
  revalidateB2b(partnerId);
  return { ok: true, id: saved.id };
}

export async function changeB2bActivityStatus(formData: FormData): Promise<B2bSaveResult> {
  const { user, access } = await requireB2b();
  if (!access.canEditActivities) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const status = text(formData, "status");
  if (!id || !isActivityStatus(status)) return { ok: false, error: "invalid" };
  const existing = await prisma().b2bActivity.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "missing" };
  await prisma().b2bActivity.update({
    where: { id },
    data: {
      status,
      completedAt: status === "completed" || status === "closed" ? existing.completedAt || new Date() : null,
      closedAt: status === "closed" ? new Date() : existing.closedAt,
      escalatedAt: status === "escalated" ? new Date() : existing.escalatedAt,
    },
  });
  if (status !== "cancelled" && status !== "closed" && status !== "escalated") {
    await syncActivityStatus(id);
  }
  await audit(existing.partnerId, user.id, "activity", `เปลี่ยนสถานะกิจกรรมเป็น ${status}`);
  revalidateB2b(existing.partnerId);
  return { ok: true, id };
}

export async function assignB2bActivity(formData: FormData): Promise<B2bSaveResult> {
  const { user, access } = await requireB2b();
  if (!access.canEditActivities) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const ownerId = text(formData, "ownerId");
  if (!id) return { ok: false, error: "invalid" };
  const existing = await prisma().b2bActivity.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "missing" };
  await prisma().b2bActivity.update({ where: { id }, data: { ownerId } });
  await audit(existing.partnerId, user.id, "activity", "มอบหมายกิจกรรม");
  revalidateB2b(existing.partnerId);
  return { ok: true, id };
}

export async function closeB2bActivity(formData: FormData): Promise<B2bSaveResult> {
  formData.set("status", "closed");
  return changeB2bActivityStatus(formData);
}

export async function escalateB2bActivity(formData: FormData): Promise<B2bSaveResult> {
  formData.set("status", "escalated");
  return changeB2bActivityStatus(formData);
}

export async function addB2bSubtask(formData: FormData): Promise<B2bSaveResult> {
  const { user, access } = await requireB2b();
  if (!access.canEditActivities) return { ok: false, error: "forbidden" };
  const activityId = text(formData, "activityId");
  const name = text(formData, "name");
  if (!activityId || !name) return { ok: false, error: "missing_name" };
  const activity = await prisma().b2bActivity.findUnique({ where: { id: activityId } });
  if (!activity) return { ok: false, error: "missing" };
  const count = await prisma().b2bActivitySubtask.count({ where: { activityId } });
  if (count >= MAX_B2B_SUBTASKS) return { ok: false, error: "subtask_limit" };
  const status = text(formData, "status") || "planned";
  const priority = text(formData, "priority") || "normal";
  await prisma().b2bActivitySubtask.create({
    data: {
      activityId,
      name,
      status: isSubtaskStatus(status) ? status : "planned",
      completed: status === "completed",
      dueAt: optionalDate(text(formData, "dueAt")),
      assigneeId: text(formData, "assigneeId"),
      priority: isPriority(priority) ? priority : "normal",
      comments: text(formData, "comments"),
      sortOrder: count + 1,
    },
  });
  await syncActivityStatus(activityId);
  await audit(activity.partnerId, user.id, "activity", `เพิ่มซับงาน ${name}`);
  revalidateB2b(activity.partnerId);
  return { ok: true, id: activityId };
}

export async function saveB2bSubtask(formData: FormData): Promise<B2bSaveResult> {
  const { user, access } = await requireB2b();
  if (!access.canEditActivities) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const activityId = text(formData, "activityId");
  const name = text(formData, "name");
  if (!id || !activityId || !name) return { ok: false, error: "missing_name" };
  const activity = await prisma().b2bActivity.findUnique({ where: { id: activityId } });
  if (!activity) return { ok: false, error: "missing" };
  const status = text(formData, "status") || "planned";
  const completed = formData.get("completed") === "1" || status === "completed";
  const priority = text(formData, "priority") || "normal";
  await prisma().b2bActivitySubtask.update({
    where: { id },
    data: {
      name,
      status: completed ? "completed" : isSubtaskStatus(status) ? status : "planned",
      completed,
      dueAt: optionalDate(text(formData, "dueAt")),
      assigneeId: text(formData, "assigneeId"),
      priority: isPriority(priority) ? priority : "normal",
      comments: text(formData, "comments"),
    },
  });
  await syncActivityStatus(activityId);
  await audit(activity.partnerId, user.id, "activity", `บันทึกซับงาน ${name}`);
  revalidateB2b(activity.partnerId);
  return { ok: true, id: activityId };
}

export async function completeB2bSubtask(formData: FormData): Promise<B2bSaveResult> {
  await requireB2b();
  const id = text(formData, "id");
  const existing = id ? await prisma().b2bActivitySubtask.findUnique({ where: { id } }) : null;
  if (!existing) return { ok: false, error: "missing" };
  if (!text(formData, "name")) formData.set("name", existing.name);
  if (!text(formData, "activityId")) formData.set("activityId", existing.activityId);
  if (!text(formData, "assigneeId")) formData.set("assigneeId", existing.assigneeId);
  if (!text(formData, "priority")) formData.set("priority", existing.priority);
  if (!text(formData, "comments")) formData.set("comments", existing.comments);
  if (existing.dueAt && !text(formData, "dueAt")) formData.set("dueAt", existing.dueAt.toISOString());
  const completed = formData.get("completed") === "0" ? "0" : "1";
  formData.set("completed", completed);
  formData.set("status", completed === "1" ? "completed" : existing.status === "completed" ? "planned" : existing.status);
  return saveB2bSubtask(formData);
}

export async function addB2bActivityComment(formData: FormData): Promise<B2bSaveResult> {
  const { user, access } = await requireB2b();
  if (!access.canEditActivities) return { ok: false, error: "forbidden" };
  const activityId = text(formData, "activityId");
  const body = text(formData, "body");
  if (!activityId || !body) return { ok: false, error: "missing_comment" };
  const activity = await prisma().b2bActivity.findUnique({ where: { id: activityId } });
  if (!activity) return { ok: false, error: "missing" };
  await prisma().b2bActivityComment.create({ data: { activityId, authorId: user.id, body } });
  await audit(activity.partnerId, user.id, "activity", "เพิ่มความคิดเห็น");
  revalidateB2b(activity.partnerId);
  return { ok: true, id: activityId };
}

export async function attachB2bActivityFile(formData: FormData): Promise<B2bSaveResult> {
  const { user, access } = await requireB2b();
  if (!access.canEditActivities) return { ok: false, error: "forbidden" };
  const activityId = text(formData, "activityId");
  const file = formData.get("file");
  if (!activityId || !(file instanceof File) || !file.size) return { ok: false, error: "missing_file" };
  const activity = await prisma().b2bActivity.findUnique({ where: { id: activityId } });
  if (!activity) return { ok: false, error: "missing" };
  const stored = await storePrivateFile(file, "activities");
  if (!stored || "error" in stored) return { ok: false, error: stored?.error || "invalid_file" };
  await prisma().b2bActivityFile.create({
    data: {
      activityId,
      filename: stored.filename,
      mime: stored.mime,
      size: stored.size,
      path: stored.path,
      caption: text(formData, "caption"),
      createdBy: user.id,
    },
  });
  await audit(activity.partnerId, user.id, "activity", `แนบไฟล์ ${stored.filename}`);
  revalidateB2b(activity.partnerId);
  return { ok: true, id: activityId };
}

export async function deleteB2bActivity(formData: FormData): Promise<B2bSaveResult> {
  const { user, access } = await requireB2b();
  if (!access.canEditActivities) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const row = await prisma().b2bActivity.findUnique({ where: { id } });
  if (!row) return { ok: false, error: "missing" };
  await prisma().b2bActivity.delete({ where: { id } });
  await audit(row.partnerId, user.id, "activity", `ลบกิจกรรม ${row.title}`);
  revalidateB2b(row.partnerId);
  return { ok: true, id };
}

export async function saveB2bBooking(formData: FormData): Promise<B2bSaveResult> {
  const { user, access } = await requireB2b();
  if (!access.canEditCommercial) return { ok: false, error: "forbidden" };
  const partnerId = text(formData, "partnerId");
  const id = text(formData, "id");
  if (!partnerId) return { ok: false, error: "invalid" };
  const data = {
    hotelName: text(formData, "hotelName"),
    period: text(formData, "period"),
    roomNights: text(formData, "roomNights"),
    revenueText: text(formData, "revenueText"),
    status: text(formData, "status") || "draft",
    dataStatus: text(formData, "dataStatus") || "internal",
    notes: text(formData, "notes"),
    updatedBy: user.id,
  };
  const db = prisma();
  const saved = id
    ? await db.b2bBooking.update({ where: { id }, data })
    : await db.b2bBooking.create({ data: { ...data, partnerId, createdBy: user.id } });
  await audit(partnerId, user.id, "booking", `บันทึกผลจอง ${data.hotelName || saved.id}`);
  revalidateB2b(partnerId);
  return { ok: true, id: saved.id };
}

export async function deleteB2bBooking(formData: FormData): Promise<B2bSaveResult> {
  const { user, access } = await requireB2b();
  if (!access.canEditCommercial) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const row = await prisma().b2bBooking.findUnique({ where: { id } });
  if (!row) return { ok: false, error: "missing" };
  await prisma().b2bBooking.delete({ where: { id } });
  await audit(row.partnerId, user.id, "booking", "ลบผลจอง");
  revalidateB2b(row.partnerId);
  return { ok: true, id };
}

export async function saveB2bNote(formData: FormData): Promise<B2bSaveResult> {
  const { user, access } = await requireB2b();
  const partnerId = text(formData, "partnerId");
  const kind = text(formData, "kind") || "general";
  const body = text(formData, "body");
  if (!partnerId || !body) return { ok: false, error: "invalid" };
  if (kind === "campaign" && !access.canEditMaterials && !access.canEditPipeline) return { ok: false, error: "forbidden" };
  if (kind !== "campaign" && !access.canEditPipeline && !access.canEditMaterials) return { ok: false, error: "forbidden" };
  const saved = await prisma().b2bNote.create({ data: { partnerId, kind, body, authorId: user.id } });
  await audit(partnerId, user.id, "note", kind === "campaign" ? "เพิ่มบันทึกแคมเปญ" : "เพิ่มบันทึก");
  revalidateB2b(partnerId);
  return { ok: true, id: saved.id };
}

export async function attachB2bFile(formData: FormData): Promise<B2bSaveResult> {
  const { user, access } = await requireB2b();
  if (!access.canEditMaterials && !access.canEditPipeline) return { ok: false, error: "forbidden" };
  const partnerId = text(formData, "partnerId");
  const file = formData.get("file");
  if (!partnerId || !(file instanceof File) || !file.size) return { ok: false, error: "invalid_file" };
  const stored = await storePrivateFile(file, "partners");
  if (!stored || "error" in stored) return { ok: false, error: stored?.error || "invalid_file" };
  const saved = await prisma().b2bFile.create({
    data: {
      partnerId,
      kind: text(formData, "kind") || "file",
      filename: stored.filename,
      mime: stored.mime,
      size: stored.size,
      path: stored.path,
      caption: text(formData, "caption"),
      createdBy: user.id,
    },
  });
  await audit(partnerId, user.id, "file", `แนบไฟล์ ${stored.filename}`);
  revalidateB2b(partnerId);
  return { ok: true, id: saved.id };
}

export async function deleteB2bFile(formData: FormData): Promise<B2bSaveResult> {
  const { user, access } = await requireB2b();
  if (!access.canEditMaterials && !access.canEditPipeline) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const row = await prisma().b2bFile.findUnique({ where: { id } });
  if (!row) return { ok: false, error: "missing" };
  await prisma().b2bFile.delete({ where: { id } });
  await audit(row.partnerId, user.id, "file", `ลบไฟล์ ${row.filename}`);
  revalidateB2b(row.partnerId);
  return { ok: true, id };
}

export async function saveB2bMaterial(formData: FormData): Promise<B2bSaveResult> {
  const { user, access } = await requireB2b();
  if (!access.canEditMaterials) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const title = text(formData, "title");
  if (!title) return { ok: false, error: "missing_title" };
  const file = formData.get("file");
  const stored = file instanceof File && file.size ? await storePrivateFile(file, "materials") : null;
  if (stored && "error" in stored) return { ok: false, error: stored.error || "invalid_file" };
  const data = {
    title,
    kind: text(formData, "kind") || "kit",
    status: text(formData, "status") || "draft",
    notes: text(formData, "notes"),
    updatedBy: user.id,
    ...(stored && !("error" in stored)
      ? { filename: stored.filename, mime: stored.mime, size: stored.size, path: stored.path }
      : {}),
  };
  const db = prisma();
  const saved = id
    ? await db.b2bMaterial.update({ where: { id }, data })
    : await db.b2bMaterial.create({ data: { ...data, createdBy: user.id } });
  revalidateB2b();
  return { ok: true, id: saved.id };
}

export async function deleteB2bMaterial(formData: FormData): Promise<B2bSaveResult> {
  const { access } = await requireB2b();
  if (!access.canEditMaterials) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false, error: "invalid" };
  await prisma().b2bMaterial.delete({ where: { id } });
  revalidateB2b();
  return { ok: true, id };
}

export async function saveB2bAccess(formData: FormData): Promise<B2bSaveResult> {
  const { access } = await requireB2b();
  if (!access.canManageSettings) return { ok: false, error: "forbidden" };
  const userId = text(formData, "userId");
  const department = text(formData, "department");
  if (!userId || !isDepartment(department)) return { ok: false, error: "invalid" };
  const saved = await prisma().b2bAccess.upsert({
    where: { userId_department: { userId, department } },
    update: {
      canContacts: text(formData, "canContacts") === "1",
      canCommercial: text(formData, "canCommercial") === "1",
    },
    create: {
      userId,
      department,
      canContacts: text(formData, "canContacts") === "1",
      canCommercial: text(formData, "canCommercial") === "1",
    },
  });
  revalidateB2b();
  return { ok: true, id: saved.id };
}

export async function deleteB2bAccess(formData: FormData): Promise<B2bSaveResult> {
  const { access } = await requireB2b();
  if (!access.canManageSettings) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false, error: "invalid" };
  await prisma().b2bAccess.delete({ where: { id } });
  revalidateB2b();
  return { ok: true, id };
}
