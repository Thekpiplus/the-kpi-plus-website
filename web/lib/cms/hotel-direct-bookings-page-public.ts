import { existsSync } from "fs";
import { join } from "path";
import type { FaqItem } from "@/lib/faqs";
import {
  DIRECT_BOOKING_AUDIT_VISUAL_CANDIDATE,
  DIRECT_BOOKING_CONFIDENCE_VISUAL_CANDIDATE,
  DIRECT_BOOKING_DECISION_VISUAL_CANDIDATE,
  DIRECT_BOOKING_FRAMEWORK_VISUAL_CANDIDATE,
  DIRECT_BOOKING_FRICTION_VISUAL_CANDIDATE,
  DIRECT_BOOKING_HERO_VISUAL_CANDIDATE,
  DIRECT_BOOKING_MEASURE_VISUAL_CANDIDATE,
  DIRECT_BOOKING_ENQUIRY_VISUAL_CANDIDATE,
  DIRECT_BOOKING_RELATED_VISUAL_CANDIDATE,
  DIRECT_BOOKING_WORKFLOW_VISUAL_CANDIDATE,
  hotelDirectBookingFaqs,
  hotelDirectBookingFaqsAreStale,
} from "@/lib/direct-bookings";
import type { Locale } from "@/lib/seo";
import { isCmsPageLive } from "./public";
import { documentById, pageDocumentBySlug } from "./queries";
import {
  HOTEL_DIRECT_BOOKINGS_CMS_TEMPLATE,
  HOTEL_DIRECT_BOOKINGS_PAGE_SLUG,
  defaultDirectBookingCms,
  parseDirectBookingPageBody,
  type CmsDirectBookingPage,
  type CmsDirectBookingVisual,
} from "./hotel-direct-bookings-page";

function publicSrc(src?: string) {
  const next = src?.trim();
  if (!next) return undefined;
  if (/^https?:\/\//i.test(next)) return next;
  const relative = next.replace(/^\//, "");
  return existsSync(join(process.cwd(), "public", relative)) ? next : undefined;
}

function withVisualSrc(visual: CmsDirectBookingVisual): CmsDirectBookingVisual {
  return { ...visual, src: publicSrc(visual.src) || "" };
}

export function directBookingHeroVisualUrl() {
  return publicSrc(DIRECT_BOOKING_HERO_VISUAL_CANDIDATE);
}

export function directBookingConfidenceVisualUrl() {
  const next = publicSrc(DIRECT_BOOKING_CONFIDENCE_VISUAL_CANDIDATE);
  return next && next !== DIRECT_BOOKING_HERO_VISUAL_CANDIDATE ? next : undefined;
}

export function directBookingFrictionVisualUrl() {
  const next = publicSrc(DIRECT_BOOKING_FRICTION_VISUAL_CANDIDATE);
  if (!next) return undefined;
  if (next === DIRECT_BOOKING_HERO_VISUAL_CANDIDATE) return undefined;
  if (next === DIRECT_BOOKING_CONFIDENCE_VISUAL_CANDIDATE) return undefined;
  return next;
}

export function directBookingFrameworkVisualUrl() {
  const next = publicSrc(DIRECT_BOOKING_FRAMEWORK_VISUAL_CANDIDATE);
  if (!next) return undefined;
  if (next === DIRECT_BOOKING_HERO_VISUAL_CANDIDATE) return undefined;
  if (next === DIRECT_BOOKING_CONFIDENCE_VISUAL_CANDIDATE) return undefined;
  if (next === DIRECT_BOOKING_FRICTION_VISUAL_CANDIDATE) return undefined;
  return next;
}

export function directBookingAuditVisualUrl() {
  const next = publicSrc(DIRECT_BOOKING_AUDIT_VISUAL_CANDIDATE);
  if (!next) return undefined;
  if (
    next === DIRECT_BOOKING_HERO_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_CONFIDENCE_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_FRICTION_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_FRAMEWORK_VISUAL_CANDIDATE
  ) {
    return undefined;
  }
  return next;
}

export function directBookingDecisionVisualUrl() {
  const next = publicSrc(DIRECT_BOOKING_DECISION_VISUAL_CANDIDATE);
  if (!next) return undefined;
  if (next === DIRECT_BOOKING_HERO_VISUAL_CANDIDATE) return undefined;
  if (next === DIRECT_BOOKING_CONFIDENCE_VISUAL_CANDIDATE) return undefined;
  if (next === DIRECT_BOOKING_FRICTION_VISUAL_CANDIDATE) return undefined;
  if (next === DIRECT_BOOKING_FRAMEWORK_VISUAL_CANDIDATE) return undefined;
  if (next === DIRECT_BOOKING_AUDIT_VISUAL_CANDIDATE) return undefined;
  return next;
}

export function directBookingMeasureVisualUrl() {
  const next = publicSrc(DIRECT_BOOKING_MEASURE_VISUAL_CANDIDATE);
  if (!next) return undefined;
  if (
    next === DIRECT_BOOKING_HERO_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_CONFIDENCE_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_FRICTION_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_FRAMEWORK_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_AUDIT_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_DECISION_VISUAL_CANDIDATE
  ) {
    return undefined;
  }
  return next;
}

export function directBookingWorkflowVisualUrl() {
  const next = publicSrc(DIRECT_BOOKING_WORKFLOW_VISUAL_CANDIDATE);
  if (!next) return undefined;
  if (
    next === DIRECT_BOOKING_HERO_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_CONFIDENCE_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_FRICTION_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_FRAMEWORK_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_AUDIT_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_DECISION_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_MEASURE_VISUAL_CANDIDATE
  ) {
    return undefined;
  }
  return next;
}

export function directBookingRelatedVisualUrl() {
  const next = publicSrc(DIRECT_BOOKING_RELATED_VISUAL_CANDIDATE);
  if (!next) return undefined;
  if (
    next === DIRECT_BOOKING_HERO_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_CONFIDENCE_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_FRICTION_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_FRAMEWORK_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_AUDIT_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_DECISION_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_MEASURE_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_WORKFLOW_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_ENQUIRY_VISUAL_CANDIDATE
  ) {
    return undefined;
  }
  return next;
}

export function directBookingEnquiryVisualUrl() {
  const next = publicSrc(DIRECT_BOOKING_ENQUIRY_VISUAL_CANDIDATE);
  if (!next) return undefined;
  if (
    next === DIRECT_BOOKING_HERO_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_CONFIDENCE_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_FRICTION_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_FRAMEWORK_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_AUDIT_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_DECISION_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_MEASURE_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_WORKFLOW_VISUAL_CANDIDATE ||
    next === DIRECT_BOOKING_RELATED_VISUAL_CANDIDATE
  ) {
    return undefined;
  }
  return next;
}

export type DirectBookingResolvedPage = CmsDirectBookingPage & { fromCms: boolean };

function uniqueVisual(visual: CmsDirectBookingVisual, dummy: string, blocked: string[]): CmsDirectBookingVisual {
  const next = publicSrc(visual.src) || dummy;
  if (!next || blocked.includes(next)) {
    return { ...visual, src: dummy && !blocked.includes(dummy) ? dummy : "" };
  }
  return { ...visual, src: next };
}

function withResolvedVisuals(parsed: CmsDirectBookingPage): CmsDirectBookingPage {
  const dummyHero = publicSrc(DIRECT_BOOKING_HERO_VISUAL_CANDIDATE) || "";
  const dummyConfidence = directBookingConfidenceVisualUrl() || "";
  const dummyFriction = directBookingFrictionVisualUrl() || "";
  const dummyFramework = directBookingFrameworkVisualUrl() || "";
  const dummyAudit = directBookingAuditVisualUrl() || "";
  const dummyDecision = directBookingDecisionVisualUrl() || "";
  const dummyMeasure = directBookingMeasureVisualUrl() || "";
  const dummyWorkflow = directBookingWorkflowVisualUrl() || "";
  const dummyRelated = directBookingRelatedVisualUrl() || "";
  const dummyForm = directBookingEnquiryVisualUrl() || "";
  const hero = uniqueVisual(parsed.hero.visual, dummyHero, []);
  const confidence = uniqueVisual(parsed.confidence.visual, dummyConfidence, [
    hero.src,
    dummyHero,
    DIRECT_BOOKING_HERO_VISUAL_CANDIDATE,
    "",
  ]);
  const friction = uniqueVisual(parsed.friction.visual, dummyFriction, [
    hero.src,
    confidence.src,
    dummyHero,
    dummyConfidence,
    DIRECT_BOOKING_HERO_VISUAL_CANDIDATE,
    DIRECT_BOOKING_CONFIDENCE_VISUAL_CANDIDATE,
    "",
  ]);
  const framework = uniqueVisual(parsed.framework.visual, dummyFramework, [
    hero.src,
    confidence.src,
    friction.src,
    dummyHero,
    dummyConfidence,
    dummyFriction,
    DIRECT_BOOKING_HERO_VISUAL_CANDIDATE,
    DIRECT_BOOKING_CONFIDENCE_VISUAL_CANDIDATE,
    DIRECT_BOOKING_FRICTION_VISUAL_CANDIDATE,
    "",
  ]);
  const audit = uniqueVisual(parsed.audit.visual, dummyAudit, [
    hero.src,
    confidence.src,
    friction.src,
    framework.src,
    dummyHero,
    dummyConfidence,
    dummyFriction,
    dummyFramework,
    DIRECT_BOOKING_HERO_VISUAL_CANDIDATE,
    DIRECT_BOOKING_CONFIDENCE_VISUAL_CANDIDATE,
    DIRECT_BOOKING_FRICTION_VISUAL_CANDIDATE,
    DIRECT_BOOKING_FRAMEWORK_VISUAL_CANDIDATE,
    "",
  ]);
  const rebuild = uniqueVisual(parsed.rebuild.visual, dummyDecision, [
    hero.src,
    confidence.src,
    friction.src,
    framework.src,
    audit.src,
    dummyHero,
    dummyConfidence,
    dummyFriction,
    dummyFramework,
    dummyAudit,
    DIRECT_BOOKING_HERO_VISUAL_CANDIDATE,
    DIRECT_BOOKING_CONFIDENCE_VISUAL_CANDIDATE,
    DIRECT_BOOKING_FRICTION_VISUAL_CANDIDATE,
    DIRECT_BOOKING_FRAMEWORK_VISUAL_CANDIDATE,
    DIRECT_BOOKING_AUDIT_VISUAL_CANDIDATE,
    "",
  ]);
  const measure = uniqueVisual(parsed.measure.visual, dummyMeasure, [
    hero.src,
    confidence.src,
    friction.src,
    framework.src,
    audit.src,
    rebuild.src,
    dummyHero,
    dummyConfidence,
    dummyFriction,
    dummyFramework,
    dummyAudit,
    dummyDecision,
    DIRECT_BOOKING_HERO_VISUAL_CANDIDATE,
    DIRECT_BOOKING_CONFIDENCE_VISUAL_CANDIDATE,
    DIRECT_BOOKING_FRICTION_VISUAL_CANDIDATE,
    DIRECT_BOOKING_FRAMEWORK_VISUAL_CANDIDATE,
    DIRECT_BOOKING_AUDIT_VISUAL_CANDIDATE,
    DIRECT_BOOKING_DECISION_VISUAL_CANDIDATE,
    "",
  ]);
  const workflow = uniqueVisual(parsed.workflow.visual, dummyWorkflow, [
    hero.src,
    confidence.src,
    friction.src,
    framework.src,
    audit.src,
    rebuild.src,
    measure.src,
    dummyHero,
    dummyConfidence,
    dummyFriction,
    dummyFramework,
    dummyAudit,
    dummyDecision,
    dummyMeasure,
    DIRECT_BOOKING_HERO_VISUAL_CANDIDATE,
    DIRECT_BOOKING_CONFIDENCE_VISUAL_CANDIDATE,
    DIRECT_BOOKING_FRICTION_VISUAL_CANDIDATE,
    DIRECT_BOOKING_FRAMEWORK_VISUAL_CANDIDATE,
    DIRECT_BOOKING_AUDIT_VISUAL_CANDIDATE,
    DIRECT_BOOKING_DECISION_VISUAL_CANDIDATE,
    DIRECT_BOOKING_MEASURE_VISUAL_CANDIDATE,
    "",
  ]);
  const related = uniqueVisual(parsed.related.visual, dummyRelated, [
    hero.src,
    confidence.src,
    friction.src,
    framework.src,
    audit.src,
    rebuild.src,
    measure.src,
    workflow.src,
    dummyHero,
    dummyConfidence,
    dummyFriction,
    dummyFramework,
    dummyAudit,
    dummyDecision,
    dummyMeasure,
    dummyWorkflow,
    dummyForm,
    DIRECT_BOOKING_HERO_VISUAL_CANDIDATE,
    DIRECT_BOOKING_CONFIDENCE_VISUAL_CANDIDATE,
    DIRECT_BOOKING_FRICTION_VISUAL_CANDIDATE,
    DIRECT_BOOKING_FRAMEWORK_VISUAL_CANDIDATE,
    DIRECT_BOOKING_AUDIT_VISUAL_CANDIDATE,
    DIRECT_BOOKING_DECISION_VISUAL_CANDIDATE,
    DIRECT_BOOKING_MEASURE_VISUAL_CANDIDATE,
    DIRECT_BOOKING_WORKFLOW_VISUAL_CANDIDATE,
    DIRECT_BOOKING_ENQUIRY_VISUAL_CANDIDATE,
    "",
  ]);
  const form = uniqueVisual(parsed.form.visual, dummyForm, [
    hero.src,
    confidence.src,
    friction.src,
    framework.src,
    audit.src,
    rebuild.src,
    measure.src,
    workflow.src,
    related.src,
    dummyHero,
    dummyConfidence,
    dummyFriction,
    dummyFramework,
    dummyAudit,
    dummyDecision,
    dummyMeasure,
    dummyWorkflow,
    dummyRelated,
    DIRECT_BOOKING_HERO_VISUAL_CANDIDATE,
    DIRECT_BOOKING_CONFIDENCE_VISUAL_CANDIDATE,
    DIRECT_BOOKING_FRICTION_VISUAL_CANDIDATE,
    DIRECT_BOOKING_FRAMEWORK_VISUAL_CANDIDATE,
    DIRECT_BOOKING_AUDIT_VISUAL_CANDIDATE,
    DIRECT_BOOKING_DECISION_VISUAL_CANDIDATE,
    DIRECT_BOOKING_MEASURE_VISUAL_CANDIDATE,
    DIRECT_BOOKING_WORKFLOW_VISUAL_CANDIDATE,
    DIRECT_BOOKING_RELATED_VISUAL_CANDIDATE,
    "",
  ]);
  return {
    ...parsed,
    hero: { ...parsed.hero, visual: hero },
    confidence: { ...parsed.confidence, visual: confidence },
    friction: { ...parsed.friction, visual: friction },
    framework: { ...parsed.framework, visual: framework },
    audit: { ...parsed.audit, visual: audit },
    rebuild: { ...parsed.rebuild, visual: rebuild },
    workflow: { ...parsed.workflow, visual: workflow },
    measure: { ...parsed.measure, visual: measure },
    related: { ...parsed.related, visual: related },
    form: { ...parsed.form, visual: form },
    seo: { ...parsed.seo, social: withVisualSrc(parsed.seo.social) },
  };
}

export async function loadDirectBookingPage(locale: Locale): Promise<DirectBookingResolvedPage> {
  const resolvedLocale = locale === "ru" || locale === "zh" ? "en" : locale;
  const base = defaultDirectBookingCms(resolvedLocale === "th" ? "th" : "en");
  const preferred = await pageDocumentBySlug(HOTEL_DIRECT_BOOKINGS_PAGE_SLUG, resolvedLocale).catch(() => null);
  const doc = preferred && isCmsPageLive(preferred) ? preferred : null;
  if (!doc || doc.template !== HOTEL_DIRECT_BOOKINGS_CMS_TEMPLATE) {
    return { ...withResolvedVisuals(base), fromCms: false };
  }
  const parsed = parseDirectBookingPageBody(doc.body, resolvedLocale === "th" ? "th" : "en");
  if (!parsed) return { ...withResolvedVisuals(base), fromCms: false };
  return { ...withResolvedVisuals(parsed), fromCms: true };
}

export async function loadDirectBookingPagePreview(id: string) {
  const doc = await documentById(id);
  if (!doc) return null;
  const locale = (["th", "en", "ru", "zh"].includes(doc.locale) ? doc.locale : "th") as Locale;
  const parsed = parseDirectBookingPageBody(doc.body, locale) ?? defaultDirectBookingCms(locale);
  return {
    locale,
    live: isCmsPageLive(doc),
    content: withResolvedVisuals(parsed),
  };
}

export function hotelDirectBookingFaqsFromCms(content: CmsDirectBookingPage | null | undefined, locale: Locale): FaqItem[] {
  const english = locale !== "th";
  const mapped =
    content?.faqs.map((item) => ({
      q: english && item.qEn.trim() ? item.qEn : item.q,
      a: english && item.aEn.trim() ? item.aEn : item.a,
    })) ?? [];
  return mapped.length && !hotelDirectBookingFaqsAreStale(mapped)
    ? mapped
    : hotelDirectBookingFaqs(locale === "th" ? "th" : "en");
}
