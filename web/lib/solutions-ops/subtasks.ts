import { prisma } from "@/lib/crm/db";
import { randomToken } from "@/lib/crm/security";
import { solGateBlock } from "./progress";
import {
  normalizeGateKind,
  normalizePriority,
  normalizeSubtaskParent,
  normalizeSubtaskStatus,
  type SolSubtaskCommentView,
  type SolSubtaskParent,
  type SolSubtaskView,
} from "./types";

type Raw = Record<string, unknown>;

function col(row: Raw, key: string) {
  const value = row[key];
  return value == null ? "" : String(value);
}

function iso(value: unknown) {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

const newSubtaskId = () => `sst_${randomToken(10)}`;
const newCommentId = () => `ssc_${randomToken(10)}`;

/* -------------------------------------------------------------------------- */
/* Reads                                                                      */
/* -------------------------------------------------------------------------- */

/** Loads subtasks (with comment threads) for many parents in two queries. */
export async function loadSubtasks(
  parentType: SolSubtaskParent,
  parentIds: string[],
  names: Map<string, string>,
): Promise<Map<string, SolSubtaskView[]>> {
  const result = new Map<string, SolSubtaskView[]>();
  if (!parentIds.length) return result;
  const rows = await prisma()
    .$queryRawUnsafe<Raw[]>(
      `SELECT * FROM SolutionsOpsSubtask WHERE parentType = ? AND parentId IN (${parentIds.map(() => "?").join(",")}) ORDER BY sortOrder ASC, createdAt ASC`,
      parentType,
      ...parentIds,
    )
    .catch(() => [] as Raw[]);
  const ids = rows.map((row) => col(row, "id"));
  const comments = ids.length
    ? await prisma()
        .$queryRawUnsafe<Raw[]>(`SELECT * FROM SolutionsOpsSubtaskComment WHERE subtaskId IN (${ids.map(() => "?").join(",")}) ORDER BY createdAt ASC`, ...ids)
        .catch(() => [] as Raw[])
    : [];

  const threads = new Map<string, SolSubtaskCommentView[]>();
  for (const item of comments) {
    const list = threads.get(col(item, "subtaskId")) ?? [];
    list.push({
      id: col(item, "id"),
      authorId: col(item, "authorId"),
      authorName: names.get(col(item, "authorId")) || (col(item, "authorId") === "system" ? "System" : ""),
      body: col(item, "body"),
      createdAt: iso(item.createdAt),
    });
    threads.set(col(item, "subtaskId"), list);
  }

  for (const row of rows) {
    const ownerId = col(row, "ownerId");
    const reviewerId = col(row, "reviewerId");
    const status = normalizeSubtaskStatus(col(row, "status"));
    const view: SolSubtaskView = {
      id: col(row, "id"),
      parentType: normalizeSubtaskParent(col(row, "parentType")),
      parentId: col(row, "parentId"),
      name: col(row, "name"),
      department: col(row, "department"),
      ownerId,
      ownerName: names.get(ownerId) ?? "",
      reviewerId,
      reviewerName: names.get(reviewerId) ?? "",
      status,
      completed: Number(row.completed) === 1 || status === "completed",
      dueAt: iso(row.dueAt),
      priority: normalizePriority(col(row, "priority")),
      comments: col(row, "comments"),
      evidence: col(row, "evidence"),
      gateKind: normalizeGateKind(col(row, "gateKind")),
      sortOrder: Number(row.sortOrder ?? 0),
      updatedAt: iso(row.updatedAt),
      thread: threads.get(col(row, "id")) ?? [],
    };
    const list = result.get(view.parentId) ?? [];
    list.push(view);
    result.set(view.parentId, list);
  }
  return result;
}

export async function getSubtaskRow(id: string) {
  const rows = await prisma().$queryRawUnsafe<Raw[]>(`SELECT * FROM SolutionsOpsSubtask WHERE id = ? LIMIT 1`, id).catch(() => [] as Raw[]);
  return rows[0] ?? null;
}

export async function countSubtasks(parentType: SolSubtaskParent, parentId: string) {
  const rows = await prisma()
    .$queryRawUnsafe<Raw[]>(`SELECT COUNT(*) AS n FROM SolutionsOpsSubtask WHERE parentType = ? AND parentId = ?`, parentType, parentId)
    .catch(() => [{ n: 0 }] as Raw[]);
  return Number(rows[0]?.n ?? 0);
}

/**
 * Server-side gate check: returns a `blocked_by_gate` result when any subtask of the parent
 * is `blocked` with a blocking gate (permission | evidence | privacy | approval).
 */
export async function subtaskGateBlock(parentType: SolSubtaskParent, parentId: string) {
  const rows = await prisma()
    .$queryRawUnsafe<Raw[]>(`SELECT status, gateKind, completed FROM SolutionsOpsSubtask WHERE parentType = ? AND parentId = ?`, parentType, parentId)
    .catch(() => [] as Raw[]);
  return solGateBlock(
    rows.map((row) => ({
      completed: Number(row.completed) === 1,
      status: normalizeSubtaskStatus(col(row, "status")),
      gateKind: normalizeGateKind(col(row, "gateKind")),
    })),
  );
}

/** True when a department id is still referenced (used before removing an extra department). */
export async function departmentInUse(department: string) {
  const queries = [
    `SELECT id FROM SolutionsService WHERE ownerDepartment = ? LIMIT 1`,
    `SELECT id FROM SolutionsCategory WHERE ownerDepartment = ? LIMIT 1`,
    `SELECT id FROM SolutionsOpsSubtask WHERE department = ? LIMIT 1`,
    `SELECT id FROM SolutionsOpsAccess WHERE department = ? LIMIT 1`,
  ];
  for (const sql of queries) {
    const rows = await prisma().$queryRawUnsafe<Raw[]>(sql, department).catch(() => [] as Raw[]);
    if (rows.length) return true;
  }
  return false;
}

/* -------------------------------------------------------------------------- */
/* Writes                                                                     */
/* -------------------------------------------------------------------------- */

export type SolSubtaskWrite = {
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

export async function insertSubtask(parentType: SolSubtaskParent, parentId: string, data: SolSubtaskWrite, userId: string) {
  const id = newSubtaskId();
  const sort = (await countSubtasks(parentType, parentId)) + 1;
  await prisma().$executeRawUnsafe(
    `INSERT INTO SolutionsOpsSubtask (id, parentType, parentId, name, department, ownerId, reviewerId, status, completed, dueAt, priority, comments, evidence, gateKind, sortOrder, createdBy, updatedBy)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    id,
    parentType,
    parentId,
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
    userId,
  );
  return id;
}

export async function updateSubtask(id: string, data: SolSubtaskWrite, userId: string) {
  await prisma().$executeRawUnsafe(
    `UPDATE SolutionsOpsSubtask SET name=?, department=?, ownerId=?, reviewerId=?, status=?, completed=?, dueAt=?, priority=?, comments=?, evidence=?, gateKind=?, updatedBy=? WHERE id=?`,
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
    userId,
    id,
  );
}

export async function deleteSubtask(id: string) {
  await prisma().$executeRawUnsafe(`DELETE FROM SolutionsOpsSubtaskComment WHERE subtaskId = ?`, id);
  await prisma().$executeRawUnsafe(`DELETE FROM SolutionsOpsSubtask WHERE id = ?`, id);
}

export async function insertSubtaskComment(subtaskId: string, authorId: string, body: string) {
  const id = newCommentId();
  await prisma().$executeRawUnsafe(`INSERT INTO SolutionsOpsSubtaskComment (id, subtaskId, authorId, body) VALUES (?, ?, ?, ?)`, id, subtaskId, authorId, body);
  return id;
}

/** Row → write payload (used by complete / decide / escalate to change only a few fields). */
export function writeFromRow(row: Raw): SolSubtaskWrite {
  const due = row.dueAt;
  return {
    name: col(row, "name"),
    department: col(row, "department"),
    ownerId: col(row, "ownerId"),
    reviewerId: col(row, "reviewerId"),
    status: normalizeSubtaskStatus(col(row, "status")),
    completed: Number(row.completed) === 1,
    dueAt: due ? new Date(due instanceof Date ? due : String(due)).toISOString().slice(0, 19).replace("T", " ") : null,
    priority: normalizePriority(col(row, "priority")),
    comments: col(row, "comments"),
    evidence: col(row, "evidence"),
    gateKind: normalizeGateKind(col(row, "gateKind")),
  };
}