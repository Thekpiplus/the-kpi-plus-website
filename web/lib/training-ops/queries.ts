import { prisma } from "@/lib/crm/db";
import { randomToken } from "@/lib/crm/security";
import { staffDirectory } from "@/lib/crm/queries";
import { trainingOpsAccessFor } from "./access";
import { ensureTrainingOpsSchema } from "./ensure";
import { trnSubtaskProgress } from "./progress";
import {
  MASKED_VALUE,
  MAX_TRN_SUBTASKS,
  TRN_PRIORITY_RANK,
  TRN_SECTION_KIND,
  TRN_STARTER_SUBTASKS,
  defaultStatusForKind,
  emptyPayload,
  isApprovalStatus,
  isAttendance,
  isFormat,
  isGroupBy,
  isKind,
  isPriority,
  isSort,
  isTrnDeliveryStatus,
  isVisibility,
  normalizeApprovalStatus,
  normalizeAttendance,
  normalizeFormat,
  normalizeGateKind,
  normalizeKind,
  normalizePriority,
  normalizeStatus,
  normalizeSubtaskStatus,
  normalizeVisibility,
  payloadHasSecrets,
  type TrnAccessView,
  type TrnApprovalView,
  type TrnAuditView,
  type TrnExtraDepartment,
  type TrnGroupBy,
  type TrnKind,
  type TrnListFilters,
  type TrnPayload,
  type TrnRecordRow,
  type TrnSection,
  type TrnSettings,
  type TrnSort,
  type TrnSubtaskCommentView,
  type TrnSubtaskView,
} from "./types";

function col(row: Record<string, unknown>, key: string) {
  const value = row[key];
  if (value == null) return "";
  return String(value);
}

function iso(value: Date | string | null | undefined) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null || value === "") return fallback;
  if (typeof value !== "string") return (value as T) ?? fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function asPayload(value: unknown): TrnPayload {
  const raw = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  const empty = emptyPayload();
  return {
    requester: String(raw.requester ?? ""),
    targetRoles: String(raw.targetRoles ?? ""),
    goal: String(raw.goal ?? ""),
    skillGap: String(raw.skillGap ?? ""),
    format: isFormat(String(raw.format ?? "")) ? normalizeFormat(String(raw.format)) : empty.format,
    learnerCount: String(raw.learnerCount ?? ""),
    dateWindow: String(raw.dateWindow ?? ""),
    category: String(raw.category ?? ""),
    audience: String(raw.audience ?? ""),
    outcomes: String(raw.outcomes ?? ""),
    agenda: String(raw.agenda ?? ""),
    materials: String(raw.materials ?? ""),
    duration: String(raw.duration ?? ""),
    durationConfirmed: Boolean(raw.durationConfirmed),
    assessmentMethod: String(raw.assessmentMethod ?? ""),
    followUpMethod: String(raw.followUpMethod ?? ""),
    language: String(raw.language ?? ""),
    trainerName: String(raw.trainerName ?? ""),
    programName: String(raw.programName ?? ""),
    facilitator: String(raw.facilitator ?? ""),
    learnerGroup: String(raw.learnerGroup ?? ""),
    attendanceStatus: isAttendance(String(raw.attendanceStatus ?? ""))
      ? normalizeAttendance(String(raw.attendanceStatus))
      : empty.attendanceStatus,
    materialsLink: String(raw.materialsLink ?? ""),
    activityPlan: String(raw.activityPlan ?? ""),
    rubric: String(raw.rubric ?? ""),
    aggregatedResult: String(raw.aggregatedResult ?? ""),
    reviewer: String(raw.reviewer ?? ""),
    period: String(raw.period ?? ""),
    visibility: isVisibility(String(raw.visibility ?? "")) ? normalizeVisibility(String(raw.visibility)) : empty.visibility,
    followUpAction: String(raw.followUpAction ?? ""),
    ownerRole: String(raw.ownerRole ?? ""),
    checkpoint: String(raw.checkpoint ?? ""),
    support: String(raw.support ?? ""),
    skills: String(raw.skills ?? ""),
    credentials: String(raw.credentials ?? ""),
    proofSource: String(raw.proofSource ?? ""),
    verified: Boolean(raw.verified),
    metric: String(raw.metric ?? ""),
    definition: String(raw.definition ?? ""),
    method: String(raw.method ?? ""),
    source: String(raw.source ?? ""),
    sample: raw.sample === undefined ? true : Boolean(raw.sample),
    value: String(raw.value ?? ""),
    prompts: String(raw.prompts ?? ""),
    selfCheck: String(raw.selfCheck ?? ""),
    sizeNote: String(raw.sizeNote ?? ""),
    privacyNote: String(raw.privacyNote ?? empty.privacyNote),
  };
}

function maskPayload(payload: TrnPayload, canSeeParticipants: boolean): TrnPayload {
  if (canSeeParticipants) return payload;
  return {
    ...payload,
    learnerGroup: payload.learnerGroup ? MASKED_VALUE : "",
    aggregatedResult: payload.visibility === "restricted" ? MASKED_VALUE : payload.aggregatedResult,
    credentials: payload.verified ? payload.credentials : "",
  };
}

export async function trainingRecordHasBlockedGate(recordId: string) {
  const subtaskRows = await prisma()
    .$queryRawUnsafe<Array<{ status: string; gateKind: string; name: string; department: string }>>(
      `SELECT status, gateKind, name, department FROM TrainingOpsSubtask WHERE recordId = ?`,
      recordId,
    )
    .catch(() => []);
  return trnSubtaskProgress(
    subtaskRows.map((item) => ({
      completed: item.status === "completed",
      status: item.status,
      gateKind: normalizeGateKind(item.gateKind, item.name, item.department),
      name: item.name,
    })),
  ).blockedByGate;
}

export async function applyTrainingGateBlock(recordId: string, userId: string) {
  const blocked = await trainingRecordHasBlockedGate(recordId);
  if (!blocked) return false;
  const rows = await prisma()
    .$queryRawUnsafe<Array<{ status: string }>>(`SELECT status FROM TrainingOpsRecord WHERE id = ? LIMIT 1`, recordId)
    .catch(() => []);
  const status = normalizeStatus(rows[0]?.status || "draft");
  if (status === "cancelled" || status === "archived" || status === "on_hold") return true;
  if (!isTrnDeliveryStatus(status)) return true;
  await prisma().$executeRawUnsafe(`UPDATE TrainingOpsRecord SET status='on_hold', updatedBy=?, updatedAt=NOW(3) WHERE id=?`, userId, recordId);
  await writeAudit(recordId, userId, "status", "Status → on_hold (blocked training gate)");
  return true;
}

export async function getTrainingOpsSettings(): Promise<TrnSettings> {
  const rows = await prisma()
    .$queryRawUnsafe<Array<{ extraDepartmentsJson: string | null }>>(`SELECT extraDepartmentsJson FROM TrainingOpsSettings WHERE id = 'default' LIMIT 1`)
    .catch(() => []);
  const extras = parseJson<TrnExtraDepartment[]>(rows[0]?.extraDepartmentsJson, []);
  return { extraDepartments: Array.isArray(extras) ? extras.filter((item) => item.id && item.label) : [] };
}

export async function saveTrainingOpsSettingsRow(extras: TrnExtraDepartment[], userId: string) {
  const json = JSON.stringify(extras);
  const existing = await prisma()
    .$queryRawUnsafe<Array<{ id: string }>>(`SELECT id FROM TrainingOpsSettings WHERE id = 'default' LIMIT 1`)
    .catch(() => []);
  if (existing[0]) {
    await prisma().$executeRawUnsafe(
      `UPDATE TrainingOpsSettings SET extraDepartmentsJson=?, updatedBy=?, updatedAt=NOW(3) WHERE id='default'`,
      json,
      userId,
    );
    return;
  }
  await prisma().$executeRawUnsafe(
    `INSERT INTO TrainingOpsSettings (id, extraDepartmentsJson, updatedBy, updatedAt) VALUES ('default', ?, ?, NOW(3))`,
    json,
    userId,
  );
}

export async function listTrainingOpsAccessRows() {
  await ensureTrainingOpsSchema();
  const [rows, staff] = await Promise.all([
    prisma()
      .$queryRawUnsafe<Array<{ id: string; userId: string; department: string; canSeeParticipants: number | boolean }>>(
        `SELECT id, userId, department, canSeeParticipants FROM TrainingOpsAccess ORDER BY department ASC`,
      )
      .catch(() => []),
    staffDirectory(),
  ]);
  return {
    rows: rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      department: row.department,
      canSeeParticipants: Boolean(row.canSeeParticipants),
    })),
    staff: staff.map((item) => ({ id: item.id, name: item.name, email: item.email })),
    settings: await getTrainingOpsSettings(),
  };
}

export async function saveTrainingOpsAccessRow(userId: string, department: string, canSeeParticipants: boolean) {
  const existing = await prisma()
    .$queryRawUnsafe<Array<{ id: string }>>(`SELECT id FROM TrainingOpsAccess WHERE userId = ? AND department = ? LIMIT 1`, userId, department)
    .catch(() => []);
  if (existing[0]) {
    await prisma().$executeRawUnsafe(
      `UPDATE TrainingOpsAccess SET canSeeParticipants=?, updatedAt=NOW(3) WHERE id=?`,
      canSeeParticipants ? 1 : 0,
      existing[0].id,
    );
    return existing[0].id;
  }
  const id = `tra_${randomToken(10)}`;
  await prisma().$executeRawUnsafe(
    `INSERT INTO TrainingOpsAccess (id, userId, department, canSeeParticipants, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(3), NOW(3))`,
    id,
    userId,
    department,
    canSeeParticipants ? 1 : 0,
  );
  return id;
}

export async function deleteTrainingOpsAccessRow(id: string) {
  await prisma().$executeRawUnsafe(`DELETE FROM TrainingOpsAccess WHERE id = ?`, id);
}

export async function writeAudit(recordId: string, userId: string, action: string, detail: string) {
  if (payloadHasSecrets(detail)) return;
  await prisma().$executeRawUnsafe(
    `INSERT INTO TrainingOpsAudit (id, recordId, action, detail, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, NOW(3))`,
    `tau_${randomToken(10)}`,
    recordId,
    action,
    detail,
    userId,
  );
}

export async function createTrainingOpsRecord(access: TrnAccessView, title: string, kind: TrnKind, department?: string) {
  const id = `trt_${randomToken(10)}`;
  const payload = emptyPayload();
  await prisma().$executeRawUnsafe(
    `INSERT INTO TrainingOpsRecord (id, kind, title, hotelName, department, ownerId, approverId, trainerId, programId, status, priority, eventAt, notes, archived, payloadJson, createdBy, updatedBy, createdAt, updatedAt)
     VALUES (?, ?, ?, '', ?, ?, '', '', '', ?, 'normal', NULL, '', 0, ?, ?, ?, NOW(3), NOW(3))`,
    id,
    kind,
    title,
    department || "hr_ld",
    access.userId,
    defaultStatusForKind(kind),
    JSON.stringify(payload),
    access.userId,
    access.userId,
  );
  await writeAudit(id, access.userId, "create", `Created ${kind} ${title}`);
  await seedStarterSubtasks(id, access.userId, department || "hr_ld");
  return id;
}

export async function seedStarterSubtasks(recordId: string, userId: string, department = "hr_ld") {
  const existing = await prisma()
    .$queryRawUnsafe<Array<{ id: string }>>(`SELECT id FROM TrainingOpsSubtask WHERE recordId = ? LIMIT 1`, recordId)
    .catch(() => []);
  if (existing.length) return;
  const starters = TRN_STARTER_SUBTASKS.filter((item) => item.department === department).slice(0, MAX_TRN_SUBTASKS);
  let sort = 0;
  for (const item of starters) {
    sort += 1;
    await prisma().$executeRawUnsafe(
      `INSERT INTO TrainingOpsSubtask (id, recordId, name, department, ownerId, reviewerId, status, completed, dueAt, priority, comments, evidence, gateKind, sortOrder, createdBy, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, '', 'not_started', 0, NULL, 'normal', '', '', ?, ?, ?, NOW(3), NOW(3))`,
      `tst_${randomToken(10)}`,
      recordId,
      item.name,
      item.department,
      userId,
      item.gateKind,
      sort,
      userId,
    );
  }
}

export async function countTrainingOpsSubtasks(recordId: string) {
  const rows = await prisma()
    .$queryRawUnsafe<Array<{ count: number }>>(`SELECT COUNT(*) AS count FROM TrainingOpsSubtask WHERE recordId = ?`, recordId)
    .catch(() => [{ count: 0 }]);
  return Number(rows[0]?.count || 0);
}

export async function getTrainingOpsSubtask(id: string) {
  const rows = await prisma().$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM TrainingOpsSubtask WHERE id = ? LIMIT 1`, id);
  return rows[0] || null;
}

export async function insertTrainingOpsSubtask(data: {
  recordId: string;
  name: string;
  department: string;
  ownerId: string;
  reviewerId: string;
  status: string;
  completed: boolean;
  dueAt: string | null;
  priority: string;
  comments: string;
  evidence: string;
  gateKind: string;
  userId: string;
}) {
  const id = `tst_${randomToken(10)}`;
  const sort = (await countTrainingOpsSubtasks(data.recordId)) + 1;
  await prisma().$executeRawUnsafe(
    `INSERT INTO TrainingOpsSubtask (id, recordId, name, department, ownerId, reviewerId, status, completed, dueAt, priority, comments, evidence, gateKind, sortOrder, createdBy, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
    id,
    data.recordId,
    data.name,
    data.department,
    data.ownerId,
    data.reviewerId,
    data.status,
    data.completed ? 1 : 0,
    data.dueAt,
    data.priority,
    data.comments,
    data.evidence,
    data.gateKind,
    sort,
    data.userId,
  );
  return id;
}

export async function updateTrainingOpsSubtask(
  id: string,
  data: {
    name: string;
    department: string;
    ownerId: string;
    reviewerId: string;
    status: string;
    completed: boolean;
    dueAt: string | null;
    priority: string;
    comments: string;
    evidence: string;
    gateKind: string;
  },
) {
  await prisma().$executeRawUnsafe(
    `UPDATE TrainingOpsSubtask SET name=?, department=?, ownerId=?, reviewerId=?, status=?, completed=?, dueAt=?, priority=?, comments=?, evidence=?, gateKind=?, updatedAt=NOW(3) WHERE id=?`,
    data.name,
    data.department,
    data.ownerId,
    data.reviewerId,
    data.status,
    data.completed ? 1 : 0,
    data.dueAt,
    data.priority,
    data.comments,
    data.evidence,
    data.gateKind,
    id,
  );
}

export async function deleteTrainingOpsSubtask(id: string) {
  await prisma().$executeRawUnsafe(`DELETE FROM TrainingOpsSubtaskComment WHERE subtaskId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM TrainingOpsSubtask WHERE id = ?`, id);
}

export async function insertTrainingOpsSubtaskComment(subtaskId: string, authorId: string, body: string) {
  const id = `tsc_${randomToken(10)}`;
  await prisma().$executeRawUnsafe(
    `INSERT INTO TrainingOpsSubtaskComment (id, subtaskId, authorId, body, createdAt) VALUES (?, ?, ?, ?, NOW(3))`,
    id,
    subtaskId,
    authorId,
    body,
  );
  return id;
}

export async function saveTrainingOpsRecord(id: string, data: Record<string, string | null | undefined>, payload: TrnPayload, userId: string) {
  const existing = await prisma().$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM TrainingOpsRecord WHERE id = ? LIMIT 1`, id);
  const row = existing[0];
  if (!row) return false;
  const pick = (key: string) => (data[key] !== undefined ? data[key] : col(row, key));
  const approvals = approvalsFromPayload(row.payloadJson);
  await prisma().$executeRawUnsafe(
    `UPDATE TrainingOpsRecord SET
      kind=?, title=?, hotelName=?, department=?, ownerId=?, approverId=?, trainerId=?, programId=?, status=?, priority=?, eventAt=?, notes=?, archived=?, payloadJson=?, updatedBy=?, updatedAt=NOW(3)
     WHERE id=?`,
    pick("kind"),
    pick("title") || pick("hotelName"),
    pick("hotelName"),
    pick("department"),
    pick("ownerId"),
    pick("approverId"),
    pick("trainerId"),
    pick("programId"),
    pick("status"),
    pick("priority"),
    data.eventAt === undefined ? col(row, "eventAt") || null : data.eventAt,
    pick("notes"),
    data.archived === undefined ? (row.archived ? 1 : 0) : data.archived === "1" || data.archived === "true" ? 1 : 0,
    JSON.stringify({ ...payload, approvals }),
    userId,
    id,
  );
  return true;
}

export async function patchTrainingOpsRecord(id: string, patch: Record<string, string | number | null>, userId: string) {
  const keys = Object.keys(patch);
  if (!keys.length) return;
  const sets = keys.map((key) => `\`${key}\`=?`).join(", ");
  await prisma().$executeRawUnsafe(
    `UPDATE TrainingOpsRecord SET ${sets}, updatedBy=?, updatedAt=NOW(3) WHERE id=?`,
    ...keys.map((key) => patch[key]),
    userId,
    id,
  );
}

export async function deleteTrainingOpsRecord(id: string) {
  const subtasks = await prisma()
    .$queryRawUnsafe<Array<{ id: string }>>(`SELECT id FROM TrainingOpsSubtask WHERE recordId = ?`, id)
    .catch(() => []);
  for (const item of subtasks) {
    await prisma().$executeRawUnsafe(`DELETE FROM TrainingOpsSubtaskComment WHERE subtaskId = ?`, item.id);
  }
  await prisma().$executeRawUnsafe(`DELETE FROM TrainingOpsSubtask WHERE recordId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM TrainingOpsAudit WHERE recordId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM TrainingOpsRecord WHERE id = ?`, id);
}

export async function appendTrainingOpsApproval(id: string, approval: TrnApprovalView, userId: string) {
  const rows = await prisma().$queryRawUnsafe<Record<string, unknown>[]>(`SELECT payloadJson FROM TrainingOpsRecord WHERE id = ? LIMIT 1`, id);
  const payload = asPayload(parseJson(rows[0]?.payloadJson, {}));
  const extra = parseJson<{ approvals?: TrnApprovalView[] }>(rows[0]?.payloadJson, {});
  const approvals = [...(Array.isArray(extra.approvals) ? extra.approvals : []), approval];
  await prisma().$executeRawUnsafe(
    `UPDATE TrainingOpsRecord SET payloadJson=?, updatedBy=?, updatedAt=NOW(3) WHERE id=?`,
    JSON.stringify({ ...payload, approvals }),
    userId,
    id,
  );
}

function approvalsFromPayload(raw: unknown): TrnApprovalView[] {
  const parsed = parseJson<{ approvals?: unknown }>(raw, {});
  return (Array.isArray(parsed.approvals) ? parsed.approvals : []).map((item, index) => {
    const row = (item || {}) as Record<string, unknown>;
    return {
      id: String(row.id || `tap_${index}`),
      kind: String(row.kind || "record"),
      status: isApprovalStatus(String(row.status || "")) ? normalizeApprovalStatus(String(row.status)) : "not_requested",
      notes: String(row.notes ?? ""),
      requestedBy: String(row.requestedBy ?? ""),
      decidedBy: String(row.decidedBy ?? ""),
      createdAt: String(row.createdAt ?? ""),
    };
  });
}

export async function listTrainingOpsRecords(user: { id: string; role: string; modules?: string | null }, filters: TrnListFilters, section: TrnSection) {
  await ensureTrainingOpsSchema();
  const [access, settings, staff] = await Promise.all([trainingOpsAccessFor(user), getTrainingOpsSettings(), staffDirectory()]);
  const names = new Map(staff.map((item) => [item.id, item.name]));
  const rows = await prisma()
    .$queryRawUnsafe<Record<string, unknown>[]>(
      `SELECT * FROM TrainingOpsRecord ${filters.archived === "1" ? "" : "WHERE archived = 0"} ORDER BY updatedAt DESC LIMIT 400`,
    )
    .catch(() => []);
  const recordIds = rows.map((row) => col(row, "id"));
  const subtasks = recordIds.length
    ? await prisma()
        .$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM TrainingOpsSubtask WHERE recordId IN (${recordIds.map(() => "?").join(",")}) ORDER BY sortOrder ASC`, ...recordIds)
        .catch(() => [])
    : [];
  const subtaskIds = subtasks.map((row) => col(row, "id"));
  const comments = subtaskIds.length
    ? await prisma()
        .$queryRawUnsafe<Record<string, unknown>[]>(
          `SELECT * FROM TrainingOpsSubtaskComment WHERE subtaskId IN (${subtaskIds.map(() => "?").join(",")}) ORDER BY createdAt ASC`,
          ...subtaskIds,
        )
        .catch(() => [])
    : [];
  const audits = recordIds.length
    ? await prisma()
        .$queryRawUnsafe<Record<string, unknown>[]>(
          `SELECT * FROM TrainingOpsAudit WHERE recordId IN (${recordIds.map(() => "?").join(",")}) ORDER BY createdAt DESC`,
          ...recordIds,
        )
        .catch(() => [])
    : [];

  const commentsBy = new Map<string, TrnSubtaskCommentView[]>();
  for (const item of comments) {
    const view: TrnSubtaskCommentView = {
      id: col(item, "id"),
      authorId: col(item, "authorId"),
      authorName: names.get(col(item, "authorId")) || col(item, "authorId"),
      body: col(item, "body"),
      createdAt: iso(item.createdAt as string),
    };
    const list = commentsBy.get(col(item, "subtaskId")) || [];
    list.push(view);
    commentsBy.set(col(item, "subtaskId"), list);
  }

  const subtasksBy = new Map<string, TrnSubtaskView[]>();
  for (const item of subtasks) {
    const name = col(item, "name");
    const department = col(item, "department");
    const reviewerId = col(item, "reviewerId");
    const view: TrnSubtaskView = {
      id: col(item, "id"),
      recordId: col(item, "recordId"),
      name,
      department,
      ownerId: col(item, "ownerId"),
      ownerName: names.get(col(item, "ownerId")) || "",
      reviewerId,
      reviewerName: names.get(reviewerId) || "",
      status: normalizeSubtaskStatus(col(item, "status")),
      completed: Boolean(item.completed),
      dueAt: iso(item.dueAt as string),
      priority: isPriority(col(item, "priority")) ? normalizePriority(col(item, "priority")) : "normal",
      comments: col(item, "comments"),
      evidence: col(item, "evidence"),
      gateKind: normalizeGateKind(col(item, "gateKind"), name, department),
      thread: commentsBy.get(col(item, "id")) || [],
    };
    const list = subtasksBy.get(view.recordId) || [];
    list.push(view);
    subtasksBy.set(view.recordId, list);
  }

  const historyBy = new Map<string, TrnAuditView[]>();
  for (const item of audits) {
    const view: TrnAuditView = {
      id: col(item, "id"),
      action: col(item, "action"),
      detail: col(item, "detail"),
      createdBy: col(item, "createdBy"),
      createdByName: names.get(col(item, "createdBy")) || "",
      createdAt: iso(item.createdAt as string),
    };
    const list = historyBy.get(col(item, "recordId")) || [];
    list.push(view);
    historyBy.set(col(item, "recordId"), list);
  }

  const mapped: TrnRecordRow[] = rows.map((row) => {
    const payload = maskPayload(asPayload(parseJson(row.payloadJson, {})), access.canSeeParticipants);
    const sub = subtasksBy.get(col(row, "id")) || [];
    return {
      id: col(row, "id"),
      kind: isKind(col(row, "kind")) ? normalizeKind(col(row, "kind")) : "request",
      title: col(row, "title"),
      hotelName: col(row, "hotelName"),
      department: col(row, "department"),
      ownerId: col(row, "ownerId"),
      ownerName: names.get(col(row, "ownerId")) || "",
      approverId: col(row, "approverId"),
      approverName: names.get(col(row, "approverId")) || "",
      trainerId: col(row, "trainerId"),
      trainerName: names.get(col(row, "trainerId")) || payload.trainerName,
      programId: col(row, "programId"),
      status: normalizeStatus(col(row, "status")),
      priority: isPriority(col(row, "priority")) ? normalizePriority(col(row, "priority")) : "normal",
      eventAt: iso(row.eventAt as string),
      notes: col(row, "notes"),
      archived: Boolean(row.archived),
      createdAt: iso(row.createdAt as string),
      updatedAt: iso(row.updatedAt as string),
      payload,
      approvals: approvalsFromPayload(row.payloadJson),
      history: historyBy.get(col(row, "id")) || [],
      subtasks: sub,
      progress: trnSubtaskProgress(sub, normalizeStatus(col(row, "status")), approvalsFromPayload(row.payloadJson)),
    };
  });

  let items = mapped;
  const programOptions = mapped
    .filter((item) => item.kind === "program")
    .map((item) => ({ id: item.id, title: item.title || item.payload.programName || item.id }));

  if (!access.isManagement) {
    items = items.filter((item) => access.departments.includes(item.department));
  }

  const kind = TRN_SECTION_KIND[section];
  if (section === "overview") {
    /* keep mixed kinds for summary */
  } else if (section === "approvals") {
    items = items.filter(
      (item) => item.status === "review" || item.approvals.some((entry) => entry.status === "awaiting" || entry.status === "changes_requested"),
    );
  } else if (section === "history") {
    items = items.filter((item) => item.history.length > 0);
  } else if (section === "departments") {
    /* department filter applied below */
  } else if (section === "calendar") {
    items = items.filter((item) => item.kind === "session" || Boolean(item.eventAt));
  } else if (section !== "settings") {
    items = items.filter((item) => item.kind === kind);
  }

  if (filters.status && normalizeStatus(filters.status) === filters.status) items = items.filter((item) => item.status === filters.status);
  if (filters.ownerId) items = items.filter((item) => item.ownerId === filters.ownerId);
  if (filters.department) items = items.filter((item) => item.department === filters.department);
  if (filters.hotel) items = items.filter((item) => item.hotelName === filters.hotel);
  if (filters.trainer) {
    items = items.filter((item) => item.trainerId === filters.trainer || item.trainerName === filters.trainer || item.payload.trainerName === filters.trainer);
  }
  if (filters.program) {
    items = items.filter((item) => item.programId === filters.program || item.payload.programName === filters.program);
  }
  if (filters.date) {
    items = items.filter((item) => (item.eventAt || item.payload.dateWindow).startsWith(filters.date || ""));
  }
  const query = (filters.q || "").trim().toLowerCase();
  if (query) {
    items = items.filter((item) =>
      `${item.title} ${item.hotelName} ${item.ownerName} ${item.trainerName} ${item.payload.programName} ${item.payload.goal} ${item.notes}`
        .toLowerCase()
        .includes(query),
    );
  }

  const groupBy: TrnGroupBy = isGroupBy(filters.group || "")
    ? (filters.group as TrnGroupBy)
    : section === "calendar"
      ? "date"
      : "status";
  const sort: TrnSort = isSort(filters.sort || "") ? (filters.sort as TrnSort) : section === "calendar" ? "date" : "updated";
  items.sort((a, b) => {
    if (sort === "priority") return (TRN_PRIORITY_RANK[a.priority] ?? 9) - (TRN_PRIORITY_RANK[b.priority] ?? 9);
    if (sort === "date") return (a.eventAt || a.payload.dateWindow || "9999").localeCompare(b.eventAt || b.payload.dateWindow || "9999");
    return (b.updatedAt || "").localeCompare(a.updatedAt || "");
  });

  return {
    access,
    settings,
    items,
    staff: staff.map((item) => ({ id: item.id, name: item.name })),
    facets: {
      hotels: Array.from(new Set(items.map((item) => item.hotelName).filter(Boolean))),
      trainers: Array.from(new Set(items.map((item) => item.trainerName || item.payload.trainerName).filter(Boolean))),
      programs: Array.from(new Set([...programOptions.map((item) => item.title), ...items.map((item) => item.payload.programName)].filter(Boolean))),
    },
    programOptions,
    groupBy,
    sort,
  };
}

export async function trainingOpsOverview(user: { id: string; role: string; modules?: string | null }) {
  const { items } = await listTrainingOpsRecords(user, {}, "overview");
  return {
    total: items.length,
    live: items.filter((item) => ["approved", "published", "scheduled", "confirmed", "in_progress"].includes(item.status)).length,
    due: items.filter((item) => item.status === "review" || item.approvals.some((entry) => entry.status === "awaiting")).length,
  };
}
