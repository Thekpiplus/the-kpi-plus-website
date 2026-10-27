import type { B2bActivityProgress, B2bActivityStatus, B2bSubtaskStatus } from "./types";

const STICKY: B2bActivityStatus[] = ["cancelled", "closed", "escalated"];

export function b2bSubtaskProgress(
  subtasks: Array<{ completed: boolean; status?: B2bSubtaskStatus | string }>,
): B2bActivityProgress {
  const total = subtasks.length;
  const completed = subtasks.filter((item) => item.completed || item.status === "completed" || item.status === "done").length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const label = percent === 0 ? "Planned" : percent >= 100 ? "Completed" : "In Progress";
  return {
    total,
    completed,
    percent,
    label,
    countLabel: `${completed}/${total} completed`,
  };
}

export function activityStatusFromProgress(current: B2bActivityStatus, progress: B2bActivityProgress): B2bActivityStatus {
  if (STICKY.includes(current)) return current;
  if (progress.total === 0) return current;
  if (progress.percent === 0) return "planned";
  if (progress.percent < 100) return "in_progress";
  return "completed";
}

export function isStickyActivityStatus(status: B2bActivityStatus) {
  return STICKY.includes(status);
}
