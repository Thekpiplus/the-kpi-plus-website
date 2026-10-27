import {
  ADS_CHANNEL_ROWS,
  ADS_CHANNEL_VISUAL,
  ADS_CHANNEL_VISUAL_CANDIDATE,
  ADS_ENQUIRY,
  ADS_ENQUIRY_RECEIVE,
  ADS_FRAMEWORK_VISUAL_CANDIDATE,
  ADS_HERO_VISUAL,
  ADS_HERO_VISUAL_CANDIDATE,
  ADS_KPIS,
  ADS_KPI_VISUAL,
  ADS_KPI_VISUAL_CANDIDATE,
  adsKpiSeriesReady,
  ADS_LANDING_CHECKLIST,
  ADS_READINESS_VISUAL,
  ADS_RELATED_VISUAL,
  ADS_RELATED_VISUAL_CANDIDATE,
  ADS_TRACKING_BOUNDARY,
  ADS_VISIBILITY_VISUAL,
  ADS_VISIBILITY_VISUAL_CANDIDATE,
  ADS_WORKFLOW_STEPS,
  ADS_WORKFLOW_VISUAL,
  ADS_WORKFLOW_VISUAL_CANDIDATE,
  adsFaqs,
  type AdsKpiStatus,
  type AdsVisualStatus,
} from "@/lib/google-ads";
import { formatInsightDate, insightExcerpt, insightPosts, insightsIndexCopy, insightUpdatedAt } from "@/lib/insights";
import { solutionNavLabel } from "@/lib/nav";
import { existingHref, type Locale } from "@/lib/seo";

export const GOOGLE_ADS_CMS_TEMPLATE = "google-ads-management";
export const GOOGLE_ADS_PAGE_SLUG = "solutions/google-ads-management";
export const GOOGLE_ADS_PAGE_ROUTE = "/solutions/google-ads-management";

export const ADS_CMS_INTENTS = ["save", "draft", "preview", "publish", "unpublish"] as const;
export type AdsCmsIntent = (typeof ADS_CMS_INTENTS)[number];
export const ADS_CMS_VISUAL_STATUSES = ["placeholder", "sample", "approved", "real"] as const;
export const ADS_CMS_KPI_STATUSES = ["draft", "sample", "approved", "anonymised"] as const;
export type AdsCmsSaveResult = { ok: true; id: string; intent: AdsCmsIntent } | { ok: false; error: string };

export type CmsAdsCta = { label: string; href: string };
export type CmsAdsVisual = {
  src: string;
  altTh: string;
  altEn: string;
  status: AdsVisualStatus;
  label: string;
  caption: string;
  containsGoogleBrand: boolean;
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

export type CmsAdsChannelRow = {
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

export type CmsAdsKpi = {
  id: string;
  name: string;
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

export type CmsAdsRelatedCard = {
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

export type CmsGoogleAdsPage = {
  version: 1;
  template: typeof GOOGLE_ADS_CMS_TEMPLATE;
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
  visibility: { title: string; body: string; note: string; visual: CmsAdsVisual };
  readiness: { title: string; body: string; visual: CmsAdsVisual; items: CmsAdsReadinessItem[] };
  channels: { title: string; visual: CmsAdsVisual; rows: CmsAdsChannelRow[] };
  workflow: { title: string; visual: CmsAdsVisual; steps: CmsAdsWorkflowStep[] };
  checklists: { tracking: CmsAdsChecklist; landing: CmsAdsChecklist };
  measure: { title: string; intro: string; close: string; visual: CmsAdsVisual; kpis: CmsAdsKpi[] };
  related: { title: string; visual: CmsAdsVisual; cards: CmsAdsRelatedCard[] };
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

export type AdsEditorState = {
  id: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  locale: string;
  status: string;
  content: CmsGoogleAdsPage;
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
    containsGoogleBrand: false,
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
    challenge: "",
    consent: "",
    privacy: "",
  };
}

export function emptyGoogleAdsCms(): CmsGoogleAdsPage {
  return {
    version: 1,
    template: GOOGLE_ADS_CMS_TEMPLATE,
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
    visibility: { title: "", body: "", note: "", visual: emptyVisual() },
    readiness: { title: "", body: "", visual: emptyVisual(), items: [] },
    channels: { title: "", visual: emptyVisual(), rows: [] },
    workflow: { title: "", visual: emptyVisual(), steps: [] },
    checklists: { tracking: emptyChecklist(), landing: emptyChecklist() },
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
  return ADS_CMS_VISUAL_STATUSES.includes(value as AdsVisualStatus) ? (value as AdsVisualStatus) : "placeholder";
}

function asKpiStatus(value: unknown): AdsKpiStatus {
  return ADS_CMS_KPI_STATUSES.includes(value as AdsKpiStatus) ? (value as AdsKpiStatus) : "sample";
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
    containsGoogleBrand: bool(row.containsGoogleBrand, fallback.containsGoogleBrand),
    brandNote: asString(row.brandNote, fallback.brandNote),
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
    challenge: asString(row.challenge, fallback.challenge),
    consent: asString(row.consent, fallback.consent),
    privacy: asString(row.privacy, fallback.privacy),
  };
}

function defaultFormLabels(locale: Locale): CmsAdsFormLabels {
  const thai = locale === "th";
  const labels = thai ? ADS_ENQUIRY.labels.th : ADS_ENQUIRY.labels.en;
  const fields = thai ? ADS_ENQUIRY.fields.th : ADS_ENQUIRY.fields.en;
  return {
    name: labels.name,
    business: labels.business,
    contact: labels.contact,
    website: fields.website,
    goal: fields.goal,
    market: fields.market,
    adsStatus: fields.adsStatus,
    challenge: fields.challenge,
    consent: labels.consent,
    privacy: labels.privacy,
  };
}

function defaultChecklist(source: typeof ADS_TRACKING_BOUNDARY | typeof ADS_LANDING_CHECKLIST, locale: Locale): CmsAdsChecklist {
  const thai = locale === "th";
  return {
    title: thai ? source.title.th : source.title.en,
    note: thai ? source.note.th : source.note.en,
    items: [...(thai ? source.items.th : source.items.en)],
  };
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
  kinds: Array<"hero" | "visibility" | "framework" | "channels" | "workflow" | "kpi" | "related">,
) {
  const next = src.trim();
  if (!next) return false;
  const map = {
    hero: ["google-ads-management-hero", ADS_HERO_VISUAL_CANDIDATE],
    visibility: ["google-ads-management-visibility", ADS_VISIBILITY_VISUAL_CANDIDATE],
    framework: ["google-ads-search-readiness-framework", ADS_FRAMEWORK_VISUAL_CANDIDATE],
    channels: ["google-ads-channel-comparison", ADS_CHANNEL_VISUAL_CANDIDATE],
    workflow: ["google-ads-campaign-workflow", ADS_WORKFLOW_VISUAL_CANDIDATE],
    kpi: ["google-ads-performance-kpi", ADS_KPI_VISUAL_CANDIDATE],
    related: ["google-ads-related-content", ADS_RELATED_VISUAL_CANDIDATE],
  } as const;
  return kinds.some((kind) => map[kind].some((token) => next === token || next.includes(token)));
}

function parseRelatedVisual(value: unknown, locale: Locale): CmsAdsVisual {
  const thai = locale === "th";
  const visual = parseVisual(value, {
    ...emptyVisual(),
    status: "sample",
    label: ADS_RELATED_VISUAL.label.en,
    altTh: ADS_RELATED_VISUAL.alt.th,
    altEn: ADS_RELATED_VISUAL.alt.en,
    caption: thai ? ADS_RELATED_VISUAL.caption.th : ADS_RELATED_VISUAL.caption.en,
  });
  if (!visual.label.trim() || isGenericRelatedLabel(visual.label)) {
    visual.label = ADS_RELATED_VISUAL.label.en;
  }
  if (!visual.caption.trim() || isGenericRelatedLabel(visual.caption)) {
    visual.caption = thai ? ADS_RELATED_VISUAL.caption.th : ADS_RELATED_VISUAL.caption.en;
  }
  if (!visual.altTh.trim() || /กราฟตัวอย่าง|ดัชนีผลงาน|รูปคน/.test(visual.altTh)) {
    visual.altTh = ADS_RELATED_VISUAL.alt.th;
  }
  if (!visual.altEn.trim() || /person photo|search, website, and direct-booking/i.test(visual.altEn)) {
    visual.altEn = ADS_RELATED_VISUAL.alt.en;
  }
  if (isReusedAdsVisualSrc(visual.src, ["hero", "visibility", "framework", "channels", "workflow", "kpi"])) {
    visual.src = "";
  }
  return visual;
}

export function defaultGoogleAdsRelatedCards(locale: Locale = "th"): CmsAdsRelatedCard[] {
  const thai = locale === "th";
  const ui = insightsIndexCopy[locale] ?? insightsIndexCopy.en;
  const insightType = thai ? "บทความ" : "Insight";
  const serviceType = thai ? "บริการ" : "Solution";
  const toolType = thai ? "เครื่องมือ" : "Tool";
  const serviceCta = thai ? "ดูบริการ" : "View service";
  const toolCta = thai ? "ใช้เครื่องมือฟรี" : "Use the free tool";
  const cards: CmsAdsRelatedCard[] = [];

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

  addInsight("/insights/seo-vs-sem-for-hotels-which-one-should-you-focus-on", true);
  addInsight("/insights/hotel-marketing");
  addInsight("/insights/direct-booking-journey-audit");
  cards.push({
    id: "hotel-systems-implementation",
    href: "/solutions/hotel-systems-implementation",
    category: "Booking Engine",
    title:
      solutionNavLabel("/solutions/hotel-systems-implementation", locale) ||
      (thai ? "ระบบโรงแรมและการนำไปใช้" : "Hotel Systems & Implementation"),
    description: thai
      ? "ช่วยตั้งค่า เชื่อมต่อ และปรับ PMS, Channel Manager และ Booking Engine ให้การทำงานด้านรายได้ชัดขึ้น"
      : "Set up, connect, and structure the PMS, channel manager, and booking engine so hotel revenue work is clearer.",
    publishedAt: "",
    updatedAt: "",
    contentType: serviceType,
    readingTime: "",
    meta: thai ? "หน้าบริการ" : "Service page",
    cta: serviceCta,
    featured: false,
  });
  cards.push({
    id: "hotel-direct-bookings",
    href: "/solutions/hotel-direct-bookings",
    category: "Conversion Tracking",
    title:
      solutionNavLabel("/solutions/hotel-direct-bookings", locale) ||
      (thai ? "เพิ่มการจองผ่านเว็บไซต์" : "Website Conversion & Direct Bookings"),
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
    title: thai ? "คำนวณค่าคอมมิชชัน OTA" : "OTA commission calculator",
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
  return cards;
}

export function relatedCardDateLabel(card: CmsAdsRelatedCard, locale: Locale) {
  const updated = card.updatedAt.trim();
  const published = card.publishedAt.trim();
  const iso = updated && updated !== published ? updated : published;
  if (!iso) return "";
  const ui = insightsIndexCopy[locale] ?? insightsIndexCopy.en;
  const prefix = updated && updated !== published ? ui.updated : ui.published;
  return `${prefix} ${formatInsightDate(iso, locale)}`;
}

export function relatedCardTypeLabel(card: CmsAdsRelatedCard) {
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
  ota: "ota-commission-calculator",
};

function parseRelatedCardRow(row: Record<string, unknown>, index: number, defaults: CmsAdsRelatedCard[]): CmsAdsRelatedCard {
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

function parseRelatedCards(value: unknown, locale: Locale): CmsAdsRelatedCard[] {
  const defaults = defaultGoogleAdsRelatedCards(locale);
  if (!Array.isArray(value)) return defaults;
  const rows = value.filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"));
  if (!rows.length) return [];
  const parsed = rows.map((row, index) => parseRelatedCardRow(row, index, defaults)).filter((card) => card.href && card.title);
  return parsed.length ? parsed : defaults;
}

function parseCta(value: unknown, fallback: CmsAdsCta): CmsAdsCta {
  if (!value || typeof value !== "object") return { ...fallback };
  const row = value as Record<string, unknown>;
  return { label: asString(row.label, fallback.label), href: asString(row.href, fallback.href) };
}

export function serializeGoogleAdsPageBody(content: CmsGoogleAdsPage) {
  return JSON.stringify(content);
}

export function isGoogleAdsCmsBody(body: string) {
  try {
    const parsed = JSON.parse(body) as { template?: string };
    return parsed?.template === GOOGLE_ADS_CMS_TEMPLATE;
  } catch {
    return false;
  }
}

export function parseGoogleAdsPageBody(body: string, locale: Locale): CmsGoogleAdsPage | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(body);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  const row = parsed as Record<string, unknown>;
  if (row.template !== GOOGLE_ADS_CMS_TEMPLATE) return null;
  const fallback = emptyGoogleAdsCms();
  const hero = (row.hero && typeof row.hero === "object" ? row.hero : {}) as Record<string, unknown>;
  const visibility = (row.visibility && typeof row.visibility === "object" ? row.visibility : {}) as Record<string, unknown>;
  const readiness = (row.readiness && typeof row.readiness === "object" ? row.readiness : {}) as Record<string, unknown>;
  const channels = (row.channels && typeof row.channels === "object" ? row.channels : {}) as Record<string, unknown>;
  const workflow = (row.workflow && typeof row.workflow === "object" ? row.workflow : {}) as Record<string, unknown>;
  const measure = (row.measure && typeof row.measure === "object" ? row.measure : {}) as Record<string, unknown>;
  const related = (row.related && typeof row.related === "object" ? row.related : {}) as Record<string, unknown>;
  const checklists = (row.checklists && typeof row.checklists === "object" ? row.checklists : {}) as Record<string, unknown>;
  const form = (row.form && typeof row.form === "object" ? row.form : {}) as Record<string, unknown>;
  const seo = (row.seo && typeof row.seo === "object" ? row.seo : {}) as Record<string, unknown>;
  const thai = locale === "th";

  return {
    version: 1,
    template: GOOGLE_ADS_CMS_TEMPLATE,
    hero: {
      eyebrow: asString(hero.eyebrow),
      title: asString(hero.title),
      description: asString(hero.description),
      primaryCta: parseCta(hero.primaryCta, fallback.hero.primaryCta),
      secondaryCta: parseCta(hero.secondaryCta, fallback.hero.secondaryCta),
      underCta: asString(hero.underCta),
      caption: asString(hero.caption, thai ? ADS_HERO_VISUAL.caption.th : ADS_HERO_VISUAL.caption.en),
      visual: parseVisual(hero.visual, {
        ...emptyVisual(),
        status: "sample",
        label: thai ? ADS_HERO_VISUAL.label.th : ADS_HERO_VISUAL.label.en,
        altTh: ADS_HERO_VISUAL.alt.th,
        altEn: ADS_HERO_VISUAL.alt.en,
        caption: thai ? ADS_HERO_VISUAL.caption.th : ADS_HERO_VISUAL.caption.en,
      }),
    },
    visibility: {
      title: asString(visibility.title),
      body: asString(visibility.body),
      note: asString(visibility.note),
      visual: parseVisual(visibility.visual, {
        ...emptyVisual(),
        status: "sample",
        label: thai ? ADS_VISIBILITY_VISUAL.label.th : ADS_VISIBILITY_VISUAL.label.en,
        altTh: ADS_VISIBILITY_VISUAL.alt.th,
        altEn: ADS_VISIBILITY_VISUAL.alt.en,
        caption: thai ? ADS_VISIBILITY_VISUAL.caption.th : ADS_VISIBILITY_VISUAL.caption.en,
      }),
    },
    readiness: {
      title: asString(readiness.title),
      body: asString(readiness.body),
      visual: parseVisual(readiness.visual, {
        ...emptyVisual(),
        status: "sample",
        label: thai ? ADS_READINESS_VISUAL.label.th : ADS_READINESS_VISUAL.label.en,
        altTh: ADS_READINESS_VISUAL.alt.th,
        altEn: ADS_READINESS_VISUAL.alt.en,
        caption: thai ? ADS_READINESS_VISUAL.caption.th : ADS_READINESS_VISUAL.caption.en,
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
        label: thai ? ADS_CHANNEL_VISUAL.label.th : ADS_CHANNEL_VISUAL.label.en,
        altTh: ADS_CHANNEL_VISUAL.alt.th,
        altEn: ADS_CHANNEL_VISUAL.alt.en,
        caption: thai ? ADS_CHANNEL_VISUAL.caption.th : ADS_CHANNEL_VISUAL.caption.en,
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
        : ADS_CHANNEL_ROWS.map((item, index) => ({
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
    workflow: {
      title: asString(workflow.title),
      visual: parseVisual(workflow.visual, {
        ...emptyVisual(),
        status: "sample",
        label: thai ? ADS_WORKFLOW_VISUAL.label.th : ADS_WORKFLOW_VISUAL.label.en,
        altTh: ADS_WORKFLOW_VISUAL.alt.th,
        altEn: ADS_WORKFLOW_VISUAL.alt.en,
        caption: thai ? ADS_WORKFLOW_VISUAL.caption.th : ADS_WORKFLOW_VISUAL.caption.en,
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
        : ADS_WORKFLOW_STEPS.map((item, index) => ({
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
    checklists: {
      tracking: parseChecklist(checklists.tracking, defaultChecklist(ADS_TRACKING_BOUNDARY, locale)),
      landing: parseChecklist(checklists.landing, defaultChecklist(ADS_LANDING_CHECKLIST, locale)),
    },
    measure: {
      title: asString(measure.title),
      intro: asString(measure.intro),
      close: asString(measure.close),
      visual: parseVisual(measure.visual, {
        ...emptyVisual(),
        status: "sample",
        label: thai ? ADS_KPI_VISUAL.label.th : ADS_KPI_VISUAL.label.en,
        altTh: ADS_KPI_VISUAL.alt.th,
        altEn: ADS_KPI_VISUAL.alt.en,
        caption: thai ? ADS_KPI_VISUAL.caption.th : ADS_KPI_VISUAL.caption.en,
      }),
      kpis: Array.isArray(measure.kpis)
        ? measure.kpis.map((item, index) => {
            const rowItem = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
            const labels = asStringList(rowItem.labels);
            const values = asNumberList(rowItem.values);
            const seriesReady = adsKpiSeriesReady(labels, values);
            return {
              id: asString(rowItem.id, `kpi-${index + 1}`),
              name: asString(rowItem.name),
              definition: asString(rowItem.definition),
              unit: asString(rowItem.unit),
              period: asString(rowItem.period),
              target: asString(rowItem.target),
              value: asString(rowItem.value),
              context: asString(rowItem.context),
              labels: seriesReady ? labels : [],
              values: seriesReady ? values : [],
              tone: asKpiTone(rowItem.tone),
              dataStatus: asKpiStatus(rowItem.dataStatus),
              updatedAt: asString(rowItem.updatedAt),
              hideUntilData: Boolean(rowItem.hideUntilData),
            };
          })
        : ADS_KPIS.map((kpi) => ({
            id: kpi.id,
            name: kpi.name,
            definition: thai ? kpi.definitionTh : kpi.definitionEn,
            unit: kpi.unit,
            period: "",
            target: "",
            value: "",
            context: thai ? kpi.contextTh : kpi.contextEn,
            labels: [],
            values: [],
            tone: kpi.tone,
            dataStatus: "sample" as const,
            updatedAt: "",
            hideUntilData: true,
          })),
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
      receive: Array.isArray(form.receive) ? form.receive.map((item) => String(item)) : ADS_ENQUIRY_RECEIVE.map((item) => item.title),
      nextTitle: asString(form.nextTitle, thai ? ADS_ENQUIRY.nextTitle.th : ADS_ENQUIRY.nextTitle.en),
      steps: Array.isArray(form.steps)
        ? form.steps.map((item) => String(item)).filter((item) => item.trim())
        : thai
          ? [...ADS_ENQUIRY.steps.th]
          : [...ADS_ENQUIRY.steps.en],
      labels: parseFormLabels(form.labels, defaultFormLabels(locale)),
      visual: parseVisual(form.visual, emptyVisual()),
    },
    faqs: Array.isArray(row.faqs)
      ? row.faqs
          .map((item, index) => {
            const faq = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
            return { id: asString(faq.id, `faq-${index + 1}`), q: asString(faq.q), a: asString(faq.a) };
          })
          .filter((item) => item.q || item.a)
      : adsFaqs(locale).map((item, index) => ({ id: `faq-${index + 1}`, q: item.q, a: item.a })),
    seo: { social: parseVisual(seo.social, emptyVisual()) },
  };
}

function walkStrings(value: unknown, visit: (text: string) => void) {
  if (typeof value === "string") visit(value);
  else if (Array.isArray(value)) value.forEach((item) => walkStrings(item, visit));
  else if (value && typeof value === "object") Object.values(value).forEach((item) => walkStrings(item, visit));
}

function hasPrivateData(content: CmsGoogleAdsPage) {
  let found = false;
  walkStrings(content, (text) => {
    if (EMAIL_RE.test(text) || PHONE_RE.test(text) || ACCOUNT_RE.test(text)) found = true;
  });
  return found;
}

export function validateGoogleAdsPage(content: CmsGoogleAdsPage, intent: AdsCmsIntent) {
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
    if (visual.src && visual.containsGoogleBrand && !visual.brandNote.trim()) return "brand_note";
  }
  for (const kpi of content.measure.kpis) {
    if (kpi.hideUntilData || kpi.dataStatus === "draft") continue;
    const publicReady = kpi.dataStatus === "approved" || kpi.dataStatus === "anonymised" || kpi.dataStatus === "sample";
    const hasValue = Boolean(kpi.value.trim() || adsKpiSeriesReady(kpi.labels, kpi.values));
    if (
      publicReady &&
      (!kpi.name.trim() ||
        !kpi.period.trim() ||
        !(kpi.unit.trim() || kpi.definition.trim()) ||
        !kpi.context.trim() ||
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

export function adsCmsErrorMessage(code: string) {
  const table: Record<string, string> = {
    invalid_cta: "ลิงก์ปุ่มต้องเป็น /path, #anchor, mailto, tel หรือ http(s)",
    missing_alt: "รูปที่เผยแพร่ต้องมีคำอธิบายภาพภาษาไทยและภาษาอังกฤษ",
    placeholder_status: "เปลี่ยนสถานะรูปจาก Placeholder เป็น Sample หรือ Approved ก่อนเผยแพร่",
    placeholder_label: "อย่าเผยแพร่ข้อความ Placeholder ถ้าสถานะไม่ใช่ Sample",
    kpi_incomplete: "KPI ที่เผยแพร่ต้องมีชื่อ ช่วงเวลา หน่วยหรือคำนิยาม แคมเปญหรือช่องทาง ค่าที่แสดง และสถานะข้อมูล",
    empty_faq: "คำถามและคำตอบใน FAQ ต้องไม่ว่างเมื่อเผยแพร่",
    brand_note: "รูปที่มีโลโก้หรือแบรนด์ Google ต้องมีบันทึกการอนุญาตหรือการอนุมัติก่อนเผยแพร่",
    screenshot_approval: "ภาพหน้าจอจริงต้องมีสถานะ Approved หรือ Real ก่อนเผยแพร่ หรือตั้งเป็น Sample อย่างชัดเจน",
    required_fields: "กรอกหัวข้อและคำอธิบายของส่วน Hero ก่อนเผยแพร่",
    invalid_image: "อัปโหลดได้เฉพาะ JPG PNG หรือ WEBP ขนาดไม่เกิน 5MB",
    missing: "ไม่พบหน้าเพจ",
    invalid_json: "ข้อมูลฟอร์มไม่ถูกต้อง",
    private_data: "ห้ามเผยแพร่อีเมล เบอร์โทร รหัสบัญชีโฆษณา หรือข้อมูลลูกค้า",
  };
  return table[code] ?? "บันทึกไม่สำเร็จ";
}

export function editorStateFromGoogleAdsDocument(input: {
  id: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  locale: string;
  status: string;
  body: string;
  ogImage?: string;
}): AdsEditorState {
  const locale = (["th", "en", "ru", "zh"].includes(input.locale) ? input.locale : "th") as Locale;
  const content = parseGoogleAdsPageBody(input.body, locale) ?? emptyGoogleAdsCms();
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

export function isGoogleAdsPageDocument(input: { slug: string; template: string }) {
  if (input.template === GOOGLE_ADS_CMS_TEMPLATE) return true;
  return (
    input.slug === GOOGLE_ADS_PAGE_SLUG ||
    input.slug === "en/solutions/google-ads-management" ||
    input.slug === "ru/solutions/google-ads-management" ||
    input.slug === "zh/solutions/google-ads-management"
  );
}

export function newAdsItemId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}
