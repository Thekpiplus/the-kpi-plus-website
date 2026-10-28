import { existsSync } from "fs";
import { join } from "path";
import type { FaqItem } from "@/lib/faqs";
import {
  hotelSeoFaqs,
  hotelSeoFaqsAreStale,
  HOTEL_SEO_AUDIT_VISUAL_CANDIDATE,
  HOTEL_SEO_BEHAVIOR_VISUAL_CANDIDATE,
  HOTEL_SEO_COMPARE_VISUAL_CANDIDATE,
  HOTEL_SEO_FLOW_VISUAL_CANDIDATE,
  HOTEL_SEO_GBP_VISUAL_CANDIDATE,
  HOTEL_SEO_HERO_VISUAL_CANDIDATE,
  HOTEL_SEO_KPI_VISUAL_CANDIDATE,
  HOTEL_SEO_PROCESS_VISUAL_CANDIDATE,
  HOTEL_SEO_RELATED_VISUAL_CANDIDATE,
} from "@/lib/hotel-seo";
import { localeFromPath, metadataFor, type Locale } from "@/lib/seo";
import { isCmsPageLive } from "./public";
import { documentById, pageDocumentBySlug } from "./queries";
import {
  HOTEL_SEO_CMS_TEMPLATE,
  HOTEL_SEO_PAGE_ROUTE,
  HOTEL_SEO_PAGE_SLUG,
  parseHotelSeoPageBody,
  type CmsHotelSeoPage,
  type CmsSeoVisual,
} from "./hotel-seo-page";
import { defaultHotelSeoCms } from "./hotel-seo-page-seed";

function publicSrc(src?: string) {
  const next = src?.trim();
  if (!next) return undefined;
  if (/^https?:\/\//i.test(next)) return next;
  const relative = next.replace(/^\//, "");
  return existsSync(join(process.cwd(), "public", relative)) ? next : undefined;
}

function withVisualSrc(visual: CmsSeoVisual): CmsSeoVisual {
  return { ...visual, src: publicSrc(visual.src) || "" };
}

export function hotelSeoHeroVisualUrl() {
  return publicSrc(HOTEL_SEO_HERO_VISUAL_CANDIDATE);
}

export function hotelSeoBehaviorVisualUrl() {
  return publicSrc(HOTEL_SEO_BEHAVIOR_VISUAL_CANDIDATE);
}

export function hotelSeoAuditVisualUrl() {
  return publicSrc(HOTEL_SEO_AUDIT_VISUAL_CANDIDATE);
}

export function hotelSeoCompareVisualUrl() {
  return publicSrc(HOTEL_SEO_COMPARE_VISUAL_CANDIDATE);
}

export function hotelSeoFlowVisualUrl() {
  return publicSrc(HOTEL_SEO_FLOW_VISUAL_CANDIDATE);
}

export function hotelSeoGbpVisualUrl() {
  return publicSrc(HOTEL_SEO_GBP_VISUAL_CANDIDATE);
}

export function hotelSeoProcessVisualUrl() {
  return publicSrc(HOTEL_SEO_PROCESS_VISUAL_CANDIDATE);
}

export function hotelSeoKpiVisualUrl() {
  return publicSrc(HOTEL_SEO_KPI_VISUAL_CANDIDATE);
}

export function hotelSeoRelatedVisualUrl() {
  return publicSrc(HOTEL_SEO_RELATED_VISUAL_CANDIDATE);
}

export type HotelSeoResolvedPage = {
  fromCms: boolean;
  hero: CmsHotelSeoPage["hero"];
  search: CmsHotelSeoPage["search"];
  compare: CmsHotelSeoPage["compare"];
  problems: CmsHotelSeoPage["problems"];
  help: CmsHotelSeoPage["help"];
  gbp: CmsHotelSeoPage["gbp"];
  method: CmsHotelSeoPage["method"];
  measure: CmsHotelSeoPage["measure"];
  related: CmsHotelSeoPage["related"];
  form: CmsHotelSeoPage["form"];
  faqs: CmsHotelSeoPage["faqs"];
  consistency: CmsHotelSeoPage["consistency"];
};

function resolveFromContent(locale: Locale, content: CmsHotelSeoPage, fromCms: boolean): HotelSeoResolvedPage {
  const faqFallback = hotelSeoFaqs(locale === "en" || locale === "th" ? locale : "en").map((item, index) => ({
    id: `faq-${index + 1}`,
    ...item,
  }));
  return {
    fromCms,
    hero: { ...content.hero, visual: withVisualSrc(content.hero.visual) },
    search: { ...content.search, visual: withVisualSrc(content.search.visual) },
    compare: { ...content.compare, visual: withVisualSrc(content.compare.visual), rows: [...content.compare.rows].sort((a, b) => a.order - b.order) },
    problems: { ...content.problems, visual: withVisualSrc(content.problems.visual), items: [...content.problems.items].sort((a, b) => a.order - b.order) },
    help: {
      ...content.help,
      visual: withVisualSrc(content.help.visual),
      stages: [...content.help.stages].sort((a, b) => a.order - b.order),
      steps: [...content.help.steps].sort((a, b) => a.order - b.order),
    },
    gbp: {
      ...content.gbp,
      visual: withVisualSrc(content.gbp.visual),
      fields: [...content.gbp.fields].sort((a, b) => a.order - b.order),
      actions: [...content.gbp.actions].sort((a, b) => a.order - b.order),
    },
    method: { ...content.method, visual: withVisualSrc(content.method.visual), steps: [...content.method.steps].sort((a, b) => a.order - b.order) },
    measure: { ...content.measure, visual: withVisualSrc(content.measure.visual) },
    related: { ...content.related, visual: withVisualSrc(content.related.visual), cards: [...content.related.cards].sort((a, b) => a.order - b.order) },
    form: { ...content.form, visual: withVisualSrc(content.form.visual) },
    faqs: !content.faqs.length || hotelSeoFaqsAreStale(content.faqs) ? faqFallback : content.faqs,
    consistency: {
      ...content.consistency,
      gsc: [...content.consistency.gsc].sort((a, b) => a.order - b.order),
      listing: [...content.consistency.listing].sort((a, b) => a.order - b.order),
    },
  };
}

export async function resolveHotelSeoPage(locale: Locale, previewContent?: CmsHotelSeoPage | null): Promise<HotelSeoResolvedPage> {
  if (previewContent) return resolveFromContent(locale, previewContent, true);
  const resolvedLocale = locale === "ru" || locale === "zh" ? "en" : locale;
  const fallback = defaultHotelSeoCms(resolvedLocale);
  const doc = await pageDocumentBySlug(HOTEL_SEO_PAGE_SLUG, "th").catch(() => null);
  const parsed = doc && isCmsPageLive(doc) ? parseHotelSeoPageBody(doc.body, resolvedLocale) : null;
  if (!parsed) return resolveFromContent(resolvedLocale, fallback, false);
  return resolveFromContent(resolvedLocale, parsed, true);
}

export async function loadHotelSeoPagePreview(id: string) {
  const doc = await documentById(id);
  if (!doc || doc.kind !== "page" || doc.trashedAt) return null;
  const locale = (["th", "en", "ru", "zh"].includes(doc.locale) ? doc.locale : "th") as Locale;
  const parsed = parseHotelSeoPageBody(doc.body, locale) ?? defaultHotelSeoCms(locale);
  return { locale, live: isCmsPageLive(doc), content: parsed };
}

export async function hotelSeoPublicMetadata(route: string) {
  const locale = localeFromPath(route);
  const base = metadataFor(route);
  const doc = await pageDocumentBySlug(HOTEL_SEO_PAGE_SLUG, "th").catch(() => null);
  if (!doc || !isCmsPageLive(doc) || doc.template !== HOTEL_SEO_CMS_TEMPLATE) return base;
  const parsed = parseHotelSeoPageBody(doc.body, locale === "th" ? "th" : "en");
  const image = publicSrc(doc.ogImage) || publicSrc(parsed?.seo.social.src) || publicSrc(doc.featuredImage);
  const imageAlt = (locale === "th" ? parsed?.seo.social.altTh : parsed?.seo.social.altEn) || doc.imageAlt;
  const withImage = metadataFor(route, image ? { image, imageAlt } : { imageAlt });
  const title = doc.seoTitle || doc.title || base.title;
  const description = doc.metaDescription || doc.excerpt || base.description;
  const canonical = doc.canonical || parsed?.seo.canonical || undefined;
  return {
    ...withImage,
    title,
    description,
    alternates: canonical ? { ...withImage.alternates, canonical } : withImage.alternates,
    openGraph: { ...withImage.openGraph, title, description },
    twitter: { ...withImage.twitter, title, description },
  };
}

export function hotelSeoFaqsForJsonLd(content: CmsHotelSeoPage | null, locale: Locale): FaqItem[] {
  const resolvedLocale = locale === "th" ? "th" : "en";
  const faqs =
    content?.faqs?.length && !hotelSeoFaqsAreStale(content.faqs)
      ? content.faqs
      : hotelSeoFaqs(resolvedLocale);
  return faqs.map(({ q, a }) => ({ q, a }));
}

export { HOTEL_SEO_PAGE_ROUTE };
