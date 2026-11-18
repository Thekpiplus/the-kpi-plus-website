import { formatLeadValue, type LeadAllRow } from "@/components/crm/leads/lead-all-types";

export type PendingScope = "all" | "website" | "other";

export type PendingReason =
  | "overdue"
  | "dueToday"
  | "awaiting"
  | "neverContacted"
  | "unassigned";

/** Fill colors for donut + bars (must stay visually far apart). */
export const PENDING_REASON_FILL: Record<PendingReason, string> = {
  overdue: "#e11d48",
  dueToday: "#a2dc25",
  awaiting: "#0ea5e9",
  neverContacted: "#ebe722",
  unassigned: "#7c3aed",
};

export const PENDING_REASON_META: Record<
  PendingReason,
  { label: string; tone: "rose" | "lime" | "sky" | "sun" | "violet"; hint: string; fill: string }
> = {
  overdue: {
    label: "เกินกำหนดติดต่อ",
    tone: "rose",
    hint: "นัดติดต่อเลยกำหนดแล้ว",
    fill: PENDING_REASON_FILL.overdue,
  },
  dueToday: {
    label: "ถึงกำหนดวันนี้",
    tone: "lime",
    hint: "ต้องติดตามภายในวันนี้",
    fill: PENDING_REASON_FILL.dueToday,
  },
  awaiting: {
    label: "รอลูกค้าตอบกลับ",
    tone: "sky",
    hint: "ยังไม่มีนัดถัดไปชัดเจน",
    fill: PENDING_REASON_FILL.awaiting,
  },
  neverContacted: {
    label: "ยังไม่เคยติดต่อ",
    tone: "sun",
    hint: "ยังไม่มีบันทึกการติดต่อ",
    fill: PENDING_REASON_FILL.neverContacted,
  },
  unassigned: {
    label: "ยังไม่มอบหมายผู้ดูแล",
    tone: "violet",
    hint: "ยังไม่มีคนรับผิดชอบ",
    fill: PENDING_REASON_FILL.unassigned,
  },
};

export const PENDING_SCOPE_META: Record<PendingScope, { label: string; short: string }> = {
  all: { label: "ทุกช่องทาง", short: "ทุกช่องทาง" },
  website: { label: "เฉพาะฟอร์มเว็บไซต์", short: "ฟอร์มเว็บไซต์" },
  other: { label: "ช่องทางอื่นนอกจากเว็บไซต์", short: "ช่องทางอื่น" },
};

export type PendingReasonStat = {
  id: PendingReason;
  label: string;
  tone: "rose" | "lime" | "sky" | "sun" | "violet";
  hint: string;
  fill: string;
  count: number;
  value: number;
  share: number;
};

export type PendingScopeStat = {
  id: PendingScope;
  label: string;
  short: string;
  count: number;
};

/** งานค้าง = ยังไม่เก็บ และยังไม่ปิดได้ (won) */
export function isPendingLead(lead: LeadAllRow) {
  return !lead.archivedAt && !lead.isWon;
}

export function matchesPendingScope(lead: LeadAllRow, scope: PendingScope) {
  if (scope === "website") return lead.source === "website_form";
  if (scope === "other") return lead.source !== "website_form";
  return true;
}

export function leadHasPendingReason(lead: LeadAllRow, reason: PendingReason) {
  switch (reason) {
    case "overdue":
      return lead.status === "overdue";
    case "dueToday":
      return lead.status === "dueToday";
    case "awaiting":
      // TODO: ให้ server ส่ง reason เพื่อความตรงกับรายงาน
      return lead.status === "awaiting";
    case "neverContacted":
      return !lead.lastContactAt;
    case "unassigned":
      return !lead.ownerId;
    default:
      return false;
  }
}

export function filterPendingLeads(
  leads: LeadAllRow[],
  scope: PendingScope,
  reason: PendingReason | "",
) {
  return leads.filter((lead) => {
    if (!isPendingLead(lead)) return false;
    if (!matchesPendingScope(lead, scope)) return false;
    if (reason && !leadHasPendingReason(lead, reason)) return false;
    return true;
  });
}

export function buildPendingScopeStats(leads: LeadAllRow[]): PendingScopeStat[] {
  const pending = leads.filter(isPendingLead);
  return (["all", "website", "other"] as const).map((id) => ({
    id,
    label: PENDING_SCOPE_META[id].label,
    short: PENDING_SCOPE_META[id].short,
    count: pending.filter((lead) => matchesPendingScope(lead, id)).length,
  }));
}

export function buildPendingReasonStats(
  leads: LeadAllRow[],
  scope: PendingScope,
): PendingReasonStat[] {
  const scoped = leads.filter((lead) => isPendingLead(lead) && matchesPendingScope(lead, scope));
  const total = Math.max(1, scoped.length);

  return (Object.keys(PENDING_REASON_META) as PendingReason[]).map((id) => {
    const meta = PENDING_REASON_META[id];
    const rows = scoped.filter((lead) => leadHasPendingReason(lead, id));
    const value = rows.reduce((sum, lead) => sum + (lead.estimatedValue && lead.estimatedValue > 0 ? lead.estimatedValue : 0), 0);
    return {
      id,
      label: meta.label,
      tone: meta.tone,
      hint: meta.hint,
      fill: meta.fill,
      count: rows.length,
      value,
      share: Math.round((rows.length / total) * 100),
    };
  });
}

export function parsePendingScope(value: string | undefined): PendingScope {
  if (value === "website" || value === "other") return value;
  return "all";
}

export function parsePendingReason(value: string | undefined): PendingReason | "" {
  if (
    value === "overdue" ||
    value === "dueToday" ||
    value === "awaiting" ||
    value === "neverContacted" ||
    value === "unassigned"
  ) {
    return value;
  }
  return "";
}

export { formatLeadValue };
