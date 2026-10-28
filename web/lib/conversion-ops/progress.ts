import type { ConvApprovalStatus, ConvReadiness, ConvStatus, ConvSubtaskProgress, ConvSubtaskStatus } from "./types";

const CLOSED_STATUSES: ConvStatus[] = ["completed", "measuring", "archived"];

export function convSubtaskProgress(
  subtasks: Array<{ completed: boolean; status?: ConvSubtaskStatus | string }>,
  recordStatus: ConvStatus = "draft",
  approvals: Array<{ status?: ConvApprovalStatus | string }> = [],
): ConvSubtaskProgress {
  const total = subtasks.length;
  const completed = subtasks.filter((item) => item.completed || item.status === "completed").length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const blocked = subtasks.some((item) => item.status === "blocked");
  const approved = approvals.some((item) => item.status === "approved") || CLOSED_STATUSES.includes(recordStatus);
  let readiness: ConvReadiness = "not_started";
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
