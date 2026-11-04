"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import { canOpenHotelMarketingOps, hmoCanUseDepartment, hotelMarketingOpsAccessFor } from "./access";
import { ensureHotelMarketingOpsSchema } from "./ensure";
import {
  appendHmoApproval,
  applyHmoGateBlock,
  asHmoPayload,
  countHmoSubtasks,
  deleteHmoRecord,
  deleteHmoSubtask,
  deleteHotelMarketingOpsAccessRow,
  getHmoRecordRaw,
  getHmoSubtask,
  getHotelMarketingOpsSettings,
  hmoRecordHasBlockedGate,
  hmoSqlDate,
  insertHmoRecord,
  insertHmoSubtask,
  insertHmoSubtaskComment,
  moveHmoSubtask,
  patchHmoRecord,
  saveHotelMarketingOpsAccessRow,
  saveHotelMarketingOpsSettingsRow,
  updateHmoRecord,
  updateHmoSubtask,
  writeHmoAudit,
  type HmoRecordWrite,
  type HmoSubtaskWrite,
} from "./queries";
import {
  HMO_BASE_PATH,
  HMO_DEPARTMENTS,
  MAX_HMO_EXTRA_DEPARTMENTS,
  MAX_HMO_SUBTASKS,
  hmoIsAllowedUrl,
  hmoPayloadHasSecrets,
  isHmoDepartment,
  isHmoKind,
  isHmoPriority,
  isHmoReleaseStatus,
  normalizeHmoGateKind,
  normalizeHmoKind,
  normalizeHmoPriority,
  normalizeHmoStatus,
  normalizeHmoSubtaskStatus,
  validateHmoRecord,
  defaultStatusForHmoKind,
  type HmoAccessView,
  type HmoExtraDepartment,
  type HmoKind,
} from "./types";

type ActionResult = { ok: true; id: string } | { ok: false; error: string };

async function requireHotelMarketingOps() {
  const user = await requireUser();
  if (!canOpenHotelMarketingOps(user)) redirect("/crm?error=forbidden");
  await ensureHotelMarketingOpsSchema();
  const access = await hotelMarketingOpsAccessFor(user);
  return { user, access };
}

function revalidateHotelMarketingOps() {
  revalidatePath("/crm");
  revalidatePath(HMO_BASE_PATH, "layout");
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function col(row: Record<string, unknown>, key: string) {
  const value = row[key];
  return value == null ? "" : String(value);
}

function isoOf(value: unknown) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

/** Loads a record and checks the user may work in its department. */
async function accessibleRecord(access: HmoAccessView, id: string) {
  const row = id ? await getHmoRecordRaw(id) : null;
  if (!row) return { error: "missing" as const };
  if (!hmoCanUseDepartment(access, col(row, "department"))) return { error: "forbidden" as const };
  return { row };
}

function canSetStatus(access: HmoAccessView, status: string, previous: string) {
  if (status === previous) return true;
  return !isHmoReleaseStatus(status) || access.canApprove;
}

/* ------------------------------------------------------------------ records */

export async function saveHotelMarketingRecord(formData: FormData): Promise<ActionResult> {
  const { user, access } = await requireHotelMarketingOps();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };

  const kind: HmoKind = isHmoKind(text(formData, "kind")) ? normalizeHmoKind(text(formData, "kind")) : "article";
  const title = text(formData, "title");
  let payloadSource: unknown = {};
  try {
    payloadSource = JSON.parse(text(formData, "payloadJson") || "{}");
  } catch {
    return { ok: false, error: "invalid" };
  }
  const payload = asHmoPayload(payloadSource);
  const channel = text(formData, "channel") || (kind === "campaign" || kind === "channel_plan" ? payload.channel : "");
  const nextAction = text(formData, "nextAction");
  if (kind === "campaign" || kind === "channel_plan") payload.channel = channel;
  if (kind === "campaign") payload.nextAction = nextAction;
  payload.relatedServiceHrefs = payload.relatedServiceHrefs.map((href) => href.trim()).filter(Boolean);

  const invalid = validateHmoRecord({ kind, title, channel, nextAction, category: text(formData, "category"), payload });
  if (invalid) return { ok: false, error: invalid };

  const settings = await getHotelMarketingOpsSettings();
  const department = text(formData, "department") || "marketing_content";
  if (!isHmoDepartment(department, settings.extraDepartments)) return { ok: false, error: "invalid" };
  if (!hmoCanUseDepartment(access, department)) return { ok: false, error: "forbidden" };

  const id = text(formData, "id");
  const previous = id ? await getHmoRecordRaw(id) : null;
  if (id && !previous) return { ok: false, error: "missing" };
  if (previous && !hmoCanUseDepartment(access, col(previous, "department"))) return { ok: false, error: "forbidden" };

  const previousStatus = previous ? normalizeHmoStatus(col(previous, "status")) : null;
  const status = normalizeHmoStatus(text(formData, "status") || defaultStatusForHmoKind(kind));
  if (!canSetStatus(access, status, previousStatus ?? "new")) return { ok: false, error: "forbidden_approve" };
  if (id && isHmoReleaseStatus(status) && status !== previousStatus && (await hmoRecordHasBlockedGate(id))) {
    return { ok: false, error: "blocked_gate" };
  }

  const data: HmoRecordWrite = {
    kind,
    title,
    category: text(formData, "category"),
    department,
    ownerId: text(formData, "ownerId") || access.userId,
    authorId: text(formData, "authorId"),
    reviewerId: text(formData, "reviewerId"),
    status,
    priority: isHmoPriority(text(formData, "priority")) ? normalizeHmoPriority(text(formData, "priority")) : "normal",
    channel,
    publishAt: hmoSqlDate(text(formData, "publishAt")),
    lastReviewAt: hmoSqlDate(text(formData, "lastReviewAt")),
    nextAction,
    nextActionOwnerId: text(formData, "nextActionOwnerId"),
    dueAt: hmoSqlDate(text(formData, "dueAt")),
    payload,
  };

  if (!previous) {
    const created = await insertHmoRecord(data, user.id);
    if (status === "archived") await patchHmoRecord(created, { archived: 1 }, user.id);
    await writeHmoAudit(created, user.id, "create", `Created ${kind}: ${title}`);
    revalidateHotelMarketingOps();
    return { ok: true, id: created };
  }

  const changed: string[] = [];
  const compare: Array<[string, string, string]> = [
    ["title", col(previous, "title"), data.title],
    ["kind", col(previous, "kind"), data.kind],
    ["department", col(previous, "department"), data.department],
    ["owner", col(previous, "ownerId"), data.ownerId],
    ["reviewer", col(previous, "reviewerId"), data.reviewerId],
    ["priority", col(previous, "priority"), data.priority],
    ["channel", col(previous, "channel"), data.channel],
    ["publishAt", isoOf(previous.publishAt), data.publishAt ? new Date(`${data.publishAt.replace(" ", "T")}Z`).toISOString() : ""],
    ["dueAt", isoOf(previous.dueAt), data.dueAt ? new Date(`${data.dueAt.replace(" ", "T")}Z`).toISOString() : ""],
    ["nextAction", col(previous, "nextAction"), data.nextAction],
  ];
  for (const [field, before, after] of compare) if (before !== after) changed.push(field);
  let previousPayload: unknown = {};
  try {
    previousPayload = JSON.parse(col(previous, "payloadJson") || "{}");
  } catch {
    previousPayload = {};
  }
  const beforePayload = JSON.stringify(asHmoPayload(previousPayload));
  if (beforePayload !== JSON.stringify(payload)) changed.push("details");

  await updateHmoRecord(id, data, user.id);
  if (status === "archived") await patchHmoRecord(id, { archived: 1 }, user.id);
  else if (previousStatus === "archived" || previous.archived) await patchHmoRecord(id, { archived: 0 }, user.id);
  await writeHmoAudit(id, user.id, "update", changed.length ? `Updated ${changed.join(", ")}` : "Saved without field changes");
  if (previousStatus !== status) await writeHmoAudit(id, user.id, "status", `Status ${previousStatus} → ${status}`);
  revalidateHotelMarketingOps();
  return { ok: true, id };
}

export async function changeHotelMarketingStatus(formData: FormData): Promise<ActionResult> {
  const { user, access } = await requireHotelMarketingOps();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const found = await accessibleRecord(access, id);
  if (found.error) return { ok: false, error: found.error };
  const previous = normalizeHmoStatus(col(found.row, "status"));
  const status = normalizeHmoStatus(text(formData, "status"));
  if (!canSetStatus(access, status, previous)) return { ok: false, error: "forbidden_approve" };
  if (isHmoReleaseStatus(status) && status !== previous && (await hmoRecordHasBlockedGate(id))) return { ok: false, error: "blocked_gate" };
  await patchHmoRecord(id, { status, archived: status === "archived" ? 1 : 0 }, user.id);
  await writeHmoAudit(id, user.id, "status", `Status ${previous} → ${status}`);
  revalidateHotelMarketingOps();
  return { ok: true, id };
}

export async function assignHotelMarketingOwner(formData: FormData): Promise<ActionResult> {
  const { user, access } = await requireHotelMarketingOps();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const found = await accessibleRecord(access, id);
  if (found.error) return { ok: false, error: found.error };
  const ownerId = text(formData, "ownerId");
  await patchHmoRecord(id, { ownerId }, user.id);
  await writeHmoAudit(id, user.id, "assign", `Owner ${col(found.row, "ownerId") || "—"} → ${ownerId || "—"}`);
  revalidateHotelMarketingOps();
  return { ok: true, id };
}

export async function archiveHotelMarketingRecord(formData: FormData): Promise<ActionResult> {
  const { user, access } = await requireHotelMarketingOps();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const found = await accessibleRecord(access, id);
  if (found.error) return { ok: false, error: found.error };
  await patchHmoRecord(id, { archived: 1, status: "archived" }, user.id);
  await writeHmoAudit(id, user.id, "archive", `Archived (was ${col(found.row, "status")})`);
  revalidateHotelMarketingOps();
  return { ok: true, id };
}

export async function removeHotelMarketingRecord(formData: FormData): Promise<ActionResult> {
  const { user, access } = await requireHotelMarketingOps();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const found = await accessibleRecord(access, id);
  if (found.error) return { ok: false, error: found.error };
  await deleteHmoRecord(id);
  await writeHmoAudit(id, user.id, "delete", `Deleted ${col(found.row, "kind")}: ${col(found.row, "title")}`);
  revalidateHotelMarketingOps();
  return { ok: true, id };
}

/* ------------------------------------------------------------------ subtasks */

function subtaskData(formData: FormData, userId: string): HmoSubtaskWrite {
  const name = text(formData, "name");
  const status = normalizeHmoSubtaskStatus(text(formData, "status"));
  return {
    name,
    department: text(formData, "department") || "marketing_content",
    ownerId: text(formData, "ownerId") || userId,
    reviewerId: text(formData, "reviewerId"),
    status,
    completed: text(formData, "completed") === "1" || status === "completed",
    dueAt: hmoSqlDate(text(formData, "dueAt")),
    priority: isHmoPriority(text(formData, "priority")) ? normalizeHmoPriority(text(formData, "priority")) : "normal",
    comments: text(formData, "comments"),
    evidence: text(formData, "evidence"),
    gateKind: normalizeHmoGateKind(text(formData, "gateKind"), name),
  };
}

export async function saveHotelMarketingSubtask(formData: FormData): Promise<ActionResult> {
  const { user, access } = await requireHotelMarketingOps();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const recordId = text(formData, "recordId");
  const found = await accessibleRecord(access, recordId);
  if (found.error) return { ok: false, error: found.error };
  const data = subtaskData(formData, user.id);
  if (!data.name) return { ok: false, error: "missing_name" };
  const settings = await getHotelMarketingOpsSettings();
  if (!isHmoDepartment(data.department, settings.extraDepartments)) return { ok: false, error: "invalid" };
  if (hmoPayloadHasSecrets([data.name, data.comments, data.evidence])) return { ok: false, error: "blocked_secret" };
  if (!hmoIsAllowedUrl(data.evidence)) return { ok: false, error: "invalid_url" };

  let id = text(formData, "id");
  if (!id) {
    if ((await countHmoSubtasks(recordId)) >= MAX_HMO_SUBTASKS) return { ok: false, error: "subtask_limit" };
    id = await insertHmoSubtask(recordId, data, user.id);
    await writeHmoAudit(recordId, user.id, "subtask", `Added subtask: ${data.name}`);
  } else {
    const existing = await getHmoSubtask(id);
    if (!existing || col(existing, "recordId") !== recordId) return { ok: false, error: "missing" };
    await updateHmoSubtask(id, data);
    await writeHmoAudit(recordId, user.id, "subtask", `Updated subtask: ${data.name} (${data.status})`);
  }
  await applyHmoGateBlock(recordId, user.id);
  revalidateHotelMarketingOps();
  return { ok: true, id };
}

export async function completeHotelMarketingSubtask(formData: FormData): Promise<ActionResult> {
  const { user, access } = await requireHotelMarketingOps();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const existing = id ? await getHmoSubtask(id) : null;
  if (!existing) return { ok: false, error: "missing" };
  const found = await accessibleRecord(access, col(existing, "recordId"));
  if (found.error) return { ok: false, error: found.error };
  const done = text(formData, "completed") === "1";
  await updateHmoSubtask(id, {
    name: col(existing, "name"),
    department: col(existing, "department"),
    ownerId: col(existing, "ownerId"),
    reviewerId: col(existing, "reviewerId"),
    status: done ? "completed" : "in_progress",
    completed: done,
    dueAt: hmoSqlDate(isoOf(existing.dueAt)),
    priority: col(existing, "priority") || "normal",
    comments: col(existing, "comments"),
    evidence: col(existing, "evidence"),
    gateKind: normalizeHmoGateKind(col(existing, "gateKind"), col(existing, "name")),
  });
  await writeHmoAudit(col(existing, "recordId"), user.id, "subtask", `${done ? "Completed" : "Reopened"} subtask: ${col(existing, "name")}`);
  await applyHmoGateBlock(col(existing, "recordId"), user.id);
  revalidateHotelMarketingOps();
  return { ok: true, id };
}

export async function updateHotelMarketingSubtaskStatus(formData: FormData): Promise<ActionResult> {
  const { user, access } = await requireHotelMarketingOps();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const existing = id ? await getHmoSubtask(id) : null;
  if (!existing) return { ok: false, error: "missing" };
  const found = await accessibleRecord(access, col(existing, "recordId"));
  if (found.error) return { ok: false, error: found.error };
  const status = normalizeHmoSubtaskStatus(text(formData, "status"));
  await updateHmoSubtask(id, {
    name: col(existing, "name"),
    department: col(existing, "department"),
    ownerId: col(existing, "ownerId"),
    reviewerId: col(existing, "reviewerId"),
    status,
    completed: status === "completed",
    dueAt: hmoSqlDate(isoOf(existing.dueAt)),
    priority: col(existing, "priority") || "normal",
    comments: col(existing, "comments"),
    evidence: col(existing, "evidence"),
    gateKind: normalizeHmoGateKind(col(existing, "gateKind"), col(existing, "name")),
  });
  await writeHmoAudit(col(existing, "recordId"), user.id, "subtask", `Subtask ${col(existing, "name")} → ${status}`);
  await applyHmoGateBlock(col(existing, "recordId"), user.id);
  revalidateHotelMarketingOps();
  return { ok: true, id };
}

export async function removeHotelMarketingSubtask(formData: FormData): Promise<ActionResult> {
  const { user, access } = await requireHotelMarketingOps();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const existing = id ? await getHmoSubtask(id) : null;
  if (!existing) return { ok: false, error: "missing" };
  const found = await accessibleRecord(access, col(existing, "recordId"));
  if (found.error) return { ok: false, error: found.error };
  await deleteHmoSubtask(id);
  await writeHmoAudit(col(existing, "recordId"), user.id, "subtask", `Removed subtask: ${col(existing, "name")}`);
  await applyHmoGateBlock(col(existing, "recordId"), user.id);
  revalidateHotelMarketingOps();
  return { ok: true, id };
}

export async function reorderHotelMarketingSubtask(formData: FormData): Promise<ActionResult> {
  const { user, access } = await requireHotelMarketingOps();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const direction = text(formData, "direction") === "up" ? "up" : "down";
  const existing = id ? await getHmoSubtask(id) : null;
  if (!existing) return { ok: false, error: "missing" };
  const found = await accessibleRecord(access, col(existing, "recordId"));
  if (found.error) return { ok: false, error: found.error };
  await moveHmoSubtask(id, direction);
  await writeHmoAudit(col(existing, "recordId"), user.id, "subtask", `Moved subtask ${direction}: ${col(existing, "name")}`);
  revalidateHotelMarketingOps();
  return { ok: true, id };
}

export async function addHotelMarketingSubtaskComment(formData: FormData): Promise<ActionResult> {
  const { user, access } = await requireHotelMarketingOps();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const body = text(formData, "body");
  if (!body) return { ok: false, error: "missing_comment" };
  if (hmoPayloadHasSecrets(body)) return { ok: false, error: "blocked_secret" };
  const existing = id ? await getHmoSubtask(id) : null;
  if (!existing) return { ok: false, error: "missing" };
  const found = await accessibleRecord(access, col(existing, "recordId"));
  if (found.error) return { ok: false, error: found.error };
  await insertHmoSubtaskComment(id, user.id, body);
  await writeHmoAudit(col(existing, "recordId"), user.id, "comment", `Comment on subtask: ${col(existing, "name")}`);
  revalidateHotelMarketingOps();
  return { ok: true, id };
}

function writeFromExistingSubtask(existing: Record<string, unknown>, patch: Partial<HmoSubtaskWrite>): HmoSubtaskWrite {
  const name = patch.name ?? col(existing, "name");
  const status = patch.status ?? normalizeHmoSubtaskStatus(col(existing, "status"));
  return {
    name,
    department: patch.department ?? col(existing, "department"),
    ownerId: patch.ownerId ?? col(existing, "ownerId"),
    reviewerId: patch.reviewerId ?? col(existing, "reviewerId"),
    status,
    completed: patch.completed ?? status === "completed",
    dueAt: patch.dueAt !== undefined ? patch.dueAt : hmoSqlDate(isoOf(existing.dueAt)),
    priority: patch.priority ?? (col(existing, "priority") || "normal"),
    comments: patch.comments ?? col(existing, "comments"),
    evidence: patch.evidence ?? col(existing, "evidence"),
    gateKind: patch.gateKind ?? normalizeHmoGateKind(col(existing, "gateKind"), name),
  };
}

/** Escalate a subtask: mark blocked (or needs_review), assign reviewer, attach note as evidence comment. Blocking gates stop publication. */
export async function escalateHotelMarketingSubtask(formData: FormData): Promise<ActionResult> {
  const { user, access } = await requireHotelMarketingOps();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const notes = text(formData, "notes");
  const reviewerId = text(formData, "reviewerId");
  if (!notes) return { ok: false, error: "missing_escalate_note" };
  if (hmoPayloadHasSecrets(notes)) return { ok: false, error: "blocked_secret" };
  const existing = id ? await getHmoSubtask(id) : null;
  if (!existing) return { ok: false, error: "missing" };
  const found = await accessibleRecord(access, col(existing, "recordId"));
  if (found.error) return { ok: false, error: found.error };
  const nextReviewer = reviewerId || col(existing, "reviewerId");
  if (!nextReviewer) return { ok: false, error: "missing_reviewer" };

  const target = text(formData, "target") === "needs_review" ? "needs_review" : "blocked";
  const currentGate = normalizeHmoGateKind(col(existing, "gateKind"), col(existing, "name"));
  const gateKind = currentGate === "none" ? "approval" : currentGate;

  await updateHmoSubtask(
    id,
    writeFromExistingSubtask(existing, {
      status: target,
      completed: false,
      reviewerId: nextReviewer,
      gateKind,
      comments: [col(existing, "comments"), `Escalate: ${notes}`].filter(Boolean).join("\n").slice(0, 2000),
    }),
  );
  await insertHmoSubtaskComment(id, user.id, `Escalate → ${target}: ${notes}`);
  await writeHmoAudit(col(existing, "recordId"), user.id, "subtask", `Escalated subtask: ${col(existing, "name")} → ${target}`);
  await applyHmoGateBlock(col(existing, "recordId"), user.id);
  revalidateHotelMarketingOps();
  return { ok: true, id };
}

/** Reviewer/approver decides a subtask: approve (complete) or reject (needs_review / blocked). */
export async function decideHotelMarketingSubtask(formData: FormData): Promise<ActionResult> {
  const { user, access } = await requireHotelMarketingOps();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const notes = text(formData, "notes");
  const decision = text(formData, "decision");
  if (!notes) return { ok: false, error: "missing_escalate_note" };
  if (hmoPayloadHasSecrets(notes)) return { ok: false, error: "blocked_secret" };
  if (decision !== "approve" && decision !== "reject") return { ok: false, error: "invalid" };
  const existing = id ? await getHmoSubtask(id) : null;
  if (!existing) return { ok: false, error: "missing" };
  const found = await accessibleRecord(access, col(existing, "recordId"));
  if (found.error) return { ok: false, error: found.error };

  const reviewerId = col(existing, "reviewerId");
  const canDecide = access.canApprove || (reviewerId !== "" && reviewerId === user.id);
  if (!canDecide) return { ok: false, error: "forbidden_review" };

  const status = decision === "approve" ? "completed" : text(formData, "rejectAs") === "blocked" ? "blocked" : "needs_review";
  await updateHmoSubtask(
    id,
    writeFromExistingSubtask(existing, {
      status,
      completed: decision === "approve",
      comments: [col(existing, "comments"), `${decision === "approve" ? "Approved" : "Rejected"}: ${notes}`].filter(Boolean).join("\n").slice(0, 2000),
    }),
  );
  await insertHmoSubtaskComment(id, user.id, `${decision === "approve" ? "Approve" : "Reject"}: ${notes}`);
  await writeHmoAudit(
    col(existing, "recordId"),
    user.id,
    "subtask",
    `${decision === "approve" ? "Approved" : "Rejected"} subtask: ${col(existing, "name")}`,
  );
  await applyHmoGateBlock(col(existing, "recordId"), user.id);
  revalidateHotelMarketingOps();
  return { ok: true, id };
}

/* ------------------------------------------------------------------ approvals */

export async function decideHotelMarketingApproval(formData: FormData): Promise<ActionResult> {
  const { user, access } = await requireHotelMarketingOps();
  if (!access.canEditBoard) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  const found = await accessibleRecord(access, id);
  if (found.error) return { ok: false, error: found.error };
  const notes = text(formData, "notes");
  if (!notes) return { ok: false, error: "missing_note" };
  if (hmoPayloadHasSecrets(notes)) return { ok: false, error: "blocked_secret" };

  const decision = text(formData, "decision");
  const decided = decision === "approve" || decision === "reject" || decision === "changes";
  if (decided && !access.canApprove) return { ok: false, error: "forbidden_approve" };
  if (decision === "approve" && (await hmoRecordHasBlockedGate(id))) return { ok: false, error: "blocked_gate" };

  const approvalStatus = decision === "approve" ? "approved" : decision === "reject" ? "rejected" : decision === "changes" ? "changes_requested" : "awaiting";
  const nextStatus = decision === "approve" ? "approved" : decision === "reject" ? "blocked" : decision === "changes" ? "in_progress" : "in_review";
  const previous = normalizeHmoStatus(col(found.row, "status"));

  await appendHmoApproval(
    id,
    {
      id: `hmp_${Date.now()}`,
      kind: decided ? "decision" : "review request",
      status: approvalStatus,
      notes,
      requestedBy: decided ? "" : user.id,
      decidedBy: decided ? user.id : "",
      createdAt: new Date().toISOString(),
    },
    user.id,
  );
  const patch: Record<string, string> = { status: nextStatus };
  if (decided && !col(found.row, "reviewerId")) patch.reviewerId = user.id;
  await patchHmoRecord(id, patch, user.id);
  await writeHmoAudit(id, user.id, "approval", `Approval ${approvalStatus}: ${notes.slice(0, 160)}`);
  if (previous !== nextStatus) await writeHmoAudit(id, user.id, "status", `Status ${previous} → ${nextStatus}`);
  revalidateHotelMarketingOps();
  return { ok: true, id };
}

/* ------------------------------------------------------------------ settings */

export async function saveHotelMarketingAccess(formData: FormData): Promise<ActionResult> {
  const { access } = await requireHotelMarketingOps();
  if (!access.canManageSettings) return { ok: false, error: "forbidden" };
  const userId = text(formData, "userId");
  if (!userId) return { ok: false, error: "missing_user" };
  const department = text(formData, "department") || "marketing_content";
  const settings = await getHotelMarketingOpsSettings();
  if (!isHmoDepartment(department, settings.extraDepartments)) return { ok: false, error: "invalid" };
  const id = await saveHotelMarketingOpsAccessRow(userId, department, formData.get("canApprove") === "1");
  revalidateHotelMarketingOps();
  return { ok: true, id };
}

export async function deleteHotelMarketingAccess(formData: FormData): Promise<ActionResult> {
  const { access } = await requireHotelMarketingOps();
  if (!access.canManageSettings) return { ok: false, error: "forbidden" };
  const id = text(formData, "id");
  if (!id) return { ok: false, error: "missing" };
  await deleteHotelMarketingOpsAccessRow(id);
  revalidateHotelMarketingOps();
  return { ok: true, id };
}

export async function saveHotelMarketingBoardSettings(formData: FormData): Promise<ActionResult> {
  const { user, access } = await requireHotelMarketingOps();
  if (!access.canManageSettings) return { ok: false, error: "forbidden" };
  let parsed: HmoExtraDepartment[] = [];
  try {
    const value = JSON.parse(text(formData, "extraDepartmentsJson") || "[]");
    parsed = Array.isArray(value) ? value : [];
  } catch {
    return { ok: false, error: "invalid" };
  }
  const seen = new Set<string>(HMO_DEPARTMENTS);
  const extras: HmoExtraDepartment[] = [];
  for (const item of parsed) {
    const label = String(item?.label ?? "").trim().slice(0, 80);
    const id = String(item?.id ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 48);
    if (!id && !label) continue;
    if (!id || !label || seen.has(id)) return { ok: false, error: "duplicate_department" };
    seen.add(id);
    extras.push({ id, label });
  }
  if (extras.length > MAX_HMO_EXTRA_DEPARTMENTS) return { ok: false, error: "invalid" };
  if (hmoPayloadHasSecrets(extras)) return { ok: false, error: "blocked_secret" };
  await saveHotelMarketingOpsSettingsRow(extras, user.id);
  revalidateHotelMarketingOps();
  return { ok: true, id: "default" };
}
