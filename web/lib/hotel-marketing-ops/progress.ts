import {
  HMO_BLOCKING_GATES,
  type HmoApprovalStatus,
  type HmoGateKind,
  type HmoReadiness,
  type HmoStatus,
  type HmoSubtaskProgress,
  type HmoSubtaskStatus,
} from "./types";

type SubtaskLike = {
  completed: boolean;
  status?: HmoSubtaskStatus | string;
  gateKind?: HmoGateKind | string;
  department?: string;
};

const CLOSED_STATUSES: HmoStatus[] = ["archived", "published"];

export function hmoSubtaskProgress(
  subtasks: SubtaskLike[],
  recordStatus: HmoStatus = "draft",
  approvals: Array<{ status?: HmoApprovalStatus | string }> = [],
): HmoSubtaskProgress {
  const total = subtasks.length;
  const completed = subtasks.filter((item) => item.completed || item.status === "completed").length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const gateReasons = Array.from(
    new Set(
      subtasks
        .filter((item) => item.status === "blocked" && HMO_BLOCKING_GATES.includes((item.gateKind || "none") as HmoGateKind))
        .map((item) => item.gateKind as HmoGateKind),
    ),
  );
  const blockedByGate = gateReasons.length > 0;
  const blocked = blockedByGate || subtasks.some((item) => item.status === "blocked");
  const approved = approvals.some((item) => item.status === "approved") || CLOSED_STATUSES.includes(recordStatus);
  let readiness: HmoReadiness = "not_started";
  if (blocked) readiness = "blocked";
  else if (subtasks.some((item) => item.status === "needs_review")) readiness = "ready_for_review";
  else if (total > 0 && percent >= 100) readiness = approved ? "completed" : "ready_for_review";
  else if (total > 0 && percent > 0) readiness = "in_progress";
  else if (total > 0 && subtasks.some((item) => item.status === "in_progress")) readiness = "in_progress";

  const departmentIds = Array.from(new Set(subtasks.map((item) => item.department || "").filter(Boolean)));
  const byDepartment = departmentIds.map((department) => {
    const rows = subtasks.filter((item) => item.department === department);
    const deptTotal = rows.length;
    const deptCompleted = rows.filter((item) => item.completed || item.status === "completed").length;
    const deptPercent = deptTotal === 0 ? 0 : Math.round((deptCompleted / deptTotal) * 100);
    return {
      department,
      total: deptTotal,
      completed: deptCompleted,
      percent: deptPercent,
      countLabel: `${deptCompleted}/${deptTotal} completed`,
    };
  });

  return {
    total,
    completed,
    percent,
    readiness,
    countLabel: `${completed}/${total} completed`,
    blockedByGate,
    gateReasons,
    byDepartment,
  };
}

export function hmoDepartmentProgress(
  subtasks: SubtaskLike[],
  department: string,
  recordStatus: HmoStatus = "draft",
  approvals: Array<{ status?: HmoApprovalStatus | string }> = [],
) {
  return hmoSubtaskProgress(
    subtasks.filter((item) => item.department === department),
    recordStatus,
    approvals,
  );
}

export function hmoDepartmentSubtasks<T extends { department: string }>(items: T[], department: string) {
  return items.filter((item) => item.department === department);
}
