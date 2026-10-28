import { existsSync } from "fs";
import { join } from "path";
import type { FaqItem } from "@/lib/faqs";
import {
  hotelWebsiteFaqs,
  hotelWebsiteFaqsAreStale,
  WEBSITE_CMS_STACK_VISUAL_CANDIDATE,
  WEBSITE_CONFIDENCE_VISUAL_CANDIDATE,
  WEBSITE_DECISION_VISUAL_CANDIDATE,
  WEBSITE_FRAMEWORK_VISUAL_CANDIDATE,
  WEBSITE_HERO_VISUAL_CANDIDATE,
  WEBSITE_KPI_VISUAL_CANDIDATE,
  WEBSITE_RELATED_VISUAL_CANDIDATE,
  WEBSITE_WORKFLOW_VISUAL_CANDIDATE,
} from "@/lib/hotel-website";
import type { Locale } from "@/lib/seo";
import { isCmsPageLive } from "./public";
import { documentById, pageDocumentBySlug } from "./queries";
import {
  HOTEL_WEBSITE_CMS_TEMPLATE,
  HOTEL_WEBSITE_PAGE_SLUG,
  defaultHotelWebsiteCms,
  parseHotelWebsitePageBody,
  type CmsHotelWebsitePage,
  type CmsWebsiteVisual,
} from "./hotel-website-page";

function publicSrc(src?: string) {
  const next = src?.trim();
  if (!next) return undefined;
  if (/^https?:\/\//i.test(next)) return next;
  const relative = next.replace(/^\//, "");
  return existsSync(join(process.cwd(), "public", relative)) ? next : undefined;
}

function withVisualSrc(visual: CmsWebsiteVisual): CmsWebsiteVisual {
  return { ...visual, src: publicSrc(visual.src) || "" };
}

export function websiteHeroVisualUrl() {
  return publicSrc(WEBSITE_HERO_VISUAL_CANDIDATE);
}

export function websiteConfidenceVisualUrl() {
  const next = publicSrc(WEBSITE_CONFIDENCE_VISUAL_CANDIDATE);
  return next && next !== WEBSITE_HERO_VISUAL_CANDIDATE ? next : undefined;
}

export function websiteFrameworkVisualUrl() {
  const next = publicSrc(WEBSITE_FRAMEWORK_VISUAL_CANDIDATE);
  if (!next) return undefined;
  if (next === WEBSITE_HERO_VISUAL_CANDIDATE || next === WEBSITE_CONFIDENCE_VISUAL_CANDIDATE) return undefined;
  return next;
}

export function websiteCmsStackVisualUrl() {
  const next = publicSrc(WEBSITE_CMS_STACK_VISUAL_CANDIDATE);
  if (!next) return undefined;
  const blocked = new Set([
    WEBSITE_HERO_VISUAL_CANDIDATE,
    WEBSITE_CONFIDENCE_VISUAL_CANDIDATE,
    WEBSITE_FRAMEWORK_VISUAL_CANDIDATE,
  ]);
  return blocked.has(next) ? undefined : next;
}

export function websiteDecisionVisualUrl() {
  const next = publicSrc(WEBSITE_DECISION_VISUAL_CANDIDATE);
  if (!next) return undefined;
  const blocked = new Set([
    WEBSITE_HERO_VISUAL_CANDIDATE,
    WEBSITE_CONFIDENCE_VISUAL_CANDIDATE,
    WEBSITE_FRAMEWORK_VISUAL_CANDIDATE,
    WEBSITE_CMS_STACK_VISUAL_CANDIDATE,
  ]);
  return blocked.has(next) ? undefined : next;
}

export function websiteWorkflowVisualUrl() {
  const next = publicSrc(WEBSITE_WORKFLOW_VISUAL_CANDIDATE);
  if (!next) return undefined;
  const blocked = new Set([
    WEBSITE_HERO_VISUAL_CANDIDATE,
    WEBSITE_CONFIDENCE_VISUAL_CANDIDATE,
    WEBSITE_FRAMEWORK_VISUAL_CANDIDATE,
    WEBSITE_CMS_STACK_VISUAL_CANDIDATE,
    WEBSITE_DECISION_VISUAL_CANDIDATE,
  ]);
  return blocked.has(next) ? undefined : next;
}

export function websiteKpiVisualUrl() {
  const next = publicSrc(WEBSITE_KPI_VISUAL_CANDIDATE);
  if (!next) return undefined;
  const blocked = new Set([
    WEBSITE_HERO_VISUAL_CANDIDATE,
    WEBSITE_CONFIDENCE_VISUAL_CANDIDATE,
    WEBSITE_FRAMEWORK_VISUAL_CANDIDATE,
    WEBSITE_CMS_STACK_VISUAL_CANDIDATE,
    WEBSITE_DECISION_VISUAL_CANDIDATE,
    WEBSITE_WORKFLOW_VISUAL_CANDIDATE,
  ]);
  return blocked.has(next) ? undefined : next;
}

export function websiteRelatedVisualUrl() {
  const next = publicSrc(WEBSITE_RELATED_VISUAL_CANDIDATE);
  if (!next) return undefined;
  const blocked = new Set([
    WEBSITE_HERO_VISUAL_CANDIDATE,
    WEBSITE_CONFIDENCE_VISUAL_CANDIDATE,
    WEBSITE_FRAMEWORK_VISUAL_CANDIDATE,
    WEBSITE_CMS_STACK_VISUAL_CANDIDATE,
    WEBSITE_DECISION_VISUAL_CANDIDATE,
    WEBSITE_WORKFLOW_VISUAL_CANDIDATE,
    WEBSITE_KPI_VISUAL_CANDIDATE,
  ]);
  return blocked.has(next) ? undefined : next;
}

function withHeroVisualSrc(visual: CmsWebsiteVisual): CmsWebsiteVisual {
  return { ...visual, src: publicSrc(visual.src) || websiteHeroVisualUrl() || "" };
}

function withConfidenceVisualSrc(visual: CmsWebsiteVisual, heroSrc: string): CmsWebsiteVisual {
  const dummy = websiteConfidenceVisualUrl() || "";
  const next = publicSrc(visual.src) || dummy;
  if (!next || next === WEBSITE_HERO_VISUAL_CANDIDATE || next === heroSrc) {
    return { ...visual, src: dummy && dummy !== heroSrc ? dummy : "" };
  }
  return { ...visual, src: next };
}

function withFrameworkVisualSrc(visual: CmsWebsiteVisual): CmsWebsiteVisual {
  const dummy = websiteFrameworkVisualUrl() || "";
  const next = publicSrc(visual.src) || dummy;
  const blocked = new Set([WEBSITE_HERO_VISUAL_CANDIDATE, WEBSITE_CONFIDENCE_VISUAL_CANDIDATE, ""]);
  if (!next || blocked.has(next)) return { ...visual, src: dummy };
  return { ...visual, src: next };
}

function withDecisionVisualSrc(visual: CmsWebsiteVisual): CmsWebsiteVisual {
  const dummy = websiteDecisionVisualUrl() || "";
  const next = publicSrc(visual.src) || dummy;
  const blocked = new Set([
    WEBSITE_HERO_VISUAL_CANDIDATE,
    WEBSITE_CONFIDENCE_VISUAL_CANDIDATE,
    WEBSITE_FRAMEWORK_VISUAL_CANDIDATE,
    WEBSITE_CMS_STACK_VISUAL_CANDIDATE,
    "",
  ]);
  if (!next || blocked.has(next)) return { ...visual, src: dummy };
  return { ...visual, src: next };
}

function withCmsVisualSrc(visual: CmsWebsiteVisual): CmsWebsiteVisual {
  const dummy = websiteCmsStackVisualUrl() || "";
  const next = publicSrc(visual.src) || dummy;
  const blocked = new Set([
    WEBSITE_HERO_VISUAL_CANDIDATE,
    WEBSITE_CONFIDENCE_VISUAL_CANDIDATE,
    WEBSITE_FRAMEWORK_VISUAL_CANDIDATE,
    "",
  ]);
  if (!next || blocked.has(next)) {
    return { ...visual, src: dummy };
  }
  return { ...visual, src: next };
}

function withWorkflowVisualSrc(visual: CmsWebsiteVisual): CmsWebsiteVisual {
  const dummy = websiteWorkflowVisualUrl() || "";
  const next = publicSrc(visual.src) || dummy;
  const blocked = new Set([
    WEBSITE_HERO_VISUAL_CANDIDATE,
    WEBSITE_CONFIDENCE_VISUAL_CANDIDATE,
    WEBSITE_FRAMEWORK_VISUAL_CANDIDATE,
    WEBSITE_CMS_STACK_VISUAL_CANDIDATE,
    WEBSITE_DECISION_VISUAL_CANDIDATE,
    "",
  ]);
  if (!next || blocked.has(next)) {
    return { ...visual, src: dummy };
  }
  return { ...visual, src: next };
}

function withRelatedVisualSrc(visual: CmsWebsiteVisual): CmsWebsiteVisual {
  const dummy = websiteRelatedVisualUrl() || "";
  const next = publicSrc(visual.src) || dummy;
  const blocked = new Set([
    WEBSITE_HERO_VISUAL_CANDIDATE,
    WEBSITE_CONFIDENCE_VISUAL_CANDIDATE,
    WEBSITE_FRAMEWORK_VISUAL_CANDIDATE,
    WEBSITE_CMS_STACK_VISUAL_CANDIDATE,
    WEBSITE_DECISION_VISUAL_CANDIDATE,
    WEBSITE_WORKFLOW_VISUAL_CANDIDATE,
    WEBSITE_KPI_VISUAL_CANDIDATE,
    "",
  ]);
  if (!next || blocked.has(next)) {
    return { ...visual, src: dummy };
  }
  return { ...visual, src: next };
}

function withKpiVisualSrc(visual: CmsWebsiteVisual): CmsWebsiteVisual {
  const dummy = websiteKpiVisualUrl() || "";
  const next = publicSrc(visual.src) || dummy;
  const blocked = new Set([
    WEBSITE_HERO_VISUAL_CANDIDATE,
    WEBSITE_CONFIDENCE_VISUAL_CANDIDATE,
    WEBSITE_FRAMEWORK_VISUAL_CANDIDATE,
    WEBSITE_CMS_STACK_VISUAL_CANDIDATE,
    WEBSITE_DECISION_VISUAL_CANDIDATE,
    WEBSITE_WORKFLOW_VISUAL_CANDIDATE,
    "",
  ]);
  if (!next || blocked.has(next)) {
    return { ...visual, src: dummy };
  }
  return { ...visual, src: next };
}

export type HotelWebsiteResolvedPage = CmsHotelWebsitePage & { fromCms: boolean };

function withResolvedVisuals(parsed: CmsHotelWebsitePage): CmsHotelWebsitePage {
  return {
    ...parsed,
    hero: { ...parsed.hero, visual: withHeroVisualSrc(parsed.hero.visual) },
    confidence: {
      ...parsed.confidence,
      visual: withConfidenceVisualSrc(
        parsed.confidence.visual,
        publicSrc(parsed.hero.visual.src) || websiteHeroVisualUrl() || "",
      ),
    },
    readiness: { ...parsed.readiness, visual: withVisualSrc(parsed.readiness.visual) },
    framework: { ...parsed.framework, visual: withFrameworkVisualSrc(parsed.framework.visual) },
    cms: { ...parsed.cms, visual: withCmsVisualSrc(parsed.cms.visual) },
    rebuild: { ...parsed.rebuild, visual: withDecisionVisualSrc(parsed.rebuild.visual) },
    workflow: { ...parsed.workflow, visual: withWorkflowVisualSrc(parsed.workflow.visual) },
    measure: { ...parsed.measure, visual: withKpiVisualSrc(parsed.measure.visual) },
    related: { ...parsed.related, visual: withRelatedVisualSrc(parsed.related.visual) },
    seo: { ...parsed.seo, social: withVisualSrc(parsed.seo.social) },
  };
}

export async function loadHotelWebsitePage(locale: Locale): Promise<HotelWebsiteResolvedPage> {
  const resolvedLocale = locale === "ru" || locale === "zh" ? "en" : locale;
  const base = defaultHotelWebsiteCms(resolvedLocale === "th" ? "th" : "en");
  const preferred = await pageDocumentBySlug(HOTEL_WEBSITE_PAGE_SLUG, resolvedLocale).catch(() => null);
  const fallback = resolvedLocale === "th" ? null : await pageDocumentBySlug(HOTEL_WEBSITE_PAGE_SLUG, "th").catch(() => null);
  const doc = preferred && isCmsPageLive(preferred) ? preferred : fallback && isCmsPageLive(fallback) ? fallback : null;
  if (!doc || doc.template !== HOTEL_WEBSITE_CMS_TEMPLATE) {
    return { ...withResolvedVisuals(base), fromCms: false };
  }
  const parsed = parseHotelWebsitePageBody(doc.body, resolvedLocale === "th" ? "th" : "en");
  if (!parsed) {
    return { ...withResolvedVisuals(base), fromCms: false };
  }
  return { ...withResolvedVisuals(parsed), fromCms: true };
}

export async function loadHotelWebsitePagePreview(id: string) {
  const doc = await documentById(id);
  if (!doc) return null;
  const locale = (["th", "en", "ru", "zh"].includes(doc.locale) ? doc.locale : "th") as Locale;
  const parsed = parseHotelWebsitePageBody(doc.body, locale) ?? defaultHotelWebsiteCms(locale);
  return {
    locale,
    live: isCmsPageLive(doc),
    content: parsed,
  };
}

export function hotelWebsiteFaqsFromCms(content: CmsHotelWebsitePage | null | undefined, locale: Locale): FaqItem[] {
  const english = locale !== "th";
  const mapped =
    content?.faqs.map((item) => ({
      q: english && item.qEn.trim() ? item.qEn : item.q,
      a: english && item.aEn.trim() ? item.aEn : item.a,
    })) ?? [];
  return mapped.length && !hotelWebsiteFaqsAreStale(mapped)
    ? mapped
    : hotelWebsiteFaqs(locale === "th" ? "th" : "en");
}
