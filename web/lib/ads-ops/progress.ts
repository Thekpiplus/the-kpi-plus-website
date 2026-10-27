import type { AdsReadiness, AdsStatus, AdsSubtaskStatus } from "./types";

export type AdsSubtaskProgress = {
  total: number;
  completed: number;
  percent: number;
  readiness: AdsReadiness;
  countLabel: string;
};

const LIVE_OR_CLOSED: AdsStatus[] = ["active", "optimizing", "paused", "ended", "archived"];

export function adsSubtaskProgress(
  subtasks: Array<{ completed: boolean; status?: AdsSubtaskStatus | string }>,
  campaignStatus: AdsStatus = "draft",
): AdsSubtaskProgress {
  const total = subtasks.length;
  const completed = subtasks.filter((item) => item.completed || item.status === "completed").length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const blocked = subtasks.some((item) => item.status === "blocked");
  let readiness: AdsReadiness = "not_started";
  if (blocked) readiness = "blocked";
  else if (total > 0 && percent > 0 && percent < 100) readiness = "in_progress";
  else if (total > 0 && percent >= 100) {
    readiness = LIVE_OR_CLOSED.includes(campaignStatus) ? "completed" : "ready_for_review";
  }
  return {
    total,
    completed,
    percent,
    readiness,
    countLabel: `${completed}/${total} completed`,
  };
}

export function shouldAwaitReview(status: AdsStatus, progress: AdsSubtaskProgress) {
  if (progress.readiness !== "ready_for_review") return false;
  return status === "draft" || status === "planning" || status === "ready_to_launch";
}
