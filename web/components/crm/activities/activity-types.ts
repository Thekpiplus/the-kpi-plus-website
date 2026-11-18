import { ACTIVITY_LABEL } from "@/lib/crm/constants";
import type { ActivityKindTone } from "@/components/crm/activities/activity-tones";
import { KIND_FILL } from "@/components/crm/activities/activity-tones";

export type ActivityStatusFilter = "open" | "overdue" | "today" | "upcoming";
export type ActivityDayFilter = "all" | "overdue" | "anytime" | "0" | "1" | "2" | "3" | "4" | "5" | "6";
export type ActivityKindFilter = "all" | ActivityKindTone;

export type ActivityCard = {
  id: string;
  leadId: string;
  code: string;
  kind: ActivityKindTone;
  kindLabel: string;
  title: string;
  detail: string;
  contactName: string;
  businessName: string;
  ownerName: string;
  valueLabel: string;
  dueAt: string | null;
  dueLabel: string;
  dueBucket: "overdue" | "today" | "upcoming" | "anytime";
  dayOffset: number | null;
  isOld: boolean;
  typeRaw: string;
};

export const KIND_META: Record<ActivityKindTone, { label: string }> = {
  call: { label: "โทร" },
  line: { label: "LINE" },
  email: { label: "อีเมล" },
  meeting: { label: "นัดเยี่ยมชม" },
  proposal: { label: "ใบเสนอราคา" },
  contract: { label: "ทำสัญญา" },
  task: { label: "งานติดตาม" },
};

const BANGKOK = "Asia/Bangkok";

function bangkokYmd(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BANGKOK,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function startOfDayBangkok(base = new Date()) {
  const ymd = bangkokYmd(base);
  return new Date(`${ymd}T00:00:00+07:00`);
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function formatThaiDateLong(value = new Date()) {
  return new Intl.DateTimeFormat("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: BANGKOK,
  }).format(value);
}

export function formatDueLabel(dueAt: Date | null) {
  if (!dueAt) return "ไม่มีกำหนด";
  return new Intl.DateTimeFormat("th-TH", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: BANGKOK,
  }).format(dueAt);
}

export function formatBaht(value: number | null | undefined) {
  if (value == null || value <= 0) return "ยังไม่ประเมิน";
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(value);
}

export function mapActivityKind(type: string, title: string): ActivityKindTone {
  const t = type.toLowerCase();
  const titleLower = title.toLowerCase();
  if (t === "call") return "call";
  if (t === "line" || t === "whatsapp") return "line";
  if (t === "email") return "email";
  if (t === "meeting") return "meeting";
  if (t === "proposal") return "proposal";
  if (
    t === "task" &&
    (/contract|สัญญา|เซ็น|ปิดดีล|ปิดการขาย/.test(titleLower) || /สัญญา|เซ็น/.test(title))
  ) {
    return "contract";
  }
  if (t === "task") return "task";
  return "task";
}

/** Prefer Thai UI copy; hide raw English legacy titles. */
export function thaiActivityTitle(type: string, title: string, contactName: string) {
  const trimmed = title.trim();
  const kind = mapActivityKind(type, trimmed);
  const hasLatinOnly = /^[\x00-\x7F]+$/.test(trimmed) && /[A-Za-z]/.test(trimmed);
  const looksEnglishVerb =
    /^(call|email|follow[- ]?up|finalize|send|meeting|proposal|task)\b/i.test(trimmed);
  if (!trimmed || hasLatinOnly || looksEnglishVerb) {
    const base =
      kind === "contract"
        ? "ทำสัญญา"
        : ACTIVITY_LABEL[type as keyof typeof ACTIVITY_LABEL] ?? KIND_META[kind].label;
    return `${base}กับ ${contactName}`;
  }
  return trimmed;
}

export function thaiActivityDetail(notes: string, stageName: string) {
  const note = notes.trim();
  if (note && !/^[\x00-\x7F]+$/.test(note)) return note.slice(0, 160);
  if (stageName) return `ขั้นปัจจุบัน: ${stageName}`;
  return "ติดตามลีดตามกำหนดในคิว";
}

export function classifyDue(dueAt: Date | null, now = new Date()) {
  if (!dueAt) {
    return { bucket: "anytime" as const, dayOffset: null as number | null };
  }
  const start = startOfDayBangkok(now);
  const endToday = addDays(start, 1);
  const endWeek = addDays(start, 7);
  if (dueAt.getTime() < start.getTime()) {
    return { bucket: "overdue" as const, dayOffset: null };
  }
  if (dueAt.getTime() < endToday.getTime()) {
    return { bucket: "today" as const, dayOffset: 0 };
  }
  if (dueAt.getTime() < endWeek.getTime()) {
    const ymdDue = bangkokYmd(dueAt);
    for (let i = 1; i <= 6; i += 1) {
      if (bangkokYmd(addDays(start, i)) === ymdDue) {
        return { bucket: "upcoming" as const, dayOffset: i };
      }
    }
    return { bucket: "upcoming" as const, dayOffset: 1 };
  }
  return { bucket: "upcoming" as const, dayOffset: null };
}

export function kindFill(kind: ActivityKindTone) {
  return KIND_FILL[kind];
}

export function shortCode(id: string) {
  return `A-${id.slice(-4).toUpperCase()}`;
}

export function parseStatus(value: string | undefined): ActivityStatusFilter {
  if (value === "overdue" || value === "today" || value === "upcoming" || value === "open") return value;
  return "open";
}

export function parseDay(value: string | undefined): ActivityDayFilter {
  if (
    value === "all" ||
    value === "overdue" ||
    value === "anytime" ||
    value === "0" ||
    value === "1" ||
    value === "2" ||
    value === "3" ||
    value === "4" ||
    value === "5" ||
    value === "6"
  ) {
    return value;
  }
  return "all";
}

export function parseKind(value: string | undefined): ActivityKindFilter {
  if (
    value === "call" ||
    value === "line" ||
    value === "email" ||
    value === "meeting" ||
    value === "proposal" ||
    value === "contract" ||
    value === "task"
  ) {
    return value;
  }
  return "all";
}

export function filterActivityCards(
  items: ActivityCard[],
  opts: { status: ActivityStatusFilter; day: ActivityDayFilter; kind: ActivityKindFilter; q: string },
) {
  const needle = opts.q.trim().toLowerCase();
  return items.filter((item) => {
    if (opts.status === "overdue" && item.dueBucket !== "overdue") return false;
    if (opts.status === "today" && item.dueBucket !== "today") return false;
    if (opts.status === "upcoming" && item.dueBucket !== "upcoming") return false;
    if (opts.day === "overdue" && item.dueBucket !== "overdue") return false;
    if (opts.day === "anytime" && item.dueBucket !== "anytime") return false;
    if (opts.day !== "all" && opts.day !== "overdue" && opts.day !== "anytime") {
      const offset = Number(opts.day);
      if (item.dayOffset !== offset) return false;
    }
    if (opts.kind !== "all" && item.kind !== opts.kind) return false;
    if (!needle) return true;
    const hay = `${item.title} ${item.detail} ${item.contactName} ${item.businessName} ${item.kindLabel}`.toLowerCase();
    return hay.includes(needle);
  });
}

export function buildActivityMeta(items: ActivityCard[]) {
  const open = items.length;
  const overdue = items.filter((item) => item.dueBucket === "overdue").length;
  const today = items.filter((item) => item.dueBucket === "today").length;
  const upcoming = items.filter((item) => item.dueBucket === "upcoming").length;
  const anytime = items.filter((item) => item.dueBucket === "anytime").length;
  const perDay: Record<string, { count: number; kinds: ActivityKindTone[] }> = {};
  for (let i = 0; i <= 6; i += 1) {
    const rows = items.filter((item) => item.dayOffset === i);
    perDay[String(i)] = {
      count: rows.length,
      kinds: [...new Set(rows.map((row) => row.kind))],
    };
  }
  const byKind = (Object.keys(KIND_META) as ActivityKindTone[]).map((id) => ({
    id,
    label: KIND_META[id].label,
    count: items.filter((item) => item.kind === id).length,
  }));
  return { open, overdue, today, upcoming, anytime, perDay, byKind };
}
