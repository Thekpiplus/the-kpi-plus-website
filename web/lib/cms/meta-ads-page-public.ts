import { existsSync } from "fs";
import { join } from "path";
import type { FaqItem } from "@/lib/faqs";
import { localeFromPath, metadataFor, type Locale } from "@/lib/seo";
import { isCmsPageLive } from "./public";
import { documentById, pageDocumentBySlug } from "./queries";
import {
  META_ADS_CMS_TEMPLATE,
  META_ADS_PAGE_ROUTE,
  META_ADS_PAGE_SLUG,
  parseMetaAdsPageBody,
  publicCardHref,
  type CmsAdsKpi,
  type CmsMetaRelatedCard,
  type CmsAdsVisual,
  type CmsMetaAdsPage,
} from "./meta-ads-page";
import { META_HERO_VISUAL_CANDIDATE, META_RELATED_VISUAL_CANDIDATE, META_TEAM_VISUAL_CANDIDATE, META_AUDIENCE_VISUAL_CANDIDATE, metaFaqs, metaFaqsAreStale, metaKpiSeriesReady } from "@/lib/meta-ads";
import { defaultMetaAdsCms } from "./meta-ads-page-seed";

function publicSrc(src?: string) {
  const next = src?.trim();
  if (!next) return undefined;
  if (/^https?:\/\//i.test(next)) return next;
  const relative = next.replace(/^\//, "");
  return existsSync(join(process.cwd(), "public", relative)) ? next : undefined;
}

export function metaHeroVisualUrl() {
  return publicSrc(META_HERO_VISUAL_CANDIDATE);
}

export function metaAudienceVisualUrl() {
  const next = publicSrc(META_AUDIENCE_VISUAL_CANDIDATE);
  return next && next !== META_HERO_VISUAL_CANDIDATE ? next : undefined;
}

export function metaRelatedVisualUrl() {
  const next = publicSrc(META_RELATED_VISUAL_CANDIDATE);
  return next && next !== META_HERO_VISUAL_CANDIDATE ? next : undefined;
}

export function metaPublicTeamPhoto(visual?: CmsAdsVisual) {
  if (!visual?.src.trim()) return undefined;
  if (visual.status !== "real" && visual.status !== "approved") return undefined;
  if (
    visual.src === META_TEAM_VISUAL_CANDIDATE ||
    /google-ads-team-placeholder|meta-ads-team-placeholder|replace with verified|รอรูป|placeholder|ai-generated person/i.test(
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
  if (!kpi.name.trim() || !kpi.period.trim()) return false;
  if (!(kpi.objective.trim() || kpi.context.trim())) return false;
  if (!kpi.market.trim()) return false;
  if (!kpi.unit.trim() && !kpi.definition.trim()) return false;
  return Boolean(kpi.value.trim() || metaKpiSeriesReady(kpi.labels, kpi.values));
}

export type GoogleAdsResolvedPage = {
  fromCms: boolean;
  hero: CmsMetaAdsPage["hero"];
  visibility: CmsMetaAdsPage["visibility"];
  readiness: CmsMetaAdsPage["readiness"];
  channels: CmsMetaAdsPage["channels"];
  scenario: CmsMetaAdsPage["scenario"];
  workflow: CmsMetaAdsPage["workflow"];
  creative: CmsMetaAdsPage["creative"];
  checklists: CmsMetaAdsPage["checklists"];
  measure: CmsMetaAdsPage["measure"];
  related: { title: string; visual: CmsAdsVisual; cards: CmsMetaRelatedCard[] };
  form: CmsMetaAdsPage["form"];
  faqs: FaqItem[];
  publicKpis: CmsAdsKpi[];
};

function resolveFromContent(locale: Locale, content: CmsMetaAdsPage, fromCms: boolean): GoogleAdsResolvedPage {
  const page = fromCms ? content : defaultMetaAdsCms(locale);
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
    scenario: {
      ...page.scenario,
      visual: withVisualSrc(page.scenario.visual),
      rows: [...(page.scenario?.rows || [])].sort((a, b) => a.order - b.order),
    },
    workflow: {
      ...page.workflow,
      visual: withVisualSrc(page.workflow.visual),
      steps: [...page.workflow.steps].sort((a, b) => a.order - b.order),
    },
    creative: {
      title: page.creative?.title || "",
      body: page.creative?.body || "",
      rows: [...(page.creative?.rows || [])]
        .sort((a, b) => a.order - b.order)
        .map((row) => ({ ...row, assetSrc: publicSrc(row.assetSrc) || "" })),
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
        .filter((card): card is CmsMetaRelatedCard => Boolean(card)),
    },
    form: page.form,
    faqs: page.faqs.map(({ q, a }) => ({ q, a })).filter((item) => item.q && item.a),
    publicKpis: page.measure.kpis.filter(kpiIsPublic),
  };
}

export async function loadPublishedGoogleAdsPage(locale: Locale) {
  const doc = await pageDocumentBySlug(META_ADS_PAGE_SLUG, locale).catch(() => null);
  if (!doc || doc.trashedAt || !isCmsPageLive(doc) || doc.template !== META_ADS_CMS_TEMPLATE) return null;
  const parsed = parseMetaAdsPageBody(doc.body, locale);
  return parsed ? resolveFromContent(locale, parsed, true) : null;
}

export async function resolveMetaAdsPage(locale: Locale, previewContent?: CmsMetaAdsPage | null): Promise<GoogleAdsResolvedPage> {
  if (previewContent) return resolveFromContent(locale, previewContent, true);
  const live = await loadPublishedGoogleAdsPage(locale);
  if (live) return live;
  if (locale !== "th") {
    const thaiLive = await loadPublishedGoogleAdsPage("th");
    if (thaiLive) return resolveFromContent(locale, defaultMetaAdsCms(locale), false);
  }
  return resolveFromContent(locale, defaultMetaAdsCms(locale), false);
}

export async function metaAdsPublicMetadata(route: string) {
  const base = metadataFor(route);
  const locale = localeFromPath(route);
  const doc = await pageDocumentBySlug(META_ADS_PAGE_SLUG, locale).catch(() => null);
  if (!doc || doc.trashedAt || doc.template !== META_ADS_CMS_TEMPLATE || !isCmsPageLive(doc)) return base;
  const content = parseMetaAdsPageBody(doc.body, locale);
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

export async function loadMetaAdsPagePreview(id: string) {
  const document = await documentById(id);
  if (!document || document.kind !== "page" || document.trashedAt) return null;
  const locale = localeFromPath(`/${document.slug}`) || (document.locale as Locale) || "th";
  const parsed = parseMetaAdsPageBody(document.body, locale) ?? defaultMetaAdsCms(locale);
  return { locale, live: isCmsPageLive(document), content: parsed };
}

export function googleAdsFaqsForJsonLd(content: CmsMetaAdsPage | null, locale: Locale): FaqItem[] {
  const faqs = content?.faqs.map(({ q, a }) => ({ q, a })).filter((item) => item.q && item.a) ?? [];
  return faqs.length && !metaFaqsAreStale(faqs) ? faqs : metaFaqs(locale);
}
