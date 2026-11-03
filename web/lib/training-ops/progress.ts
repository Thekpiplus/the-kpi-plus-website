import {
  TRN_BLOCKING_GATES,
  type TrnApprovalStatus,
  type TrnGateKind,
  type TrnReadiness,
  type TrnStatus,
  type TrnSubtaskProgress,
  type TrnSubtaskStatus,
} from "./types";

const CLOSED_STATUSES: TrnStatus[] = ["cancelled", "archived"];

export function trnSubtaskProgress(
  subtasks: Array<{ completed: boolean; status?: TrnSubtaskStatus | string; gateKind?: TrnGateKind | string; name?: string }>,
  recordStatus: TrnStatus = "draft",
  approvals: Array<{ status?: TrnApprovalStatus | string }> = [],
): TrnSubtaskProgress {
  const total = subtasks.length;
  const completed = subtasks.filter((item) => item.completed || item.status === "completed").length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const gateReasons = Array.from(
    new Set(
      subtasks
        .filter((item) => item.status === "blocked" && TRN_BLOCKING_GATES.includes((item.gateKind || "none") as (typeof TRN_BLOCKING_GATES)[number]))
        .map((item) => item.gateKind as TrnGateKind),
    ),
  );
  const blockedByGate = gateReasons.length > 0;
  const blocked = blockedByGate || subtasks.some((item) => item.status === "blocked");
  const approved = approvals.some((item) => item.status === "approved") || CLOSED_STATUSES.includes(recordStatus);
  let readiness: TrnReadiness = "not_started";
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

export function trnDepartmentProgress(
  subtasks: Array<{ completed: boolean; status?: TrnSubtaskStatus | string; department?: string; gateKind?: TrnGateKind | string }>,
  department: string,
  recordStatus: TrnStatus = "draft",
  approvals: Array<{ status?: TrnApprovalStatus | string }> = [],
) {
  return trnSubtaskProgress(
    subtasks.filter((item) => item.department === department),
    recordStatus,
    approvals,
  );
}
