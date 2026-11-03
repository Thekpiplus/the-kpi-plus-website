import { existsSync } from "fs";
import { join } from "path";
import type { FaqItem } from "@/lib/faqs";
import { hotelTrainingFaqs, hotelTrainingFaqsAreStale, HOTEL_TRAINING_GALLERY_PLACEHOLDER, HOTEL_TRAINING_HERO_VISUAL_CANDIDATE, HOTEL_TRAINING_NEEDS_VISUAL_CANDIDATE, HOTEL_TRAINING_TRAINER_VISUAL } from "@/lib/hotel-training";
import { localeFromPath, metadataFor, type Locale } from "@/lib/seo";
import { isCmsPageLive } from "./public";
import { documentById, pageDocumentBySlug } from "./queries";
import {
  HOTEL_TRAINING_CMS_TEMPLATE,
  HOTEL_TRAINING_PAGE_SLUG,
  defaultHotelTrainingCms,
  parseHotelTrainingPageBody,
  type CmsHotelTrainingPage,
  type CmsHotelTrainingVisual,
} from "./hotel-training-page";

function publicSrc(src?: string) {
  const next = src?.trim();
  if (!next) return undefined;
  if (/^https?:\/\//i.test(next)) return next;
  const relative = next.replace(/^\//, "");
  return existsSync(join(process.cwd(), "public", relative)) ? next : undefined;
}

function withVisualSrc(visual: CmsHotelTrainingVisual, fallback: string): CmsHotelTrainingVisual {
  return { ...visual, src: publicSrc(visual.src) || publicSrc(fallback) || "" };
}

export type HotelTrainingResolvedPage = CmsHotelTrainingPage & { fromCms: boolean };

function withResolvedVisuals(parsed: CmsHotelTrainingPage): CmsHotelTrainingPage {
  return {
    ...parsed,
    hero: { ...parsed.hero, visual: withVisualSrc(parsed.hero.visual, HOTEL_TRAINING_HERO_VISUAL_CANDIDATE) },
    needs: { ...parsed.needs, visual: withVisualSrc(parsed.needs.visual, HOTEL_TRAINING_NEEDS_VISUAL_CANDIDATE) },
    gallery: {
      ...parsed.gallery,
      items: parsed.gallery.items.slice(0, 6).map((item) => ({
        ...item,
        src: publicSrc(item.src) || HOTEL_TRAINING_GALLERY_PLACEHOLDER.src,
      })),
    },
    trainer: { ...parsed.trainer, src: publicSrc(parsed.trainer.src) || HOTEL_TRAINING_TRAINER_VISUAL.src },
    seo: { ...parsed.seo, social: withVisualSrc(parsed.seo.social, "") },
  };
}

export async function loadHotelTrainingPage(locale: Locale): Promise<HotelTrainingResolvedPage> {
  const resolvedLocale = locale === "ru" || locale === "zh" ? "en" : locale;
  const base = defaultHotelTrainingCms(resolvedLocale === "th" ? "th" : "en");
  const preferred = await pageDocumentBySlug(HOTEL_TRAINING_PAGE_SLUG, resolvedLocale).catch(() => null);
  const doc = preferred && isCmsPageLive(preferred) ? preferred : null;
  if (!doc || doc.template !== HOTEL_TRAINING_CMS_TEMPLATE) {
    return { ...withResolvedVisuals(base), fromCms: false };
  }
  const parsed = parseHotelTrainingPageBody(doc.body, resolvedLocale === "th" ? "th" : "en");
  if (!parsed) return { ...withResolvedVisuals(base), fromCms: false };
  return { ...withResolvedVisuals(parsed), fromCms: true };
}

export async function loadHotelTrainingPagePreview(id: string) {
  const doc = await documentById(id);
  if (!doc) return null;
  const locale = (["th", "en", "ru", "zh"].includes(doc.locale) ? doc.locale : "th") as Locale;
  const parsed = parseHotelTrainingPageBody(doc.body, locale) ?? defaultHotelTrainingCms(locale);
  return {
    locale,
    live: isCmsPageLive(doc),
    content: withResolvedVisuals(parsed),
  };
}

export function hotelTrainingFaqsFromCms(content: CmsHotelTrainingPage | null | undefined, locale: Locale): FaqItem[] {
  const english = locale !== "th";
  const mapped =
    content?.faqs.map((item) => ({
      q: english && item.qEn.trim() ? item.qEn : item.qTh,
      a: english && item.aEn.trim() ? item.aEn : item.aTh,
    })) ?? [];
  return mapped.length && !hotelTrainingFaqsAreStale(mapped) ? mapped : hotelTrainingFaqs(locale === "th" ? "th" : "en");
}

export function hotelTrainingPublicHref(href: string, locale: Locale, fallback: string) {
  const next = href.trim() || fallback;
  if (/^(#|https?:\/\/|mailto:|tel:)/i.test(next)) return next;
  if (next.startsWith("/")) {
    if (locale === "th" || next.startsWith("/en/") || next.startsWith("/ru/") || next.startsWith("/zh/")) return next;
    return `/${locale}${next}`;
  }
  return next;
}

export async function hotelTrainingPublicMetadata(route: string) {
  const locale = localeFromPath(route);
  const fallback = metadataFor(route);
  const cms = await loadHotelTrainingPage(locale);
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
