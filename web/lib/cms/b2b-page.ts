import { faqsForRoute, type FaqItem } from "@/lib/faqs";
import {
  formatInsightDate,
  insightExcerpt,
  insightPosts,
  insightUpdatedAt,
  insightsIndexCopy,
} from "@/lib/insights";
import { solutionNavLabel } from "@/lib/nav";
import type { Locale } from "@/lib/seo";
import { existingHref, localizePath } from "@/lib/seo";
import {
  REVENUE_INTENTS,
  REVENUE_KPI_STATUSES,
  REVENUE_VISUAL_STATUSES,
  type RevenueIntent,
  type RevenueVisualStatus,
} from "@/lib/cms/revenue-page";
import {
  B2B_FRAMEWORK_ROWS,
  B2B_FUNNEL_SECTION,
  B2B_FUNNEL_STEPS,
  B2B_FUNNEL_VISUAL,
  B2B_FUNNEL_VISUAL_CANDIDATE,
  B2B_HERO_VISUAL_CANDIDATE,
  B2B_KPIS,
  B2B_KPI_VISUAL,
  B2B_KPI_VISUAL_CANDIDATE,
  B2B_ENQUIRY,
  B2B_READINESS_ITEMS,
  B2B_READINESS_VISUAL,
  B2B_RELATED_VISUAL,
  B2B_RELATED_VISUAL_CANDIDATE,
  B2B_SCOPE_ITEMS,
  B2B_TEAM_VISUAL,
  B2B_TEAM_VISUAL_CANDIDATE,
  B2B_WORKFLOW_BOUNDARY,
  B2B_WORKFLOW_SECTION,
  B2B_WORKFLOW_STEPS,
  B2B_WORKFLOW_VISUAL,
  B2B_WORKFLOW_VISUAL_CANDIDATE,
  type B2bFunnelMarker,
  type B2bKpiStatus,
  type B2bScopeOwnerKind,
} from "@/lib/b2b";

export const B2B_CMS_TEMPLATE = "b2b-agent-sales";
export const B2B_PAGE_SLUG = "solutions/b2b-agent-sales";
export const B2B_PAGE_ROUTE = "/solutions/b2b-agent-sales";

export const B2B_INTENTS = REVENUE_INTENTS;
export const B2B_VISUAL_STATUSES = REVENUE_VISUAL_STATUSES;
export const B2B_KPI_STATUSES = REVENUE_KPI_STATUSES;
export type B2bIntent = RevenueIntent;
export type B2bVisualStatus = RevenueVisualStatus;
export type B2bSaveResult = { ok: true; id: string; intent: B2bIntent } | { ok: false; error: string };

export type CmsCta = { label: string; href: string };

export type CmsB2bVisual = {
  src: string;
  altTh: string;
  altEn: string;
  status: B2bVisualStatus;
  label: string;
  caption: string;
};

export type CmsB2bReadinessItem = {
  id: string;
  area: string;
  problem: string;
  prepare: string;
  output: string;
  order: number;
};

export type CmsB2bScopeItem = {
  id: string;
  area: string;
  action: string;
  input: string;
  output: string;
  owner: string;
  ownerKind: B2bScopeOwnerKind;
  href: string;
  linkLabel: string;
  order: number;
};

export type CmsB2bProblem = { id: string; text: string; order: number };

export type CmsB2bWorkflowStep = {
  id: string;
  number: string;
  title: string;
  owner: string;
  input: string;
  action: string;
  output: string;
  escalation: string;
  order: number;
};

export type CmsB2bWorkflowBoundary = {
  kicker: string;
  note: string;
  supportTitle: string;
  approveTitle: string;
  support: string[];
  approve: string[];
};

export type CmsB2bFunnelKpi = { id: string; name: string };

export type CmsB2bFunnelStep = {
  id: string;
  number: string;
  marker: B2bFunnelMarker;
  label: string;
  definition: string;
  output: string;
  kpiId: string;
  kpiName: string;
  extraKpis: CmsB2bFunnelKpi[];
};

export type CmsB2bKpi = {
  id: string;
  name: string;
  definition: string;
  unit: string;
  period: string;
  target: string;
  value: string;
  dataStatus: B2bKpiStatus;
  values: number[];
  labels: string[];
  updatedAt: string;
  hideUntilData: boolean;
};

export type CmsRelatedCard = {
  id: string;
  href: string;
  category: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  contentType: string;
  readingTime: string;
  meta: string;
  cta: string;
  featured: boolean;
};

export type CmsB2bCheckItem = {
  id: string;
  check: string;
  why: string;
  output: string;
  order: number;
};

export type CmsB2bCriterion = {
  id: string;
  text: string;
  order: number;
};

export type CmsB2bGuides = {
  readinessTitle: string;
  readinessChecks: CmsB2bCheckItem[];
  partnerFitTitle: string;
  partnerFit: CmsB2bCriterion[];
  salesMaterialTitle: string;
  salesMaterial: CmsB2bCriterion[];
  rateCommissionTitle: string;
  rateCommissionBody: string;
};

export type CmsB2bPage = {
  version: 1;
  template: typeof B2B_CMS_TEMPLATE;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    leadNext: string;
    leadClose: string;
    primaryCta: CmsCta;
    secondaryCta: CmsCta;
    underCta: string;
    caption: string;
    visual: CmsB2bVisual;
  };
  readiness: { title: string; body: string; close: string; visual: CmsB2bVisual; items: CmsB2bReadinessItem[] };
  problemsSection: { title: string };
  problems: CmsB2bProblem[];
  scopeSection: { title: string };
  scopeItems: CmsB2bScopeItem[];
  funnelSection: { title: string; lead: string; caption: string; visual: CmsB2bVisual };
  funnelSteps: CmsB2bFunnelStep[];
  workflowSection: {
    title: string;
    lead: string;
    visual: CmsB2bVisual;
    boundary: CmsB2bWorkflowBoundary;
  };
  workflowSteps: CmsB2bWorkflowStep[];
  measureSection: { title: string; intro: string; close: string; sampleLabel: string; visual: CmsB2bVisual };
  kpis: CmsB2bKpi[];
  related: { title: string; visual: CmsB2bVisual; cards: CmsRelatedCard[] };
  form: {
    kicker: string;
    heading: string;
    lead: string;
    submit: string;
    receiveTitle: string;
    receive: string[];
    nextTitle: string;
    steps: string[];
    visual: CmsB2bVisual;
  };
  faqIntro: string;
  faqs: Array<FaqItem & { id: string }>;
  guides: CmsB2bGuides;
  seo: { social: CmsB2bVisual };
};

export type B2bEditorState = {
  id: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  locale: string;
  status: string;
  content: CmsB2bPage;
};

const PLACEHOLDER_RE = /placeholder|replace with verified|replace with approved|รอรูป|lorem ipsum/i;
const SAMPLE_RE = /sample data|sample visual|ตัวอย่างข้อมูล|ตัวอย่าง/i;
const CTA_RE = /^(#|\/|https?:\/\/|mailto:|tel:)/i;
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_RE = /(?:\+?\s*66|\b0)\s*\d(?:[\s.-]?\d){7,9}\b/;
const CARD_RE = /\b(?:\d[ -]*?){13,19}\b/;
const MONEY_RE = /(?:THB|฿)\s*[\d,.]+|[\d,.]+\s*(?:THB|บาท)/i;
const COMMISSION_PCT_RE = /(?:commission|คอมมิชชัน|ค่าคอม)[^\n]{0,48}\d+(?:\.\d+)?\s*%/i;

function emptyVisual(): CmsB2bVisual {
  return { src: "", altTh: "", altEn: "", status: "placeholder", label: "", caption: "" };
}

function emptyCta(): CmsCta {
  return { label: "", href: "/" };
}

export function emptyB2bCms(): CmsB2bPage {
  return {
    version: 1,
    template: B2B_CMS_TEMPLATE,
    hero: {
      eyebrow: "",
      title: "",
      description: "",
      leadNext: "",
      leadClose: "",
      primaryCta: emptyCta(),
      secondaryCta: emptyCta(),
      underCta: "",
      caption: "",
      visual: emptyVisual(),
    },
    readiness: { title: "", body: "", close: "", visual: emptyVisual(), items: [] },
    problemsSection: { title: "" },
    problems: [],
    scopeSection: { title: "" },
    scopeItems: [],
    funnelSection: { title: "", lead: "", caption: "", visual: emptyVisual() },
    funnelSteps: [],
    workflowSection: {
      title: "",
      lead: "",
      visual: emptyVisual(),
      boundary: { kicker: "", note: "", supportTitle: "", approveTitle: "", support: [], approve: [] },
    },
    workflowSteps: [],
    measureSection: { title: "", intro: "", close: "", sampleLabel: "Sample Visual", visual: emptyVisual() },
    kpis: [],
    related: { title: "", visual: emptyVisual(), cards: [] },
    form: {
      kicker: "",
      heading: "",
      lead: "",
      submit: "",
      receiveTitle: "",
      receive: [],
      nextTitle: "",
      steps: [],
      visual: emptyVisual(),
    },
    faqIntro: "",
    faqs: [],
    guides: emptyGuides(),
    seo: { social: emptyVisual() },
  };
}

function emptyGuides(): CmsB2bGuides {
  return {
    readinessTitle: "",
    readinessChecks: [],
    partnerFitTitle: "",
    partnerFit: [],
    salesMaterialTitle: "",
    salesMaterial: [],
    rateCommissionTitle: "",
    rateCommissionBody: "",
  };
}

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function bool(value: unknown, fallback = false) {
  if (typeof value === "boolean") return value;
  if (value === "1" || value === "true") return true;
  if (value === "0" || value === "false") return false;
  return fallback;
}

function asVisualStatus(value: unknown, fallback: B2bVisualStatus = "placeholder"): B2bVisualStatus {
  return REVENUE_VISUAL_STATUSES.includes(value as B2bVisualStatus) ? (value as B2bVisualStatus) : fallback;
}

function asKpiStatus(value: unknown, fallback: B2bKpiStatus = "draft"): B2bKpiStatus {
  const next = String(value || "").toLowerCase();
  if ((REVENUE_KPI_STATUSES as readonly string[]).includes(next)) return next as B2bKpiStatus;
  if (next === "sample") return "sample";
  if (next === "approved") return "approved";
  return fallback;
}

function numbers(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => Number(item)).filter((item) => Number.isFinite(item));
}

function strings(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => text(item)).filter(Boolean);
}

export function newB2bItemId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function parseVisual(value: unknown, fallback: CmsB2bVisual): CmsB2bVisual {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    src: text(row.src) || fallback.src,
    altTh: text(row.altTh) || text(row.alt) || fallback.altTh,
    altEn: text(row.altEn) || text(row.alt) || fallback.altEn,
    status: asVisualStatus(row.status, fallback.status),
    label: text(row.label) || fallback.label,
    caption: text(row.caption) || fallback.caption,
  };
}

export function defaultB2bReadinessItems(locale: Locale = "th"): CmsB2bReadinessItem[] {
  const thai = locale === "th";
  return B2B_FRAMEWORK_ROWS.map((item, index) => ({
    id: item.id,
    area: item.area,
    problem: thai ? item.problemTh : item.problemEn,
    prepare: thai ? item.prepareTh : item.prepareEn,
    output: thai ? item.outputTh : item.outputEn,
    order: index + 1,
  }));
}

function isStaleReadinessCopy(value: string) {
  return /^(ตัวอย่างข้อมูล|sample visual|sample data)$/i.test(value.trim()) ||
    /readiness framework|gap matrix|กรอบความพร้อม|ตารางช่องว่างงานขาย/i.test(value);
}

function parseReadinessVisual(value: unknown, locale: Locale): CmsB2bVisual {
  const visual = parseVisual(value, emptyVisual());
  const thai = locale === "th";
  if (!visual.label.trim() || isStaleReadinessCopy(visual.label)) {
    visual.label = thai ? B2B_READINESS_VISUAL.label.th : B2B_READINESS_VISUAL.label.en;
  }
  if (!visual.caption.trim() || isStaleReadinessCopy(visual.caption)) {
    visual.caption = thai ? B2B_READINESS_VISUAL.caption.th : B2B_READINESS_VISUAL.caption.en;
  }
  if (!visual.altTh.trim() || /กรอบความพร้อมขาย|แผนภาพตัวอย่าง|ตารางช่องว่าง/.test(visual.altTh)) {
    visual.altTh = B2B_READINESS_VISUAL.alt.th;
  }
  if (!visual.altEn.trim() || /readiness framework|sample diagram|gap matrix/i.test(visual.altEn)) {
    visual.altEn = B2B_READINESS_VISUAL.alt.en;
  }
  if (isReusedB2bVisualSrc(visual.src, ["hero", "related", "funnel", "workflow", "kpi", "team", "framework"])) {
    visual.src = "";
  }
  return visual;
}

export function defaultB2bScopeItems(locale: Locale = "th"): CmsB2bScopeItem[] {
  const thai = locale === "th";
  return B2B_SCOPE_ITEMS.map((item, index) => ({
    id: item.id,
    area: item.area,
    action: thai ? item.actionTh : item.actionEn,
    input: thai ? item.inputTh : item.inputEn,
    output: thai ? item.outputTh : item.outputEn,
    owner: thai ? item.ownerTh : item.ownerEn,
    ownerKind: item.ownerKind,
    href: item.href,
    linkLabel: thai ? item.linkLabelTh : item.linkLabelEn,
    order: index + 1,
  }));
}

const SCOPE_ID_ALIASES: Record<string, string> = {
  "partner-fit": "partner-mapping",
  "partner-outreach": "outreach-follow-up",
  "follow-up": "outreach-follow-up",
};

function asScopeOwnerKind(value: unknown, owner: string, fallback: B2bScopeOwnerKind): B2bScopeOwnerKind {
  if (value === "hotel" || value === "shared") return value;
  if (/อนุมัติ|approves|approval/i.test(owner)) return "hotel";
  return fallback;
}

function parseScopeItems(value: unknown, locale: Locale): CmsB2bScopeItem[] {
  const defaults = defaultB2bScopeItems(locale);
  if (!Array.isArray(value)) return defaults;
  const rows = value.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"));
  if (!rows.length) return [];
  const seen = new Set<string>();
  return rows.map((row, index) => {
    const rawId = text(row.id);
    const aliased = SCOPE_ID_ALIASES[rawId] || rawId || `scope-${index + 1}`;
    let id = aliased;
    if (seen.has(id)) {
      id = rawId && !seen.has(rawId) ? rawId : `${aliased}-${index + 1}`;
    }
    seen.add(id);
    const fallback = defaults.find((item) => item.id === aliased || item.id === rawId);
    const migrated = Boolean(text(row.area) || text(row.action) || text(row.owner) || text(row.input));
    const owner = migrated ? text(row.owner) || fallback?.owner || "" : fallback?.owner || "";
    const outputRaw = text(row.output);
    const output = migrated && outputRaw ? outputRaw : fallback?.output || outputRaw;
    return {
      id,
      area: migrated && text(row.area) ? text(row.area) : fallback?.area || "",
      action: migrated ? text(row.action) || text(row.description) || fallback?.action || "" : fallback?.action || "",
      input: text(row.input) || fallback?.input || "",
      output,
      owner,
      ownerKind: asScopeOwnerKind(row.ownerKind, owner, fallback?.ownerKind ?? "shared"),
      href: migrated ? text(row.href) || fallback?.href || "" : fallback?.href || "",
      linkLabel: migrated ? text(row.linkLabel) || fallback?.linkLabel || "" : fallback?.linkLabel || "",
      order: Number(row.order) || index + 1,
    };
  });
}

export function defaultB2bKpis(locale: Locale = "th"): CmsB2bKpi[] {
  const thai = locale === "th";
  return B2B_KPIS.map((kpi) => ({
    id: kpi.id,
    name: kpi.name,
    definition: thai ? kpi.definitionTh : kpi.definitionEn,
    unit: kpi.unit,
    period: thai ? kpi.periodTh : kpi.periodEn,
    target: thai ? kpi.comparisonTh : kpi.comparisonEn,
    value: "",
    dataStatus: "sample",
    values: [],
    labels: [],
    updatedAt: "",
    hideUntilData: true,
  }));
}

const KPI_ID_ALIASES: Record<string, string> = {
  "qualified-rate": "qualified-count",
  revenue: "revenue-by-partner",
  "room-nights-from-b2b": "room-nights",
};

function isGenericKpiLabel(value: string) {
  return /^(ตัวอย่างข้อมูล|sample visual|sample data|partner performance index(?: \(sample\))?|ดัชนีผลงานพาร์ตเนอร์(?: \(ตัวอย่าง\))?|b2b agent sales kpi(?: · sample data)?)$/i.test(
    value.trim(),
  );
}

function parseKpiVisual(value: unknown, locale: Locale): CmsB2bVisual {
  const visual = parseVisual(value, emptyVisual());
  const thai = locale === "th";
  if (!visual.label.trim() || isGenericKpiLabel(visual.label)) {
    visual.label = B2B_KPI_VISUAL.label.en;
  }
  if (!visual.caption.trim() || isGenericKpiLabel(visual.caption)) {
    visual.caption = thai ? B2B_KPI_VISUAL.caption.th : B2B_KPI_VISUAL.caption.en;
  }
  if (!visual.altTh.trim() || /กราฟตัวอย่าง|ดัชนีผลงาน/.test(visual.altTh)) {
    visual.altTh = B2B_KPI_VISUAL.alt.th;
  }
  if (!visual.altEn.trim() || /sample (partner-performance|kpi|diagram)|index chart/i.test(visual.altEn)) {
    visual.altEn = B2B_KPI_VISUAL.alt.en;
  }
  if (isReusedB2bVisualSrc(visual.src, ["hero", "framework", "funnel", "workflow", "readiness", "kpi", "team"])) {
    visual.src = "";
  }
  return visual;
}

export function defaultB2bRelatedCards(locale: Locale = "th"): CmsRelatedCard[] {
  const thai = locale === "th";
  const ui = insightsIndexCopy[locale] ?? insightsIndexCopy.en;
  const insightType = thai ? "บทความ" : "Insight";
  const serviceType = thai ? "บริการ" : "Solution";
  const toolType = thai ? "เครื่องมือ" : "Tool";
  const serviceCta = thai ? "ดูบริการ" : "View service";
  const toolCta = thai ? "ใช้เครื่องมือฟรี" : "Use the free tool";
  const cards: CmsRelatedCard[] = [];

  function addInsight(href: string, featured = false) {
    const post = insightPosts.find((item) => item.href === href && item.isPublished !== false);
    if (!post) return;
    const updated = insightUpdatedAt(post);
    cards.push({
      id: post.slug,
      href,
      category: post.category[locale] || post.category.en || post.category.th,
      title: post.title[locale] || post.title.en || post.title.th,
      description: insightExcerpt(post, locale),
      publishedAt: post.publishedAt,
      updatedAt: updated,
      contentType: insightType,
      readingTime: post.readingTimeMinutes ? `${post.readingTimeMinutes} ${ui.minutes}` : "",
      meta: "",
      cta: ui.read,
      featured,
    });
  }

  addInsight("/insights/direct-booking-journey-audit", true);
  cards.push({
    id: "hotel-direct-bookings",
    href: "/solutions/hotel-direct-bookings",
    category: thai ? "การจองตรง" : "Direct Booking",
    title: solutionNavLabel("/solutions/hotel-direct-bookings", locale) || (thai ? "เพิ่มการจองผ่านเว็บไซต์" : "Website Conversion & Direct Bookings"),
    description: thai
      ? "ช่วยวิเคราะห์ว่าอะไรทำให้ผู้ใช้งานเข้ามาที่เว็บไซต์แล้วไม่ไปต่อถึงการจอง พร้อมปรับเส้นทางจองตรงให้ชัดขึ้น"
      : "See what stops a website visit from becoming a booking, then make the direct-booking path clearer.",
    publishedAt: "",
    updatedAt: "",
    contentType: serviceType,
    readingTime: "",
    meta: thai ? "หน้าบริการ" : "Service page",
    cta: serviceCta,
    featured: false,
  });
  cards.push({
    id: "ota-commission-calculator",
    href: "/tools/ota-commission-calculator",
    category: "OTA / Distribution",
    title:
      locale === "th"
        ? "คำนวณค่าคอมมิชชัน OTA"
        : locale === "ru"
          ? "Комиссия OTA"
          : locale === "zh"
            ? "OTA 佣金"
            : "OTA commission calculator",
    description: thai
      ? "ดูว่ารายได้ OTA เหลือเท่าไรหลังหัก Commission ไม่ใช่ผลลัพธ์ของโรงแรมรายใด"
      : "See the commission cost behind OTA revenue, not a hotel’s live result.",
    publishedAt: "",
    updatedAt: "",
    contentType: toolType,
    readingTime: "",
    meta: thai ? "เครื่องมือคำนวณ" : "Calculator",
    cta: toolCta,
    featured: false,
  });
  cards.push({
    id: "revenue-commercial-management",
    href: "/solutions/revenue-commercial-management",
    category: thai ? "โครงสร้างราคา" : "Rate Structure",
    title:
      solutionNavLabel("/solutions/revenue-commercial-management", locale) ||
      (thai ? "บริหารรายได้และกลยุทธ์การขาย" : "Revenue & Commercial Management"),
    description: thai
      ? "B2B ต้องดูร่วมกับราคา OTA และการจองตรง ไม่ใช่เพิ่มช่องทางโดยไม่ดูภาพรวมรายได้"
      : "B2B has to sit with rates, OTAs, and direct booking. It is not another channel added without the revenue picture.",
    publishedAt: "",
    updatedAt: "",
    contentType: serviceType,
    readingTime: "",
    meta: thai ? "หน้าบริการ" : "Service page",
    cta: serviceCta,
    featured: false,
  });
  addInsight("/insights/hotel-revenue-meetings-that-lead-to-decisions");
  return cards;
}

export function relatedCardDateLabel(card: CmsRelatedCard, locale: Locale) {
  const updated = card.updatedAt.trim();
  const published = card.publishedAt.trim();
  const iso = updated && updated !== published ? updated : published;
  if (!iso) return "";
  const ui = insightsIndexCopy[locale] ?? insightsIndexCopy.en;
  const prefix = updated && updated !== published ? ui.updated : ui.published;
  return `${prefix} ${formatInsightDate(iso, locale)}`;
}

export function relatedCardTypeLabel(card: CmsRelatedCard) {
  return [card.contentType, card.readingTime].map((item) => item.trim()).filter(Boolean).join(" · ");
}

function isGenericRelatedLabel(value: string) {
  return /^(ตัวอย่างข้อมูล|sample visual|sample data|b2b sales \/ partner content)$/i.test(value.trim());
}

function isReusedB2bVisualSrc(
  src: string,
  kinds: Array<"hero" | "framework" | "funnel" | "workflow" | "readiness" | "kpi" | "related" | "team">,
) {
  const next = src.trim();
  if (!next) return false;
  const map = {
    hero: ["b2b-agent-sales-hero", B2B_HERO_VISUAL_CANDIDATE],
    framework: ["b2b-agent-sales-framework", "b2b-agent-sales-readiness-framework"],
    funnel: ["b2b-agent-sales-funnel", B2B_FUNNEL_VISUAL_CANDIDATE],
    workflow: ["b2b-agent-sales-workflow", B2B_WORKFLOW_VISUAL_CANDIDATE],
    readiness: ["b2b-agent-sales-readiness-placeholder", "b2b-agent-sales-readiness.webp"],
    kpi: ["b2b-agent-sales-kpi", B2B_KPI_VISUAL_CANDIDATE],
    related: ["b2b-agent-sales-related-content", B2B_RELATED_VISUAL_CANDIDATE],
    team: ["b2b-agent-sales-team", B2B_TEAM_VISUAL_CANDIDATE],
  } as const;
  return kinds.some((kind) => map[kind].some((token) => next === token || next.includes(token)));
}

function parseRelatedVisual(value: unknown, locale: Locale): CmsB2bVisual {
  const visual = parseVisual(value, emptyVisual());
  const thai = locale === "th";
  if (!visual.label.trim() || isGenericRelatedLabel(visual.label)) {
    visual.label = B2B_RELATED_VISUAL.label.en;
  }
  if (!visual.caption.trim() || isGenericRelatedLabel(visual.caption)) {
    visual.caption = thai ? B2B_RELATED_VISUAL.caption.th : B2B_RELATED_VISUAL.caption.en;
  }
  if (!visual.altTh.trim() || /กราฟตัวอย่าง|ดัชนีผลงาน|ชุดเอกสารความพร้อม|ทบทวนงานขายพาร์ตเนอร์/.test(visual.altTh)) {
    visual.altTh = B2B_RELATED_VISUAL.alt.th;
  }
  if (!visual.altEn.trim() || /sample (partner|kpi|diagram|readiness)|hero/i.test(visual.altEn)) {
    visual.altEn = B2B_RELATED_VISUAL.alt.en;
  }
  if (isReusedB2bVisualSrc(visual.src, ["hero", "framework", "funnel", "workflow", "readiness", "kpi", "team"])) {
    visual.src = "";
  }
  return visual;
}

const RELATED_ID_ALIASES: Record<string, string> = {
  revenue: "revenue-commercial-management",
  "direct-bookings": "hotel-direct-bookings",
  "direct-booking": "direct-booking-journey-audit",
  ota: "ota-commission-calculator",
  "rate-structure": "revenue-commercial-management",
};

function isLegacyRelatedHref(href: string) {
  return href.includes("hotel-budget-calculator") || /\/solutions\/b2b-agent-sales\/?$/.test(href);
}

function parseRelatedCardRow(row: Record<string, unknown>, index: number, defaults: CmsRelatedCard[]): CmsRelatedCard {
  const rawId = RELATED_ID_ALIASES[text(row.id)] || text(row.id) || `related-${index + 1}`;
  const hrefRaw = text(row.href).replace(/\/$/, "");
  const fallback = defaults.find((item) => item.id === rawId) || defaults.find((item) => item.href === hrefRaw);
  const href = hrefRaw || fallback?.href || "";
  return {
    id: rawId,
    href,
    category: text(row.category) || fallback?.category || "",
    title: text(row.title) || fallback?.title || "",
    description: text(row.description) || fallback?.description || "",
    publishedAt: text(row.publishedAt) || fallback?.publishedAt || "",
    updatedAt: text(row.updatedAt) || fallback?.updatedAt || "",
    contentType: text(row.contentType) || fallback?.contentType || "",
    readingTime: text(row.readingTime) || fallback?.readingTime || "",
    meta: text(row.meta) || fallback?.meta || "",
    cta: text(row.cta) || fallback?.cta || "",
    featured: bool(row.featured, fallback?.featured ?? false),
  };
}

function parseRelatedCards(value: unknown, locale: Locale): CmsRelatedCard[] {
  const defaults = defaultB2bRelatedCards(locale);
  if (!Array.isArray(value)) return defaults;
  const rows = value.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"));
  if (!rows.length) return [];
  const parsed = rows
    .map((row, index) => parseRelatedCardRow(row, index, defaults))
    .filter((card) => !isLegacyRelatedHref(card.href));
  return parsed.length ? parsed : defaults;
}

export function defaultB2bFaqs(locale: Locale = "th"): Array<FaqItem & { id: string }> {
  const faqLocale = locale === "th" ? "th" : "en";
  return faqsForRoute(localizePath(B2B_PAGE_ROUTE, faqLocale)).map((item, index) => ({
    id: `faq-${index + 1}`,
    q: item.q,
    a: item.a,
  }));
}

function isLegacyB2bFaq(question: string) {
  return /ช่วยหาเอเยนต์รายใหม่|โรงแรมขนาดเล็กใช้บริการนี้ได้ไหม|เซ็นสัญญาแทนโรงแรม|กันห้องให้เอเยนต์ทุกราย|B2B จะทำงานร่วมกับ OTA|actually help find new agents|Can a small hotel use this service|sign the contract for the hotel|every agent need held rooms|sit with OTAs and direct booking|действительно помогает найти|Может ли маленький отель|подписывает договор вместо|резервировать номера каждому|вместе с OTA и прямым|真的會幫忙找新旅行社|小型飯店可以用這項服務|會代飯店簽署合約|為每家旅行社保留房間|與 OTA、直銷預訂一起/i.test(
    question.trim(),
  );
}

function parseFaqs(value: unknown, locale: Locale): Array<FaqItem & { id: string }> {
  const fallback = defaultB2bFaqs(locale);
  if (!Array.isArray(value)) return fallback;
  const rows = value
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    .map((row, index) => ({
      id: text(row.id) || `faq-${index + 1}`,
      q: text(row.q),
      a: text(row.a),
    }));
  if (!rows.length) return [];
  if (rows.some((row) => isLegacyB2bFaq(row.q))) return fallback;
  return rows;
}

export function defaultB2bForm(locale: Locale = "th"): CmsB2bPage["form"] {
  const thai = locale === "th";
  return {
    kicker: B2B_ENQUIRY.kicker,
    heading: thai ? B2B_ENQUIRY.heading.th : B2B_ENQUIRY.heading.en,
    lead: thai ? B2B_ENQUIRY.lead.th : B2B_ENQUIRY.lead.en,
    submit: thai ? B2B_ENQUIRY.submit.th : B2B_ENQUIRY.submit.en,
    receiveTitle: thai ? B2B_ENQUIRY.receiveTitle.th : B2B_ENQUIRY.receiveTitle.en,
    receive: B2B_ENQUIRY.receive.map((item) => item.title),
    nextTitle: thai ? B2B_ENQUIRY.nextTitle.th : B2B_ENQUIRY.nextTitle.en,
    steps: thai ? [...B2B_ENQUIRY.steps.th] : [...B2B_ENQUIRY.steps.en],
    visual: {
      src: "",
      altTh: "",
      altEn: "",
      status: "placeholder",
      label: B2B_TEAM_VISUAL.label,
      caption: "",
    },
  };
}

function parseFormVisual(value: unknown): CmsB2bVisual {
  const visual = parseVisual(value, emptyVisual());
  if (!visual.label.trim() || /sample visual|ตัวอย่างข้อมูล/i.test(visual.label)) {
    visual.label = B2B_TEAM_VISUAL.label;
  }
  if (
    isReusedB2bVisualSrc(visual.src, ["hero", "framework", "funnel", "workflow", "readiness", "kpi", "related", "team"])
  ) {
    visual.src = "";
  }
  return visual;
}

function parseForm(value: unknown, locale: Locale): CmsB2bPage["form"] {
  const fallback = defaultB2bForm(locale);
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const receive = strings(row.receive);
  const steps = strings(row.steps);
  const legacy =
    !receive.length &&
    !steps.length &&
    !text(row.receiveTitle) &&
    !text(row.nextTitle);
  return {
    kicker: text(row.kicker) || fallback.kicker,
    heading: legacy ? fallback.heading : text(row.heading) || fallback.heading,
    lead: legacy ? fallback.lead : text(row.lead) || fallback.lead,
    submit: legacy ? fallback.submit : text(row.submit) || fallback.submit,
    receiveTitle: text(row.receiveTitle) || fallback.receiveTitle,
    receive: receive.length ? receive : fallback.receive,
    nextTitle: text(row.nextTitle) || fallback.nextTitle,
    steps: steps.length ? steps : fallback.steps,
    visual: parseFormVisual(row.visual),
  };
}

function parseKpis(value: unknown, locale: Locale): CmsB2bKpi[] {
  const defaults = defaultB2bKpis(locale);
  if (!Array.isArray(value)) return defaults;
  const rows = value.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"));
  if (!rows.length) return [];
  return rows.map((row, index) => {
    const rawId = text(row.id);
    const id = KPI_ID_ALIASES[rawId] || rawId || `kpi-${index + 1}`;
    const fallback = defaults.find((item) => item.id === id);
    const dataStatus = asKpiStatus(row.dataStatus, fallback?.dataStatus ?? "sample");
    const unit = text(row.unit) || fallback?.unit || "";
    const period = text(row.period) || fallback?.period || "";
    const inventedSample =
      dataStatus !== "approved" &&
      dataStatus !== "anonymised" &&
      (/index/i.test(unit) || /ตัวอย่าง Period|sample period/i.test(period));
    return {
      id,
      name: text(row.name) || fallback?.name || "",
      definition: text(row.definition) || fallback?.definition || "",
      unit: inventedSample ? fallback?.unit || "" : unit,
      period: inventedSample ? fallback?.period || "" : period,
      target: inventedSample ? "" : text(row.target),
      value: inventedSample ? "" : text(row.value),
      dataStatus,
      values: inventedSample ? [] : numbers(row.values),
      labels: inventedSample ? [] : strings(row.labels),
      updatedAt: text(row.updatedAt),
      hideUntilData: row.hideUntilData == null ? true : bool(row.hideUntilData, true),
    };
  });
}

export function defaultB2bFunnelSteps(locale: Locale = "th"): CmsB2bFunnelStep[] {
  const thai = locale === "th";
  return B2B_FUNNEL_STEPS.map((step) => ({
    id: step.id,
    number: step.number,
    marker: step.marker,
    label: thai ? step.labelTh : step.labelEn,
    definition: thai ? step.definitionTh : step.definitionEn,
    output: thai ? step.outputTh : step.outputEn,
    kpiId: step.kpiId,
    kpiName: step.kpiName,
    extraKpis: "extraKpis" in step ? step.extraKpis.map((item) => ({ ...item })) : [],
  }));
}

export function defaultB2bWorkflowSteps(locale: Locale = "th"): CmsB2bWorkflowStep[] {
  const thai = locale === "th";
  return B2B_WORKFLOW_STEPS.map((step, index) => ({
    id: step.id,
    number: step.number,
    title: thai ? step.titleTh : step.titleEn,
    owner: thai ? step.ownerTh : step.ownerEn,
    input: thai ? step.inputTh : step.inputEn,
    action: thai ? step.actionTh : step.actionEn,
    output: thai ? step.outputTh : step.outputEn,
    escalation: thai ? step.escalationTh : step.escalationEn,
    order: index + 1,
  }));
}

export function defaultB2bWorkflowBoundary(locale: Locale = "th"): CmsB2bWorkflowBoundary {
  const thai = locale === "th";
  return {
    kicker: B2B_WORKFLOW_BOUNDARY.kicker,
    note: thai ? B2B_WORKFLOW_BOUNDARY.note.th : B2B_WORKFLOW_BOUNDARY.note.en,
    supportTitle: thai ? B2B_WORKFLOW_BOUNDARY.supportTitle.th : B2B_WORKFLOW_BOUNDARY.supportTitle.en,
    approveTitle: thai ? B2B_WORKFLOW_BOUNDARY.approveTitle.th : B2B_WORKFLOW_BOUNDARY.approveTitle.en,
    support: [...B2B_WORKFLOW_BOUNDARY.support],
    approve: [...B2B_WORKFLOW_BOUNDARY.approve],
  };
}

function parseStringList(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) return [...fallback];
  return value.map((item) => text(item)).filter(Boolean);
}

function isGenericWorkflowLabel(value: string) {
  return /^(ตัวอย่างข้อมูล|sample visual|sample process|ตัวอย่างลำดับงานกับโรงแรม|sample hotel working sequence|b2b partner sales workflow(?: — sample process)?)$/i.test(
    value.trim(),
  );
}

function parseWorkflowVisual(value: unknown, locale: Locale): CmsB2bVisual {
  const visual = parseVisual(value, emptyVisual());
  const thai = locale === "th";
  if (!visual.label.trim() || isGenericWorkflowLabel(visual.label)) {
    visual.label = B2B_WORKFLOW_VISUAL.label.en;
  }
  if (!visual.caption.trim() || isGenericWorkflowLabel(visual.caption)) {
    visual.caption = thai ? B2B_WORKFLOW_VISUAL.caption.th : B2B_WORKFLOW_VISUAL.caption.en;
  }
  if (!visual.altTh.trim() || /แผนภาพตัวอย่าง|ลำดับงาน/.test(visual.altTh)) {
    visual.altTh = B2B_WORKFLOW_VISUAL.alt.th;
  }
  if (!visual.altEn.trim() || /sample diagram|working sequence|meeting/i.test(visual.altEn)) {
    visual.altEn = B2B_WORKFLOW_VISUAL.alt.en;
  }
  if (
    visual.src.trim() === B2B_WORKFLOW_VISUAL_CANDIDATE ||
    isReusedB2bVisualSrc(visual.src, ["hero", "framework", "funnel", "readiness", "kpi", "related", "team"])
  ) {
    visual.src = "";
  }
  return visual;
}

function parseWorkflowSteps(value: unknown, locale: Locale): CmsB2bWorkflowStep[] {
  const defaults = defaultB2bWorkflowSteps(locale);
  if (!Array.isArray(value)) return defaults;
  const rows = value.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"));
  if (!rows.length) return [];
  return rows.map((row, index) => {
    const id = text(row.id) || `workflow-${index + 1}`;
    const fallback = defaults.find((item) => item.id === id);
    return {
      id,
      number: text(row.number) || fallback?.number || String(index + 1).padStart(2, "0"),
      title: text(row.title) || fallback?.title || "",
      owner: text(row.owner) || fallback?.owner || "",
      input: text(row.input) || fallback?.input || "",
      action: text(row.action) || text(row.description) || fallback?.action || "",
      output: text(row.output) || fallback?.output || "",
      escalation: text(row.escalation) || fallback?.escalation || "",
      order: Number(row.order) || index + 1,
    };
  });
}

function parseWorkflowBoundary(value: unknown, locale: Locale): CmsB2bWorkflowBoundary {
  const fallback = defaultB2bWorkflowBoundary(locale);
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    kicker: text(row.kicker) || fallback.kicker,
    note: text(row.note) || fallback.note,
    supportTitle: text(row.supportTitle) || fallback.supportTitle,
    approveTitle: text(row.approveTitle) || fallback.approveTitle,
    support: parseStringList(row.support, fallback.support),
    approve: parseStringList(row.approve, fallback.approve),
  };
}

function isGenericFunnelLabel(value: string) {
  return /^(ตัวอย่างข้อมูล|sample visual|sample data|ลำดับงานขายผ่านพาร์ตเนอร์|the partner sales sequence|b2b agent sales funnel(?: · sample data)?)$/i.test(
    value.trim(),
  );
}

function parseFunnelVisual(value: unknown, locale: Locale): CmsB2bVisual {
  const visual = parseVisual(value, emptyVisual());
  const thai = locale === "th";
  if (!visual.label.trim() || isGenericFunnelLabel(visual.label)) {
    visual.label = B2B_FUNNEL_VISUAL.label.en;
  }
  if (!visual.caption.trim() || isGenericFunnelLabel(visual.caption)) {
    visual.caption = thai ? B2B_FUNNEL_VISUAL.caption.th : B2B_FUNNEL_VISUAL.caption.en;
  }
  if (!visual.altTh.trim() || /แผนภาพตัวอย่าง|ลำดับงานขาย/.test(visual.altTh)) {
    visual.altTh = B2B_FUNNEL_VISUAL.alt.th;
  }
  if (!visual.altEn.trim() || /sample diagram|sales sequence/i.test(visual.altEn)) {
    visual.altEn = B2B_FUNNEL_VISUAL.alt.en;
  }
  if (
    visual.src.trim() === B2B_FUNNEL_VISUAL_CANDIDATE ||
    isReusedB2bVisualSrc(visual.src, ["hero", "framework", "readiness", "workflow", "kpi", "related", "team"])
  ) {
    visual.src = "";
  }
  return visual;
}

function asFunnelMarker(value: unknown, fallback: B2bFunnelMarker = "path"): B2bFunnelMarker {
  if (value === "path" || value === "target" || value === "review" || value === "risk") return value;
  return fallback;
}

function parseFunnelKpis(value: unknown, fallback: CmsB2bFunnelKpi[]): CmsB2bFunnelKpi[] {
  if (!Array.isArray(value)) return fallback.map((item) => ({ ...item }));
  return value
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    .map((row, index) => ({
      id: text(row.id) || `funnel-kpi-${index + 1}`,
      name: text(row.name),
    }));
}

function parseFunnelSteps(value: unknown, locale: Locale): CmsB2bFunnelStep[] {
  const defaults = defaultB2bFunnelSteps(locale);
  if (!Array.isArray(value)) return defaults;
  const rows = value.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"));
  if (!rows.length) return [];
  return rows.map((row, index) => {
    const id = text(row.id) || `funnel-${index + 1}`;
    const fallback = defaults.find((item) => item.id === id);
    return {
      id,
      number: text(row.number) || fallback?.number || String(index + 1).padStart(2, "0"),
      marker: asFunnelMarker(row.marker, fallback?.marker ?? "path"),
      label: text(row.label) || fallback?.label || "",
      definition: text(row.definition) || fallback?.definition || "",
      output: text(row.output) || fallback?.output || "",
      kpiId: row.kpiId != null ? text(row.kpiId) : fallback?.kpiId || "",
      kpiName: row.kpiName != null ? text(row.kpiName) : fallback?.kpiName || "",
      extraKpis: parseFunnelKpis(row.extraKpis, fallback?.extraKpis ?? []),
    };
  });
}

function parseReadinessItems(value: unknown, locale: Locale): CmsB2bReadinessItem[] {
  if (!Array.isArray(value)) return defaultB2bReadinessItems(locale);
  if (!value.length) return [];
  return value.map((item, index) => {
    const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    return {
      id: text(row.id) || `framework-${index + 1}`,
      area: text(row.area),
      problem: text(row.problem) || text(row.why),
      prepare: text(row.prepare) || text(row.check),
      output: text(row.output),
      order: Number(row.order) || index + 1,
    };
  });
}

export function defaultB2bGuides(locale: Locale = "th"): CmsB2bGuides {
  const thai = locale === "th";
  return {
    readinessTitle: thai ? "รายการตรวจความพร้อม B2B" : "B2B Readiness checklist",
    readinessChecks: B2B_READINESS_ITEMS.map((item, index) => ({
      id: item.id,
      check: thai ? item.checkTh : item.checkEn,
      why: thai ? item.whyTh : item.whyEn,
      output: thai ? item.outputTh : item.outputEn,
      order: index + 1,
    })),
    partnerFitTitle: thai ? "เกณฑ์ Partner Fit" : "Partner Fit criteria",
    partnerFit: [
      {
        id: "partner-type",
        text: thai ? "รู้ว่าต้องการ Partner แบบใด" : "The hotel knows which partner type it needs",
        order: 1,
      },
      {
        id: "segment",
        text: thai ? "รู้ว่าต้องการ Corporate หรือ Wholesale" : "Corporate or wholesale need is named",
        order: 2,
      },
      {
        id: "criteria",
        text: thai ? "กำหนดเกณฑ์พาร์ตเนอร์เป้าหมาย" : "Target partner criteria are defined",
        order: 3,
      },
    ],
    salesMaterialTitle: thai ? "ชุดเอกสารขาย" : "Sales Material checklist",
    salesMaterial: [
      { id: "rooms", text: thai ? "ข้อมูลห้องและสินค้า" : "Room and product information", order: 1 },
      { id: "rates", text: thai ? "ราคาและช่วงขาย" : "Rates and selling dates", order: 2 },
      { id: "terms", text: thai ? "เงื่อนไขที่โรงแรมอนุมัติ" : "Terms the hotel has approved", order: 3 },
      { id: "kit", text: thai ? "ชุดขายที่พาร์ตเนอร์ส่งต่อได้" : "A pack the partner can send onward", order: 4 },
    ],
    rateCommissionTitle: thai ? "ขอบเขตราคาและค่าคอมมิชชัน" : "Rate and Commission boundary",
    rateCommissionBody: thai
      ? "โรงแรมอนุมัติราคาสุดท้ายและค่าคอมมิชชัน ตัวเลขสัญญาและอัตราคอมมิชชันไม่แสดงในหน้าสาธารณะจนกว่าจะได้รับอนุมัติ"
      : "The hotel approves the final rate and commission. Contract values and commission rates are not shown on the public page until they are approved.",
  };
}

function parseCheckItems(value: unknown, fallback: CmsB2bCheckItem[]): CmsB2bCheckItem[] {
  if (!Array.isArray(value)) return fallback.map((item) => ({ ...item }));
  return value
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    .map((row, index) => ({
      id: text(row.id) || `check-${index + 1}`,
      check: text(row.check),
      why: text(row.why),
      output: text(row.output),
      order: Number(row.order) || index + 1,
    }));
}

function parseCriteria(value: unknown, fallback: CmsB2bCriterion[]): CmsB2bCriterion[] {
  if (!Array.isArray(value)) return fallback.map((item) => ({ ...item }));
  return value
    .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
    .map((row, index) => ({
      id: text(row.id) || `criterion-${index + 1}`,
      text: text(row.text),
      order: Number(row.order) || index + 1,
    }));
}

function parseGuides(value: unknown, locale: Locale): CmsB2bGuides {
  const fallback = defaultB2bGuides(locale);
  if (!value || typeof value !== "object") return fallback;
  const row = value as Record<string, unknown>;
  return {
    readinessTitle: text(row.readinessTitle) || fallback.readinessTitle,
    readinessChecks: parseCheckItems(row.readinessChecks, fallback.readinessChecks),
    partnerFitTitle: text(row.partnerFitTitle) || fallback.partnerFitTitle,
    partnerFit: parseCriteria(row.partnerFit, fallback.partnerFit),
    salesMaterialTitle: text(row.salesMaterialTitle) || fallback.salesMaterialTitle,
    salesMaterial: parseCriteria(row.salesMaterial, fallback.salesMaterial),
    rateCommissionTitle: text(row.rateCommissionTitle) || fallback.rateCommissionTitle,
    rateCommissionBody: text(row.rateCommissionBody) || fallback.rateCommissionBody,
  };
}

function parseCta(value: unknown, fallback: CmsCta): CmsCta {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  return {
    label: text(row.label) || fallback.label,
    href: text(row.href) || fallback.href,
  };
}

export function isB2bCmsBody(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("{")) return false;
  try {
    const parsed = JSON.parse(trimmed) as { template?: string };
    return parsed.template === B2B_CMS_TEMPLATE;
  } catch {
    return false;
  }
}

export function parseB2bPageBody(raw: string, locale: Locale = "th"): CmsB2bPage | null {
  const fallback = emptyB2bCms();
  const trimmed = raw.trim();
  if (!trimmed.startsWith("{")) return null;
  try {
    const parsed = JSON.parse(trimmed) as Record<string, unknown>;
    if (parsed.template !== B2B_CMS_TEMPLATE) return null;
    const hero = parsed.hero && typeof parsed.hero === "object" ? (parsed.hero as Record<string, unknown>) : {};
    const readiness = parsed.readiness && typeof parsed.readiness === "object" ? (parsed.readiness as Record<string, unknown>) : {};
    const problemsSection =
      parsed.problemsSection && typeof parsed.problemsSection === "object"
        ? (parsed.problemsSection as Record<string, unknown>)
        : {};
    const scopeSection =
      parsed.scopeSection && typeof parsed.scopeSection === "object" ? (parsed.scopeSection as Record<string, unknown>) : {};
    const funnelSection =
      parsed.funnelSection && typeof parsed.funnelSection === "object" ? (parsed.funnelSection as Record<string, unknown>) : {};
    const workflowSection =
      parsed.workflowSection && typeof parsed.workflowSection === "object"
        ? (parsed.workflowSection as Record<string, unknown>)
        : {};
    const measureSection =
      parsed.measureSection && typeof parsed.measureSection === "object"
        ? (parsed.measureSection as Record<string, unknown>)
        : {};
    const related = parsed.related && typeof parsed.related === "object" ? (parsed.related as Record<string, unknown>) : {};
    const form = parsed.form && typeof parsed.form === "object" ? (parsed.form as Record<string, unknown>) : {};
    const seo = parsed.seo && typeof parsed.seo === "object" ? (parsed.seo as Record<string, unknown>) : {};

    return {
      version: 1,
      template: B2B_CMS_TEMPLATE,
      hero: {
        eyebrow: text(hero.eyebrow) || fallback.hero.eyebrow,
        title: text(hero.title) || fallback.hero.title,
        description: text(hero.description) || fallback.hero.description,
        leadNext: text(hero.leadNext) || fallback.hero.leadNext,
        leadClose: text(hero.leadClose) || fallback.hero.leadClose,
        primaryCta: parseCta(hero.primaryCta, fallback.hero.primaryCta),
        secondaryCta: parseCta(hero.secondaryCta, fallback.hero.secondaryCta),
        underCta: text(hero.underCta) || fallback.hero.underCta,
        caption: text(hero.caption) || fallback.hero.caption,
        visual: parseVisual(hero.visual, fallback.hero.visual),
      },
      readiness: {
        title: text(readiness.title) || fallback.readiness.title,
        body: text(readiness.body) || fallback.readiness.body,
        close: text(readiness.close) || fallback.readiness.close,
        visual: parseReadinessVisual(readiness.visual, locale),
        items: parseReadinessItems(readiness.items, locale),
      },
      problemsSection: { title: text(problemsSection.title) || fallback.problemsSection.title },
      problems: Array.isArray(parsed.problems)
        ? parsed.problems.map((item, index) => {
            const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
            return { id: text(row.id) || `problem-${index + 1}`, text: text(row.text), order: Number(row.order) || index + 1 };
          })
        : fallback.problems,
      scopeSection: { title: text(scopeSection.title) || fallback.scopeSection.title },
      scopeItems: parseScopeItems(parsed.scopeItems, locale),
      funnelSection: {
        title:
          text(funnelSection.title) && !isGenericFunnelLabel(text(funnelSection.title))
            ? text(funnelSection.title)
            : locale === "th"
              ? B2B_FUNNEL_SECTION.title.th
              : B2B_FUNNEL_SECTION.title.en,
        lead:
          text(funnelSection.lead) ||
          (locale === "th" ? B2B_FUNNEL_SECTION.lead.th : B2B_FUNNEL_SECTION.lead.en),
        caption: text(funnelSection.caption) || fallback.funnelSection.caption,
        visual: parseFunnelVisual(funnelSection.visual, locale),
      },
      funnelSteps: parseFunnelSteps(parsed.funnelSteps, locale),
      workflowSection: {
        title:
          text(workflowSection.title) ||
          (locale === "th" ? B2B_WORKFLOW_SECTION.title.th : B2B_WORKFLOW_SECTION.title.en),
        lead:
          text(workflowSection.lead) ||
          (locale === "th" ? B2B_WORKFLOW_SECTION.lead.th : B2B_WORKFLOW_SECTION.lead.en),
        visual: parseWorkflowVisual(workflowSection.visual, locale),
        boundary: parseWorkflowBoundary(workflowSection.boundary, locale),
      },
      workflowSteps: parseWorkflowSteps(parsed.workflowSteps, locale),
      measureSection: {
        title: text(measureSection.title) || fallback.measureSection.title,
        intro: text(measureSection.intro) || fallback.measureSection.intro,
        close: text(measureSection.close) || fallback.measureSection.close,
        sampleLabel: text(measureSection.sampleLabel) || fallback.measureSection.sampleLabel,
        visual: parseKpiVisual(measureSection.visual, locale),
      },
      kpis: parseKpis(parsed.kpis, locale),
      related: {
        title:
          text(related.title) ||
          (locale === "th" ? "เรื่องที่เกี่ยวข้องกับช่องทางขายและแผนรายได้" : "Related reading on channels and the revenue plan"),
        visual: parseRelatedVisual(related.visual, locale),
        cards: parseRelatedCards(related.cards, locale),
      },
      form: parseForm(form, locale),
      faqIntro: text(parsed.faqIntro) || fallback.faqIntro,
      faqs: parseFaqs(parsed.faqs, locale),
      guides: parseGuides(parsed.guides, locale),
      seo: { social: parseVisual(seo.social, fallback.seo.social) },
    };
  } catch {
    return null;
  }
}

export function serializeB2bPageBody(content: CmsB2bPage) {
  return JSON.stringify({ ...content, version: 1, template: B2B_CMS_TEMPLATE });
}

export function isValidCtaHref(href: string) {
  return CTA_RE.test(href.trim());
}

function isPlaceholderLabel(value: string) {
  return PLACEHOLDER_RE.test(value.trim());
}

function hasSampleMarker(value: string) {
  return SAMPLE_RE.test(value);
}

function visualsOf(content: CmsB2bPage): CmsB2bVisual[] {
  return [
    content.hero.visual,
    content.readiness.visual,
    content.funnelSection.visual,
    content.workflowSection.visual,
    content.measureSection.visual,
    content.related.visual,
    content.form.visual,
    content.seo.social,
  ];
}

function kpiHasPublicData(kpi: CmsB2bKpi) {
  return Boolean(kpi.value.trim()) || kpi.values.some((item) => Number.isFinite(item));
}

function kpiIsPublic(kpi: CmsB2bKpi) {
  if (kpi.dataStatus !== "approved" && kpi.dataStatus !== "anonymised") return false;
  if (kpi.hideUntilData && !kpiHasPublicData(kpi)) return false;
  return kpiHasPublicData(kpi);
}

export function chartNeedsSampleLabel(content: CmsB2bPage) {
  if (content.measureSection.visual.status === "sample") return true;
  if (visualsOf(content).some((visual) => visual.status === "sample" && visual.src.trim())) return true;
  return content.kpis.some((kpi) => kpi.dataStatus === "sample" && kpiHasPublicData(kpi));
}

function collectText(content: CmsB2bPage) {
  return [
    content.hero.title,
    content.hero.description,
    content.readiness.body,
    ...content.readiness.items.flatMap((item) => [item.area, item.problem, item.prepare, item.output]),
    ...content.problems.map((item) => item.text),
    ...content.scopeItems.flatMap((item) => [item.area, item.action, item.input, item.output, item.owner]),
    content.funnelSection.title,
    content.funnelSection.lead,
    content.workflowSection.title,
    content.workflowSection.lead,
    content.workflowSection.boundary.note,
    ...content.workflowSteps.flatMap((item) => [
      item.title,
      item.owner,
      item.input,
      item.action,
      item.output,
      item.escalation,
    ]),
    ...content.funnelSteps.flatMap((item) => [
      item.label,
      item.definition,
      item.output,
      item.kpiName,
      ...(item.extraKpis ?? []).map((kpi) => kpi.name),
    ]),
    ...content.kpis.flatMap((item) => [item.name, item.definition, item.period, item.target, item.value]),
    ...content.related.cards.flatMap((item) => [item.category, item.title, item.description, item.meta]),
    content.form.heading,
    content.form.lead,
    ...content.form.receive,
    ...content.form.steps,
    ...content.faqs.flatMap((item) => [item.q, item.a]),
    content.guides.readinessTitle,
    ...content.guides.readinessChecks.flatMap((item) => [item.check, item.why, item.output]),
    content.guides.partnerFitTitle,
    ...content.guides.partnerFit.map((item) => item.text),
    content.guides.salesMaterialTitle,
    ...content.guides.salesMaterial.map((item) => item.text),
    content.guides.rateCommissionTitle,
    content.guides.rateCommissionBody,
  ].join("\n");
}

function commercialText(content: CmsB2bPage) {
  return [
    content.workflowSection.boundary.note,
    content.guides.rateCommissionBody,
    ...content.guides.partnerFit.map((item) => item.text),
    ...content.guides.salesMaterial.map((item) => item.text),
    ...content.guides.readinessChecks.flatMap((item) => [item.check, item.why, item.output]),
    ...content.scopeItems.flatMap((item) => [item.action, item.input, item.output, item.owner]),
    ...content.kpis
      .filter((kpi) => kpi.dataStatus !== "approved" && kpi.dataStatus !== "anonymised")
      .flatMap((kpi) => [kpi.value, kpi.target]),
  ].join("\n");
}

function hasPrivateData(content: CmsB2bPage) {
  const blob = collectText(content);
  if (EMAIL_RE.test(blob) || PHONE_RE.test(blob) || CARD_RE.test(blob.replace(/\s/g, ""))) return true;
  const commercial = commercialText(content);
  return MONEY_RE.test(commercial) || COMMISSION_PCT_RE.test(commercial);
}

export function validateB2bPage(content: CmsB2bPage, intent: B2bIntent) {
  if (intent !== "publish") return null;
  if (!content.hero.title.trim() || !content.hero.description.trim()) return "required_fields";
  if (!content.readiness.title.trim() || !content.scopeSection.title.trim()) return "required_fields";
  if (!content.measureSection.title.trim()) return "required_fields";
  for (const cta of [content.hero.primaryCta, content.hero.secondaryCta]) {
    if (!cta.label.trim() || !cta.href.trim() || !isValidCtaHref(cta.href)) return "invalid_cta";
  }
  for (const card of content.related.cards) {
    if (card.href.trim() && !isValidCtaHref(card.href)) return "invalid_cta";
  }
  for (const item of content.scopeItems) {
    if (item.href.trim() && !isValidCtaHref(item.href)) return "invalid_cta";
  }
  for (const visual of visualsOf(content)) {
    if (!visual.src.trim()) continue;
    if (!visual.altTh.trim() || !visual.altEn.trim()) return "missing_alt";
    if (visual.status === "placeholder") return "placeholder_status";
    if (
      visual.status !== "sample" &&
      (isPlaceholderLabel(visual.altTh) ||
        isPlaceholderLabel(visual.altEn) ||
        isPlaceholderLabel(visual.label) ||
        PLACEHOLDER_RE.test(visual.src))
    ) {
      return "placeholder_label";
    }
  }
  for (const kpi of content.kpis) {
    const hasData = kpiHasPublicData(kpi);
    if (kpi.dataStatus === "draft" && !hasData) continue;
    if (!hasData && kpi.hideUntilData) continue;
    if (!kpi.name.trim() || !kpi.period.trim() || !kpi.dataStatus) return "kpi_incomplete";
    if (!kpi.unit.trim() && !kpi.definition.trim()) return "kpi_incomplete";
  }
  if (chartNeedsSampleLabel(content) && !hasSampleMarker(content.measureSection.sampleLabel)) return "sample_label";
  for (const faq of content.faqs) {
    if (!faq.q.trim() || !faq.a.trim()) return "empty_faq";
  }
  if (hasPrivateData(content)) return "private_data";
  return null;
}

export function b2bErrorMessage(code: string) {
  const table: Record<string, string> = {
    invalid_cta: "ลิงก์ปุ่มต้องเป็น /path, #anchor, mailto, tel หรือ http(s)",
    missing_alt: "รูปที่เผยแพร่ต้องมีคำอธิบายภาพภาษาไทยและภาษาอังกฤษ",
    placeholder_status: "เปลี่ยนสถานะรูปจาก Placeholder เป็น Sample หรือ Approved ก่อนเผยแพร่",
    placeholder_label: "อย่าเผยแพร่ข้อความ Placeholder ถ้าสถานะไม่ใช่ Sample",
    kpi_incomplete: "KPI ที่เผยแพร่ต้องมีชื่อ ช่วงเวลา หน่วยหรือคำนิยาม ค่าที่แสดง และสถานะ Approved หรือ Anonymised",
    sample_label: "ข้อมูลตัวอย่างต้องมีป้าย Sample Visual หรือ ตัวอย่างข้อมูล",
    empty_faq: "คำถามและคำตอบใน FAQ ต้องไม่ว่างเมื่อเผยแพร่",
    required_fields: "กรอกหัวข้อและคำอธิบายของแต่ละส่วนก่อนเผยแพร่",
    invalid_image: "อัปโหลดได้เฉพาะ JPG PNG หรือ WEBP ขนาดไม่เกิน 5MB",
    missing: "ไม่พบหน้าเพจ",
    invalid_json: "ข้อมูลฟอร์มไม่ถูกต้อง",
    private_data: "ห้ามเผยแพร่อีเมล เบอร์โทร มูลค่าสัญญา หรือข้อมูลส่วนบุคคลของพาร์ตเนอร์",
  };
  return table[code] ?? "บันทึกไม่สำเร็จ";
}

export function editorStateFromB2bDocument(input: {
  id: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  locale: string;
  status: string;
  body: string;
  ogImage?: string;
}): B2bEditorState {
  const locale = (["th", "en", "ru", "zh"].includes(input.locale) ? input.locale : "th") as Locale;
  const content = parseB2bPageBody(input.body, locale) ?? emptyB2bCms();
  if (input.ogImage && !content.seo.social.src) content.seo.social = { ...content.seo.social, src: input.ogImage };
  return {
    id: input.id,
    title: input.title,
    seoTitle: input.seoTitle,
    metaDescription: input.metaDescription,
    excerpt: input.excerpt,
    locale: input.locale,
    status: input.status,
    content,
  };
}

export function isB2bPageDocument(input: { slug: string; template: string }) {
  if (input.template === B2B_CMS_TEMPLATE) return true;
  return (
    input.slug === B2B_PAGE_SLUG ||
    input.slug === "en/solutions/b2b-agent-sales" ||
    input.slug === "ru/solutions/b2b-agent-sales" ||
    input.slug === "zh/solutions/b2b-agent-sales"
  );
}

export function publicCardHref(href: string, locale: Locale) {
  const next = href.trim();
  if (!next) return null;
  return existingHref(next, locale);
}

export { isPlaceholderLabel };
