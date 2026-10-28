"use server";

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import { randomToken } from "@/lib/crm/security";
import { canOpenConversion, conversionAccessFor } from "./access";
import { ensureConversionSchema } from "./ensure";
import {
  appendConversionApproval,
  countConversionSubtasks,
  createConversionProject,
  deleteConversionAccessRow,
  deleteConversionProject,
  deleteConversionSubtask,
  getConversionSubtask,
  insertConversionSubtask,
  insertConversionSubtaskComment,
  insertConversionSubtaskFile,
  patchConversionProject,
  replaceKpis,
  replaceSources,
  saveConversionAccessRow,
  saveConversionProject,
  seedStarterSubtasks,
  updateConversionSubtask,
  writeAudit,
} from "./queries";
import {
  MASKED_VALUE,
  MAX_CONV_SUBTASKS,
  MIN_CONV_SUBTASKS,
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
  type ConvKpiView,
  type ConvSourceView,
} from "./types";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const URL_RE = /^(#|\/|https?:\/\/)/i;

async function requireConversion() {
  const user = await requireUser();
  if (!canOpenConversion(user)) redirect("/crm?error=forbidden");
  await ensureConversionSchema();
  const access = await conversionAccessFor(user);
  return { user, access };
}

function revalidateConversion() {
  revalidatePath("/crm");
  revalidatePath("/crm/conversion");
  revalidatePath("/crm/conversion/review");
  revalidatePath("/crm/conversion/room");
  revalidatePath("/crm/conversion/friction");
  revalidatePath("/crm/conversion/booking");
  revalidatePath("/crm/conversion/mobile");
  revalidatePath("/crm/conversion/tracking");
  revalidatePath("/crm/conversion/experiments");
  revalidatePath("/crm/conversion/reports");
  revalidatePath("/crm/conversion/approvals");
  revalidatePath("/crm/conversion/handover");
  revalidatePath("/crm/conversion/settings");
  revalidatePath("/crm/conversion/message");
  revalidatePath("/crm/conversion/price");
  revalidatePath("/crm/conversion/optimize");
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
  const dir = join(process.cwd(), "private", "conversion-ops", folder);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, name), buffer);
  return {
    filename: original,
    mime: file.type || "application/octet-stream",
    size: file.size,
    path: `private/conversion-ops/${folder}/${name}`,
  };
}

export async function saveWebsiteWork(formData: FormData) {
  const { user, access } = await requireConversion();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const hotelName = text(formData, "hotelName");
  const projectName = text(formData, "projectName") || hotelName;
  if (!hotelName && !projectName) return { ok: false as const, error: "required" };
  const currentUrl = text(formData, "currentUrl");
  const bookingEngineUrl = text(formData, "bookingEngineUrl");
  if (!validUrl(currentUrl) || !validUrl(bookingEngineUrl)) return { ok: false as const, error: "invalid" };
  if (formData.has("frictionJson")) {
    const friction = parseJson<{ evidence?: string }>(text(formData, "frictionJson"));
    if (
      friction.some((item) => {
        const evidence = String(item.evidence ?? "").trim();
        return Boolean(evidence && /:\/\//.test(evidence) && !validUrl(evidence));
      })
    ) {
      return { ok: false as const, error: "invalid_url" };
    }
  }

  const workstream = normalizeWorkstream(text(formData, "workstream") || "project");
  const status = normalizeStatus(text(formData, "status") || "draft");
  const department = text(formData, "department");
  const priority = text(formData, "priority");
  const projectType = normalizeProjectType(text(formData, "projectType") || text(formData, "improveOrRebuild"));
  const engineRef = text(formData, "engineAccountRef");
  const analyticsRef = text(formData, "analyticsRef");

  let id = text(formData, "id");
  if (!id) id = await createConversionProject(access, hotelName || projectName, workstream);

  const saved = await saveConversionProject(
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
      analyticsStatus: isReadiness(text(formData, "analyticsStatus") || text(formData, "trackingStatus")) ? text(formData, "analyticsStatus") || text(formData, "trackingStatus") : "not_started",
      engineTrackingStatus: isReadiness(text(formData, "engineTrackingStatus")) ? text(formData, "engineTrackingStatus") : "not_started",
      primaryKpi: text(formData, "primaryKpi"),
      kpiTarget: text(formData, "kpiTarget"),
      hotelApprover: text(formData, "hotelApprover"),
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
      frictionJson: formData.has("frictionJson") ? text(formData, "frictionJson") : undefined,
      engineJson: formData.has("engineJson") ? text(formData, "engineJson") : undefined,
    },
    user.id,
    access.canSeePrivateIds,
  );
  if (!saved) return { ok: false as const, error: "missing" };

  const sources = parseJson<ConvSourceView>(text(formData, "sourcesJson")).map((item) => ({
    id: item.id || `wsrc_${randomToken(8)}`,
    name: String(item.name ?? "").trim(),
    url: String(item.url ?? "").trim(),
    publishedAt: String(item.publishedAt ?? "").trim(),
    accessedAt: String(item.accessedAt ?? "").trim(),
    notes: String(item.notes ?? "").trim(),
  }));
  const kpis = parseJson<ConvKpiView>(text(formData, "kpisJson")).map((item) => ({
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
  revalidateConversion();
  return { ok: true as const, id };
}

export async function removeWebsiteWork(formData: FormData) {
  const { user, access } = await requireConversion();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "delete", "Deleted record");
  await deleteConversionProject(id);
  revalidateConversion();
  return { ok: true as const, id };
}

export async function changeWebsiteStatus(formData: FormData) {
  const { user, access } = await requireConversion();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  const status = normalizeStatus(text(formData, "status"));
  const saved = await patchConversionProject(id, { status }, user.id);
  if (!saved) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "status", `Status → ${status}`);
  revalidateConversion();
  return { ok: true as const, id };
}

export async function assignWebsiteWork(formData: FormData) {
  const { user, access } = await requireConversion();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  const ownerId = text(formData, "ownerId");
  const saved = await patchConversionProject(id, { ownerId }, user.id);
  if (!saved) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "assign", `Assigned owner ${ownerId || "unassigned"}`);
  revalidateConversion();
  return { ok: true as const, id };
}

export async function changeWebsiteDepartment(formData: FormData) {
  const { user, access } = await requireConversion();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const department = text(formData, "department");
  if (!id || !isDepartment(department)) return { ok: false as const, error: "invalid" };
  const saved = await patchConversionProject(id, { department }, user.id);
  if (!saved) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "department", `Department → ${department}`);
  revalidateConversion();
  return { ok: true as const, id };
}

export async function escalateWebsiteWork(formData: FormData) {
  const { user, access } = await requireConversion();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  const saved = await patchConversionProject(id, { department: "management", status: "awaiting_approval" }, user.id);
  if (!saved) return { ok: false as const, error: "missing" };
  await appendConversionApproval(id, {
    kind: "Hotel approval",
    status: "awaiting",
    notes: text(formData, "notes") || "Escalated to Management",
    requestedBy: user.id,
  });
  await writeAudit(id, user.id, "escalate", "Escalated to Management");
  revalidateConversion();
  return { ok: true as const, id };
}

export async function addWebsiteApprovalNote(formData: FormData) {
  const { user, access } = await requireConversion();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const notes = text(formData, "notes");
  if (!id) return { ok: false as const, error: "missing" };
  if (!notes) return { ok: false as const, error: "missing_note" };
  const status = text(formData, "status");
  const saved = await appendConversionApproval(id, {
    kind: text(formData, "kind") || "Approval note",
    status: isApprovalStatus(status) ? status : "awaiting",
    notes,
    requestedBy: user.id,
    decidedBy: text(formData, "decidedBy"),
  });
  if (!saved) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "approval", notes.slice(0, 120));
  revalidateConversion();
  return { ok: true as const, id };
}

export async function closeWebsiteWork(formData: FormData) {
  const { user, access } = await requireConversion();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  const saved = await patchConversionProject(id, { status: "archived" }, user.id);
  if (!saved) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "close", "Archived Direct Booking project");
  revalidateConversion();
  return { ok: true as const, id };
}

export async function removeConversionSubtask(formData: FormData) {
  const { user, access } = await requireConversion();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  const row = await getConversionSubtask(id);
  if (!row) return { ok: false as const, error: "missing" };
  const remaining = await countConversionSubtasks(String(row.propertyId ?? ""));
  if (remaining <= MIN_CONV_SUBTASKS) return { ok: false as const, error: "subtask_min" };
  await deleteConversionSubtask(id);
  await writeAudit(String(row.propertyId ?? ""), user.id, "subtask", `Deleted ${String(row.name ?? "")}`);
  revalidateConversion();
  return { ok: true as const, id };
}

export async function saveConversionAccess(formData: FormData) {
  const { access } = await requireConversion();
  if (!access.canManageSettings) return { ok: false as const, error: "forbidden" };
  const userId = text(formData, "userId");
  const department = text(formData, "department");
  if (!userId || !isDepartment(department)) return { ok: false as const, error: "invalid" };
  const id = await saveConversionAccessRow(userId, department, formData.get("canSeePrivateIds") === "1");
  revalidateConversion();
  return { ok: true as const, id };
}

export async function deleteConversionAccess(formData: FormData) {
  const { access } = await requireConversion();
  if (!access.canManageSettings) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  await deleteConversionAccessRow(id);
  revalidateConversion();
  return { ok: true as const, id };
}

export async function saveConversionSubtask(formData: FormData) {
  const { user, access } = await requireConversion();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const propertyId = text(formData, "propertyId");
  const name = text(formData, "name");
  if (!propertyId || !name) return { ok: false as const, error: "missing_name" };
  const status = normalizeSubtaskStatus(text(formData, "status"));
  const source = text(formData, "source");
  if (source && /:\/\//.test(source) && !validUrl(source)) return { ok: false as const, error: "invalid_url" };
  const payload = {
    name,
    department: isDepartment(text(formData, "department")) ? text(formData, "department") : "marketing",
    ownerId: text(formData, "ownerId") || user.id,
    status,
    completed: status === "completed" || formData.get("completed") === "1",
    dueAt: optionalDate(text(formData, "dueAt")),
    priority: isPriority(text(formData, "priority")) ? text(formData, "priority") : "normal",
    comments: text(formData, "comments"),
    source,
  };
  let id = text(formData, "id");
  if (!id) {
    const count = await countConversionSubtasks(propertyId);
    if (count >= MAX_CONV_SUBTASKS) return { ok: false as const, error: "subtask_limit" };
    id = await insertConversionSubtask({ ...payload, propertyId, userId: user.id });
  } else {
    await updateConversionSubtask(id, payload);
  }
  await writeAudit(propertyId, user.id, "subtask", `Subtask ${name}`);
  revalidateConversion();
  return { ok: true as const, id };
}

export async function addConversionSubtaskComment(formData: FormData) {
  const { user, access } = await requireConversion();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const body = text(formData, "body");
  if (!id) return { ok: false as const, error: "missing" };
  if (!body) return { ok: false as const, error: "missing_comment" };
  const row = await getConversionSubtask(id);
  if (!row) return { ok: false as const, error: "missing" };
  await insertConversionSubtaskComment(id, user.id, body);
  await writeAudit(String(row.propertyId ?? ""), user.id, "comment", body.slice(0, 120));
  revalidateConversion();
  return { ok: true as const, id };
}

export async function attachConversionSubtaskFile(formData: FormData) {
  const { user, access } = await requireConversion();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const file = formData.get("file");
  if (!id) return { ok: false as const, error: "missing" };
  if (!(file instanceof File) || !file.size) return { ok: false as const, error: "missing_file" };
  const stored = await storePrivateFile(file, id);
  if (!stored || "error" in stored) return { ok: false as const, error: stored?.error || "invalid_file" };
  const row = await getConversionSubtask(id);
  if (!row) return { ok: false as const, error: "missing" };
  await insertConversionSubtaskFile({
    subtaskId: id,
    filename: stored.filename,
    mime: stored.mime,
    size: stored.size,
    path: stored.path,
    caption: text(formData, "caption"),
    userId: user.id,
  });
  await writeAudit(String(row.propertyId ?? ""), user.id, "file", stored.filename);
  revalidateConversion();
  return { ok: true as const, id };
}

export async function completeConversionSubtask(formData: FormData) {
  const done = formData.get("completed") !== "0";
  const id = text(formData, "id");
  const existing = id ? await getConversionSubtask(id) : null;
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
  return saveConversionSubtask(formData);
}
