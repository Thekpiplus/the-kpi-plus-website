import { existsSync } from "fs";
import { join } from "path";
import { faqsForRoute, type FaqItem } from "@/lib/faqs";
import {
  type ReservationKpi,
  type ReservationServiceBoundaries,
  type ServiceVisual,
} from "@/lib/reservations";
import { localeFromPath, localizePath, metadataFor, type Locale } from "@/lib/seo";
import { isCmsPageLive } from "./public";
import { documentById, pageDocumentBySlug } from "./queries";
import {
  RESERVATIONS_CMS_TEMPLATE,
  RESERVATIONS_PAGE_ROUTE,
  RESERVATIONS_PAGE_SLUG,
  chartNeedsSampleLabel,
  parseReservationsPageBody,
  publicCardHref,
  type CmsRelatedCard,
  type CmsReservationsPage,
  type CmsReservationsVisual,
  type CmsReservationKpi,
} from "./reservations-page";
import { defaultReservationsCms } from "./reservations-page-seed";

function publicSrc(src?: string) {
  const next = src?.trim();
  if (!next) return undefined;
  if (/^https?:\/\//i.test(next)) return next;
  const relative = next.replace(/^\//, "");
  return existsSync(join(process.cwd(), "public", relative)) ? next : undefined;
}

function withVisualSrc(visual: CmsReservationsVisual, fallback?: string): CmsReservationsVisual {
  return { ...visual, src: publicSrc(visual.src) || publicSrc(fallback) || "" };
}

function kpiIsPublic(kpi: CmsReservationKpi) {
  if (kpi.dataStatus === "draft") return false;
  const hasValue = Boolean(kpi.value.trim()) || kpi.values.some((item) => Number.isFinite(item));
  if (kpi.hideUntilData && !hasValue) return false;
  return true;
}

function toPublicKpiStatus(status: CmsReservationKpi["dataStatus"]): ReservationKpi["dataStatus"] {
  if (status === "anonymised") return "Anonymised";
  if (status === "approved") return "Approved";
  return "Sample";
}

export function toPublicReservationKpis(kpis: CmsReservationKpi[]): ReservationKpi[] {
  return kpis.filter(kpiIsPublic).map((kpi) => {
    const numericValue = Number(kpi.value);
    const numericTarget = Number(kpi.target);
    return {
      id: kpi.id,
      name: kpi.name,
      definitionTh: kpi.definition,
      definitionEn: kpi.definition,
      value: kpi.value.trim() && Number.isFinite(numericValue) ? numericValue : undefined,
      unit: kpi.unit || undefined,
      periodTh: kpi.period,
      periodEn: kpi.period,
      target: kpi.target.trim() && Number.isFinite(numericTarget) ? numericTarget : undefined,
      dataStatus: toPublicKpiStatus(kpi.dataStatus),
      labels: [...kpi.labels],
      values: [...kpi.values],
      hideUntilData: kpi.hideUntilData,
    };
  });
}

export function toPublicReservationsVisual(visual: CmsReservationsVisual, fallback: ServiceVisual): ServiceVisual {
  const status =
    visual.status === "real" || visual.status === "approved" || visual.status === "sample" || visual.status === "placeholder"
      ? visual.status
      : fallback.status;
  return {
    src: visual.src || fallback.src,
    altTh: visual.altTh || fallback.altTh,
    altEn: visual.altEn || fallback.altEn,
    status,
    recommendedSize: fallback.recommendedSize,
    aspectRatio: fallback.aspectRatio,
  };
}

export function boundariesFromCms(content: CmsReservationsPage, locale: Locale): ReservationServiceBoundaries {
  const thai = locale === "th";
  return {
    handles: content.boundaries.handles.map((item) => ({ ...item })),
    hotelOwns: content.boundaries.hotelOwns.map((item) => ({ ...item })),
    supportedChannels: content.boundaries.supportedChannels.filter((item) => item.trim()),
    supportedLanguages: content.boundaries.supportedLanguages.filter((item) => item.trim()),
    operatingHours: content.boundaries.operatingHours,
    slaApproved: content.boundaries.slaApproved,
    slaTextTh: content.boundaries.slaApproved && thai ? content.boundaries.slaText : "",
    slaTextEn: content.boundaries.slaApproved && !thai ? content.boundaries.slaText : "",
    escalationPath: content.boundaries.escalationPath,
    integrationNotes: content.boundaries.integrationNotes,
    reportingFrequency: content.boundaries.reportingFrequency,
    privacyNoteTh: thai ? content.boundaries.privacyNote : "",
    privacyNoteEn: thai ? "" : content.boundaries.privacyNote,
  };
}

export type ReservationsPublicForm = CmsReservationsPage["form"];

export type ReservationsResolvedPage = {
  fromCms: boolean;
  hero: CmsReservationsPage["hero"];
  problemsSection: CmsReservationsPage["problemsSection"];
  problems: CmsReservationsPage["problems"];
  scopeSection: CmsReservationsPage["scopeSection"];
  scopeItems: CmsReservationsPage["scopeItems"];
  benefitsSection: CmsReservationsPage["benefitsSection"];
  benefitGroups: CmsReservationsPage["benefitGroups"];
  flowSteps: CmsReservationsPage["flowSteps"];
  workflowSection: CmsReservationsPage["workflowSection"];
  workflowSteps: CmsReservationsPage["workflowSteps"];
  measureSection: CmsReservationsPage["measureSection"];
  kpis: ReservationKpi[];
  related: { title: string; src?: string; altTh: string; altEn: string; cards: CmsRelatedCard[] };
  form: ReservationsPublicForm;
  faqIntro: string;
  faqs: FaqItem[];
  boundaries: ReservationServiceBoundaries;
  showSample: boolean;
  seoTitle: string;
  metaDescription: string;
};

function resolveFromContent(
  locale: Locale,
  content: CmsReservationsPage,
  fromCms: boolean,
  seoTitle = "",
  metaDescription = "",
): ReservationsResolvedPage {
  const page = fromCms ? content : defaultReservationsCms(locale);
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
    problemsSection: {
      ...page.problemsSection,
      visual: withVisualSrc(page.problemsSection.visual),
    },
    problems: [...page.problems].sort((a, b) => a.order - b.order),
    scopeSection: {
      ...page.scopeSection,
      visual: withVisualSrc(page.scopeSection.visual),
    },
    scopeItems: [...page.scopeItems].sort((a, b) => a.order - b.order),
    benefitsSection: {
      ...page.benefitsSection,
      visual: withVisualSrc(page.benefitsSection.visual),
    },
    benefitGroups: page.benefitGroups.map((group) => ({ ...group, items: [...group.items] })),
    flowSteps: page.flowSteps.map((step) => ({ ...step })),
    workflowSection: {
      ...page.workflowSection,
      visual: withVisualSrc(page.workflowSection.visual),
    },
    workflowSteps: [...page.workflowSteps].sort((a, b) => a.order - b.order),
    measureSection: {
      ...page.measureSection,
      visual: withVisualSrc(page.measureSection.visual),
    },
    kpis: toPublicReservationKpis(page.kpis),
    related: {
      title: page.related.title,
      src: publicSrc(page.related.visual.src),
      altTh: page.related.visual.altTh,
      altEn: page.related.visual.altEn,
      cards: relatedCards,
    },
    form: {
      ...page.form,
      visual: withVisualSrc(page.form.visual),
    },
    faqIntro: page.faqIntro,
    faqs: page.faqs.map(({ q, a }) => ({ q, a })),
    boundaries: boundariesFromCms(page, locale),
    showSample: chartNeedsSampleLabel(page),
    seoTitle,
    metaDescription,
  };
}

export async function loadPublishedReservationsPage(locale: Locale) {
  const doc = await pageDocumentBySlug(RESERVATIONS_PAGE_SLUG, locale).catch(() => null);
  if (!doc || doc.trashedAt || doc.template !== RESERVATIONS_CMS_TEMPLATE || !isCmsPageLive(doc)) return null;
  return parseReservationsPageBody(doc.body, locale);
}

export async function loadReservationsPagePreview(id: string) {
  const doc = await documentById(id);
  if (!doc || doc.kind !== "page" || doc.trashedAt) return null;
  const locale = (["th", "en", "ru", "zh"].includes(doc.locale) ? doc.locale : "th") as Locale;
  const content = parseReservationsPageBody(doc.body, locale) ?? defaultReservationsCms(locale);
  return {
    document: doc,
    locale,
    live: isCmsPageLive(doc),
    content,
    resolved: resolveFromContent(locale, content, true, doc.seoTitle, doc.metaDescription),
  };
}

export async function resolveReservationsPage(
  locale: Locale,
  preview?: CmsReservationsPage | null,
): Promise<ReservationsResolvedPage> {
  if (preview) return resolveFromContent(locale, preview, true);
  const published = await loadPublishedReservationsPage(locale);
  if (published) return resolveFromContent(locale, published, true);
  return resolveFromContent(locale, defaultReservationsCms(locale), false);
}

export function reservationsFaqsForJsonLd(content: CmsReservationsPage | null, locale: Locale): FaqItem[] {
  if (content?.faqs.length) return content.faqs.map(({ q, a }) => ({ q, a }));
  return faqsForRoute(localizePath(RESERVATIONS_PAGE_ROUTE, locale));
}

export async function reservationsPublicMetadata(route: string) {
  const base = metadataFor(route);
  const locale = localeFromPath(route);
  const doc = await pageDocumentBySlug(RESERVATIONS_PAGE_SLUG, locale).catch(() => null);
  if (!doc || doc.trashedAt || doc.template !== RESERVATIONS_CMS_TEMPLATE || !isCmsPageLive(doc)) return base;
  const content = parseReservationsPageBody(doc.body, locale);
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

export { RESERVATIONS_CMS_TEMPLATE, RESERVATIONS_PAGE_ROUTE, RESERVATIONS_PAGE_SLUG };
