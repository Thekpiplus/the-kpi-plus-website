import { SOURCES } from "@/lib/crm/constants";
import type { LeadAllRow } from "@/components/crm/leads/lead-all-types";

/** Display names for channel view (Thai-first; Latin keeps Latin casing). */
export const CHANNEL_LABEL: Record<string, string> = {
  website_form: "เว็บไซต์",
  phone: "โทรศัพท์",
  line: "LINE OA",
  whatsapp: "WhatsApp",
  referral: "คนรู้จักแนะนำ",
  partner_referral: "Partner Referral",
  event: "งานอีเวนต์",
  manual: "คีย์เอง",
};

/**
 * One distinct tone per source — do not recycle the same hue across channels.
 * Fallback palette for unknown sources stays high-contrast too.
 */
export const CHANNEL_TONES = [
  "web",
  "phone",
  "line",
  "whatsapp",
  "referral",
  "partner",
  "event",
  "manual",
] as const;

export type ChannelTone = (typeof CHANNEL_TONES)[number];

export const CHANNEL_TONE_BY_SOURCE: Record<string, ChannelTone> = {
  website_form: "web",
  phone: "phone",
  line: "line",
  whatsapp: "whatsapp",
  referral: "referral",
  partner_referral: "partner",
  event: "event",
  manual: "manual",
};

/** Fill colors used by donut + bars (must stay visually far apart). */
export const CHANNEL_FILL: Record<ChannelTone, string> = {
  web: "#D4E813", // bright yellow-lime — website
  phone: "#2563EB", // blue — phone
  line: "#06C755", // LINE brand green
  whatsapp: "#128C7E", // WhatsApp teal (not the same as LINE)
  referral: "#7C3AED", // violet
  partner: "#0F766E", // deep teal
  event: "#EA580C", // orange
  manual: "#475569", // slate
};

const FALLBACK_FILLS = [
  "#DB2777", // pink
  "#0891B2", // cyan
  "#CA8A04", // gold
  "#4F46E5", // indigo
  "#B45309", // brown-amber
  "#BE123C", // rose
] as const;

export type LeadChannelStat = {
  source: string;
  label: string;
  tone: ChannelTone | string;
  fill: string;
  active: number;
  archived: number;
  all: number;
  value: number;
  overdue: number;
  unassigned: number;
};

export function channelLabel(source: string) {
  return CHANNEL_LABEL[source] ?? source;
}

/** H1: ลีดจากเว็บไซต์ · ลีดจาก LINE OA (space before Latin). */
export function channelHeading(source: string) {
  const label = channelLabel(source);
  if (/^[A-Za-z0-9]/.test(label)) return `ลีดจาก ${label}`;
  return `ลีดจาก${label}`;
}

export function channelTone(source: string, index = 0): ChannelTone | string {
  return CHANNEL_TONE_BY_SOURCE[source] ?? `other-${index % FALLBACK_FILLS.length}`;
}

export function channelFill(source: string, index = 0): string {
  const known = CHANNEL_TONE_BY_SOURCE[source];
  if (known) return CHANNEL_FILL[known];
  return FALLBACK_FILLS[index % FALLBACK_FILLS.length];
}

export function buildChannelStats(leads: LeadAllRow[]): LeadChannelStat[] {
  const map = new Map<string, LeadChannelStat>();

  for (const lead of leads) {
    const key = lead.source || "manual";
    let row = map.get(key);
    if (!row) {
      const index = map.size;
      row = {
        source: key,
        label: channelLabel(key),
        tone: channelTone(key, index),
        fill: channelFill(key, index),
        active: 0,
        archived: 0,
        all: 0,
        value: 0,
        overdue: 0,
        unassigned: 0,
      };
      map.set(key, row);
    }
    row.all += 1;
    if (lead.archivedAt) {
      row.archived += 1;
    } else {
      row.active += 1;
      if (lead.estimatedValue && lead.estimatedValue > 0) row.value += lead.estimatedValue;
      if (lead.status === "overdue") row.overdue += 1;
      if (!lead.ownerId) row.unassigned += 1;
    }
  }

  const order = SOURCES as readonly string[];
  return [...map.values()].sort((a, b) => {
    if (b.active !== a.active) return b.active - a.active;
    const ai = order.indexOf(a.source);
    const bi = order.indexOf(b.source);
    return (ai < 0 ? 999 : ai) - (bi < 0 ? 999 : bi);
  });
}

export function formatChannelValue(value: number) {
  if (!value || value <= 0) return "ยังไม่ประเมิน";
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(value);
}

export function isKnownSource(source: string) {
  return (SOURCES as readonly string[]).includes(source) || source in CHANNEL_LABEL;
}
