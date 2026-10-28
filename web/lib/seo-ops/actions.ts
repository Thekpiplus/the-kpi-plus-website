"use server";

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import { prisma } from "@/lib/crm/db";
import { randomToken } from "@/lib/crm/security";
import { seoAccessFor, canOpenSeo } from "./access";
import { ensureSeoSchema } from "./ensure";
import { seoSubtaskProgress, shouldAwaitReview } from "./progress";
import {
  countSeoSubtasks,
  createSeoProperty,
  deleteSeoAccessRow,
  deleteSeoProperty,
  getSeoSubtask,
  insertSeoSource,
  insertSeoSubtask,
  insertSeoSubtaskComment,
  insertSeoSubtaskFile,
  listSeoSubtasks,
  replaceAeoQueries,
  replaceKpis,
  replaceSources,
  saveSeoAccessRow,
  saveSeoProperty,
  seedStarterSubtasks,
  patchSeoProperty,
  updateSeoSubtask,
  writeAudit,
} from "./queries";
import {
  MASKED_VALUE,
  MAX_SEO_SUBTASKS,
  isApprovalStatus,
  isDepartment,
  isFaqStatus,
  isKpiDataStatus,
  isPriority,
  isSubtaskStatus,
  isWorkstream,
  normalizeStatus,
  normalizeSubtaskStatus,
  normalizeWorkstream,
  type SeoAeoView,
  type SeoApprovalStatus,
  type SeoKpiView,
  type SeoSourceView,
} from "./types";

const MAX_FILE_BYTES = 5 * 1024 * 1024;

const URL_RE = /^(#|\/|https?:\/\/)/i;

async function requireSeo() {
  const user = await requireUser();
  if (!canOpenSeo(user)) redirect("/crm?error=forbidden");
  await ensureSeoSchema();
  const access = await seoAccessFor(user);
  return { user, access };
}

function revalidateSeo() {
  revalidatePath("/crm");
  revalidatePath("/crm/seo");
  revalidatePath("/crm/seo/website");
  revalidatePath("/crm/seo/gbp");
  revalidatePath("/crm/seo/maps");
  revalidatePath("/crm/seo/aeo");
  revalidatePath("/crm/seo/reviews");
  revalidatePath("/crm/seo/contact");
  revalidatePath("/crm/seo/audit");
  revalidatePath("/crm/seo/reports");
  revalidatePath("/crm/seo/sources");
  revalidatePath("/crm/seo/settings");
  revalidatePath("/crm/seo/search-console");
  revalidatePath("/crm/seo/content");
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function optionalDate(value: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 19).replace("T", " ");
}

function parseJson<T>(value: string): T[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function validUrl(value: string) {
  return !value || URL_RE.test(value);
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
  const dir = join(process.cwd(), "private", "seo-ops", folder);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, name), buffer);
  return {
    filename: original,
    mime: file.type || "application/octet-stream",
    size: file.size,
    path: `private/seo-ops/${folder}/${name}`,
  };
}

async function syncSeoReadiness(propertyId: string, userId: string) {
  const rows = await prisma().$queryRawUnsafe<Record<string, unknown>[]>(
    `SELECT status, gbpApproval FROM SeoProperty WHERE id = ? LIMIT 1`,
    propertyId,
  );
  const row = rows[0];
  if (!row) return;
  const subtasks = await listSeoSubtasks(propertyId);
  const status = normalizeStatus(String(row.status ?? "draft"));
  const approval: SeoApprovalStatus = isApprovalStatus(String(row.gbpApproval ?? "")) ? String(row.gbpApproval) as SeoApprovalStatus : "not_requested";
  const progress = seoSubtaskProgress(
    subtasks.map((item) => ({ completed: Boolean(item.completed), status: String(item.status ?? "") })),
    status,
    approval,
  );
  if (shouldAwaitReview(status, progress)) {
    await patchSeoProperty(propertyId, { status: "ready_approval", gbpApproval: "awaiting" }, userId);
    await writeAudit(propertyId, userId, "readiness", "Subtasks 100% — Ready for review");
    return;
  }
  if (
    progress.readiness === "in_progress" &&
    (status === "draft" || status === "audit_scheduled" || status === "action_planned")
  ) {
    await patchSeoProperty(propertyId, { status: "in_progress" }, userId);
  }
}

export async function saveSeoWork(formData: FormData) {
  const { user, access } = await requireSeo();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const hotelName = text(formData, "hotelName");
  const businessName = text(formData, "businessName") || hotelName;
  if (!hotelName && !businessName) return { ok: false as const, error: "required" };

  const website = text(formData, "website");
  const gbpUrl = text(formData, "gbpUrl");
  const mapsUrl = text(formData, "mapsUrl");
  const bookingUrl = text(formData, "bookingUrl");
  const gbpWebsite = text(formData, "gbpWebsite");
  const gbpContactLink = text(formData, "gbpContactLink");
  if (![website, gbpUrl, mapsUrl, bookingUrl, gbpWebsite, gbpContactLink].every(validUrl)) {
    return { ok: false as const, error: "invalid" };
  }

  const workstream = normalizeWorkstream(text(formData, "workstream") || "visibility");
  const status = normalizeStatus(text(formData, "status") || "draft");
  const department = text(formData, "department");
  const priority = text(formData, "priority");
  const gbpApproval = text(formData, "gbpApproval");
  const gsc = text(formData, "gscPropertyRef");
  const google = text(formData, "googleAccountRef");

  let id = text(formData, "id");
  if (!id) {
    id = await createSeoProperty(access, hotelName || businessName, workstream);
  }

  const saved = await saveSeoProperty(
    id,
    {
      hotelName: hotelName || businessName,
      businessName,
      website,
      gbpUrl,
      mapsUrl,
      searchMarket: text(formData, "searchMarket"),
      language: text(formData, "language"),
      location: text(formData, "location"),
      primaryCategory: text(formData, "primaryCategory"),
      secondaryCategories: text(formData, "secondaryCategories"),
      status,
      ownerId: text(formData, "ownerId") || access.userId,
      department: isDepartment(department) ? department : "marketing",
      workstream: isWorkstream(workstream) ? workstream : "visibility",
      priority: isPriority(priority) ? priority : "normal",
      nextAction: text(formData, "nextAction"),
      nextActionAt: optionalDate(text(formData, "nextActionAt")),
      auditAt: optionalDate(text(formData, "auditAt")),
      notes: text(formData, "notes"),
      gscPropertyRef: gsc === MASKED_VALUE ? undefined : gsc,
      googleAccountRef: google === MASKED_VALUE ? undefined : google,
      contactPath: text(formData, "contactPath"),
      bookingUrl,
      reviewWorkflow: text(formData, "reviewWorkflow"),
      gbpName: text(formData, "gbpName") || businessName,
      gbpCategory: text(formData, "gbpCategory"),
      gbpAddress: text(formData, "gbpAddress"),
      gbpHours: text(formData, "gbpHours"),
      gbpPhone: text(formData, "gbpPhone"),
      gbpWebsite,
      gbpPhotos: text(formData, "gbpPhotos"),
      gbpServices: text(formData, "gbpServices"),
      gbpReviewWorkflow: text(formData, "gbpReviewWorkflow"),
      gbpContactLink,
      gbpApproval: isApprovalStatus(gbpApproval) ? gbpApproval : "not_requested",
    } as Record<string, string | null>,
    user.id,
    access.canSeePrivateIds,
  );
  if (!saved) return { ok: false as const, error: "missing" };

  const sources = parseJson<SeoSourceView>(text(formData, "sourcesJson")).map((item) => ({
    id: item.id || `src_${randomToken(8)}`,
    name: String(item.name ?? "").trim(),
    url: String(item.url ?? "").trim(),
    publishedAt: String(item.publishedAt ?? "").trim(),
    accessedAt: String(item.accessedAt ?? "").trim(),
    notes: String(item.notes ?? "").trim(),
  }));
  const aeoQueries = parseJson<SeoAeoView>(text(formData, "aeoJson")).map((item) => ({
    id: item.id || `aeo_${randomToken(8)}`,
    query: String(item.query ?? "").trim(),
    intent: String(item.intent ?? "").trim(),
    answerDraft: String(item.answerDraft ?? "").trim(),
    source: String(item.source ?? "").trim(),
    entityInfo: String(item.entityInfo ?? "").trim(),
    faqStatus: isFaqStatus(String(item.faqStatus ?? "")) ? item.faqStatus : "not_started",
    language: String(item.language ?? "").trim(),
    market: String(item.market ?? "").trim(),
    reviewStatus: isApprovalStatus(String(item.reviewStatus ?? "")) ? item.reviewStatus : "not_requested",
    publishedStatus: isFaqStatus(String(item.publishedStatus ?? "")) ? item.publishedStatus : "not_started",
  }));
  const kpis = parseJson<SeoKpiView>(text(formData, "kpisJson")).map((item) => ({
    id: item.id || `kpi_${randomToken(8)}`,
    name: String(item.name ?? "").trim(),
    period: String(item.period ?? "").trim(),
    value: String(item.value ?? "").trim(),
    definition: String(item.definition ?? "").trim(),
    source: String(item.source ?? "").trim(),
    dataStatus: isKpiDataStatus(String(item.dataStatus ?? "")) ? item.dataStatus : "draft",
    market: String(item.market ?? "").trim(),
  }));

  await replaceSources(id, sources.filter((item) => item.name || item.url));
  await replaceAeoQueries(id, aeoQueries.filter((item) => item.query));
  await replaceKpis(id, kpis.filter((item) => item.name));
  await seedStarterSubtasks(id, user.id);
  await writeAudit(id, user.id, "save", `Updated ${hotelName || businessName}`);
  revalidateSeo();
  return { ok: true as const, id };
}

export async function createSeoWork(formData: FormData) {
  const { access } = await requireSeo();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const hotelName = text(formData, "hotelName");
  if (!hotelName) return { ok: false as const, error: "required" };
  const id = await createSeoProperty(access, hotelName, text(formData, "workstream"));
  revalidateSeo();
  return { ok: true as const, id };
}

export async function updateSeoWork(formData: FormData) {
  return saveSeoWork(formData);
}

export async function removeSeoWork(formData: FormData) {
  const { user, access } = await requireSeo();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "delete", "Deleted record");
  await deleteSeoProperty(id);
  revalidateSeo();
  return { ok: true as const, id };
}

export async function changeSeoStatus(formData: FormData) {
  const { user, access } = await requireSeo();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const status = normalizeStatus(text(formData, "status"));
  if (!id) return { ok: false as const, error: "missing" };
  const saved = await patchSeoProperty(id, { status }, user.id);
  if (!saved) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "status", `Status → ${status}`);
  revalidateSeo();
  return { ok: true as const, id };
}

export async function assignSeoWork(formData: FormData) {
  const { user, access } = await requireSeo();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const ownerId = text(formData, "ownerId");
  if (!id) return { ok: false as const, error: "missing" };
  const saved = await patchSeoProperty(id, { ownerId }, user.id);
  if (!saved) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "assign", `Assigned owner ${ownerId || "unassigned"}`);
  revalidateSeo();
  return { ok: true as const, id };
}

export async function changeSeoDepartment(formData: FormData) {
  const { user, access } = await requireSeo();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const department = text(formData, "department");
  if (!id || !isDepartment(department)) return { ok: false as const, error: "invalid" };
  const saved = await patchSeoProperty(id, { department }, user.id);
  if (!saved) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "department", `Department → ${department}`);
  revalidateSeo();
  return { ok: true as const, id };
}

export async function saveSeoAccess(formData: FormData) {
  const { access } = await requireSeo();
  if (!access.canManageSettings) return { ok: false as const, error: "forbidden" };
  const userId = text(formData, "userId");
  const department = text(formData, "department");
  if (!userId || !isDepartment(department)) return { ok: false as const, error: "invalid" };
  const id = await saveSeoAccessRow(userId, department, formData.get("canSeePrivateIds") === "1");
  revalidateSeo();
  return { ok: true as const, id };
}

export async function deleteSeoAccess(formData: FormData) {
  const { access } = await requireSeo();
  if (!access.canManageSettings) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  await deleteSeoAccessRow(id);
  revalidateSeo();
  return { ok: true as const, id };
}

export async function escalateSeoWork(formData: FormData) {
  const { user, access } = await requireSeo();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  const saved = await patchSeoProperty(
    id,
    { department: "management", status: "ready_approval", gbpApproval: "awaiting", escalatedAt: optionalDate(new Date().toISOString()) },
    user.id,
  );
  if (!saved) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "escalate", "Escalated to Management");
  revalidateSeo();
  return { ok: true as const, id };
}

export async function closeSeoWork(formData: FormData) {
  const { user, access } = await requireSeo();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  const saved = await patchSeoProperty(id, { status: "completed", closedAt: optionalDate(new Date().toISOString()) }, user.id);
  if (!saved) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "close", "Closed audit/action");
  revalidateSeo();
  return { ok: true as const, id };
}

export async function saveSeoSubtask(formData: FormData) {
  const { user, access } = await requireSeo();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const propertyId = text(formData, "propertyId");
  const name = text(formData, "name");
  if (!propertyId || !name) return { ok: false as const, error: "missing_name" };
  const department = text(formData, "department");
  const status = normalizeSubtaskStatus(text(formData, "status"));
  const completed = formData.get("completed") === "1" || status === "completed";
  const nextStatus = completed ? "completed" : status;
  const priority = text(formData, "priority");
  const payload = {
    name,
    department: isDepartment(department) ? department : "marketing",
    ownerId: text(formData, "ownerId") || user.id,
    status: isSubtaskStatus(nextStatus) ? nextStatus : "not_started",
    completed,
    dueAt: optionalDate(text(formData, "dueAt")),
    priority: isPriority(priority) ? priority : "normal",
    comments: text(formData, "comments"),
    source: text(formData, "source"),
  };
  if (id) {
    await updateSeoSubtask(id, payload);
    await syncSeoReadiness(propertyId, user.id);
    await writeAudit(propertyId, user.id, "subtask", `Updated ${name}`);
    revalidateSeo();
    return { ok: true as const, id };
  }
  const count = await countSeoSubtasks(propertyId);
  if (count >= MAX_SEO_SUBTASKS) return { ok: false as const, error: "subtask_limit" };
  const savedId = await insertSeoSubtask({ ...payload, propertyId, userId: user.id });
  await syncSeoReadiness(propertyId, user.id);
  await writeAudit(propertyId, user.id, "subtask", `Added ${name}`);
  revalidateSeo();
  return { ok: true as const, id: savedId };
}

export async function completeSeoSubtask(formData: FormData) {
  const { user, access } = await requireSeo();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const existing = id ? await getSeoSubtask(id) : null;
  if (!existing) return { ok: false as const, error: "missing" };
  const flag = formData.get("completed");
  const completed = flag === "0" ? false : flag === "1" ? true : !existing.completed;
  const currentStatus = String(existing.status ?? "not_started");
  await updateSeoSubtask(id, {
    name: String(existing.name ?? ""),
    department: String(existing.department ?? "marketing"),
    ownerId: String(existing.ownerId ?? ""),
    status: completed ? "completed" : currentStatus === "completed" ? "not_started" : currentStatus,
    completed,
    dueAt: existing.dueAt ? optionalDate(String(existing.dueAt)) : null,
    priority: String(existing.priority ?? "normal"),
    comments: String(existing.comments ?? ""),
    source: String(existing.source ?? ""),
  });
  const propertyId = String(existing.propertyId ?? "");
  await syncSeoReadiness(propertyId, user.id);
  await writeAudit(propertyId, user.id, "subtask", completed ? `Completed ${existing.name}` : `Reopened ${existing.name}`);
  revalidateSeo();
  return { ok: true as const, id };
}

export async function addSeoSubtaskComment(formData: FormData) {
  const { user, access } = await requireSeo();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const subtaskId = text(formData, "subtaskId");
  const body = text(formData, "body");
  if (!subtaskId || !body) return { ok: false as const, error: "missing_comment" };
  const existing = await getSeoSubtask(subtaskId);
  if (!existing) return { ok: false as const, error: "missing" };
  const savedId = await insertSeoSubtaskComment(subtaskId, user.id, body);
  await writeAudit(String(existing.propertyId ?? ""), user.id, "comment", `Comment on ${existing.name}`);
  revalidateSeo();
  return { ok: true as const, id: savedId };
}

export async function attachSeoSubtaskFile(formData: FormData) {
  const { user, access } = await requireSeo();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const subtaskId = text(formData, "subtaskId");
  const file = formData.get("file");
  if (!subtaskId || !(file instanceof File) || !file.size) return { ok: false as const, error: "missing_file" };
  const existing = await getSeoSubtask(subtaskId);
  if (!existing) return { ok: false as const, error: "missing" };
  const stored = await storePrivateFile(file, "subtasks");
  if (!stored || "error" in stored) return { ok: false as const, error: stored?.error || "invalid_file" };
  const savedId = await insertSeoSubtaskFile({
    subtaskId,
    filename: stored.filename,
    mime: stored.mime,
    size: stored.size,
    path: stored.path,
    caption: text(formData, "caption"),
    userId: user.id,
  });
  await writeAudit(String(existing.propertyId ?? ""), user.id, "file", `Attached ${stored.filename} to ${existing.name}`);
  revalidateSeo();
  return { ok: true as const, id: savedId };
}

export async function addSeoSource(formData: FormData) {
  const { user, access } = await requireSeo();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const propertyId = text(formData, "propertyId");
  const name = text(formData, "name") || text(formData, "url");
  const url = text(formData, "url");
  if (!propertyId || (!name && !url)) return { ok: false as const, error: "invalid" };
  if (url && !validUrl(url)) return { ok: false as const, error: "invalid" };
  const id = await insertSeoSource(propertyId, { name, url, notes: text(formData, "notes") });
  await writeAudit(propertyId, user.id, "source", `Added source ${name || url}`);
  revalidateSeo();
  return { ok: true as const, id };
}
