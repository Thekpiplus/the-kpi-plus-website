import { existsSync } from "fs";
import { join } from "path";
import type { FaqItem } from "@/lib/faqs";
import { localeFromPath, metadataFor, type Locale } from "@/lib/seo";
import { isCmsPageLive } from "./public";
import { documentById, pageDocumentBySlug } from "./queries";
import {
  GOOGLE_ADS_CMS_TEMPLATE,
  GOOGLE_ADS_PAGE_ROUTE,
  GOOGLE_ADS_PAGE_SLUG,
  parseGoogleAdsPageBody,
  publicCardHref,
  type CmsAdsKpi,
  type CmsAdsRelatedCard,
  type CmsAdsVisual,
  type CmsGoogleAdsPage,
} from "./google-ads-page";
import { ADS_HERO_VISUAL_CANDIDATE, ADS_RELATED_VISUAL_CANDIDATE, ADS_TEAM_VISUAL_CANDIDATE, ADS_VISIBILITY_VISUAL_CANDIDATE, adsFaqs, adsKpiSeriesReady } from "@/lib/google-ads";
import { defaultGoogleAdsCms } from "./google-ads-page-seed";

function publicSrc(src?: string) {
  const next = src?.trim();
  if (!next) return undefined;
  if (/^https?:\/\//i.test(next)) return next;
  const relative = next.replace(/^\//, "");
  return existsSync(join(process.cwd(), "public", relative)) ? next : undefined;
}

export function adsHeroVisualUrl() {
  return publicSrc(ADS_HERO_VISUAL_CANDIDATE);
}

export function adsVisibilityVisualUrl() {
  const next = publicSrc(ADS_VISIBILITY_VISUAL_CANDIDATE);
  return next && next !== ADS_HERO_VISUAL_CANDIDATE ? next : undefined;
}

export function adsRelatedVisualUrl() {
  const next = publicSrc(ADS_RELATED_VISUAL_CANDIDATE);
  return next && next !== ADS_HERO_VISUAL_CANDIDATE ? next : undefined;
}

export function adsPublicTeamPhoto(visual?: CmsAdsVisual) {
  if (!visual?.src.trim()) return undefined;
  if (visual.status !== "real" && visual.status !== "approved") return undefined;
  if (
    visual.src === ADS_TEAM_VISUAL_CANDIDATE ||
    /google-ads-team-placeholder|replace with verified|รอรูป|placeholder|ai-generated person/i.test(
      `${visual.src} ${visual.label} ${visual.altTh} ${visual.altEn}`,
    )
  ) {
    return undefined;
  }
  return publicSrc(visual.src);
}

function withVisualSrc(visual: CmsAdsVisual): CmsAdsVisual {
  return { ...visual, src: publicSrc(visual.src) || "" };
}

function kpiIsPublic(kpi: CmsAdsKpi) {
  if (kpi.hideUntilData) return false;
  if (kpi.dataStatus === "draft") return false;
  if (kpi.dataStatus !== "approved" && kpi.dataStatus !== "anonymised" && kpi.dataStatus !== "sample") return false;
  if (!kpi.name.trim() || !kpi.period.trim() || !kpi.context.trim()) return false;
  if (!kpi.unit.trim() && !kpi.definition.trim()) return false;
  return Boolean(kpi.value.trim() || adsKpiSeriesReady(kpi.labels, kpi.values));
}

export type GoogleAdsResolvedPage = {
  fromCms: boolean;
  hero: CmsGoogleAdsPage["hero"];
  visibility: CmsGoogleAdsPage["visibility"];
  readiness: CmsGoogleAdsPage["readiness"];
  channels: CmsGoogleAdsPage["channels"];
  workflow: CmsGoogleAdsPage["workflow"];
  checklists: CmsGoogleAdsPage["checklists"];
  measure: CmsGoogleAdsPage["measure"];
  related: { title: string; visual: CmsAdsVisual; cards: CmsAdsRelatedCard[] };
  form: CmsGoogleAdsPage["form"];
  faqs: FaqItem[];
  publicKpis: CmsAdsKpi[];
};

function resolveFromContent(locale: Locale, content: CmsGoogleAdsPage, fromCms: boolean): GoogleAdsResolvedPage {
  const page = fromCms ? content : defaultGoogleAdsCms(locale);
  return {
    fromCms,
    hero: { ...page.hero, visual: withVisualSrc(page.hero.visual) },
    visibility: { ...page.visibility, visual: withVisualSrc(page.visibility.visual) },
    readiness: {
      ...page.readiness,
      visual: withVisualSrc(page.readiness.visual),
      items: [...page.readiness.items].sort((a, b) => a.order - b.order),
    },
    channels: {
      ...page.channels,
      visual: withVisualSrc(page.channels.visual),
      rows: [...page.channels.rows].sort((a, b) => a.order - b.order),
    },
    workflow: {
      ...page.workflow,
      visual: withVisualSrc(page.workflow.visual),
      steps: [...page.workflow.steps].sort((a, b) => a.order - b.order),
    },
    checklists: page.checklists,
    measure: { ...page.measure, visual: withVisualSrc(page.measure.visual) },
    related: {
      title: page.related.title,
      visual: withVisualSrc(page.related.visual),
      cards: page.related.cards
        .map((card) => {
          const href = publicCardHref(card.href, locale);
          if (!href || !card.title.trim()) return null;
          return { ...card, href };
        })
        .filter((card): card is CmsAdsRelatedCard => Boolean(card)),
    },
    form: page.form,
    faqs: page.faqs.map(({ q, a }) => ({ q, a })).filter((item) => item.q && item.a),
    publicKpis: page.measure.kpis.filter(kpiIsPublic),
  };
}

export async function loadPublishedGoogleAdsPage(locale: Locale) {
  const doc = await pageDocumentBySlug(GOOGLE_ADS_PAGE_SLUG, locale).catch(() => null);
  if (!doc || doc.trashedAt || !isCmsPageLive(doc) || doc.template !== GOOGLE_ADS_CMS_TEMPLATE) return null;
  const parsed = parseGoogleAdsPageBody(doc.body, locale);
  return parsed ? resolveFromContent(locale, parsed, true) : null;
}

export async function resolveGoogleAdsPage(locale: Locale, previewContent?: CmsGoogleAdsPage | null): Promise<GoogleAdsResolvedPage> {
  if (previewContent) return resolveFromContent(locale, previewContent, true);
  const live = await loadPublishedGoogleAdsPage(locale);
  if (live) return live;
  if (locale !== "th") {
    const thaiLive = await loadPublishedGoogleAdsPage("th");
    if (thaiLive) return resolveFromContent(locale, defaultGoogleAdsCms(locale), false);
  }
  return resolveFromContent(locale, defaultGoogleAdsCms(locale), false);
}

export async function googleAdsPublicMetadata(route: string) {
  const base = metadataFor(route);
  const locale = localeFromPath(route);
  const doc = await pageDocumentBySlug(GOOGLE_ADS_PAGE_SLUG, locale).catch(() => null);
  if (!doc || doc.trashedAt || doc.template !== GOOGLE_ADS_CMS_TEMPLATE || !isCmsPageLive(doc)) return base;
  const content = parseGoogleAdsPageBody(doc.body, locale);
  const title = doc.seoTitle || doc.title || base.title;
  const description = doc.metaDescription || doc.excerpt || base.description;
  const image = publicSrc(doc.ogImage) || publicSrc(content?.seo.social.src) || publicSrc(doc.featuredImage);
  const imageAlt = (locale === "th" ? content?.seo.social.altTh : content?.seo.social.altEn) || doc.imageAlt || title;
  const withImage = metadataFor(route, image ? { image, imageAlt } : { imageAlt });
  return {
    ...withImage,
    title,
    description,
    openGraph: { ...withImage.openGraph, title, description },
    twitter: { ...withImage.twitter, title, description },
  };
}

export async function loadGoogleAdsPagePreview(id: string) {
  const document = await documentById(id);
  if (!document || document.kind !== "page" || document.trashedAt) return null;
  const locale = localeFromPath(`/${document.slug}`) || (document.locale as Locale) || "th";
  const parsed = parseGoogleAdsPageBody(document.body, locale) ?? defaultGoogleAdsCms(locale);
  return { locale, live: isCmsPageLive(document), content: parsed };
}

export function googleAdsFaqsForJsonLd(content: CmsGoogleAdsPage | null, locale: Locale): FaqItem[] {
  const faqs = content?.faqs.map(({ q, a }) => ({ q, a })).filter((item) => item.q && item.a) ?? [];
  return faqs.length ? faqs : adsFaqs(locale);
}
