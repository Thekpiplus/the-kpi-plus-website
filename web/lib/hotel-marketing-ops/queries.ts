import { prisma } from "@/lib/crm/db";
import { randomToken } from "@/lib/crm/security";
import { staffDirectory } from "@/lib/crm/queries";
import { hotelMarketingOpsAccessFor } from "./access";
import { ensureHotelMarketingOpsSchema } from "./ensure";
import { hmoSubtaskProgress } from "./progress";
import {
  HMO_APPROVAL_QUEUE_STATUSES,
  HMO_KINDS,
  HMO_PRIORITY_RANK,
  HMO_SECTION_KIND_FILTER,
  HMO_STATUSES,
  emptyHmoPayload,
  hmoCalendarDate,
  hmoDateKey,
  hmoTextHasSecrets,
  isHmoApprovalStatus,
  isHmoGroupBy,
  isHmoKind,
  isHmoPriority,
  isHmoSort,
  normalizeHmoApprovalStatus,
  normalizeHmoAssetPermission,
  normalizeHmoAssetType,
  normalizeHmoDraftStatus,
  normalizeHmoGateKind,
  normalizeHmoImagePermission,
  normalizeHmoKind,
  normalizeHmoLocale,
  normalizeHmoPriority,
  normalizeHmoSourceCitation,
  normalizeHmoStatus,
  normalizeHmoSubtaskStatus,
  normalizeHmoVerified,
  isHmoReleaseStatus,
  type HmoAccessView,
  type HmoApprovalView,
  type HmoAuditView,
  type HmoExtraDepartment,
  type HmoGroupBy,
  type HmoKind,
  type HmoListFilters,
  type HmoPayload,
  type HmoRecordRow,
  type HmoSection,
  type HmoSettings,
  type HmoSort,
  type HmoStatus,
  type HmoSubtaskCommentView,
  type HmoSubtaskView,
} from "./types";

type UserLike = { id: string; role: string; modules?: string | null };
type Raw = Record<string, unknown>;

/* ------------------------------------------------------------------ helpers */

function col(row: Raw, key: string) {
  const value = row[key];
  if (value == null) return "";
  return String(value);
}

function iso(value: unknown) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

/** ISO timestamp -> `YYYY-MM-DD HH:MM:SS` (UTC) for a MySQL DATETIME column, or null. */
export function hmoSqlDate(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 19).replace("T", " ");
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

function str(value: unknown) {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

export function asHmoPayload(value: unknown): HmoPayload {
  const raw = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  const empty = emptyHmoPayload();
  return {
    targetAudience: str(raw.targetAudience),
    searchIntent: str(raw.searchIntent),
    contentGoal: str(raw.contentGoal),
    relatedServiceHrefs: Array.isArray(raw.relatedServiceHrefs) ? raw.relatedServiceHrefs.map(str).filter(Boolean) : [],
    draftStatus: normalizeHmoDraftStatus(raw.draftStatus ?? empty.draftStatus),
    sourceCitationStatus: normalizeHmoSourceCitation(raw.sourceCitationStatus ?? empty.sourceCitationStatus),
    imagePermissionStatus: normalizeHmoImagePermission(raw.imagePermissionStatus ?? empty.imagePermissionStatus),
    seoTitle: str(raw.seoTitle),
    seoDescription: str(raw.seoDescription),
    campaignName: str(raw.campaignName),
    propertyLabel: str(raw.propertyLabel),
    departmentOwner: str(raw.departmentOwner),
    channel: str(raw.channel),
    objective: str(raw.objective),
    landingPage: str(raw.landingPage),
    bookingPathDependency: str(raw.bookingPathDependency),
    kpiDefinition: str(raw.kpiDefinition),
    period: str(raw.period),
    dataSource: str(raw.dataSource),
    riskApproval: str(raw.riskApproval),
    nextAction: str(raw.nextAction),
    nextActionDate: str(raw.nextActionDate),
    definition: str(raw.definition),
    source: str(raw.source),
    ownerLabel: str(raw.ownerLabel),
    verifiedStatus: normalizeHmoVerified(raw.verifiedStatus ?? empty.verifiedStatus),
    method: str(raw.method),
    assetType: normalizeHmoAssetType(raw.assetType ?? empty.assetType),
    altText: str(raw.altText),
    permissionStatus: normalizeHmoAssetPermission(raw.permissionStatus ?? empty.permissionStatus),
    permissionNote: str(raw.permissionNote),
    sourceNote: str(raw.sourceNote),
    containsClientOrGuestData: Boolean(raw.containsClientOrGuestData),
    primaryIntent: str(raw.primaryIntent),
    targetQueries: str(raw.targetQueries),
    outline: str(raw.outline),
    relatedServices: str(raw.relatedServices),
    roleInPath: str(raw.roleInPath),
    ownerDept: str(raw.ownerDept),
    dependency: str(raw.dependency),
    href: str(raw.href),
    label: str(raw.label),
    why: str(raw.why),
    sourceLocale: normalizeHmoLocale(raw.sourceLocale, "th"),
    targetLocale: normalizeHmoLocale(raw.targetLocale, "en"),
    statusNote: str(raw.statusNote),
    notes: str(raw.notes),
  };
}

function rawApprovals(raw: unknown) {
  const parsed = parseJson<{ approvals?: unknown }>(raw, {});
  return Array.isArray(parsed.approvals) ? (parsed.approvals as unknown[]) : [];
}

function approvalsFromPayload(raw: unknown, names: Map<string, string>): HmoApprovalView[] {
  return rawApprovals(raw).map((item, index) => {
    const row = (item || {}) as Record<string, unknown>;
    const decidedBy = str(row.decidedBy);
    return {
      id: str(row.id) || `hap_${index}`,
      kind: str(row.kind) || "review",
      status: isHmoApprovalStatus(str(row.status)) ? normalizeHmoApprovalStatus(str(row.status)) : "not_requested",
      notes: str(row.notes),
      requestedBy: str(row.requestedBy),
      decidedBy,
      decidedByName: names.get(decidedBy) || "",
      createdAt: str(row.createdAt),
    };
  });
}

/* ------------------------------------------------------------------ settings / access rows */

export async function getHotelMarketingOpsSettings(): Promise<HmoSettings> {
  const rows = await prisma()
    .$queryRawUnsafe<Array<{ extraDepartmentsJson: string | null }>>(`SELECT extraDepartmentsJson FROM HotelMarketingOpsSettings WHERE id = 'default' LIMIT 1`)
    .catch(() => []);
  const extras = parseJson<HmoExtraDepartment[]>(rows[0]?.extraDepartmentsJson, []);
  return { extraDepartments: Array.isArray(extras) ? extras.filter((item) => item && item.id && item.label) : [] };
}

export async function saveHotelMarketingOpsSettingsRow(extras: HmoExtraDepartment[], userId: string) {
  const json = JSON.stringify(extras);
  const existing = await prisma()
    .$queryRawUnsafe<Array<{ id: string }>>(`SELECT id FROM HotelMarketingOpsSettings WHERE id = 'default' LIMIT 1`)
    .catch(() => []);
  if (existing[0]) {
    await prisma().$executeRawUnsafe(
      `UPDATE HotelMarketingOpsSettings SET extraDepartmentsJson=?, updatedBy=?, updatedAt=NOW(3) WHERE id='default'`,
      json,
      userId,
    );
    return;
  }
  await prisma().$executeRawUnsafe(
    `INSERT INTO HotelMarketingOpsSettings (id, extraDepartmentsJson, updatedBy, updatedAt) VALUES ('default', ?, ?, NOW(3))`,
    json,
    userId,
  );
}

export async function listHotelMarketingOpsAccessRows() {
  await ensureHotelMarketingOpsSchema();
  const [rows, staff, settings] = await Promise.all([
    prisma()
      .$queryRawUnsafe<Array<{ id: string; userId: string; department: string; canApprove: number | boolean }>>(
        `SELECT id, userId, department, canApprove FROM HotelMarketingOpsAccess ORDER BY department ASC`,
      )
      .catch(() => []),
    staffDirectory(),
    getHotelMarketingOpsSettings(),
  ]);
  return {
    rows: rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      department: row.department,
      canApprove: Boolean(row.canApprove),
    })),
    staff: staff.map((item) => ({ id: item.id, name: item.name, email: item.email })),
    settings,
  };
}

export async function saveHotelMarketingOpsAccessRow(userId: string, department: string, canApprove: boolean) {
  const existing = await prisma()
    .$queryRawUnsafe<Array<{ id: string }>>(`SELECT id FROM HotelMarketingOpsAccess WHERE userId = ? AND department = ? LIMIT 1`, userId, department)
    .catch(() => []);
  if (existing[0]) {
    await prisma().$executeRawUnsafe(`UPDATE HotelMarketingOpsAccess SET canApprove=?, updatedAt=NOW(3) WHERE id=?`, canApprove ? 1 : 0, existing[0].id);
    return existing[0].id;
  }
  const id = `hma_${randomToken(10)}`;
  await prisma().$executeRawUnsafe(
    `INSERT INTO HotelMarketingOpsAccess (id, userId, department, canApprove, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(3), NOW(3))`,
    id,
    userId,
    department,
    canApprove ? 1 : 0,
  );
  return id;
}

export async function deleteHotelMarketingOpsAccessRow(id: string) {
  await prisma().$executeRawUnsafe(`DELETE FROM HotelMarketingOpsAccess WHERE id = ?`, id);
}

/* ------------------------------------------------------------------ audit */

export async function writeHmoAudit(recordId: string, userId: string, action: string, detail: string) {
  const safe = hmoTextHasSecrets(detail) ? "[detail withheld — sensitive text]" : detail.slice(0, 1000);
  await prisma().$executeRawUnsafe(
    `INSERT INTO HotelMarketingOpsAudit (id, recordId, action, detail, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, NOW(3))`,
    `hmu_${randomToken(10)}`,
    recordId,
    action,
    safe,
    userId,
  );
}

/* ------------------------------------------------------------------ records */

export type HmoRecordWrite = {
  kind: HmoKind;
  title: string;
  category: string;
  department: string;
  ownerId: string;
  authorId: string;
  reviewerId: string;
  status: HmoStatus;
  priority: string;
  channel: string;
  publishAt: string | null;
  lastReviewAt: string | null;
  nextAction: string;
  nextActionOwnerId: string;
  dueAt: string | null;
  payload: HmoPayload;
};

export async function getHmoRecordRaw(id: string) {
  const rows = await prisma().$queryRawUnsafe<Raw[]>(`SELECT * FROM HotelMarketingOpsRecord WHERE id = ? LIMIT 1`, id);
  return rows[0] || null;
}

export async function insertHmoRecord(data: HmoRecordWrite, userId: string) {
  const id = `hmr_${randomToken(10)}`;
  await prisma().$executeRawUnsafe(
    `INSERT INTO HotelMarketingOpsRecord
      (id, kind, title, category, department, ownerId, authorId, reviewerId, status, priority, channel, publishAt, lastReviewAt, nextAction, nextActionOwnerId, dueAt, archived, payloadJson, createdBy, updatedBy, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, NOW(3), NOW(3))`,
    id,
    data.kind,
    data.title,
    data.category,
    data.department,
    data.ownerId,
    data.authorId,
    data.reviewerId,
    data.status,
    data.priority,
    data.channel,
    data.publishAt,
    data.lastReviewAt,
    data.nextAction,
    data.nextActionOwnerId,
    data.dueAt,
    JSON.stringify({ ...data.payload, approvals: [] }),
    userId,
    userId,
  );
  return id;
}

export async function updateHmoRecord(id: string, data: HmoRecordWrite, userId: string) {
  const existing = await getHmoRecordRaw(id);
  if (!existing) return false;
  const approvals = rawApprovals(existing.payloadJson);
  await prisma().$executeRawUnsafe(
    `UPDATE HotelMarketingOpsRecord SET
      kind=?, title=?, category=?, department=?, ownerId=?, authorId=?, reviewerId=?, status=?, priority=?, channel=?, publishAt=?, lastReviewAt=?, nextAction=?, nextActionOwnerId=?, dueAt=?, payloadJson=?, updatedBy=?, updatedAt=NOW(3)
     WHERE id=?`,
    data.kind,
    data.title,
    data.category,
    data.department,
    data.ownerId,
    data.authorId,
    data.reviewerId,
    data.status,
    data.priority,
    data.channel,
    data.publishAt,
    data.lastReviewAt,
    data.nextAction,
    data.nextActionOwnerId,
    data.dueAt,
    JSON.stringify({ ...data.payload, approvals }),
    userId,
    id,
  );
  return true;
}

const PATCHABLE = new Set(["status", "ownerId", "reviewerId", "archived", "lastReviewAt", "nextActionOwnerId"]);

export async function patchHmoRecord(id: string, patch: Record<string, string | number | null>, userId: string) {
  const keys = Object.keys(patch).filter((key) => PATCHABLE.has(key));
  if (!keys.length) return;
  const sets = keys.map((key) => `\`${key}\`=?`).join(", ");
  await prisma().$executeRawUnsafe(
    `UPDATE HotelMarketingOpsRecord SET ${sets}, updatedBy=?, updatedAt=NOW(3) WHERE id=?`,
    ...keys.map((key) => patch[key]),
    userId,
    id,
  );
}

/** Permanently removes a record and its subtasks. Audit rows are kept so history survives deletion. */
export async function deleteHmoRecord(id: string) {
  const subtasks = await prisma()
    .$queryRawUnsafe<Array<{ id: string }>>(`SELECT id FROM HotelMarketingOpsSubtask WHERE recordId = ?`, id)
    .catch(() => []);
  for (const item of subtasks) {
    await prisma().$executeRawUnsafe(`DELETE FROM HotelMarketingOpsSubtaskComment WHERE subtaskId = ?`, item.id);
  }
  await prisma().$executeRawUnsafe(`DELETE FROM HotelMarketingOpsSubtask WHERE recordId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM HotelMarketingOpsRecord WHERE id = ?`, id);
}

export async function appendHmoApproval(id: string, approval: Omit<HmoApprovalView, "decidedByName">, userId: string) {
  const existing = await getHmoRecordRaw(id);
  if (!existing) return false;
  const payload = asHmoPayload(parseJson(existing.payloadJson, {}));
  const approvals = [...rawApprovals(existing.payloadJson), approval];
  await prisma().$executeRawUnsafe(
    `UPDATE HotelMarketingOpsRecord SET payloadJson=?, lastReviewAt=UTC_TIMESTAMP(), updatedBy=?, updatedAt=NOW(3) WHERE id=?`,
    JSON.stringify({ ...payload, approvals }),
    userId,
    id,
  );
  return true;
}

/* ------------------------------------------------------------------ subtasks */

export async function countHmoSubtasks(recordId: string) {
  const rows = await prisma()
    .$queryRawUnsafe<Array<{ count: number | bigint }>>(`SELECT COUNT(*) AS count FROM HotelMarketingOpsSubtask WHERE recordId = ?`, recordId)
    .catch(() => [{ count: 0 }]);
  return Number(rows[0]?.count || 0);
}

export async function getHmoSubtask(id: string) {
  const rows = await prisma().$queryRawUnsafe<Raw[]>(`SELECT * FROM HotelMarketingOpsSubtask WHERE id = ? LIMIT 1`, id);
  return rows[0] || null;
}

export type HmoSubtaskWrite = {
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
};

export async function insertHmoSubtask(recordId: string, data: HmoSubtaskWrite, userId: string) {
  const id = `hms_${randomToken(10)}`;
  const rows = await prisma()
    .$queryRawUnsafe<Array<{ top: number | null }>>(`SELECT MAX(sortOrder) AS top FROM HotelMarketingOpsSubtask WHERE recordId = ?`, recordId)
    .catch(() => [{ top: 0 }]);
  const sort = Number(rows[0]?.top || 0) + 1;
  await prisma().$executeRawUnsafe(
    `INSERT INTO HotelMarketingOpsSubtask (id, recordId, name, department, ownerId, reviewerId, status, completed, dueAt, priority, comments, evidence, gateKind, sortOrder, createdBy, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(3), NOW(3))`,
    id,
    recordId,
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
    userId,
  );
  return id;
}

export async function updateHmoSubtask(id: string, data: HmoSubtaskWrite) {
  await prisma().$executeRawUnsafe(
    `UPDATE HotelMarketingOpsSubtask SET name=?, department=?, ownerId=?, reviewerId=?, status=?, completed=?, dueAt=?, priority=?, comments=?, evidence=?, gateKind=?, updatedAt=NOW(3) WHERE id=?`,
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

export async function deleteHmoSubtask(id: string) {
  await prisma().$executeRawUnsafe(`DELETE FROM HotelMarketingOpsSubtaskComment WHERE subtaskId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM HotelMarketingOpsSubtask WHERE id = ?`, id);
}

/** Moves a subtask one step up/down by renumbering the record's subtasks 1..n and swapping neighbours. */
export async function moveHmoSubtask(id: string, direction: "up" | "down") {
  const row = await getHmoSubtask(id);
  if (!row) return false;
  const recordId = col(row, "recordId");
  const list = await prisma().$queryRawUnsafe<Array<{ id: string }>>(
    `SELECT id FROM HotelMarketingOpsSubtask WHERE recordId = ? ORDER BY sortOrder ASC, createdAt ASC, id ASC`,
    recordId,
  );
  const ids = list.map((item) => item.id);
  const index = ids.indexOf(id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= ids.length) return true;
  [ids[index], ids[target]] = [ids[target], ids[index]];
  for (let position = 0; position < ids.length; position += 1) {
    await prisma().$executeRawUnsafe(`UPDATE HotelMarketingOpsSubtask SET sortOrder=? WHERE id=?`, position + 1, ids[position]);
  }
  return true;
}

export async function insertHmoSubtaskComment(subtaskId: string, authorId: string, body: string) {
  const id = `hsc_${randomToken(10)}`;
  await prisma().$executeRawUnsafe(
    `INSERT INTO HotelMarketingOpsSubtaskComment (id, subtaskId, authorId, body, createdAt) VALUES (?, ?, ?, ?, NOW(3))`,
    id,
    subtaskId,
    authorId,
    body,
  );
  return id;
}

export async function hmoRecordHasBlockedGate(recordId: string) {
  const rows = await prisma()
    .$queryRawUnsafe<Array<{ status: string; gateKind: string; name: string; completed: number | boolean }>>(
      `SELECT status, gateKind, name, completed FROM HotelMarketingOpsSubtask WHERE recordId = ?`,
      recordId,
    )
    .catch(() => []);
  return hmoSubtaskProgress(
    rows.map((item) => ({
      completed: Boolean(item.completed) || item.status === "completed",
      status: item.status,
      gateKind: normalizeHmoGateKind(item.gateKind, item.name),
    })),
  ).blockedByGate;
}

/** When a gate is blocked, pull a release-state record back to `blocked` so it cannot ship by accident. */
export async function applyHmoGateBlock(recordId: string, userId: string) {
  if (!(await hmoRecordHasBlockedGate(recordId))) return false;
  const row = await getHmoRecordRaw(recordId);
  if (!row) return false;
  const status = normalizeHmoStatus(col(row, "status"));
  if (!isHmoReleaseStatus(status)) return true;
  await patchHmoRecord(recordId, { status: "blocked" }, userId);
  await writeHmoAudit(recordId, userId, "status", `Status ${status} → blocked (open gate on a subtask)`);
  return true;
}

/* ------------------------------------------------------------------ listing */

function scopedItems(items: HmoRecordRow[], access: HmoAccessView) {
  return access.isManagement ? items : items.filter((item) => access.departments.includes(item.department));
}

async function loadRows(user: UserLike, includeArchived: boolean) {
  await ensureHotelMarketingOpsSchema();
  const [access, settings, staff] = await Promise.all([hotelMarketingOpsAccessFor(user), getHotelMarketingOpsSettings(), staffDirectory()]);
  const names = new Map(staff.map((item) => [item.id, item.name]));
  const rows = await prisma()
    .$queryRawUnsafe<Raw[]>(`SELECT * FROM HotelMarketingOpsRecord ${includeArchived ? "" : "WHERE archived = 0"} ORDER BY updatedAt DESC LIMIT 600`)
    .catch(() => []);
  const recordIds = rows.map((row) => col(row, "id"));
  const placeholders = (list: string[]) => list.map(() => "?").join(",");

  const subtaskRows = recordIds.length
    ? await prisma()
        .$queryRawUnsafe<Raw[]>(
          `SELECT * FROM HotelMarketingOpsSubtask WHERE recordId IN (${placeholders(recordIds)}) ORDER BY sortOrder ASC, createdAt ASC`,
          ...recordIds,
        )
        .catch(() => [])
    : [];
  const subtaskIds = subtaskRows.map((row) => col(row, "id"));
  const commentRows = subtaskIds.length
    ? await prisma()
        .$queryRawUnsafe<Raw[]>(
          `SELECT * FROM HotelMarketingOpsSubtaskComment WHERE subtaskId IN (${placeholders(subtaskIds)}) ORDER BY createdAt ASC`,
          ...subtaskIds,
        )
        .catch(() => [])
    : [];
  const auditRows = recordIds.length
    ? await prisma()
        .$queryRawUnsafe<Raw[]>(
          `SELECT * FROM HotelMarketingOpsAudit WHERE recordId IN (${placeholders(recordIds)}) ORDER BY createdAt DESC LIMIT 2500`,
          ...recordIds,
        )
        .catch(() => [])
    : [];

  const commentsBy = new Map<string, HmoSubtaskCommentView[]>();
  for (const item of commentRows) {
    const view: HmoSubtaskCommentView = {
      id: col(item, "id"),
      authorId: col(item, "authorId"),
      authorName: names.get(col(item, "authorId")) || "",
      body: col(item, "body"),
      createdAt: iso(item.createdAt),
    };
    const list = commentsBy.get(col(item, "subtaskId")) || [];
    list.push(view);
    commentsBy.set(col(item, "subtaskId"), list);
  }

  const subtasksBy = new Map<string, HmoSubtaskView[]>();
  for (const item of subtaskRows) {
    const name = col(item, "name");
    const reviewerId = col(item, "reviewerId");
    const status = normalizeHmoSubtaskStatus(col(item, "status"));
    const view: HmoSubtaskView = {
      id: col(item, "id"),
      recordId: col(item, "recordId"),
      name,
      department: col(item, "department"),
      ownerId: col(item, "ownerId"),
      ownerName: names.get(col(item, "ownerId")) || "",
      reviewerId,
      reviewerName: names.get(reviewerId) || "",
      status,
      completed: Boolean(item.completed) || status === "completed",
      dueAt: iso(item.dueAt),
      priority: isHmoPriority(col(item, "priority")) ? normalizeHmoPriority(col(item, "priority")) : "normal",
      comments: col(item, "comments"),
      evidence: col(item, "evidence"),
      gateKind: normalizeHmoGateKind(col(item, "gateKind"), name),
      sortOrder: Number(item.sortOrder || 0),
      thread: commentsBy.get(col(item, "id")) || [],
    };
    const list = subtasksBy.get(view.recordId) || [];
    list.push(view);
    subtasksBy.set(view.recordId, list);
  }

  const historyBy = new Map<string, HmoAuditView[]>();
  for (const item of auditRows) {
    const view: HmoAuditView = {
      id: col(item, "id"),
      recordId: col(item, "recordId"),
      action: col(item, "action"),
      detail: col(item, "detail"),
      createdBy: col(item, "createdBy"),
      createdByName: names.get(col(item, "createdBy")) || "",
      createdAt: iso(item.createdAt),
    };
    const list = historyBy.get(view.recordId) || [];
    list.push(view);
    historyBy.set(view.recordId, list);
  }

  const mapped: HmoRecordRow[] = rows.map((row) => {
    const id = col(row, "id");
    const payload = asHmoPayload(parseJson(row.payloadJson, {}));
    const approvals = approvalsFromPayload(row.payloadJson, names);
    const subtasks = subtasksBy.get(id) || [];
    const status = normalizeHmoStatus(col(row, "status"));
    return {
      id,
      kind: isHmoKind(col(row, "kind")) ? normalizeHmoKind(col(row, "kind")) : "article",
      title: col(row, "title"),
      category: col(row, "category"),
      department: col(row, "department"),
      ownerId: col(row, "ownerId"),
      ownerName: names.get(col(row, "ownerId")) || "",
      authorId: col(row, "authorId"),
      authorName: names.get(col(row, "authorId")) || "",
      reviewerId: col(row, "reviewerId"),
      reviewerName: names.get(col(row, "reviewerId")) || "",
      status,
      priority: isHmoPriority(col(row, "priority")) ? normalizeHmoPriority(col(row, "priority")) : "normal",
      channel: col(row, "channel"),
      publishAt: iso(row.publishAt),
      lastReviewAt: iso(row.lastReviewAt),
      nextAction: col(row, "nextAction"),
      nextActionOwnerId: col(row, "nextActionOwnerId"),
      nextActionOwnerName: names.get(col(row, "nextActionOwnerId")) || "",
      dueAt: iso(row.dueAt),
      archived: Boolean(row.archived),
      createdBy: col(row, "createdBy"),
      updatedBy: col(row, "updatedBy"),
      createdAt: iso(row.createdAt),
      updatedAt: iso(row.updatedAt),
      payload,
      approvals,
      history: historyBy.get(id) || [],
      subtasks,
      progress: hmoSubtaskProgress(subtasks, status, approvals),
    };
  });

  return { access, settings, staff: staff.map((item) => ({ id: item.id, name: item.name })), names, items: scopedItems(mapped, access) };
}

function defaultGroup(section: HmoSection): HmoGroupBy {
  return section === "editorial_calendar" || section === "campaign_calendar" ? "month" : "status";
}

function defaultSort(section: HmoSection): HmoSort {
  return section === "editorial_calendar" || section === "campaign_calendar" ? "publishAt" : "updatedAt";
}

function dateOrMax(value: string) {
  return value || "9999-12-31";
}

export async function listHmoRecords(user: UserLike, filters: HmoListFilters, section: HmoSection) {
  const wantsArchived = filters.archived === "1" || filters.status === "archived";
  const { access, settings, staff, items: all } = await loadRows(user, wantsArchived);

  let items = all;
  const kindFilter = HMO_SECTION_KIND_FILTER[section];
  if (kindFilter) items = items.filter((item) => item.kind === kindFilter);
  if (section === "approvals") items = items.filter((item) => HMO_APPROVAL_QUEUE_STATUSES.includes(item.status));

  /* facets reflect the section scope, before the user's own filters */
  const scoped = items;
  const facets = {
    channels: Array.from(new Set(scoped.map((item) => item.channel).filter(Boolean))).sort(),
    categories: Array.from(new Set(scoped.map((item) => item.category).filter(Boolean))).sort(),
  };

  if (filters.kind && isHmoKind(filters.kind)) items = items.filter((item) => item.kind === filters.kind);
  if (filters.status && HMO_STATUSES.includes(filters.status as HmoStatus)) items = items.filter((item) => item.status === filters.status);
  if (filters.ownerId) items = items.filter((item) => item.ownerId === filters.ownerId);
  if (filters.department) items = items.filter((item) => item.department === filters.department);
  if (filters.channel) items = items.filter((item) => item.channel === filters.channel);
  if (filters.category) items = items.filter((item) => item.category === filters.category);
  if (filters.dateFrom || filters.dateTo) {
    items = items.filter((item) => {
      const key = hmoDateKey(hmoCalendarDate(item));
      if (!key) return false;
      if (filters.dateFrom && key < filters.dateFrom) return false;
      if (filters.dateTo && key > filters.dateTo) return false;
      return true;
    });
  }
  const query = (filters.q || "").trim().toLowerCase();
  if (query) {
    items = items.filter((item) =>
      [
        item.title,
        item.category,
        item.channel,
        item.nextAction,
        item.ownerName,
        item.payload.campaignName,
        item.payload.targetQueries,
        item.payload.primaryIntent,
        item.payload.definition,
        item.payload.label,
        item.payload.href,
        item.payload.notes,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }

  const groupBy: HmoGroupBy = isHmoGroupBy(filters.group || "") ? (filters.group as HmoGroupBy) : defaultGroup(section);
  const sort: HmoSort = isHmoSort(filters.sort || "") ? (filters.sort as HmoSort) : defaultSort(section);
  items = [...items].sort((a, b) => {
    if (sort === "priority") return (HMO_PRIORITY_RANK[a.priority] ?? 9) - (HMO_PRIORITY_RANK[b.priority] ?? 9);
    if (sort === "status") return HMO_STATUSES.indexOf(a.status) - HMO_STATUSES.indexOf(b.status);
    if (sort === "dueAt") return dateOrMax(a.dueAt).localeCompare(dateOrMax(b.dueAt));
    if (sort === "publishAt") return dateOrMax(hmoCalendarDate(a)).localeCompare(dateOrMax(hmoCalendarDate(b)));
    return (b.updatedAt || "").localeCompare(a.updatedAt || "");
  });

  const kindCounts = Object.fromEntries(HMO_KINDS.map((kind) => [kind, all.filter((item) => !item.archived && item.kind === kind).length])) as Record<HmoKind, number>;

  return { access, settings, items, staff, facets, groupBy, sort, kindCounts };
}

/** Audit rows for the Audit History section, limited to departments the user can see. */
export async function listHmoAudit(user: UserLike) {
  const { access, settings, staff, names, items } = await loadRows(user, true);
  const visible = new Map(items.map((item) => [item.id, item]));
  const rows = await prisma()
    .$queryRawUnsafe<Raw[]>(`SELECT * FROM HotelMarketingOpsAudit ORDER BY createdAt DESC LIMIT 400`)
    .catch(() => []);
  const entries = rows
    .map((row) => {
      const recordId = col(row, "recordId");
      const record = visible.get(recordId);
      return {
        id: col(row, "id"),
        recordId,
        recordTitle: record?.title || "",
        recordKind: record?.kind || ("" as HmoKind | ""),
        department: record?.department || "",
        deleted: !record,
        action: col(row, "action"),
        detail: col(row, "detail"),
        createdBy: names.get(col(row, "createdBy")) || col(row, "createdBy"),
        createdAt: iso(row.createdAt),
      };
    })
    /* deleted records have no department — only management may read those entries */
    .filter((entry) => (entry.deleted ? access.isManagement : true));
  return { access, settings, staff, entries };
}

/** Compact counts for a future CRM dashboard card. */
export async function hotelMarketingOpsOverview(user: UserLike) {
  const { items } = await listHmoRecords(user, {}, "overview");
  return {
    total: items.length,
    live: items.filter((item) => ["approved", "scheduled", "published"].includes(item.status)).length,
    due: items.filter((item) => HMO_APPROVAL_QUEUE_STATUSES.includes(item.status)).length,
  };
}