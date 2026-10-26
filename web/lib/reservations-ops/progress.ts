import type {
  ReservationOpProgress,
  ReservationOpStatus,
  ReservationSubtaskStatus,
} from "./types";

const STICKY_STATUSES: ReservationOpStatus[] = ["escalated", "closed", "cancelled"];

export function subtaskProgress(
  subtasks: Array<{ completed: boolean; status?: ReservationSubtaskStatus | string }>,
): ReservationOpProgress {
  const total = subtasks.length;
  const completed = subtasks.filter((item) => item.completed || item.status === "done").length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const label = percent === 0 ? "Not Started" : percent >= 100 ? "Completed" : "In Progress";
  return {
    total,
    completed,
    percent,
    label,
    countLabel: `${completed}/${total} completed`,
  };
}

export function statusFromProgress(
  current: ReservationOpStatus,
  progress: ReservationOpProgress,
): ReservationOpStatus {
  if (STICKY_STATUSES.includes(current)) return current;
  if (progress.total === 0) return current;
  if (progress.percent === 0) return current === "pending_hotel" || current === "pending_guest" ? current : "new";
  if (progress.percent < 100) {
    if (current === "pending_hotel" || current === "pending_guest") return current;
    return "in_progress";
  }
  return "confirmed";
}

export function isStickyStatus(status: ReservationOpStatus) {
  return STICKY_STATUSES.includes(status);
}
