import {
  META_SCENARIO_ROWS,
  META_SCENARIO_VISUAL,
  META_SCENARIO_VISUAL_CANDIDATE,
  META_ENQUIRY,
  META_ENQUIRY_RECEIVE,
  metaEnquiryReceiveIsStale,
  metaEnquiryStepsAreStale,
  META_FRAMEWORK_VISUAL_CANDIDATE,
  META_HERO_VISUAL,
  META_HERO_VISUAL_CANDIDATE,
  META_KPIS,
  META_KPI_VISUAL,
  META_KPI_VISUAL_CANDIDATE,
  metaKpiGroupFrom,
  metaKpiSeriesReady,
  META_LANDING_CHECKLIST,
  META_READINESS_VISUAL,
  META_RELATED_VISUAL,
  META_RELATED_VISUAL_CANDIDATE,
  META_HOTEL_SCENARIO_ROWS,
  META_HOTEL_SCENARIO_VISUAL,
  META_HOTEL_SCENARIO_VISUAL_CANDIDATE,
  META_PLATFORM_AUDIENCE,
  META_PLATFORM_AUDIENCE_SOURCE,
  META_SUPPORTED_EVENTS,
  META_TRACKING_BOUNDARY,
  META_AUDIENCE_VISUAL,
  META_AUDIENCE_VISUAL_CANDIDATE,
  META_WORKFLOW_STEPS,
  META_WORKFLOW_VISUAL,
  META_WORKFLOW_VISUAL_CANDIDATE,
  META_CREATIVE_ROWS,
  metaCreativeAssetKindFromSrc,
  metaCreativeFormatIsKnown,
  metaCreativeLooksLikeResult,
  metaCreativeStatusIsKnown,
  metaFaqs,
  metaFaqsAreStale,
  type AdsKpiStatus,
  type AdsVisualStatus,
  type MetaCreativeAssetKind,
  type MetaCreativeFormat,
  type MetaCreativeStatus,
  type MetaKpiGroup,
} from "@/lib/meta-ads";
import { formatInsightDate, insightExcerpt, insightPosts, insightsIndexCopy, insightUpdatedAt } from "@/lib/insights";
import { solutionNavLabel } from "@/lib/nav";
import { existingHref, type Locale } from "@/lib/seo";

export const META_ADS_CMS_TEMPLATE = "meta-ads-management";
export const META_ADS_PAGE_SLUG = "solutions/meta-ads-management";
export const META_ADS_PAGE_ROUTE = "/solutions/meta-ads-management";

export const META_CMS_INTENTS = ["save", "draft", "preview", "publish", "unpublish"] as const;
export type MetaCmsIntent = (typeof META_CMS_INTENTS)[number];
export const META_CMS_VISUAL_STATUSES = ["placeholder", "sample", "approved", "real"] as const;
export const META_CMS_KPI_STATUSES = ["draft", "sample", "approved", "anonymised"] as const;
export type MetaCmsSaveResult = { ok: true; id: string; intent: MetaCmsIntent } | { ok: false; error: string };

export type CmsAdsCta = { label: string; href: string };
export type CmsAdsVisual = {
  src: string;
  altTh: string;
  altEn: string;
  status: AdsVisualStatus;
  label: string;
  caption: string;
  containsMetaBrand: boolean;
  brandNote: string;
};

export type CmsAdsFaq = { id: string; q: string; a: string };

export type CmsAdsChecklist = { title: string; note: string; items: string[] };

export type CmsAdsFormLabels = {
  name: string;
  business: string;
  contact: string;
  website: string;
  goal: string;
  market: string;
  adsStatus: string;
  trackingStatus: string;
  challenge: string;
  consent: string;
  privacy: string;
};

export type CmsAdsReadinessItem = {
  id: string;
  area: string;
  problem: string;
  inspect: string;
  improve: string;
  output: string;
  check: string;
  why: string;
  order: number;
};

export type CmsMetaChannelRow = {
  id: string;
  channel: string;
  useCase: string;
  control: string;
  input: string;
  output: string;
  kpi: string;
  role: string;
  need: string;
  hotel: string;
  order: number;
};

export type CmsAdsWorkflowStep = {
  id: string;
  number: string;
  title: string;
  owner: string;
  input: string;
  action: string;
  output: string;
  nextDecision: string;
  handoff: string;
  order: number;
};

export type CmsMetaCreativeRow = {
  id: string;
  audience: string;
  market: string;
  hook: string;
  offer: string;
  format: MetaCreativeFormat;
  formatLabel: string;
  landing: string;
  kpi: string;
  status: MetaCreativeStatus;
  assetSrc: string;
  assetKind: MetaCreativeAssetKind;
  assetAlt: string;
  order: number;
};

export type CmsAdsKpi = {
  id: string;
  name: string;
  group: MetaKpiGroup;
  objective: string;
  market: string;
  definition: string;
  unit: string;
  period: string;
  target: string;
  value: string;
  context: string;
  labels: string[];
  values: number[];
  tone: "positive" | "target" | "risk";
  dataStatus: AdsKpiStatus;
  updatedAt: string;
  hideUntilData: boolean;
};

export function defaultMetaAdsKpis(locale: Locale): CmsAdsKpi[] {
  const thai = locale === "th";
  return META_KPIS.map((kpi) => ({
    id: kpi.id,
    name: kpi.name,
    group: kpi.group,
    objective: thai ? kpi.objectiveTh : kpi.objectiveEn,
    market: thai ? kpi.marketTh : kpi.marketEn,
    definition: thai ? kpi.definitionTh : kpi.definitionEn,
    unit: kpi.unit,
    period: "",
    target: "",
    value: "",
    context: thai ? kpi.objectiveTh : kpi.objectiveEn,
    labels: [],
    values: [],
    tone: kpi.tone,
    dataStatus: "sample" as const,
    updatedAt: "",
    hideUntilData: true,
  }));
}

export type CmsMetaAudienceStat = {
  id: string;
  platform: string;
  value: string;
  kind: string;
  period: string;
  market: string;
  definition: string;
  status: string;
  dataStatus: AdsKpiStatus;
};

export type CmsMetaHotelScenarioRow = {
  id: string;
  situation: string;
  question: string;
  action: string;
  output: string;
  next: string;
  order: number;
};

export type CmsMetaRelatedCard = {
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

export type CmsMetaAdsPage = {
  version: 1;
  template: typeof META_ADS_CMS_TEMPLATE;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: CmsAdsCta;
    secondaryCta: CmsAdsCta;
    underCta: string;
    caption: string;
    visual: CmsAdsVisual;
  };
  visibility: {
    title: string;
    body: string;
    note: string;
    sourceLabel: string;
    sourceHref: string;
    visual: CmsAdsVisual;
    stats: CmsMetaAudienceStat[];
  };
  readiness: { title: string; body: string; visual: CmsAdsVisual; items: CmsAdsReadinessItem[] };
  channels: { title: string; visual: CmsAdsVisual; rows: CmsMetaChannelRow[] };
  scenario: { title: string; visual: CmsAdsVisual; rows: CmsMetaHotelScenarioRow[] };
  workflow: { title: string; visual: CmsAdsVisual; steps: CmsAdsWorkflowStep[] };
  creative: { title: string; body: string; rows: CmsMetaCreativeRow[] };
  checklists: { tracking: CmsAdsChecklist; events: CmsAdsChecklist; landing: CmsAdsChecklist };
  measure: { title: string; intro: string; close: string; visual: CmsAdsVisual; kpis: CmsAdsKpi[] };
  related: { title: string; visual: CmsAdsVisual; cards: CmsMetaRelatedCard[] };
  form: {
    kicker: string;
    heading: string;
    lead: string;
    submit: string;
    receiveTitle: string;
    receive: string[];
    nextTitle: string;
    steps: string[];
    labels: CmsAdsFormLabels;
    visual: CmsAdsVisual;
  };
  faqs: CmsAdsFaq[];
  seo: { social: CmsAdsVisual };
};

export type MetaEditorState = {
  id: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  locale: string;
  status: string;
  content: CmsMetaAdsPage;
};

const PLACEHOLDER_RE = /placeholder|replace with verified|replace with approved|รอรูป|lorem ipsum/i;
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_RE = /(?:\+?\s*66|\b0)\s*\d(?:[\s.-]?\d){7,9}\b/;
const ACCOUNT_RE = /(?:customer|account)\s*id|aw-\d{6,}|cid[:\s-]*\d{8,}/i;
const CTA_RE = /^(#|\/|https?:\/\/|mailto:|tel:)/i;

function emptyVisual(): CmsAdsVisual {
  return {
    src: "",
    altTh: "",
    altEn: "",
    status: "placeholder",
    label: "",
    caption: "",
    containsMetaBrand: false,
    brandNote: "",
  };
}

function emptyCta(): CmsAdsCta {
  return { label: "", href: "/" };
}

function emptyChecklist(): CmsAdsChecklist {
  return { title: "", note: "", items: [] };
}

function emptyFormLabels(): CmsAdsFormLabels {
  return {
    name: "",
    business: "",
    contact: "",
    website: "",
    goal: "",
    market: "",
    adsStatus: "",
    trackingStatus: "",
    challenge: "",
    consent: "",
    privacy: "",
  };
}

export function emptyMetaAdsCms(): CmsMetaAdsPage {
  return {
    version: 1,
    template: META_ADS_CMS_TEMPLATE,
    hero: {
      eyebrow: "",
      title: "",
      description: "",
      primaryCta: emptyCta(),
      secondaryCta: emptyCta(),
      underCta: "",
      caption: "",
      visual: emptyVisual(),
    },
    visibility: { title: "", body: "", note: "", sourceLabel: "", sourceHref: "", visual: emptyVisual(), stats: [] },
    readiness: { title: "", body: "", visual: emptyVisual(), items: [] },
    channels: { title: "", visual: emptyVisual(), rows: [] },
    scenario: { title: "", visual: emptyVisual(), rows: [] },
    workflow: { title: "", visual: emptyVisual(), steps: [] },
    creative: { title: "", body: "", rows: [] },
    checklists: { tracking: emptyChecklist(), events: emptyChecklist(), landing: emptyChecklist() },
    measure: { title: "", intro: "", close: "", visual: emptyVisual(), kpis: [] },
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
      labels: emptyFormLabels(),
      visual: emptyVisual(),
    },
    faqs: [],
    seo: { social: emptyVisual() },
  };
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asStatus(value: unknown): AdsVisualStatus {
  return META_CMS_VISUAL_STATUSES.includes(value as AdsVisualStatus) ? (value as AdsVisualStatus) : "placeholder";
}

function asKpiStatus(value: unknown): AdsKpiStatus {
  return META_CMS_KPI_STATUSES.includes(value as AdsKpiStatus) ? (value as AdsKpiStatus) : "sample";
}

function asStringList(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string") return value.split(/[,|\n]/).map((item) => item.trim()).filter(Boolean);
  return [];
}

function asNumberList(value: unknown) {
  const raw = Array.isArray(value) ? value : typeof value === "string" ? value.split(/[,|\n]/) : [];
  return raw.map((item) => Number(item)).filter((item) => Number.isFinite(item));
}

function asKpiTone(value: unknown): CmsAdsKpi["tone"] {
  return value === "target" || value === "risk" ? value : "positive";
}

function parseVisual(value: unknown, fallback: CmsAdsVisual): CmsAdsVisual {
  if (!value || typeof value !== "object") return { ...fallback };
  const row = value as Record<string, unknown>;
  return {
    src: asString(row.src, fallback.src),
    altTh: asString(row.altTh, fallback.altTh),
    altEn: asString(row.altEn, fallback.altEn),
    status: asStatus(row.status) || fallback.status,
    label: asString(row.label, fallback.label),
    caption: asString(row.caption, fallback.caption),
    containsMetaBrand: bool(row.containsMetaBrand, fallback.containsMetaBrand),
    brandNote: asString(row.brandNote, fallback.brandNote),
  };
}

function parseAudienceStats(value: unknown, locale: Locale): CmsMetaAudienceStat[] {
  const fallback = defaultMetaAdsAudienceStats(locale);
  if (!Array.isArray(value)) return fallback;
  return value.map((item, index) => {
    const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const seed = fallback[index];
    return {
      id: asString(row.id, seed?.id || `audience-${index + 1}`),
      platform: asString(row.platform, seed?.platform),
      value: asString(row.value, seed?.value),
      kind: asString(row.kind, seed?.kind),
      period: asString(row.period, seed?.period),
      market: asString(row.market, seed?.market),
      definition: asString(row.definition, seed?.definition),
      status: asString(row.status, seed?.status),
      dataStatus: asKpiStatus(row.dataStatus) || seed?.dataStatus || "sample",
    };
  });
}

function parseScenario(value: unknown, locale: Locale): CmsMetaAdsPage["scenario"] {
  const thai = locale === "th";
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const fallbackRows = defaultMetaAdsScenarioRows(locale);
  return {
    title: asString(row.title, thai ? "เริ่มจากสถานการณ์ของโรงแรม" : "Start from the hotel’s situation"),
    visual: (() => {
      const visual = parseVisual(row.visual, {
        ...emptyVisual(),
        status: "sample",
        label: thai ? META_HOTEL_SCENARIO_VISUAL.label.th : META_HOTEL_SCENARIO_VISUAL.label.en,
        altTh: META_HOTEL_SCENARIO_VISUAL.alt.th,
        altEn: META_HOTEL_SCENARIO_VISUAL.alt.en,
        caption: thai ? META_HOTEL_SCENARIO_VISUAL.caption.th : META_HOTEL_SCENARIO_VISUAL.caption.en,
      });
      if (
        isReusedAdsVisualSrc(visual.src, ["hero", "visibility", "framework", "channels", "workflow", "kpi", "related"]) ||
        visual.src === META_HOTEL_SCENARIO_VISUAL_CANDIDATE
      ) {
        visual.src = "";
      }
      return visual;
    })(),
    rows: Array.isArray(row.rows)
      ? row.rows.map((item, index) => {
          const next = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
          const seed = fallbackRows[index];
          return {
            id: asString(next.id, seed?.id || `scenario-${index + 1}`),
            situation: asString(next.situation, seed?.situation),
            question: asString(next.question, seed?.question),
            action: asString(next.action, seed?.action),
            output: asString(next.output, seed?.output),
            next: asString(next.next, seed?.next),
            order: Number(next.order) || index + 1,
          };
        })
      : fallbackRows,
  };
}

function parseChecklist(value: unknown, fallback: CmsAdsChecklist): CmsAdsChecklist {
  if (!value || typeof value !== "object") return { ...fallback, items: [...fallback.items] };
  const row = value as Record<string, unknown>;
  return {
    title: asString(row.title, fallback.title),
    note: asString(row.note, fallback.note),
    items: Array.isArray(row.items) ? asStringList(row.items) : fallback.items,
  };
}

function parseFormLabels(value: unknown, fallback: CmsAdsFormLabels): CmsAdsFormLabels {
  if (!value || typeof value !== "object") return { ...fallback };
  const row = value as Record<string, unknown>;
  return {
    name: asString(row.name, fallback.name),
    business: asString(row.business, fallback.business),
    contact: asString(row.contact, fallback.contact),
    website: asString(row.website, fallback.website),
    goal: asString(row.goal, fallback.goal),
    market: asString(row.market, fallback.market),
    adsStatus: asString(row.adsStatus, fallback.adsStatus),
    trackingStatus: asString(row.trackingStatus, fallback.trackingStatus),
    challenge: asString(row.challenge, fallback.challenge),
    consent: asString(row.consent, fallback.consent),
    privacy: asString(row.privacy, fallback.privacy),
  };
}

function defaultFormLabels(locale: Locale): CmsAdsFormLabels {
  const thai = locale === "th";
  const labels = thai ? META_ENQUIRY.labels.th : META_ENQUIRY.labels.en;
  const fields = thai ? META_ENQUIRY.fields.th : META_ENQUIRY.fields.en;
  return {
    name: labels.name,
    business: labels.business,
    contact: labels.contact,
    website: fields.website,
    goal: fields.goal,
    market: fields.market,
    adsStatus: fields.adsStatus,
    trackingStatus: fields.tracking,
    challenge: fields.challenge,
    consent: labels.consent,
    privacy: labels.privacy,
  };
}

function defaultChecklist(
  source: typeof META_TRACKING_BOUNDARY | typeof META_LANDING_CHECKLIST | typeof META_SUPPORTED_EVENTS,
  locale: Locale,
): CmsAdsChecklist {
  const thai = locale === "th";
  return {
    title: thai ? source.title.th : source.title.en,
    note: thai ? source.note.th : source.note.en,
    items: [...(thai ? source.items.th : source.items.en)],
  };
}

export function defaultMetaAdsAudienceStats(locale: Locale): CmsMetaAudienceStat[] {
  const thai = locale === "th";
  return META_PLATFORM_AUDIENCE.map((stat) => ({
    id: stat.id,
    platform: stat.platform,
    value: thai ? stat.value.th : stat.value.en,
    kind: thai ? stat.kind.th : stat.kind.en,
    period: thai ? stat.period.th : stat.period.en,
    market: thai ? stat.market.th : stat.market.en,
    definition: thai ? stat.definition.th : stat.definition.en,
    status: thai ? stat.status.th : stat.status.en,
    dataStatus: "sample" as const,
  }));
}

export function defaultMetaAdsScenarioRows(locale: Locale): CmsMetaHotelScenarioRow[] {
  const thai = locale === "th";
  return META_HOTEL_SCENARIO_ROWS.map((row, index) => ({
    id: row.id,
    situation: thai ? row.situationTh : row.situationEn,
    question: thai ? row.questionTh : row.questionEn,
    action: thai ? row.actionTh : row.actionEn,
    output: thai ? row.outputTh : row.outputEn,
    next: thai ? row.nextTh : row.nextEn,
    order: index + 1,
  }));
}

function bool(value: unknown, fallback = false) {
  if (typeof value === "boolean") return value;
  if (value === "1" || value === "true") return true;
  if (value === "0" || value === "false") return false;
  return fallback;
}

function isGenericRelatedLabel(value: string) {
  return /^(ตัวอย่างข้อมูล|sample visual|sample data|search \/ direct booking content)$/i.test(value.trim());
}

function isReusedAdsVisualSrc(
  src: string,
  kinds: Array<"hero" | "visibility" | "framework" | "channels" | "scenario" | "workflow" | "kpi" | "related">,
) {
  const next = src.trim();
  if (!next) return false;
  const map = {
    hero: ["meta-ads-management-hero", META_HERO_VISUAL_CANDIDATE],
    visibility: ["meta-ads-management-visibility", "meta-ads-audience-insight", META_AUDIENCE_VISUAL_CANDIDATE],
    framework: ["meta-ads-readiness-framework", META_FRAMEWORK_VISUAL_CANDIDATE],
    channels: ["meta-ads-scenario-comparison", "meta-ads-hotel-sales-objectives", META_SCENARIO_VISUAL_CANDIDATE],
    scenario: ["meta-ads-hotel-scenario-matrix", META_HOTEL_SCENARIO_VISUAL_CANDIDATE],
    workflow: ["meta-ads-campaign-workflow", META_WORKFLOW_VISUAL_CANDIDATE],
    kpi: ["meta-ads-performance-kpi", META_KPI_VISUAL_CANDIDATE],
    related: ["meta-ads-related-content", META_RELATED_VISUAL_CANDIDATE],
  } as const;
  return kinds.some((kind) => map[kind].some((token) => next === token || next.includes(token)));
}

function parseRelatedVisual(value: unknown, locale: Locale): CmsAdsVisual {
  const thai = locale === "th";
  const visual = parseVisual(value, {
    ...emptyVisual(),
    status: "sample",
    label: META_RELATED_VISUAL.label.en,
    altTh: META_RELATED_VISUAL.alt.th,
    altEn: META_RELATED_VISUAL.alt.en,
    caption: thai ? META_RELATED_VISUAL.caption.th : META_RELATED_VISUAL.caption.en,
  });
  if (!visual.label.trim() || isGenericRelatedLabel(visual.label) || /hotel meta ads scenario matrix/i.test(visual.label)) {
    visual.label = META_RELATED_VISUAL.label.en;
  }
  if (
    !visual.caption.trim() ||
    isGenericRelatedLabel(visual.caption) ||
    /start from the hotel situation|เริ่มจากสถานการณ์/i.test(visual.caption)
  ) {
    visual.caption = thai ? META_RELATED_VISUAL.caption.th : META_RELATED_VISUAL.caption.en;
  }
  if (!visual.altTh.trim() || /กราฟตัวอย่าง|ดัชนีผลงาน|รูปคน|รูป Hero|ตารางสถานการณ์/.test(visual.altTh)) {
    visual.altTh = META_RELATED_VISUAL.alt.th;
  }
  if (
    !visual.altEn.trim() ||
    /person photo|search, website, and direct-booking|hotel meta ads scenario/i.test(visual.altEn)
  ) {
    visual.altEn = META_RELATED_VISUAL.alt.en;
  }
  if (
    isReusedAdsVisualSrc(visual.src, ["hero", "visibility", "framework", "channels", "scenario", "workflow", "kpi"]) ||
    visual.src === META_RELATED_VISUAL_CANDIDATE ||
    visual.src === META_HOTEL_SCENARIO_VISUAL_CANDIDATE
  ) {
    visual.src = "";
  }
  return visual;
}

export function defaultMetaAdsRelatedCards(locale: Locale = "th"): CmsMetaRelatedCard[] {
  const thai = locale === "th";
  const ui = insightsIndexCopy[locale] ?? insightsIndexCopy.en;
  const insightType = thai ? "บทความ" : "Insight";
  const serviceType = thai ? "บริการ" : "Solution";
  const serviceCta = thai ? "ดูบริการ" : "View service";
  const cards: CmsMetaRelatedCard[] = [];

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

  function addService(id: string, href: string, category: string, titleTh: string, titleEn: string, descriptionTh: string, descriptionEn: string) {
    cards.push({
      id,
      href,
      category,
      title: solutionNavLabel(href, locale) || (thai ? titleTh : titleEn),
      description: thai ? descriptionTh : descriptionEn,
      publishedAt: "",
      updatedAt: "",
      contentType: serviceType,
      readingTime: "",
      meta: thai ? "หน้าบริการ" : "Service page",
      cta: serviceCta,
      featured: false,
    });
  }

  addInsight("/insights/hotel-marketing", true);
  addInsight("/insights/seo-vs-sem-for-hotels-which-one-should-you-focus-on");
  addInsight("/insights/direct-booking-journey-audit");
  addService(
    "google-ads-management",
    "/solutions/google-ads-management",
    "SEO and SEM",
    "Google Ads",
    "Google Ads Management",
    "วางแผน Google Ads ให้โรงแรมเชื่อมคำค้นหา หน้าเว็บ ราคา และระบบจอง เพื่อเพิ่มโอกาสการจองตรงที่ตรวจสอบได้ ไม่รับประกันยอดจอง",
    "Plan Google Ads for hotels from the search and the ad through the website, rate, and booking path. Bookings are not guaranteed.",
  );
  addService(
    "hotel-seo-google-maps-ai-search",
    "/solutions/hotel-seo-google-maps-ai-search",
    "SEO and SEM",
    "SEO, Google Maps และ AI Search",
    "SEO, Google Maps & AI Search",
    "บริการ SEO และการค้นหาในพื้นที่สำหรับการค้นพบ ข้อมูลสถานที่ที่ถูกต้อง Google Business Profile และเส้นทางผู้เข้าพักที่ชัดเจน",
    "Hotel SEO and local search support for useful discovery, accurate local context, Google Business Profile presence, and clearer guest actions.",
  );
  addService(
    "hotel-direct-bookings",
    "/solutions/hotel-direct-bookings",
    "Conversion Tracking",
    "เพิ่มการจองผ่านเว็บไซต์",
    "Website Conversion & Direct Bookings",
    "ช่วยวิเคราะห์ว่าอะไรทำให้ผู้ใช้งานเข้ามาที่เว็บไซต์แล้วไม่ไปต่อถึงการจอง พร้อมปรับเส้นทางจองตรงให้ชัดขึ้น",
    "See what stops a website visit from becoming a booking, then make the direct-booking path clearer.",
  );
  return cards;
}

function metaRelatedCardsLookStale(cards: CmsMetaRelatedCard[]) {
  if (!cards.length) return true;
  const hrefs = cards.map((card) => card.href.replace(/\/$/, ""));
  const hasMarketing = hrefs.includes("/insights/hotel-marketing");
  const hasSeo = hrefs.includes("/insights/seo-vs-sem-for-hotels-which-one-should-you-focus-on");
  const hasDirect = hrefs.includes("/insights/direct-booking-journey-audit");
  if (hrefs.includes("/tools/ota-commission-calculator") || hrefs.includes("/solutions/hotel-systems-implementation")) {
    return true;
  }
  return !(hasMarketing && hasSeo && hasDirect);
}

export function relatedCardDateLabel(card: CmsMetaRelatedCard, locale: Locale) {
  const updated = card.updatedAt.trim();
  const published = card.publishedAt.trim();
  const iso = updated && updated !== published ? updated : published;
  if (!iso) return "";
  const ui = insightsIndexCopy[locale] ?? insightsIndexCopy.en;
  const prefix = updated && updated !== published ? ui.updated : ui.published;
  return `${prefix} ${formatInsightDate(iso, locale)}`;
}

export function relatedCardTypeLabel(card: CmsMetaRelatedCard) {
  return [card.contentType, card.readingTime].map((item) => item.trim()).filter(Boolean).join(" · ");
}

export function publicCardHref(href: string, locale: Locale) {
  const next = href.trim();
  if (!next) return null;
  const found = existingHref(next, locale);
  if (found) return found;
  if (next.startsWith("/insights/") && existingHref(next, "th")) return next;
  return null;
}

const RELATED_ID_ALIASES: Record<string, string> = {
  "seo-vs-sem": "seo-vs-sem-for-hotels-which-one-should-you-focus-on",
  "hotel-marketing": "hotel-marketing",
  "direct-booking": "direct-booking-journey-audit",
  "booking-engine": "hotel-systems-implementation",
  "conversion-tracking": "hotel-direct-bookings",
  "google-ads": "google-ads-management",
  "hotel-seo": "hotel-seo-google-maps-ai-search",
  ota: "ota-commission-calculator",
};

function parseRelatedCardRow(row: Record<string, unknown>, index: number, defaults: CmsMetaRelatedCard[]): CmsMetaRelatedCard {
  const rawId = RELATED_ID_ALIASES[asString(row.id)] || asString(row.id) || `related-${index + 1}`;
  const hrefRaw = asString(row.href).replace(/\/$/, "");
  const fallback = defaults.find((item) => item.id === rawId) || defaults.find((item) => item.href === hrefRaw);
  const href = hrefRaw || fallback?.href || "";
  return {
    id: rawId,
    href,
    category: asString(row.category) || fallback?.category || "",
    title: asString(row.title) || fallback?.title || "",
    description: asString(row.description) || fallback?.description || "",
    publishedAt: asString(row.publishedAt) || fallback?.publishedAt || "",
    updatedAt: asString(row.updatedAt) || fallback?.updatedAt || "",
    contentType: asString(row.contentType) || fallback?.contentType || "",
    readingTime: asString(row.readingTime) || fallback?.readingTime || "",
    meta: asString(row.meta) || fallback?.meta || "",
    cta: asString(row.cta) || fallback?.cta || "",
    featured: bool(row.featured, fallback?.featured ?? false),
  };
}

function parseRelatedCards(value: unknown, locale: Locale): CmsMetaRelatedCard[] {
  const defaults = defaultMetaAdsRelatedCards(locale);
  if (!Array.isArray(value)) return defaults;
  const rows = value.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"));
  if (!rows.length) return defaults;
  const parsed = rows.map((row, index) => parseRelatedCardRow(row, index, defaults)).filter((card) => card.href && card.title);
  return parsed.length && !metaRelatedCardsLookStale(parsed) ? parsed : defaults;
}

function asCreativeFormat(value: unknown, fallback: MetaCreativeFormat = "image"): MetaCreativeFormat {
  const next = asString(value).toLowerCase();
  if (next === "short video") return "video";
  return metaCreativeFormatIsKnown(next) ? next : fallback;
}

function asCreativeStatus(value: unknown, fallback: MetaCreativeStatus = "draft"): MetaCreativeStatus {
  const next = asString(value).toLowerCase();
  return metaCreativeStatusIsKnown(next) ? next : fallback;
}

function emptyCreativeRow(index = 0): CmsMetaCreativeRow {
  return {
    id: `creative-${index + 1}`,
    audience: "",
    market: "",
    hook: "",
    offer: "",
    format: "image",
    formatLabel: "",
    landing: "",
    kpi: "",
    status: "draft",
    assetSrc: "",
    assetKind: "none",
    assetAlt: "",
    order: index + 1,
  };
}

export function defaultMetaAdsCreativeRows(locale: Locale): CmsMetaCreativeRow[] {
  const thai = locale === "th";
  return META_CREATIVE_ROWS.map((item, index) => ({
    id: item.id,
    audience: thai ? item.audienceTh : item.audienceEn,
    market: thai ? item.marketTh : item.marketEn,
    hook: thai ? item.hookTh : item.hookEn,
    offer: thai ? item.offerTh : item.offerEn,
    format: item.format,
    formatLabel: item.formatLabel,
    landing: thai ? item.landingTh : item.landingEn,
    kpi: thai ? item.kpiTh : item.kpiEn,
    status: item.status,
    assetSrc: "",
    assetKind: "none",
    assetAlt: "",
    order: index + 1,
  }));
}

function parseCreativeRow(row: Record<string, unknown>, index: number): CmsMetaCreativeRow {
  const fallback = emptyCreativeRow(index);
  const assetSrc = asString(row.assetSrc, asString(row.src));
  const format = asCreativeFormat(row.format, fallback.format);
  return {
    id: asString(row.id, fallback.id),
    audience: asString(row.audience, asString(row.audienceSegment)),
    market: asString(row.market, asString(row.language)),
    hook: asString(row.hook, asString(row.creativeHook)),
    offer: asString(row.offer, asString(row.message)),
    format,
    formatLabel: asString(row.formatLabel),
    landing: asString(row.landing, asString(row.landingPage)),
    kpi: asString(row.kpi, asString(row.primaryKpi)),
    status: asCreativeStatus(row.status, fallback.status),
    assetSrc,
    assetKind: metaCreativeAssetKindFromSrc(assetSrc, asString(row.assetKind)),
    assetAlt: asString(row.assetAlt, asString(row.alt)),
    order: Number(row.order) || index + 1,
  };
}

function defaultCreativeSection(locale: Locale) {
  const thai = locale === "th";
  return {
    title: thai ? "จับคู่กลุ่มลูกค้า ข้อความ รูปแบบ หน้าปลายทาง และ KPI" : "Match audience, message, format, destination, and KPI",
    body: thai
      ? "ตารางนี้เป็นกรอบวางครีเอทีฟ ไม่ใช่ผลแคมเปญ แสดงตัวเลขเมื่อมีข้อมูลที่อนุมัติแล้วเท่านั้น"
      : "This matrix is a planning framework, not campaign results. Figures stay hidden until approved data exists.",
    rows: defaultMetaAdsCreativeRows(locale),
  };
}

function parseCreative(value: unknown, locale: Locale): CmsMetaAdsPage["creative"] {
  const fallback = defaultCreativeSection(locale);
  if (!value || typeof value !== "object") return fallback;
  const row = value as Record<string, unknown>;
  const rows = Array.isArray(row.rows)
    ? row.rows.map((item, index) => {
        const next = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
        return parseCreativeRow(next, index);
      })
    : fallback.rows;
  return {
    title: asString(row.title, fallback.title),
    body: asString(row.body, fallback.body),
    rows,
  };
}

function parseCta(value: unknown, fallback: CmsAdsCta): CmsAdsCta {
  if (!value || typeof value !== "object") return { ...fallback };
  const row = value as Record<string, unknown>;
  return { label: asString(row.label, fallback.label), href: asString(row.href, fallback.href) };
}

export function serializeMetaAdsPageBody(content: CmsMetaAdsPage) {
  return JSON.stringify(content);
}

export function isMetaAdsCmsBody(body: string) {
  try {
    const parsed = JSON.parse(body) as { template?: string };
    return parsed?.template === META_ADS_CMS_TEMPLATE;
  } catch {
    return false;
  }
}

export function parseMetaAdsPageBody(body: string, locale: Locale): CmsMetaAdsPage | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  const row = parsed as Record<string, unknown>;
  if (row.template !== META_ADS_CMS_TEMPLATE) return null;
  const fallback = emptyMetaAdsCms();
  const hero = (row.hero && typeof row.hero === "object" ? row.hero : {}) as Record<string, unknown>;
  const visibility = (row.visibility && typeof row.visibility === "object" ? row.visibility : {}) as Record<string, unknown>;
  const readiness = (row.readiness && typeof row.readiness === "object" ? row.readiness : {}) as Record<string, unknown>;
  const channels = (row.channels && typeof row.channels === "object" ? row.channels : {}) as Record<string, unknown>;
  const workflow = (row.workflow && typeof row.workflow === "object" ? row.workflow : {}) as Record<string, unknown>;
  const creative = row.creative && typeof row.creative === "object" ? row.creative : undefined;
  const measure = (row.measure && typeof row.measure === "object" ? row.measure : {}) as Record<string, unknown>;
  const related = (row.related && typeof row.related === "object" ? row.related : {}) as Record<string, unknown>;
  const checklists = (row.checklists && typeof row.checklists === "object" ? row.checklists : {}) as Record<string, unknown>;
  const form = (row.form && typeof row.form === "object" ? row.form : {}) as Record<string, unknown>;
  const seo = (row.seo && typeof row.seo === "object" ? row.seo : {}) as Record<string, unknown>;
  const thai = locale === "th";

  return {
    version: 1,
    template: META_ADS_CMS_TEMPLATE,
    hero: {
      eyebrow: asString(hero.eyebrow),
      title: asString(hero.title),
      description: asString(hero.description),
      primaryCta: parseCta(hero.primaryCta, fallback.hero.primaryCta),
      secondaryCta: parseCta(hero.secondaryCta, fallback.hero.secondaryCta),
      underCta: asString(hero.underCta),
      caption: asString(hero.caption, thai ? META_HERO_VISUAL.caption.th : META_HERO_VISUAL.caption.en),
      visual: parseVisual(hero.visual, {
        ...emptyVisual(),
        status: "sample",
        label: thai ? META_HERO_VISUAL.label.th : META_HERO_VISUAL.label.en,
        altTh: META_HERO_VISUAL.alt.th,
        altEn: META_HERO_VISUAL.alt.en,
        caption: thai ? META_HERO_VISUAL.caption.th : META_HERO_VISUAL.caption.en,
      }),
    },
    visibility: {
      title: asString(visibility.title),
      body: asString(visibility.body),
      note: asString(visibility.note),
      sourceLabel: asString(visibility.sourceLabel, META_PLATFORM_AUDIENCE_SOURCE.label),
      sourceHref: asString(visibility.sourceHref, META_PLATFORM_AUDIENCE_SOURCE.href),
      visual: parseVisual(visibility.visual, {
        ...emptyVisual(),
        status: "sample",
        label: thai ? META_AUDIENCE_VISUAL.label.th : META_AUDIENCE_VISUAL.label.en,
        altTh: META_AUDIENCE_VISUAL.alt.th,
        altEn: META_AUDIENCE_VISUAL.alt.en,
        caption: thai ? META_AUDIENCE_VISUAL.caption.th : META_AUDIENCE_VISUAL.caption.en,
      }),
      stats: parseAudienceStats(visibility.stats, locale),
    },
    readiness: {
      title: asString(readiness.title),
      body: asString(readiness.body),
      visual: parseVisual(readiness.visual, {
        ...emptyVisual(),
        status: "sample",
        label: thai ? META_READINESS_VISUAL.label.th : META_READINESS_VISUAL.label.en,
        altTh: META_READINESS_VISUAL.alt.th,
        altEn: META_READINESS_VISUAL.alt.en,
        caption: thai ? META_READINESS_VISUAL.caption.th : META_READINESS_VISUAL.caption.en,
      }),
      items: Array.isArray(readiness.items)
        ? readiness.items.map((item, index) => {
            const rowItem = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
            const inspect = asString(rowItem.inspect, asString(rowItem.check));
            const problem = asString(rowItem.problem, asString(rowItem.why));
            return {
              id: asString(rowItem.id, `readiness-${index + 1}`),
              area: asString(rowItem.area),
              problem,
              inspect,
              improve: asString(rowItem.improve),
              output: asString(rowItem.output),
              check: inspect,
              why: problem,
              order: Number(rowItem.order) || index + 1,
            };
          })
        : [],
    },
    channels: {
      title: asString(channels.title),
      visual: parseVisual(channels.visual, {
        ...emptyVisual(),
        status: "sample",
        label: thai ? META_SCENARIO_VISUAL.label.th : META_SCENARIO_VISUAL.label.en,
        altTh: META_SCENARIO_VISUAL.alt.th,
        altEn: META_SCENARIO_VISUAL.alt.en,
        caption: thai ? META_SCENARIO_VISUAL.caption.th : META_SCENARIO_VISUAL.caption.en,
      }),
      rows: Array.isArray(channels.rows)
        ? channels.rows.map((item, index) => {
            const rowItem = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
            const useCase = asString(rowItem.useCase, asString(rowItem.role));
            const input = asString(rowItem.input, asString(rowItem.need));
            return {
              id: asString(rowItem.id, `channel-${index + 1}`),
              channel: asString(rowItem.channel),
              useCase,
              control: asString(rowItem.control),
              input,
              output: asString(rowItem.output),
              kpi: asString(rowItem.kpi),
              role: useCase,
              need: input,
              hotel: asString(rowItem.hotel),
              order: Number(rowItem.order) || index + 1,
            };
          })
        : META_SCENARIO_ROWS.map((item, index) => ({
            id: item.id,
            channel: item.channel,
            useCase: thai ? item.useCaseTh : item.useCaseEn,
            control: thai ? item.controlTh : item.controlEn,
            input: thai ? item.inputTh : item.inputEn,
            output: thai ? item.outputTh : item.outputEn,
            kpi: thai ? item.kpiTh : item.kpiEn,
            role: thai ? item.useCaseTh : item.useCaseEn,
            need: thai ? item.inputTh : item.inputEn,
            hotel: thai ? item.hotelTh : item.hotelEn,
            order: index + 1,
          })),
    },
    scenario: parseScenario(row.scenario, locale),
    workflow: {
      title: asString(workflow.title),
      visual: parseVisual(workflow.visual, {
        ...emptyVisual(),
        status: "sample",
        label: thai ? META_WORKFLOW_VISUAL.label.th : META_WORKFLOW_VISUAL.label.en,
        altTh: META_WORKFLOW_VISUAL.alt.th,
        altEn: META_WORKFLOW_VISUAL.alt.en,
        caption: thai ? META_WORKFLOW_VISUAL.caption.th : META_WORKFLOW_VISUAL.caption.en,
      }),
      steps: Array.isArray(workflow.steps)
        ? workflow.steps.map((item, index) => {
            const rowItem = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
            const nextDecision = asString(rowItem.nextDecision, asString(rowItem.handoff));
            return {
              id: asString(rowItem.id, `step-${index + 1}`),
              number: asString(rowItem.number, String(index + 1).padStart(2, "0")),
              title: asString(rowItem.title),
              owner: asString(rowItem.owner),
              input: asString(rowItem.input),
              action: asString(rowItem.action),
              output: asString(rowItem.output),
              nextDecision,
              handoff: nextDecision,
              order: Number(rowItem.order) || index + 1,
            };
          })
        : META_WORKFLOW_STEPS.map((item, index) => ({
            id: item.id,
            number: item.number,
            title: thai ? item.titleTh : item.titleEn,
            owner: thai ? item.ownerTh : item.ownerEn,
            input: thai ? item.inputTh : item.inputEn,
            action: thai ? item.actionTh : item.actionEn,
            output: thai ? item.outputTh : item.outputEn,
            nextDecision: thai ? item.nextDecisionTh : item.nextDecisionEn,
            handoff: thai ? item.nextDecisionTh : item.nextDecisionEn,
            order: index + 1,
          })),
    },
    creative: parseCreative(creative, locale),
    checklists: {
      tracking: parseChecklist(checklists.tracking, defaultChecklist(META_TRACKING_BOUNDARY, locale)),
      events: parseChecklist(checklists.events, defaultChecklist(META_SUPPORTED_EVENTS, locale)),
      landing: parseChecklist(checklists.landing, defaultChecklist(META_LANDING_CHECKLIST, locale)),
    },
    measure: {
      title: asString(measure.title),
      intro: asString(measure.intro),
      close: asString(measure.close),
      visual: parseVisual(measure.visual, {
        ...emptyVisual(),
        status: "sample",
        label: thai ? META_KPI_VISUAL.label.th : META_KPI_VISUAL.label.en,
        altTh: META_KPI_VISUAL.alt.th,
        altEn: META_KPI_VISUAL.alt.en,
        caption: thai ? META_KPI_VISUAL.caption.th : META_KPI_VISUAL.caption.en,
      }),
      kpis: Array.isArray(measure.kpis)
        ? measure.kpis.map((item, index) => {
            const rowItem = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
            const labels = asStringList(rowItem.labels);
            const values = asNumberList(rowItem.values);
            const seriesReady = metaKpiSeriesReady(labels, values);
            const name = asString(rowItem.name);
            const id = asString(rowItem.id, `kpi-${index + 1}`);
            const context = asString(rowItem.context);
            const objective = asString(rowItem.objective, context);
            return {
              id,
              name,
              group: metaKpiGroupFrom({ id, name, group: asString(rowItem.group) }),
              objective,
              market: asString(rowItem.market),
              definition: asString(rowItem.definition),
              unit: asString(rowItem.unit),
              period: asString(rowItem.period),
              target: asString(rowItem.target),
              value: asString(rowItem.value),
              context: context || objective,
              labels: seriesReady ? labels : [],
              values: seriesReady ? values : [],
              tone: asKpiTone(rowItem.tone),
              dataStatus: asKpiStatus(rowItem.dataStatus),
              updatedAt: asString(rowItem.updatedAt),
              hideUntilData: Boolean(rowItem.hideUntilData),
            };
          })
        : defaultMetaAdsKpis(locale),
    },
    related: {
      title: asString(related.title),
      visual: parseRelatedVisual(related.visual, locale),
      cards: parseRelatedCards(related.cards, locale),
    },
    form: {
      kicker: asString(form.kicker),
      heading: asString(form.heading),
      lead: asString(form.lead),
      submit: asString(form.submit),
      receiveTitle: asString(form.receiveTitle),
      receive: (() => {
        const titles = META_ENQUIRY_RECEIVE.map((item) => item.title);
        const items = Array.isArray(form.receive) ? form.receive.map((item) => String(item)).filter((item) => item.trim()) : titles;
        return metaEnquiryReceiveIsStale(items) ? titles : items;
      })(),
      nextTitle: asString(form.nextTitle, thai ? META_ENQUIRY.nextTitle.th : META_ENQUIRY.nextTitle.en),
      steps: (() => {
        const fallback = thai ? [...META_ENQUIRY.steps.th] : [...META_ENQUIRY.steps.en];
        const items = Array.isArray(form.steps) ? form.steps.map((item) => String(item)).filter((item) => item.trim()) : fallback;
        return metaEnquiryStepsAreStale(items) ? fallback : items;
      })(),
      labels: parseFormLabels(form.labels, defaultFormLabels(locale)),
      visual: parseVisual(form.visual, emptyVisual()),
    },
    faqs: (() => {
      const fallback = metaFaqs(locale).map((item, index) => ({ id: `faq-${index + 1}`, q: item.q, a: item.a }));
      if (!Array.isArray(row.faqs)) return fallback;
      const items = row.faqs
        .map((item, index) => {
          const faq = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
          return { id: asString(faq.id, `faq-${index + 1}`), q: asString(faq.q), a: asString(faq.a) };
        })
        .filter((item) => item.q || item.a);
      return !items.length || metaFaqsAreStale(items) ? fallback : items;
    })(),
    seo: { social: parseVisual(seo.social, emptyVisual()) },
  };
}

function walkStrings(value: unknown, visit: (text: string) => void) {
  if (typeof value === "string") visit(value);
  else if (Array.isArray(value)) value.forEach((item) => walkStrings(item, visit));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => walkStrings(item, visit));
}

function hasPrivateData(content: CmsMetaAdsPage) {
  let found = false;
  walkStrings(content, (text) => {
    if (EMAIL_RE.test(text) || PHONE_RE.test(text) || ACCOUNT_RE.test(text)) found = true;
  });
  return found;
}

export function validateMetaAdsPage(content: CmsMetaAdsPage, intent: MetaCmsIntent) {
  const creativeError = validateMetaAdsCreativeRows(content.creative?.rows || [], intent);
  if (creativeError) return creativeError;
  if (intent !== "publish") return null;
  if (!content.hero.title.trim() || !content.hero.description.trim()) return "required_fields";
  const ctas = [content.hero.primaryCta, content.hero.secondaryCta];
  if (ctas.some((cta) => cta.label.trim() && !CTA_RE.test(cta.href.trim()))) return "invalid_cta";
  const visuals = [
    content.hero.visual,
    content.visibility.visual,
    content.readiness.visual,
    content.channels.visual,
    content.workflow.visual,
    content.measure.visual,
    content.related.visual,
    content.form.visual,
    content.seo.social,
    content.scenario.visual,
  ];
  for (const visual of visuals) {
    if (visual.src && (!visual.altTh.trim() || !visual.altEn.trim())) return "missing_alt";
    if (visual.src && visual.status === "placeholder") return "placeholder_status";
    if (visual.src && visual.status !== "sample" && visual.status !== "approved" && visual.status !== "real") {
      return "screenshot_approval";
    }
    if (
      visual.src &&
      PLACEHOLDER_RE.test(`${visual.src} ${visual.label} ${visual.caption}`) &&
      visual.status !== "sample"
    ) {
      return "placeholder_label";
    }
    if (visual.src && visual.containsMetaBrand && !visual.brandNote.trim()) return "brand_note";
  }
  const publishedStats = content.visibility.stats.filter((stat) => stat.value.trim() || stat.platform.trim());
  if (publishedStats.length) {
    if (!content.visibility.sourceLabel.trim() || !content.visibility.sourceHref.trim()) return "audience_incomplete";
    if (!CTA_RE.test(content.visibility.sourceHref.trim())) return "invalid_cta";
    for (const stat of publishedStats) {
      if (!stat.period.trim() || !stat.market.trim() || !stat.definition.trim() || !stat.dataStatus) {
        return "audience_incomplete";
      }
    }
  }
  for (const kpi of content.measure.kpis) {
    if (kpi.hideUntilData || kpi.dataStatus === "draft") continue;
    const publicReady = kpi.dataStatus === "approved" || kpi.dataStatus === "anonymised" || kpi.dataStatus === "sample";
    const hasValue = Boolean(kpi.value.trim() || metaKpiSeriesReady(kpi.labels, kpi.values));
    if (
      publicReady &&
      (!kpi.name.trim() ||
        !kpi.period.trim() ||
        !(kpi.unit.trim() || kpi.definition.trim()) ||
        !(kpi.objective.trim() || kpi.context.trim()) ||
        !kpi.market.trim() ||
        !hasValue)
    ) {
      return "kpi_incomplete";
    }
  }
  for (const faq of content.faqs) {
    if (!faq.q.trim() || !faq.a.trim()) return "empty_faq";
  }
  for (const card of content.related.cards) {
    if (card.title.trim() && card.href.trim() && !CTA_RE.test(card.href.trim())) return "invalid_cta";
  }
  if (hasPrivateData(content)) return "private_data";
  return null;
}

export function metaCmsErrorMessage(code: string) {
  const table: Record<string, string> = {
    invalid_cta: "ลิงก์ปุ่มต้องเป็น /path, #anchor, mailto, tel หรือ http(s)",
    missing_alt: "รูปที่เผยแพร่ต้องมีคำอธิบายภาพภาษาไทยและภาษาอังกฤษ",
    placeholder_status: "เปลี่ยนสถานะรูปจาก Placeholder เป็น Sample หรือ Approved ก่อนเผยแพร่",
    placeholder_label: "อย่าเผยแพร่ข้อความ Placeholder ถ้าสถานะไม่ใช่ Sample",
    kpi_incomplete: "KPI ที่เผยแพร่ต้องมีชื่อ กลุ่ม วัตถุประสงค์ ตลาด/กลุ่มลูกค้า ช่วงเวลา หน่วยหรือคำนิยาม ค่าที่แสดง และสถานะ Approved, Anonymised หรือ Sample",
    empty_faq: "คำถามและคำตอบใน FAQ ต้องไม่ว่างเมื่อเผยแพร่",
    brand_note: "รูปที่มีโลโก้หรือแบรนด์ Meta / Instagram / Facebook ต้องมีบันทึกการอนุญาตหรือการอนุมัติก่อนเผยแพร่",
    audience_incomplete: "ตัวเลขกลุ่มเป้าหมายต้องมีที่มา ช่วงเวลา ตลาด คำนิยาม และสถานะข้อมูลก่อนเผยแพร่",
    screenshot_approval: "ภาพหน้าจอจริงต้องมีสถานะ Approved หรือ Real ก่อนเผยแพร่ หรือตั้งเป็น Sample อย่างชัดเจน",
    required_fields: "กรอกหัวข้อและคำอธิบายของส่วน Hero ก่อนเผยแพร่",
    invalid_image: "อัปโหลดได้เฉพาะ JPG PNG หรือ WEBP ขนาดไม่เกิน 5MB",
    missing: "ไม่พบหน้าเพจ",
    invalid_json: "ข้อมูลฟอร์มไม่ถูกต้อง",
    private_data: "ห้ามเผยแพร่อีเมล เบอร์โทร รหัสบัญชีโฆษณา หรือข้อมูลลูกค้า",
    creative_incomplete: "แถว Creative Matrix ต้องมีกลุ่มลูกค้า ตลาด/ภาษา Hook ข้อเสนอ รูปแบบ หน้าปลายทาง KPI และสถานะ",
    creative_format: "รูปแบบครีเอทีฟต้องเป็น image, video, carousel, story หรือ reels",
    creative_status: "สถานะครีเอทีฟต้องเป็น Draft, Review, Approved, Active หรือ Archived",
    creative_asset_alt: "ครีเอทีฟที่มีรูปหรือวิดีโอต้องมีคำอธิบายภาพก่อนเผยแพร่",
    creative_results: "Creative Matrix เป็นกรอบวางแผน ห้ามใส่ตัวเลขผลแคมเปญที่ยังไม่อนุมัติ",
    invalid_asset: "อัปโหลดครีเอทีฟได้เฉพาะ JPG PNG WEBP MP4 หรือ WEBM ขนาดไม่เกิน 15MB",
  };
  return table[code] ?? "บันทึกไม่สำเร็จ";
}

export function editorStateFromMetaAdsDocument(input: {
  id: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  locale: string;
  status: string;
  body: string;
  ogImage?: string;
}): MetaEditorState {
  const locale = (["th", "en", "ru", "zh"].includes(input.locale) ? input.locale : "th") as Locale;
  const content = parseMetaAdsPageBody(input.body, locale) ?? emptyMetaAdsCms();
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

export function isMetaAdsPageDocument(input: { slug: string; template: string }) {
  if (input.template === META_ADS_CMS_TEMPLATE) return true;
  return (
    input.slug === META_ADS_PAGE_SLUG ||
    input.slug === "en/solutions/meta-ads-management" ||
    input.slug === "ru/solutions/meta-ads-management" ||
    input.slug === "zh/solutions/meta-ads-management"
  );
}

export function creativeRowIsEmpty(row: CmsMetaCreativeRow) {
  return ![row.audience, row.market, row.hook, row.offer, row.formatLabel, row.landing, row.kpi, row.assetSrc, row.assetAlt]
    .some((item) => item.trim());
}

export function validateMetaAdsCreativeRows(rows: CmsMetaCreativeRow[], intent: MetaCmsIntent) {
  const filled = rows.filter((row) => !creativeRowIsEmpty(row));
  if (intent === "publish" && !filled.length) return "creative_incomplete";
  for (const row of filled) {
    if (!row.audience.trim() || !row.market.trim() || !row.hook.trim() || !row.offer.trim() || !row.landing.trim() || !row.kpi.trim()) {
      return "creative_incomplete";
    }
    if (!metaCreativeFormatIsKnown(row.format)) return "creative_format";
    if (!metaCreativeStatusIsKnown(row.status)) return "creative_status";
    if (metaCreativeLooksLikeResult(`${row.kpi} ${row.offer} ${row.hook}`)) return "creative_results";
    if (intent === "publish" && row.assetSrc.trim() && !row.assetAlt.trim()) return "creative_asset_alt";
  }
  return null;
}

export function newAdsItemId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}
