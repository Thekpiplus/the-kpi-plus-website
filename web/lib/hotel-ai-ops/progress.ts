import type { HaiApprovalStatus, HaiGateKind, HaiReadiness, HaiStatus, HaiSubtaskProgress, HaiSubtaskStatus } from "./types";

const CLOSED_STATUSES: HaiStatus[] = ["handed_over", "stopped"];
const GATE_KINDS: HaiGateKind[] = ["safety", "access", "privacy"];

export function haiSubtaskProgress(
  subtasks: Array<{ completed: boolean; status?: HaiSubtaskStatus | string; gateKind?: HaiGateKind | string; name?: string }>,
  recordStatus: HaiStatus = "backlog",
  approvals: Array<{ status?: HaiApprovalStatus | string }> = [],
): HaiSubtaskProgress {
  const total = subtasks.length;
  const completed = subtasks.filter((item) => item.completed || item.status === "completed").length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const gateReasons = Array.from(
    new Set(
      subtasks
        .filter((item) => item.status === "blocked" && GATE_KINDS.includes((item.gateKind || "none") as HaiGateKind))
        .map((item) => item.gateKind as HaiGateKind),
    ),
  );
  const blockedByGate = gateReasons.length > 0;
  const blocked = blockedByGate || subtasks.some((item) => item.status === "blocked");
  const approved = approvals.some((item) => item.status === "approved") || CLOSED_STATUSES.includes(recordStatus);
  let readiness: HaiReadiness = "not_started";
  if (blockedByGate || blocked) readiness = "blocked";
  else if (subtasks.some((item) => item.status === "needs_review")) readiness = "ready_for_review";
  else if (total > 0 && percent >= 100) readiness = approved ? "completed" : "ready_for_review";
  else if (total > 0 && percent > 0) readiness = "in_progress";
  return {
    total,
    completed,
    percent,
    readiness,
    countLabel: `${completed}/${total} completed`,
    blockedByGate,
    gateReasons,
  };
}

export function haiDepartmentProgress(
  subtasks: Array<{ completed: boolean; status?: HaiSubtaskStatus | string; department?: string; gateKind?: HaiGateKind | string }>,
  department: string,
  recordStatus: HaiStatus = "backlog",
  approvals: Array<{ status?: HaiApprovalStatus | string }> = [],
) {
  return haiSubtaskProgress(
    subtasks.filter((item) => item.department === department),
    recordStatus,
    approvals,
  );
}
