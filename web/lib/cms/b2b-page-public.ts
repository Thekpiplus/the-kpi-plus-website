import { existsSync } from "fs";
import { join } from "path";
import type { FaqItem } from "@/lib/faqs";
import { faqsForRoute } from "@/lib/faqs";
import { B2B_FRAMEWORK_VISUAL_CANDIDATE, B2B_FUNNEL_VISUAL_CANDIDATE, B2B_HERO_VISUAL_CANDIDATE, B2B_KPI_VISUAL_CANDIDATE, B2B_READINESS_VISUAL_CANDIDATE, B2B_RELATED_VISUAL_CANDIDATE, B2B_WORKFLOW_VISUAL_CANDIDATE, type B2bKpi } from "@/lib/b2b";
import { localeFromPath, localizePath, metadataFor, type Locale } from "@/lib/seo";
import { isCmsPageLive } from "./public";
import { documentById, pageDocumentBySlug } from "./queries";
import {
  B2B_CMS_TEMPLATE,
  B2B_PAGE_ROUTE,
  B2B_PAGE_SLUG,
  chartNeedsSampleLabel,
  parseB2bPageBody,
  publicCardHref,
  type CmsB2bKpi,
  type CmsB2bPage,
  type CmsB2bVisual,
  type CmsRelatedCard,
} from "./b2b-page";
import { defaultB2bCms } from "./b2b-page-seed";

export function b2bHeroVisualUrl() {
  return publicSrc(B2B_HERO_VISUAL_CANDIDATE);
}

export function b2bFrameworkVisualUrl() {
  return publicSrc(B2B_FRAMEWORK_VISUAL_CANDIDATE);
}

export function b2bReadinessVisualUrl() {
  return publicSrc(B2B_READINESS_VISUAL_CANDIDATE);
}

export function b2bFunnelVisualUrl() {
  return publicSrc(B2B_FUNNEL_VISUAL_CANDIDATE);
}

export function b2bWorkflowVisualUrl() {
  return publicSrc(B2B_WORKFLOW_VISUAL_CANDIDATE);
}

export function b2bKpiVisualUrl() {
  return publicSrc(B2B_KPI_VISUAL_CANDIDATE);
}

export function b2bRelatedVisualUrl() {
  return publicSrc(B2B_RELATED_VISUAL_CANDIDATE);
}

export function b2bPublicTeamPhoto(visual?: CmsB2bVisual) {
  if (!visual?.src.trim()) return undefined;
  if (visual.status !== "real" && visual.status !== "approved") return undefined;
  if (/b2b-agent-sales-team-placeholder|replace with verified|รอรูป|placeholder/i.test(`${visual.src} ${visual.label} ${visual.altTh} ${visual.altEn}`)) {
    return undefined;
  }
  return publicSrc(visual.src);
}

function publicSrc(src?: string) {
  const next = src?.trim();
  if (!next) return undefined;
  if (/^https?:\/\//i.test(next)) return next;
  const relative = next.replace(/^\//, "");
  return existsSync(join(process.cwd(), "public", relative)) ? next : undefined;
}

function withVisualSrc(visual: CmsB2bVisual): CmsB2bVisual {
  return { ...visual, src: publicSrc(visual.src) || "" };
}

function kpiIsPublic(kpi: CmsB2bKpi) {
  if (kpi.dataStatus !== "approved" && kpi.dataStatus !== "anonymised") return false;
  const hasValue = Boolean(kpi.value.trim()) || kpi.values.some((item) => Number.isFinite(item));
  if (!hasValue) return false;
  if (!kpi.name.trim() || !kpi.period.trim()) return false;
  if (!kpi.unit.trim() && !kpi.definition.trim()) return false;
  return true;
}

function toPublicKpiStatus(status: CmsB2bKpi["dataStatus"]): B2bKpi["dataStatus"] {
  if (status === "anonymised") return "Anonymised";
  if (status === "approved") return "Approved";
  return "Sample";
}

export function toPublicB2bKpis(kpis: CmsB2bKpi[]): B2bKpi[] {
  return kpis.filter(kpiIsPublic).map((kpi) => ({
    id: kpi.id,
    name: kpi.name,
    definitionTh: kpi.definition,
    definitionEn: kpi.definition,
    unit: kpi.unit,
    periodTh: kpi.period,
    periodEn: kpi.period,
    comparisonTh: kpi.target,
    comparisonEn: kpi.target,
    dataStatus: toPublicKpiStatus(kpi.dataStatus),
    labels: [...kpi.labels],
    values: [...kpi.values],
    value: kpi.value,
    updatedAt: kpi.updatedAt,
  }));
}

export type B2bResolvedPage = {
  fromCms: boolean;
  hero: CmsB2bPage["hero"];
  readiness: CmsB2bPage["readiness"];
  problemsSection: CmsB2bPage["problemsSection"];
  problems: CmsB2bPage["problems"];
  scopeSection: CmsB2bPage["scopeSection"];
  scopeItems: CmsB2bPage["scopeItems"];
  funnelSection: CmsB2bPage["funnelSection"];
  funnelSteps: CmsB2bPage["funnelSteps"];
  workflowSection: CmsB2bPage["workflowSection"];
  workflowSteps: CmsB2bPage["workflowSteps"];
  measureSection: CmsB2bPage["measureSection"];
  kpis: B2bKpi[];
  related: { title: string; visual: CmsB2bVisual; cards: CmsRelatedCard[] };
  form: CmsB2bPage["form"];
  faqIntro: string;
  faqs: FaqItem[];
  guides: CmsB2bPage["guides"];
  showSample: boolean;
};

function resolveFromContent(locale: Locale, content: CmsB2bPage, fromCms: boolean): B2bResolvedPage {
  const page = fromCms ? content : defaultB2bCms(locale);
  const relatedCards = page.related.cards
    .map((card) => {
      const href = publicCardHref(card.href, locale);
      if (!href) return null;
      return { ...card, href };
    })
    .filter((card): card is CmsRelatedCard => Boolean(card));

  return {
    fromCms,
    hero: { ...page.hero, visual: withVisualSrc(page.hero.visual) },
    readiness: {
      ...page.readiness,
      visual: withVisualSrc(page.readiness.visual),
      items: [...page.readiness.items].sort((a, b) => a.order - b.order),
    },
    problemsSection: page.problemsSection,
    problems: [...page.problems].sort((a, b) => a.order - b.order),
    scopeSection: page.scopeSection,
    scopeItems: [...page.scopeItems].sort((a, b) => a.order - b.order),
    funnelSection: { ...page.funnelSection, visual: withVisualSrc(page.funnelSection.visual) },
    funnelSteps: page.funnelSteps.map((step) => ({
      ...step,
      extraKpis: (step.extraKpis ?? []).map((item) => ({ ...item })),
    })),
    workflowSection: { ...page.workflowSection, visual: withVisualSrc(page.workflowSection.visual) },
    workflowSteps: [...page.workflowSteps].sort((a, b) => a.order - b.order),
    measureSection: { ...page.measureSection, visual: withVisualSrc(page.measureSection.visual) },
    kpis: toPublicB2bKpis(page.kpis),
    related: { title: page.related.title, visual: withVisualSrc(page.related.visual), cards: relatedCards },
    form: { ...page.form, visual: withVisualSrc(page.form.visual) },
    faqIntro: page.faqIntro,
    faqs: page.faqs.map(({ q, a }) => ({ q, a })),
    guides: {
      ...page.guides,
      readinessChecks: [...page.guides.readinessChecks].sort((a, b) => a.order - b.order),
      partnerFit: [...page.guides.partnerFit].sort((a, b) => a.order - b.order),
      salesMaterial: [...page.guides.salesMaterial].sort((a, b) => a.order - b.order),
    },
    showSample: chartNeedsSampleLabel(page),
  };
}

export async function loadPublishedB2bPage(locale: Locale) {
  const doc = await pageDocumentBySlug(B2B_PAGE_SLUG, locale).catch(() => null);
  if (!doc || doc.trashedAt || !isCmsPageLive(doc) || doc.template !== B2B_CMS_TEMPLATE) return null;
  const parsed = parseB2bPageBody(doc.body, locale);
  return parsed ? resolveFromContent(locale, parsed, true) : null;
}

export async function resolveB2bPage(locale: Locale, previewContent?: CmsB2bPage | null): Promise<B2bResolvedPage> {
  if (previewContent) return resolveFromContent(locale, previewContent, true);
  const live = await loadPublishedB2bPage(locale);
  if (live) return live;
  if (locale !== "th") {
    const thaiLive = await loadPublishedB2bPage("th");
    if (thaiLive) return resolveFromContent(locale, defaultB2bCms(locale), false);
  }
  return resolveFromContent(locale, defaultB2bCms(locale), false);
}

export function b2bFaqsForJsonLd(content: CmsB2bPage | null, locale: Locale): FaqItem[] {
  if (content?.faqs.length) return content.faqs.map(({ q, a }) => ({ q, a }));
  return faqsForRoute(localizePath(B2B_PAGE_ROUTE, locale));
}

export async function b2bPublicMetadata(route: string) {
  const base = metadataFor(route);
  const locale = localeFromPath(route);
  const doc = await pageDocumentBySlug(B2B_PAGE_SLUG, locale).catch(() => null);
  if (!doc || doc.trashedAt || doc.template !== B2B_CMS_TEMPLATE || !isCmsPageLive(doc)) return base;
  const content = parseB2bPageBody(doc.body, locale);
  const title = doc.seoTitle || doc.title || base.title;
  const description = doc.metaDescription || doc.excerpt || base.description;
  const image = publicSrc(doc.ogImage) || publicSrc(content?.seo.social.src) || publicSrc(doc.featuredImage);
  const imageAlt = (locale === "th" ? content?.seo.social.altTh : content?.seo.social.altEn) || doc.imageAlt || title;
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

export async function loadB2bPagePreview(id: string) {
  const document = await documentById(id);
  if (!document || document.kind !== "page" || document.trashedAt) return null;
  const locale = localeFromPath(`/${document.slug}`) || (document.locale as Locale) || "th";
  const parsed = parseB2bPageBody(document.body, locale) ?? defaultB2bCms(locale);
  return {
    locale,
    live: isCmsPageLive(document),
    content: parsed,
  };
}
