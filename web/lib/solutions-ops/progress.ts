import {
  SOL_BLOCKING_GATES,
  SOL_PRIORITY_RANK,
  blockedByGateMessage,
  type SolGateKind,
  type SolPriority,
  type SolReadiness,
  type SolSubtaskProgress,
  type SolSubtaskStatus,
} from "./types";

export type SolSubtaskLike = {
  completed: boolean;
  status?: SolSubtaskStatus | string;
  gateKind?: SolGateKind | string;
  department?: string;
  priority?: SolPriority | string;
  dueAt?: string;
};

/** True when this subtask is blocked on one of the blocking gates. */
export function isGateBlocked(item: Pick<SolSubtaskLike, "status" | "gateKind">) {
  return item.status === "blocked" && (SOL_BLOCKING_GATES as readonly string[]).includes(item.gateKind || "none");
}

/**
 * Progress for a service or inquiry.
 * - completed counts the checkbox or status = completed.
 * - blockedByGate is true when any subtask is `blocked` AND its gate is permission|evidence|privacy|approval.
 * - gate reasons are de-duplicated gate kinds that are currently blocking.
 */
export function solSubtaskProgress(subtasks: SolSubtaskLike[]): SolSubtaskProgress {
  const total = subtasks.length;
  const completed = subtasks.filter((item) => item.completed || item.status === "completed").length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const gateReasons = Array.from(new Set(subtasks.filter(isGateBlocked).map((item) => item.gateKind as SolGateKind)));
  const blockedByGate = gateReasons.length > 0;
  const blocked = blockedByGate || subtasks.some((item) => item.status === "blocked" && !item.completed);

  let readiness: SolReadiness = "not_started";
  if (blocked) readiness = "blocked";
  else if (total > 0 && percent >= 100) readiness = "completed";
  else if (subtasks.some((item) => item.status === "needs_review" && !item.completed)) readiness = "ready_for_review";
  else if (total > 0 && (percent > 0 || subtasks.some((item) => item.status === "in_progress"))) readiness = "in_progress";

  return { total, completed, percent, countLabel: `${completed}/${total} completed`, blockedByGate, gateReasons, readiness };
}

export function solDepartmentProgress(subtasks: SolSubtaskLike[], department: string) {
  return solSubtaskProgress(subtasks.filter((item) => item.department === department));
}

/**
 * Blocking check used by the server before approve / publish (service) and close (inquiry).
 * Returns null when allowed, or an error code + human message listing the blocking gates.
 */
export function solGateBlock(subtasks: SolSubtaskLike[]): { error: "blocked_by_gate"; gates: SolGateKind[]; message: string } | null {
  const gates = solSubtaskProgress(subtasks).gateReasons;
  if (!gates.length) return null;
  return { error: "blocked_by_gate", gates, message: blockedByGateMessage(gates) };
}

type AccessLike = { userId: string; departments: string[]; isManagement: boolean; canEdit: boolean; canApprove: boolean };

/**
 * Cross-department subtask rights: the viewer needs edit access to the subtask's department,
 * the parent's department, or must be the assigned owner / reviewer. Inquiries (parentDepartment = null)
 * have no owning department, so any editor may work on them. The server re-checks every action.
 */
export function canTouchSubtask(
  access: AccessLike,
  subtask: { department: string; ownerId?: string; reviewerId?: string },
  parentDepartment: string | null,
) {
  if (!access.canEdit) return false;
  if (access.isManagement || parentDepartment === null) return true;
  if (access.departments.includes(subtask.department) || access.departments.includes(parentDepartment)) return true;
  return subtask.ownerId === access.userId || subtask.reviewerId === access.userId;
}

/** Reviewer or approver may approve / reject a subtask and clear gate-blocked ones. */
export function canDecideSubtask(access: AccessLike, reviewerId: string) {
  return access.isManagement || access.canApprove || (reviewerId !== "" && reviewerId === access.userId);
}

/** Highest open priority across subtasks (used for sorting). Services with no open subtasks rank as normal+1. */
export function solPriorityRank(subtasks: SolSubtaskLike[]) {
  const open = subtasks.filter((item) => !item.completed && item.status !== "completed");
  if (!open.length) return 4;
  return Math.min(...open.map((item) => SOL_PRIORITY_RANK[(item.priority as SolPriority) in SOL_PRIORITY_RANK ? (item.priority as SolPriority) : "normal"]));
}

/** Owner of the most urgent open subtask (falls back to any owned subtask); "none" when nobody owns one. */
export function solPrimaryOwner(subtasks: Array<SolSubtaskLike & { ownerId?: string }>) {
  const owned = subtasks.filter((item) => item.ownerId);
  const open = owned.filter((item) => !item.completed && item.status !== "completed");
  const pool = open.length ? open : owned;
  if (!pool.length) return "none";
  const rank = (item: SolSubtaskLike) => SOL_PRIORITY_RANK[(item.priority as SolPriority) in SOL_PRIORITY_RANK ? (item.priority as SolPriority) : "normal"];
  return [...pool].sort((a, b) => rank(a) - rank(b))[0].ownerId as string;
}

/** Earliest due date among open subtasks, else the fallback (ISO string or ""). */
export function solNextDue(subtasks: SolSubtaskLike[], fallback = "") {
  const dates = subtasks
    .filter((item) => !item.completed && item.status !== "completed" && item.dueAt)
    .map((item) => String(item.dueAt))
    .filter((value) => !Number.isNaN(new Date(value).getTime()))
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  return dates[0] ?? fallback;
}
