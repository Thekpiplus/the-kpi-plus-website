"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import { canOpenHotelAi, hotelAiAccessFor } from "./access";
import { ensureHotelAiOpsSchema } from "./ensure";
import {
  appendHotelAiApproval,
  appendHotelAiIssue,
  applyHotelAiGateBlock,
  countHotelAiSubtasks,
  createHotelAiWorkflow,
  deleteHotelAiAccessRow,
  deleteHotelAiSubtask,
  deleteHotelAiWorkflow,
  getHotelAiSettings,
  getHotelAiSubtask,
  insertHotelAiSubtask,
  insertHotelAiSubtaskComment,
  patchHotelAiWorkflow,
  saveHotelAiAccessRow,
  saveHotelAiSettingsRow,
  saveHotelAiCharterDecision,
  saveHotelAiWorkflow,
  seedStarterSubtasks,
  updateHotelAiSubtask,
  writeAudit,
} from "./queries";
import {
  HAI_SECTIONS,
  MASKED_VALUE,
  MAX_HAI_SUBTASKS,
  MIN_HAI_SUBTASKS,
  isApprovalStatus,
  isPriority,
  payloadHasSecrets,
  normalizeApproach,
  normalizeApprovalStatus,
  normalizeDataClass,
  normalizePriority,
  normalizeRisk,
  normalizeGateKind,
  normalizeStatus,
  normalizeSubtaskStatus,
  type HaiExtraDepartment,
  type HaiPilotCharter,
  type HaiSection,
} from "./types";

const URL_RE = /^(#|\/|https?:\/\/)/i;

async function requireHotelAi() {
  const user = await requireUser();
  if (!canOpenHotelAi(user)) redirect("/crm?error=forbidden");
  await ensureHotelAiOpsSchema();
  const access = await hotelAiAccessFor(user);
  return { user, access };
}

function revalidateHotelAi() {
  revalidatePath("/crm");
  for (const section of HAI_SECTIONS) {
    revalidatePath(sectionPath(section));
  }
  revalidatePath("/crm/hotel-ai/departments/reservations");
  revalidatePath("/crm/hotel-ai/departments/revenue");
  revalidatePath("/crm/hotel-ai/departments/distribution");
  revalidatePath("/crm/hotel-ai/departments/marketing");
  revalidatePath("/crm/hotel-ai/departments/operations");
  revalidatePath("/crm/hotel-ai/departments/sales");
  revalidatePath("/crm/hotel-ai/departments/management");
  revalidatePath("/crm/hotel-ai/departments/it-data");
}

function sectionPath(section: HaiSection) {
  const paths: Record<HaiSection, string> = {
    overview: "/crm/hotel-ai",
    inventory: "/crm/hotel-ai/inventory",
    backlog: "/crm/hotel-ai/backlog",
    pilots: "/crm/hotel-ai/pilots",
    use_cases: "/crm/hotel-ai/use-cases",
    data: "/crm/hotel-ai/data-access",
    approvals: "/crm/hotel-ai/approvals",
    tests: "/crm/hotel-ai/tests",
    issues: "/crm/hotel-ai/issues",
    metrics: "/crm/hotel-ai/metrics",
    handover: "/crm/hotel-ai/handover",
    departments: "/crm/hotel-ai/departments",
    history: "/crm/hotel-ai/audit",
    settings: "/crm/hotel-ai/settings",
  };
  return paths[section];
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

function parseObject<T>(value: string, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function validUrl(value: string) {
  return !value || URL_RE.test(value);
}

export async function saveHotelAiWork(formData: FormData) {
  const { user, access } = await requireHotelAi();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const name = text(formData, "name");
  const hotelName = text(formData, "hotelName");
  if (!name && !hotelName) return { ok: false as const, error: "required" };

  const jsonKeys = [
    "charterJson",
    "useCasesJson",
    "accessJson",
    "testsJson",
    "issuesJson",
    "metricsJson",
    "handoverJson",
    "approvalsJson",
    "commentsJson",
  ];
  const secretScan = [
    name,
    hotelName,
    text(formData, "problem"),
    text(formData, "currentProcess"),
    text(formData, "manualSteps"),
    text(formData, "exceptions"),
    text(formData, "notes"),
    text(formData, "vaultRef"),
    text(formData, "systems"),
    text(formData, "fallback"),
    ...jsonKeys.map((key) => text(formData, key)),
  ];
  if (secretScan.some((value) => payloadHasSecrets(value))) {
    return { ok: false as const, error: "blocked_secret" };
  }

  const vaultRef = text(formData, "vaultRef");
  if (vaultRef && vaultRef !== MASKED_VALUE && payloadHasSecrets(vaultRef)) {
    return { ok: false as const, error: "vault_secret" };
  }
  if (vaultRef && vaultRef !== MASKED_VALUE && /:\/\//.test(vaultRef) && !validUrl(vaultRef)) {
    return { ok: false as const, error: "invalid_url" };
  }

  const evidenceItems = [
    ...parseJson<{ evidence?: string }>(text(formData, "testsJson")),
    ...parseJson<{ evidence?: string }>(text(formData, "issuesJson")),
  ];
  if (
    evidenceItems.some((item) => {
      const evidence = String(item.evidence ?? "").trim();
      return Boolean(evidence && /:\/\//.test(evidence) && !validUrl(evidence));
    })
  ) {
    return { ok: false as const, error: "invalid_url" };
  }

  const charter = parseObject<HaiPilotCharter>(text(formData, "charterJson"), {
    scope: "",
    baselinePeriod: "",
    baselineMethod: "",
    approvedDataSources: "",
    prohibitedData: "",
    pilotUsers: "",
    successCriteria: "",
    qualityThreshold: "",
    errorStopThreshold: "",
    humanReviewRule: "",
    fallbackPlan: "",
    startDate: "",
    endDate: "",
    reviewDate: "",
    decision: "pending",
    decisionOwner: "",
    approvalStatus: "not_requested",
  });
  charter.approvalStatus = normalizeApprovalStatus(charter.approvalStatus);

  let id = text(formData, "id");
  if (!id) id = await createHotelAiWorkflow(access, name || hotelName, text(formData, "department"));

  const saved = await saveHotelAiWorkflow(
    id,
    {
      name: name || hotelName,
      hotelName: hotelName || name,
      department: text(formData, "department") || "operations",
      ownerId: text(formData, "ownerId") || access.userId,
      problem: text(formData, "problem"),
      currentProcess: text(formData, "currentProcess"),
      frequency: text(formData, "frequency"),
      systems: text(formData, "systems"),
      dataClass: normalizeDataClass(text(formData, "dataClass")),
      sourceOfTruth: text(formData, "sourceOfTruth"),
      manualSteps: text(formData, "manualSteps"),
      exceptions: text(formData, "exceptions"),
      userImpact: text(formData, "userImpact"),
      objective: text(formData, "objective"),
      status: normalizeStatus(text(formData, "status") || "backlog"),
      priority: normalizePriority(text(formData, "priority") || "normal"),
      approach: normalizeApproach(text(formData, "approach") || "do_not_automate"),
      reviewer: text(formData, "reviewer"),
      fallback: text(formData, "fallback"),
      risk: normalizeRisk(text(formData, "risk") || "medium"),
      nextAction: text(formData, "nextAction"),
      nextActionAt: optionalDate(text(formData, "nextActionAt")),
      vaultRef: vaultRef === MASKED_VALUE ? undefined : vaultRef,
      notes: text(formData, "notes"),
      charterJson: formData.has("charterJson") ? JSON.stringify(charter) : undefined,
      useCasesJson: formData.has("useCasesJson") ? text(formData, "useCasesJson") : undefined,
      accessJson: formData.has("accessJson") ? text(formData, "accessJson") : undefined,
      testsJson: formData.has("testsJson") ? text(formData, "testsJson") : undefined,
      issuesJson: formData.has("issuesJson") ? text(formData, "issuesJson") : undefined,
      metricsJson: formData.has("metricsJson") ? text(formData, "metricsJson") : undefined,
      handoverJson: formData.has("handoverJson") ? text(formData, "handoverJson") : undefined,
      approvalsJson: formData.has("approvalsJson") ? text(formData, "approvalsJson") : undefined,
      commentsJson: formData.has("commentsJson") ? text(formData, "commentsJson") : undefined,
    },
    user.id,
  );
  if (!saved) return { ok: false as const, error: "missing" };
  await seedStarterSubtasks(id, user.id, text(formData, "department") || "operations");
  await writeAudit(id, user.id, "save", `Updated ${name || hotelName}`);
  revalidateHotelAi();
  return { ok: true as const, id };
}

export async function removeHotelAiWork(formData: FormData) {
  const { user, access } = await requireHotelAi();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "delete", "Deleted workflow");
  await deleteHotelAiWorkflow(id);
  revalidateHotelAi();
  return { ok: true as const, id };
}

export async function archiveHotelAiWork(formData: FormData) {
  const { user, access } = await requireHotelAi();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  const saved = await patchHotelAiWorkflow(id, { archived: "1" }, user.id);
  if (!saved) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "archive", "Archived workflow");
  revalidateHotelAi();
  return { ok: true as const, id };
}

export async function changeHotelAiStatus(formData: FormData) {
  const { user, access } = await requireHotelAi();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  const status = normalizeStatus(text(formData, "status"));
  const saved = await patchHotelAiWorkflow(id, { status }, user.id);
  if (!saved) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "status", `Status → ${status}`);
  await applyHotelAiGateBlock(id, user.id);
  revalidateHotelAi();
  return { ok: true as const, id };
}

export async function assignHotelAiWork(formData: FormData) {
  const { user, access } = await requireHotelAi();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  const ownerId = text(formData, "ownerId");
  const saved = await patchHotelAiWorkflow(id, { ownerId }, user.id);
  if (!saved) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "assign", `Assigned owner ${ownerId || "unassigned"}`);
  revalidateHotelAi();
  return { ok: true as const, id };
}

export async function changeHotelAiDepartment(formData: FormData) {
  const { user, access } = await requireHotelAi();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const department = text(formData, "department");
  if (!id || !department) return { ok: false as const, error: "invalid" };
  const saved = await patchHotelAiWorkflow(id, { department }, user.id);
  if (!saved) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "department", `Department → ${department}`);
  revalidateHotelAi();
  return { ok: true as const, id };
}

export async function addHotelAiApprovalNote(formData: FormData) {
  const { user, access } = await requireHotelAi();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const notes = text(formData, "notes");
  if (!id) return { ok: false as const, error: "missing" };
  if (!notes) return { ok: false as const, error: "missing_note" };
  if (payloadHasSecrets(notes)) return { ok: false as const, error: "blocked_secret" };
  const status = text(formData, "status");
  const saved = await appendHotelAiApproval(id, {
    kind: text(formData, "kind") || "Human review",
    status: isApprovalStatus(status) ? status : "awaiting",
    notes,
    requestedBy: user.id,
    decidedBy: text(formData, "decidedBy"),
  });
  if (!saved) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "approval", notes.slice(0, 120));
  revalidateHotelAi();
  return { ok: true as const, id };
}

export async function saveHotelAiAccess(formData: FormData) {
  const { access } = await requireHotelAi();
  if (!access.canManageSettings) return { ok: false as const, error: "forbidden" };
  const userId = text(formData, "userId");
  const department = text(formData, "department");
  if (!userId || !department) return { ok: false as const, error: "invalid" };
  const id = await saveHotelAiAccessRow(userId, department, formData.get("canSeePrivateIds") === "1");
  revalidateHotelAi();
  return { ok: true as const, id };
}

export async function deleteHotelAiAccess(formData: FormData) {
  const { access } = await requireHotelAi();
  if (!access.canManageSettings) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  await deleteHotelAiAccessRow(id);
  revalidateHotelAi();
  return { ok: true as const, id };
}

export async function saveHotelAiBoardSettings(formData: FormData) {
  const { user, access } = await requireHotelAi();
  if (!access.canManageSettings) return { ok: false as const, error: "forbidden" };
  const extras = parseJson<HaiExtraDepartment>(text(formData, "extraDepartmentsJson"));
  const secretVaultLabel = text(formData, "secretVaultLabel");
  const secretVaultUrl = text(formData, "secretVaultUrl");
  if (payloadHasSecrets(`${secretVaultLabel} ${secretVaultUrl} ${JSON.stringify(extras)}`)) {
    return { ok: false as const, error: "blocked_secret" };
  }
  if (secretVaultUrl && !validUrl(secretVaultUrl)) return { ok: false as const, error: "invalid_url" };
  const current = await getHotelAiSettings();
  await saveHotelAiSettingsRow(
    {
      extraDepartments: extras.length ? extras : current.extraDepartments,
      secretVaultLabel,
      secretVaultUrl,
    },
    user.id,
  );
  revalidateHotelAi();
  return { ok: true as const, id: "default" };
}

export async function saveHotelAiSubtask(formData: FormData) {
  const { user, access } = await requireHotelAi();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const workflowId = text(formData, "workflowId") || text(formData, "propertyId");
  const name = text(formData, "name");
  if (!workflowId || !name) return { ok: false as const, error: "missing_name" };
  const status = normalizeSubtaskStatus(text(formData, "status"));
  const evidence = text(formData, "evidence") || text(formData, "source");
  if (payloadHasSecrets(`${name} ${evidence} ${text(formData, "comments")} ${text(formData, "body")}`)) {
    return { ok: false as const, error: "blocked_secret" };
  }
  if (evidence && /:\/\//.test(evidence) && !validUrl(evidence)) return { ok: false as const, error: "invalid_url" };
  const department = text(formData, "department") || "operations";
  const reviewerId = text(formData, "reviewerId");
  const gateKind = normalizeGateKind(text(formData, "gateKind"), name, department);
  const payload = {
    name,
    department,
    ownerId: text(formData, "ownerId") || user.id,
    reviewerId,
    status,
    completed: status === "completed" || formData.get("completed") === "1",
    dueAt: optionalDate(text(formData, "dueAt")),
    priority: isPriority(text(formData, "priority")) ? text(formData, "priority") : "normal",
    comments: text(formData, "comments"),
    evidence,
    gateKind,
  };
  let id = text(formData, "id");
  if (!id) {
    const count = await countHotelAiSubtasks(workflowId);
    if (count >= MAX_HAI_SUBTASKS) return { ok: false as const, error: "subtask_limit" };
    id = await insertHotelAiSubtask({ ...payload, workflowId, userId: user.id });
  } else {
    await updateHotelAiSubtask(id, payload);
  }
  await writeAudit(workflowId, user.id, "subtask", `Subtask ${name}`);
  await applyHotelAiGateBlock(workflowId, user.id);
  revalidateHotelAi();
  return { ok: true as const, id };
}

export async function addHotelAiSubtaskComment(formData: FormData) {
  const { user, access } = await requireHotelAi();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const body = text(formData, "body");
  if (!id) return { ok: false as const, error: "missing" };
  if (!body) return { ok: false as const, error: "missing_comment" };
  if (payloadHasSecrets(body)) return { ok: false as const, error: "blocked_secret" };
  const row = await getHotelAiSubtask(id);
  if (!row) return { ok: false as const, error: "missing" };
  await insertHotelAiSubtaskComment(id, user.id, body);
  await writeAudit(String(row.workflowId ?? ""), user.id, "comment", body.slice(0, 120));
  revalidateHotelAi();
  return { ok: true as const, id };
}

export async function removeHotelAiSubtask(formData: FormData) {
  const { user, access } = await requireHotelAi();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  const row = await getHotelAiSubtask(id);
  if (!row) return { ok: false as const, error: "missing" };
  const remaining = await countHotelAiSubtasks(String(row.workflowId ?? ""));
  if (remaining <= MIN_HAI_SUBTASKS) return { ok: false as const, error: "subtask_min" };
  await deleteHotelAiSubtask(id);
  await writeAudit(String(row.workflowId ?? ""), user.id, "subtask", `Deleted ${String(row.name ?? "")}`);
  await applyHotelAiGateBlock(String(row.workflowId ?? ""), user.id);
  revalidateHotelAi();
  return { ok: true as const, id };
}

export async function completeHotelAiSubtask(formData: FormData) {
  await requireHotelAi();
  const done = formData.get("completed") !== "0";
  const id = text(formData, "id");
  const existing = id ? await getHotelAiSubtask(id) : null;
  if (existing) {
    if (!text(formData, "workflowId")) formData.set("workflowId", String(existing.workflowId ?? ""));
    if (!text(formData, "name")) formData.set("name", String(existing.name ?? ""));
    if (!text(formData, "department")) formData.set("department", String(existing.department ?? "operations"));
    if (!text(formData, "ownerId")) formData.set("ownerId", String(existing.ownerId ?? ""));
    if (!text(formData, "priority")) formData.set("priority", String(existing.priority ?? "normal"));
    if (!text(formData, "comments")) formData.set("comments", String(existing.comments ?? ""));
    if (!text(formData, "evidence")) formData.set("evidence", String(existing.evidence ?? ""));
    if (!text(formData, "reviewerId")) formData.set("reviewerId", String(existing.reviewerId ?? ""));
    if (!text(formData, "gateKind")) formData.set("gateKind", String(existing.gateKind ?? ""));
    if (!text(formData, "dueAt") && existing.dueAt) formData.set("dueAt", String(existing.dueAt));
  }
  formData.set("status", done ? "completed" : text(formData, "status") || "in_progress");
  return saveHotelAiSubtask(formData);
}

export async function addHotelAiReviewerNote(formData: FormData) {
  const { user, access } = await requireHotelAi();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const body = text(formData, "body") || text(formData, "notes");
  if (!id) return { ok: false as const, error: "missing" };
  if (!body) return { ok: false as const, error: "missing_comment" };
  if (payloadHasSecrets(body)) return { ok: false as const, error: "blocked_secret" };
  const row = await getHotelAiSubtask(id);
  if (!row) return { ok: false as const, error: "missing" };
  await insertHotelAiSubtaskComment(id, user.id, body);
  await updateHotelAiSubtask(id, {
    name: String(row.name ?? ""),
    department: String(row.department ?? "operations"),
    ownerId: String(row.ownerId ?? ""),
    reviewerId: text(formData, "reviewerId") || user.id,
    status: String(row.status ?? "") === "blocked" ? "blocked" : "needs_review",
    completed: String(row.status ?? "") === "completed",
    dueAt: row.dueAt ? optionalDate(row.dueAt instanceof Date ? row.dueAt.toISOString() : String(row.dueAt)) : null,
    priority: String(row.priority ?? "normal"),
    comments: String(row.comments ?? ""),
    evidence: String(row.evidence ?? ""),
    gateKind: normalizeGateKind(String(row.gateKind ?? ""), String(row.name ?? ""), String(row.department ?? "")),
  });
  await writeAudit(String(row.workflowId ?? ""), user.id, "review", body.slice(0, 120));
  await applyHotelAiGateBlock(String(row.workflowId ?? ""), user.id);
  revalidateHotelAi();
  return { ok: true as const, id };
}

export async function decideHotelAiPilotGate(formData: FormData) {
  const { user, access } = await requireHotelAi();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const notes = text(formData, "notes");
  const decision = text(formData, "decision") === "reject" ? "reject" : "approve";
  if (!id) return { ok: false as const, error: "missing" };
  if (!notes) return { ok: false as const, error: "missing_gate_note" };
  if (payloadHasSecrets(notes)) return { ok: false as const, error: "blocked_secret" };
  const approved = decision === "approve";
  const saved = await saveHotelAiCharterDecision(id, {
    approvalStatus: approved ? "approved" : "rejected",
    decision: approved ? "scale" : "adjust",
    notes,
    userId: user.id,
    workflowStatus: approved ? "approved_to_scale" : "adjust",
  });
  if (!saved) return { ok: false as const, error: "missing" };
  await appendHotelAiApproval(id, {
    kind: "Pilot gate",
    status: approved ? "approved" : "rejected",
    notes,
    requestedBy: user.id,
    decidedBy: user.id,
  });
  await writeAudit(id, user.id, "pilot_gate", approved ? `Approved: ${notes.slice(0, 120)}` : `Rejected: ${notes.slice(0, 120)}`);
  revalidateHotelAi();
  return { ok: true as const, id };
}

export async function escalateHotelAiIssue(formData: FormData) {
  const { user, access } = await requireHotelAi();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const notes = text(formData, "notes");
  if (!id) return { ok: false as const, error: "missing" };
  if (!notes) return { ok: false as const, error: "missing_gate_note" };
  if (payloadHasSecrets(notes)) return { ok: false as const, error: "blocked_secret" };
  const saved = await appendHotelAiIssue(id, {
    title: text(formData, "title") || "Escalated issue",
    exception: notes,
    owner: user.id,
    notes,
  });
  if (!saved) return { ok: false as const, error: "missing" };
  await appendHotelAiApproval(id, {
    kind: "Escalation",
    status: "awaiting",
    notes,
    requestedBy: user.id,
  });
  await writeAudit(id, user.id, "escalate", notes.slice(0, 120));
  revalidateHotelAi();
  return { ok: true as const, id };
}
