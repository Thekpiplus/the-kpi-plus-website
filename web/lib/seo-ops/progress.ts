import type { SeoApprovalStatus, SeoReadiness, SeoStatus, SeoSubtaskProgress, SeoSubtaskStatus } from "./types";

const CLOSED_STATUSES: SeoStatus[] = ["published", "tracking", "completed", "archived"];

export function seoSubtaskProgress(
  subtasks: Array<{ completed: boolean; status?: SeoSubtaskStatus | string }>,
  recordStatus: SeoStatus = "draft",
  approvalStatus: SeoApprovalStatus = "not_requested",
): SeoSubtaskProgress {
  const total = subtasks.length;
  const completed = subtasks.filter((item) => item.completed || item.status === "completed").length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const blocked = subtasks.some((item) => item.status === "blocked");
  let readiness: SeoReadiness = "not_started";
  if (blocked) readiness = "blocked";
  else if (total > 0 && percent >= 100) {
    readiness = CLOSED_STATUSES.includes(recordStatus) || approvalStatus === "approved" ? "completed" : "ready_for_review";
  } else if (total > 0 && percent > 0) {
    readiness = "in_progress";
  }
  return {
    total,
    completed,
    percent,
    readiness,
    countLabel: `${completed}/${total} completed`,
  };
}

export function shouldAwaitReview(status: SeoStatus, progress: SeoSubtaskProgress) {
  if (progress.readiness !== "ready_for_review") return false;
  return status === "draft" || status === "audit_scheduled" || status === "action_planned" || status === "in_progress" || status === "waiting_hotel";
}
