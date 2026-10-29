"use server";

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import { randomToken } from "@/lib/crm/security";
import { canOpenManagement, managementAccessFor } from "./access";
import { ensureManagementSchema } from "./ensure";
import {
  appendManagementApproval,
  countManagementSubtasks,
  createManagementProject,
  deleteManagementAccessRow,
  deleteManagementProject,
  deleteManagementSubtask,
  getManagementSubtask,
  insertManagementSubtask,
  insertManagementSubtaskComment,
  insertManagementSubtaskFile,
  patchManagementProject,
  replaceKpis,
  replaceSources,
  saveManagementAccessRow,
  saveManagementProject,
  seedStarterSubtasks,
  updateManagementSubtask,
  writeAudit,
} from "./queries";
import {
  MAX_MGMT_SUBTASKS,
  MIN_MGMT_SUBTASKS,
  isApprovalStatus,
  isCadence,
  isDepartment,
  isHotelStatus,
  isPriority,
  isProjectType,
  isReadiness,
  isWorkstream,
  normalizeHotelStatus,
  normalizeKpiArea,
  normalizeKpiDataStatus,
  normalizeProjectType,
  normalizeStatus,
  normalizeSubtaskStatus,
  normalizeWorkstream,
  type MgmtKpiView,
  type MgmtSourceView,
} from "./types";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const URL_RE = /^(#|\/|https?:\/\/)/i;

async function requireManagement() {
  const user = await requireUser();
  if (!canOpenManagement(user)) redirect("/crm?error=forbidden");
  await ensureManagementSchema();
  const access = await managementAccessFor(user);
  return { user, access };
}

function revalidateManagement() {
  revalidatePath("/crm");
  revalidatePath("/crm/management");
  revalidatePath("/crm/management/properties");
  revalidatePath("/crm/management/assessment");
  revalidatePath("/crm/management/plan");
  revalidatePath("/crm/management/commercial");
  revalidatePath("/crm/management/marketing");
  revalidatePath("/crm/management/distribution");
  revalidatePath("/crm/management/operations");
  revalidatePath("/crm/management/guest");
  revalidatePath("/crm/management/people");
  revalidatePath("/crm/management/meetings");
  revalidatePath("/crm/management/kpi");
  revalidatePath("/crm/management/actions");
  revalidatePath("/crm/management/approvals");
  revalidatePath("/crm/management/handover");
  revalidatePath("/crm/management/settings");
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
  const dir = join(process.cwd(), "private", "management-ops", folder);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, name), buffer);
  return {
    filename: original,
    mime: file.type || "application/octet-stream",
    size: file.size,
    path: `private/management-ops/${folder}/${name}`,
  };
}

export async function saveWebsiteWork(formData: FormData) {
  const { user, access } = await requireManagement();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const hotelName = text(formData, "hotelName");
  const projectName = text(formData, "projectName") || hotelName;
  if (!hotelName && !projectName) return { ok: false as const, error: "required" };
  if (formData.has("assessmentsJson")) {
    const assessments = parseJson<{ evidence?: string }>(text(formData, "assessmentsJson"));
    if (
      assessments.some((item) => {
        const evidence = String(item.evidence ?? "").trim();
        return Boolean(evidence && /:\/\//.test(evidence) && !validUrl(evidence));
      })
    ) {
      return { ok: false as const, error: "invalid_url" };
    }
  }

  const workstream = normalizeWorkstream(text(formData, "workstream") || "properties");
  const status = normalizeStatus(text(formData, "status") || "draft");
  const department = text(formData, "department");
  const priority = text(formData, "priority");
  const projectType = normalizeProjectType(text(formData, "propertyType") || text(formData, "projectType"));
  const hotelStatus = normalizeHotelStatus(text(formData, "hotelStatus"));
  const cadence = text(formData, "kpiCadence");
  const dataStatus = normalizeKpiDataStatus(text(formData, "dataStatus") || "pending");

  let id = text(formData, "id");
  if (!id) id = await createManagementProject(access, hotelName || projectName, workstream);

  const saved = await saveManagementProject(
    id,
    {
      projectName,
      hotelName: hotelName || projectName,
      projectType: isProjectType(projectType) ? projectType : "independent",
      propertyType: isProjectType(projectType) ? projectType : "independent",
      roomCount: text(formData, "roomCount"),
      locationMarket: text(formData, "locationMarket"),
      hotelOperatingStatus: isHotelStatus(hotelStatus) ? hotelStatus : "operating",
      hotelStatus: isHotelStatus(hotelStatus) ? hotelStatus : "operating",
      primaryGoal: text(formData, "primaryGoal"),
      mainChallenge: text(formData, "mainChallenge"),
      startDate: optionalDate(text(formData, "startDate")),
      launchDate: optionalDate(text(formData, "launchDate")),
      status,
      ownerId: text(formData, "ownerId") || access.userId,
      department: isDepartment(department) ? department : "marketing",
      workstream: isWorkstream(workstream) ? workstream : "properties",
      priority: isPriority(priority) ? priority : "normal",
      scopeText: text(formData, "scope"),
      nextAction: text(formData, "nextAction"),
      nextActionAt: optionalDate(text(formData, "nextActionAt")),
      notes: text(formData, "notes"),
      primaryKpi: text(formData, "primaryKpi"),
      kpiTarget: text(formData, "kpiTarget"),
      hotelApprover: text(formData, "hotelApprover"),
      kpiCadence: isCadence(cadence) ? cadence : "monthly",
      dataStatus,
      handoverStatus: isReadiness(text(formData, "handoverStatus")) ? text(formData, "handoverStatus") : "not_started",
      qaJson: formData.has("qaJson") ? text(formData, "qaJson") : undefined,
      handoverJson: formData.has("handoverJson") ? text(formData, "handoverJson") : undefined,
      filesJson: formData.has("filesJson") ? text(formData, "filesJson") : undefined,
      approvalsJson: formData.has("approvalsJson") ? text(formData, "approvalsJson") : undefined,
      assessmentsJson: formData.has("assessmentsJson") ? text(formData, "assessmentsJson") : undefined,
      plansJson: formData.has("plansJson") ? text(formData, "plansJson") : undefined,
      meetingsJson: formData.has("meetingsJson") ? text(formData, "meetingsJson") : undefined,
      actionLogsJson: formData.has("actionLogsJson") ? text(formData, "actionLogsJson") : undefined,
      peopleJson: formData.has("peopleJson") ? text(formData, "peopleJson") : undefined,
      commercialJson: formData.has("commercialJson") ? text(formData, "commercialJson") : undefined,
      marketingJson: formData.has("marketingJson") ? text(formData, "marketingJson") : undefined,
      distributionJson: formData.has("distributionJson") ? text(formData, "distributionJson") : undefined,
      operationsJson: formData.has("operationsJson") ? text(formData, "operationsJson") : undefined,
      guestJson: formData.has("guestJson") ? text(formData, "guestJson") : undefined,
    },
    user.id,
    access.canSeePrivateIds,
  );
  if (!saved) return { ok: false as const, error: "missing" };

  const sources = parseJson<MgmtSourceView>(text(formData, "sourcesJson")).map((item) => ({
    id: item.id || `wsrc_${randomToken(8)}`,
    name: String(item.name ?? "").trim(),
    url: String(item.url ?? "").trim(),
    publishedAt: String(item.publishedAt ?? "").trim(),
    accessedAt: String(item.accessedAt ?? "").trim(),
    notes: String(item.notes ?? "").trim(),
  }));
  const kpis = parseJson<MgmtKpiView>(text(formData, "kpisJson")).map((item) => ({
    id: item.id || `wkpi_${randomToken(8)}`,
    name: String(item.name ?? "").trim(),
    area: normalizeKpiArea(String(item.area ?? "")),
    period: String(item.period ?? "").trim(),
    value: String(item.value ?? "").trim(),
    definition: String(item.definition ?? "").trim(),
    source: String(item.source ?? "").trim(),
    dataStatus: normalizeKpiDataStatus(String(item.dataStatus ?? "")),
    market: String(item.market ?? hotelName).trim(),
    target: String(item.target ?? "").trim(),
    owner: String(item.owner ?? "").trim(),
    notes: String(item.notes ?? "").trim(),
    updatedAt: String(item.updatedAt ?? ""),
  }));
  await replaceSources(id, sources.filter((item) => item.name || item.url));
  await replaceKpis(id, kpis.filter((item) => item.name));
  await seedStarterSubtasks(id, user.id);
  await writeAudit(id, user.id, "save", `Updated ${hotelName}`);
  revalidateManagement();
  return { ok: true as const, id };
}

export async function removeWebsiteWork(formData: FormData) {
  const { user, access } = await requireManagement();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "delete", "Deleted record");
  await deleteManagementProject(id);
  revalidateManagement();
  return { ok: true as const, id };
}

export async function changeWebsiteStatus(formData: FormData) {
  const { user, access } = await requireManagement();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  const status = normalizeStatus(text(formData, "status"));
  const saved = await patchManagementProject(id, { status }, user.id);
  if (!saved) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "status", `Status → ${status}`);
  revalidateManagement();
  return { ok: true as const, id };
}

export async function assignWebsiteWork(formData: FormData) {
  const { user, access } = await requireManagement();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  const ownerId = text(formData, "ownerId");
  const saved = await patchManagementProject(id, { ownerId }, user.id);
  if (!saved) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "assign", `Assigned owner ${ownerId || "unassigned"}`);
  revalidateManagement();
  return { ok: true as const, id };
}

export async function changeWebsiteDepartment(formData: FormData) {
  const { user, access } = await requireManagement();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const department = text(formData, "department");
  if (!id || !isDepartment(department)) return { ok: false as const, error: "invalid" };
  const saved = await patchManagementProject(id, { department }, user.id);
  if (!saved) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "department", `Department → ${department}`);
  revalidateManagement();
  return { ok: true as const, id };
}

export async function escalateWebsiteWork(formData: FormData) {
  const { user, access } = await requireManagement();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  const saved = await patchManagementProject(id, { department: "management", status: "awaiting_approval" }, user.id);
  if (!saved) return { ok: false as const, error: "missing" };
  await appendManagementApproval(id, {
    kind: "Hotel approval",
    status: "awaiting",
    notes: text(formData, "notes") || "Escalated to Management",
    requestedBy: user.id,
  });
  await writeAudit(id, user.id, "escalate", "Escalated to Management");
  revalidateManagement();
  return { ok: true as const, id };
}

export async function addWebsiteApprovalNote(formData: FormData) {
  const { user, access } = await requireManagement();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const notes = text(formData, "notes");
  if (!id) return { ok: false as const, error: "missing" };
  if (!notes) return { ok: false as const, error: "missing_note" };
  const status = text(formData, "status");
  const saved = await appendManagementApproval(id, {
    kind: text(formData, "kind") || "Approval note",
    status: isApprovalStatus(status) ? status : "awaiting",
    notes,
    requestedBy: user.id,
    decidedBy: text(formData, "decidedBy"),
  });
  if (!saved) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "approval", notes.slice(0, 120));
  revalidateManagement();
  return { ok: true as const, id };
}

export async function closeWebsiteWork(formData: FormData) {
  const { user, access } = await requireManagement();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  const saved = await patchManagementProject(id, { status: "archived" }, user.id);
  if (!saved) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "close", "Archived hotel operations property");
  revalidateManagement();
  return { ok: true as const, id };
}

export async function removeManagementSubtask(formData: FormData) {
  const { user, access } = await requireManagement();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  const row = await getManagementSubtask(id);
  if (!row) return { ok: false as const, error: "missing" };
  const remaining = await countManagementSubtasks(String(row.propertyId ?? ""));
  if (remaining <= MIN_MGMT_SUBTASKS) return { ok: false as const, error: "subtask_min" };
  await deleteManagementSubtask(id);
  await writeAudit(String(row.propertyId ?? ""), user.id, "subtask", `Deleted ${String(row.name ?? "")}`);
  revalidateManagement();
  return { ok: true as const, id };
}

export async function saveManagementAccess(formData: FormData) {
  const { access } = await requireManagement();
  if (!access.canManageSettings) return { ok: false as const, error: "forbidden" };
  const userId = text(formData, "userId");
  const department = text(formData, "department");
  if (!userId || !isDepartment(department)) return { ok: false as const, error: "invalid" };
  const id = await saveManagementAccessRow(userId, department, formData.get("canSeePrivateIds") === "1");
  revalidateManagement();
  return { ok: true as const, id };
}

export async function deleteManagementAccess(formData: FormData) {
  const { access } = await requireManagement();
  if (!access.canManageSettings) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  await deleteManagementAccessRow(id);
  revalidateManagement();
  return { ok: true as const, id };
}

export async function saveManagementSubtask(formData: FormData) {
  const { user, access } = await requireManagement();
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
    const count = await countManagementSubtasks(propertyId);
    if (count >= MAX_MGMT_SUBTASKS) return { ok: false as const, error: "subtask_limit" };
    id = await insertManagementSubtask({ ...payload, propertyId, userId: user.id });
  } else {
    await updateManagementSubtask(id, payload);
  }
  await writeAudit(propertyId, user.id, "subtask", `Subtask ${name}`);
  revalidateManagement();
  return { ok: true as const, id };
}

export async function addManagementSubtaskComment(formData: FormData) {
  const { user, access } = await requireManagement();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const body = text(formData, "body");
  if (!id) return { ok: false as const, error: "missing" };
  if (!body) return { ok: false as const, error: "missing_comment" };
  const row = await getManagementSubtask(id);
  if (!row) return { ok: false as const, error: "missing" };
  await insertManagementSubtaskComment(id, user.id, body);
  await writeAudit(String(row.propertyId ?? ""), user.id, "comment", body.slice(0, 120));
  revalidateManagement();
  return { ok: true as const, id };
}

export async function attachManagementSubtaskFile(formData: FormData) {
  const { user, access } = await requireManagement();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const file = formData.get("file");
  if (!id) return { ok: false as const, error: "missing" };
  if (!(file instanceof File) || !file.size) return { ok: false as const, error: "missing_file" };
  const stored = await storePrivateFile(file, id);
  if (!stored || "error" in stored) return { ok: false as const, error: stored?.error || "invalid_file" };
  const row = await getManagementSubtask(id);
  if (!row) return { ok: false as const, error: "missing" };
  await insertManagementSubtaskFile({
    subtaskId: id,
    filename: stored.filename,
    mime: stored.mime,
    size: stored.size,
    path: stored.path,
    caption: text(formData, "caption"),
    userId: user.id,
  });
  await writeAudit(String(row.propertyId ?? ""), user.id, "file", stored.filename);
  revalidateManagement();
  return { ok: true as const, id };
}

export async function completeManagementSubtask(formData: FormData) {
  const done = formData.get("completed") !== "0";
  const id = text(formData, "id");
  const existing = id ? await getManagementSubtask(id) : null;
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
  return saveManagementSubtask(formData);
}
