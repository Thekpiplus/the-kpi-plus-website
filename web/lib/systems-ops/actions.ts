"use server";

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import { randomToken } from "@/lib/crm/security";
import { canOpenSystems, systemsAccessFor } from "./access";
import { ensureSystemsSchema } from "./ensure";
import {
  appendSystemsApproval,
  countSystemsSubtasks,
  countSystemsSubtasksForDepartment,
  createSystemsProject,
  deleteSystemsAccessRow,
  deleteSystemsProject,
  deleteSystemsSubtask,
  getSystemsSubtask,
  insertSystemsSubtask,
  insertSystemsSubtaskComment,
  insertSystemsSubtaskFile,
  patchSystemsProject,
  replaceKpis,
  replaceSources,
  saveSystemsAccessRow,
  saveSystemsProject,
  seedStarterSubtasks,
  updateSystemsSubtask,
  writeAudit,
} from "./queries";
import {
  MASKED_VALUE,
  MAX_SYS_SUBTASKS,
  MIN_SYS_SUBTASKS,
  isApprovalStatus,
  isCadence,
  isDepartment,
  isHotelStatus,
  isPriority,
  isProjectType,
  isReadiness,
  isRisk,
  isWorkstream,
  normalizeHotelStatus,
  normalizeKpiArea,
  normalizeKpiDataStatus,
  normalizeProjectType,
  normalizeRisk,
  normalizeStatus,
  normalizeSubtaskStatus,
  normalizeWorkstream,
  payloadHasSecrets,
  type SysKpiView,
  type SysSourceView,
} from "./types";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const URL_RE = /^(#|\/|https?:\/\/)/i;

async function requireManagement() {
  const user = await requireUser();
  if (!canOpenSystems(user)) redirect("/crm?error=forbidden");
  await ensureSystemsSchema();
  const access = await systemsAccessFor(user);
  return { user, access };
}

function revalidateManagement() {
  revalidatePath("/crm");
  revalidatePath("/crm/systems");
  revalidatePath("/crm/systems/properties");
  revalidatePath("/crm/systems/inventory");
  revalidatePath("/crm/systems/architecture");
  revalidatePath("/crm/systems/mapping");
  revalidatePath("/crm/systems/readiness");
  revalidatePath("/crm/systems/configuration");
  revalidatePath("/crm/systems/testing");
  revalidatePath("/crm/systems/issues");
  revalidatePath("/crm/systems/distribution");
  revalidatePath("/crm/systems/analytics");
  revalidatePath("/crm/systems/kpi");
  revalidatePath("/crm/systems/handover");
  revalidatePath("/crm/systems/approvals");
  revalidatePath("/crm/systems/settings");
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
  const dir = join(process.cwd(), "private", "systems-ops", folder);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, name), buffer);
  return {
    filename: original,
    mime: file.type || "application/octet-stream",
    size: file.size,
    path: `private/systems-ops/${folder}/${name}`,
  };
}

export async function saveSystemsWork(formData: FormData) {
  const { user, access } = await requireManagement();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const hotelName = text(formData, "hotelName");
  const projectName = text(formData, "projectName") || hotelName;
  if (!hotelName && !projectName) return { ok: false as const, error: "required" };
  const jsonKeys = [
    "qaJson",
    "handoverJson",
    "filesJson",
    "approvalsJson",
    "inventoryJson",
    "architectureJson",
    "mappingJson",
    "readinessJson",
    "configurationJson",
    "testingJson",
    "issuesJson",
    "distributionOpsJson",
    "analyticsJson",
    "handoverAssetsJson",
    "kpisJson",
    "sourcesJson",
  ];
  const secretScan = [
    hotelName,
    projectName,
    text(formData, "notes"),
    text(formData, "providerContact"),
    text(formData, "nextAction"),
    text(formData, "primaryGoal"),
    text(formData, "scope"),
    ...jsonKeys.map((key) => text(formData, key)),
  ];
  if (secretScan.some((value) => payloadHasSecrets(value))) {
    return { ok: false as const, error: "blocked_secret" };
  }
  if (formData.has("mappingJson") || formData.has("testingJson") || formData.has("issuesJson") || formData.has("readinessJson")) {
    const evidenceItems = [
      ...parseJson<{ evidence?: string }>(text(formData, "mappingJson")),
      ...parseJson<{ evidence?: string }>(text(formData, "testingJson")),
      ...parseJson<{ evidence?: string }>(text(formData, "issuesJson")),
      ...parseJson<{ evidence?: string }>(text(formData, "readinessJson")),
    ];
    if (
      evidenceItems.some((item) => {
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
  const risk = normalizeRisk(text(formData, "risk") || text(formData, "riskLevel") || priority);
  const projectType = normalizeProjectType(text(formData, "propertyType") || text(formData, "projectType"));
  const hotelStatus = normalizeHotelStatus(text(formData, "hotelStatus"));
  const cadence = text(formData, "kpiCadence");
  const dataStatus = normalizeKpiDataStatus(text(formData, "dataStatus") || "pending");
  const providerContact = text(formData, "providerContact");

  let id = text(formData, "id");
  if (!id) id = await createSystemsProject(access, hotelName || projectName, workstream);

  const saved = await saveSystemsProject(
    id,
    {
      projectName,
      hotelName: hotelName || projectName,
      projectType: isProjectType(projectType) ? projectType : "new_setup",
      propertyType: isProjectType(projectType) ? projectType : "new_setup",
      roomCount: text(formData, "roomCount"),
      websiteUrl: text(formData, "websiteUrl"),
      currentUrl: text(formData, "websiteUrl"),
      pms: text(formData, "pms"),
      channelManager: text(formData, "channelManager"),
      bookingEngine: text(formData, "bookingEngine"),
      otherSystems: text(formData, "otherSystems"),
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
      riskLevel: isRisk(risk) ? risk : "medium",
      risk,
      scopeText: text(formData, "scope"),
      nextAction: text(formData, "nextAction"),
      nextActionAt: optionalDate(text(formData, "nextActionAt")),
      notes: text(formData, "notes"),
      primaryKpi: text(formData, "primaryKpi"),
      kpiTarget: text(formData, "kpiTarget"),
      hotelApprover: text(formData, "hotelApprover"),
      providerContact: providerContact === MASKED_VALUE ? undefined : providerContact,
      kpiCadence: isCadence(cadence) ? cadence : "monthly",
      dataStatus,
      handoverStatus: isReadiness(text(formData, "handoverStatus")) ? text(formData, "handoverStatus") : "not_started",
      qaJson: formData.has("qaJson") ? text(formData, "qaJson") : undefined,
      handoverJson: formData.has("handoverJson") ? text(formData, "handoverJson") : undefined,
      filesJson: formData.has("filesJson") ? text(formData, "filesJson") : undefined,
      approvalsJson: formData.has("approvalsJson") ? text(formData, "approvalsJson") : undefined,
      inventoryJson: formData.has("inventoryJson") ? text(formData, "inventoryJson") : undefined,
      architectureJson: formData.has("architectureJson") ? text(formData, "architectureJson") : undefined,
      mappingJson: formData.has("mappingJson") ? text(formData, "mappingJson") : undefined,
      readinessJson: formData.has("readinessJson") ? text(formData, "readinessJson") : undefined,
      configurationJson: formData.has("configurationJson") ? text(formData, "configurationJson") : undefined,
      testingJson: formData.has("testingJson") ? text(formData, "testingJson") : undefined,
      issuesJson: formData.has("issuesJson") ? text(formData, "issuesJson") : undefined,
      distributionOpsJson: formData.has("distributionOpsJson") ? text(formData, "distributionOpsJson") : undefined,
      analyticsJson: formData.has("analyticsJson") ? text(formData, "analyticsJson") : undefined,
      handoverAssetsJson: formData.has("handoverAssetsJson") ? text(formData, "handoverAssetsJson") : undefined,
    },
    user.id,
    access.canSeePrivateIds,
  );
  if (!saved) return { ok: false as const, error: "missing" };

  const sources = parseJson<SysSourceView>(text(formData, "sourcesJson")).map((item) => ({
    id: item.id || `wsrc_${randomToken(8)}`,
    name: String(item.name ?? "").trim(),
    url: String(item.url ?? "").trim(),
    publishedAt: String(item.publishedAt ?? "").trim(),
    accessedAt: String(item.accessedAt ?? "").trim(),
    notes: String(item.notes ?? "").trim(),
  }));
  const kpis = parseJson<SysKpiView>(text(formData, "kpisJson")).map((item) => ({
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

export const saveWebsiteWork = saveSystemsWork;

export async function removeWebsiteWork(formData: FormData) {
  const { user, access } = await requireManagement();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "delete", "Deleted record");
  await deleteSystemsProject(id);
  revalidateManagement();
  return { ok: true as const, id };
}

export async function changeWebsiteStatus(formData: FormData) {
  const { user, access } = await requireManagement();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  const status = normalizeStatus(text(formData, "status"));
  const saved = await patchSystemsProject(id, { status }, user.id);
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
  const saved = await patchSystemsProject(id, { ownerId }, user.id);
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
  const saved = await patchSystemsProject(id, { department }, user.id);
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
  const saved = await patchSystemsProject(id, { department: "management", status: "awaiting_hotel_approval" }, user.id);
  if (!saved) return { ok: false as const, error: "missing" };
  await appendSystemsApproval(id, {
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
  const saved = await appendSystemsApproval(id, {
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
  const saved = await patchSystemsProject(id, { status: "archived" }, user.id);
  if (!saved) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "close", "Archived hotel operations property");
  revalidateManagement();
  return { ok: true as const, id };
}

export async function removeSystemsSubtask(formData: FormData) {
  const { user, access } = await requireManagement();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  const row = await getSystemsSubtask(id);
  if (!row) return { ok: false as const, error: "missing" };
  const remaining = await countSystemsSubtasks(String(row.propertyId ?? ""));
  if (remaining <= MIN_SYS_SUBTASKS) return { ok: false as const, error: "subtask_min" };
  await deleteSystemsSubtask(id);
  await writeAudit(String(row.propertyId ?? ""), user.id, "subtask", `Deleted ${String(row.name ?? "")}`);
  revalidateManagement();
  return { ok: true as const, id };
}

export async function saveSystemsAccess(formData: FormData) {
  const { access } = await requireManagement();
  if (!access.canManageSettings) return { ok: false as const, error: "forbidden" };
  const userId = text(formData, "userId");
  const department = text(formData, "department");
  if (!userId || !isDepartment(department)) return { ok: false as const, error: "invalid" };
  const id = await saveSystemsAccessRow(userId, department, formData.get("canSeePrivateIds") === "1");
  revalidateManagement();
  return { ok: true as const, id };
}

export async function deleteSystemsAccess(formData: FormData) {
  const { access } = await requireManagement();
  if (!access.canManageSettings) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  await deleteSystemsAccessRow(id);
  revalidateManagement();
  return { ok: true as const, id };
}

export async function saveSystemsSubtask(formData: FormData) {
  const { user, access } = await requireManagement();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const propertyId = text(formData, "propertyId");
  const name = text(formData, "name");
  if (!propertyId || !name) return { ok: false as const, error: "missing_name" };
  const status = normalizeSubtaskStatus(text(formData, "status"));
  const source = text(formData, "source");
  const providerDependency = text(formData, "providerDependency");
  if (payloadHasSecrets(`${name} ${source} ${providerDependency} ${text(formData, "comments")} ${text(formData, "body")}`)) {
    return { ok: false as const, error: "blocked_secret" };
  }
  if (source && /:\/\//.test(source) && !validUrl(source)) return { ok: false as const, error: "invalid_url" };
  const department = isDepartment(text(formData, "department")) ? text(formData, "department") : "marketing";
  const payload = {
    name,
    department,
    ownerId: text(formData, "ownerId") || user.id,
    status,
    completed: status === "completed" || formData.get("completed") === "1",
    dueAt: optionalDate(text(formData, "dueAt")),
    priority: isPriority(text(formData, "priority")) ? text(formData, "priority") : "normal",
    comments: text(formData, "comments"),
    source,
    providerDependency,
  };
  let id = text(formData, "id");
  if (!id) {
    const count = await countSystemsSubtasksForDepartment(propertyId, department);
    if (count >= MAX_SYS_SUBTASKS) return { ok: false as const, error: "subtask_limit" };
    id = await insertSystemsSubtask({ ...payload, propertyId, userId: user.id });
  } else {
    const existing = await getSystemsSubtask(id);
    const previousDepartment = String(existing?.department || "");
    if (previousDepartment !== department) {
      const count = await countSystemsSubtasksForDepartment(propertyId, department);
      if (count >= MAX_SYS_SUBTASKS) return { ok: false as const, error: "subtask_limit" };
    }
    await updateSystemsSubtask(id, payload);
  }
  await writeAudit(propertyId, user.id, "subtask", `Subtask ${name}`);
  revalidateManagement();
  return { ok: true as const, id };
}

export async function addSystemsSubtaskComment(formData: FormData) {
  const { user, access } = await requireManagement();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const body = text(formData, "body");
  if (!id) return { ok: false as const, error: "missing" };
  if (!body) return { ok: false as const, error: "missing_comment" };
  if (payloadHasSecrets(body)) return { ok: false as const, error: "blocked_secret" };
  const row = await getSystemsSubtask(id);
  if (!row) return { ok: false as const, error: "missing" };
  await insertSystemsSubtaskComment(id, user.id, body);
  await writeAudit(String(row.propertyId ?? ""), user.id, "comment", body.slice(0, 120));
  revalidateManagement();
  return { ok: true as const, id };
}

export async function attachSystemsSubtaskFile(formData: FormData) {
  const { user, access } = await requireManagement();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const file = formData.get("file");
  if (!id) return { ok: false as const, error: "missing" };
  if (!(file instanceof File) || !file.size) return { ok: false as const, error: "missing_file" };
  const stored = await storePrivateFile(file, id);
  if (!stored || "error" in stored) return { ok: false as const, error: stored?.error || "invalid_file" };
  const row = await getSystemsSubtask(id);
  if (!row) return { ok: false as const, error: "missing" };
  await insertSystemsSubtaskFile({
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

export async function completeSystemsSubtask(formData: FormData) {
  const done = formData.get("completed") !== "0";
  const id = text(formData, "id");
  const existing = id ? await getSystemsSubtask(id) : null;
  if (existing) {
    if (!text(formData, "propertyId")) formData.set("propertyId", String(existing.propertyId ?? ""));
    if (!text(formData, "name")) formData.set("name", String(existing.name ?? ""));
    if (!text(formData, "department")) formData.set("department", String(existing.department ?? "marketing"));
    if (!text(formData, "ownerId")) formData.set("ownerId", String(existing.ownerId ?? ""));
    if (!text(formData, "priority")) formData.set("priority", String(existing.priority ?? "normal"));
    if (!text(formData, "comments")) formData.set("comments", String(existing.comments ?? ""));
    if (!text(formData, "source")) formData.set("source", String(existing.source ?? ""));
    if (!text(formData, "providerDependency")) formData.set("providerDependency", String(existing.providerDependency ?? ""));
  }
  formData.set("status", done ? "completed" : "in_progress");
  formData.set("completed", done ? "1" : "0");
  return saveSystemsSubtask(formData);
}
