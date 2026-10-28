"use server";

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import { randomToken } from "@/lib/crm/security";
import { canOpenWebsite, websiteAccessFor } from "./access";
import { ensureWebsiteSchema } from "./ensure";
import {
  appendWebsiteApproval,
  countWebsiteSubtasks,
  createWebsiteProject,
  deleteWebsiteAccessRow,
  deleteWebsiteProject,
  deleteWebsiteSubtask,
  getWebsiteSubtask,
  insertWebsiteSubtask,
  insertWebsiteSubtaskComment,
  insertWebsiteSubtaskFile,
  patchWebsiteProject,
  replaceKpis,
  replaceSources,
  saveWebsiteAccessRow,
  saveWebsiteProject,
  seedStarterSubtasks,
  updateWebsiteSubtask,
  writeAudit,
} from "./queries";
import {
  MASKED_VALUE,
  MAX_WEB_SUBTASKS,
  MIN_WEB_SUBTASKS,
  isApprovalStatus,
  isBudgetStatus,
  isDepartment,
  isKpiDataStatus,
  isPriority,
  isProjectType,
  isReadiness,
  isWorkstream,
  normalizeProjectType,
  normalizeReadiness,
  normalizeStatus,
  normalizeSubtaskStatus,
  normalizeWorkstream,
  type WebKpiView,
  type WebSourceView,
} from "./types";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const URL_RE = /^(#|\/|https?:\/\/)/i;

async function requireWebsite() {
  const user = await requireUser();
  if (!canOpenWebsite(user)) redirect("/crm?error=forbidden");
  await ensureWebsiteSchema();
  const access = await websiteAccessFor(user);
  return { user, access };
}

function revalidateWebsite() {
  revalidatePath("/crm");
  revalidatePath("/crm/website");
  revalidatePath("/crm/website/discovery");
  revalidatePath("/crm/website/ux");
  revalidatePath("/crm/website/cms");
  revalidatePath("/crm/website/booking");
  revalidatePath("/crm/website/tracking");
  revalidatePath("/crm/website/seo");
  revalidatePath("/crm/website/qa");
  revalidatePath("/crm/website/reports");
  revalidatePath("/crm/website/approvals");
  revalidatePath("/crm/website/handover");
  revalidatePath("/crm/website/measure");
  revalidatePath("/crm/website/settings");
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
  const dir = join(process.cwd(), "private", "website-ops", folder);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, name), buffer);
  return {
    filename: original,
    mime: file.type || "application/octet-stream",
    size: file.size,
    path: `private/website-ops/${folder}/${name}`,
  };
}

export async function saveWebsiteWork(formData: FormData) {
  const { user, access } = await requireWebsite();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const hotelName = text(formData, "hotelName");
  const projectName = text(formData, "projectName") || hotelName;
  if (!hotelName && !projectName) return { ok: false as const, error: "required" };
  const currentUrl = text(formData, "currentUrl");
  const bookingEngineUrl = text(formData, "bookingEngineUrl");
  if (!validUrl(currentUrl) || !validUrl(bookingEngineUrl)) return { ok: false as const, error: "invalid" };

  const workstream = normalizeWorkstream(text(formData, "workstream") || "project");
  const status = normalizeStatus(text(formData, "status") || "draft");
  const department = text(formData, "department");
  const priority = text(formData, "priority");
  const projectType = normalizeProjectType(text(formData, "projectType") || text(formData, "improveOrRebuild"));
  const engineRef = text(formData, "engineAccountRef");
  const analyticsRef = text(formData, "analyticsRef");

  let id = text(formData, "id");
  if (!id) id = await createWebsiteProject(access, hotelName || projectName, workstream);

  const saved = await saveWebsiteProject(
    id,
    {
      projectName,
      hotelName: hotelName || projectName,
      currentUrl,
      bookingEngine: text(formData, "bookingEngine"),
      bookingEngineUrl,
      cmsType: text(formData, "cmsType"),
      projectType: isProjectType(projectType) ? projectType : "improve_existing",
      primaryGoal: text(formData, "primaryGoal"),
      targetMarket: text(formData, "targetMarket"),
      languages: text(formData, "languages"),
      startDate: optionalDate(text(formData, "startDate")),
      launchDate: optionalDate(text(formData, "launchDate")),
      mobileReady: text(formData, "mobileStatus") || text(formData, "mobileReady"),
      improveOrRebuild: projectType,
      status,
      ownerId: text(formData, "ownerId") || access.userId,
      department: isDepartment(department) ? department : "marketing",
      workstream: isWorkstream(workstream) ? workstream : "project",
      priority: isPriority(priority) ? priority : "normal",
      nextAction: text(formData, "nextAction"),
      nextActionAt: optionalDate(text(formData, "nextActionAt")),
      notes: text(formData, "notes"),
      budgetStatus: isBudgetStatus(text(formData, "budgetStatus")) ? text(formData, "budgetStatus") : "not_set",
      trackingStatus: isReadiness(text(formData, "trackingStatus")) ? text(formData, "trackingStatus") : "not_started",
      seoStatus: isReadiness(text(formData, "seoStatus")) ? text(formData, "seoStatus") : "not_started",
      mobileStatus: normalizeReadiness(text(formData, "mobileStatus") || text(formData, "mobileReady")),
      handoverStatus: isReadiness(text(formData, "handoverStatus")) ? text(formData, "handoverStatus") : "not_started",
      engineAccountRef: engineRef === MASKED_VALUE ? undefined : engineRef,
      analyticsRef: analyticsRef === MASKED_VALUE ? undefined : analyticsRef,
      cmsOwner: text(formData, "cmsOwner"),
      sourceCodeOwner: text(formData, "sourceCodeOwner"),
      domainOwner: text(formData, "domainOwner"),
      hostingOwner: text(formData, "hostingOwner"),
      analyticsOwner: text(formData, "analyticsOwner"),
      bookingEngineOwner: text(formData, "bookingEngineOwner"),
      discoveryJson: formData.has("discoveryJson") ? text(formData, "discoveryJson") : undefined,
      sitemapJson: formData.has("sitemapJson") ? text(formData, "sitemapJson") : undefined,
      uxJson: formData.has("uxJson") ? text(formData, "uxJson") : undefined,
      cmsJson: formData.has("cmsJson") ? text(formData, "cmsJson") : undefined,
      bookingJson: formData.has("bookingJson") ? text(formData, "bookingJson") : undefined,
      trackingJson: formData.has("trackingJson") ? text(formData, "trackingJson") : undefined,
      seoJson: formData.has("seoJson") ? text(formData, "seoJson") : undefined,
      qaJson: formData.has("qaJson") ? text(formData, "qaJson") : undefined,
      handoverJson: formData.has("handoverJson") ? text(formData, "handoverJson") : undefined,
      filesJson: formData.has("filesJson") ? text(formData, "filesJson") : undefined,
      decisionsJson: formData.has("decisionsJson") ? text(formData, "decisionsJson") : undefined,
      approvalsJson: formData.has("approvalsJson") ? text(formData, "approvalsJson") : undefined,
    },
    user.id,
    access.canSeePrivateIds,
  );
  if (!saved) return { ok: false as const, error: "missing" };

  const sources = parseJson<WebSourceView>(text(formData, "sourcesJson")).map((item) => ({
    id: item.id || `wsrc_${randomToken(8)}`,
    name: String(item.name ?? "").trim(),
    url: String(item.url ?? "").trim(),
    publishedAt: String(item.publishedAt ?? "").trim(),
    accessedAt: String(item.accessedAt ?? "").trim(),
    notes: String(item.notes ?? "").trim(),
  }));
  const kpis = parseJson<WebKpiView>(text(formData, "kpisJson")).map((item) => ({
    id: item.id || `wkpi_${randomToken(8)}`,
    name: String(item.name ?? "").trim(),
    period: String(item.period ?? "").trim(),
    value: String(item.value ?? "").trim(),
    definition: String(item.definition ?? "").trim(),
    source: String(item.source ?? "").trim(),
    dataStatus: isKpiDataStatus(String(item.dataStatus ?? "")) ? item.dataStatus : "draft",
    market: String(item.market ?? "").trim(),
  }));
  await replaceSources(id, sources.filter((item) => item.name || item.url));
  await replaceKpis(id, kpis.filter((item) => item.name));
  await seedStarterSubtasks(id, user.id);
  await writeAudit(id, user.id, "save", `Updated ${hotelName}`);
  revalidateWebsite();
  return { ok: true as const, id };
}

export async function removeWebsiteWork(formData: FormData) {
  const { user, access } = await requireWebsite();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "delete", "Deleted record");
  await deleteWebsiteProject(id);
  revalidateWebsite();
  return { ok: true as const, id };
}

export async function changeWebsiteStatus(formData: FormData) {
  const { user, access } = await requireWebsite();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  const status = normalizeStatus(text(formData, "status"));
  const saved = await patchWebsiteProject(id, { status }, user.id);
  if (!saved) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "status", `Status → ${status}`);
  revalidateWebsite();
  return { ok: true as const, id };
}

export async function assignWebsiteWork(formData: FormData) {
  const { user, access } = await requireWebsite();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  const ownerId = text(formData, "ownerId");
  const saved = await patchWebsiteProject(id, { ownerId }, user.id);
  if (!saved) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "assign", `Assigned owner ${ownerId || "unassigned"}`);
  revalidateWebsite();
  return { ok: true as const, id };
}

export async function changeWebsiteDepartment(formData: FormData) {
  const { user, access } = await requireWebsite();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const department = text(formData, "department");
  if (!id || !isDepartment(department)) return { ok: false as const, error: "invalid" };
  const saved = await patchWebsiteProject(id, { department }, user.id);
  if (!saved) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "department", `Department → ${department}`);
  revalidateWebsite();
  return { ok: true as const, id };
}

export async function escalateWebsiteWork(formData: FormData) {
  const { user, access } = await requireWebsite();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  const saved = await patchWebsiteProject(id, { department: "management", status: "awaiting_hotel_approval" }, user.id);
  if (!saved) return { ok: false as const, error: "missing" };
  await appendWebsiteApproval(id, {
    kind: "Launch approval",
    status: "awaiting",
    notes: text(formData, "notes") || "Escalated to Management",
    requestedBy: user.id,
  });
  await writeAudit(id, user.id, "escalate", "Escalated to Management");
  revalidateWebsite();
  return { ok: true as const, id };
}

export async function addWebsiteApprovalNote(formData: FormData) {
  const { user, access } = await requireWebsite();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const notes = text(formData, "notes");
  if (!id) return { ok: false as const, error: "missing" };
  if (!notes) return { ok: false as const, error: "missing_note" };
  const status = text(formData, "status");
  const saved = await appendWebsiteApproval(id, {
    kind: text(formData, "kind") || "Approval note",
    status: isApprovalStatus(status) ? status : "awaiting",
    notes,
    requestedBy: user.id,
    decidedBy: text(formData, "decidedBy"),
  });
  if (!saved) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "approval", notes.slice(0, 120));
  revalidateWebsite();
  return { ok: true as const, id };
}

export async function closeWebsiteWork(formData: FormData) {
  const { user, access } = await requireWebsite();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  const saved = await patchWebsiteProject(id, { status: "archived" }, user.id);
  if (!saved) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "close", "Archived website project");
  revalidateWebsite();
  return { ok: true as const, id };
}

export async function removeWebsiteSubtask(formData: FormData) {
  const { user, access } = await requireWebsite();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  const row = await getWebsiteSubtask(id);
  if (!row) return { ok: false as const, error: "missing" };
  const remaining = await countWebsiteSubtasks(String(row.propertyId ?? ""));
  if (remaining <= MIN_WEB_SUBTASKS) return { ok: false as const, error: "subtask_min" };
  await deleteWebsiteSubtask(id);
  await writeAudit(String(row.propertyId ?? ""), user.id, "subtask", `Deleted ${String(row.name ?? "")}`);
  revalidateWebsite();
  return { ok: true as const, id };
}

export async function saveWebsiteAccess(formData: FormData) {
  const { access } = await requireWebsite();
  if (!access.canManageSettings) return { ok: false as const, error: "forbidden" };
  const userId = text(formData, "userId");
  const department = text(formData, "department");
  if (!userId || !isDepartment(department)) return { ok: false as const, error: "invalid" };
  const id = await saveWebsiteAccessRow(userId, department, formData.get("canSeePrivateIds") === "1");
  revalidateWebsite();
  return { ok: true as const, id };
}

export async function deleteWebsiteAccess(formData: FormData) {
  const { access } = await requireWebsite();
  if (!access.canManageSettings) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  await deleteWebsiteAccessRow(id);
  revalidateWebsite();
  return { ok: true as const, id };
}

export async function saveWebsiteSubtask(formData: FormData) {
  const { user, access } = await requireWebsite();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const propertyId = text(formData, "propertyId");
  const name = text(formData, "name");
  if (!propertyId || !name) return { ok: false as const, error: "missing_name" };
  const status = normalizeSubtaskStatus(text(formData, "status"));
  const payload = {
    name,
    department: isDepartment(text(formData, "department")) ? text(formData, "department") : "marketing",
    ownerId: text(formData, "ownerId") || user.id,
    status,
    completed: status === "completed" || formData.get("completed") === "1",
    dueAt: optionalDate(text(formData, "dueAt")),
    priority: isPriority(text(formData, "priority")) ? text(formData, "priority") : "normal",
    comments: text(formData, "comments"),
    source: text(formData, "source"),
  };
  let id = text(formData, "id");
  if (!id) {
    const count = await countWebsiteSubtasks(propertyId);
    if (count >= MAX_WEB_SUBTASKS) return { ok: false as const, error: "subtask_limit" };
    id = await insertWebsiteSubtask({ ...payload, propertyId, userId: user.id });
  } else {
    await updateWebsiteSubtask(id, payload);
  }
  await writeAudit(propertyId, user.id, "subtask", `Subtask ${name}`);
  revalidateWebsite();
  return { ok: true as const, id };
}

export async function addWebsiteSubtaskComment(formData: FormData) {
  const { user, access } = await requireWebsite();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const body = text(formData, "body");
  if (!id) return { ok: false as const, error: "missing" };
  if (!body) return { ok: false as const, error: "missing_comment" };
  const row = await getWebsiteSubtask(id);
  if (!row) return { ok: false as const, error: "missing" };
  await insertWebsiteSubtaskComment(id, user.id, body);
  await writeAudit(String(row.propertyId ?? ""), user.id, "comment", body.slice(0, 120));
  revalidateWebsite();
  return { ok: true as const, id };
}

export async function attachWebsiteSubtaskFile(formData: FormData) {
  const { user, access } = await requireWebsite();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const file = formData.get("file");
  if (!id) return { ok: false as const, error: "missing" };
  if (!(file instanceof File) || !file.size) return { ok: false as const, error: "missing_file" };
  const stored = await storePrivateFile(file, id);
  if (!stored || "error" in stored) return { ok: false as const, error: stored?.error || "invalid_file" };
  const row = await getWebsiteSubtask(id);
  if (!row) return { ok: false as const, error: "missing" };
  await insertWebsiteSubtaskFile({
    subtaskId: id,
    filename: stored.filename,
    mime: stored.mime,
    size: stored.size,
    path: stored.path,
    caption: text(formData, "caption"),
    userId: user.id,
  });
  await writeAudit(String(row.propertyId ?? ""), user.id, "file", stored.filename);
  revalidateWebsite();
  return { ok: true as const, id };
}

export async function completeWebsiteSubtask(formData: FormData) {
  const done = formData.get("completed") !== "0";
  const id = text(formData, "id");
  const existing = id ? await getWebsiteSubtask(id) : null;
  if (existing) {
    if (!text(formData, "propertyId")) formData.set("propertyId", String(existing.propertyId ?? ""));
    if (!text(formData, "name")) formData.set("name", String(existing.name ?? ""));
    if (!text(formData, "department")) formData.set("department", String(existing.department ?? "marketing"));
    if (!text(formData, "ownerId")) formData.set("ownerId", String(existing.ownerId ?? ""));
    if (!text(formData, "priority")) formData.set("priority", String(existing.priority ?? "normal"));
    if (!text(formData, "comments")) formData.set("comments", String(existing.comments ?? ""));
    if (!text(formData, "source")) formData.set("source", String(existing.source ?? ""));
  }
  formData.set("status", done ? "completed" : "not_started");
  formData.set("completed", done ? "1" : "0");
  return saveWebsiteSubtask(formData);
}
