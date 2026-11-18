export type LeadAllArchiveView = "active" | "archived" | "all";

export type LeadAllStatFilter = "all" | "overdue" | "dueToday" | "awaiting" | "new";

export type LeadAllSort = "urgent" | "value" | "updated";

export type LeadAllStageOption = {
  id: string;
  nameTh: string;
  sortOrder: number;
  isWon: boolean;
  isLost: boolean;
};

export type LeadAllOwnerOption = {
  id: string;
  name: string;
};

export type LeadAllRow = {
  id: string;
  contactName: string;
  businessName: string;
  businessType: string;
  phone: string;
  email: string;
  location: string;
  website: string;
  services: string[];
  source: string;
  sourceLabel: string;
  origin: "web" | "manual";
  stageId: string;
  stageName: string;
  stageIndex: number;
  isWon: boolean;
  isLost: boolean;
  ownerId: string | null;
  ownerName: string | null;
  estimatedValue: number | null;
  message: string;
  formName: string;
  lastContactAt: string | null;
  nextActivityAt: string | null;
  updatedAt: string;
  createdAt: string;
  archivedAt: string | null;
  noFollowUp: boolean;
  outcome: string;
  status: LeadAllStatFilter | "ok";
};

export function formatLeadValue(value: number | null | undefined) {
  if (value == null || Number.isNaN(value) || value <= 0) return "ยังไม่ประเมิน";
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatLeadWhen(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Bangkok",
  }).format(new Date(iso));
}

export function formatLeadDay(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Bangkok",
  }).format(new Date(iso));
}

export function deriveLeadStatus(input: {
  nextActivityAt: string | null;
  lastContactAt: string | null;
  stageIndex: number;
  isWon: boolean;
  isLost: boolean;
  archivedAt: string | null;
  noFollowUp: boolean;
  outcome: string;
}): LeadAllStatFilter | "ok" {
  if (input.archivedAt || input.isWon || input.isLost) return "ok";
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  if (input.nextActivityAt) {
    const due = new Date(input.nextActivityAt).getTime();
    if (due < start.getTime()) return "overdue";
    if (due <= end.getTime()) return "dueToday";
  }

  if (input.stageIndex <= 1) return "new";

  if (!input.noFollowUp && !input.nextActivityAt && !input.outcome) return "awaiting";
  if (!input.lastContactAt && input.stageIndex <= 2) return "awaiting";

  return "ok";
}

export function stageToneClass(stage: { sortOrder: number; isWon: boolean; isLost: boolean }) {
  if (stage.isWon) return "tone-won";
  if (stage.isLost) return "tone-lost";
  const tones = ["tone-1", "tone-2", "tone-3", "tone-4", "tone-5", "tone-6"] as const;
  return tones[(Math.max(stage.sortOrder, 1) - 1) % tones.length];
}
