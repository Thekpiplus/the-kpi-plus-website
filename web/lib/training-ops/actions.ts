"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import { canOpenTrainingOps, trainingOpsAccessFor } from "./access";
import { ensureTrainingOpsSchema } from "./ensure";
import {
  applyTrainingGateBlock,
  countTrainingOpsSubtasks,
  createTrainingOpsRecord,
  deleteTrainingOpsAccessRow,
  deleteTrainingOpsRecord,
  deleteTrainingOpsSubtask,
  getTrainingOpsSubtask,
  insertTrainingOpsSubtask,
  insertTrainingOpsSubtaskComment,
  patchTrainingOpsRecord,
  saveTrainingOpsAccessRow,
  saveTrainingOpsRecord,
  saveTrainingOpsSettingsRow,
  seedStarterSubtasks,
  trainingRecordHasBlockedGate,
  writeAudit,
  updateTrainingOpsSubtask,
} from "./queries";
import {
  MAX_TRN_SUBTASKS,
  MIN_TRN_SUBTASKS,
  TRN_SECTIONS,
  TRN_SECTION_KIND,
  TRN_SECTION_PATH,
  defaultStatusForKind,
  emptyPayload,
  isKind,
  isPriority,
  isTrnDeliveryStatus,
  normalizeGateKind,
  normalizeKind,
  normalizePriority,
  normalizeStatus,
  normalizeSubtaskStatus,
  payloadHasIndividualScores,
  payloadHasSecrets,
  type TrnExtraDepartment,
  type TrnKind,
  type TrnPayload,
  type TrnSection,
} from "./types";

const URL_RE = /^(#|\/|https?:\/\/)/i;

async function requireTrainingOps() {
  const user = await requireUser();
  if (!canOpenTrainingOps(user)) redirect("/crm?error=forbidden");
  await ensureTrainingOpsSchema();
  const access = await trainingOpsAccessFor(user);
  return { user, access };
}

function revalidateTrainingOps() {
  revalidatePath("/crm");
  for (const section of TRN_SECTIONS) revalidatePath(TRN_SECTION_PATH[section]);
  revalidatePath("/crm/training/departments/reservations");
  revalidatePath("/crm/training/departments/revenue");
  revalidatePath("/crm/training/departments/distribution");
  revalidatePath("/crm/training/departments/marketing");
  revalidatePath("/crm/training/departments/operations");
  revalidatePath("/crm/training/departments/sales");
  revalidatePath("/crm/training/departments/management");
  revalidatePath("/crm/training/departments/hr-ld");
  revalidatePath("/crm/training/departments/it-data");
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function optionalDate(value: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 19).replace("T", " ");
}

function payloadFromForm(formData: FormData): TrnPayload {
  const base = emptyPayload();
  const bool = (key: string) => formData.get(key) === "1" || formData.get(key) === "true" || formData.get(key) === "on";
  return {
    ...base,
    requester: text(formData, "requester"),
    targetRoles: text(formData, "targetRoles"),
    goal: text(formData, "goal"),
    skillGap: text(formData, "skillGap"),
    format: text(formData, "format") || base.format,
    learnerCount: text(formData, "learnerCount"),
    dateWindow: text(formData, "dateWindow"),
    category: text(formData, "category"),
    audience: text(formData, "audience"),
    outcomes: text(formData, "outcomes"),
    agenda: text(formData, "agenda"),
    materials: text(formData, "materials"),
    duration: text(formData, "duration"),
    durationConfirmed: bool("durationConfirmed"),
    assessmentMethod: text(formData, "assessmentMethod"),
    followUpMethod: text(formData, "followUpMethod"),
    language: text(formData, "language"),
    trainerName: text(formData, "trainerName"),
    programName: text(formData, "programName"),
    facilitator: text(formData, "facilitator"),
    learnerGroup: text(formData, "learnerGroup"),
    attendanceStatus: text(formData, "attendanceStatus") || base.attendanceStatus,
    materialsLink: text(formData, "materialsLink"),
    activityPlan: text(formData, "activityPlan"),
    rubric: text(formData, "rubric"),
    aggregatedResult: text(formData, "aggregatedResult"),
    reviewer: text(formData, "reviewer"),
    period: text(formData, "period"),
    visibility: text(formData, "visibility") || base.visibility,
    followUpAction: text(formData, "followUpAction"),
    ownerRole: text(formData, "ownerRole"),
    checkpoint: text(formData, "checkpoint"),
    support: text(formData, "support"),
    skills: text(formData, "skills"),
    credentials: text(formData, "credentials"),
    proofSource: text(formData, "proofSource"),
    verified: bool("verified"),
    metric: text(formData, "metric"),
    definition: text(formData, "definition"),
    method: text(formData, "method"),
    source: text(formData, "source"),
    sample: formData.get("sample") !== "0",
    value: text(formData, "value"),
    prompts: text(formData, "prompts"),
    selfCheck: text(formData, "selfCheck"),
    sizeNote: text(formData, "sizeNote"),
    privacyNote: text(formData, "privacyNote") || base.privacyNote,
  };
}

function validateRecord(kind: TrnKind, title: string, hotelName: string, payload: TrnPayload) {
  if (!title.trim() && !hotelName.trim()) return "required";
  if (payloadHasIndividualScores({ title, hotelName, payload })) return "blocked_scores";
  if (payloadHasSecrets({ title, hotelName, payload })) return "blocked_secret";
  if (kind === "program" && payload.duration && !payload.durationConfirmed) return "duration_unverified";
  if (payload.materialsLink && !URL_RE.test(payload.materialsLink)) return "invalid_url";
  return null;
}

export async function saveTrainingWork(formData: FormData) {
  const { user, access } = await requireTrainingOps();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const kind = isKind(text(formData, "kind")) ? normalizeKind(text(formData, "kind")) : "request";
  const title = text(formData, "title");
  const hotelName = text(formData, "hotelName");
  const payload = payloadFromForm(formData);
  const invalid = validateRecord(kind, title, hotelName, payload);
  if (invalid) return { ok: false as const, error: invalid };
  let id = text(formData, "id");
  if (!id) {
    id = await createTrainingOpsRecord(access, title || hotelName || TRN_SECTION_KIND.requests, kind, text(formData, "department") || "hr_ld");
  }
  const nextStatus = normalizeStatus(text(formData, "status") || defaultStatusForKind(kind));
  if (isTrnDeliveryStatus(nextStatus) && (await trainingRecordHasBlockedGate(id))) {
    return { ok: false as const, error: "blocked_gate" };
  }
  const saved = await saveTrainingOpsRecord(
    id,
    {
      kind,
      title: title || hotelName,
      hotelName,
      department: text(formData, "department") || "hr_ld",
      ownerId: text(formData, "ownerId") || access.userId,
      approverId: text(formData, "approverId"),
      trainerId: text(formData, "trainerId"),
      programId: text(formData, "programId"),
      status: nextStatus,
      priority: isPriority(text(formData, "priority")) ? normalizePriority(text(formData, "priority")) : "normal",
      eventAt: optionalDate(text(formData, "eventAt")),
      notes: text(formData, "notes"),
    },
    payload,
    user.id,
  );
  if (!saved) return { ok: false as const, error: "missing" };
  await writeAudit(id, user.id, "save", `Saved ${kind}`);
  revalidateTrainingOps();
  return { ok: true as const, id };
}

export async function changeTrainingStatus(formData: FormData) {
  const { user, access } = await requireTrainingOps();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  const status = normalizeStatus(text(formData, "status"));
  if (isTrnDeliveryStatus(status) && (await trainingRecordHasBlockedGate(id))) {
    return { ok: false as const, error: "blocked_gate" };
  }
  await patchTrainingOpsRecord(id, { status }, user.id);
  await writeAudit(id, user.id, "status", `Status ${status}`);
  revalidateTrainingOps();
  return { ok: true as const, id };
}

export async function assignTrainingWork(formData: FormData) {
  const { user, access } = await requireTrainingOps();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  await patchTrainingOpsRecord(id, { ownerId: text(formData, "ownerId") }, user.id);
  await writeAudit(id, user.id, "assign", "Assigned owner");
  revalidateTrainingOps();
  return { ok: true as const, id };
}

export async function archiveTrainingWork(formData: FormData) {
  const { user, access } = await requireTrainingOps();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  await patchTrainingOpsRecord(id, { archived: 1, status: "archived" }, user.id);
  await writeAudit(id, user.id, "archive", "Archived");
  revalidateTrainingOps();
  return { ok: true as const, id };
}

export async function removeTrainingWork(formData: FormData) {
  const { user, access } = await requireTrainingOps();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  await deleteTrainingOpsRecord(id);
  await writeAudit(id, user.id, "delete", "Deleted");
  revalidateTrainingOps();
  return { ok: true as const, id };
}

export async function saveTrainingSubtask(formData: FormData) {
  const { user, access } = await requireTrainingOps();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const recordId = text(formData, "recordId") || text(formData, "workflowId");
  const name = text(formData, "name");
  if (!recordId) return { ok: false as const, error: "missing" };
  if (!name) return { ok: false as const, error: "missing_name" };
  if (payloadHasSecrets(name) || payloadHasSecrets(text(formData, "comments"))) return { ok: false as const, error: "blocked_secret" };
  const count = await countTrainingOpsSubtasks(recordId);
  let id = text(formData, "id");
  const department = text(formData, "department") || "hr_ld";
  const data = {
    name,
    department,
    ownerId: text(formData, "ownerId") || access.userId,
    reviewerId: text(formData, "reviewerId"),
    status: normalizeSubtaskStatus(text(formData, "status")),
    completed: text(formData, "completed") === "1" || text(formData, "status") === "completed",
    dueAt: optionalDate(text(formData, "dueAt")),
    priority: isPriority(text(formData, "priority")) ? normalizePriority(text(formData, "priority")) : "normal",
    comments: text(formData, "comments"),
    evidence: text(formData, "evidence"),
    gateKind: normalizeGateKind(text(formData, "gateKind"), name, department),
  };
  if (data.evidence && !URL_RE.test(data.evidence)) return { ok: false as const, error: "invalid_url" };
  if (!id) {
    if (count >= MAX_TRN_SUBTASKS) return { ok: false as const, error: "subtask_limit" };
    id = await insertTrainingOpsSubtask({ ...data, recordId, userId: user.id });
  } else {
    await updateTrainingOpsSubtask(id, data);
  }
  await writeAudit(recordId, user.id, "subtask", `Subtask ${name}`);
  await applyTrainingGateBlock(recordId, user.id);
  revalidateTrainingOps();
  return { ok: true as const, id };
}

export async function completeTrainingSubtask(formData: FormData) {
  const { access } = await requireTrainingOps();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const done = text(formData, "completed") === "1";
  const id = text(formData, "id");
  const existing = id ? await getTrainingOpsSubtask(id) : null;
  if (existing) {
    if (!text(formData, "recordId")) formData.set("recordId", String(existing.recordId ?? ""));
    if (!text(formData, "name")) formData.set("name", String(existing.name ?? ""));
    if (!text(formData, "department")) formData.set("department", String(existing.department ?? "hr_ld"));
    if (!text(formData, "ownerId")) formData.set("ownerId", String(existing.ownerId ?? ""));
    if (!text(formData, "reviewerId")) formData.set("reviewerId", String(existing.reviewerId ?? ""));
    if (!text(formData, "priority")) formData.set("priority", String(existing.priority ?? "normal"));
    if (!text(formData, "comments")) formData.set("comments", String(existing.comments ?? ""));
    if (!text(formData, "evidence")) formData.set("evidence", String(existing.evidence ?? ""));
    if (!text(formData, "gateKind")) formData.set("gateKind", String(existing.gateKind ?? ""));
    if (!text(formData, "dueAt") && existing.dueAt) formData.set("dueAt", String(existing.dueAt));
  }
  formData.set("status", done ? "completed" : text(formData, "status") || "in_progress");
  formData.set("completed", done ? "1" : "0");
  return saveTrainingSubtask(formData);
}

export async function removeTrainingSubtask(formData: FormData) {
  const { user, access } = await requireTrainingOps();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const row = await getTrainingOpsSubtask(id);
  if (!row) return { ok: false as const, error: "missing" };
  const count = await countTrainingOpsSubtasks(String(row.recordId));
  if (count <= MIN_TRN_SUBTASKS) return { ok: false as const, error: "subtask_limit" };
  await deleteTrainingOpsSubtask(id);
  await writeAudit(String(row.recordId), user.id, "subtask", "Removed subtask");
  await applyTrainingGateBlock(String(row.recordId), user.id);
  revalidateTrainingOps();
  return { ok: true as const, id };
}

export async function addTrainingReviewerNote(formData: FormData) {
  const { user, access } = await requireTrainingOps();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const body = text(formData, "body") || text(formData, "notes");
  if (!id) return { ok: false as const, error: "missing" };
  if (!body) return { ok: false as const, error: "missing_comment" };
  if (payloadHasSecrets(body)) return { ok: false as const, error: "blocked_secret" };
  const row = await getTrainingOpsSubtask(id);
  if (!row) return { ok: false as const, error: "missing" };
  await insertTrainingOpsSubtaskComment(id, user.id, body);
  await updateTrainingOpsSubtask(id, {
    name: String(row.name ?? ""),
    department: String(row.department ?? "hr_ld"),
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
  await writeAudit(String(row.recordId), user.id, "review", body.slice(0, 120));
  await applyTrainingGateBlock(String(row.recordId), user.id);
  revalidateTrainingOps();
  return { ok: true as const, id };
}

export async function addTrainingSubtaskComment(formData: FormData) {
  const { user, access } = await requireTrainingOps();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const body = text(formData, "body");
  if (!body) return { ok: false as const, error: "missing_comment" };
  if (payloadHasSecrets(body)) return { ok: false as const, error: "blocked_secret" };
  const row = await getTrainingOpsSubtask(id);
  if (!row) return { ok: false as const, error: "missing" };
  await insertTrainingOpsSubtaskComment(id, user.id, body);
  await writeAudit(String(row.recordId), user.id, "comment", "Added comment");
  revalidateTrainingOps();
  return { ok: true as const, id };
}

export async function addTrainingApprovalNote(formData: FormData) {
  const { user, access } = await requireTrainingOps();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const notes = text(formData, "notes");
  if (!id) return { ok: false as const, error: "missing" };
  if (!notes) return { ok: false as const, error: "missing_note" };
  if (payloadHasSecrets(notes)) return { ok: false as const, error: "blocked_secret" };
  const decision = text(formData, "decision") || "awaiting";
  const status = decision === "approve" ? "approved" : decision === "reject" ? "rejected" : "awaiting";
  if (status === "approved" && (await trainingRecordHasBlockedGate(id))) return { ok: false as const, error: "blocked_gate" };
  const { appendTrainingOpsApproval } = await import("./queries");
  await appendTrainingOpsApproval(
    id,
    {
      id: `tap_${Date.now()}`,
      kind: "record",
      status,
      notes,
      requestedBy: user.id,
      decidedBy: user.id,
      createdAt: new Date().toISOString(),
    },
    user.id,
  );
  if (status === "approved") await patchTrainingOpsRecord(id, { status: "approved" }, user.id);
  if (status === "rejected") await patchTrainingOpsRecord(id, { status: "review" }, user.id);
  await writeAudit(id, user.id, "approval", `Approval ${status}`);
  revalidateTrainingOps();
  return { ok: true as const, id };
}

export async function escalateTrainingIssue(formData: FormData) {
  const { user, access } = await requireTrainingOps();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  const notes = text(formData, "notes");
  if (!id) return { ok: false as const, error: "missing" };
  if (!notes) return { ok: false as const, error: "missing_gate_note" };
  if (payloadHasSecrets(notes)) return { ok: false as const, error: "blocked_secret" };
  const { appendTrainingOpsApproval } = await import("./queries");
  await appendTrainingOpsApproval(
    id,
    {
      id: `tap_${Date.now()}`,
      kind: "Escalation",
      status: "awaiting",
      notes,
      requestedBy: user.id,
      decidedBy: "",
      createdAt: new Date().toISOString(),
    },
    user.id,
  );
  await patchTrainingOpsRecord(id, { status: "on_hold" }, user.id);
  await writeAudit(id, user.id, "escalate", notes.slice(0, 120));
  revalidateTrainingOps();
  return { ok: true as const, id };
}

export async function saveTrainingAccess(formData: FormData) {
  const { access } = await requireTrainingOps();
  if (!access.canManageSettings) return { ok: false as const, error: "forbidden" };
  const id = await saveTrainingOpsAccessRow(text(formData, "userId"), text(formData, "department") || "hr_ld", formData.get("canSeeParticipants") === "1");
  revalidateTrainingOps();
  return { ok: true as const, id };
}

export async function deleteTrainingAccess(formData: FormData) {
  const { access } = await requireTrainingOps();
  if (!access.canManageSettings) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  await deleteTrainingOpsAccessRow(id);
  revalidateTrainingOps();
  return { ok: true as const, id };
}

export async function saveTrainingBoardSettings(formData: FormData) {
  const { user, access } = await requireTrainingOps();
  if (!access.canManageSettings) return { ok: false as const, error: "forbidden" };
  let extras: TrnExtraDepartment[] = [];
  try {
    extras = JSON.parse(text(formData, "extraDepartmentsJson") || "[]") as TrnExtraDepartment[];
  } catch {
    return { ok: false as const, error: "invalid" };
  }
  await saveTrainingOpsSettingsRow(
    extras.filter((item) => item.id && item.label),
    user.id,
  );
  revalidateTrainingOps();
  return { ok: true as const, id: "default" };
}

export async function seedTrainingSubtasks(formData: FormData) {
  const { user, access } = await requireTrainingOps();
  if (!access.canEditBoard) return { ok: false as const, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false as const, error: "missing" };
  await seedStarterSubtasks(id, user.id, text(formData, "department") || "hr_ld");
  revalidateTrainingOps();
  return { ok: true as const, id };
}

export type { TrnSection };
