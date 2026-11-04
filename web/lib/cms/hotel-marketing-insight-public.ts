/**
 * Public renderer helpers for the structured Hotel Marketing insight.
 *
 * Published `CmsDocument.body` JSON (see `hotel-marketing-insight.ts`) is converted into:
 *   - an `InsightPost` (header, cover, byline, sources, related ids),
 *   - `HandoffBlock[]` (headings / paragraphs / lists / links that drive the ToC and reading time), and
 *   - helper lookups used by `InsightArticle` to place CMS-driven visuals next to those blocks.
 *
 * English is never invented: EN copy is only used when `translation.enEnabled` is on AND the specific field has
 * English text. Everything else falls back to the authored Thai.
 *
 * This module is intentionally free of database imports so it can be unit-tested and used from any server component.
 */
import type { HandoffBlock } from "@/lib/handoff";
import type { RelatedServiceLink } from "@/lib/insight-links";
import type { InsightCoverStatus, InsightPost, InsightSource } from "@/lib/insights";
import { solutionNavLabel } from "@/lib/nav";
import { existingHref, SITE, type Locale } from "@/lib/seo";
import { existingPublicSrc } from "@/lib/insights-media";
import { documentPath } from "./body";
import {
  emptyVisual,
  isHotelMarketingCmsBody,
  isHotelMarketingInsightDocument,
  isValidHmDate,
  parseHotelMarketingInsightBody,
  type CmsHmSection,
  type CmsHmSource,
  type CmsHmStrategy,
  type CmsHmVisual,
  type CmsHotelMarketingInsight,
  type HmSectionType,
  type LocaleText,
} from "./hotel-marketing-insight";
import type { CmsDocumentRow } from "./types";

export type HmLang = "th" | "en";

/* ------------------------------------------------------------------------------------------------------------ */
/* Locale helpers                                                                                               */
/* ------------------------------------------------------------------------------------------------------------ */

/** EN is used only when switched on for this article. Anything else renders Thai. */
export function hmLang(content: CmsHotelMarketingInsight, locale: Locale | HmLang | string): HmLang {
  return locale === "en" && content.translation.enEnabled ? "en" : "th";
}

export function hmText(lang: HmLang, text: LocaleText): string {
  const en = text.en.trim();
  return lang === "en" && en ? en : text.th.trim();
}

function hmBody(lang: HmLang, th: string, en: string): string {
  return lang === "en" && en.trim() ? en : th;
}

function hmBullets(lang: HmLang, th: string[], en: string[]): string[] {
  const list = lang === "en" && en.some((item) => item.trim()) ? en : th;
  return list.map((item) => item.trim()).filter(Boolean);
}

export function hmParagraphs(text: string): string[] {
  return text
    .split(/\r?\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function hmVisualHasContent(visual: CmsHmVisual | undefined | null): visual is CmsHmVisual {
  if (!visual) return false;
  // An image with a file wins; otherwise fall back to the named diagram (empty diagramId = no visual).
  if (visual.mode === "image" && visual.src.trim()) return true;
  return Boolean(visual.diagramId.trim());
}

/* ------------------------------------------------------------------------------------------------------------ */
/* Document → content                                                                                           */
/* ------------------------------------------------------------------------------------------------------------ */

export function hotelMarketingContentFromDocument(
  doc: Pick<CmsDocumentRow, "body"> & Partial<Pick<CmsDocumentRow, "kind" | "slug" | "template">>,
): CmsHotelMarketingInsight | null {
  if (!doc || !isHotelMarketingCmsBody(doc.body)) return null;
  return parseHotelMarketingInsightBody(doc.body);
}

export { isHotelMarketingInsightDocument };

/* ------------------------------------------------------------------------------------------------------------ */
/* Section entries (shared by the block builder and the article renderer)                                       */
/* ------------------------------------------------------------------------------------------------------------ */

export type HmSectionEntry = {
  key: string;
  type: HmSectionType;
  /** Heading shown as the h2. Empty for heading-less intro sections. */
  heading: string;
  paragraphs: string[];
  bullets: string[];
  /** Paragraphs emitted after the bullets (start-here closing copy). */
  trailing: string[];
  sourceIds: string[];
  visual: CmsHmVisual;
  /** Metrics section only: the Template / Sample Data note (also the last paragraph). */
  note: string;
  strategies: CmsHmStrategy[];
};

function sortedByOrder<T extends { order: number }>(items: T[]) {
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => a.item.order - b.item.order || a.index - b.index)
    .map(({ item }) => item);
}

function syntheticSection(type: HmSectionType, order: number): CmsHmSection {
  return {
    id: type,
    type,
    heading: { th: "", en: "" },
    bodyTh: "",
    bodyEn: "",
    bulletsTh: [],
    bulletsEn: [],
    visual: emptyVisual(),
    sourceIds: [],
    tocLabel: { th: "", en: "" },
    tocAnchor: "",
    showInToc: true,
    order,
  };
}

function pickVisual(own: CmsHmVisual, fallback?: CmsHmVisual): CmsHmVisual {
  if (hmVisualHasContent(own)) return own;
  if (fallback && hmVisualHasContent(fallback)) return fallback;
  return own;
}

export function hotelMarketingSectionEntries(content: CmsHotelMarketingInsight, locale: Locale | HmLang | string): HmSectionEntry[] {
  const lang = hmLang(content, locale);
  const sections = sortedByOrder(content.sections);
  const strategies = sortedByOrder(content.strategies);
  const maxOrder = sections.reduce((max, section) => Math.max(max, section.order), 0);

  const list: CmsHmSection[] = [...sections];
  const has = (type: HmSectionType) => list.some((section) => section.type === type);
  let extra = maxOrder;
  const compareText = hmText(lang, content.compare.heading) || hmBody(lang, content.compare.bodyTh, content.compare.bodyEn).trim();
  if (!has("compare") && compareText) list.push(syntheticSection("compare", (extra += 1)));
  const startText =
    hmText(lang, content.startHere.heading) ||
    hmBody(lang, content.startHere.introTh, content.startHere.introEn).trim() ||
    (content.startHere.steps.length ? "steps" : "");
  if (!has("start") && startText) list.push(syntheticSection("start", (extra += 1)));
  const conclusionText =
    hmText(lang, content.conclusion.heading) || hmBody(lang, content.conclusion.bodyTh, content.conclusion.bodyEn).trim();
  if (!has("conclusion") && conclusionText) list.push(syntheticSection("conclusion", (extra += 1)));

  // Strategies need a strategies_intro host. Create one when the document forgot it.
  if (strategies.length && !has("strategies_intro")) {
    const host = syntheticSection("strategies_intro", 0);
    const at = list.findIndex((section) => ["metrics", "compare", "start", "conclusion"].includes(section.type));
    if (at === -1) list.push(host);
    else list.splice(at, 0, host);
  }

  const entries: HmSectionEntry[] = [];
  let strategiesPlaced = false;

  for (const section of list) {
    let heading = hmText(lang, section.heading) || hmText(lang, section.tocLabel);
    let paragraphs = hmParagraphs(hmBody(lang, section.bodyTh, section.bodyEn));
    let bullets = hmBullets(lang, section.bulletsTh, section.bulletsEn);
    const trailing: string[] = [];
    let visual = section.visual;
    let note = "";

    if (section.type === "compare") {
      if (!heading) heading = hmText(lang, content.compare.heading);
      if (!paragraphs.length) paragraphs = hmParagraphs(hmBody(lang, content.compare.bodyTh, content.compare.bodyEn));
      visual = pickVisual(section.visual, content.compare.visual);
    } else if (section.type === "start") {
      if (!heading) heading = hmText(lang, content.startHere.heading);
      if (!paragraphs.length) paragraphs = hmParagraphs(hmBody(lang, content.startHere.introTh, content.startHere.introEn));
      if (!bullets.length) {
        bullets = sortedByOrder(content.startHere.steps)
          .map((step) => hmText(lang, step.title))
          .filter(Boolean);
      }
      trailing.push(...hmParagraphs(hmBody(lang, content.startHere.closingTh, content.startHere.closingEn)));
      visual = pickVisual(section.visual, content.startHere.visual);
    } else if (section.type === "conclusion") {
      if (!heading) heading = hmText(lang, content.conclusion.heading);
      if (!paragraphs.length) paragraphs = hmParagraphs(hmBody(lang, content.conclusion.bodyTh, content.conclusion.bodyEn));
    } else if (section.type === "metrics") {
      paragraphs = [
        ...paragraphs,
        ...hmParagraphs(hmBody(lang, content.metricsIntroTh, content.metricsIntroEn)),
      ];
      note = hmBody(lang, content.metricsNoteTh, content.metricsNoteEn).trim();
      if (note) paragraphs.push(note);
    }

    const isStrategiesHost = section.type === "strategies_intro" && !strategiesPlaced;
    if (isStrategiesHost) strategiesPlaced = true;

    entries.push({
      key: section.id,
      type: section.type,
      heading,
      paragraphs,
      bullets,
      trailing,
      sourceIds: section.sourceIds,
      visual,
      note,
      strategies: isStrategiesHost ? strategies : [],
    });
  }

  return entries;
}

/** Text of the h3 emitted for a strategy. `InsightArticle` parses the leading number back out of it. */
export function hmStrategyHeading(strategy: CmsHmStrategy, lang: HmLang) {
  const title = hmText(lang, strategy.title);
  return `${strategy.num}. ${title}`.trim();
}

function referenceLinks(
  ids: string[],
  references: CmsHmSource[],
  lang: HmLang,
): Array<{ type: "link"; href: string; text: string }> {
  const byId = new Map(references.map((reference) => [reference.id, reference]));
  const out: Array<{ type: "link"; href: string; text: string }> = [];
  const seen = new Set<string>();
  for (const id of ids) {
    const reference = byId.get(id);
    const href = reference?.url.trim();
    if (!reference || !href || seen.has(href)) continue;
    seen.add(href);
    out.push({ type: "link", href, text: hmText(lang, reference.label) || href });
  }
  return out;
}

/* ------------------------------------------------------------------------------------------------------------ */
/* Blocks                                                                                                       */
/* ------------------------------------------------------------------------------------------------------------ */

export function hotelMarketingBlocksFromContent(
  content: CmsHotelMarketingInsight,
  locale: "th" | "en" = "th",
): HandoffBlock[] {
  const lang = hmLang(content, locale);
  const entries = hotelMarketingSectionEntries(content, lang);
  const blocks: HandoffBlock[] = [];

  const title = hmText(lang, content.title);
  if (title) blocks.push({ type: "h1", text: title });

  const callout = hmText(lang, content.summaryCallout);
  if (callout) blocks.push({ type: "p", text: callout });

  const journey = content.journeyLabels.map((label) => label.trim()).filter(Boolean);
  if (journey.length) blocks.push({ type: "p", text: journey.join(" → ") });

  const emitBody = (entry: HmSectionEntry) => {
    for (const text of entry.paragraphs) blocks.push({ type: "p", text });
    if (entry.bullets.length) blocks.push({ type: "list", items: entry.bullets });
    for (const text of entry.trailing) blocks.push({ type: "p", text });
    for (const link of referenceLinks(entry.sourceIds, content.references, lang)) blocks.push(link);
  };

  for (const entry of entries) {
    // Heading-less intro copy sits in the preface (before the first h2), like the original article.
    if (!entry.heading) {
      emitBody(entry);
    } else {
      blocks.push({ type: "h2", text: entry.heading });
      emitBody(entry);
    }

    if (entry.type === "strategies_intro") {
      for (const strategy of entry.strategies) {
        const heading = hmStrategyHeading(strategy, lang);
        const body = hmParagraphs(hmBody(lang, strategy.bodyTh, strategy.bodyEn));
        if (!hmText(lang, strategy.title) && !body.length) continue;
        blocks.push({ type: "h3", text: heading });
        for (const text of body) blocks.push({ type: "p", text });
        for (const link of referenceLinks(strategy.sourceIds, content.references, lang)) blocks.push(link);
      }
    }
  }

  return blocks;
}

/* ------------------------------------------------------------------------------------------------------------ */
/* Post                                                                                                         */
/* ------------------------------------------------------------------------------------------------------------ */

function localeMap(text: LocaleText, fallbackTh: string): Record<Locale, string> {
  const th = text.th.trim() || fallbackTh;
  const en = text.en.trim() || th;
  return { th, en, ru: th, zh: th };
}

function isoDate(value: string, fallback: Date | null | undefined) {
  if (isValidHmDate(value)) return value.trim();
  return fallback ? fallback.toISOString().slice(0, 10) : "";
}

/** Cover fields for `InsightPost` / `InsightCover`, driven by `content.cover`. */
export function hotelMarketingCoverFields(content: CmsHotelMarketingInsight): {
  coverImage: string;
  coverImageAlt: string;
  coverImageStatus: InsightCoverStatus;
} {
  const cover = content.cover;
  const src = cover.src.trim();
  const isImage = cover.mode === "image" && Boolean(src);
  return {
    coverImage: src,
    coverImageAlt: cover.alt.th.trim(),
    // A diagram cover keeps its (sample) placeholder background; only a real uploaded image can be approved/real.
    coverImageStatus: isImage ? cover.status : "sample",
  };
}

export function hotelMarketingInsightPostFromContent(
  content: CmsHotelMarketingInsight,
  doc: CmsDocumentRow,
): InsightPost {
  const href = documentPath(doc);
  const publishedAt = isoDate(content.publishedAt, doc.publishedAt ?? doc.createdAt);
  const updatedAtRaw = isoDate(content.updatedAt, doc.updatedAt);

  const cover = hotelMarketingCoverFields(content);

  const sources: InsightSource[] = content.references
    .filter((reference) => reference.label.th.trim() || reference.label.en.trim())
    .map((reference) => {
      const th = reference.label.th.trim();
      const en = reference.label.en.trim();
      return {
        label: th || en,
        labelByLocale: {
          ...(th ? { th } : {}),
          ...(en ? { en } : {}),
        },
        ...(reference.url.trim() ? { url: reference.url.trim() } : {}),
      };
    });

  const title = localeMap(content.title, doc.title);
  const excerpt = localeMap(content.excerpt, doc.excerpt || doc.metaDescription || doc.title);
  const category = localeMap(content.category, doc.category || "การตลาดโรงแรม");

  return {
    id: doc.id || doc.slug,
    slug: doc.slug,
    href,
    publishedAt,
    updatedAt: updatedAtRaw && updatedAtRaw !== publishedAt ? updatedAtRaw : undefined,
    readingTimeMinutes: content.readingTimeMinutes || 1,
    coverImage: cover.coverImage,
    coverImageAlt: cover.coverImageAlt || doc.imageAlt || title.th,
    coverImageStatus: cover.coverImageStatus,
    authorName: content.authorVerified && content.authorName.trim() ? content.authorName.trim() : undefined,
    reviewerName: content.reviewerVerified && content.reviewerName.trim() ? content.reviewerName.trim() : undefined,
    sources,
    relatedArticleIds: sortedByOrder(content.relatedArticles)
      .map((article) => article.articleId.trim())
      .filter(Boolean),
    isPublished: true,
    sampleVisual:
      cover.coverImageStatus === "sample" || cover.coverImageStatus === "placeholder" || !cover.coverImage,
    category,
    title,
    excerpt,
  };
}

/* ------------------------------------------------------------------------------------------------------------ */
/* Related services                                                                                             */
/* ------------------------------------------------------------------------------------------------------------ */

/** CMS related services, resolved against real routes (links to pages that do not exist are hidden). */
export function hotelMarketingRelatedServices(
  content: CmsHotelMarketingInsight,
  locale: Locale,
): RelatedServiceLink[] {
  const lang = hmLang(content, locale);
  const out: RelatedServiceLink[] = [];
  const seen = new Set<string>();
  for (const item of sortedByOrder(content.relatedServices)) {
    const raw = item.href.trim();
    if (!raw) continue;
    const resolved = existingHref(raw, locale);
    if (!resolved || seen.has(resolved)) continue;
    seen.add(resolved);
    const why = hmText(lang, item.why);
    out.push({
      href: resolved,
      label: solutionNavLabel(raw, locale),
      ...(why ? { why } : {}),
    });
  }
  return out;
}

/* ------------------------------------------------------------------------------------------------------------ */
/* Metadata                                                                                                     */
/* ------------------------------------------------------------------------------------------------------------ */

export function hotelMarketingMetadata(content: CmsHotelMarketingInsight, doc: CmsDocumentRow) {
  const route = documentPath(doc);
  const title = content.seo.title.th.trim() || doc.seoTitle || content.title.th.trim() || doc.title;
  const description =
    content.seo.description.th.trim() || doc.metaDescription || content.excerpt.th.trim() || doc.excerpt;
  const canonical = content.seo.canonical.trim() || doc.canonical || `${SITE}${route}`;

  const social = content.seo.social;
  const cover = content.cover;
  const candidates = [
    social.src,
    doc.ogImage,
    cover.mode === "image" ? cover.src : "",
    doc.featuredImage,
  ];
  let image = "";
  for (const candidate of candidates) {
    const next = candidate?.trim();
    if (!next) continue;
    image = /^https?:\/\//i.test(next) ? next : existingPublicSrc(next) || next;
    if (image) break;
  }
  const imageAlt = social.alt.th.trim() || cover.alt.th.trim() || title;
  const publishedAt = isoDate(content.publishedAt, doc.publishedAt ?? doc.createdAt);
  const updatedAt = isoDate(content.updatedAt, doc.updatedAt);

  return {
    title,
    description,
    robots: { index: !doc.noindex, follow: !doc.noindex },
    alternates: { canonical },
    openGraph: {
      type: "article" as const,
      title,
      description,
      url: canonical,
      ...(publishedAt ? { publishedTime: publishedAt } : {}),
      ...(updatedAt ? { modifiedTime: updatedAt } : {}),
      ...(image
        ? { images: [{ url: image.startsWith("http") ? image : `${SITE}${image}`, alt: imageAlt }] }
        : {}),
    },
  };
}
