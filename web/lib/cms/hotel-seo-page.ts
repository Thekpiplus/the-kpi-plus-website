import {
  HOTEL_SEO_AUDIT_VISUAL,
  HOTEL_SEO_BEHAVIOR_MAP,
  HOTEL_SEO_BEHAVIOR_TYPES,
  HOTEL_SEO_BEHAVIOR_VISUAL,
  HOTEL_SEO_COMPARE_ROWS,
  HOTEL_SEO_COMPARE_VISUAL,
  HOTEL_SEO_ENQUIRY,
  HOTEL_SEO_ENQUIRY_RECEIVE,
  HOTEL_SEO_FLOW_STAGES,
  HOTEL_SEO_FLOW_VISUAL,
  HOTEL_SEO_GBP_ACTIONS,
  HOTEL_SEO_GBP_FIELDS,
  HOTEL_SEO_GBP_VISUAL,
  HOTEL_SEO_GSC_ROWS,
  HOTEL_SEO_HELP_BOUNDARY,
  HOTEL_SEO_HELP_STEPS,
  HOTEL_SEO_HERO_VISUAL,
  HOTEL_SEO_KPIS,
  HOTEL_SEO_KPI_VISUAL,
  HOTEL_SEO_LISTING_ROWS,
  HOTEL_SEO_PROBLEM_ITEMS,
  HOTEL_SEO_PROCESS_STEPS,
  HOTEL_SEO_PROCESS_VISUAL,
  HOTEL_SEO_RELATED_VISUAL,
  HOTEL_SEO_SOURCES,
  hotelSeoFaqs,
  hotelSeoFaqsAreStale,
  hotelSeoRelatedCards,
  type HotelSeoKpiStatus,
  type HotelSeoSourceStatus,
  type HotelSeoVisualStatus,
} from "@/lib/hotel-seo";
import type { Locale } from "@/lib/seo";

export const HOTEL_SEO_CMS_TEMPLATE = "hotel-seo-google-maps-ai-search";
export const HOTEL_SEO_PAGE_SLUG = "solutions/hotel-seo-google-maps-ai-search";
export const HOTEL_SEO_PAGE_ROUTE = "/solutions/hotel-seo-google-maps-ai-search";
export const SEO_CMS_INTENTS = ["save", "draft", "preview", "publish", "unpublish"] as const;
export type SeoCmsIntent = (typeof SEO_CMS_INTENTS)[number];
export const SEO_CMS_VISUAL_STATUSES = ["placeholder", "sample", "approved", "real"] as const;
export const SEO_CMS_KPI_STATUSES = ["draft", "sample", "approved", "anonymised"] as const;
export type SeoCmsSaveResult = { ok: true; id: string; intent: SeoCmsIntent } | { ok: false; error: string };

export type CmsSeoCta = { label: string; href: string };
export type CmsSeoVisual = {
  src: string;
  altTh: string;
  altEn: string;
  status: HotelSeoVisualStatus;
  label: string;
  caption: string;
  containsGoogleBrand: boolean;
  brandNote: string;
};
export type CmsSeoSource = {
  name: string;
  url: string;
  publishedAt: string;
  accessedAt: string;
  market: string;
  period: string;
  definition: string;
  status: HotelSeoSourceStatus;
};
export type CmsSeoFaq = { id: string; q: string; a: string };
export type CmsSeoKpi = {
  id: string;
  name: string;
  group: string;
  definition: string;
  unit: string;
  period: string;
  target: string;
  value: string;
  context: string;
  labels: string[];
  values: number[];
  dataStatus: HotelSeoKpiStatus;
  updatedAt: string;
  hideUntilData: boolean;
  source: CmsSeoSource;
};
export type CmsSeoCompareRow = {
  id: string;
  num: string;
  area: string;
  goal: string;
  prepare: string;
  sees: string;
  output: string;
  order: number;
};
export type CmsSeoProblemRow = {
  id: string;
  num: string;
  problem: string;
  sees: string;
  inspect: string;
  improve: string;
  output: string;
  order: number;
};
export type CmsSeoHelpStep = {
  id: string;
  num: string;
  title: string;
  owner: string;
  input: string;
  action: string;
  output: string;
  nextDecision: string;
  order: number;
};
export type CmsSeoFlowStage = { id: string; label: string; output: string; order: number };
export type CmsSeoBehaviorType = { id: string; num: string; title: string; body: string; order: number };
export type CmsSeoGbpField = { id: string; label: string; check: string; order: number };
export type CmsSeoGbpAction = { id: string; name: string; label: string; order: number };
export type CmsSeoProcessStep = {
  id: string;
  num: string;
  phase: string;
  title: string;
  action: string;
  owner: string;
  input: string;
  output: string;
  nextDecision: string;
  order: number;
};
export type CmsSeoRelatedCard = {
  id: string;
  href: string;
  external: boolean;
  featured: boolean;
  category: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  accessedAt: string;
  contentType: string;
  readingTime: string;
  cta: string;
  sourceName: string;
  sourceUrl: string;
  order: number;
};
export type CmsSeoChecklistItem = { id: string; area: string; check: string; order: number };
export type CmsSeoFormLabels = {
  name: string;
  business: string;
  contact: string;
  website: string;
  maps: string;
  issue: string;
  outcome: string;
  consent: string;
  privacy: string;
};
export type CmsSeoFormReceive = { id: string; title: string; body: string };
export type CmsSeoBoundary = {
  kicker: string;
  note: string;
  supportTitle: string;
  approveTitle: string;
  support: string[];
  approve: string[];
};

export type CmsHotelSeoPage = {
  version: 1;
  template: typeof HOTEL_SEO_CMS_TEMPLATE;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    points: string[];
    primaryCta: CmsSeoCta;
    secondaryCta: CmsSeoCta;
    underCta: string;
    visual: CmsSeoVisual;
  };
  search: {
    title: string;
    intro: string;
    aiTitle: string;
    aiBody: string;
    growthTitle: string;
    growthStat: string;
    growthLabel: string;
    growthNote: string;
    mapsTitle: string;
    mapsBody: string;
    close: string;
    aiNote: string;
    types: CmsSeoBehaviorType[];
    map: string[];
    aiModeSource: CmsSeoSource;
    growthSource: CmsSeoSource;
    mapsSource: CmsSeoSource;
    aiNoteSource: CmsSeoSource;
    visual: CmsSeoVisual;
  };
  compare: { title: string; close: string; visual: CmsSeoVisual; rows: CmsSeoCompareRow[] };
  problems: { title: string; cta: string; visual: CmsSeoVisual; items: CmsSeoProblemRow[] };
  help: { title: string; visual: CmsSeoVisual; stages: CmsSeoFlowStage[]; steps: CmsSeoHelpStep[]; boundary: CmsSeoBoundary };
  gbp: {
    title: string;
    body: string;
    example: string;
    rankNote: string;
    close: string;
    source: CmsSeoSource;
    visual: CmsSeoVisual;
    fields: CmsSeoGbpField[];
    actions: CmsSeoGbpAction[];
  };
  method: { title: string; visual: CmsSeoVisual; steps: CmsSeoProcessStep[] };
  measure: { title: string; intro: string; close: string; visual: CmsSeoVisual; kpis: CmsSeoKpi[] };
  related: { title: string; visual: CmsSeoVisual; cards: CmsSeoRelatedCard[] };
  form: {
    kicker: string;
    heading: string;
    lead: string;
    note: string;
    submit: string;
    receiveTitle: string;
    nextTitle: string;
    receive: CmsSeoFormReceive[];
    steps: string[];
    labels: CmsSeoFormLabels;
    visual: CmsSeoVisual;
  };
  faqs: CmsSeoFaq[];
  consistency: { title: string; note: string; gsc: CmsSeoChecklistItem[]; listing: CmsSeoChecklistItem[] };
  seo: { social: CmsSeoVisual; canonical: string };
};

export type SeoEditorState = {
  id: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  canonical: string;
  locale: string;
  status: string;
  content: CmsHotelSeoPage;
};

const PLACEHOLDER_RE = /placeholder|replace with verified|รอรูป|lorem ipsum/i;
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_RE = /(?:\+?\s*66|\b0)\s*\d(?:[\s.-]?\d){7,9}\b/;
const ACCOUNT_RE = /(?:property|account)\s*id|sc-domain:|ua-\d|g-\d{6,}/i;
const CTA_RE = /^(#|\/|https?:\/\/|mailto:|tel:)/i;

function emptyVisual(): CmsSeoVisual {
  return { src: "", altTh: "", altEn: "", status: "placeholder", label: "", caption: "", containsGoogleBrand: false, brandNote: "" };
}

function emptySource(): CmsSeoSource {
  return { name: "", url: "", publishedAt: "", accessedAt: "", market: "", period: "", definition: "", status: "guidance" };
}

function emptyCta(): CmsSeoCta {
  return { label: "", href: "/" };
}

function emptyLabels(): CmsSeoFormLabels {
  return { name: "", business: "", contact: "", website: "", maps: "", issue: "", outcome: "", consent: "", privacy: "" };
}

function emptyBoundary(): CmsSeoBoundary {
  return { kicker: "", note: "", supportTitle: "", approveTitle: "", support: [], approve: [] };
}

export function newSeoItemId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function pick(locale: Locale, th: string, en: string) {
  return locale === "th" ? th : en;
}

export function defaultHotelSeoBehaviorTypes(locale: Locale): CmsSeoBehaviorType[] {
  return HOTEL_SEO_BEHAVIOR_TYPES.map((item, index) => ({
    id: item.id,
    num: item.num,
    title: pick(locale, item.titleTh, item.titleEn),
    body: pick(locale, item.bodyTh, item.bodyEn),
    order: index + 1,
  }));
}

export function defaultHotelSeoCompareRows(locale: Locale): CmsSeoCompareRow[] {
  return HOTEL_SEO_COMPARE_ROWS.map((item, index) => ({
    id: item.id,
    num: item.num,
    area: pick(locale, item.areaTh, item.areaEn),
    goal: pick(locale, item.goalTh, item.goalEn),
    prepare: pick(locale, item.prepareTh, item.prepareEn),
    sees: pick(locale, item.seesTh, item.seesEn),
    output: pick(locale, item.outputTh, item.outputEn),
    order: index + 1,
  }));
}

const PROBLEM_IMPROVE = {
  page: { th: "จัดหน้าเว็บให้ตอบคำค้นและเชื่อมไปติดต่อหรือจอง", en: "Structure the page so it answers the query and continues to contact or booking" },
  maps: { th: "ทำให้ข้อมูล Local Listing สอดคล้องกับเว็บไซต์", en: "Align the local listing with the website" },
  website: { th: "เติมข้อมูลที่ลูกค้าใช้ตัดสินใจบนหน้าธุรกิจ", en: "Add the facts customers need on the business page" },
  reviews: { th: "ใช้ประเด็นรีวิวมาปรับ FAQ และคำอธิบายบริการ", en: "Use review themes to update FAQs and service descriptions" },
  path: { th: "ดูแหล่งที่มาจากการค้นพบจากระบบที่มีสิทธิ์", en: "Review discovery sources from systems where access exists" },
} as const;

export function defaultHotelSeoProblemRows(locale: Locale): CmsSeoProblemRow[] {
  return HOTEL_SEO_PROBLEM_ITEMS.map((item, index) => {
    const improve = PROBLEM_IMPROVE[item.id as keyof typeof PROBLEM_IMPROVE];
    return {
      id: item.id,
      num: item.num,
      problem: pick(locale, item.problemTh, item.problemEn),
      sees: pick(locale, item.seesTh, item.seesEn),
      inspect: pick(locale, item.dataTh, item.dataEn),
      improve: improve ? pick(locale, improve.th, improve.en) : "",
      output: pick(locale, item.outputTh, item.outputEn),
      order: index + 1,
    };
  });
}

export function defaultHotelSeoHelpSteps(locale: Locale): CmsSeoHelpStep[] {
  return HOTEL_SEO_HELP_STEPS.map((item, index) => ({
    id: item.id,
    num: item.num,
    title: pick(locale, item.titleTh, item.titleEn),
    owner: pick(locale, item.ownerTh, item.ownerEn),
    input: pick(locale, item.inputTh, item.inputEn),
    action: pick(locale, item.actionTh, item.actionEn),
    output: pick(locale, item.outputTh, item.outputEn),
    nextDecision: pick(locale, item.nextDecisionTh, item.nextDecisionEn),
    order: index + 1,
  }));
}

export function defaultHotelSeoFlowStages(locale: Locale): CmsSeoFlowStage[] {
  return HOTEL_SEO_FLOW_STAGES.map((item, index) => ({
    id: item.id,
    label: pick(locale, item.th, item.en),
    output: pick(locale, item.outputTh, item.outputEn),
    order: index + 1,
  }));
}

export function defaultHotelSeoBoundary(locale: Locale): CmsSeoBoundary {
  return {
    kicker: HOTEL_SEO_HELP_BOUNDARY.kicker,
    note: pick(locale, HOTEL_SEO_HELP_BOUNDARY.note.th, HOTEL_SEO_HELP_BOUNDARY.note.en),
    supportTitle: pick(locale, HOTEL_SEO_HELP_BOUNDARY.supportTitle.th, HOTEL_SEO_HELP_BOUNDARY.supportTitle.en),
    approveTitle: pick(locale, HOTEL_SEO_HELP_BOUNDARY.approveTitle.th, HOTEL_SEO_HELP_BOUNDARY.approveTitle.en),
    support: HOTEL_SEO_HELP_BOUNDARY.support.map((item) => pick(locale, item.th, item.en)),
    approve: HOTEL_SEO_HELP_BOUNDARY.approve.map((item) => pick(locale, item.th, item.en)),
  };
}

export function defaultHotelSeoGbpFields(locale: Locale): CmsSeoGbpField[] {
  return HOTEL_SEO_GBP_FIELDS.map((item, index) => ({
    id: item.id,
    label: pick(locale, item.th, item.en),
    check: pick(locale, item.checkTh, item.checkEn),
    order: index + 1,
  }));
}

export function defaultHotelSeoGbpActions(locale: Locale): CmsSeoGbpAction[] {
  return HOTEL_SEO_GBP_ACTIONS.map((item, index) => ({
    id: item.id,
    name: item.name,
    label: pick(locale, item.th, item.en),
    order: index + 1,
  }));
}

export function defaultHotelSeoProcessSteps(locale: Locale): CmsSeoProcessStep[] {
  return HOTEL_SEO_PROCESS_STEPS.map((item, index) => ({
    id: item.id,
    num: item.num,
    phase: item.phase,
    title: pick(locale, item.titleTh, item.titleEn),
    action: pick(locale, item.actionTh, item.actionEn),
    owner: pick(locale, item.ownerTh, item.ownerEn),
    input: pick(locale, item.inputTh, item.inputEn),
    output: pick(locale, item.outputTh, item.outputEn),
    nextDecision: pick(locale, item.nextDecisionTh, item.nextDecisionEn),
    order: index + 1,
  }));
}

export function defaultHotelSeoKpis(locale: Locale): CmsSeoKpi[] {
  return HOTEL_SEO_KPIS.map((item) => ({
    id: item.id,
    name: pick(locale, item.nameTh, item.nameEn),
    group: item.group,
    definition: pick(locale, item.definitionTh, item.definitionEn),
    unit: "",
    period: "",
    target: "",
    value: "",
    context: "",
    labels: [],
    values: [],
    dataStatus: "sample" as const,
    updatedAt: "",
    hideUntilData: true,
    source: {
      name: item.source.name,
      url: item.source.url,
      publishedAt: "",
      accessedAt: "",
      market: "",
      period: "",
      definition: pick(locale, item.definitionTh, item.definitionEn),
      status: "guidance",
    },
  }));
}

export function defaultHotelSeoRelatedCards(locale: Locale): CmsSeoRelatedCard[] {
  return hotelSeoRelatedCards(locale).map((card, index) => ({
    id: card.id,
    href: card.href,
    external: Boolean(card.external),
    featured: Boolean(card.featured),
    category: pick(locale, card.categoryTh, card.categoryEn),
    title: pick(locale, card.titleTh, card.titleEn),
    description: pick(locale, card.descriptionTh, card.descriptionEn),
    publishedAt: card.publishedAt || "",
    updatedAt: card.updatedAt || "",
    accessedAt: card.accessedAt || "",
    contentType: pick(locale, card.contentTypeTh, card.contentTypeEn),
    readingTime: card.readingTimeMinutes ? String(card.readingTimeMinutes) : "",
    cta: pick(locale, card.ctaTh, card.ctaEn),
    sourceName: card.sourceName || "",
    sourceUrl: card.sourceUrl || "",
    order: index + 1,
  }));
}

export function defaultHotelSeoChecklist(locale: Locale) {
  return {
    gsc: HOTEL_SEO_GSC_ROWS.map((item, index) => ({
      id: item.id,
      area: pick(locale, item.areaTh, item.areaEn),
      check: pick(locale, item.checkTh, item.checkEn),
      order: index + 1,
    })),
    listing: HOTEL_SEO_LISTING_ROWS.map((item, index) => ({
      id: item.id,
      area: pick(locale, item.areaTh, item.areaEn),
      check: pick(locale, item.checkTh, item.checkEn),
      order: index + 1,
    })),
  };
}

export function defaultHotelSeoFormCopy(locale: Locale) {
  const thai = locale === "th";
  const labels = thai ? HOTEL_SEO_ENQUIRY.labels.th : HOTEL_SEO_ENQUIRY.labels.en;
  const fields = thai ? HOTEL_SEO_ENQUIRY.fields.th : HOTEL_SEO_ENQUIRY.fields.en;
  return {
    kicker: HOTEL_SEO_ENQUIRY.kicker,
    heading: pick(locale, HOTEL_SEO_ENQUIRY.heading.th, HOTEL_SEO_ENQUIRY.heading.en),
    lead: pick(locale, HOTEL_SEO_ENQUIRY.lead.th, HOTEL_SEO_ENQUIRY.lead.en),
    note: pick(locale, HOTEL_SEO_ENQUIRY.note.th, HOTEL_SEO_ENQUIRY.note.en),
    submit: pick(locale, HOTEL_SEO_ENQUIRY.submit.th, HOTEL_SEO_ENQUIRY.submit.en),
    receiveTitle: pick(locale, HOTEL_SEO_ENQUIRY.receiveTitle.th, HOTEL_SEO_ENQUIRY.receiveTitle.en),
    nextTitle: pick(locale, HOTEL_SEO_ENQUIRY.nextTitle.th, HOTEL_SEO_ENQUIRY.nextTitle.en),
    receive: HOTEL_SEO_ENQUIRY_RECEIVE.map((item) => ({
      id: item.id,
      title: item.title,
      body: pick(locale, item.th, item.en),
    })),
    steps: thai ? [...HOTEL_SEO_ENQUIRY.steps.th] : [...HOTEL_SEO_ENQUIRY.steps.en],
    labels: {
      name: labels.name,
      business: labels.business,
      contact: labels.contact,
      website: fields.website,
      maps: fields.maps,
      issue: fields.issue,
      outcome: fields.outcome,
      consent: labels.consent,
      privacy: labels.privacy,
    },
  };
}

export function emptyHotelSeoCms(): CmsHotelSeoPage {
  return {
    version: 1,
    template: HOTEL_SEO_CMS_TEMPLATE,
    hero: {
      eyebrow: "",
      title: "",
      description: "",
      points: [],
      primaryCta: emptyCta(),
      secondaryCta: emptyCta(),
      underCta: "",
      visual: emptyVisual(),
    },
    search: {
      title: "",
      intro: "",
      aiTitle: "",
      aiBody: "",
      growthTitle: "",
      growthStat: "",
      growthLabel: "",
      growthNote: "",
      mapsTitle: "",
      mapsBody: "",
      close: "",
      aiNote: "",
      types: [],
      map: [],
      aiModeSource: emptySource(),
      growthSource: emptySource(),
      mapsSource: emptySource(),
      aiNoteSource: emptySource(),
      visual: emptyVisual(),
    },
    compare: { title: "", close: "", visual: emptyVisual(), rows: [] },
    problems: { title: "", cta: "", visual: emptyVisual(), items: [] },
    help: { title: "", visual: emptyVisual(), stages: [], steps: [], boundary: emptyBoundary() },
    gbp: {
      title: "",
      body: "",
      example: "",
      rankNote: "",
      close: "",
      source: emptySource(),
      visual: emptyVisual(),
      fields: [],
      actions: [],
    },
    method: { title: "", visual: emptyVisual(), steps: [] },
    measure: { title: "", intro: "", close: "", visual: emptyVisual(), kpis: [] },
    related: { title: "", visual: emptyVisual(), cards: [] },
    form: {
      kicker: "",
      heading: "",
      lead: "",
      note: "",
      submit: "",
      receiveTitle: "",
      nextTitle: "",
      receive: [],
      steps: [],
      labels: emptyLabels(),
      visual: emptyVisual(),
    },
    faqs: [],
    consistency: { title: "", note: "", gsc: [], listing: [] },
    seo: { social: emptyVisual(), canonical: "" },
  };
}

function asVisual(value: unknown, fallback: CmsSeoVisual): CmsSeoVisual {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const status = SEO_CMS_VISUAL_STATUSES.includes(String(row.status) as HotelSeoVisualStatus)
    ? (String(row.status) as HotelSeoVisualStatus)
    : fallback.status;
  return {
    src: String(row.src ?? fallback.src),
    altTh: String(row.altTh ?? fallback.altTh),
    altEn: String(row.altEn ?? fallback.altEn),
    status,
    label: String(row.label ?? fallback.label),
    caption: String(row.caption ?? fallback.caption),
    containsGoogleBrand: Boolean(row.containsGoogleBrand ?? fallback.containsGoogleBrand),
    brandNote: String(row.brandNote ?? fallback.brandNote),
  };
}

function asSource(value: unknown, fallback: CmsSeoSource): CmsSeoSource {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const status = ["platform_estimate", "guidance", "sample", "approved"].includes(String(row.status))
    ? (String(row.status) as HotelSeoSourceStatus)
    : fallback.status;
  return {
    name: String(row.name ?? fallback.name),
    url: String(row.url ?? fallback.url),
    publishedAt: String(row.publishedAt ?? fallback.publishedAt),
    accessedAt: String(row.accessedAt ?? fallback.accessedAt),
    market: String(row.market ?? fallback.market),
    period: String(row.period ?? fallback.period),
    definition: String(row.definition ?? fallback.definition),
    status,
  };
}

function asStringList(value: unknown, fallback: string[]): string[] {
  return Array.isArray(value) ? value.map((item) => String(item)).filter((item) => item.trim()) : fallback;
}

function asKpi(value: unknown, fallback: CmsSeoKpi): CmsSeoKpi {
  const row = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const dataStatus = SEO_CMS_KPI_STATUSES.includes(String(row.dataStatus) as HotelSeoKpiStatus)
    ? (String(row.dataStatus) as HotelSeoKpiStatus)
    : fallback.dataStatus;
  return {
    id: String(row.id ?? fallback.id),
    name: String(row.name ?? fallback.name),
    group: String(row.group ?? fallback.group),
    definition: String(row.definition ?? fallback.definition),
    unit: String(row.unit ?? fallback.unit),
    period: String(row.period ?? fallback.period),
    target: String(row.target ?? fallback.target),
    value: String(row.value ?? fallback.value),
    context: String(row.context ?? fallback.context),
    labels: Array.isArray(row.labels) ? row.labels.map((item) => String(item)) : fallback.labels,
    values: Array.isArray(row.values) ? row.values.map((item) => Number(item)).filter((item) => Number.isFinite(item)) : fallback.values,
    dataStatus,
    updatedAt: String(row.updatedAt ?? fallback.updatedAt),
    hideUntilData: Boolean(row.hideUntilData ?? fallback.hideUntilData),
    source: asSource(row.source, fallback.source),
  };
}

function filled<T>(items: unknown, fallback: T[]): T[] {
  return Array.isArray(items) && items.length ? (items as T[]) : fallback;
}

function sourceFromLib(source: (typeof HOTEL_SEO_SOURCES)[keyof typeof HOTEL_SEO_SOURCES]): CmsSeoSource {
  return { ...source };
}

export function serializeHotelSeoPageBody(content: CmsHotelSeoPage) {
  return JSON.stringify({ ...content, version: 1, template: HOTEL_SEO_CMS_TEMPLATE });
}

export function isHotelSeoCmsBody(body: string) {
  try {
    const parsed = JSON.parse(body) as { template?: string };
    return parsed?.template === HOTEL_SEO_CMS_TEMPLATE;
  } catch {
    return false;
  }
}

export function parseHotelSeoPageBody(body: string, locale: Locale = "th"): CmsHotelSeoPage | null {
  if (!isHotelSeoCmsBody(body)) return null;
  try {
    const parsed = JSON.parse(body) as CmsHotelSeoPage;
    const empty = emptyHotelSeoCms();
    const formDefaults = defaultHotelSeoFormCopy(locale);
    const checklist = defaultHotelSeoChecklist(locale);
    const kpiDefaults = defaultHotelSeoKpis(locale);
    return {
      ...empty,
      ...parsed,
      version: 1,
      template: HOTEL_SEO_CMS_TEMPLATE,
      hero: {
        ...empty.hero,
        ...parsed.hero,
        points: asStringList(parsed.hero?.points, empty.hero.points),
        primaryCta: { ...emptyCta(), ...(parsed.hero?.primaryCta ?? {}) },
        secondaryCta: { ...emptyCta(), ...(parsed.hero?.secondaryCta ?? {}) },
        visual: asVisual(parsed.hero?.visual, empty.hero.visual),
      },
      search: {
        ...empty.search,
        ...parsed.search,
        types: filled(parsed.search?.types, defaultHotelSeoBehaviorTypes(locale)),
        map: asStringList(parsed.search?.map, HOTEL_SEO_BEHAVIOR_MAP.map((item) => pick(locale, item.th, item.en))),
        aiModeSource: asSource(parsed.search?.aiModeSource, sourceFromLib(HOTEL_SEO_SOURCES.aiModeTh)),
        growthSource: asSource(parsed.search?.growthSource, sourceFromLib(HOTEL_SEO_SOURCES.searchIo)),
        mapsSource: asSource(parsed.search?.mapsSource, sourceFromLib(HOTEL_SEO_SOURCES.localRank)),
        aiNoteSource: asSource(parsed.search?.aiNoteSource, sourceFromLib(HOTEL_SEO_SOURCES.aiFeatures)),
        visual: asVisual(parsed.search?.visual, empty.search.visual),
      },
      compare: {
        ...empty.compare,
        ...parsed.compare,
        visual: asVisual(parsed.compare?.visual, sampleSeoVisual(
          locale === "th" ? HOTEL_SEO_COMPARE_VISUAL.label.th : HOTEL_SEO_COMPARE_VISUAL.label.en,
          HOTEL_SEO_COMPARE_VISUAL.alt.th,
          HOTEL_SEO_COMPARE_VISUAL.alt.en,
          locale === "th" ? HOTEL_SEO_COMPARE_VISUAL.caption.th : HOTEL_SEO_COMPARE_VISUAL.caption.en,
        )),
        rows: filled(parsed.compare?.rows, defaultHotelSeoCompareRows(locale)),
      },
      problems: {
        ...empty.problems,
        ...parsed.problems,
        visual: asVisual(parsed.problems?.visual, empty.problems.visual),
        items: filled(parsed.problems?.items, defaultHotelSeoProblemRows(locale)),
      },
      help: {
        ...empty.help,
        ...parsed.help,
        visual: asVisual(parsed.help?.visual, sampleSeoVisual(
          locale === "th" ? HOTEL_SEO_FLOW_VISUAL.label.th : HOTEL_SEO_FLOW_VISUAL.label.en,
          HOTEL_SEO_FLOW_VISUAL.alt.th,
          HOTEL_SEO_FLOW_VISUAL.alt.en,
          locale === "th" ? HOTEL_SEO_FLOW_VISUAL.caption.th : HOTEL_SEO_FLOW_VISUAL.caption.en,
        )),
        stages: filled(parsed.help?.stages, defaultHotelSeoFlowStages(locale)),
        steps: filled(parsed.help?.steps, defaultHotelSeoHelpSteps(locale)),
        boundary: (() => {
          const fallback = defaultHotelSeoBoundary(locale);
          const next = parsed.help?.boundary;
          return {
            ...fallback,
            ...(next ?? {}),
            support: asStringList(next?.support, fallback.support),
            approve: asStringList(next?.approve, fallback.approve),
          };
        })(),
      },
      gbp: {
        ...empty.gbp,
        ...parsed.gbp,
        source: asSource(parsed.gbp?.source, sourceFromLib(HOTEL_SEO_SOURCES.localRank)),
        visual: asVisual(parsed.gbp?.visual, empty.gbp.visual),
        fields: filled(parsed.gbp?.fields, defaultHotelSeoGbpFields(locale)),
        actions: filled(parsed.gbp?.actions, defaultHotelSeoGbpActions(locale)),
      },
      method: {
        ...empty.method,
        ...parsed.method,
        visual: asVisual(parsed.method?.visual, sampleSeoVisual(
          locale === "th" ? HOTEL_SEO_PROCESS_VISUAL.label.th : HOTEL_SEO_PROCESS_VISUAL.label.en,
          HOTEL_SEO_PROCESS_VISUAL.alt.th,
          HOTEL_SEO_PROCESS_VISUAL.alt.en,
          locale === "th" ? HOTEL_SEO_PROCESS_VISUAL.caption.th : HOTEL_SEO_PROCESS_VISUAL.caption.en,
        )),
        steps: filled(parsed.method?.steps, defaultHotelSeoProcessSteps(locale)),
      },
      measure: {
        ...empty.measure,
        ...parsed.measure,
        visual: asVisual(parsed.measure?.visual, empty.measure.visual),
        kpis: Array.isArray(parsed.measure?.kpis) && parsed.measure.kpis.length
          ? parsed.measure.kpis.map((item, index) => asKpi(item, kpiDefaults[index] || kpiDefaults[0]))
          : kpiDefaults,
      },
      related: {
        ...empty.related,
        ...parsed.related,
        visual: asVisual(parsed.related?.visual, empty.related.visual),
        cards: filled(parsed.related?.cards, defaultHotelSeoRelatedCards(locale)),
      },
      form: {
        ...empty.form,
        ...formDefaults,
        ...parsed.form,
        receive: filled(parsed.form?.receive, formDefaults.receive),
        steps: asStringList(parsed.form?.steps, formDefaults.steps),
        labels: { ...emptyLabels(), ...formDefaults.labels, ...(parsed.form?.labels ?? {}) },
        visual: asVisual(parsed.form?.visual, empty.form.visual),
      },
      faqs: (() => {
        const fallback = hotelSeoFaqs(locale === "th" ? "th" : "en").map((item, index) => ({ id: `faq-${index + 1}`, ...item }));
        const items = Array.isArray(parsed.faqs) ? parsed.faqs : [];
        return !items.length || hotelSeoFaqsAreStale(items) ? fallback : items;
      })(),
      consistency: {
        title: parsed.consistency?.title || (locale === "th" ? "รายการตรวจความสอดคล้องของข้อมูล" : "Data consistency checklist"),
        note: parsed.consistency?.note || (locale === "th"
          ? "ตรวจ Search Console โปรไฟล์ Maps และหน้าเว็บจากข้อมูลชุดเดียวกัน ไม่ใช่ผลอันดับ"
          : "Review Search Console, the Maps profile, and the website from one set of facts. Not a ranking result"),
        gsc: filled(parsed.consistency?.gsc, checklist.gsc),
        listing: filled(parsed.consistency?.listing, checklist.listing),
      },
      seo: {
        social: asVisual(parsed.seo?.social, empty.seo.social),
        canonical: String(parsed.seo?.canonical ?? ""),
      },
    };
  } catch {
    return null;
  }
}

function walkStrings(value: unknown, visit: (text: string) => void) {
  if (typeof value === "string") visit(value);
  else if (Array.isArray(value)) value.forEach((item) => walkStrings(item, visit));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => walkStrings(item, visit));
}

function looksLikeGuaranteeClaim(text: string) {
  const value = text.trim();
  if (!value) return false;
  if (/ไม่รับประกัน|ไม่ได้ถูกรับประกัน|ไม่ได้รับประกัน|does not guarantee|not guaranteed|appearance is not guaranteed/i.test(value)) {
    return false;
  }
  return /รับประกันอันดับ|รับประกันการแสดงผล|รับประกันตำแหน่ง|guarantee[sd]?\s+(a\s+)?(maps\s+)?rank|guarantee[sd]?\s+(an?\s+)?(ai\s+)?(search\s+)?appearance/i.test(
    value,
  );
}

function sourceNeedsCitation(source: CmsSeoSource, hasFact: boolean) {
  if (!hasFact) return false;
  if (!source.name.trim() || !source.url.trim()) return true;
  if (!CTA_RE.test(source.url.trim()) && !/^https?:\/\//i.test(source.url.trim())) return true;
  return false;
}

export function validateHotelSeoPage(
  content: CmsHotelSeoPage,
  intent: SeoCmsIntent,
  meta?: { seoTitle?: string; metaDescription?: string },
) {
  if (intent !== "publish") return null;
  if (!content.hero.title.trim() || !content.hero.description.trim()) return "required_fields";
  if (!meta?.seoTitle?.trim() || !meta?.metaDescription?.trim()) return "required_seo_meta";
  const ctas = [content.hero.primaryCta, content.hero.secondaryCta];
  if (ctas.some((cta) => cta.label.trim() && !CTA_RE.test(cta.href.trim()))) return "invalid_cta";
  if (content.seo.canonical.trim() && !CTA_RE.test(content.seo.canonical.trim())) return "invalid_cta";
  const visuals = [
    content.hero.visual,
    content.search.visual,
    content.compare.visual,
    content.problems.visual,
    content.help.visual,
    content.gbp.visual,
    content.method.visual,
    content.measure.visual,
    content.related.visual,
    content.form.visual,
    content.seo.social,
  ];
  for (const visual of visuals) {
    if (visual.src && (!visual.altTh.trim() || !visual.altEn.trim())) return "missing_alt";
    if (visual.src && visual.status === "placeholder") return "placeholder_status";
    if (visual.src && visual.status !== "sample" && visual.status !== "approved" && visual.status !== "real") {
      return "screenshot_approval";
    }
    if (visual.src && visual.containsGoogleBrand && !visual.brandNote.trim()) return "brand_note";
    if (visual.src && PLACEHOLDER_RE.test(`${visual.src} ${visual.label} ${visual.caption}`) && visual.status !== "sample") {
      return "placeholder_label";
    }
  }
  const factSources: Array<{ source: CmsSeoSource; hasFact: boolean }> = [
    { source: content.search.aiModeSource, hasFact: Boolean(content.search.aiBody.trim() || content.search.aiTitle.trim()) },
    { source: content.search.growthSource, hasFact: Boolean(content.search.growthStat.trim()) },
    { source: content.search.mapsSource, hasFact: Boolean(content.search.mapsBody.trim()) },
    { source: content.search.aiNoteSource, hasFact: Boolean(content.search.aiNote.trim()) },
    { source: content.gbp.source, hasFact: Boolean(content.gbp.body.trim() || content.gbp.rankNote.trim()) },
  ];
  for (const item of factSources) {
    if (sourceNeedsCitation(item.source, item.hasFact)) return "source_incomplete";
    if (item.hasFact && item.source.name.trim() && !(item.source.publishedAt.trim() || item.source.accessedAt.trim())) {
      return "source_dates";
    }
  }
  for (const kpi of content.measure.kpis) {
    if (kpi.hideUntilData || kpi.dataStatus === "draft") continue;
    const publicReady = kpi.dataStatus === "approved" || kpi.dataStatus === "anonymised" || kpi.dataStatus === "sample";
    const hasValue = Boolean(kpi.value.trim() || (kpi.labels.length && kpi.values.length));
    if (
      publicReady &&
      (!kpi.name.trim() ||
        !kpi.period.trim() ||
        !(kpi.unit.trim() || kpi.definition.trim()) ||
        !kpi.context.trim() ||
        !kpi.source.name.trim() ||
        !kpi.source.status)
    ) {
      return "kpi_incomplete";
    }
    if (publicReady && hasValue && kpi.dataStatus !== "sample" && !kpi.source.url.trim()) return "kpi_incomplete";
  }
  for (const faq of content.faqs) {
    if (!faq.q.trim() || !faq.a.trim()) return "empty_faq";
  }
  for (const card of content.related.cards) {
    if (card.title.trim() && card.href.trim() && !CTA_RE.test(card.href.trim())) return "invalid_cta";
    if (card.sourceName.trim() && card.sourceUrl.trim() && !CTA_RE.test(card.sourceUrl.trim())) return "invalid_cta";
  }
  let guarantee = false;
  walkStrings(content, (text) => {
    if (looksLikeGuaranteeClaim(text)) guarantee = true;
  });
  if (guarantee) return "guarantee_claim";
  let privateData = false;
  walkStrings(content, (text) => {
    if (EMAIL_RE.test(text) || PHONE_RE.test(text) || ACCOUNT_RE.test(text)) privateData = true;
  });
  if (privateData) return "private_data";
  return null;
}

export function seoCmsErrorMessage(code: string) {
  const table: Record<string, string> = {
    invalid_cta: "ลิงก์ปุ่มต้องเป็น /path, #anchor, mailto, tel หรือ http(s)",
    missing_alt: "รูปที่เผยแพร่ต้องมีคำอธิบายภาพภาษาไทยและภาษาอังกฤษ",
    placeholder_status: "เปลี่ยนสถานะรูปจาก Placeholder เป็น Sample หรือ Approved ก่อนเผยแพร่",
    placeholder_label: "อย่าเผยแพร่ข้อความ Placeholder ถ้าสถานะไม่ใช่ Sample",
    screenshot_approval: "ภาพหน้าจอจริงของ Search Console หรือ Google Business Profile ต้องมีสถานะ Approved หรือ Real ก่อนเผยแพร่ หรือตั้งเป็น Sample อย่างชัดเจน",
    kpi_incomplete: "KPI ที่เผยแพร่ต้องมีชื่อ ช่วงเวลา หน่วยหรือคำนิยาม บริบท/ตลาด แหล่งที่มา และสถานะข้อมูล",
    empty_faq: "คำถามและคำตอบใน FAQ ต้องไม่ว่างเมื่อเผยแพร่",
    brand_note: "รูปที่มีแบรนด์ Google หรือ Maps ต้องมีบันทึกการอนุญาตก่อนเผยแพร่",
    required_fields: "กรอกหัวข้อและคำอธิบายของส่วน Hero ก่อนเผยแพร่",
    required_seo_meta: "กรอก SEO title และ Meta description ก่อนเผยแพร่",
    invalid_image: "อัปโหลดได้เฉพาะ JPG PNG หรือ WEBP ขนาดไม่เกิน 5MB",
    missing: "ไม่พบหน้าเพจ",
    invalid_json: "ข้อมูลฟอร์มไม่ถูกต้อง",
    private_data: "ห้ามเผยแพร่อีเมล เบอร์โทร รหัสพร็อพเพอร์ตี้ Search Console หรือข้อมูลลูกค้า",
    source_incomplete: "ข้อเท็จจริงภายนอกต้องมีชื่อแหล่งที่มาและ URL ก่อนเผยแพร่",
    source_dates: "ข้อเท็จจริงที่อ้างแหล่งที่มาควรมีวันที่เผยแพร่หรือวันที่เข้าถึง",
    guarantee_claim: "ห้ามเผยแพร่ข้อความที่รับประกันอันดับหรือการแสดงผลใน AI Search",
  };
  return table[code] ?? "บันทึกไม่สำเร็จ";
}

export function editorStateFromHotelSeoDocument(input: {
  id: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  canonical?: string;
  locale: string;
  status: string;
  body: string;
  ogImage?: string;
}): SeoEditorState {
  const locale = (["th", "en", "ru", "zh"].includes(input.locale) ? input.locale : "th") as Locale;
  const content = parseHotelSeoPageBody(input.body, locale) ?? emptyHotelSeoCms();
  if (input.ogImage && !content.seo.social.src) content.seo.social = { ...content.seo.social, src: input.ogImage };
  if (input.canonical && !content.seo.canonical) content.seo.canonical = input.canonical;
  return {
    id: input.id,
    title: input.title,
    seoTitle: input.seoTitle,
    metaDescription: input.metaDescription,
    excerpt: input.excerpt,
    canonical: content.seo.canonical || input.canonical || "",
    locale: input.locale,
    status: input.status,
    content,
  };
}

export function isHotelSeoPageDocument(input: { slug: string; template: string }) {
  if (input.template === HOTEL_SEO_CMS_TEMPLATE) return true;
  return (
    input.slug === HOTEL_SEO_PAGE_SLUG ||
    input.slug === "en/solutions/hotel-seo-google-maps-ai-search" ||
    input.slug === "ru/solutions/hotel-seo-google-maps-ai-search" ||
    input.slug === "zh/solutions/hotel-seo-google-maps-ai-search"
  );
}

export function sampleSeoVisual(label: string, altTh: string, altEn: string, caption: string): CmsSeoVisual {
  return { src: "", altTh, altEn, status: "sample", label, caption, containsGoogleBrand: false, brandNote: "" };
}

export {
  HOTEL_SEO_HERO_VISUAL,
  HOTEL_SEO_BEHAVIOR_VISUAL,
  HOTEL_SEO_AUDIT_VISUAL,
  HOTEL_SEO_GBP_VISUAL,
  HOTEL_SEO_KPI_VISUAL,
  HOTEL_SEO_RELATED_VISUAL,
};
