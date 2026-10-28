import {
  hotelWebsiteFaqs,
  hotelWebsiteFaqsAreStale,
  WEBSITE_CMS_FIT_DISCLAIMER,
  WEBSITE_CMS_FIT_NOTE,
  WEBSITE_CMS_FIT_ROWS,
  WEBSITE_CMS_VISUAL,
  WEBSITE_CONFIDENCE_VISUAL,
  WEBSITE_DECISION_NOTE,
  WEBSITE_DECISION_PATHS,
  WEBSITE_DECISION_VISUAL,
  WEBSITE_FRAMEWORK_PILLARS,
  WEBSITE_FRAMEWORK_VISUAL,
  WEBSITE_HERO_VISUAL,
  WEBSITE_KPI_SAMPLE,
  WEBSITE_KPI_SAMPLE_SERIES,
  WEBSITE_KPI_VISUAL,
  WEBSITE_KPIS,
  WEBSITE_READINESS_ROWS,
  WEBSITE_READINESS_VISUAL,
  WEBSITE_RELATED_VISUAL,
  WEBSITE_ENQUIRY_RECEIVE,
  websiteEnquiryCopy,
  websiteRelatedCards,
  WEBSITE_SOURCES,
  WEBSITE_WORKFLOW_HANDOVER,
  WEBSITE_WORKFLOW_STEPS,
  WEBSITE_WORKFLOW_VISUAL,
  type WebsiteKpiStatus,
  type WebsiteSourceStatus,
  type WebsiteTrackingEventStatus,
  type WebsiteVisualStatus,
} from "@/lib/hotel-website";
import { pages, type Locale } from "@/lib/seo";

export const HOTEL_WEBSITE_CMS_TEMPLATE = "hotel-website-design";
export const HOTEL_WEBSITE_PAGE_SLUG = "solutions/hotel-website-design";
export const HOTEL_WEBSITE_PAGE_ROUTE = "/solutions/hotel-website-design";

export const WEBSITE_CMS_INTENTS = ["save", "draft", "preview", "publish", "unpublish"] as const;
export type WebsiteCmsIntent = (typeof WEBSITE_CMS_INTENTS)[number];
export const WEBSITE_CMS_VISUAL_STATUSES = ["replace", "sample", "approved", "placeholder", "real"] as const;
export const WEBSITE_CMS_KPI_STATUSES = ["draft", "sample", "approved", "anonymised"] as const;
export const WEBSITE_CMS_SOURCE_STATUSES = ["guidance", "sample", "approved"] as const;
export const WEBSITE_CMS_TRACKING_STATUSES = ["supported", "not-configured", "pending-approval"] as const;
export type WebsiteCmsSaveResult =
  | { ok: true; id: string; intent: WebsiteCmsIntent }
  | { ok: false; error: string };

export type CmsWebsiteCta = { label: string; href: string };
export type CmsWebsiteVisual = {
  src: string;
  altTh: string;
  altEn: string;
  status: WebsiteVisualStatus;
  label: string;
  caption: string;
};
export type CmsWebsiteFaq = { id: string; q: string; a: string; qEn: string; aEn: string };
export type CmsWebsiteSource = {
  name: string;
  url: string;
  publishedAt: string;
  accessedAt: string;
  market: string;
  period: string;
  definition: string;
  status: WebsiteSourceStatus | string;
};
export type CmsWebsiteKpi = {
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
  dataStatus: WebsiteKpiStatus;
  hideUntilData: boolean;
  updatedAt: string;
  tone: "green" | "yellow" | "amber";
  order: number;
};
export type CmsWebsiteRelatedCard = {
  id: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  featured: boolean;
  publicationApproved: boolean;
  order: number;
};
export type CmsWebsiteFormReceive = { id: string; title: string; label: string; body: string };
export type CmsWebsiteFormLabels = {
  name: string;
  business: string;
  contact: string;
  website: string;
  bookingEngine: string;
  cms: string;
  goal: string;
  challenge: string;
  timeline: string;
  issue: string;
  consent: string;
  privacy: string;
};
export type CmsWebsiteReadinessRow = {
  id: string;
  question: string;
  evidence: string;
  status: string;
  action: string;
  output: string;
};
export type CmsWebsiteFrameworkStep = {
  id: string;
  num: string;
  stage: string;
  title: string;
  input: string;
  action: string;
  output: string;
  approval: string;
};
export type CmsWebsiteFitRow = {
  id: string;
  need: string;
  option: string;
  suitable: string;
  verify: string;
  ownership: string;
};
export type CmsWebsiteDecisionPath = {
  id: string;
  title: string;
  starting: string[];
  advantages: string;
  risks: string;
  dependencies: string;
  next: string;
};
export type CmsWebsiteWorkflowStep = {
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
export type CmsWebsiteHandoverItem = { id: string; label: string };
export type CmsWebsiteTrackingEvent = { id: string; name: string; status: WebsiteTrackingEventStatus };
export type CmsWebsiteTracking = {
  bookingEngineConfigured: boolean;
  trackingConfigured: boolean;
  boundary: string;
  events: CmsWebsiteTrackingEvent[];
};
export type CmsWebsiteSeoVariant = { locale: string; href: string };
export type CmsWebsiteApprovals = {
  clientNames: boolean;
  projectNames: boolean;
  prices: boolean;
  bookingValues: boolean;
  logos: boolean;
};

export type CmsHotelWebsitePage = {
  version: 1;
  template: typeof HOTEL_WEBSITE_CMS_TEMPLATE;
  bilingualPublish: boolean;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    close: string;
    points: string[];
    primaryCta: CmsWebsiteCta;
    secondaryCta: CmsWebsiteCta;
    underCta: string;
    visual: CmsWebsiteVisual;
  };
  confidence: {
    title: string;
    body: string;
    study: string;
    evidence: string;
    visual: CmsWebsiteVisual;
    sources: CmsWebsiteSource[];
  };
  readiness: { title: string; items: string[]; rows: CmsWebsiteReadinessRow[]; visual: CmsWebsiteVisual };
  framework: { title: string; steps: CmsWebsiteFrameworkStep[]; visual: CmsWebsiteVisual };
  cms: {
    title: string;
    body: string;
    wordpress: string;
    tools: string;
    note: string;
    disclaimer: string;
    rows: CmsWebsiteFitRow[];
    visual: CmsWebsiteVisual;
  };
  rebuild: {
    title: string;
    body: string;
    close: string;
    note: string;
    paths: CmsWebsiteDecisionPath[];
    visual: CmsWebsiteVisual;
  };
  workflow: {
    title: string;
    steps: CmsWebsiteWorkflowStep[];
    handover: CmsWebsiteHandoverItem[];
    visual: CmsWebsiteVisual;
  };
  measure: {
    title: string;
    body: string;
    note: string;
    visual: CmsWebsiteVisual;
    kpis: CmsWebsiteKpi[];
    tracking: CmsWebsiteTracking;
  };
  related: { title: string; visual: CmsWebsiteVisual; cards: CmsWebsiteRelatedCard[] };
  form: {
    kicker: string;
    title: string;
    body: string;
    submit: string;
    receiveTitle: string;
    receive: CmsWebsiteFormReceive[];
    nextTitle: string;
    steps: string[];
    labels: CmsWebsiteFormLabels;
  };
  faqs: CmsWebsiteFaq[];
  seo: { social: CmsWebsiteVisual; canonical: string; variants: CmsWebsiteSeoVariant[] };
  approvals: CmsWebsiteApprovals;
};

export type WebsiteEditorState = {
  id: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  canonical: string;
  locale: string;
  status: string;
  content: CmsHotelWebsitePage;
};

const PLACEHOLDER_RE = /placeholder|replace with verified|รอรูป|lorem ipsum/i;
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_RE = /(?:\+?\s*66|\b0)\s*\d(?:[\s.-]?\d){7,9}\b/;
const ACCOUNT_RE = /(?:property|account)\s*id|booking.?engine.?key|ua-\d|g-\d{6,}/i;
const CTA_RE = /^(#|\/|https?:\/\/|mailto:|tel:)/i;

function emptyVisual(): CmsWebsiteVisual {
  return { src: "", altTh: "", altEn: "", status: "replace", label: "", caption: "" };
}

function emptyCta(): CmsWebsiteCta {
  return { label: "", href: "/" };
}

function emptyApprovals(): CmsWebsiteApprovals {
  return { clientNames: false, projectNames: false, prices: false, bookingValues: false, logos: false };
}

function emptyTracking(): CmsWebsiteTracking {
  return {
    bookingEngineConfigured: false,
    trackingConfigured: false,
    boundary: "",
    events: [],
  };
}

function normalizeVisualStatus(value: unknown, fallback: WebsiteVisualStatus): WebsiteVisualStatus {
  if (value === "placeholder") return "replace";
  if (WEBSITE_CMS_VISUAL_STATUSES.includes(value as WebsiteVisualStatus)) return value as WebsiteVisualStatus;
  return fallback === "placeholder" ? "replace" : fallback;
}

function sampleVisual(meta: { labelTh: string; labelEn: string; captionTh: string; captionEn: string; altTh: string; altEn: string; status: WebsiteVisualStatus }): CmsWebsiteVisual {
  return {
    src: "",
    altTh: meta.altTh,
    altEn: meta.altEn,
    status: meta.status,
    label: meta.labelTh,
    caption: meta.captionTh,
  };
}

export function newWebsiteItemId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function emptyHotelWebsiteCms(): CmsHotelWebsitePage {
  return {
    version: 1,
    template: HOTEL_WEBSITE_CMS_TEMPLATE,
    bilingualPublish: true,
    hero: {
      eyebrow: "",
      title: "",
      description: "",
      close: "",
      points: [],
      primaryCta: emptyCta(),
      secondaryCta: emptyCta(),
      underCta: "",
      visual: emptyVisual(),
    },
    confidence: { title: "", body: "", study: "", evidence: "", visual: emptyVisual(), sources: [] },
    readiness: { title: "", items: [], rows: [], visual: emptyVisual() },
    framework: { title: "", steps: [], visual: emptyVisual() },
    cms: { title: "", body: "", wordpress: "", tools: "", note: "", disclaimer: "", rows: [], visual: emptyVisual() },
    rebuild: { title: "", body: "", close: "", note: "", paths: [], visual: emptyVisual() },
    workflow: { title: "", steps: [], handover: [], visual: emptyVisual() },
    measure: { title: "", body: "", note: "", visual: emptyVisual(), kpis: [], tracking: emptyTracking() },
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
      labels: {
        name: "",
        business: "",
        contact: "",
        website: "",
        bookingEngine: "",
        cms: "",
        goal: "",
        challenge: "",
        timeline: "",
        issue: "",
        consent: "",
        privacy: "",
      },
    },
    faqs: [],
    seo: { social: emptyVisual(), canonical: HOTEL_WEBSITE_PAGE_ROUTE, variants: defaultSeoVariants() },
    approvals: emptyApprovals(),
  };
}

function defaultSeoVariants(): CmsWebsiteSeoVariant[] {
  const th = pages.find((page) => page.route === HOTEL_WEBSITE_PAGE_ROUTE && page.language === "th");
  const alts = th?.alternates?.length
    ? th.alternates.map((item) => ({
        locale: item.hreflang === "x-default" ? "th" : item.hreflang,
        href: item.href.replace(/^https?:\/\/[^/]+/i, "") || item.href,
      }))
    : [
        { locale: "th", href: HOTEL_WEBSITE_PAGE_ROUTE },
        { locale: "en", href: "/en/solutions/hotel-website-design" },
        { locale: "ru", href: "/ru/solutions/hotel-website-design" },
        { locale: "zh", href: "/zh/solutions/hotel-website-design" },
      ];
  const seen = new Set<string>();
  return alts.filter((item) => {
    if (seen.has(item.locale)) return false;
    seen.add(item.locale);
    return true;
  });
}

function asVisual(value: unknown, fallback: CmsWebsiteVisual): CmsWebsiteVisual {
  const row = value && typeof value === "object" ? (value as Partial<CmsWebsiteVisual>) : {};
  return {
    src: String(row.src ?? fallback.src),
    altTh: String(row.altTh ?? fallback.altTh),
    altEn: String(row.altEn ?? fallback.altEn),
    status: normalizeVisualStatus(row.status, fallback.status),
    label: String(row.label ?? fallback.label),
    caption: String(row.caption ?? fallback.caption),
  };
}

function asCta(value: unknown, fallback: CmsWebsiteCta): CmsWebsiteCta {
  const row = value && typeof value === "object" ? (value as Partial<CmsWebsiteCta>) : {};
  return { label: String(row.label ?? fallback.label), href: String(row.href ?? fallback.href) };
}

function asSource(value: unknown): CmsWebsiteSource {
  const row = value && typeof value === "object" ? (value as Partial<CmsWebsiteSource>) : {};
  const status = WEBSITE_CMS_SOURCE_STATUSES.includes(row.status as WebsiteSourceStatus)
    ? (row.status as WebsiteSourceStatus)
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

function asKpi(value: unknown, index: number): CmsWebsiteKpi {
  const row = value && typeof value === "object" ? (value as Partial<CmsWebsiteKpi> & { chartLabels?: unknown; chartValues?: unknown }) : {};
  const dataStatus = WEBSITE_CMS_KPI_STATUSES.includes(row.dataStatus as WebsiteKpiStatus)
    ? (row.dataStatus as WebsiteKpiStatus)
    : "draft";
  const tone = row.tone === "yellow" || row.tone === "amber" ? row.tone : "green";
  const id = String(row.id || newWebsiteItemId("kpi"));
  const known = WEBSITE_KPIS.find((kpi) => kpi.id === id);
  const sample = WEBSITE_KPI_SAMPLE_SERIES.find((item) => item.id === id || item.group === (row.group || known?.group));
  return {
    id,
    name: String(row.name ?? ""),
    group: String(row.group ?? known?.group ?? ""),
    period: String(row.period ?? ""),
    unit: String(row.unit ?? ""),
    definition: String(row.definition ?? ""),
    comparison: String(row.comparison ?? ""),
    target: String(row.target ?? sample?.target ?? ""),
    market: String(row.market ?? ""),
    source: String(row.source ?? ""),
    sourceUrl: String(row.sourceUrl ?? ""),
    value: String(row.value ?? ""),
    labels: Array.isArray(row.labels) ? row.labels.map(String) : sample ? [...sample.labels] : [],
    values: asNumberList(row.values ?? row.chartValues) || (sample ? [...sample.values] : []),
    dataStatus,
    hideUntilData: Boolean(row.hideUntilData),
    updatedAt: String(row.updatedAt ?? ""),
    tone,
    order: Number(row.order) || index + 1,
  };
}

function asCard(value: unknown, index: number): CmsWebsiteRelatedCard {
  const row = value && typeof value === "object" ? (value as Partial<CmsWebsiteRelatedCard>) : {};
  return {
    id: String(row.id || newWebsiteItemId("card")),
    title: String(row.title ?? ""),
    body: String(row.body ?? ""),
    href: String(row.href ?? ""),
    cta: String(row.cta ?? ""),
    featured: Boolean(row.featured),
    publicationApproved: Boolean(row.publicationApproved),
    order: Number(row.order) || index + 1,
  };
}

function asReadinessRow(value: unknown, index: number): CmsWebsiteReadinessRow {
  if (typeof value === "string") {
    const known = WEBSITE_READINESS_ROWS[index];
    return {
      id: known?.id || newWebsiteItemId("ready"),
      question: value,
      evidence: known?.evidenceTh || "",
      status: known?.statusTh || "",
      action: known?.actionTh || "",
      output: known?.output || "",
    };
  }
  const row = value && typeof value === "object" ? (value as Partial<CmsWebsiteReadinessRow>) : {};
  const known = WEBSITE_READINESS_ROWS.find((item) => item.id === row.id) || WEBSITE_READINESS_ROWS[index];
  return {
    id: String(row.id || known?.id || newWebsiteItemId("ready")),
    question: String(row.question ?? ""),
    evidence: String(row.evidence ?? ""),
    status: String(row.status ?? ""),
    action: String(row.action ?? ""),
    output: String(row.output ?? ""),
  };
}

function asFrameworkStep(value: unknown, index: number): CmsWebsiteFrameworkStep {
  const row =
    value && typeof value === "object"
      ? (value as Partial<CmsWebsiteFrameworkStep> & { body?: string })
      : {};
  const known = WEBSITE_FRAMEWORK_PILLARS.find((item) => item.id === row.id) || WEBSITE_FRAMEWORK_PILLARS[index];
  return {
    id: String(row.id || known?.id || newWebsiteItemId("pillar")),
    num: String(row.num ?? known?.num ?? String(index + 1).padStart(2, "0")),
    stage: String(row.stage ?? known?.stage ?? ""),
    title: String(row.title ?? ""),
    input: String(row.input ?? ""),
    action: String(row.action ?? row.body ?? ""),
    output: String(row.output ?? known?.output ?? ""),
    approval: String(row.approval ?? ""),
  };
}

function asFitRow(value: unknown, index: number): CmsWebsiteFitRow {
  const row = value && typeof value === "object" ? (value as Partial<CmsWebsiteFitRow>) : {};
  const known = WEBSITE_CMS_FIT_ROWS[index];
  return {
    id: String(row.id || known?.id || newWebsiteItemId("fit")),
    need: String(row.need ?? ""),
    option: String(row.option ?? ""),
    suitable: String(row.suitable ?? ""),
    verify: String(row.verify ?? ""),
    ownership: String(row.ownership ?? ""),
  };
}

function asDecisionPath(value: unknown, index: number): CmsWebsiteDecisionPath {
  const row = value && typeof value === "object" ? (value as Partial<CmsWebsiteDecisionPath>) : {};
  const known = WEBSITE_DECISION_PATHS[index];
  return {
    id: String(row.id || known?.id || newWebsiteItemId("path")),
    title: String(row.title ?? ""),
    starting: Array.isArray(row.starting) ? row.starting.map(String).filter(Boolean) : [],
    advantages: String(row.advantages ?? ""),
    risks: String(row.risks ?? ""),
    dependencies: String(row.dependencies ?? ""),
    next: String(row.next ?? ""),
  };
}

function asWorkflowStep(value: unknown, index: number): CmsWebsiteWorkflowStep {
  const row =
    value && typeof value === "object"
      ? (value as Partial<CmsWebsiteWorkflowStep> & { body?: string })
      : {};
  const known = WEBSITE_WORKFLOW_STEPS.find((item) => item.id === row.id) || WEBSITE_WORKFLOW_STEPS[index];
  return {
    id: String(row.id || known?.id || newWebsiteItemId("step")),
    num: String(row.num ?? known?.num ?? String(index + 1).padStart(2, "0")),
    label: String(row.label ?? known?.label ?? ""),
    title: String(row.title ?? ""),
    owner: String(row.owner ?? ""),
    input: String(row.input ?? ""),
    action: String(row.action ?? row.body ?? ""),
    output: String(row.output ?? known?.output ?? ""),
    approval: String(row.approval ?? ""),
    next: String(row.next ?? ""),
  };
}

function asHandoverItem(value: unknown, index: number): CmsWebsiteHandoverItem {
  if (typeof value === "string") {
    const known = WEBSITE_WORKFLOW_HANDOVER[index];
    return { id: known?.id || newWebsiteItemId("hand"), label: value };
  }
  const row = value && typeof value === "object" ? (value as Partial<CmsWebsiteHandoverItem>) : {};
  return {
    id: String(row.id || WEBSITE_WORKFLOW_HANDOVER[index]?.id || newWebsiteItemId("hand")),
    label: String(row.label ?? ""),
  };
}

function asTrackingEvent(value: unknown, index: number): CmsWebsiteTrackingEvent {
  const row = value && typeof value === "object" ? (value as Partial<CmsWebsiteTrackingEvent>) : {};
  const status = WEBSITE_CMS_TRACKING_STATUSES.includes(row.status as WebsiteTrackingEventStatus)
    ? (row.status as WebsiteTrackingEventStatus)
    : "not-configured";
  return {
    id: String(row.id || newWebsiteItemId("evt")),
    name: String(row.name ?? `Event ${index + 1}`),
    status,
  };
}

function asTracking(value: unknown, fallback: CmsWebsiteTracking): CmsWebsiteTracking {
  const row = value && typeof value === "object" ? (value as Partial<CmsWebsiteTracking>) : {};
  return {
    bookingEngineConfigured: Boolean(row.bookingEngineConfigured ?? fallback.bookingEngineConfigured),
    trackingConfigured: Boolean(row.trackingConfigured ?? fallback.trackingConfigured),
    boundary: String(row.boundary ?? fallback.boundary),
    events: Array.isArray(row.events) ? row.events.map(asTrackingEvent) : fallback.events,
  };
}

function asApprovals(value: unknown): CmsWebsiteApprovals {
  const row = value && typeof value === "object" ? (value as Partial<CmsWebsiteApprovals>) : {};
  return {
    clientNames: Boolean(row.clientNames),
    projectNames: Boolean(row.projectNames),
    prices: Boolean(row.prices),
    bookingValues: Boolean(row.bookingValues),
    logos: Boolean(row.logos),
  };
}

function asFaq(value: unknown, index: number): CmsWebsiteFaq {
  const row = value && typeof value === "object" ? (value as Partial<CmsWebsiteFaq>) : {};
  const q = String(row.q ?? "");
  const a = String(row.a ?? "");
  return {
    id: String(row.id || newWebsiteItemId("faq")),
    q,
    a,
    qEn: String(row.qEn ?? ""),
    aEn: String(row.aEn ?? ""),
  };
}

export function parseHotelWebsitePageBody(body: string, locale: Locale = "th"): CmsHotelWebsitePage | null {
  try {
    const parsed = JSON.parse(body) as Partial<CmsHotelWebsitePage> & { template?: string };
    if (parsed?.template !== HOTEL_WEBSITE_CMS_TEMPLATE) return null;
    const fallback = emptyHotelWebsiteCms();
    const hero = parsed.hero ?? fallback.hero;
    const confidence = parsed.confidence ?? fallback.confidence;
    const readiness = parsed.readiness ?? fallback.readiness;
    const framework = parsed.framework ?? fallback.framework;
    const cms = parsed.cms ?? fallback.cms;
    const rebuild = parsed.rebuild ?? fallback.rebuild;
    const workflow = parsed.workflow ?? fallback.workflow;
    const measure = parsed.measure ?? fallback.measure;
    const related = parsed.related ?? fallback.related;
    const form = parsed.form ?? fallback.form;
    const seeded = defaultHotelWebsiteCms(locale);
    const readinessRows = Array.isArray(readiness.rows)
      ? readiness.rows.map(asReadinessRow)
      : Array.isArray(readiness.items)
        ? readiness.items.map(asReadinessRow)
        : [];
    const enFaqs = hotelWebsiteFaqs("en");
    return {
      version: 1,
      template: HOTEL_WEBSITE_CMS_TEMPLATE,
      bilingualPublish: parsed.bilingualPublish !== false,
      hero: {
        eyebrow: String(hero.eyebrow ?? ""),
        title: String(hero.title ?? ""),
        description: String(hero.description ?? ""),
        close: String(hero.close ?? ""),
        points: Array.isArray(hero.points) ? hero.points.map(String) : [],
        primaryCta: asCta(hero.primaryCta, fallback.hero.primaryCta),
        secondaryCta: asCta(hero.secondaryCta, fallback.hero.secondaryCta),
        underCta: String(hero.underCta ?? ""),
        visual: asVisual(hero.visual, fallback.hero.visual),
      },
      confidence: {
        title: String(confidence.title ?? ""),
        body: String(confidence.body ?? ""),
        study: String(confidence.study ?? ""),
        evidence: String(confidence.evidence ?? confidence.study ?? ""),
        visual: asVisual(confidence.visual, fallback.confidence.visual),
        sources: Array.isArray(confidence.sources) ? confidence.sources.map(asSource) : [],
      },
      readiness: {
        title: String(readiness.title ?? ""),
        items: readinessRows.map((row) => row.question).filter(Boolean),
        rows: readinessRows.length ? readinessRows : seeded.readiness.rows,
        visual: asVisual(readiness.visual, fallback.readiness.visual),
      },
      framework: {
        title: String(framework.title ?? ""),
        steps: Array.isArray(framework.steps) && framework.steps.length ? framework.steps.map(asFrameworkStep) : seeded.framework.steps,
        visual: asVisual(framework.visual, seeded.framework.visual),
      },
      cms: {
        title: String(cms.title ?? ""),
        body: String(cms.body ?? ""),
        wordpress: String(cms.wordpress ?? ""),
        tools: String(cms.tools ?? ""),
        note: String(cms.note ?? ""),
        disclaimer: String(cms.disclaimer ?? ""),
        rows: Array.isArray(cms.rows) && cms.rows.length ? cms.rows.map(asFitRow) : seeded.cms.rows,
        visual: asVisual(cms.visual, fallback.cms.visual),
      },
      rebuild: {
        title: String(rebuild.title ?? ""),
        body: String(rebuild.body ?? ""),
        close: String(rebuild.close ?? ""),
        note: String(rebuild.note ?? seeded.rebuild.note),
        paths: Array.isArray(rebuild.paths) && rebuild.paths.length ? rebuild.paths.map(asDecisionPath) : seeded.rebuild.paths,
        visual: asVisual(rebuild.visual, seeded.rebuild.visual),
      },
      workflow: {
        title: String(workflow.title ?? ""),
        steps: Array.isArray(workflow.steps) && workflow.steps.length ? workflow.steps.map(asWorkflowStep) : seeded.workflow.steps,
        handover: Array.isArray(workflow.handover) && workflow.handover.length ? workflow.handover.map(asHandoverItem) : seeded.workflow.handover,
        visual: asVisual(workflow.visual, fallback.workflow.visual),
      },
      measure: {
        title: String(measure.title ?? ""),
        body: String(measure.body ?? ""),
        note: String(measure.note ?? ""),
        visual: asVisual(measure.visual, fallback.measure.visual),
        kpis: Array.isArray(measure.kpis) ? measure.kpis.map(asKpi) : [],
        tracking: asTracking(measure.tracking, seeded.measure.tracking),
      },
      related: {
        title: String(related.title ?? ""),
        visual: asVisual(related.visual, fallback.related.visual),
        cards: Array.isArray(related.cards) ? related.cards.map(asCard) : [],
      },
      form: {
        kicker: String(form.kicker ?? ""),
        title: String(form.title ?? ""),
        body: String(form.body ?? ""),
        submit: String(form.submit ?? ""),
        receiveTitle: String(form.receiveTitle ?? ""),
        receive: Array.isArray(form.receive)
          ? form.receive.map((item) => {
              const label = String((item as { label?: string }).label ?? "");
              const title = String((item as { title?: string }).title ?? label);
              return {
                id: String((item as { id?: string }).id || newWebsiteItemId("recv")),
                title,
                label: label || title,
                body: String((item as { body?: string }).body ?? ""),
              };
            })
          : [],
        nextTitle: String(form.nextTitle ?? ""),
        steps: Array.isArray(form.steps) ? form.steps.map((step) => String(step ?? "")).filter(Boolean) : [],
        labels: {
          name: String(form.labels?.name ?? ""),
          business: String(form.labels?.business ?? ""),
          contact: String(form.labels?.contact ?? ""),
          website: String(form.labels?.website ?? ""),
          bookingEngine: String(form.labels?.bookingEngine ?? ""),
          cms: String(form.labels?.cms ?? ""),
          goal: String(form.labels?.goal ?? ""),
          challenge: String(form.labels?.challenge ?? ""),
          timeline: String(form.labels?.timeline ?? ""),
          issue: String(form.labels?.issue ?? ""),
          consent: String(form.labels?.consent ?? ""),
          privacy: String(form.labels?.privacy ?? ""),
        },
      },
      faqs: (() => {
        const seeded = hotelWebsiteFaqs(locale === "th" ? "th" : "en").map((item, index) => ({
          id: `faq-${index + 1}`,
          q: item.q,
          a: item.a,
          qEn: enFaqs[index]?.q || "",
          aEn: enFaqs[index]?.a || "",
        }));
        const items = Array.isArray(parsed.faqs) ? parsed.faqs.map(asFaq) : [];
        if (!items.length || hotelWebsiteFaqsAreStale(items)) return seeded;
        return items.map((faq, index) => ({
          ...faq,
          qEn: faq.qEn.trim() || enFaqs[index]?.q || "",
          aEn: faq.aEn.trim() || enFaqs[index]?.a || "",
        }));
      })(),
      seo: {
        social: asVisual(parsed.seo?.social, fallback.seo.social),
        canonical: String(parsed.seo?.canonical ?? HOTEL_WEBSITE_PAGE_ROUTE),
        variants: Array.isArray(parsed.seo?.variants) && parsed.seo.variants.length
          ? parsed.seo.variants.map((item) => ({ locale: String(item.locale ?? ""), href: String(item.href ?? "") }))
          : defaultSeoVariants(),
      },
      approvals: asApprovals(parsed.approvals),
    };
  } catch {
    return null;
  }
}

export function serializeHotelWebsitePageBody(content: CmsHotelWebsitePage) {
  return JSON.stringify({ ...content, version: 1, template: HOTEL_WEBSITE_CMS_TEMPLATE });
}

export function isHotelWebsiteCmsBody(body: string) {
  try {
    const parsed = JSON.parse(body) as { template?: string };
    return parsed?.template === HOTEL_WEBSITE_CMS_TEMPLATE;
  } catch {
    return false;
  }
}

export function isHotelWebsitePageDocument(input: { slug: string; template: string }) {
  if (input.template === HOTEL_WEBSITE_CMS_TEMPLATE) return true;
  return (
    input.slug === HOTEL_WEBSITE_PAGE_SLUG ||
    input.slug === "en/solutions/hotel-website-design" ||
    input.slug === "ru/solutions/hotel-website-design" ||
    input.slug === "zh/solutions/hotel-website-design"
  );
}

function walkStrings(value: unknown, visit: (text: string) => void) {
  if (typeof value === "string") visit(value);
  else if (Array.isArray(value)) value.forEach((item) => walkStrings(item, visit));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => walkStrings(item, visit));
}

function hasPrivateData(content: CmsHotelWebsitePage) {
  let found = false;
  walkStrings(content, (text) => {
    if (EMAIL_RE.test(text) || PHONE_RE.test(text) || ACCOUNT_RE.test(text)) found = true;
  });
  return found;
}

function looksLikeClientOrCommercial(text: string) {
  return /client name|ชื่อลูกค้า|project name|ชื่อโปรเจกต์|฿\s?\d|\d+\s*(บาท|THB|USD)|booking value|ยอดจอง\s*\d|logo wall/i.test(
    text,
  );
}

function sourceNeedsCitation(source: CmsWebsiteSource) {
  if (!source.name.trim() && !source.url.trim() && !source.definition.trim()) return false;
  if (!source.name.trim() || !source.url.trim()) return true;
  if (!CTA_RE.test(source.url.trim()) && !/^https?:\/\//i.test(source.url.trim())) return true;
  if (!(source.publishedAt.trim() || source.accessedAt.trim())) return true;
  if (!source.market.trim() || !source.status) return true;
  return false;
}

function visualIsPublishable(visual: CmsWebsiteVisual) {
  if (!visual.src.trim()) return null;
  if (!visual.altTh.trim() || !visual.altEn.trim()) return "missing_alt";
  if (visual.status === "placeholder" || visual.status === "replace") return "placeholder_status";
  if (PLACEHOLDER_RE.test(`${visual.src} ${visual.label} ${visual.caption}`) && visual.status !== "sample") {
    return "placeholder_label";
  }
  if (visual.status === "real") return "screenshot_approval";
  return null;
}

export function validateHotelWebsitePage(content: CmsHotelWebsitePage, intent: WebsiteCmsIntent) {
  if (intent !== "publish") return null;
  if (!content.hero.title.trim() || !content.hero.description.trim()) return "required_fields";
  if (!content.seo.canonical.trim()) return "required_fields";
  if (content.seo.canonical.trim() && !CTA_RE.test(content.seo.canonical.trim())) return "invalid_cta";
  const ctas = [content.hero.primaryCta, content.hero.secondaryCta, ...content.related.cards.map((card) => ({ label: card.cta, href: card.href }))];
  if (ctas.some((cta) => (cta.label.trim() || cta.href.trim()) && cta.href.trim() && !CTA_RE.test(cta.href.trim()))) {
    return "invalid_cta";
  }
  const visuals = [
    content.hero.visual,
    content.confidence.visual,
    content.readiness.visual,
    content.framework.visual,
    content.cms.visual,
    content.rebuild.visual,
    content.workflow.visual,
    content.measure.visual,
    content.related.visual,
    content.seo.social,
  ];
  for (const visual of visuals) {
    const invalid = visualIsPublishable(visual);
    if (invalid) return invalid;
  }
  for (const source of content.confidence.sources) {
    if (sourceNeedsCitation(source)) return "source_incomplete";
  }
  const trackingReady = content.measure.tracking.bookingEngineConfigured && content.measure.tracking.trackingConfigured;
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
    if (kpi.group === "outcome" && (kpi.value.trim() || kpi.values.length) && !trackingReady) {
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
  walkStrings(content, (text) => {
    if (looksLikeClientOrCommercial(text)) commercial = true;
  });
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

const WEBSITE_CMS_ERRORS_TH: Record<string, string> = {
  invalid_cta: "ลิงก์ปุ่มต้องเป็น /path, #anchor, mailto, tel หรือ http(s)",
  missing_alt: "รูปที่เผยแพร่ต้องมีคำอธิบายภาพภาษาไทยและภาษาอังกฤษ",
  placeholder_status: "เปลี่ยนสถานะรูปเป็น Sample หรือ Approved ก่อนเผยแพร่ — Replace ใช้เมื่อยังต้องเปลี่ยนภาพ",
  placeholder_label: "อย่าเผยแพร่ข้อความหรือไฟล์ Placeholder ถ้าสถานะไม่ใช่ Sample",
  screenshot_approval: "ภาพหน้าจอโรงแรมจริงต้องมีสถานะ Approved ก่อนเผยแพร่ หรือตั้งเป็น Sample อย่างชัดเจน",
  kpi_incomplete: "KPI ที่เผยแพร่ต้องมีชื่อ ช่วงเวลา หน่วยหรือคำนิยาม บริบทโรงแรม/ตลาด แหล่งที่มา และสถานะข้อมูล",
  empty_faq: "คำถามและคำตอบใน FAQ ต้องไม่ว่างเมื่อเผยแพร่",
  empty_faq_bilingual: "เมื่อเปิดเผยแพร่สองภาษา FAQ ต้องมีคำถามและคำตอบทั้งไทยและอังกฤษ",
  required_fields: "กรอกหัวข้อ คำอธิบาย Hero และ SEO title / meta description ก่อนเผยแพร่",
  invalid_image: "อัปโหลดได้เฉพาะ JPG PNG หรือ WEBP ขนาดไม่เกิน 5MB",
  missing: "ไม่พบหน้าเพจ",
  invalid_json: "ข้อมูลฟอร์มไม่ถูกต้อง",
  private_data: "ห้ามเผยแพร่อีเมล เบอร์โทร คีย์ระบบจอง หรือข้อมูลลูกค้า",
  source_incomplete: "ข้อเท็จจริงภายนอกต้องมีชื่อแหล่งที่มา URL วันที่เผยแพร่หรือวันที่เข้าถึง ตลาด และสถานะข้อมูล",
  outcome_tracking: "ห้ามเผยแพร่ Booking Outcome จนกว่า Booking Engine และการวัดผลจะถูกตั้งค่าแล้ว",
  publication_approval: "ชื่อลูกค้า ชื่อโปรเจกต์ ราคา ยอดจอง หรือโลโก้ต้องได้รับอนุมัติก่อนเผยแพร่",
  locale_exists: "มีสำเนาภาษานี้อยู่แล้ว",
  invalid_locale: "เลือกภาษาปลายทางที่ระบบรองรับ",
};

const WEBSITE_CMS_ERRORS_EN: Record<string, string> = {
  invalid_cta: "Button links must be a /path, #anchor, mailto, tel, or http(s) URL",
  missing_alt: "Published images need Thai and English alt text",
  placeholder_status: "Set the image status to Sample or Approved before publishing. Use Replace only while a new asset is still needed",
  placeholder_label: "Do not publish placeholder copy or files unless the status is Sample",
  screenshot_approval: "A real hotel screenshot must be Approved before publishing, or clearly labelled Sample",
  kpi_incomplete: "Published KPIs need a name, period, unit or definition, hotel/market context, source, and data status",
  empty_faq: "FAQ questions and answers cannot be empty when publishing",
  empty_faq_bilingual: "When bilingual publish is on, FAQs need Thai and English questions and answers",
  required_fields: "Add the hero title, hero description, SEO title, and meta description before publishing",
  invalid_image: "Upload JPG, PNG, or WEBP files up to 5MB",
  missing: "Page not found",
  invalid_json: "The form data is not valid",
  private_data: "Do not publish emails, phone numbers, booking-engine keys, or client data",
  source_incomplete: "External facts need a source name, URL, published or accessed date, market, and data status",
  outcome_tracking: "Do not publish Booking Outcome until the Booking Engine and tracking are configured",
  publication_approval: "Client names, project names, prices, booking values, or logos need approval before publishing",
  locale_exists: "A copy of this language already exists",
  invalid_locale: "Choose a supported destination language",
};

export function websiteCmsErrorMessage(code: string) {
  const th = WEBSITE_CMS_ERRORS_TH[code] ?? "บันทึกไม่สำเร็จ";
  const en = WEBSITE_CMS_ERRORS_EN[code] ?? "Save failed";
  return `${th} / ${en}`;
}

export function websiteCmsNotice(kind: "saved" | "preview" | "duplicate" | "pending" | "dirty" | "ready") {
  if (kind === "preview") return "บันทึกแล้ว — เปิดตัวอย่างในแท็บนี้ / Saved — opening preview in this tab";
  if (kind === "duplicate") return "คัดลอกแล้ว — เปิดฉบับร่างภาษาปลายทางเพื่อตรวจคำแปล / Copied — open the destination-language draft to check the translation";
  if (kind === "pending") return "กำลังบันทึก… / Saving…";
  if (kind === "dirty") return "ยังไม่ได้บันทึก / Unsaved changes";
  if (kind === "ready") return "พร้อมบันทึก / Ready to save";
  return "บันทึกแล้ว / Saved";
}

export function editorStateFromHotelWebsiteDocument(input: {
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
}): WebsiteEditorState {
  const locale = (["th", "en", "ru", "zh"].includes(input.locale) ? input.locale : "th") as Locale;
  const content = parseHotelWebsitePageBody(input.body, locale) ?? emptyHotelWebsiteCms();
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

export function defaultHotelWebsiteCms(locale: Locale = "th"): CmsHotelWebsitePage {
  const thai = locale === "th";
  const faqs = hotelWebsiteFaqs(thai ? "th" : "en");
  const faqsEn = hotelWebsiteFaqs("en");
  const copy = websiteEnquiryCopy(thai ? "th" : "en");
  return {
    version: 1,
    template: HOTEL_WEBSITE_CMS_TEMPLATE,
    bilingualPublish: true,
    hero: {
      eyebrow: thai ? "Hotel Website & Direct Booking" : "Hotel Website Design",
      title: thai
        ? "เว็บไซต์ที่ทำให้ลูกค้ามั่นใจก่อนจอง และทีมโรงแรมใช้งานต่อได้จริง"
        : "A website that helps guests feel sure before they book, and that the hotel team can keep using",
      description: thai
        ? "ลูกค้าควรเข้าใจโรงแรม ห้องพัก ข้อเสนอ เงื่อนไข และทำเลได้ก่อนจอง เว็บไซต์จึงต้องพาจากจุดที่พบโรงแรมไปสู่การจองตรงได้ชัด และทีมโรงแรมแก้เนื้อหาต่อได้หลังส่งมอบ"
        : "Guests should understand the hotel, rooms, offers, policies, and location before they book. The website can guide them from discovery to a direct booking, and the hotel team can keep updating content after handover.",
      close: thai
        ? "The KPI Plus ช่วยออกแบบและพัฒนาเว็บไซต์ให้รองรับการใช้งานจริงด้าน Responsive, CMS, Booking Engine และการวัดผล ตามความสามารถที่โรงแรมต้องใช้"
        : "The KPI Plus designs and builds the website so it can stay responsive, CMS-ready, booking-engine-ready, and measurement-ready when those capabilities are part of the brief.",
      points: ["Responsive", "CMS-ready", "Booking Engine-ready", "Measurement-ready"],
      primaryCta: {
        label: thai ? "ขอให้ทีมรีวิวเว็บไซต์โรงแรม" : "Ask the team to review the hotel website",
        href: "#website-enquiry",
      },
      secondaryCta: { label: thai ? "ดูโซลูชันทั้งหมด" : "All solutions", href: "/solutions" },
      underCta: "Responsive · CMS-ready · Booking Engine-ready · Measurement-ready",
      visual: sampleVisual(WEBSITE_HERO_VISUAL),
    },
    confidence: {
      title: thai ? "ทำไมเว็บไซต์ทางการจึงช่วยสร้างความมั่นใจ?" : "Why does an official website help guests feel sure?",
      body: thai
        ? "ต้องการข้อมูลและเงื่อนไขที่ชัดเจนจากแหล่งเพิ่มเติมก่อนตัดสินใจจอง"
        : "need to feel sure before they book, and more than half check travel details from another source.",
      study: thai
        ? "ราคาและเงื่อนไขการยกเลิกมีผลร่วมกันต่อความตั้งใจจอง เว็บไซต์ทางการควรช่วยให้ลูกค้าเห็นรายละเอียดห้องพัก ข้อเสนอ นโยบาย และเส้นทางจองตรงก่อนตัดสินใจ"
        : "Price and cancellation terms together affect booking intention. The official website should show room details, the offer, policy, and a direct-booking path before the guest decides.",
      evidence: thai
        ? "ตัวเลขนี้เป็นบริบทจากงานวิจัย ไม่ใช่ผลลัพธ์ที่บริการนี้รับประกัน"
        : "These figures are research context, not a result this service guarantees.",
      visual: sampleVisual(WEBSITE_CONFIDENCE_VISUAL),
      sources: [{ ...WEBSITE_SOURCES.googleIpsos }, { ...WEBSITE_SOURCES.thaiCancellation }],
    },
    readiness: {
      title: thai ? "เว็บไซต์โรงแรมของคุณตอบคำถามเหล่านี้ได้ไหม?" : "Can this hotel website answer these questions?",
      items: WEBSITE_READINESS_ROWS.map((row) => (thai ? row.questionTh : row.questionEn)),
      rows: WEBSITE_READINESS_ROWS.map((row) => ({
        id: row.id,
        question: thai ? row.questionTh : row.questionEn,
        evidence: thai ? row.evidenceTh : row.evidenceEn,
        status: thai ? row.statusTh : row.statusEn,
        action: thai ? row.actionTh : row.actionEn,
        output: row.output,
      })),
      visual: sampleVisual(WEBSITE_READINESS_VISUAL),
    },
    framework: {
      title: thai ? "เดอะ เคพีไอ พลัส ช่วยอะไร?" : "What The KPI Plus helps with",
      steps: WEBSITE_FRAMEWORK_PILLARS.map((pillar) => ({
        id: pillar.id,
        num: pillar.num,
        stage: pillar.stage,
        title: thai ? pillar.titleTh : pillar.titleEn,
        input: thai ? pillar.inputTh : pillar.inputEn,
        action: thai ? pillar.actionTh : pillar.actionEn,
        output: pillar.output,
        approval: thai ? pillar.approvalTh : pillar.approvalEn,
      })),
      visual: sampleVisual(WEBSITE_FRAMEWORK_VISUAL),
    },
    cms: {
      title: thai ? "ใช้ CMS และเครื่องมือแบบไหน?" : "Which CMS and tools do we use?",
      body: thai
        ? "เราเลือกเทคโนโลยีจากความต้องการของโรงแรม เช่น จำนวนหน้าที่ต้องดูแล ความถี่ในการเปลี่ยนเนื้อหา ระบบจองที่ต้องเชื่อม งบประมาณ และผู้ที่จะรับผิดชอบเว็บไซต์หลังเปิดใช้"
        : "We choose the technology from the hotel’s needs: how many pages must be looked after, how often content changes, which booking system must connect, the budget, and who will own the website after launch.",
      wordpress: thai
        ? "WordPress อาจเหมาะกับโรงแรมที่ต้องการระบบจัดการเนื้อหาซึ่งทีมคุ้นเคยอยู่แล้ว"
        : "WordPress can fit a hotel that wants a content system the team already knows.",
      tools: thai
        ? "ทีมสามารถใช้เครื่องมืออย่าง Cursor, Claude และ Manus เพื่อช่วยจัดการงานและทำต้นแบบได้ แต่สิ่งที่โรงแรมได้รับคือเว็บไซต์ที่ใช้งานและดูแลต่อได้"
        : "The team can use tools such as Cursor, Claude, and Manus to manage the work and make prototypes. The hotel does not need to learn those tools to change everyday content.",
      note: thai ? WEBSITE_CMS_FIT_NOTE.th : WEBSITE_CMS_FIT_NOTE.en,
      disclaimer: thai ? WEBSITE_CMS_FIT_DISCLAIMER.th : WEBSITE_CMS_FIT_DISCLAIMER.en,
      rows: WEBSITE_CMS_FIT_ROWS.map((row) => ({
        id: row.id,
        need: thai ? row.needTh : row.needEn,
        option: thai ? row.optionTh : row.optionEn,
        suitable: thai ? row.suitableTh : row.suitableEn,
        verify: thai ? row.verifyTh : row.verifyEn,
        ownership: thai ? row.ownershipTh : row.ownershipEn,
      })),
      visual: sampleVisual(WEBSITE_CMS_VISUAL),
    },
    rebuild: {
      title: thai ? "สร้างเว็บไซต์ใหม่หรือปรับเว็บเดิม?" : "A new website, or improve the current one?",
      body: thai
        ? "ไม่จำเป็นต้องสร้างใหม่ทุกครั้ง หากเว็บไซต์เดิมแก้เนื้อหาได้ ใช้งานบนมือถือสะดวก และเชื่อมระบบจองได้ ทีมอาจแนะนำให้ปรับโครงสร้าง หน้าห้องพัก ภาพ หรือข้อความก่อน"
        : "A rebuild is not always needed. If the current site can be edited, works on a phone, and can connect to the booking system, the team may first recommend changing the structure, room pages, photos, or copy.",
      close: thai
        ? "หากระบบเดิมจำกัดการใช้งานหรือดูแลต่อยาก เราจะอธิบายเหตุผลและขอบเขตของการสร้างใหม่ให้โรงแรมเห็นก่อนตัดสินใจ"
        : "If the current system limits use or is hard to look after, we explain the reason and the scope of a new build before the hotel decides.",
      note: thai ? WEBSITE_DECISION_NOTE.th : WEBSITE_DECISION_NOTE.en,
      paths: WEBSITE_DECISION_PATHS.map((path) => ({
        id: path.id,
        title: thai ? path.titleTh : path.titleEn,
        starting: [...(thai ? path.startingTh : path.startingEn)],
        advantages: thai ? path.advantagesTh : path.advantagesEn,
        risks: thai ? path.risksTh : path.risksEn,
        dependencies: thai ? path.dependenciesTh : path.dependenciesEn,
        next: thai ? path.nextTh : path.nextEn,
      })),
      visual: sampleVisual(WEBSITE_DECISION_VISUAL),
    },
    workflow: {
      title: thai ? "วิธีทำงาน" : "How the work runs",
      steps: WEBSITE_WORKFLOW_STEPS.map((step) => ({
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
      handover: WEBSITE_WORKFLOW_HANDOVER.map((item) => ({ id: item.id, label: thai ? item.th : item.en })),
      visual: sampleVisual(WEBSITE_WORKFLOW_VISUAL),
    },
    measure: {
      title: thai ? "เราวัดผลอะไร?" : "What do we measure?",
      body: thai
        ? "เราดู Engagement, Mobile, Contact Intent และ Booking Outcome การคลิกจองยังไม่ใช่การจองสำเร็จ"
        : "We look at Engagement, Mobile, Contact Intent, and Booking Outcome. A Book click is not a completed booking.",
      note: thai
        ? "Booking Outcome จะแสดงได้เมื่อ Booking Engine และ Tracking Event เชื่อมต่อและได้รับอนุญาตให้ใช้ข้อมูล"
        : "Booking Outcome is shown only when the Booking Engine and tracking events are connected and approved for use.",
      visual: sampleVisual(WEBSITE_KPI_VISUAL),
      kpis: WEBSITE_KPIS.map((kpi, index) => {
        const series = WEBSITE_KPI_SAMPLE_SERIES.find((item) => item.group === kpi.group);
        return {
          id: kpi.id,
          name: thai ? kpi.nameTh : kpi.nameEn,
          group: kpi.group,
          period: thai ? WEBSITE_KPI_SAMPLE.periodTh : kpi.period,
          unit: kpi.unit,
          definition: kpi.definition,
          comparison: thai && kpi.comparison === WEBSITE_KPI_SAMPLE.comparison ? WEBSITE_KPI_SAMPLE.comparisonTh : kpi.comparison,
          target: series?.target || "",
          market: thai ? WEBSITE_KPI_SAMPLE.marketTh : kpi.market,
          source: thai ? WEBSITE_KPI_SAMPLE.sourceTh : kpi.source,
          sourceUrl: "",
          value: "",
          labels: series ? [...series.labels] : [],
          values: series ? [...series.values] : [],
          dataStatus: kpi.dataStatus,
          hideUntilData: kpi.hideUntilData,
          updatedAt: kpi.updatedAt,
          tone: kpi.tone,
          order: index + 1,
        };
      }),
      tracking: {
        bookingEngineConfigured: false,
        trackingConfigured: false,
        boundary: thai
          ? "Booking Outcome แสดงได้เมื่อ Booking Engine และ Tracking Event เชื่อมต่อ และโรงแรมอนุญาตให้ใช้ข้อมูล การคลิกจองยังไม่ใช่การจองสำเร็จ"
          : "Booking Outcome is shown only when the Booking Engine and tracking events are connected and the hotel approves the data. A Book click is not a completed booking.",
        events: [
          { id: "page-view", name: "Page view", status: "supported" },
          { id: "room-detail", name: "Room detail view", status: "supported" },
          { id: "cta-click", name: "CTA click", status: "supported" },
          { id: "booking-start", name: "Booking Engine start", status: "supported" },
          { id: "booking-complete", name: "Booking complete", status: "not-configured" },
        ],
      },
    },
    related: {
      title: thai ? "เรื่องที่เกี่ยวข้องกับเว็บไซต์ การค้นหา และการจองตรง" : "Related reading on the website, search, and direct booking",
      visual: sampleVisual(WEBSITE_RELATED_VISUAL),
      cards: websiteRelatedCards(locale).map((card, index) => ({
        id: card.id,
        title: thai ? card.titleTh : card.titleEn,
        body: thai ? card.descriptionTh : card.descriptionEn,
        href: card.href,
        cta: thai ? card.ctaTh : card.ctaEn,
        featured: Boolean(card.featured),
        publicationApproved: false,
        order: index + 1,
      })),
    },
    form: {
      kicker: copy.kicker,
      title: copy.heading,
      body: copy.lead,
      submit: copy.submit,
      receiveTitle: copy.receiveTitle,
      receive: WEBSITE_ENQUIRY_RECEIVE.map((item) => ({
        id: item.id,
        title: item.title,
        label: item.title,
        body: thai ? item.th : item.en,
      })),
      nextTitle: copy.nextTitle,
      steps: copy.steps,
      labels: {
        name: copy.labels.name,
        business: copy.labels.business,
        contact: copy.labels.contact,
        website: copy.fields.website,
        bookingEngine: copy.fields.bookingEngine,
        cms: copy.fields.cms,
        goal: copy.fields.goal,
        challenge: copy.fields.challenge,
        timeline: copy.fields.timeline,
        issue: copy.fields.challenge,
        consent: copy.labels.consent,
        privacy: copy.labels.privacy,
      },
    },
    faqs: faqs.map((faq, index) => ({
      id: `faq-${index + 1}`,
      q: faq.q,
      a: faq.a,
      qEn: faqsEn[index]?.q || "",
      aEn: faqsEn[index]?.a || "",
    })),
    seo: { social: emptyVisual(), canonical: HOTEL_WEBSITE_PAGE_ROUTE, variants: defaultSeoVariants() },
    approvals: emptyApprovals(),
  };
}
