import { existsSync } from "fs";
import { join } from "path";
import type { FaqItem } from "@/lib/faqs";
import {
  HOTEL_AI_CASES_VISUAL_CANDIDATE,
  HOTEL_AI_ENQUIRY_VISUAL_CANDIDATE,
  HOTEL_AI_EVIDENCE_VISUAL_CANDIDATE,
  HOTEL_AI_FIT_VISUAL_CANDIDATE,
  HOTEL_AI_HERO_VISUAL_CANDIDATE,
  HOTEL_AI_OWNERSHIP_VISUAL_CANDIDATE,
  HOTEL_AI_PAIN_VISUAL_CANDIDATE,
  HOTEL_AI_PILOT_VISUAL_CANDIDATE,
  HOTEL_AI_RELATED_VISUAL_CANDIDATE,
  HOTEL_AI_ROADMAP_VISUAL_CANDIDATE,
  HOTEL_AI_SCORECARD_VISUAL_CANDIDATE,
  hotelAiFaqs,
  hotelAiFaqsAreStale,
} from "@/lib/hotel-ai";
import { localeFromPath, metadataFor, type Locale } from "@/lib/seo";
import { isCmsPageLive } from "./public";
import { documentById, pageDocumentBySlug } from "./queries";
import {
  HOTEL_AI_CMS_TEMPLATE,
  HOTEL_AI_PAGE_SLUG,
  defaultHotelAiCms,
  parseHotelAiPageBody,
  publicHotelAiClaimNumber,
  publicHotelAiKpiValues,
  type CmsHotelAiPage,
  type CmsHotelAiVisual,
} from "./hotel-ai-page";

function publicSrc(src?: string) {
  const next = src?.trim();
  if (!next) return undefined;
  if (/^https?:\/\//i.test(next)) return next;
  const relative = next.replace(/^\//, "");
  return existsSync(join(process.cwd(), "public", relative)) ? next : undefined;
}

function withVisualSrc(visual: CmsHotelAiVisual, fallback: string): CmsHotelAiVisual {
  return { ...visual, src: publicSrc(visual.src) || publicSrc(fallback) || "" };
}

export type HotelAiResolvedPage = CmsHotelAiPage & { fromCms: boolean };

function withResolvedVisuals(parsed: CmsHotelAiPage): CmsHotelAiPage {
  return {
    ...parsed,
    hero: { ...parsed.hero, visual: withVisualSrc(parsed.hero.visual, HOTEL_AI_HERO_VISUAL_CANDIDATE) },
    pains: { ...parsed.pains, visual: withVisualSrc(parsed.pains.visual, HOTEL_AI_PAIN_VISUAL_CANDIDATE) },
    process: { ...parsed.process, visual: withVisualSrc(parsed.process.visual, HOTEL_AI_ROADMAP_VISUAL_CANDIDATE) },
    cases: { ...parsed.cases, visual: withVisualSrc(parsed.cases.visual, HOTEL_AI_CASES_VISUAL_CANDIDATE) },
    pilot: { ...parsed.pilot, visual: withVisualSrc(parsed.pilot.visual, HOTEL_AI_PILOT_VISUAL_CANDIDATE) },
    evidence: {
      ...parsed.evidence,
      visual: withVisualSrc(parsed.evidence.visual, HOTEL_AI_EVIDENCE_VISUAL_CANDIDATE),
      claims: parsed.evidence.claims.map((claim) => ({
        ...claim,
        number: publicHotelAiClaimNumber(claim, parsed.bilingualPublish),
      })),
    },
    measure: {
      ...parsed.measure,
      visual: withVisualSrc(parsed.measure.visual, HOTEL_AI_SCORECARD_VISUAL_CANDIDATE),
      kpis: parsed.measure.kpis.map((kpi) => {
        const values = publicHotelAiKpiValues(kpi, parsed.bilingualPublish);
        return { ...kpi, baseline: values.baseline, pilot: values.pilot };
      }),
    },
    ownership: { ...parsed.ownership, visual: withVisualSrc(parsed.ownership.visual, HOTEL_AI_OWNERSHIP_VISUAL_CANDIDATE) },
    fit: { ...parsed.fit, visual: withVisualSrc(parsed.fit.visual, HOTEL_AI_FIT_VISUAL_CANDIDATE) },
    related: { ...parsed.related, visual: withVisualSrc(parsed.related.visual, HOTEL_AI_RELATED_VISUAL_CANDIDATE) },
    form: { ...parsed.form, visual: withVisualSrc(parsed.form.visual, HOTEL_AI_ENQUIRY_VISUAL_CANDIDATE) },
    seo: { ...parsed.seo, social: withVisualSrc(parsed.seo.social, "") },
  };
}

export async function loadHotelAiPage(locale: Locale): Promise<HotelAiResolvedPage> {
  const resolvedLocale = locale === "ru" || locale === "zh" ? "en" : locale;
  const base = defaultHotelAiCms(resolvedLocale === "th" ? "th" : "en");
  const preferred = await pageDocumentBySlug(HOTEL_AI_PAGE_SLUG, resolvedLocale).catch(() => null);
  const doc = preferred && isCmsPageLive(preferred) ? preferred : null;
  if (!doc || doc.template !== HOTEL_AI_CMS_TEMPLATE) {
    return { ...withResolvedVisuals(base), fromCms: false };
  }
  const parsed = parseHotelAiPageBody(doc.body, resolvedLocale === "th" ? "th" : "en");
  if (!parsed) return { ...withResolvedVisuals(base), fromCms: false };
  return { ...withResolvedVisuals(parsed), fromCms: true };
}

export async function loadHotelAiPagePreview(id: string) {
  const doc = await documentById(id);
  if (!doc) return null;
  const locale = (["th", "en", "ru", "zh"].includes(doc.locale) ? doc.locale : "th") as Locale;
  const parsed = parseHotelAiPageBody(doc.body, locale) ?? defaultHotelAiCms(locale);
  return {
    locale,
    live: isCmsPageLive(doc),
    content: withResolvedVisuals(parsed),
  };
}

export function hotelAiFaqsFromCms(content: CmsHotelAiPage | null | undefined, locale: Locale): FaqItem[] {
  const english = locale !== "th";
  const mapped =
    content?.faqs.map((item) => ({
      q: english && item.qEn.trim() ? item.qEn : item.q,
      a: english && item.aEn.trim() ? item.aEn : item.a,
    })) ?? [];
  return mapped.length && !hotelAiFaqsAreStale(mapped) ? mapped : hotelAiFaqs(locale === "th" ? "th" : "en");
}

export function hotelAiPublicHref(href: string, locale: Locale, fallback: string) {
  const next = href.trim() || fallback;
  if (/^(#|https?:\/\/|mailto:|tel:)/i.test(next)) return next;
  if (next.startsWith("/")) {
    if (locale === "th" || next.startsWith("/en/") || next.startsWith("/ru/") || next.startsWith("/zh/")) return next;
    return `/${locale}${next}`;
  }
  return next;
}

export async function hotelAiPublicMetadata(route: string) {
  const locale = localeFromPath(route);
  const fallback = metadataFor(route);
  const cms = await loadHotelAiPage(locale);
  if (!cms.fromCms) return fallback;
  const variant = cms.seo.variants.find((item) => item.locale === locale) || cms.seo.variants.find((item) => item.locale === "en");
  const image = publicSrc(cms.seo.social.src);
  const imageAlt = (locale === "th" ? cms.seo.social.altTh : cms.seo.social.altEn) || cms.hero.visual.altTh;
  const withImage = metadataFor(route, image ? { image, imageAlt } : { imageAlt });
  const title = variant?.title.trim() || fallback.title;
  const description = variant?.description.trim() || cms.hero.description || fallback.description;
  const canonical = variant?.canonical.trim() || cms.seo.canonical || undefined;
  return {
    ...withImage,
    title,
    description,
    alternates: canonical ? { ...withImage.alternates, canonical } : withImage.alternates,
    openGraph: { ...withImage.openGraph, title, description },
    twitter: { ...withImage.twitter, title, description },
  };
}
