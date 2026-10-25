import { existsSync } from "fs";
import { join } from "path";
import { OCCUPANCY_SAMPLE, OCCUPANCY_SAMPLE_SERIES } from "@/lib/occupancy-sample";
import {
  decisionFlowVisualUrl,
  heroVisualUrl,
  kpiHasSeries,
  kpiTrendVisualUrl,
  relatedContentVisualUrl,
  revenueContent,
  serviceMapVisualUrl,
  type ConnectedArea,
  type DecisionStep,
  type KpiDefinition,
  type ProblemItem,
  type ServiceVisual,
} from "@/lib/revenue";
import { faqsForRoute, type FaqItem } from "@/lib/faqs";
import { localeFromPath, localizePath, metadataFor, type Locale } from "@/lib/seo";
import { isCmsPageLive } from "./public";
import { documentById, pageDocumentBySlug } from "./queries";
import {
  REVENUE_CMS_TEMPLATE,
  REVENUE_PAGE_ROUTE,
  REVENUE_PAGE_SLUG,
  chartNeedsSampleLabel,
  parseRevenuePageBody,
  publicCardHref,
  toPublicKpis,
  type CmsLayer,
  type CmsRelatedCard,
  type CmsRevenuePage,
  type CmsVisual,
} from "./revenue-page";
import { defaultRevenueCms } from "./revenue-page-seed";

function publicSrc(src?: string) {
  const next = src?.trim();
  if (!next) return undefined;
  if (/^https?:\/\//i.test(next)) return next;
  const relative = next.replace(/^\//, "");
  return existsSync(join(process.cwd(), "public", relative)) ? next : undefined;
}

function withVisualSrc(visual: CmsVisual, fallback?: string): CmsVisual {
  return { ...visual, src: publicSrc(visual.src) || publicSrc(fallback) || "" };
}

export type RevenuePublicForm = CmsRevenuePage["form"];

export type RevenueResolvedPage = {
  fromCms: boolean;
  hero: CmsRevenuePage["hero"];
  problemsSection: CmsRevenuePage["problemsSection"];
  problems: ProblemItem[];
  diagnosticVisual: ServiceVisual;
  areasSection: CmsRevenuePage["areasSection"];
  areas: ConnectedArea[];
  architecture: {
    title: string;
    description: string;
    statusLabel: string;
    layers: CmsLayer[];
    src?: string;
  };
  stepsSection: CmsRevenuePage["stepsSection"];
  steps: DecisionStep[];
  decisionFlow: {
    title: string;
    description: string;
    statusLabel: string;
    src?: string;
  };
  measureSection: CmsRevenuePage["measureSection"];
  kpis: KpiDefinition[];
  chart: CmsRevenuePage["chart"] & { src?: string; showSample: boolean };
  related: { title: string; src?: string; alt?: string; cards: CmsRelatedCard[] };
  form: RevenuePublicForm;
  faqs: FaqItem[];
  seoTitle: string;
  metaDescription: string;
};

function fallbackDiagnostic(locale: Locale): ServiceVisual {
  const data = revenueContent(locale);
  return data.visual;
}

function resolveFromContent(
  locale: Locale,
  content: CmsRevenuePage,
  fromCms: boolean,
  seoTitle = "",
  metaDescription = "",
): RevenueResolvedPage {
  const defaults = fromCms ? content : defaultRevenueCms(locale);
  const page = fromCms ? content : defaults;
  const heroSrc = publicSrc(page.hero.visual.src) || heroVisualUrl();
  const architectureSrc = publicSrc(page.architecture.visual.src) || (fromCms ? undefined : serviceMapVisualUrl());
  const flowSrc = publicSrc(page.decisionFlow.visual.src) || (fromCms ? undefined : decisionFlowVisualUrl());
  const chartSrc = publicSrc(page.chart.visual.src) || (fromCms ? undefined : kpiTrendVisualUrl());
  const relatedSrc = publicSrc(page.related.visual.src) || (fromCms ? undefined : relatedContentVisualUrl());
  const relatedCards = page.related.cards
    .map((card) => {
      const href = publicCardHref(card.href, locale);
      if (!href) return null;
      return { ...card, href };
    })
    .filter((card): card is CmsRelatedCard => Boolean(card));

  return {
    fromCms,
    hero: {
      ...page.hero,
      visual: withVisualSrc(page.hero.visual, heroSrc),
    },
    problemsSection: page.problemsSection,
    problems: [...page.problems].sort((a, b) => a.order - b.order),
    diagnosticVisual: fallbackDiagnostic(locale),
    areasSection: page.areasSection,
    areas: [...page.areas].sort((a, b) => a.order - b.order),
    architecture: {
      title: page.architecture.title,
      description: page.architecture.description,
      statusLabel: page.architecture.statusLabel,
      layers: page.architecture.layers,
      src: architectureSrc,
    },
    stepsSection: page.stepsSection,
    steps: [...page.steps].sort((a, b) => a.order - b.order),
    decisionFlow: {
      title: page.decisionFlow.title,
      description: page.decisionFlow.description,
      statusLabel: page.decisionFlow.statusLabel,
      src: flowSrc,
    },
    measureSection: page.measureSection,
    kpis: toPublicKpis(page.kpis),
    chart: {
      ...page.chart,
      visual: withVisualSrc(page.chart.visual, chartSrc),
      src: chartSrc,
      showSample: chartNeedsSampleLabel(page),
    },
    related: {
      title: page.related.title,
      src: relatedSrc,
      alt: page.related.visual.alt || page.related.visual.label,
      cards: relatedCards,
    },
    form: page.form,
    faqs: page.faqs.map(({ q, a }) => ({ q, a })),
    seoTitle,
    metaDescription,
  };
}

export async function loadPublishedRevenuePage(locale: Locale) {
  const doc = await pageDocumentBySlug(REVENUE_PAGE_SLUG, locale).catch(() => null);
  if (!doc || doc.trashedAt || doc.template !== REVENUE_CMS_TEMPLATE || !isCmsPageLive(doc)) return null;
  return parseRevenuePageBody(doc.body, locale);
}

export async function loadRevenuePagePreview(id: string) {
  const doc = await documentById(id);
  if (!doc || doc.kind !== "page" || doc.trashedAt) return null;
  const locale = (["th", "en", "ru", "zh"].includes(doc.locale) ? doc.locale : "th") as Locale;
  const content = parseRevenuePageBody(doc.body, locale) ?? defaultRevenueCms(locale);
  return {
    document: doc,
    locale,
    live: isCmsPageLive(doc),
    content,
    resolved: resolveFromContent(locale, content, true, doc.seoTitle, doc.metaDescription),
  };
}

export async function resolveRevenuePage(locale: Locale, preview?: CmsRevenuePage | null): Promise<RevenueResolvedPage> {
  if (preview) return resolveFromContent(locale, preview, true);
  const published = await loadPublishedRevenuePage(locale);
  if (published) return resolveFromContent(locale, published, true);
  return resolveFromContent(locale, defaultRevenueCms(locale), false);
}

export function chartSeriesFromResolved(page: RevenueResolvedPage) {
  const occupancy =
    page.kpis.find((kpi) => kpi.id === "occupancy" || /occupancy/i.test(String(kpi.name))) ?? page.kpis[0];
  const pace = page.kpis.find((kpi) => kpi.id === "booking-pace" || /pace/i.test(String(kpi.name)));
  const labels =
    occupancy && occupancy.labels.length
      ? occupancy.labels
      : pace && pace.labels.length
        ? pace.labels
        : [...OCCUPANCY_SAMPLE_SERIES.labels];
  const occupancyValues = occupancy && kpiHasSeries(occupancy) ? occupancy.values : [];
  const paceValues = pace && kpiHasSeries(pace) ? pace.values : [];
  const targetMatch = occupancy?.target?.match(/(\d+(?:\.\d+)?)/);
  const target = targetMatch ? Number(targetMatch[1]) : OCCUPANCY_SAMPLE.target;
  return {
    labels,
    occupancyValues,
    paceValues,
    target,
  };
}

export function revenueFaqsForJsonLd(content: CmsRevenuePage | null, locale: Locale): FaqItem[] {
  if (content?.faqs.length) return content.faqs.map(({ q, a }) => ({ q, a }));
  return faqsForRoute(localizePath(REVENUE_PAGE_ROUTE, locale));
}

export async function revenuePublicMetadata(route: string) {
  const base = metadataFor(route);
  const locale = localeFromPath(route);
  const doc = await pageDocumentBySlug(REVENUE_PAGE_SLUG, locale).catch(() => null);
  if (!doc || doc.trashedAt || doc.template !== REVENUE_CMS_TEMPLATE || !isCmsPageLive(doc)) return base;
  const content = parseRevenuePageBody(doc.body, locale);
  const title = doc.seoTitle || doc.title || base.title;
  const description = doc.metaDescription || doc.excerpt || base.description;
  const image = publicSrc(doc.ogImage) || publicSrc(content?.seo.social.src) || publicSrc(doc.featuredImage);
  const imageAlt = content?.seo.social.alt || doc.imageAlt || title;
  const withImage = metadataFor(route, image ? { image, imageAlt } : { imageAlt });
  return {
    ...withImage,
    title,
    description,
    openGraph: {
      ...withImage.openGraph,
      title,
      description,
    },
    twitter: {
      ...withImage.twitter,
      title,
      description,
    },
  };
}

export { REVENUE_CMS_TEMPLATE, REVENUE_PAGE_ROUTE, REVENUE_PAGE_SLUG };
