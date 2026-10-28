import {
  DIRECT_BOOKING_AUDIT_ROWS,
  DIRECT_BOOKING_AUDIT_VISUAL,
  DIRECT_BOOKING_CONFIDENCE_VISUAL,
  DIRECT_BOOKING_DECISION_NOTE,
  DIRECT_BOOKING_DECISION_PATHS,
  DIRECT_BOOKING_DECISION_VISUAL,
  DIRECT_BOOKING_ENQUIRY_RECEIVE,
  DIRECT_BOOKING_ENQUIRY_VISUAL,
  DIRECT_BOOKING_FRAMEWORK,
  DIRECT_BOOKING_FRAMEWORK_BOUNDARY,
  DIRECT_BOOKING_FRAMEWORK_VISUAL,
  DIRECT_BOOKING_FRICTION_STAGES,
  DIRECT_BOOKING_FRICTION_VISUAL,
  DIRECT_BOOKING_HERO_VISUAL,
  DIRECT_BOOKING_KPI_SAMPLE,
  DIRECT_BOOKING_KPI_SERIES,
  DIRECT_BOOKING_KPIS,
  DIRECT_BOOKING_MEASURE_NOTE,
  DIRECT_BOOKING_MEASURE_STAGES,
  DIRECT_BOOKING_MEASURE_VISUAL,
  DIRECT_BOOKING_RELATED_VISUAL,
  DIRECT_BOOKING_SOURCES,
  DIRECT_BOOKING_WORKFLOW,
  DIRECT_BOOKING_WORKFLOW_VISUAL,
  directBookingEnquiryCopy,
  hotelDirectBookingFaqs,
  hotelDirectBookingFaqsAreStale,
  type DirectBookingAuditStatus,
  type DirectBookingFrictionTone,
  type DirectBookingFrictionTracking,
  type DirectBookingKpiStatus,
  type DirectBookingSourceStatus,
  type DirectBookingTrackingStatus,
  type DirectBookingVisualStatus,
} from "@/lib/direct-bookings";
import { pages, type Locale } from "@/lib/seo";

export const HOTEL_DIRECT_BOOKINGS_CMS_TEMPLATE = "hotel-direct-bookings";
export const HOTEL_DIRECT_BOOKINGS_PAGE_SLUG = "solutions/hotel-direct-bookings";
export const HOTEL_DIRECT_BOOKINGS_PAGE_ROUTE = "/solutions/hotel-direct-bookings";
export const DIRECT_BOOKING_CMS_INTENTS = ["save", "draft", "preview", "publish", "unpublish"] as const;
export type DirectBookingCmsIntent = (typeof DIRECT_BOOKING_CMS_INTENTS)[number];
export const DIRECT_BOOKING_CMS_VISUAL_STATUSES = ["replace", "sample", "approved", "placeholder", "real"] as const;
export const DIRECT_BOOKING_CMS_KPI_STATUSES = ["draft", "sample", "approved", "anonymised"] as const;
export const DIRECT_BOOKING_CMS_SOURCE_STATUSES = ["guidance", "sample", "approved"] as const;
export const DIRECT_BOOKING_CMS_TRACKING_STATUSES = ["supported", "not-configured", "pending-approval"] as const;
export const DIRECT_BOOKING_CMS_FRICTION_TONES = ["green", "yellow", "amber"] as const;
export const DIRECT_BOOKING_CMS_FRICTION_TRACKING = ["clear", "needs-review", "not-configured"] as const;
export const DIRECT_BOOKING_CMS_AUDIT_STATUSES = ["clear", "needs-review", "blocked", "not-configured"] as const;
export type DirectBookingCmsSaveResult =
  | { ok: true; id: string; intent: DirectBookingCmsIntent }
  | { ok: false; error: string };

export type CmsDirectBookingCta = { label: string; href: string };
export type CmsDirectBookingVisual = {
  src: string;
  altTh: string;
  altEn: string;
  status: DirectBookingVisualStatus;
  label: string;
  caption: string;
};
export type CmsDirectBookingFaq = { id: string; q: string; a: string; qEn: string; aEn: string };
export type CmsDirectBookingSource = {
  name: string;
  url: string;
  publishedAt: string;
  accessedAt: string;
  market: string;
  period: string;
  definition: string;
  status: DirectBookingSourceStatus | string;
};
export type CmsDirectBookingFrictionRow = {
  id: string;
  tone: DirectBookingFrictionTone | string;
  tracking: DirectBookingFrictionTracking | string;
  stage: string;
  friction: string;
  question: string;
  risk: string;
  inspect: string;
  output: string;
};
export type CmsDirectBookingFrameworkStep = {
  id: string;
  num: string;
  stage: string;
  title: string;
  input: string;
  action: string;
  output: string;
  approval: string;
  measure: string;
};
export type CmsDirectBookingBoundaryItem = { id: string; label: string };
export type CmsDirectBookingAuditRow = {
  id: string;
  group: string;
  item: string;
  status: DirectBookingAuditStatus | string;
  owner: string;
  note: string;
  action: string;
  lastReviewed: string;
};
export type CmsDirectBookingDecisionPath = {
  id: string;
  title: string;
  situation: string[];
  evidence: string;
  route: string;
  risk: string;
  next: string;
};
export type CmsDirectBookingWorkflowStep = {
  id: string;
  num: string;
  label: string;
  title: string;
  owner: string;
  input: string;
  action: string;
  output: string;
  approval: string;
  next: string;
};
export type CmsDirectBookingMeasureStage = {
  id: string;
  num: string;
  event: string;
  title: string;
  action: string;
  source: string;
  owner: string;
  conclude: string;
  tracking: DirectBookingTrackingStatus | string;
};
export type CmsDirectBookingKpi = {
  id: string;
  name: string;
  group: string;
  period: string;
  unit: string;
  definition: string;
  comparison: string;
  target: string;
  market: string;
  source: string;
  sourceUrl: string;
  value: string;
  labels: string[];
  values: number[];
  dataStatus: DirectBookingKpiStatus;
  hideUntilData: boolean;
  updatedAt: string;
  tone: "green" | "yellow" | "amber";
  order: number;
};
export type CmsDirectBookingRelatedCard = {
  id: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  featured: boolean;
  publicationApproved: boolean;
  order: number;
};
export type CmsDirectBookingFormReceive = { id: string; title: string; body: string };
export type CmsDirectBookingFormLabels = {
  name: string;
  business: string;
  contact: string;
  website: string;
  bookingEngine: string;
  goal: string;
  analytics: string;
  tracking: string;
  challenge: string;
  consent: string;
  privacy: string;
};
export type CmsDirectBookingSeoVariant = { locale: string; href: string };
export type CmsDirectBookingApprovals = {
  clientNames: boolean;
  projectNames: boolean;
  prices: boolean;
  bookingValues: boolean;
  logos: boolean;
};

export type CmsDirectBookingPage = {
  version: 1;
  template: typeof HOTEL_DIRECT_BOOKINGS_CMS_TEMPLATE;
  bilingualPublish: boolean;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    close: string;
    underCta: string;
    primaryCta: CmsDirectBookingCta;
    secondaryCta: CmsDirectBookingCta;
    visual: CmsDirectBookingVisual;
  };
  confidence: {
    title: string;
    body: string;
    study: string;
    evidence: string;
    visual: CmsDirectBookingVisual;
    sources: CmsDirectBookingSource[];
  };
  friction: { title: string; rows: CmsDirectBookingFrictionRow[]; visual: CmsDirectBookingVisual };
  framework: {
    title: string;
    steps: CmsDirectBookingFrameworkStep[];
    visual: CmsDirectBookingVisual;
    boundaryNote: string;
    supportTitle: string;
    hotelTitle: string;
    support: CmsDirectBookingBoundaryItem[];
    hotel: CmsDirectBookingBoundaryItem[];
  };
  audit: { title: string; lead: string; rows: CmsDirectBookingAuditRow[]; visual: CmsDirectBookingVisual };
  rebuild: {
    title: string;
    body: string;
    close: string;
    note: string;
    paths: CmsDirectBookingDecisionPath[];
    visual: CmsDirectBookingVisual;
  };
  workflow: { title: string; steps: CmsDirectBookingWorkflowStep[]; visual: CmsDirectBookingVisual };
  measure: {
    title: string;
    body: string;
    note: string;
    visual: CmsDirectBookingVisual;
    bookingEngineConfigured: boolean;
    trackingConfigured: boolean;
    boundary: string;
    stages: CmsDirectBookingMeasureStage[];
    kpis: CmsDirectBookingKpi[];
  };
  related: { title: string; visual: CmsDirectBookingVisual; cards: CmsDirectBookingRelatedCard[] };
  form: {
    kicker: string;
    title: string;
    body: string;
    submit: string;
    receiveTitle: string;
    receive: CmsDirectBookingFormReceive[];
    nextTitle: string;
    steps: string[];
    labels: CmsDirectBookingFormLabels;
    visual: CmsDirectBookingVisual;
  };
  faqs: CmsDirectBookingFaq[];
  seo: { social: CmsDirectBookingVisual; canonical: string; variants: CmsDirectBookingSeoVariant[] };
  approvals: CmsDirectBookingApprovals;
};

export type DirectBookingEditorState = {
  id: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  canonical: string;
  locale: string;
  status: string;
  content: CmsDirectBookingPage;
};

const PLACEHOLDER_RE = /placeholder|replace with verified|รอรูป|lorem ipsum/i;
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_RE = /(?:\+?\s*66|\b0)\s*\d(?:[\s.-]?\d){7,9}\b/;
const ACCOUNT_RE = /(?:property|account)\s*id|booking.?engine.?key|ua-\d|g-\d{6,}/i;
const CTA_RE = /^(#|\/|https?:\/\/|mailto:|tel:)/i;
const GUARANTEE_RE =
  /(การันตี|รับประกัน).{0,48}(อันดับ|ยอดจอง|รายได้|อัตราแปลง|conversion)|guarantee.{0,48}(rank|booking volume|revenue|conversion rate)/i;

function emptyVisual(): CmsDirectBookingVisual {
  return { src: "", altTh: "", altEn: "", status: "replace", label: "", caption: "" };
}
function emptyCta(): CmsDirectBookingCta {
  return { label: "", href: "/" };
}
function emptyApprovals(): CmsDirectBookingApprovals {
  return { clientNames: false, projectNames: false, prices: false, bookingValues: false, logos: false };
}
function emptyLabels(): CmsDirectBookingFormLabels {
  return {
    name: "",
    business: "",
    contact: "",
    website: "",
    bookingEngine: "",
    goal: "",
    analytics: "",
    tracking: "",
    challenge: "",
    consent: "",
    privacy: "",
  };
}

export function newDirectBookingItemId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeVisualStatus(value: unknown, fallback: DirectBookingVisualStatus): DirectBookingVisualStatus {
  if (value === "placeholder") return "replace";
  if (DIRECT_BOOKING_CMS_VISUAL_STATUSES.includes(value as DirectBookingVisualStatus)) return value as DirectBookingVisualStatus;
  return fallback === "placeholder" ? "replace" : fallback;
}

function sampleVisual(meta: {
  labelTh: string;
  labelEn: string;
  captionTh: string;
  captionEn: string;
  altTh: string;
  altEn: string;
  status: DirectBookingVisualStatus;
}): CmsDirectBookingVisual {
  return {
    src: "",
    altTh: meta.altTh,
    altEn: meta.altEn,
    status: meta.status,
    label: meta.labelTh,
    caption: meta.captionTh,
  };
}

function asVisual(value: unknown, fallback: CmsDirectBookingVisual): CmsDirectBookingVisual {
  const row = value && typeof value === "object" ? (value as Partial<CmsDirectBookingVisual>) : {};
  return {
    src: String(row.src ?? fallback.src),
    altTh: String(row.altTh ?? fallback.altTh),
    altEn: String(row.altEn ?? fallback.altEn),
    status: normalizeVisualStatus(row.status, fallback.status),
    label: String(row.label ?? fallback.label),
    caption: String(row.caption ?? fallback.caption),
  };
}

function asCta(value: unknown, fallback: CmsDirectBookingCta): CmsDirectBookingCta {
  const row = value && typeof value === "object" ? (value as Partial<CmsDirectBookingCta>) : {};
  return { label: String(row.label ?? fallback.label), href: String(row.href ?? fallback.href) };
}

function asSource(value: unknown): CmsDirectBookingSource {
  const row = value && typeof value === "object" ? (value as Partial<CmsDirectBookingSource>) : {};
  const status = DIRECT_BOOKING_CMS_SOURCE_STATUSES.includes(row.status as DirectBookingSourceStatus)
    ? (row.status as DirectBookingSourceStatus)
    : String(row.status ?? "guidance") || "guidance";
  return {
    name: String(row.name ?? ""),
    url: String(row.url ?? ""),
    publishedAt: String(row.publishedAt ?? ""),
    accessedAt: String(row.accessedAt ?? ""),
    market: String(row.market ?? ""),
    period: String(row.period ?? ""),
    definition: String(row.definition ?? ""),
    status,
  };
}

function asNumberList(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => Number(item)).filter((item) => Number.isFinite(item));
}

function asStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item)).filter((item) => item.trim());
}

function asFrictionRow(value: unknown, index: number): CmsDirectBookingFrictionRow {
  const row = value && typeof value === "object" ? (value as Partial<CmsDirectBookingFrictionRow>) : {};
  const known = DIRECT_BOOKING_FRICTION_STAGES[index];
  const tone = DIRECT_BOOKING_CMS_FRICTION_TONES.includes(row.tone as DirectBookingFrictionTone)
    ? (row.tone as DirectBookingFrictionTone)
    : known?.tone || "yellow";
  const tracking = DIRECT_BOOKING_CMS_FRICTION_TRACKING.includes(row.tracking as DirectBookingFrictionTracking)
    ? (row.tracking as DirectBookingFrictionTracking)
    : known?.tracking || "needs-review";
  return {
    id: String(row.id || known?.id || newDirectBookingItemId("friction")),
    tone,
    tracking,
    stage: String(row.stage ?? known?.stageTh ?? ""),
    friction: String(row.friction ?? known?.frictionTh ?? ""),
    question: String(row.question ?? known?.questionTh ?? ""),
    risk: String(row.risk ?? known?.riskTh ?? ""),
    inspect: String(row.inspect ?? known?.inspectTh ?? ""),
    output: String(row.output ?? known?.output ?? ""),
  };
}

function asFrameworkStep(value: unknown, index: number): CmsDirectBookingFrameworkStep {
  const row = value && typeof value === "object" ? (value as Partial<CmsDirectBookingFrameworkStep>) : {};
  const known = DIRECT_BOOKING_FRAMEWORK[index];
  return {
    id: String(row.id || known?.id || newDirectBookingItemId("framework")),
    num: String(row.num ?? known?.num ?? String(index + 1).padStart(2, "0")),
    stage: String(row.stage ?? known?.stage ?? ""),
    title: String(row.title ?? known?.titleTh ?? ""),
    input: String(row.input ?? known?.inputTh ?? ""),
    action: String(row.action ?? known?.actionTh ?? ""),
    output: String(row.output ?? known?.output ?? ""),
    approval: String(row.approval ?? known?.approvalTh ?? ""),
    measure: String(row.measure ?? known?.measureTh ?? ""),
  };
}

function asBoundaryItem(value: unknown, index: number, fallback: { th: string; en: string }[]): CmsDirectBookingBoundaryItem {
  if (typeof value === "string") {
    return { id: fallback[index] ? `bound-${index + 1}` : newDirectBookingItemId("bound"), label: value };
  }
  const row = value && typeof value === "object" ? (value as Partial<CmsDirectBookingBoundaryItem>) : {};
  return {
    id: String(row.id || `bound-${index + 1}`),
    label: String(row.label ?? fallback[index]?.th ?? ""),
  };
}

function asAuditRow(value: unknown, index: number): CmsDirectBookingAuditRow {
  const row = value && typeof value === "object" ? (value as Partial<CmsDirectBookingAuditRow>) : {};
  const known = DIRECT_BOOKING_AUDIT_ROWS[index];
  const status = DIRECT_BOOKING_CMS_AUDIT_STATUSES.includes(row.status as DirectBookingAuditStatus)
    ? (row.status as DirectBookingAuditStatus)
    : known?.status || "needs-review";
  return {
    id: String(row.id || known?.id || newDirectBookingItemId("audit")),
    group: String(row.group ?? known?.group ?? ""),
    item: String(row.item ?? known?.item ?? ""),
    status,
    owner: String(row.owner ?? known?.ownerTh ?? ""),
    note: String(row.note ?? known?.noteTh ?? ""),
    action: String(row.action ?? known?.actionTh ?? ""),
    lastReviewed: String(row.lastReviewed ?? known?.lastReviewed ?? ""),
  };
}

function asDecisionPath(value: unknown, index: number): CmsDirectBookingDecisionPath {
  const row = value && typeof value === "object" ? (value as Partial<CmsDirectBookingDecisionPath>) : {};
  const known = DIRECT_BOOKING_DECISION_PATHS[index];
  return {
    id: String(row.id || known?.id || newDirectBookingItemId("path")),
    title: String(row.title ?? known?.titleTh ?? ""),
    situation: asStrings(row.situation).length ? asStrings(row.situation) : known ? [...known.situationTh] : [],
    evidence: String(row.evidence ?? known?.evidenceTh ?? ""),
    route: String(row.route ?? known?.routeTh ?? ""),
    risk: String(row.risk ?? known?.riskTh ?? ""),
    next: String(row.next ?? known?.nextTh ?? ""),
  };
}

function asWorkflowStep(value: unknown, index: number): CmsDirectBookingWorkflowStep {
  const row = value && typeof value === "object" ? (value as Partial<CmsDirectBookingWorkflowStep>) : {};
  const known = DIRECT_BOOKING_WORKFLOW[index];
  return {
    id: String(row.id || known?.id || newDirectBookingItemId("step")),
    num: String(row.num ?? known?.num ?? String(index + 1).padStart(2, "0")),
    label: String(row.label ?? known?.label ?? ""),
    title: String(row.title ?? known?.titleTh ?? ""),
    owner: String(row.owner ?? known?.ownerTh ?? ""),
    input: String(row.input ?? known?.inputTh ?? ""),
    action: String(row.action ?? known?.actionTh ?? ""),
    output: String(row.output ?? known?.output ?? ""),
    approval: String(row.approval ?? known?.approvalTh ?? ""),
    next: String(row.next ?? known?.nextTh ?? ""),
  };
}

function asMeasureStage(value: unknown, index: number): CmsDirectBookingMeasureStage {
  const row = value && typeof value === "object" ? (value as Partial<CmsDirectBookingMeasureStage>) : {};
  const known = DIRECT_BOOKING_MEASURE_STAGES[index];
  const tracking = DIRECT_BOOKING_CMS_TRACKING_STATUSES.includes(row.tracking as DirectBookingTrackingStatus)
    ? (row.tracking as DirectBookingTrackingStatus)
    : known?.id === "complete"
      ? "not-configured"
      : "supported";
  return {
    id: String(row.id || known?.id || newDirectBookingItemId("stage")),
    num: String(row.num ?? known?.num ?? String(index + 1).padStart(2, "0")),
    event: String(row.event ?? known?.event ?? ""),
    title: String(row.title ?? known?.titleTh ?? ""),
    action: String(row.action ?? known?.actionTh ?? ""),
    source: String(row.source ?? known?.sourceTh ?? ""),
    owner: String(row.owner ?? known?.ownerTh ?? ""),
    conclude: String(row.conclude ?? known?.concludeTh ?? ""),
    tracking,
  };
}

function asKpi(value: unknown, index: number): CmsDirectBookingKpi {
  const row = value && typeof value === "object" ? (value as Partial<CmsDirectBookingKpi>) : {};
  const dataStatus = DIRECT_BOOKING_CMS_KPI_STATUSES.includes(row.dataStatus as DirectBookingKpiStatus)
    ? (row.dataStatus as DirectBookingKpiStatus)
    : "draft";
  const tone = row.tone === "yellow" || row.tone === "amber" ? row.tone : "green";
  const id = String(row.id || newDirectBookingItemId("kpi"));
  const known = DIRECT_BOOKING_KPIS.find((kpi) => kpi.id === id);
  const sample = DIRECT_BOOKING_KPI_SERIES.find((item) => item.id === id || item.group === (row.group || known?.group));
  return {
    id,
    name: String(row.name ?? known?.nameTh ?? ""),
    group: String(row.group ?? known?.group ?? ""),
    period: String(row.period ?? ""),
    unit: String(row.unit ?? known?.unit ?? ""),
    definition: String(row.definition ?? known?.definition ?? ""),
    comparison: String(row.comparison ?? ""),
    target: String(row.target ?? sample?.target ?? ""),
    market: String(row.market ?? ""),
    source: String(row.source ?? ""),
    sourceUrl: String(row.sourceUrl ?? ""),
    value: String(row.value ?? ""),
    labels: Array.isArray(row.labels) ? row.labels.map(String) : sample ? [...sample.labels] : [],
    values: asNumberList(row.values) || (sample ? [...sample.values] : []),
    dataStatus,
    hideUntilData: row.hideUntilData !== false,
    updatedAt: String(row.updatedAt ?? ""),
    tone,
    order: Number(row.order) || index + 1,
  };
}

function asCard(value: unknown, index: number): CmsDirectBookingRelatedCard {
  const row = value && typeof value === "object" ? (value as Partial<CmsDirectBookingRelatedCard>) : {};
  return {
    id: String(row.id || newDirectBookingItemId("card")),
    title: String(row.title ?? ""),
    body: String(row.body ?? ""),
    href: String(row.href ?? ""),
    cta: String(row.cta ?? ""),
    featured: Boolean(row.featured),
    publicationApproved: Boolean(row.publicationApproved),
    order: Number(row.order) || index + 1,
  };
}

function asReceive(value: unknown, index: number): CmsDirectBookingFormReceive {
  const row = value && typeof value === "object" ? (value as Partial<CmsDirectBookingFormReceive>) : {};
  const known = DIRECT_BOOKING_ENQUIRY_RECEIVE[index];
  return {
    id: String(row.id || known?.id || newDirectBookingItemId("recv")),
    title: String(row.title ?? known?.title ?? ""),
    body: String(row.body ?? known?.th ?? ""),
  };
}

function asFaq(value: unknown, index: number, faqsEn: { q: string; a: string }[]): CmsDirectBookingFaq {
  const row = value && typeof value === "object" ? (value as Partial<CmsDirectBookingFaq>) : {};
  return {
    id: String(row.id || `faq-${index + 1}`),
    q: String(row.q ?? ""),
    a: String(row.a ?? ""),
    qEn: String(row.qEn ?? faqsEn[index]?.q ?? ""),
    aEn: String(row.aEn ?? faqsEn[index]?.a ?? ""),
  };
}

function defaultSeoVariants(): CmsDirectBookingSeoVariant[] {
  return [
    { locale: "th", href: HOTEL_DIRECT_BOOKINGS_PAGE_ROUTE },
    { locale: "en", href: "/en/solutions/hotel-direct-bookings" },
    { locale: "ru", href: "/ru/solutions/hotel-direct-bookings" },
    { locale: "zh", href: "/zh/solutions/hotel-direct-bookings" },
  ];
}

function defaultSources(): CmsDirectBookingSource[] {
  return [DIRECT_BOOKING_SOURCES.googleIpsos, DIRECT_BOOKING_SOURCES.thaiCancellation].map((source) => ({
    name: source.name,
    url: source.url,
    publishedAt: source.publishedAt,
    accessedAt: source.accessedAt,
    market: source.market,
    period: source.period,
    definition: source.definition,
    status: source.status,
  }));
}

export function emptyDirectBookingCms(): CmsDirectBookingPage {
  return {
    version: 1,
    template: HOTEL_DIRECT_BOOKINGS_CMS_TEMPLATE,
    bilingualPublish: true,
    hero: {
      eyebrow: "",
      title: "",
      description: "",
      close: "",
      underCta: "",
      primaryCta: { label: "", href: "#conversion-enquiry" },
      secondaryCta: { label: "", href: "/solutions" },
      visual: emptyVisual(),
    },
    confidence: { title: "", body: "", study: "", evidence: "", visual: emptyVisual(), sources: [] },
    friction: { title: "", rows: [], visual: emptyVisual() },
    framework: {
      title: "",
      steps: [],
      visual: emptyVisual(),
      boundaryNote: "",
      supportTitle: "",
      hotelTitle: "",
      support: [],
      hotel: [],
    },
    audit: { title: "", lead: "", rows: [], visual: emptyVisual() },
    rebuild: { title: "", body: "", close: "", note: "", paths: [], visual: emptyVisual() },
    workflow: { title: "", steps: [], visual: emptyVisual() },
    measure: {
      title: "",
      body: "",
      note: "",
      visual: emptyVisual(),
      bookingEngineConfigured: false,
      trackingConfigured: false,
      boundary: "",
      stages: [],
      kpis: [],
    },
    related: { title: "", visual: emptyVisual(), cards: [] },
    form: {
      kicker: "",
      title: "",
      body: "",
      submit: "",
      receiveTitle: "",
      receive: [],
      nextTitle: "",
      steps: [],
      labels: emptyLabels(),
      visual: emptyVisual(),
    },
    faqs: [],
    seo: { social: emptyVisual(), canonical: HOTEL_DIRECT_BOOKINGS_PAGE_ROUTE, variants: defaultSeoVariants() },
    approvals: emptyApprovals(),
  };
}

export function defaultDirectBookingCms(locale: Locale = "th"): CmsDirectBookingPage {
  const thai = locale === "th";
  const faqs = hotelDirectBookingFaqs(thai ? "th" : "en");
  const faqsEn = hotelDirectBookingFaqs("en");
  const copy = directBookingEnquiryCopy(thai ? "th" : "en");
  return {
    version: 1,
    template: HOTEL_DIRECT_BOOKINGS_CMS_TEMPLATE,
    bilingualPublish: true,
    hero: {
      eyebrow: thai ? "เพิ่มการจองผ่านเว็บไซต์" : "Website Conversion & Direct Bookings",
      title: thai ? "มีคนเข้าเว็บไซต์แล้ว แต่เขาหยุดก่อนจองตรงไหน?" : "People reach the website. Where do they stop before a direct booking?",
      description: thai
        ? "โรงแรมอาจมีคนเข้าเว็บไซต์จาก SEO หรือโฆษณาแล้ว แต่ลูกค้ายังหยุดก่อนจอง จุดที่ทำให้หยุดอาจเป็น Message Match ข้อมูลห้องพัก ราคาและนโยบาย การใช้บนมือถือ การส่งต่อไป Booking Engine หรือการวัดผล"
        : "A hotel may already have website traffic from SEO or ads, yet guests still stop before they book. The gap may be Message Match, Room Information, Price and Policy, Mobile UX, Booking Engine handoff, or tracking.",
      close: thai
        ? "เดอะ เคพีไอ พลัส ตรวจเส้นทางตั้งแต่ค้นพบโรงแรมจนถึงจองตรง แล้วสรุปจุดที่ควรปรับเป็นรายการใช้งาน พร้อมขอบเขตการวัดผลที่ระบบรองรับจริง"
        : "The KPI Plus reviews the complete path from discovery to direct booking, then gives the hotel team a practical list of changes and the measurement boundaries the systems can actually support.",
      underCta: thai ? "ส่งลิงก์เว็บไซต์และหน้าจอง พร้อมบอกจุดที่กังวล" : "Send the website and booking-page links, plus the step that worries you.",
      primaryCta: { label: thai ? "ขอให้ทีมตรวจเว็บไซต์เพื่อการจองตรง" : "Request a direct-booking website review", href: "#conversion-enquiry" },
      secondaryCta: { label: thai ? "ดูโซลูชันทั้งหมด" : "All solutions", href: "/solutions" },
      visual: sampleVisual(DIRECT_BOOKING_HERO_VISUAL),
    },
    confidence: {
      title: thai ? "ลูกค้ายังเปลี่ยนใจได้จนกว่าจะจองสำเร็จ" : "Guests can still change their mind until the booking is complete",
      body: thai
        ? "งานสำรวจ Google/Ipsos ในหลายตลาดเอเชียแปซิฟิกพบว่า ผู้เดินทางที่สำรวจในประเทศไทยและอินเดียเกือบ 4 ใน 5 เปลี่ยนตัวเลือกด้านการเดินทางก่อนจอง"
        : "A Google/Ipsos study across several Asia-Pacific markets found that almost four in five surveyed travellers in Thailand and India change a travel choice before they book.",
      study: thai ? DIRECT_BOOKING_SOURCES.thaiCancellation.definitionTh : DIRECT_BOOKING_SOURCES.thaiCancellation.definition,
      evidence: thai
        ? "ตัวเลขนี้เป็นบริบทจากงานวิจัย ไม่ใช่ผลที่บริการนี้หรือการแก้เว็บไซต์การันตี"
        : "This figure is research context, not a guaranteed result from this service or from a website change.",
      visual: sampleVisual(DIRECT_BOOKING_CONFIDENCE_VISUAL),
      sources: defaultSources(),
    },
    friction: {
      title: thai ? "จุดที่มักทำให้ลูกค้าหยุดก่อนจอง" : "Where guests often stop before they book",
      rows: DIRECT_BOOKING_FRICTION_STAGES.map((stage) => ({
        id: stage.id,
        tone: stage.tone,
        tracking: stage.tracking,
        stage: thai ? stage.stageTh : stage.stageEn,
        friction: thai ? stage.frictionTh : stage.frictionEn,
        question: thai ? stage.questionTh : stage.questionEn,
        risk: thai ? stage.riskTh : stage.riskEn,
        inspect: thai ? stage.inspectTh : stage.inspectEn,
        output: stage.output,
      })),
      visual: sampleVisual(DIRECT_BOOKING_FRICTION_VISUAL),
    },
    framework: {
      title: thai ? "เดอะ เคพีไอ พลัส ช่วยปรับอะไร?" : "What The KPI Plus adjusts",
      steps: DIRECT_BOOKING_FRAMEWORK.map((step) => ({
        id: step.id,
        num: step.num,
        stage: step.stage,
        title: thai ? step.titleTh : step.titleEn,
        input: thai ? step.inputTh : step.inputEn,
        action: thai ? step.actionTh : step.actionEn,
        output: step.output,
        approval: thai ? step.approvalTh : step.approvalEn,
        measure: thai ? step.measureTh : step.measureEn,
      })),
      visual: sampleVisual(DIRECT_BOOKING_FRAMEWORK_VISUAL),
      boundaryNote: thai ? DIRECT_BOOKING_FRAMEWORK_BOUNDARY.note.th : DIRECT_BOOKING_FRAMEWORK_BOUNDARY.note.en,
      supportTitle: thai ? DIRECT_BOOKING_FRAMEWORK_BOUNDARY.supportTitle.th : DIRECT_BOOKING_FRAMEWORK_BOUNDARY.supportTitle.en,
      hotelTitle: thai ? DIRECT_BOOKING_FRAMEWORK_BOUNDARY.hotelTitle.th : DIRECT_BOOKING_FRAMEWORK_BOUNDARY.hotelTitle.en,
      support: DIRECT_BOOKING_FRAMEWORK_BOUNDARY.support.map((item, index) => ({
        id: `support-${index + 1}`,
        label: thai ? item.th : item.en,
      })),
      hotel: DIRECT_BOOKING_FRAMEWORK_BOUNDARY.hotel.map((item, index) => ({
        id: `hotel-${index + 1}`,
        label: thai ? item.th : item.en,
      })),
    },
    audit: {
      title: thai ? "รายการตรวจ Friction Audit" : "Friction Audit Checklist",
      lead: thai
        ? "รายการนี้ให้ทีมโรงแรมไล่จุดที่มักทำให้ลูกค้าหยุดก่อนจอง สถานะเป็นตัวอย่าง ไม่ได้ตรวจอัตโนมัติทุกข้อ และไม่ใช่ผลโรงแรมจริง"
        : "A working list for the hotel team. Sample status only. Items are not automatically checked, and this is not a live hotel audit.",
      rows: DIRECT_BOOKING_AUDIT_ROWS.map((row) => ({
        id: row.id,
        group: row.group,
        item: thai ? row.itemTh : row.item,
        status: row.status,
        owner: thai ? row.ownerTh : row.ownerEn,
        note: thai ? row.noteTh : row.noteEn,
        action: thai ? row.actionTh : row.actionEn,
        lastReviewed: row.lastReviewed,
      })),
      visual: sampleVisual(DIRECT_BOOKING_AUDIT_VISUAL),
    },
    rebuild: {
      title: thai ? "งานนี้ต่างจากการสร้างเว็บไซต์ใหม่อย่างไร?" : "How is this different from building a new website?",
      body: thai
        ? "บริการนี้เริ่มจากเว็บไซต์ปัจจุบันและเส้นทางลูกค้าที่ใช้จริง เพื่อหาจุดที่ลูกค้าหยุด แล้วปรับระบบเดิมเมื่อแก้ไขได้อย่างปลอดภัย จะเสนอสร้างใหม่เฉพาะเมื่อแพลตฟอร์ม สถาปัตยกรรม กรรมสิทธิ์ ความปลอดภัย หรือการเชื่อมระบบจำกัดการแก้ไข"
        : "This work starts from the current website and the actual customer path. We identify the point where users stop, then improve the existing system when it can be fixed safely. A rebuild is recommended only when platform, architecture, ownership, security, or integration constraints require it.",
      close: thai
        ? "การเลือกปรับหรือสร้างใหม่ขึ้นกับหลักฐานจากเว็บไซต์และระบบจองที่มี"
        : "The choice depends on evidence from the current website and booking engine.",
      note: thai ? DIRECT_BOOKING_DECISION_NOTE.th : DIRECT_BOOKING_DECISION_NOTE.en,
      paths: DIRECT_BOOKING_DECISION_PATHS.map((path) => ({
        id: path.id,
        title: thai ? path.titleTh : path.titleEn,
        situation: [...(thai ? path.situationTh : path.situationEn)],
        evidence: thai ? path.evidenceTh : path.evidenceEn,
        route: thai ? path.routeTh : path.routeEn,
        risk: thai ? path.riskTh : path.riskEn,
        next: thai ? path.nextTh : path.nextEn,
      })),
      visual: sampleVisual(DIRECT_BOOKING_DECISION_VISUAL),
    },
    workflow: {
      title: thai ? "วิธีทำงาน" : "How the work runs",
      steps: DIRECT_BOOKING_WORKFLOW.map((step) => ({
        id: step.id,
        num: step.num,
        label: step.label,
        title: thai ? step.titleTh : step.titleEn,
        owner: thai ? step.ownerTh : step.ownerEn,
        input: thai ? step.inputTh : step.inputEn,
        action: thai ? step.actionTh : step.actionEn,
        output: step.output,
        approval: thai ? step.approvalTh : step.approvalEn,
        next: thai ? step.nextTh : step.nextEn,
      })),
      visual: sampleVisual(DIRECT_BOOKING_WORKFLOW_VISUAL),
    },
    measure: {
      title: thai ? "เราวัดผลเป็นขั้น ไม่เหมารวมว่าทุกคลิกคือยอดจอง" : "We measure in steps. Not every click is a booking.",
      body: thai ? DIRECT_BOOKING_MEASURE_NOTE.th : DIRECT_BOOKING_MEASURE_NOTE.en,
      note: thai ? DIRECT_BOOKING_MEASURE_NOTE.th : DIRECT_BOOKING_MEASURE_NOTE.en,
      visual: sampleVisual(DIRECT_BOOKING_MEASURE_VISUAL),
      bookingEngineConfigured: false,
      trackingConfigured: false,
      boundary: thai
        ? "ยังไม่ตั้งค่าการวัดผล · วัดได้ถึงขั้นเริ่มจอง จนกว่าจะมีแหล่ง Booking Complete ที่ตรวจสอบได้"
        : "Tracking not configured · Booking start only until a verifiable Booking Complete source exists",
      stages: DIRECT_BOOKING_MEASURE_STAGES.map((stage) => ({
        id: stage.id,
        num: stage.num,
        event: stage.event,
        title: thai ? stage.titleTh : stage.titleEn,
        action: thai ? stage.actionTh : stage.actionEn,
        source: thai ? stage.sourceTh : stage.sourceEn,
        owner: thai ? stage.ownerTh : stage.ownerEn,
        conclude: thai ? stage.concludeTh : stage.concludeEn,
        tracking: stage.id === "complete" ? "not-configured" : "supported",
      })),
      kpis: DIRECT_BOOKING_KPIS.map((kpi, index) => {
        const sample = DIRECT_BOOKING_KPI_SERIES.find((item) => item.id === kpi.id || item.group === kpi.group);
        return {
          id: kpi.id,
          name: thai ? kpi.nameTh : kpi.nameEn,
          group: kpi.group,
          period: thai ? DIRECT_BOOKING_KPI_SAMPLE.periodTh : DIRECT_BOOKING_KPI_SAMPLE.period,
          unit: thai ? kpi.unitTh : kpi.unit,
          definition: thai ? kpi.definitionTh : kpi.definition,
          comparison: thai ? DIRECT_BOOKING_KPI_SAMPLE.comparisonTh : DIRECT_BOOKING_KPI_SAMPLE.comparison,
          target: sample?.target ?? "",
          market: thai ? DIRECT_BOOKING_KPI_SAMPLE.marketTh : DIRECT_BOOKING_KPI_SAMPLE.market,
          source: thai ? DIRECT_BOOKING_KPI_SAMPLE.sourceTh : DIRECT_BOOKING_KPI_SAMPLE.source,
          sourceUrl: "",
          value: "",
          labels: sample ? [...sample.labels] : [],
          values: sample ? [...sample.values] : [],
          dataStatus: kpi.dataStatus,
          hideUntilData: kpi.hideUntilData,
          updatedAt: DIRECT_BOOKING_KPI_SAMPLE.updatedAt,
          tone: kpi.tone,
          order: index + 1,
        };
      }),
    },
    related: {
      title: thai ? "เรื่องที่เกี่ยวข้องกับเว็บไซต์และการจองตรง" : "Related reading on the website and direct booking",
      visual: sampleVisual(DIRECT_BOOKING_RELATED_VISUAL),
      cards: [
        {
          id: "search-health",
          title: thai ? "ตรวจสุขภาพการค้นหาเว็บไซต์" : "Hotel searchability check",
          body: thai
            ? "ดูว่าหน้าเว็บพร้อมให้ลูกค้าหาข้อมูลห้องพักและเดินทางไปจองต่อหรือไม่ ไม่ใช่ผลอันดับหรือยอดจอง"
            : "See whether the pages are ready for a guest to find room facts and continue toward a booking. Not a ranking or booking result.",
          href: "/tools/hotel-searchability-check",
          cta: thai ? "ใช้เครื่องมือฟรี" : "Use the free tool",
          featured: true,
          publicationApproved: true,
          order: 1,
        },
        {
          id: "website-design",
          title: thai ? "ออกแบบเว็บไซต์โรงแรม" : "Hotel website design",
          body: thai
            ? "ดูหน้า Room Detail, เส้นทางมือถือ และเนื้อหาที่ลูกค้าใช้ก่อนจอง หากโครงสร้างเดิมจำกัดการแก้ไข อาจเป็นงานถัดไป"
            : "Review the Room Detail Page, mobile conversion path, and the facts guests need before they book.",
          href: "/solutions/hotel-website-design",
          cta: thai ? "ดูโซลูชัน" : "View solution",
          featured: false,
          publicationApproved: true,
          order: 2,
        },
      ],
    },
    form: {
      kicker: copy.kicker,
      title: copy.heading,
      body: copy.lead,
      submit: copy.submit,
      receiveTitle: copy.receiveTitle,
      receive: DIRECT_BOOKING_ENQUIRY_RECEIVE.map((item) => ({
        id: item.id,
        title: item.title,
        body: thai ? item.th : item.en,
      })),
      nextTitle: copy.nextTitle,
      steps: [...copy.steps],
      labels: {
        name: copy.labels.name,
        business: copy.labels.business,
        contact: copy.labels.contact,
        website: copy.fields.website,
        bookingEngine: copy.fields.bookingEngine,
        goal: copy.fields.goal,
        analytics: copy.fields.analytics,
        tracking: copy.fields.tracking,
        challenge: copy.fields.concern,
        consent: copy.labels.consent,
        privacy: copy.labels.privacy,
      },
      visual: sampleVisual(DIRECT_BOOKING_ENQUIRY_VISUAL),
    },
    faqs: faqs.map((item, index) => ({
      id: `faq-${index + 1}`,
      q: item.q,
      a: item.a,
      qEn: faqsEn[index]?.q || "",
      aEn: faqsEn[index]?.a || "",
    })),
    seo: { social: emptyVisual(), canonical: HOTEL_DIRECT_BOOKINGS_PAGE_ROUTE, variants: defaultSeoVariants() },
    approvals: emptyApprovals(),
  };
}

export function parseDirectBookingPageBody(body: string, locale: Locale = "th"): CmsDirectBookingPage | null {
  try {
    const parsed = JSON.parse(body) as Partial<CmsDirectBookingPage> & { template?: string };
    if (parsed?.template && parsed.template !== HOTEL_DIRECT_BOOKINGS_CMS_TEMPLATE) return null;
    const fallback = emptyDirectBookingCms();
    const seeded = defaultDirectBookingCms(locale);
    const faqsEn = hotelDirectBookingFaqs("en");
    const hero = parsed.hero ?? fallback.hero;
    const confidence = parsed.confidence ?? fallback.confidence;
    const friction = parsed.friction ?? seeded.friction;
    const framework = parsed.framework ?? seeded.framework;
    const audit = parsed.audit ?? seeded.audit;
    const rebuild = parsed.rebuild ?? seeded.rebuild;
    const workflow = parsed.workflow ?? seeded.workflow;
    const measure = parsed.measure ?? seeded.measure;
    const related = parsed.related ?? seeded.related;
    const form = parsed.form ?? seeded.form;
    const faqItems = Array.isArray(parsed.faqs) ? parsed.faqs.map((item, index) => asFaq(item, index, faqsEn)) : [];
    const measureFlags = measure as CmsDirectBookingPage["measure"] & {
      tracking?: { bookingEngineConfigured?: boolean; trackingConfigured?: boolean; boundary?: string };
    };
    return {
      version: 1,
      template: HOTEL_DIRECT_BOOKINGS_CMS_TEMPLATE,
      bilingualPublish: parsed.bilingualPublish !== false,
      hero: {
        eyebrow: String(hero.eyebrow ?? ""),
        title: String(hero.title ?? ""),
        description: String(hero.description ?? ""),
        close: String(hero.close ?? ""),
        underCta: String(hero.underCta ?? ""),
        primaryCta: asCta(hero.primaryCta, { label: "", href: "#conversion-enquiry" }),
        secondaryCta: asCta(hero.secondaryCta, { label: "", href: "/solutions" }),
        visual: asVisual(hero.visual, fallback.hero.visual),
      },
      confidence: {
        title: String(confidence.title ?? ""),
        body: String(confidence.body ?? ""),
        study: String(confidence.study ?? ""),
        evidence: String(confidence.evidence ?? ""),
        visual: asVisual(confidence.visual, fallback.confidence.visual),
        sources: Array.isArray(confidence.sources) && confidence.sources.length ? confidence.sources.map(asSource) : seeded.confidence.sources,
      },
      friction: {
        title: String(friction.title ?? seeded.friction.title),
        rows: Array.isArray(friction.rows) && friction.rows.length ? friction.rows.map(asFrictionRow) : seeded.friction.rows,
        visual: asVisual(friction.visual, seeded.friction.visual),
      },
      framework: {
        title: String(framework.title ?? seeded.framework.title),
        steps: Array.isArray(framework.steps) && framework.steps.length ? framework.steps.map(asFrameworkStep) : seeded.framework.steps,
        visual: asVisual(framework.visual, seeded.framework.visual),
        boundaryNote: String(framework.boundaryNote ?? seeded.framework.boundaryNote),
        supportTitle: String(framework.supportTitle ?? seeded.framework.supportTitle),
        hotelTitle: String(framework.hotelTitle ?? seeded.framework.hotelTitle),
        support:
          Array.isArray(framework.support) && framework.support.length
            ? framework.support.map((item, index) => asBoundaryItem(item, index, [...DIRECT_BOOKING_FRAMEWORK_BOUNDARY.support]))
            : seeded.framework.support,
        hotel:
          Array.isArray(framework.hotel) && framework.hotel.length
            ? framework.hotel.map((item, index) => asBoundaryItem(item, index, [...DIRECT_BOOKING_FRAMEWORK_BOUNDARY.hotel]))
            : seeded.framework.hotel,
      },
      audit: {
        title: String(audit.title ?? seeded.audit.title),
        lead: String(audit.lead ?? seeded.audit.lead),
        rows: Array.isArray(audit.rows) && audit.rows.length ? audit.rows.map(asAuditRow) : seeded.audit.rows,
        visual: asVisual(audit.visual, seeded.audit.visual),
      },
      rebuild: {
        title: String(rebuild.title ?? seeded.rebuild.title),
        body: String(rebuild.body ?? seeded.rebuild.body),
        close: String(rebuild.close ?? seeded.rebuild.close),
        note: String(rebuild.note ?? seeded.rebuild.note),
        paths: Array.isArray(rebuild.paths) && rebuild.paths.length ? rebuild.paths.map(asDecisionPath) : seeded.rebuild.paths,
        visual: asVisual(rebuild.visual, seeded.rebuild.visual),
      },
      workflow: {
        title: String(workflow.title ?? seeded.workflow.title),
        steps: Array.isArray(workflow.steps) && workflow.steps.length ? workflow.steps.map(asWorkflowStep) : seeded.workflow.steps,
        visual: asVisual(workflow.visual, seeded.workflow.visual),
      },
      measure: {
        title: String(measure.title ?? seeded.measure.title),
        body: String(measure.body ?? seeded.measure.body),
        note: String(measure.note ?? seeded.measure.note),
        visual: asVisual(measure.visual, seeded.measure.visual),
        bookingEngineConfigured: Boolean(measureFlags.bookingEngineConfigured || measureFlags.tracking?.bookingEngineConfigured),
        trackingConfigured: Boolean(measureFlags.trackingConfigured || measureFlags.tracking?.trackingConfigured),
        boundary: String(measure.boundary ?? measureFlags.tracking?.boundary ?? seeded.measure.boundary),
        stages: Array.isArray(measure.stages) && measure.stages.length ? measure.stages.map(asMeasureStage) : seeded.measure.stages,
        kpis: Array.isArray(measure.kpis) && measure.kpis.length ? measure.kpis.map(asKpi) : seeded.measure.kpis,
      },
      related: {
        title: String(related.title ?? seeded.related.title),
        visual: asVisual(related.visual, seeded.related.visual),
        cards: Array.isArray(related.cards) && related.cards.length ? related.cards.map(asCard) : seeded.related.cards,
      },
      form: {
        kicker: String(form.kicker ?? seeded.form.kicker),
        title: String(form.title ?? seeded.form.title),
        body: String(form.body ?? seeded.form.body),
        submit: String(form.submit ?? seeded.form.submit),
        receiveTitle: String(form.receiveTitle ?? seeded.form.receiveTitle),
        receive: Array.isArray(form.receive) && form.receive.length ? form.receive.map(asReceive) : seeded.form.receive,
        nextTitle: String(form.nextTitle ?? seeded.form.nextTitle),
        steps: asStrings(form.steps).length ? asStrings(form.steps) : seeded.form.steps,
        labels: {
          name: String(form.labels?.name ?? seeded.form.labels.name),
          business: String(form.labels?.business ?? seeded.form.labels.business),
          contact: String(form.labels?.contact ?? seeded.form.labels.contact),
          website: String(form.labels?.website ?? seeded.form.labels.website),
          bookingEngine: String(form.labels?.bookingEngine ?? seeded.form.labels.bookingEngine),
          goal: String(form.labels?.goal ?? seeded.form.labels.goal),
          analytics: String(form.labels?.analytics ?? seeded.form.labels.analytics),
          tracking: String(form.labels?.tracking ?? seeded.form.labels.tracking),
          challenge: String(form.labels?.challenge ?? seeded.form.labels.challenge),
          consent: String(form.labels?.consent ?? seeded.form.labels.consent),
          privacy: String(form.labels?.privacy ?? seeded.form.labels.privacy),
        },
        visual: asVisual(form.visual, seeded.form.visual),
      },
      faqs: !faqItems.length || hotelDirectBookingFaqsAreStale(faqItems) ? seeded.faqs : faqItems,
      seo: {
        social: asVisual(parsed.seo?.social, fallback.seo.social),
        canonical: String(parsed.seo?.canonical ?? HOTEL_DIRECT_BOOKINGS_PAGE_ROUTE),
        variants: Array.isArray(parsed.seo?.variants) && parsed.seo.variants.length
          ? parsed.seo.variants.map((item) => ({ locale: String(item.locale ?? ""), href: String(item.href ?? "") }))
          : defaultSeoVariants(),
      },
      approvals: {
        clientNames: Boolean(parsed.approvals?.clientNames),
        projectNames: Boolean(parsed.approvals?.projectNames),
        prices: Boolean(parsed.approvals?.prices),
        bookingValues: Boolean(parsed.approvals?.bookingValues),
        logos: Boolean(parsed.approvals?.logos),
      },
    };
  } catch {
    return null;
  }
}

export function serializeDirectBookingPageBody(content: CmsDirectBookingPage) {
  return JSON.stringify({ ...content, version: 1, template: HOTEL_DIRECT_BOOKINGS_CMS_TEMPLATE });
}

export function isDirectBookingCmsBody(body: string) {
  try {
    const parsed = JSON.parse(body) as { template?: string };
    return parsed?.template === HOTEL_DIRECT_BOOKINGS_CMS_TEMPLATE;
  } catch {
    return false;
  }
}

export function isHotelDirectBookingsPageDocument(input: { slug: string; template: string }) {
  if (input.template === HOTEL_DIRECT_BOOKINGS_CMS_TEMPLATE) return true;
  return (
    input.slug === HOTEL_DIRECT_BOOKINGS_PAGE_SLUG ||
    input.slug === "en/solutions/hotel-direct-bookings" ||
    input.slug === "ru/solutions/hotel-direct-bookings" ||
    input.slug === "zh/solutions/hotel-direct-bookings"
  );
}

function walkStrings(value: unknown, visit: (text: string) => void) {
  if (typeof value === "string") visit(value);
  else if (Array.isArray(value)) value.forEach((item) => walkStrings(item, visit));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => walkStrings(item, visit));
}

function hasPrivateData(content: CmsDirectBookingPage) {
  let found = false;
  walkStrings(content, (text) => {
    if (EMAIL_RE.test(text) || PHONE_RE.test(text) || ACCOUNT_RE.test(text)) found = true;
  });
  return found;
}

function looksLikeClientOrCommercial(text: string) {
  return /client name|ชื่อลูกค้า|project name|ชื่อโปรเจกต์|฿\s?\d|\d+\s*(บาท|THB|USD)|booking value|ยอดจอง\s*\d|logo wall/i.test(text);
}

function sourceNeedsCitation(source: CmsDirectBookingSource) {
  if (!source.name.trim() && !source.url.trim() && !source.definition.trim()) return false;
  if (!source.name.trim() || !source.url.trim()) return true;
  if (!CTA_RE.test(source.url.trim()) && !/^https?:\/\//i.test(source.url.trim())) return true;
  if (!(source.publishedAt.trim() || source.accessedAt.trim())) return true;
  if (!source.market.trim() || !source.status) return true;
  return false;
}

function visualIsPublishable(visual: CmsDirectBookingVisual, bilingual: boolean) {
  if (!visual.src.trim()) return null;
  if (!visual.altTh.trim()) return "missing_alt";
  if (bilingual && !visual.altEn.trim()) return "missing_alt";
  if (visual.status === "placeholder" || visual.status === "replace") return "placeholder_status";
  if (PLACEHOLDER_RE.test(`${visual.src} ${visual.label} ${visual.caption}`) && visual.status !== "sample") return "placeholder_label";
  if (visual.status === "real") return "screenshot_approval";
  return null;
}

export function validateDirectBookingPage(content: CmsDirectBookingPage, intent: DirectBookingCmsIntent) {
  if (intent !== "publish") return null;
  if (!content.hero.title.trim() || !content.hero.description.trim()) return "required_fields";
  if (!content.seo.canonical.trim() || !CTA_RE.test(content.seo.canonical.trim())) return "invalid_cta";
  const ctas = [
    content.hero.primaryCta,
    content.hero.secondaryCta,
    ...content.related.cards.map((card) => ({ label: card.cta, href: card.href })),
  ];
  if (ctas.some((cta) => (cta.label.trim() || cta.href.trim()) && cta.href.trim() && !CTA_RE.test(cta.href.trim()))) {
    return "invalid_cta";
  }
  const visuals = [
    content.hero.visual,
    content.confidence.visual,
    content.friction.visual,
    content.framework.visual,
    content.audit.visual,
    content.rebuild.visual,
    content.workflow.visual,
    content.measure.visual,
    content.related.visual,
    content.form.visual,
    content.seo.social,
  ];
  for (const visual of visuals) {
    const invalid = visualIsPublishable(visual, content.bilingualPublish);
    if (invalid) return invalid;
  }
  const srcs = visuals.map((visual) => visual.src.trim()).filter(Boolean);
  if (new Set(srcs).size !== srcs.length) return "duplicate_visual";
  for (const source of content.confidence.sources) {
    if (sourceNeedsCitation(source)) return "source_incomplete";
  }
  const trackingReady = content.measure.bookingEngineConfigured && content.measure.trackingConfigured;
  for (const kpi of content.measure.kpis) {
    const publicReady = kpi.dataStatus === "approved" || kpi.dataStatus === "anonymised" || kpi.dataStatus === "sample";
    if (kpi.hideUntilData || kpi.dataStatus === "draft") continue;
    if (
      publicReady &&
      (!kpi.name.trim() ||
        !kpi.period.trim() ||
        !(kpi.unit.trim() || kpi.definition.trim()) ||
        !kpi.market.trim() ||
        !kpi.source.trim() ||
        !kpi.dataStatus)
    ) {
      return "kpi_incomplete";
    }
    if (kpi.group === "complete" && (kpi.value.trim() || kpi.values.length) && !trackingReady) {
      return "outcome_tracking";
    }
  }
  for (const faq of content.faqs) {
    if (!faq.q.trim() || !faq.a.trim()) return "empty_faq";
    if (content.bilingualPublish && (!faq.qEn.trim() || !faq.aEn.trim())) return "empty_faq_bilingual";
  }
  for (const card of content.related.cards) {
    if (card.title.trim() && card.href.trim() && !CTA_RE.test(card.href.trim())) return "invalid_cta";
    if (looksLikeClientOrCommercial(`${card.title} ${card.body}`) && !card.publicationApproved && !content.approvals.clientNames) {
      return "publication_approval";
    }
  }
  let commercial = false;
  let guarantee = false;
  walkStrings(content, (text) => {
    if (looksLikeClientOrCommercial(text)) commercial = true;
    if (GUARANTEE_RE.test(text)) guarantee = true;
  });
  if (guarantee) return "guarantee_claim";
  if (
    commercial &&
    !(
      content.approvals.clientNames ||
      content.approvals.projectNames ||
      content.approvals.prices ||
      content.approvals.bookingValues ||
      content.approvals.logos
    )
  ) {
    return "publication_approval";
  }
  if (hasPrivateData(content)) return "private_data";
  return null;
}

const DIRECT_BOOKING_CMS_ERRORS_TH: Record<string, string> = {
  invalid_cta: "ลิงก์ปุ่มต้องเป็น /path, #anchor, mailto, tel หรือ http(s)",
  missing_alt: "รูปที่เผยแพร่ต้องมีคำอธิบายภาพภาษาไทยและภาษาอังกฤษ",
  placeholder_status: "เปลี่ยนสถานะรูปเป็น Sample หรือ Approved ก่อนเผยแพร่",
  placeholder_label: "อย่าเผยแพร่ข้อความ Placeholder ถ้าสถานะไม่ใช่ Sample",
  screenshot_approval: "ภาพหน้าจอโรงแรมจริงต้องมีสถานะ Approved หรือ Sample",
  duplicate_visual: "อย่าใช้ไฟล์ภาพเดียวกันในหลายส่วนของหน้า",
  kpi_incomplete: "KPI ที่เผยแพร่ต้องมีชื่อ ช่วงเวลา หน่วยหรือคำนิยาม บริบทโรงแรม/ตลาด แหล่งที่มา และสถานะข้อมูล",
  empty_faq: "คำถามและคำตอบใน FAQ ต้องไม่ว่างเมื่อเผยแพร่",
  empty_faq_bilingual: "เมื่อเปิดเผยแพร่สองภาษา FAQ ต้องมีทั้งไทยและอังกฤษ",
  required_fields: "กรอกหัวข้อ คำอธิบาย Hero และ SEO ก่อนเผยแพร่",
  invalid_image: "อัปโหลดได้เฉพาะ JPG PNG หรือ WEBP ขนาดไม่เกิน 5MB",
  missing: "ไม่พบหน้าเพจ",
  invalid_json: "ข้อมูลฟอร์มไม่ถูกต้อง",
  private_data: "ห้ามเผยแพร่อีเมล เบอร์โทร คีย์ระบบจอง หรือข้อมูลลูกค้า",
  source_incomplete: "ข้อเท็จจริงภายนอกต้องมีชื่อแหล่งที่มา URL วันที่เผยแพร่หรือวันที่เข้าถึง ตลาด และสถานะข้อมูล",
  outcome_tracking: "ห้ามเผยแพร่ Booking Complete จนกว่า Booking Engine และการวัดผลจะถูกตั้งค่าแล้ว",
  publication_approval: "ชื่อลูกค้า ชื่อโปรเจกต์ ราคา ยอดจอง หรือโลโก้ต้องได้รับอนุมัติก่อนเผยแพร่",
  guarantee_claim: "ห้ามเผยแพร่ข้อความการันตีอันดับ ยอดจอง รายได้ หรืออัตราแปลง",
  locale_exists: "มีสำเนาภาษานี้อยู่แล้ว",
  invalid_locale: "เลือกภาษาปลายทางที่ระบบรองรับ",
};

const DIRECT_BOOKING_CMS_ERRORS_EN: Record<string, string> = {
  invalid_cta: "Button links must be a /path, #anchor, mailto, tel, or http(s) URL",
  missing_alt: "Published images need Thai and English alt text",
  placeholder_status: "Set the image status to Sample or Approved before publishing",
  placeholder_label: "Do not publish placeholder copy unless the status is Sample",
  screenshot_approval: "A real hotel screenshot must be Approved or clearly labelled Sample",
  duplicate_visual: "Do not reuse the same image across page sections",
  kpi_incomplete: "Published KPIs need a name, period, unit or definition, hotel/market context, source, and data status",
  empty_faq: "FAQ questions and answers cannot be empty when publishing",
  empty_faq_bilingual: "When bilingual publish is on, FAQs need Thai and English",
  required_fields: "Add the hero title, description, and SEO fields before publishing",
  invalid_image: "Upload JPG, PNG, or WEBP files up to 5MB",
  missing: "Page not found",
  invalid_json: "The form data is not valid",
  private_data: "Do not publish emails, phone numbers, booking-engine keys, or client data",
  source_incomplete: "External facts need a source name, URL, published or accessed date, market, and data status",
  outcome_tracking: "Do not publish Booking Complete until the Booking Engine and tracking are configured",
  publication_approval: "Client names, project names, prices, booking values, or logos need approval before publishing",
  guarantee_claim: "Do not publish a ranking, booking, revenue, or conversion guarantee as a factual claim",
  locale_exists: "A copy of this language already exists",
  invalid_locale: "Choose a supported destination language",
};

export function directBookingCmsErrorMessage(code: string) {
  const th = DIRECT_BOOKING_CMS_ERRORS_TH[code] ?? "บันทึกไม่สำเร็จ";
  const en = DIRECT_BOOKING_CMS_ERRORS_EN[code] ?? "Save failed";
  return `${th} / ${en}`;
}

export function directBookingCmsNotice(kind: "saved" | "preview" | "duplicate" | "pending" | "dirty" | "ready") {
  if (kind === "preview") return "บันทึกแล้ว — เปิดตัวอย่างในแท็บนี้ / Saved — opening preview in this tab";
  if (kind === "duplicate") return "คัดลอกแล้ว — เปิดฉบับร่างภาษาปลายทางเพื่อตรวจคำแปล / Copied — open the destination-language draft to check the translation";
  if (kind === "pending") return "กำลังบันทึก… / Saving…";
  if (kind === "dirty") return "ยังไม่ได้บันทึก / Unsaved changes";
  if (kind === "ready") return "พร้อมบันทึก / Ready to save";
  return "บันทึกแล้ว / Saved";
}

export function editorStateFromDirectBookingDocument(input: {
  id: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  canonical?: string | null;
  locale: string;
  status: string;
  body: string;
  ogImage?: string | null;
}): DirectBookingEditorState {
  const locale = (["th", "en", "ru", "zh"].includes(input.locale) ? input.locale : "th") as Locale;
  const content = parseDirectBookingPageBody(input.body, locale) ?? emptyDirectBookingCms();
  if (input.ogImage && !content.seo.social.src) content.seo.social = { ...content.seo.social, src: input.ogImage };
  return {
    id: input.id,
    title: input.title,
    seoTitle: input.seoTitle,
    metaDescription: input.metaDescription,
    excerpt: input.excerpt,
    canonical: input.canonical || content.seo.canonical,
    locale: input.locale,
    status: input.status,
    content,
  };
}

export function canonicalDirectBookingRoute(locale: Locale) {
  const page = pages.find((item) => item.route.endsWith("/solutions/hotel-direct-bookings") && item.language === locale);
  return page?.route || (locale === "th" ? HOTEL_DIRECT_BOOKINGS_PAGE_ROUTE : `/${locale}${HOTEL_DIRECT_BOOKINGS_PAGE_ROUTE}`);
}

export type DirectBookingKpiPublicStatus = DirectBookingKpiStatus;
