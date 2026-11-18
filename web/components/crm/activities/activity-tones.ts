/** Activity Spec A tones — use these only (no ad-hoc hex in JSX). */
export const ACTIVITY_TONES = {
  brand: "#A2DC25",
  brandInk: "#1A3A02",
  brandSoft: "#F4FBE4",
  rose: "#A73542",
  roseSoft: "#FFE8EE",
  surface: "#F6F8F6",
  card: "#FFFFFF",
  border: "#E6EAE7",
  text: "#16202B",
  muted: "#5B6B7A",
  call: "#2563EB",
  line: "#06C755",
  email: "#0EA5E9",
  meeting: "#7C3AED",
  proposal: "#EA580C",
  contract: "#0F766E",
  task: "#475569",
  today: "#A2DC25",
  upcoming: "#38BDF8",
  overdue: "#A73542",
} as const;

export type ActivityKindTone = "call" | "line" | "email" | "meeting" | "proposal" | "contract" | "task";

export const KIND_FILL: Record<ActivityKindTone, string> = {
  call: ACTIVITY_TONES.call,
  line: ACTIVITY_TONES.line,
  email: ACTIVITY_TONES.email,
  meeting: ACTIVITY_TONES.meeting,
  proposal: ACTIVITY_TONES.proposal,
  contract: ACTIVITY_TONES.contract,
  task: ACTIVITY_TONES.task,
};
