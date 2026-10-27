"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { requireUser } from "@/lib/crm/auth";
import { prisma } from "@/lib/crm/db";
import { randomToken } from "@/lib/crm/security";
import { metaAccessFor, canOpenMeta } from "./access";
import { ensureMetaOpsSchema } from "./ensure";
import { metaSubtaskProgress, shouldAwaitReview } from "./progress";
import {
  ADS_STARTER_SUBTASKS,
  MAX_META_SUBTASKS,
  isActivityStatus,
  isActivityType,
  isApprovalStatus,
  isBudgetPeriod,
  isDepartment,
  isKpiDataStatus,
  isNoteKind,
  isPriority,
  isSubtaskStatus,
  isTrackingStatus,
  normalizeChannel,
  normalizeStatus,
  normalizeSubtaskStatus,
  type AdsSaveResult,
  type MetaStatus,
} from "./types";

const MAX_FILE_BYTES = 5 * 1024 * 1024;

const URL_RE = /^(#|\/|https?:\/\/)/i;

async function requireAds() {
  const user = await requireUser();
  if (!canOpenMeta(user)) redirect("/crm?error=forbidden");
  await ensureMetaOpsSchema();
  const access = await metaAccessFor(user);
  return { user, access };
}

function revalidateAds(id?: string) {
  revalidatePath("/crm");
  revalidatePath("/crm/meta");
  revalidatePath("/crm/meta/audiences");
  revalidatePath("/crm/meta/creative-matrix");
  revalidatePath("/crm/meta/ads");
  revalidatePath("/crm/meta/remarketing");
  revalidatePath("/crm/meta/landing-pages");
  revalidatePath("/crm/meta/tracking");
  revalidatePath("/crm/meta/optimization");
  revalidatePath("/crm/meta/reports");
  revalidatePath("/crm/meta/approvals");
  revalidatePath("/crm/meta/settings");
  if (id) revalidatePath(`/crm/meta?id=${id}`);
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function optionalDate(value: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function persistMetaExtraFields(
  id: string,
  extra: { audienceSegment?: string; creativeMatrixRef: string; remarketingNotes: string; pixelRef?: string },
  existingPixel?: string,
  existingSegment?: string,
) {
  const pixel = extra.pixelRef ?? existingPixel ?? "";
  const segment = extra.audienceSegment ?? existingSegment ?? "";
  try {
    await prisma().$executeRawUnsafe(
      `UPDATE \`MetaCampaign\` SET \`audienceSegment\` = ?, \`creativeMatrixRef\` = ?, \`remarketingNotes\` = ?, \`pixelRef\` = ? WHERE \`id\` = ?`,
      segment,
      extra.creativeMatrixRef,
      extra.remarketingNotes,
      pixel,
      id,
    );
  } catch {
    // Columns may still be adding via ensureMetaOpsSchema.
  }
}

async function writeAudit(campaignId: string, userId: string, action: string, detail: string) {
  await prisma().metaAuditEvent.create({
    data: { campaignId, createdBy: userId, action, detail },
  }).catch(() => undefined);
}

async function storePrivateFile(file: File, folder: string) {
  if (!file.size) return null;
  if (file.size > MAX_FILE_BYTES) return { error: "invalid_file" as const };
  const original = file.name || "file";
  const dot = original.lastIndexOf(".");
  const ext = dot >= 0 ? original.slice(dot).toLowerCase() : "";
  if (ext && !/^\.(png|jpe?g|webp|gif|svg|pdf|docx?|xlsx?|txt)$/i.test(ext)) return { error: "invalid_file" as const };
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = `${randomToken(8)}${ext || ""}`;
  const dir = join(process.cwd(), "private", "meta-ops", folder);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, name), buffer);
  return {
    filename: original,
    mime: file.type || "application/octet-stream",
    size: file.size,
    path: `private/meta-ops/${folder}/${name}`,
  };
}

async function seedStarterSubtasks(campaignId: string, ownerId: string, userId: string) {
  const db = prisma();
  if (!db.metaSubtask?.create) return;
  await Promise.all(
    ADS_STARTER_SUBTASKS.map((item, index) =>
      db.metaSubtask.create({
        data: {
          campaignId,
          name: item.name,
          department: item.department,
          ownerId,
          status: "not_started",
          completed: false,
          priority: "normal",
          comments: "",
          sortOrder: index + 1,
          createdBy: userId,
        },
      }),
    ),
  );
}

async function syncCampaignReadiness(campaignId: string, userId: string) {
  const db = prisma();
  const campaign = await db.metaCampaign.findUnique({ where: { id: campaignId } });
  if (!campaign) return;
  const subtasks = db.metaSubtask?.findMany
    ? await db.metaSubtask.findMany({ where: { campaignId } }).catch(() => [])
    : [];
  const status = normalizeStatus(campaign.status);
  const progress = metaSubtaskProgress(subtasks, status);
  if (!shouldAwaitReview(status, progress)) {
    await db.metaCampaign.update({ where: { id: campaignId }, data: { updatedBy: userId } });
    return;
  }
  await db.metaCampaign.update({
    where: { id: campaignId },
    data: { status: "awaiting_approval", approvalStatus: "awaiting", updatedBy: userId },
  });
  await writeAudit(campaignId, userId, "readiness", "Subtasks 100% — Ready for review");
}

export async function saveMetaCampaign(formData: FormData): Promise<AdsSaveResult> {
  const { user, access } = await requireAds();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const hotelName = text(formData, "hotelName");
  const name = text(formData, "name") || hotelName;
  if (!hotelName && !name) return { ok: false, error: "missing_hotel" };
  const landingUrl = text(formData, "landingUrl");
  const bookingUrl = text(formData, "bookingUrl");
  if (landingUrl && !URL_RE.test(landingUrl)) return { ok: false, error: "invalid_url" };
  if (bookingUrl && !URL_RE.test(bookingUrl)) return { ok: false, error: "invalid_url" };

  const channel = normalizeChannel(text(formData, "channel"));
  const status = normalizeStatus(text(formData, "status"));
  const department = text(formData, "department");
  const priority = text(formData, "priority");
  const budgetPeriod = text(formData, "budgetPeriod");
  const trackingStatus = text(formData, "trackingStatus");
  const approvalStatus = text(formData, "approvalStatus");
  const data = {
    name,
    hotelName: hotelName || name,
    channel,
    objective: text(formData, "objective"),
    market: text(formData, "market"),
    language: text(formData, "language"),
    startAt: optionalDate(text(formData, "startAt")),
    endAt: optionalDate(text(formData, "endAt")),
    budgetAmount: access.canSeeBudget ? text(formData, "budgetAmount") : undefined,
    budgetPeriod: isBudgetPeriod(budgetPeriod) ? budgetPeriod : "monthly",
    status,
    ownerId: text(formData, "ownerId"),
    department: isDepartment(department) ? department : "marketing",
    priority: isPriority(priority) ? priority : "normal",
    nextAction: text(formData, "nextAction"),
    nextActionAt: optionalDate(text(formData, "nextActionAt")),
    landingUrl,
    bookingUrl,
    trackingStatus: isTrackingStatus(trackingStatus) ? trackingStatus : "not_set",
    primaryKpi: text(formData, "primaryKpi"),
    kpiTarget: text(formData, "kpiTarget"),
    approvalStatus: isApprovalStatus(approvalStatus) ? approvalStatus : "not_requested",
    notes: text(formData, "notes"),
    audienceIntent: access.canSeeAudience ? text(formData, "audienceIntent") : undefined,
    adsCreative: text(formData, "adsCreative"),
    landingNotes: text(formData, "landingNotes"),
    trackingNotes: text(formData, "trackingNotes"),
    reportNotes: text(formData, "reportNotes"),
    searchIntent: access.canSeeAudience ? text(formData, "searchIntent") : undefined,
    adCopy: text(formData, "adCopy"),
    audience: access.canSeeAudience ? text(formData, "audience") : undefined,
    campaignMessaging: text(formData, "campaignMessaging"),
    creativeNotes: text(formData, "creativeNotes"),
    offerPromotion: access.canSeeBudget ? text(formData, "offerPromotion") : undefined,
    rateContext: access.canSeeBudget ? text(formData, "rateContext") : undefined,
    roasTarget: access.canSeeBudget ? text(formData, "roasTarget") : undefined,
    bookingValueNotes: access.canSeeBudget ? text(formData, "bookingValueNotes") : undefined,
    rateFeed: text(formData, "rateFeed"),
    hotelAdsQuality: text(formData, "hotelAdsQuality"),
    channelConsistency: text(formData, "channelConsistency"),
    bookingEngineNotes: text(formData, "bookingEngineNotes"),
    landingContent: text(formData, "landingContent"),
    hotelValueProp: text(formData, "hotelValueProp"),
    marketPartnerContext: text(formData, "marketPartnerContext"),
    leadFollowUp: text(formData, "leadFollowUp"),
    budgetAuth: access.isManagement ? text(formData, "budgetAuth") : undefined,
    kpiReview: text(formData, "kpiReview"),
    finalDecision: access.isManagement ? text(formData, "finalDecision") : undefined,
    accountRef: access.canSeeAccounts ? text(formData, "accountRef") : undefined,
    budgetNote: access.canSeeBudget ? text(formData, "budgetNote") : undefined,
    updatedBy: user.id,
  };
  const extra = {
    audienceSegment: access.canSeeAudience ? text(formData, "audienceSegment") : undefined,
    creativeMatrixRef: text(formData, "creativeMatrixRef"),
    remarketingNotes: text(formData, "remarketingNotes"),
    pixelRef: access.canSeeAccounts ? text(formData, "pixelRef") : undefined as string | undefined,
  };

  if (id) {
    const existing = await prisma().metaCampaign.findUnique({ where: { id } });
    if (!existing) return { ok: false, error: "missing" };
    const saved = await prisma().metaCampaign.update({
      where: { id },
      data: {
        ...data,
        budgetAmount: data.budgetAmount ?? existing.budgetAmount,
        accountRef: data.accountRef ?? existing.accountRef,
        budgetNote: data.budgetNote ?? existing.budgetNote,
        audienceIntent: data.audienceIntent ?? existing.audienceIntent,
        searchIntent: data.searchIntent ?? existing.searchIntent,
        audience: data.audience ?? existing.audience,
        offerPromotion: data.offerPromotion ?? existing.offerPromotion,
        rateContext: data.rateContext ?? existing.rateContext,
        roasTarget: data.roasTarget ?? existing.roasTarget,
        bookingValueNotes: data.bookingValueNotes ?? existing.bookingValueNotes,
        budgetAuth: data.budgetAuth ?? existing.budgetAuth,
        finalDecision: data.finalDecision ?? existing.finalDecision,
      },
    });
    await persistMetaExtraFields(
      saved.id,
      extra,
      (existing as { pixelRef?: string }).pixelRef,
      (existing as { audienceSegment?: string }).audienceSegment,
    );
    await writeAudit(saved.id, user.id, "save", `Updated ${saved.name || saved.hotelName}`);
    revalidateAds(saved.id);
    return { ok: true, id: saved.id };
  }

  const saved = await prisma().metaCampaign.create({
    data: {
      name: data.name,
      hotelName: data.hotelName,
      channel: data.channel,
      objective: data.objective,
      market: data.market,
      language: data.language,
      startAt: data.startAt,
      endAt: data.endAt,
      budgetAmount: data.budgetAmount ?? "",
      budgetPeriod: data.budgetPeriod,
      status: data.status,
      ownerId: data.ownerId,
      department: data.department,
      priority: data.priority,
      nextAction: data.nextAction,
      nextActionAt: data.nextActionAt,
      landingUrl: data.landingUrl,
      bookingUrl: data.bookingUrl,
      trackingStatus: data.trackingStatus,
      primaryKpi: data.primaryKpi,
      kpiTarget: data.kpiTarget,
      approvalStatus: data.approvalStatus,
      notes: data.notes,
      audienceIntent: data.audienceIntent ?? "",
      adsCreative: data.adsCreative,
      landingNotes: data.landingNotes,
      trackingNotes: data.trackingNotes,
      reportNotes: data.reportNotes,
      searchIntent: data.searchIntent ?? "",
      adCopy: data.adCopy,
      audience: data.audience ?? "",
      campaignMessaging: data.campaignMessaging,
      creativeNotes: data.creativeNotes,
      offerPromotion: data.offerPromotion ?? "",
      rateContext: data.rateContext ?? "",
      roasTarget: data.roasTarget ?? "",
      bookingValueNotes: data.bookingValueNotes ?? "",
      rateFeed: data.rateFeed,
      hotelAdsQuality: data.hotelAdsQuality,
      channelConsistency: data.channelConsistency,
      bookingEngineNotes: data.bookingEngineNotes,
      landingContent: data.landingContent,
      hotelValueProp: data.hotelValueProp,
      marketPartnerContext: data.marketPartnerContext,
      leadFollowUp: data.leadFollowUp,
      budgetAuth: data.budgetAuth ?? "",
      kpiReview: data.kpiReview,
      finalDecision: data.finalDecision ?? "",
      accountRef: data.accountRef ?? "",
      budgetNote: data.budgetNote ?? "",
      createdBy: user.id,
      updatedBy: user.id,
    },
  });
  await persistMetaExtraFields(saved.id, extra);
  await seedStarterSubtasks(saved.id, saved.ownerId, user.id);
  await writeAudit(saved.id, user.id, "create", `Created ${saved.name || saved.hotelName}`);
  revalidateAds(saved.id);
  return { ok: true, id: saved.id };
}

export async function changeMetaStatus(formData: FormData): Promise<AdsSaveResult> {
  const { user, access } = await requireAds();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const status = normalizeStatus(text(formData, "status"));
  if (!id) return { ok: false, error: "invalid" };
  const saved = await prisma().metaCampaign.update({ where: { id }, data: { status, updatedBy: user.id } });
  await writeAudit(saved.id, user.id, "status", `Status → ${status}`);
  revalidateAds(saved.id);
  return { ok: true, id: saved.id };
}

export async function deleteMetaCampaign(formData: FormData): Promise<AdsSaveResult> {
  const { access } = await requireAds();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false, error: "missing" };
  await prisma().metaCampaign.delete({ where: { id } });
  revalidateAds();
  return { ok: true, id };
}

export async function saveMetaActivity(formData: FormData): Promise<AdsSaveResult> {
  const { user, access } = await requireAds();
  if (!access.canEditActivities) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const campaignId = text(formData, "campaignId");
  const title = text(formData, "title");
  if (!campaignId || !title) return { ok: false, error: "missing_title" };
  const type = text(formData, "type");
  const status = text(formData, "status");
  const data = {
    campaignId,
    type: isActivityType(type) ? type : "brief",
    title,
    dueAt: optionalDate(text(formData, "dueAt")),
    status: isActivityStatus(status) ? status : "planned",
    notes: text(formData, "notes"),
    ownerId: text(formData, "ownerId") || user.id,
  };
  if (id) {
    const saved = await prisma().metaActivity.update({ where: { id }, data });
    await writeAudit(saved.campaignId, user.id, "activity", `Updated ${saved.title}`);
    revalidateAds(saved.campaignId);
    return { ok: true, id: saved.id };
  }
  const saved = await prisma().metaActivity.create({ data: { ...data, createdBy: user.id } });
  await writeAudit(saved.campaignId, user.id, "activity", `Added ${saved.title}`);
  revalidateAds(saved.campaignId);
  return { ok: true, id: saved.id };
}

export async function deleteMetaActivity(formData: FormData): Promise<AdsSaveResult> {
  const { user, access } = await requireAds();
  if (!access.canEditActivities) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false, error: "missing" };
  const existing = await prisma().metaActivity.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "missing" };
  await prisma().metaActivity.delete({ where: { id } });
  await writeAudit(existing.campaignId, user.id, "activity", `Deleted ${existing.title}`);
  revalidateAds(existing.campaignId);
  return { ok: true, id };
}

export async function saveAdsKpi(formData: FormData): Promise<AdsSaveResult> {
  const { user, access } = await requireAds();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const campaignId = text(formData, "campaignId");
  const metric = text(formData, "metric");
  if (!campaignId || !metric) return { ok: false, error: "missing_title" };
  const dataStatus = text(formData, "dataStatus");
  const saved = await prisma().metaKpiEntry.create({
    data: {
      campaignId,
      period: text(formData, "period"),
      metric,
      value: text(formData, "value"),
      target: text(formData, "target"),
      dataStatus: isKpiDataStatus(dataStatus) ? dataStatus : "draft",
      notes: text(formData, "notes"),
      createdBy: user.id,
    },
  });
  await writeAudit(campaignId, user.id, "kpi", `Added ${metric}`);
  revalidateAds(campaignId);
  return { ok: true, id: saved.id };
}

export async function deleteAdsKpi(formData: FormData): Promise<AdsSaveResult> {
  const { user, access } = await requireAds();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false, error: "missing" };
  const existing = await prisma().metaKpiEntry.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "missing" };
  await prisma().metaKpiEntry.delete({ where: { id } });
  await writeAudit(existing.campaignId, user.id, "kpi", `Deleted ${existing.metric}`);
  revalidateAds(existing.campaignId);
  return { ok: true, id };
}

export async function saveMetaNote(formData: FormData): Promise<AdsSaveResult> {
  const { user, access } = await requireAds();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const campaignId = text(formData, "campaignId");
  const title = text(formData, "title");
  if (!campaignId || !title) return { ok: false, error: "missing_title" };
  const kind = text(formData, "kind");
  const saved = await prisma().metaNote.create({
    data: {
      campaignId,
      kind: isNoteKind(kind) ? kind : "note",
      title,
      body: text(formData, "body"),
      url: text(formData, "url"),
      createdBy: user.id,
    },
  });
  await writeAudit(campaignId, user.id, "note", `Added ${saved.title}`);
  revalidateAds(campaignId);
  return { ok: true, id: saved.id };
}

export async function deleteMetaNote(formData: FormData): Promise<AdsSaveResult> {
  const { user, access } = await requireAds();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false, error: "missing" };
  const existing = await prisma().metaNote.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "missing" };
  await prisma().metaNote.delete({ where: { id } });
  await writeAudit(existing.campaignId, user.id, "note", `Deleted ${existing.title}`);
  revalidateAds(existing.campaignId);
  return { ok: true, id };
}

export async function saveMetaAccess(formData: FormData): Promise<AdsSaveResult> {
  const { access } = await requireAds();
  if (!access.canManageSettings) return { ok: false, error: "forbidden" };
  const userId = text(formData, "userId");
  const department = text(formData, "department");
  if (!userId || !isDepartment(department)) return { ok: false, error: "invalid" };
  const saved = await prisma().metaAccess.upsert({
    where: { userId_department: { userId, department } },
    update: {
      canSeeAccounts: formData.get("canSeeAccounts") === "1",
      canSeeBudget: formData.get("canSeeBudget") === "1",
    },
    create: {
      userId,
      department,
      canSeeAccounts: formData.get("canSeeAccounts") === "1",
      canSeeBudget: formData.get("canSeeBudget") === "1",
    },
  });
  revalidateAds();
  return { ok: true, id: saved.id };
}

export async function deleteMetaAccess(formData: FormData): Promise<AdsSaveResult> {
  const { access } = await requireAds();
  if (!access.canManageSettings) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false, error: "missing" };
  await prisma().metaAccess.delete({ where: { id } });
  revalidateAds();
  return { ok: true, id };
}

export async function assignMetaCampaign(formData: FormData): Promise<AdsSaveResult> {
  const { user, access } = await requireAds();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const ownerId = text(formData, "ownerId");
  if (!id) return { ok: false, error: "invalid" };
  const saved = await prisma().metaCampaign.update({ where: { id }, data: { ownerId, updatedBy: user.id } });
  await writeAudit(saved.id, user.id, "assign", `Assigned owner ${ownerId || "unassigned"}`);
  revalidateAds(saved.id);
  return { ok: true, id: saved.id };
}

export async function changeMetaDepartment(formData: FormData): Promise<AdsSaveResult> {
  const { user, access } = await requireAds();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const department = text(formData, "department");
  if (!id || !isDepartment(department)) return { ok: false, error: "invalid" };
  const saved = await prisma().metaCampaign.update({ where: { id }, data: { department, updatedBy: user.id } });
  await writeAudit(saved.id, user.id, "department", `Department → ${department}`);
  revalidateAds(saved.id);
  return { ok: true, id: saved.id };
}

export async function escalateMetaCampaign(formData: FormData): Promise<AdsSaveResult> {
  const { user, access } = await requireAds();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false, error: "missing" };
  const existing = await prisma().metaCampaign.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "missing" };
  const current = normalizeStatus(existing.status);
  const nextStatus: MetaStatus =
    current === "ended" || current === "archived" || current === "active" || current === "optimizing" || current === "paused"
      ? current
      : "awaiting_approval";
  const saved = await prisma().metaCampaign.update({
    where: { id },
    data: {
      department: "management",
      status: nextStatus,
      approvalStatus: "awaiting",
      escalatedAt: new Date(),
      updatedBy: user.id,
    },
  });
  await writeAudit(saved.id, user.id, "escalate", "Escalated to Management");
  revalidateAds(saved.id);
  return { ok: true, id: saved.id };
}

export async function closeMetaCampaign(formData: FormData): Promise<AdsSaveResult> {
  const { user, access } = await requireAds();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false, error: "missing" };
  const saved = await prisma().metaCampaign.update({
    where: { id },
    data: { status: "ended", closedAt: new Date(), updatedBy: user.id },
  });
  await writeAudit(saved.id, user.id, "close", "Closed campaign");
  revalidateAds(saved.id);
  return { ok: true, id: saved.id };
}

export async function saveMetaSubtask(formData: FormData): Promise<AdsSaveResult> {
  const { user, access } = await requireAds();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const campaignId = text(formData, "campaignId");
  const name = text(formData, "name");
  if (!campaignId || !name) return { ok: false, error: "missing_name" };
  const campaign = await prisma().metaCampaign.findUnique({ where: { id: campaignId } });
  if (!campaign) return { ok: false, error: "missing" };
  const department = text(formData, "department");
  const status = normalizeSubtaskStatus(text(formData, "status"));
  const completed = formData.get("completed") === "1" || status === "completed";
  const nextStatus = completed ? "completed" : status;
  const priority = text(formData, "priority");
  const payload = {
    campaignId,
    name,
    department: isDepartment(department) ? department : "marketing",
    ownerId: text(formData, "ownerId") || user.id,
    status: isSubtaskStatus(nextStatus) ? nextStatus : "not_started",
    completed,
    dueAt: optionalDate(text(formData, "dueAt")),
    priority: isPriority(priority) ? priority : "normal",
    comments: text(formData, "comments"),
  };
  if (id) {
    await prisma().metaSubtask.update({ where: { id }, data: payload });
    await syncCampaignReadiness(campaignId, user.id);
    await writeAudit(campaignId, user.id, "subtask", `Updated ${name}`);
    revalidateAds(campaignId);
    return { ok: true, id };
  }
  const count = await prisma().metaSubtask.count({ where: { campaignId } });
  if (count >= MAX_META_SUBTASKS) return { ok: false, error: "subtask_limit" };
  const saved = await prisma().metaSubtask.create({
    data: { ...payload, sortOrder: count + 1, createdBy: user.id },
  });
  await syncCampaignReadiness(campaignId, user.id);
  await writeAudit(campaignId, user.id, "subtask", `Added ${name}`);
  revalidateAds(campaignId);
  return { ok: true, id: saved.id };
}

export async function completeMetaSubtask(formData: FormData): Promise<AdsSaveResult> {
  const { user, access } = await requireAds();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const existing = id ? await prisma().metaSubtask.findUnique({ where: { id } }) : null;
  if (!existing) return { ok: false, error: "missing" };
  const flag = formData.get("completed");
  const completed = flag === "0" ? false : flag === "1" ? true : !existing.completed;
  await prisma().metaSubtask.update({
    where: { id },
    data: {
      completed,
      status: completed ? "completed" : existing.status === "completed" ? "not_started" : existing.status,
    },
  });
  await syncCampaignReadiness(existing.campaignId, user.id);
  await writeAudit(existing.campaignId, user.id, "subtask", completed ? `Completed ${existing.name}` : `Reopened ${existing.name}`);
  revalidateAds(existing.campaignId);
  return { ok: true, id };
}

export async function addMetaSubtaskComment(formData: FormData): Promise<AdsSaveResult> {
  const { user, access } = await requireAds();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const subtaskId = text(formData, "subtaskId");
  const body = text(formData, "body");
  if (!subtaskId || !body) return { ok: false, error: "missing_comment" };
  const existing = await prisma().metaSubtask.findUnique({ where: { id: subtaskId } });
  if (!existing) return { ok: false, error: "missing" };
  const saved = await prisma().metaSubtaskComment.create({
    data: { subtaskId, authorId: user.id, body },
  });
  await writeAudit(existing.campaignId, user.id, "comment", `Comment on ${existing.name}`);
  revalidateAds(existing.campaignId);
  return { ok: true, id: saved.id };
}

export async function attachMetaSubtaskFile(formData: FormData): Promise<AdsSaveResult> {
  const { user, access } = await requireAds();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const subtaskId = text(formData, "subtaskId");
  const file = formData.get("file");
  if (!subtaskId || !(file instanceof File) || !file.size) return { ok: false, error: "missing_file" };
  const existing = await prisma().metaSubtask.findUnique({ where: { id: subtaskId } });
  if (!existing) return { ok: false, error: "missing" };
  const stored = await storePrivateFile(file, "subtasks");
  if (!stored || "error" in stored) return { ok: false, error: stored?.error || "invalid_file" };
  const saved = await prisma().metaSubtaskFile.create({
    data: {
      subtaskId,
      filename: stored.filename,
      mime: stored.mime,
      size: stored.size,
      path: stored.path,
      caption: text(formData, "caption"),
      createdBy: user.id,
    },
  });
  await writeAudit(existing.campaignId, user.id, "file", `Attached ${stored.filename} to ${existing.name}`);
  revalidateAds(existing.campaignId);
  return { ok: true, id: saved.id };
}
