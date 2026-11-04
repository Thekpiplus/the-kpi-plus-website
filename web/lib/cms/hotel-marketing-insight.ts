/**
 * Structured CMS model for the "Hotel Marketing" insight article.
 *
 * Lives inside the existing KPI Plus CMS (`CmsDocument`, kind = "insight"). The structured JSON is stored in
 * `CmsDocument.body`; the markdown/handoff pipeline is untouched for every other article.
 *
 * Public content is bilingual (`LocaleText`). English article body is NEVER invented: `bodyEn`-style fields stay
 * empty until a human authors them, and `translation.enReady` gates publishing of EN content.
 */

export const HOTEL_MARKETING_CMS_TEMPLATE = "hotel-marketing";
export const HOTEL_MARKETING_SLUG = "hotel-marketing";
export const HOTEL_MARKETING_ROUTE = "/insights/hotel-marketing";

export const HM_CMS_INTENTS = ["save", "draft", "preview", "publish", "unpublish"] as const;
export const HM_VISUAL_STATUSES = ["placeholder", "sample", "approved", "real"] as const;
export const HM_CLAIM_STATUSES = ["draft", "sample", "verified", "requires_review"] as const;
export const HM_PERMISSION_STATUSES = ["not_applicable", "pending", "approved", "redacted", "denied"] as const;

export const HM_SECTION_TYPES = [
  "intro",
  "definition",
  "why",
  "strategies_intro",
  "metrics",
  "compare",
  "start",
  "conclusion",
  "custom",
] as const;
export const HM_SOURCE_STATUSES = ["guidance", "platform", "sample", "verified"] as const;
export const HM_VISUAL_MODES = ["diagram", "image"] as const;

/** Diagram ids understood by the public renderer. An empty `diagramId` means "no visual". */
export const HM_DIAGRAM_IDS = [
  "seo",
  "gbp",
  "ota",
  "direct",
  "social",
  "ads",
  "review",
  "revenue",
  "channel",
  "journey",
  "kpi",
  "swimlane",
  "roadmap",
  "cover",
] as const;

export type HmCmsIntent = (typeof HM_CMS_INTENTS)[number];
export type HmVisualStatus = (typeof HM_VISUAL_STATUSES)[number];
export type HmClaimStatus = (typeof HM_CLAIM_STATUSES)[number];
export type HmPermissionStatus = (typeof HM_PERMISSION_STATUSES)[number];
export type HmSectionType = (typeof HM_SECTION_TYPES)[number];
export type HmSourceStatus = (typeof HM_SOURCE_STATUSES)[number];
export type HmVisualMode = (typeof HM_VISUAL_MODES)[number];
export type HmCmsSaveResult = { ok: true; id: string; intent: HmCmsIntent } | { ok: false; error: string };

export type LocaleText = { th: string; en: string };

export type CmsHmVisual = {
  mode: HmVisualMode;
  /** e.g. seo, gbp, ota, direct, social, ads, review, revenue, channel, journey, kpi, swimlane, roadmap, cover */
  diagramId: string;
  src: string;
  alt: LocaleText;
  caption: LocaleText;
  label: string;
  status: HmVisualStatus;
  permissionStatus: HmPermissionStatus;
  permissionNote: string;
  assetSource: string;
};

export type CmsHmSource = {
  id: string;
  label: LocaleText;
  url: string;
  publishedAt: string;
  accessedAt: string;
  period: string;
  definition: string;
  status: HmSourceStatus;
};

export type CmsHmSection = {
  id: string;
  type: HmSectionType;
  heading: LocaleText;
  /** Markdown-ish paragraphs separated by \n\n */
  bodyTh: string;
  bodyEn: string;
  bulletsTh: string[];
  bulletsEn: string[];
  visual: CmsHmVisual;
  sourceIds: string[];
  tocLabel: LocaleText;
  tocAnchor: string;
  showInToc: boolean;
  order: number;
};

export type CmsHmStrategy = {
  id: string;
  /** "01".."08" */
  num: string;
  title: LocaleText;
  bodyTh: string;
  bodyEn: string;
  visual: CmsHmVisual;
  sourceIds: string[];
  order: number;
};

export type CmsHmMetric = {
  id: string;
  name: string;
  question: LocaleText;
  definition: LocaleText;
  period: string;
  source: string;
  owner: string;
  value: string;
  status: HmClaimStatus;
  order: number;
};

export type CmsHmCompareLane = { id: string; role: LocaleText; focus: LocaleText; order: number };
export type CmsHmHandoff = { id: string; from: string; text: LocaleText; order: number };
export type CmsHmStartStep = { id: string; title: LocaleText; order: number };
export type CmsHmRelatedService = { id: string; href: string; why: LocaleText; order: number };
export type CmsHmRelatedArticle = { id: string; articleId: string; order: number };
export type CmsHmCta = { title: LocaleText; body: LocaleText; buttonLabel: LocaleText };

export type CmsHotelMarketingInsight = {
  version: 1;
  kind: "hotel-marketing-insight";
  /** Visibility, Interest, ... */
  journeyLabels: string[];
  summaryCallout: LocaleText;
  cover: CmsHmVisual;
  authorName: string;
  authorVerified: boolean;
  reviewerName: string;
  reviewerVerified: boolean;
  /** YYYY-MM-DD */
  publishedAt: string;
  updatedAt: string;
  readingTimeMinutes: number;
  category: LocaleText;
  title: LocaleText;
  excerpt: LocaleText;
  sections: CmsHmSection[];
  strategies: CmsHmStrategy[];
  metricsIntroTh: string;
  metricsIntroEn: string;
  metricsNoteTh: string;
  metricsNoteEn: string;
  metrics: CmsHmMetric[];
  compare: {
    heading: LocaleText;
    bodyTh: string;
    bodyEn: string;
    visual: CmsHmVisual;
    lanes: CmsHmCompareLane[];
    handoffs: CmsHmHandoff[];
  };
  startHere: {
    heading: LocaleText;
    introTh: string;
    introEn: string;
    visual: CmsHmVisual;
    steps: CmsHmStartStep[];
    closingTh: string;
    closingEn: string;
  };
  conclusion: { heading: LocaleText; bodyTh: string; bodyEn: string };
  relatedServices: CmsHmRelatedService[];
  relatedArticles: CmsHmRelatedArticle[];
  cta: CmsHmCta;
  references: CmsHmSource[];
  referencesNote: LocaleText;
  seo: { title: LocaleText; description: LocaleText; canonical: string; social: CmsHmVisual };
  translation: { enEnabled: boolean; enReady: boolean; duplicateOfLocale: string };
};

export type HmEditorState = {
  id: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  canonical: string;
  locale: string;
  status: string;
  content: CmsHotelMarketingInsight;
};

/* ------------------------------------------------------------------------------------------------------------ */
/* Factories                                                                                                    */
/* ------------------------------------------------------------------------------------------------------------ */

export function emptyLocaleText(): LocaleText {
  return { th: "", en: "" };
}

export function emptyVisual(diagramId = ""): CmsHmVisual {
  return {
    mode: "diagram",
    diagramId,
    src: "",
    alt: emptyLocaleText(),
    caption: emptyLocaleText(),
    label: "",
    status: "placeholder",
    permissionStatus: "not_applicable",
    permissionNote: "",
    assetSource: "",
  };
}

export function newHmItemId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function emptyHotelMarketingInsight(): CmsHotelMarketingInsight {
  return {
    version: 1,
    kind: "hotel-marketing-insight",
    journeyLabels: [],
    summaryCallout: emptyLocaleText(),
    cover: emptyVisual("cover"),
    authorName: "",
    authorVerified: false,
    reviewerName: "",
    reviewerVerified: false,
    publishedAt: "",
    updatedAt: "",
    readingTimeMinutes: 0,
    category: emptyLocaleText(),
    title: emptyLocaleText(),
    excerpt: emptyLocaleText(),
    sections: [],
    strategies: [],
    metricsIntroTh: "",
    metricsIntroEn: "",
    metricsNoteTh: "",
    metricsNoteEn: "",
    metrics: [],
    compare: {
      heading: emptyLocaleText(),
      bodyTh: "",
      bodyEn: "",
      visual: emptyVisual("swimlane"),
      lanes: [],
      handoffs: [],
    },
    startHere: {
      heading: emptyLocaleText(),
      introTh: "",
      introEn: "",
      visual: emptyVisual("roadmap"),
      steps: [],
      closingTh: "",
      closingEn: "",
    },
    conclusion: { heading: emptyLocaleText(), bodyTh: "", bodyEn: "" },
    relatedServices: [],
    relatedArticles: [],
    cta: { title: emptyLocaleText(), body: emptyLocaleText(), buttonLabel: emptyLocaleText() },
    references: [],
    referencesNote: emptyLocaleText(),
    seo: { title: emptyLocaleText(), description: emptyLocaleText(), canonical: "", social: emptyVisual("cover") },
    translation: { enEnabled: false, enReady: false, duplicateOfLocale: "" },
  };
}

/* ------------------------------------------------------------------------------------------------------------ */
/* Parsing / serialising                                                                                        */
/* ------------------------------------------------------------------------------------------------------------ */

type Row = Record<string, unknown>;

function isRow(value: unknown): value is Row {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function bool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function int(value: unknown, fallback = 0): number {
  const next = typeof value === "number" ? value : Number(value);
  return Number.isFinite(next) ? Math.max(0, Math.round(next)) : fallback;
}

function oneOf<T extends readonly string[]>(list: T, value: unknown, fallback: T[number]): T[number] {
  return typeof value === "string" && (list as readonly string[]).includes(value) ? (value as T[number]) : fallback;
}

function asLocaleText(value: unknown, fallback: LocaleText = emptyLocaleText()): LocaleText {
  if (!isRow(value)) return { ...fallback };
  return { th: str(value.th, fallback.th), en: str(value.en, fallback.en) };
}

function asStringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function asVisual(value: unknown, fallback: CmsHmVisual = emptyVisual()): CmsHmVisual {
  if (!isRow(value)) return { ...fallback, alt: { ...fallback.alt }, caption: { ...fallback.caption } };
  return {
    mode: oneOf(HM_VISUAL_MODES, value.mode, fallback.mode),
    diagramId: str(value.diagramId, fallback.diagramId),
    src: str(value.src, fallback.src),
    alt: asLocaleText(value.alt, fallback.alt),
    caption: asLocaleText(value.caption, fallback.caption),
    label: str(value.label, fallback.label),
    status: oneOf(HM_VISUAL_STATUSES, value.status, fallback.status),
    permissionStatus: oneOf(HM_PERMISSION_STATUSES, value.permissionStatus, fallback.permissionStatus),
    permissionNote: str(value.permissionNote, fallback.permissionNote),
    assetSource: str(value.assetSource, fallback.assetSource),
  };
}

function rows(value: unknown): Row[] {
  return Array.isArray(value) ? value.filter(isRow) : [];
}

function byOrder<T extends { order: number }>(items: T[]): T[] {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => a.item.order - b.item.order || a.index - b.index)
    .map(({ item }) => item);
}

function orderOf(row: Row, index: number) {
  return int(row.order, index + 1);
}

function asSource(row: Row): CmsHmSource {
  return {
    id: str(row.id) || newHmItemId("ref"),
    label: asLocaleText(row.label),
    url: str(row.url),
    publishedAt: str(row.publishedAt),
    accessedAt: str(row.accessedAt),
    period: str(row.period),
    definition: str(row.definition),
    status: oneOf(HM_SOURCE_STATUSES, row.status, "guidance"),
  };
}

function asSection(row: Row, index: number): CmsHmSection {
  return {
    id: str(row.id) || newHmItemId("sec"),
    type: oneOf(HM_SECTION_TYPES, row.type, "custom"),
    heading: asLocaleText(row.heading),
    bodyTh: str(row.bodyTh),
    bodyEn: str(row.bodyEn),
    bulletsTh: asStringList(row.bulletsTh),
    bulletsEn: asStringList(row.bulletsEn),
    visual: asVisual(row.visual),
    sourceIds: asStringList(row.sourceIds),
    tocLabel: asLocaleText(row.tocLabel),
    tocAnchor: str(row.tocAnchor),
    showInToc: bool(row.showInToc, true),
    order: orderOf(row, index),
  };
}

function asStrategy(row: Row, index: number): CmsHmStrategy {
  return {
    id: str(row.id) || newHmItemId("strategy"),
    num: str(row.num) || String(index + 1).padStart(2, "0"),
    title: asLocaleText(row.title),
    bodyTh: str(row.bodyTh),
    bodyEn: str(row.bodyEn),
    visual: asVisual(row.visual),
    sourceIds: asStringList(row.sourceIds),
    order: orderOf(row, index),
  };
}

function asMetric(row: Row, index: number): CmsHmMetric {
  return {
    id: str(row.id) || newHmItemId("metric"),
    name: str(row.name),
    question: asLocaleText(row.question),
    definition: asLocaleText(row.definition),
    period: str(row.period),
    source: str(row.source),
    owner: str(row.owner),
    value: str(row.value),
    status: oneOf(HM_CLAIM_STATUSES, row.status, "draft"),
    order: orderOf(row, index),
  };
}

export function isHotelMarketingCmsBody(raw: string | null | undefined) {
  if (!raw || typeof raw !== "string") return false;
  const trimmed = raw.trim();
  if (!trimmed.startsWith("{")) return false;
  try {
    const parsed = JSON.parse(trimmed) as { kind?: unknown };
    return parsed?.kind === "hotel-marketing-insight";
  } catch {
    return false;
  }
}

export function parseHotelMarketingInsightBody(raw: string | null | undefined): CmsHotelMarketingInsight | null {
  if (!isHotelMarketingCmsBody(raw)) return null;
  try {
    const parsed = JSON.parse(String(raw)) as unknown;
    if (!isRow(parsed)) return null;
    const empty = emptyHotelMarketingInsight();
    const compare: Row = isRow(parsed.compare) ? parsed.compare : {};
    const start: Row = isRow(parsed.startHere) ? parsed.startHere : {};
    const conclusion: Row = isRow(parsed.conclusion) ? parsed.conclusion : {};
    const cta: Row = isRow(parsed.cta) ? parsed.cta : {};
    const seo: Row = isRow(parsed.seo) ? parsed.seo : {};
    const translation: Row = isRow(parsed.translation) ? parsed.translation : {};

    return {
      version: 1,
      kind: "hotel-marketing-insight",
      journeyLabels: asStringList(parsed.journeyLabels),
      summaryCallout: asLocaleText(parsed.summaryCallout),
      cover: asVisual(parsed.cover, empty.cover),
      authorName: str(parsed.authorName),
      authorVerified: bool(parsed.authorVerified),
      reviewerName: str(parsed.reviewerName),
      reviewerVerified: bool(parsed.reviewerVerified),
      publishedAt: str(parsed.publishedAt),
      updatedAt: str(parsed.updatedAt),
      readingTimeMinutes: int(parsed.readingTimeMinutes),
      category: asLocaleText(parsed.category),
      title: asLocaleText(parsed.title),
      excerpt: asLocaleText(parsed.excerpt),
      sections: byOrder(rows(parsed.sections).map(asSection)),
      strategies: byOrder(rows(parsed.strategies).map(asStrategy)),
      metricsIntroTh: str(parsed.metricsIntroTh),
      metricsIntroEn: str(parsed.metricsIntroEn),
      metricsNoteTh: str(parsed.metricsNoteTh),
      metricsNoteEn: str(parsed.metricsNoteEn),
      metrics: byOrder(rows(parsed.metrics).map(asMetric)),
      compare: {
        heading: asLocaleText(compare.heading),
        bodyTh: str(compare.bodyTh),
        bodyEn: str(compare.bodyEn),
        visual: asVisual(compare.visual, empty.compare.visual),
        lanes: byOrder(
          rows(compare.lanes).map((row, index) => ({
            id: str(row.id) || newHmItemId("lane"),
            role: asLocaleText(row.role),
            focus: asLocaleText(row.focus),
            order: orderOf(row, index),
          })),
        ),
        handoffs: byOrder(
          rows(compare.handoffs).map((row, index) => ({
            id: str(row.id) || newHmItemId("handoff"),
            from: str(row.from),
            text: asLocaleText(row.text),
            order: orderOf(row, index),
          })),
        ),
      },
      startHere: {
        heading: asLocaleText(start.heading),
        introTh: str(start.introTh),
        introEn: str(start.introEn),
        visual: asVisual(start.visual, empty.startHere.visual),
        steps: byOrder(
          rows(start.steps).map((row, index) => ({
            id: str(row.id) || newHmItemId("step"),
            title: asLocaleText(row.title),
            order: orderOf(row, index),
          })),
        ),
        closingTh: str(start.closingTh),
        closingEn: str(start.closingEn),
      },
      conclusion: {
        heading: asLocaleText(conclusion.heading),
        bodyTh: str(conclusion.bodyTh),
        bodyEn: str(conclusion.bodyEn),
      },
      relatedServices: byOrder(
        rows(parsed.relatedServices).map((row, index) => ({
          id: str(row.id) || newHmItemId("svc"),
          href: str(row.href),
          why: asLocaleText(row.why),
          order: orderOf(row, index),
        })),
      ),
      relatedArticles: byOrder(
        rows(parsed.relatedArticles).map((row, index) => ({
          id: str(row.id) || newHmItemId("article"),
          articleId: str(row.articleId),
          order: orderOf(row, index),
        })),
      ),
      cta: {
        title: asLocaleText(cta.title),
        body: asLocaleText(cta.body),
        buttonLabel: asLocaleText(cta.buttonLabel),
      },
      references: rows(parsed.references).map((row) => asSource(row)),
      referencesNote: asLocaleText(parsed.referencesNote),
      seo: {
        title: asLocaleText(seo.title),
        description: asLocaleText(seo.description),
        canonical: str(seo.canonical),
        social: asVisual(seo.social, empty.seo.social),
      },
      translation: {
        enEnabled: bool(translation.enEnabled),
        enReady: bool(translation.enReady),
        duplicateOfLocale: str(translation.duplicateOfLocale),
      },
    };
  } catch {
    return null;
  }
}

export function serializeHotelMarketingInsightBody(content: CmsHotelMarketingInsight) {
  return JSON.stringify({ ...content, version: 1, kind: "hotel-marketing-insight" });
}

export function isHotelMarketingInsightDocument(input: { kind: string; slug: string; template: string }) {
  if (input.kind !== "insight") return false;
  return input.template === HOTEL_MARKETING_CMS_TEMPLATE || input.slug === HOTEL_MARKETING_SLUG;
}

export function editorStateFromHotelMarketingDocument(input: {
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
}): HmEditorState {
  const content = parseHotelMarketingInsightBody(input.body) ?? emptyHotelMarketingInsight();
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

/* ------------------------------------------------------------------------------------------------------------ */
/* Validation (publish only)                                                                                    */
/* ------------------------------------------------------------------------------------------------------------ */

const PLACEHOLDER_RE = /placeholder|replace with verified|รอรูป|lorem ipsum/i;
const SENSITIVE_NOTE_RE = /client|hotel|campaign|review|ลูกค้า|โรงแรม|แคมเปญ|รีวิว/i;
const LINK_RE = /^(https?:\/\/|\/)/i;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const PERMISSION_OK: readonly HmPermissionStatus[] = ["approved", "redacted", "not_applicable"];
const VISUAL_OK: readonly HmVisualStatus[] = ["sample", "approved", "real"];

/** True when `value` is a real calendar date written as YYYY-MM-DD. */
export function isValidHmDate(value: string | undefined | null) {
  const next = (value ?? "").trim();
  if (!DATE_RE.test(next)) return false;
  const date = new Date(`${next}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === next;
}

export function hmDateToUtc(value: string | undefined | null) {
  return isValidHmDate(value) ? new Date(`${String(value).trim()}T00:00:00.000Z`) : null;
}

/** Every visual that can end up as an uploaded image on the public page. */
export function hmVisualsOf(content: CmsHotelMarketingInsight): Array<{ where: string; visual: CmsHmVisual }> {
  return [
    { where: "cover", visual: content.cover },
    ...content.sections.map((section) => ({ where: `section:${section.id}`, visual: section.visual })),
    ...content.strategies.map((strategy) => ({ where: `strategy:${strategy.id}`, visual: strategy.visual })),
    { where: "compare", visual: content.compare.visual },
    { where: "start", visual: content.startHere.visual },
    { where: "social", visual: content.seo.social },
  ];
}

export function validateHotelMarketingInsight(
  content: CmsHotelMarketingInsight,
  intent: HmCmsIntent,
  meta?: { seoTitle?: string; metaDescription?: string; bilingual?: boolean },
): string | null {
  if (intent !== "publish") return null;

  if (!content.title.th.trim() || !content.excerpt.th.trim()) return "required_fields";

  const seoTitle = (meta?.seoTitle ?? content.seo.title.th).trim();
  const metaDescription = (meta?.metaDescription ?? content.seo.description.th).trim();
  if (!seoTitle || !metaDescription) return "required_seo_meta";

  if (content.publishedAt.trim() && !isValidHmDate(content.publishedAt)) return "invalid_date";
  if (content.updatedAt.trim() && !isValidHmDate(content.updatedAt)) return "invalid_date";

  // Byline / review gates.
  if (!content.authorName.trim() || !content.authorVerified) return "author_required";
  if (content.reviewerName.trim() && !content.reviewerVerified) return "reviewer_unverified";

  // English gates — only when EN is switched on. English copy is never auto-filled.
  const enEnabled = meta?.bilingual ?? content.translation.enEnabled;
  if (enEnabled) {
    if (
      !content.title.en.trim() ||
      !content.excerpt.en.trim() ||
      !content.cover.alt.en.trim() ||
      !content.seo.title.en.trim() ||
      !content.seo.description.en.trim()
    ) {
      return "en_required";
    }
    if (!content.translation.enReady) return "en_not_ready";
  }

  // Visuals: status, alt text, permission.
  for (const { visual } of hmVisualsOf(content)) {
    if (!visual.src.trim()) continue;
    if (!LINK_RE.test(visual.src.trim())) return "invalid_link";
    if (!VISUAL_OK.includes(visual.status)) return "placeholder_status";
    if (!visual.alt.th.trim()) return "missing_alt";
    if (enEnabled && !visual.alt.en.trim()) return "missing_alt_en";
    if (PLACEHOLDER_RE.test(`${visual.src} ${visual.label} ${visual.caption.th} ${visual.caption.en}`) && visual.status !== "sample") {
      return "placeholder_label";
    }
    const pending = visual.permissionStatus === "pending" || visual.permissionStatus === "denied";
    const sensitive = SENSITIVE_NOTE_RE.test(visual.permissionNote);
    if ((pending || sensitive) && !PERMISSION_OK.includes(visual.permissionStatus)) return "permission_required";
  }

  // Metrics: a value is a claim and needs full provenance unless it is clearly labelled sample data.
  for (const metric of content.metrics) {
    if (!metric.value.trim()) continue;
    if (metric.status === "draft" || metric.status === "requires_review") return "unverified_claim";
    if (metric.status === "sample") continue;
    if (!metric.definition.th.trim() || !metric.period.trim() || !metric.source.trim()) return "metric_incomplete";
    if (!content.reviewerName.trim() || !content.reviewerVerified) return "reviewer_required";
  }

  // References.
  const referenceIds = new Set(content.references.map((reference) => reference.id));
  for (const reference of content.references) {
    const url = reference.url.trim();
    if (!url) continue;
    if (!LINK_RE.test(url)) return "invalid_link";
    if (!reference.label.th.trim() && !reference.label.en.trim()) return "source_incomplete";
    // Platform help centres change; require a dated access (or an article-level updated date).
    if (
      (reference.status === "platform" || reference.status === "guidance") &&
      !reference.accessedAt.trim() &&
      !content.updatedAt.trim()
    ) {
      return "source_dates";
    }
    if (reference.accessedAt.trim() && !isValidHmDate(reference.accessedAt)) return "invalid_date";
  }
  const cited = [...content.sections.flatMap((s) => s.sourceIds), ...content.strategies.flatMap((s) => s.sourceIds)];
  if (cited.some((id) => !referenceIds.has(id))) return "source_missing";

  // Related content.
  for (const service of content.relatedServices) {
    if (!service.href.trim() || !LINK_RE.test(service.href.trim())) return "related_invalid";
  }
  for (const article of content.relatedArticles) {
    if (!article.articleId.trim()) return "related_invalid";
  }
  if (content.seo.canonical.trim() && !LINK_RE.test(content.seo.canonical.trim())) return "invalid_link";

  return null;
}

export function hmCmsErrorMessage(code: string) {
  const table: Record<string, string> = {
    required_fields: "กรอกหัวข้อและคำอธิบายสั้น (ภาษาไทย) ก่อนเผยแพร่",
    required_seo_meta: "กรอก SEO title และ Meta description ก่อนเผยแพร่",
    invalid_date: "วันที่ต้องอยู่ในรูปแบบ YYYY-MM-DD และเป็นวันที่ที่มีอยู่จริง",
    author_required: "ต้องระบุชื่อผู้เขียนและยืนยันผู้เขียนก่อนเผยแพร่",
    reviewer_unverified: "มีชื่อผู้ตรวจทานแล้ว ต้องยืนยันการตรวจทานก่อนเผยแพร่ หรือลบชื่อออก",
    reviewer_required: "ตัวชี้วัดที่มีค่าตัวเลขต้องมีชื่อผู้ตรวจทานที่ยืนยันแล้วในบทความ",
    en_required:
      "เปิดใช้ภาษาอังกฤษแล้ว ต้องกรอก Title, Excerpt, Alt ของภาพปก และ SEO title/description ภาษาอังกฤษให้ครบ",
    en_not_ready: "ภาษาอังกฤษยังไม่พร้อมเผยแพร่ ให้ทีมตรวจทานแล้วทำเครื่องหมายว่าพร้อมก่อน",
    placeholder_status: "ภาพที่มีไฟล์ต้องมีสถานะ Sample, Approved หรือ Real ก่อนเผยแพร่ (ห้ามเป็น Placeholder)",
    placeholder_label: "อย่าเผยแพร่ข้อความ Placeholder ถ้าสถานะภาพไม่ใช่ Sample",
    missing_alt: "ภาพที่เผยแพร่ต้องมีคำอธิบายภาพ (Alt) ภาษาไทย",
    missing_alt_en: "เปิดใช้ภาษาอังกฤษแล้ว ภาพที่เผยแพร่ต้องมี Alt ภาษาอังกฤษ",
    permission_required:
      "ภาพที่เกี่ยวกับลูกค้า โรงแรม แคมเปญ หรือรีวิว ต้องมีสถานะสิทธิ์เป็น Approved, Redacted หรือ Not applicable ก่อนเผยแพร่",
    unverified_claim: "ตัวชี้วัดที่มีค่าตัวเลขต้องไม่เป็น Draft หรือ Requires review (ตั้งเป็น Sample หรือ Verified)",
    metric_incomplete: "ตัวชี้วัดที่มีค่าตัวเลขต้องมีคำนิยาม ช่วงเวลา และแหล่งข้อมูล",
    invalid_link: "ลิงก์ต้องขึ้นต้นด้วย http(s):// หรือ / (path ในเว็บไซต์)",
    source_incomplete: "แหล่งอ้างอิงที่มี URL ต้องมีชื่อแหล่งที่มา",
    source_dates: "แหล่งอ้างอิงจากแพลตฟอร์มต้องมีวันที่เข้าถึง (Accessed) หรือวันที่อัปเดตบทความ",
    source_missing: "มีการอ้างถึงแหล่งอ้างอิงที่ไม่มีอยู่ในรายการ References",
    related_invalid: "บริการ/บทความที่เกี่ยวข้องต้องมีลิงก์หรือรหัสบทความที่ถูกต้อง",
    invalid_image: "อัปโหลดได้เฉพาะ JPG PNG หรือ WEBP ขนาดไม่เกิน 5MB",
    invalid_json: "ข้อมูลฟอร์มไม่ถูกต้อง",
    missing: "ไม่พบบทความ",
    unsupported_locale: "รองรับการทำสำเนาเพื่อแปลเฉพาะภาษาอังกฤษ (en)",
  };
  return table[code] ?? "บันทึกไม่สำเร็จ";
}
