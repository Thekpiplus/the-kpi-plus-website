import { existsSync } from "fs";
import { join } from "path";
import type { FaqItem } from "@/lib/faqs";
import { auditHref, localeFromPath, metadataFor, SITE, type Locale } from "@/lib/seo";
import { solutionsIndexFaqs } from "@/lib/solutions-faqs";
import { isCmsPageLive } from "./public";
import { documentById, pageDocumentBySlug } from "./queries";
import {
  SOLUTIONS_INDEX_CMS_TEMPLATE,
  SOLUTIONS_INDEX_CTA_PLACEHOLDER,
  SOLUTIONS_INDEX_HERO_PLACEHOLDER,
  SOLUTIONS_INDEX_PAGE_SLUG,
  defaultSolutionsIndexCms,
  parseSolutionsIndexPageBody,
  solutionsIndexIsLibraryPlaceholder,
  solutionsIndexPublishableProof,
  type CmsSolutionsIndexPage,
  type CmsSolutionsIndexVisual,
} from "./solutions-index-page";

function publicSrc(src?: string) {
  const next = src?.trim();
  if (!next) return undefined;
  if (/^https?:\/\//i.test(next)) return next;
  const relative = next.replace(/^\//, "");
  return existsSync(join(process.cwd(), "public", relative)) ? next : undefined;
}

/**
 * Public pages show an uploaded image only when it is Approved with publication permission.
 * Everything else falls back to the library placeholder (or nothing). Previews show the saved image as-is.
 */
function resolveVisual(visual: CmsSolutionsIndexVisual, fallback: string, gate: boolean): CmsSolutionsIndexVisual {
  const own = publicSrc(visual.src);
  const cleared = !gate || solutionsIndexIsLibraryPlaceholder(visual.src) || (visual.status === "approved" && visual.publicationApproved);
  return { ...visual, src: (own && cleared ? own : undefined) || publicSrc(fallback) || "" };
}

export type SolutionsIndexResolvedPage = CmsSolutionsIndexPage & { fromCms: boolean };

function withResolvedVisuals(parsed: CmsSolutionsIndexPage, gate: boolean): CmsSolutionsIndexPage {
  return {
    ...parsed,
    hero: { ...parsed.hero, visual: resolveVisual(parsed.hero.visual, SOLUTIONS_INDEX_HERO_PLACEHOLDER, gate) },
    cta: { ...parsed.cta, visual: resolveVisual(parsed.cta.visual, SOLUTIONS_INDEX_CTA_PLACEHOLDER, gate) },
    cards: {
      ...parsed.cards,
      items: parsed.cards.items.map((card) => ({ ...card, icon: resolveVisual(card.icon, "", gate) })),
    },
    proof: { ...parsed.proof, items: gate ? solutionsIndexPublishableProof(parsed) : parsed.proof.items },
    seo: { ...parsed.seo, social: resolveVisual(parsed.seo.social, "", gate) },
  };
}

export async function loadSolutionsIndexPage(locale: Locale): Promise<SolutionsIndexResolvedPage> {
  const resolvedLocale = locale === "ru" || locale === "zh" ? "en" : locale;
  const copyLocale = resolvedLocale === "th" ? "th" : "en";
  const base = defaultSolutionsIndexCms(copyLocale);
  const preferred = await pageDocumentBySlug(SOLUTIONS_INDEX_PAGE_SLUG, resolvedLocale).catch(() => null);
  const doc = preferred && isCmsPageLive(preferred) ? preferred : null;
  if (!doc || doc.template !== SOLUTIONS_INDEX_CMS_TEMPLATE) {
    return { ...withResolvedVisuals(base, true), fromCms: false };
  }
  const parsed = parseSolutionsIndexPageBody(doc.body, copyLocale);
  if (!parsed) return { ...withResolvedVisuals(base, true), fromCms: false };
  return { ...withResolvedVisuals(parsed, true), fromCms: true };
}

export async function loadSolutionsIndexPagePreview(id: string) {
  const doc = await documentById(id);
  if (!doc) return null;
  const locale = (["th", "en", "ru", "zh"].includes(doc.locale) ? doc.locale : "th") as Locale;
  const parsed = parseSolutionsIndexPageBody(doc.body, locale) ?? defaultSolutionsIndexCms(locale);
  return {
    locale,
    live: isCmsPageLive(doc),
    content: withResolvedVisuals(parsed, false),
  };
}

export function solutionsIndexFaqsFromCms(content: CmsSolutionsIndexPage | null | undefined, locale: Locale): FaqItem[] {
  const english = locale !== "th";
  const mapped =
    content?.faqs
      .map((item) => ({
        q: english && item.qEn.trim() ? item.qEn : item.qTh,
        a: english && item.aEn.trim() ? item.aEn : item.aTh,
      }))
      .filter((item) => item.q.trim() && item.a.trim()) ?? [];
  return mapped.length ? mapped : solutionsIndexFaqs(locale === "th" ? "th" : "en");
}

export function solutionsIndexPublicHref(href: string, locale: Locale, fallback: string) {
  const next = href.trim() || fallback;
  if (/^\/?#audit$/i.test(next)) return auditHref(locale);
  if (/^(#|https?:\/\/|mailto:|tel:)/i.test(next)) return next;
  if (next.startsWith("/")) {
    if (locale === "th" || next.startsWith("/en/") || next.startsWith("/ru/") || next.startsWith("/zh/") || /^\/(en|ru|zh)$/.test(next)) return next;
    return `/${locale}${next}`;
  }
  return next;
}

export async function solutionsIndexPublicMetadata(route: string) {
  const locale = localeFromPath(route);
  const fallback = metadataFor(route);
  const cms = await loadSolutionsIndexPage(locale);
  if (!cms.fromCms) return fallback;
  // Thai is the unprefixed default: it never borrows another language's SEO variant or canonical.
  const variant = locale === "th" ? undefined : cms.seo.variants.find((item) => item.locale === locale);
  const image = publicSrc(cms.seo.social.src);
  const imageAlt = (locale === "th" ? cms.seo.social.altTh : cms.seo.social.altEn) || cms.hero.visual.altTh;
  const withImage = metadataFor(route, image ? { image, imageAlt } : { imageAlt });
  const title = variant?.title.trim() || fallback.title;
  const description = variant?.description.trim() || cms.hero.body || fallback.description;
  const rawCanonical = variant?.canonical.trim() || (locale === "th" ? cms.seo.canonical.trim() : "");
  const canonical = rawCanonical ? (rawCanonical.startsWith("/") ? `${SITE}${rawCanonical}` : rawCanonical) : undefined;
  return {
    ...withImage,
    title,
    description,
    alternates: canonical ? { ...withImage.alternates, canonical } : withImage.alternates,
    openGraph: { ...withImage.openGraph, title, description },
    twitter: { ...withImage.twitter, title, description },
  };
}
