import type { SysApprovalStatus, SysDepartment, SysReadiness, SysStatus, SysSubtaskProgress, SysSubtaskStatus } from "./types";

const CLOSED_STATUSES: SysStatus[] = ["handed_over", "completed", "monitoring", "archived"];

/** Progress = completed ÷ total × 100. Readiness: 0% Not Started, 1–99% In Progress, any blocked = Blocked, 100% = Ready for review or Completed by approval. */
export function convSubtaskProgress(
  subtasks: Array<{ completed: boolean; status?: SysSubtaskStatus | string }>,
  recordStatus: SysStatus = "draft",
  approvals: Array<{ status?: SysApprovalStatus | string }> = [],
): SysSubtaskProgress {
  const total = subtasks.length;
  const completed = subtasks.filter((item) => item.completed || item.status === "completed").length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const blocked = subtasks.some((item) => item.status === "blocked");
  const approved = approvals.some((item) => item.status === "approved") || CLOSED_STATUSES.includes(recordStatus);
  let readiness: SysReadiness = "not_started";
  if (blocked) readiness = "blocked";
  else if (total > 0 && percent >= 100) readiness = approved ? "completed" : "ready_for_review";
  else if (total > 0 && percent > 0) readiness = "in_progress";
  return {
    total,
    completed,
    percent,
    readiness,
    countLabel: `${completed}/${total} completed`,
  };
}

export function convDepartmentProgress(
  subtasks: Array<{ completed: boolean; status?: SysSubtaskStatus | string; department?: string }>,
  department: SysDepartment,
  recordStatus: SysStatus = "draft",
  approvals: Array<{ status?: SysApprovalStatus | string }> = [],
) {
  return convSubtaskProgress(
    subtasks.filter((item) => item.department === department),
    recordStatus,
    approvals,
  );
}
