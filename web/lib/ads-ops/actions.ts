"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { requireUser } from "@/lib/crm/auth";
import { prisma } from "@/lib/crm/db";
import { randomToken } from "@/lib/crm/security";
import { adsAccessFor, canOpenAds } from "./access";
import { ensureAdsOpsSchema } from "./ensure";
import { adsSubtaskProgress, shouldAwaitReview } from "./progress";
import {
  ADS_STARTER_SUBTASKS,
  MAX_ADS_SUBTASKS,
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
  type AdsStatus,
} from "./types";

const MAX_FILE_BYTES = 5 * 1024 * 1024;

const URL_RE = /^(#|\/|https?:\/\/)/i;

async function requireAds() {
  const user = await requireUser();
  if (!canOpenAds(user)) redirect("/crm?error=forbidden");
  await ensureAdsOpsSchema();
  const access = await adsAccessFor(user);
  return { user, access };
}

function revalidateAds(id?: string) {
  revalidatePath("/crm");
  revalidatePath("/crm/ads");
  revalidatePath("/crm/ads/search");
  revalidatePath("/crm/ads/hotel");
  revalidatePath("/crm/ads/free-links");
  revalidatePath("/crm/ads/landing-pages");
  revalidatePath("/crm/ads/tracking");
  revalidatePath("/crm/ads/optimization");
  revalidatePath("/crm/ads/reports");
  revalidatePath("/crm/ads/approvals");
  revalidatePath("/crm/ads/settings");
  if (id) revalidatePath(`/crm/ads?id=${id}`);
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function optionalDate(value: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

async function writeAudit(campaignId: string, userId: string, action: string, detail: string) {
  await prisma().adsAuditEvent.create({
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
  const dir = join(process.cwd(), "private", "ads-ops", folder);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, name), buffer);
  return {
    filename: original,
    mime: file.type || "application/octet-stream",
    size: file.size,
    path: `private/ads-ops/${folder}/${name}`,
  };
}

async function seedStarterSubtasks(campaignId: string, ownerId: string, userId: string) {
  const db = prisma();
  if (!db.adsSubtask?.create) return;
  await Promise.all(
    ADS_STARTER_SUBTASKS.map((item, index) =>
      db.adsSubtask.create({
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
  const campaign = await db.adsCampaign.findUnique({ where: { id: campaignId } });
  if (!campaign) return;
  const subtasks = db.adsSubtask?.findMany
    ? await db.adsSubtask.findMany({ where: { campaignId } }).catch(() => [])
    : [];
  const status = normalizeStatus(campaign.status);
  const progress = adsSubtaskProgress(subtasks, status);
  if (!shouldAwaitReview(status, progress)) {
    await db.adsCampaign.update({ where: { id: campaignId }, data: { updatedBy: userId } });
    return;
  }
  await db.adsCampaign.update({
    where: { id: campaignId },
    data: { status: "awaiting_approval", approvalStatus: "awaiting", updatedBy: userId },
  });
  await writeAudit(campaignId, userId, "readiness", "Subtasks 100% — Ready for review");
}

export async function saveAdsCampaign(formData: FormData): Promise<AdsSaveResult> {
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
    audienceIntent: text(formData, "audienceIntent"),
    adsCreative: text(formData, "adsCreative"),
    landingNotes: text(formData, "landingNotes"),
    trackingNotes: text(formData, "trackingNotes"),
    reportNotes: text(formData, "reportNotes"),
    searchIntent: text(formData, "searchIntent"),
    adCopy: text(formData, "adCopy"),
    audience: text(formData, "audience"),
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

  if (id) {
    const existing = await prisma().adsCampaign.findUnique({ where: { id } });
    if (!existing) return { ok: false, error: "missing" };
    const saved = await prisma().adsCampaign.update({
      where: { id },
      data: {
        ...data,
        budgetAmount: data.budgetAmount ?? existing.budgetAmount,
        accountRef: data.accountRef ?? existing.accountRef,
        budgetNote: data.budgetNote ?? existing.budgetNote,
        offerPromotion: data.offerPromotion ?? existing.offerPromotion,
        rateContext: data.rateContext ?? existing.rateContext,
        roasTarget: data.roasTarget ?? existing.roasTarget,
        bookingValueNotes: data.bookingValueNotes ?? existing.bookingValueNotes,
        budgetAuth: data.budgetAuth ?? existing.budgetAuth,
        finalDecision: data.finalDecision ?? existing.finalDecision,
      },
    });
    await writeAudit(saved.id, user.id, "save", `Updated ${saved.name || saved.hotelName}`);
    revalidateAds(saved.id);
    return { ok: true, id: saved.id };
  }

  const saved = await prisma().adsCampaign.create({
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
      audienceIntent: data.audienceIntent,
      adsCreative: data.adsCreative,
      landingNotes: data.landingNotes,
      trackingNotes: data.trackingNotes,
      reportNotes: data.reportNotes,
      searchIntent: data.searchIntent,
      adCopy: data.adCopy,
      audience: data.audience,
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
  await seedStarterSubtasks(saved.id, saved.ownerId, user.id);
  await writeAudit(saved.id, user.id, "create", `Created ${saved.name || saved.hotelName}`);
  revalidateAds(saved.id);
  return { ok: true, id: saved.id };
}

export async function changeAdsStatus(formData: FormData): Promise<AdsSaveResult> {
  const { user, access } = await requireAds();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const status = normalizeStatus(text(formData, "status"));
  if (!id) return { ok: false, error: "invalid" };
  const saved = await prisma().adsCampaign.update({ where: { id }, data: { status, updatedBy: user.id } });
  await writeAudit(saved.id, user.id, "status", `Status → ${status}`);
  revalidateAds(saved.id);
  return { ok: true, id: saved.id };
}

export async function deleteAdsCampaign(formData: FormData): Promise<AdsSaveResult> {
  const { access } = await requireAds();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false, error: "missing" };
  await prisma().adsCampaign.delete({ where: { id } });
  revalidateAds();
  return { ok: true, id };
}

export async function saveAdsActivity(formData: FormData): Promise<AdsSaveResult> {
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
    const saved = await prisma().adsActivity.update({ where: { id }, data });
    await writeAudit(saved.campaignId, user.id, "activity", `Updated ${saved.title}`);
    revalidateAds(saved.campaignId);
    return { ok: true, id: saved.id };
  }
  const saved = await prisma().adsActivity.create({ data: { ...data, createdBy: user.id } });
  await writeAudit(saved.campaignId, user.id, "activity", `Added ${saved.title}`);
  revalidateAds(saved.campaignId);
  return { ok: true, id: saved.id };
}

export async function deleteAdsActivity(formData: FormData): Promise<AdsSaveResult> {
  const { user, access } = await requireAds();
  if (!access.canEditActivities) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false, error: "missing" };
  const existing = await prisma().adsActivity.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "missing" };
  await prisma().adsActivity.delete({ where: { id } });
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
  const saved = await prisma().adsKpiEntry.create({
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
  const existing = await prisma().adsKpiEntry.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "missing" };
  await prisma().adsKpiEntry.delete({ where: { id } });
  await writeAudit(existing.campaignId, user.id, "kpi", `Deleted ${existing.metric}`);
  revalidateAds(existing.campaignId);
  return { ok: true, id };
}

export async function saveAdsNote(formData: FormData): Promise<AdsSaveResult> {
  const { user, access } = await requireAds();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const campaignId = text(formData, "campaignId");
  const title = text(formData, "title");
  if (!campaignId || !title) return { ok: false, error: "missing_title" };
  const kind = text(formData, "kind");
  const saved = await prisma().adsNote.create({
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

export async function deleteAdsNote(formData: FormData): Promise<AdsSaveResult> {
  const { user, access } = await requireAds();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false, error: "missing" };
  const existing = await prisma().adsNote.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "missing" };
  await prisma().adsNote.delete({ where: { id } });
  await writeAudit(existing.campaignId, user.id, "note", `Deleted ${existing.title}`);
  revalidateAds(existing.campaignId);
  return { ok: true, id };
}

export async function saveAdsAccess(formData: FormData): Promise<AdsSaveResult> {
  const { access } = await requireAds();
  if (!access.canManageSettings) return { ok: false, error: "forbidden" };
  const userId = text(formData, "userId");
  const department = text(formData, "department");
  if (!userId || !isDepartment(department)) return { ok: false, error: "invalid" };
  const saved = await prisma().adsAccess.upsert({
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

export async function deleteAdsAccess(formData: FormData): Promise<AdsSaveResult> {
  const { access } = await requireAds();
  if (!access.canManageSettings) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false, error: "missing" };
  await prisma().adsAccess.delete({ where: { id } });
  revalidateAds();
  return { ok: true, id };
}

export async function assignAdsCampaign(formData: FormData): Promise<AdsSaveResult> {
  const { user, access } = await requireAds();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const ownerId = text(formData, "ownerId");
  if (!id) return { ok: false, error: "invalid" };
  const saved = await prisma().adsCampaign.update({ where: { id }, data: { ownerId, updatedBy: user.id } });
  await writeAudit(saved.id, user.id, "assign", `Assigned owner ${ownerId || "unassigned"}`);
  revalidateAds(saved.id);
  return { ok: true, id: saved.id };
}

export async function changeAdsDepartment(formData: FormData): Promise<AdsSaveResult> {
  const { user, access } = await requireAds();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const department = text(formData, "department");
  if (!id || !isDepartment(department)) return { ok: false, error: "invalid" };
  const saved = await prisma().adsCampaign.update({ where: { id }, data: { department, updatedBy: user.id } });
  await writeAudit(saved.id, user.id, "department", `Department → ${department}`);
  revalidateAds(saved.id);
  return { ok: true, id: saved.id };
}

export async function escalateAdsCampaign(formData: FormData): Promise<AdsSaveResult> {
  const { user, access } = await requireAds();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false, error: "missing" };
  const existing = await prisma().adsCampaign.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "missing" };
  const current = normalizeStatus(existing.status);
  const nextStatus: AdsStatus =
    current === "ended" || current === "archived" || current === "active" || current === "optimizing" || current === "paused"
      ? current
      : "awaiting_approval";
  const saved = await prisma().adsCampaign.update({
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

export async function closeAdsCampaign(formData: FormData): Promise<AdsSaveResult> {
  const { user, access } = await requireAds();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false, error: "missing" };
  const saved = await prisma().adsCampaign.update({
    where: { id },
    data: { status: "ended", closedAt: new Date(), updatedBy: user.id },
  });
  await writeAudit(saved.id, user.id, "close", "Closed campaign");
  revalidateAds(saved.id);
  return { ok: true, id: saved.id };
}

export async function saveAdsSubtask(formData: FormData): Promise<AdsSaveResult> {
  const { user, access } = await requireAds();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const campaignId = text(formData, "campaignId");
  const name = text(formData, "name");
  if (!campaignId || !name) return { ok: false, error: "missing_name" };
  const campaign = await prisma().adsCampaign.findUnique({ where: { id: campaignId } });
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
    await prisma().adsSubtask.update({ where: { id }, data: payload });
    await syncCampaignReadiness(campaignId, user.id);
    await writeAudit(campaignId, user.id, "subtask", `Updated ${name}`);
    revalidateAds(campaignId);
    return { ok: true, id };
  }
  const count = await prisma().adsSubtask.count({ where: { campaignId } });
  if (count >= MAX_ADS_SUBTASKS) return { ok: false, error: "subtask_limit" };
  const saved = await prisma().adsSubtask.create({
    data: { ...payload, sortOrder: count + 1, createdBy: user.id },
  });
  await syncCampaignReadiness(campaignId, user.id);
  await writeAudit(campaignId, user.id, "subtask", `Added ${name}`);
  revalidateAds(campaignId);
  return { ok: true, id: saved.id };
}

export async function completeAdsSubtask(formData: FormData): Promise<AdsSaveResult> {
  const { user, access } = await requireAds();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const existing = id ? await prisma().adsSubtask.findUnique({ where: { id } }) : null;
  if (!existing) return { ok: false, error: "missing" };
  const flag = formData.get("completed");
  const completed = flag === "0" ? false : flag === "1" ? true : !existing.completed;
  await prisma().adsSubtask.update({
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

export async function addAdsSubtaskComment(formData: FormData): Promise<AdsSaveResult> {
  const { user, access } = await requireAds();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const subtaskId = text(formData, "subtaskId");
  const body = text(formData, "body");
  if (!subtaskId || !body) return { ok: false, error: "missing_comment" };
  const existing = await prisma().adsSubtask.findUnique({ where: { id: subtaskId } });
  if (!existing) return { ok: false, error: "missing" };
  const saved = await prisma().adsSubtaskComment.create({
    data: { subtaskId, authorId: user.id, body },
  });
  await writeAudit(existing.campaignId, user.id, "comment", `Comment on ${existing.name}`);
  revalidateAds(existing.campaignId);
  return { ok: true, id: saved.id };
}

export async function attachAdsSubtaskFile(formData: FormData): Promise<AdsSaveResult> {
  const { user, access } = await requireAds();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const subtaskId = text(formData, "subtaskId");
  const file = formData.get("file");
  if (!subtaskId || !(file instanceof File) || !file.size) return { ok: false, error: "missing_file" };
  const existing = await prisma().adsSubtask.findUnique({ where: { id: subtaskId } });
  if (!existing) return { ok: false, error: "missing" };
  const stored = await storePrivateFile(file, "subtasks");
  if (!stored || "error" in stored) return { ok: false, error: stored?.error || "invalid_file" };
  const saved = await prisma().adsSubtaskFile.create({
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
