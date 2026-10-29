import { existsSync } from "fs";
import { join } from "path";
import type { FaqItem } from "@/lib/faqs";
import {
  INDEPENDENT_ASSESSMENT_VISUAL_CANDIDATE,
  INDEPENDENT_ASSESSMENT_VISUAL_LEGACY,
  INDEPENDENT_DELIVERABLES_VISUAL_CANDIDATE,
  INDEPENDENT_ENQUIRY_VISUAL_CANDIDATE,
  INDEPENDENT_ENQUIRY_VISUAL_LEGACY,
  INDEPENDENT_FIT_VISUAL_CANDIDATE,
  INDEPENDENT_FIT_VISUAL_LEGACY,
  INDEPENDENT_HERO_VISUAL_CANDIDATE,
  INDEPENDENT_MODEL_VISUAL_CANDIDATE,
  INDEPENDENT_PLAN_VISUAL_CANDIDATE,
  INDEPENDENT_PLAN_VISUAL_LEGACY,
  INDEPENDENT_RELATED_VISUAL_CANDIDATE,
  INDEPENDENT_SCOPE_VISUAL_CANDIDATE,
  INDEPENDENT_SERVICES_VISUAL_CANDIDATE,
  INDEPENDENT_SERVICES_VISUAL_LEGACY,
  INDEPENDENT_WORKFLOW_VISUAL_CANDIDATE,
  INDEPENDENT_WORKFLOW_VISUAL_LEGACY,
  independentHotelFaqs,
  independentHotelFaqsAreStale,
  independentRenderableSrc,
} from "@/lib/independent-hotel";
import type { Locale } from "@/lib/seo";
import { isCmsPageLive } from "./public";
import { documentById, pageDocumentBySlug } from "./queries";
import {
  INDEPENDENT_HOTEL_CMS_TEMPLATE,
  INDEPENDENT_HOTEL_PAGE_SLUG,
  defaultIndependentHotelCms,
  parseIndependentHotelPageBody,
  type CmsIndependentPage,
  type CmsIndependentVisual,
} from "./independent-hotel-page";

function publicSrc(src?: string) {
  const next = src?.trim();
  if (!next) return undefined;
  if (/^https?:\/\//i.test(next)) return next;
  const relative = next.replace(/^\//, "");
  return existsSync(join(process.cwd(), "public", relative)) ? next : undefined;
}

function withVisualSrc(visual: CmsIndependentVisual): CmsIndependentVisual {
  return { ...visual, src: publicSrc(visual.src) || "" };
}

export function independentHeroVisualUrl() {
  return publicSrc(INDEPENDENT_HERO_VISUAL_CANDIDATE);
}

function uniqueCandidate(src: string, blocked: string[]) {
  const next = publicSrc(src);
  if (!next || blocked.includes(next)) return undefined;
  return next;
}

export function independentAssessmentVisualUrl() {
  return uniqueCandidate(INDEPENDENT_ASSESSMENT_VISUAL_CANDIDATE, [
    INDEPENDENT_HERO_VISUAL_CANDIDATE,
    INDEPENDENT_ASSESSMENT_VISUAL_LEGACY,
  ]);
}

export function independentServicesVisualUrl() {
  return uniqueCandidate(INDEPENDENT_SERVICES_VISUAL_CANDIDATE, [
    INDEPENDENT_HERO_VISUAL_CANDIDATE,
    INDEPENDENT_ASSESSMENT_VISUAL_CANDIDATE,
    INDEPENDENT_SERVICES_VISUAL_LEGACY,
  ]);
}

export function independentModelVisualUrl() {
  return uniqueCandidate(INDEPENDENT_MODEL_VISUAL_CANDIDATE, [
    INDEPENDENT_HERO_VISUAL_CANDIDATE,
    INDEPENDENT_ASSESSMENT_VISUAL_CANDIDATE,
    INDEPENDENT_SERVICES_VISUAL_CANDIDATE,
  ]);
}

export function independentDeliverablesVisualUrl() {
  return uniqueCandidate(INDEPENDENT_DELIVERABLES_VISUAL_CANDIDATE, [
    INDEPENDENT_HERO_VISUAL_CANDIDATE,
    INDEPENDENT_ASSESSMENT_VISUAL_CANDIDATE,
    INDEPENDENT_SERVICES_VISUAL_CANDIDATE,
    INDEPENDENT_MODEL_VISUAL_CANDIDATE,
  ]);
}

export function independentWorkflowVisualUrl() {
  return uniqueCandidate(INDEPENDENT_WORKFLOW_VISUAL_CANDIDATE, [
    INDEPENDENT_HERO_VISUAL_CANDIDATE,
    INDEPENDENT_ASSESSMENT_VISUAL_CANDIDATE,
    INDEPENDENT_SERVICES_VISUAL_CANDIDATE,
    INDEPENDENT_MODEL_VISUAL_CANDIDATE,
    INDEPENDENT_DELIVERABLES_VISUAL_CANDIDATE,
    INDEPENDENT_WORKFLOW_VISUAL_LEGACY,
  ]);
}

export function independentFitVisualUrl() {
  return uniqueCandidate(INDEPENDENT_FIT_VISUAL_CANDIDATE, [
    INDEPENDENT_HERO_VISUAL_CANDIDATE,
    INDEPENDENT_ASSESSMENT_VISUAL_CANDIDATE,
    INDEPENDENT_SERVICES_VISUAL_CANDIDATE,
    INDEPENDENT_MODEL_VISUAL_CANDIDATE,
    INDEPENDENT_DELIVERABLES_VISUAL_CANDIDATE,
    INDEPENDENT_WORKFLOW_VISUAL_CANDIDATE,
    INDEPENDENT_FIT_VISUAL_LEGACY,
  ]);
}

export function independentScopeVisualUrl() {
  return uniqueCandidate(INDEPENDENT_SCOPE_VISUAL_CANDIDATE, [
    INDEPENDENT_HERO_VISUAL_CANDIDATE,
    INDEPENDENT_ASSESSMENT_VISUAL_CANDIDATE,
    INDEPENDENT_SERVICES_VISUAL_CANDIDATE,
    INDEPENDENT_MODEL_VISUAL_CANDIDATE,
    INDEPENDENT_DELIVERABLES_VISUAL_CANDIDATE,
    INDEPENDENT_WORKFLOW_VISUAL_CANDIDATE,
    INDEPENDENT_FIT_VISUAL_CANDIDATE,
  ]);
}

export function independentPlanVisualUrl() {
  return uniqueCandidate(INDEPENDENT_PLAN_VISUAL_CANDIDATE, [
    INDEPENDENT_HERO_VISUAL_CANDIDATE,
    INDEPENDENT_ASSESSMENT_VISUAL_CANDIDATE,
    INDEPENDENT_SERVICES_VISUAL_CANDIDATE,
    INDEPENDENT_MODEL_VISUAL_CANDIDATE,
    INDEPENDENT_DELIVERABLES_VISUAL_CANDIDATE,
    INDEPENDENT_WORKFLOW_VISUAL_CANDIDATE,
    INDEPENDENT_FIT_VISUAL_CANDIDATE,
    INDEPENDENT_SCOPE_VISUAL_CANDIDATE,
    INDEPENDENT_PLAN_VISUAL_LEGACY,
  ]);
}

export function independentRelatedVisualUrl() {
  return uniqueCandidate(INDEPENDENT_RELATED_VISUAL_CANDIDATE, [
    INDEPENDENT_HERO_VISUAL_CANDIDATE,
    INDEPENDENT_ASSESSMENT_VISUAL_CANDIDATE,
    INDEPENDENT_SERVICES_VISUAL_CANDIDATE,
    INDEPENDENT_MODEL_VISUAL_CANDIDATE,
    INDEPENDENT_DELIVERABLES_VISUAL_CANDIDATE,
    INDEPENDENT_WORKFLOW_VISUAL_CANDIDATE,
    INDEPENDENT_FIT_VISUAL_CANDIDATE,
    INDEPENDENT_SCOPE_VISUAL_CANDIDATE,
    INDEPENDENT_PLAN_VISUAL_CANDIDATE,
    INDEPENDENT_PLAN_VISUAL_LEGACY,
    INDEPENDENT_ENQUIRY_VISUAL_CANDIDATE,
    INDEPENDENT_ENQUIRY_VISUAL_LEGACY,
  ]);
}

export function independentEnquiryVisualUrl() {
  return uniqueCandidate(INDEPENDENT_ENQUIRY_VISUAL_CANDIDATE, [
    INDEPENDENT_HERO_VISUAL_CANDIDATE,
    INDEPENDENT_ASSESSMENT_VISUAL_CANDIDATE,
    INDEPENDENT_SERVICES_VISUAL_CANDIDATE,
    INDEPENDENT_MODEL_VISUAL_CANDIDATE,
    INDEPENDENT_DELIVERABLES_VISUAL_CANDIDATE,
    INDEPENDENT_WORKFLOW_VISUAL_CANDIDATE,
    INDEPENDENT_FIT_VISUAL_CANDIDATE,
    INDEPENDENT_SCOPE_VISUAL_CANDIDATE,
    INDEPENDENT_PLAN_VISUAL_CANDIDATE,
    INDEPENDENT_PLAN_VISUAL_LEGACY,
    INDEPENDENT_RELATED_VISUAL_CANDIDATE,
    INDEPENDENT_ENQUIRY_VISUAL_LEGACY,
  ]);
}

export type IndependentHotelResolvedPage = CmsIndependentPage & { fromCms: boolean };

function uniqueVisual(visual: CmsIndependentVisual, dummy: string, blocked: string[]): CmsIndependentVisual {
  const next = publicSrc(visual.src) || dummy;
  const fallback = dummy && !blocked.includes(dummy) ? dummy : "";
  const resolved = !next || blocked.includes(next) ? fallback : next;
  return { ...visual, src: independentRenderableSrc(resolved, visual.status) };
}

function withResolvedVisuals(parsed: CmsIndependentPage): CmsIndependentPage {
  const dummyHero = independentHeroVisualUrl() || "";
  const dummyAssessment = independentAssessmentVisualUrl() || "";
  const dummyServices = independentServicesVisualUrl() || "";
  const dummyModel = independentModelVisualUrl() || "";
  const dummyDeliverables = independentDeliverablesVisualUrl() || "";
  const dummyWorkflow = independentWorkflowVisualUrl() || "";
  const dummyFit = independentFitVisualUrl() || "";
  const dummyScope = independentScopeVisualUrl() || "";
  const dummyPlan = independentPlanVisualUrl() || "";
  const dummyRelated = independentRelatedVisualUrl() || "";
  const dummyForm = independentEnquiryVisualUrl() || "";
  const hero = uniqueVisual(parsed.hero.visual, dummyHero, []);
  const assessment = uniqueVisual(parsed.assessment.visual, dummyAssessment, [hero.src, dummyHero, INDEPENDENT_HERO_VISUAL_CANDIDATE, INDEPENDENT_ASSESSMENT_VISUAL_LEGACY, ""]);
  const services = uniqueVisual(parsed.services.visual, dummyServices, [hero.src, assessment.src, dummyHero, dummyAssessment, INDEPENDENT_HERO_VISUAL_CANDIDATE, INDEPENDENT_ASSESSMENT_VISUAL_CANDIDATE, INDEPENDENT_SERVICES_VISUAL_LEGACY, ""]);
  const model = uniqueVisual(parsed.model.visual, dummyModel, [hero.src, assessment.src, services.src, dummyHero, dummyAssessment, dummyServices, INDEPENDENT_HERO_VISUAL_CANDIDATE, INDEPENDENT_ASSESSMENT_VISUAL_CANDIDATE, INDEPENDENT_SERVICES_VISUAL_CANDIDATE, ""]);
  const deliverables = uniqueVisual(parsed.deliverables.visual, dummyDeliverables, [hero.src, assessment.src, services.src, model.src, dummyHero, dummyAssessment, dummyServices, dummyModel, INDEPENDENT_HERO_VISUAL_CANDIDATE, INDEPENDENT_ASSESSMENT_VISUAL_CANDIDATE, INDEPENDENT_SERVICES_VISUAL_CANDIDATE, INDEPENDENT_MODEL_VISUAL_CANDIDATE, ""]);
  const workflow = uniqueVisual(parsed.workflow.visual, dummyWorkflow, [hero.src, assessment.src, services.src, model.src, deliverables.src, dummyHero, dummyAssessment, dummyServices, dummyModel, dummyDeliverables, INDEPENDENT_HERO_VISUAL_CANDIDATE, INDEPENDENT_ASSESSMENT_VISUAL_CANDIDATE, INDEPENDENT_SERVICES_VISUAL_CANDIDATE, INDEPENDENT_MODEL_VISUAL_CANDIDATE, INDEPENDENT_DELIVERABLES_VISUAL_CANDIDATE, INDEPENDENT_WORKFLOW_VISUAL_LEGACY, ""]);
  const fit = uniqueVisual(parsed.fit.visual, dummyFit, [hero.src, assessment.src, services.src, model.src, deliverables.src, workflow.src, dummyHero, dummyAssessment, dummyServices, dummyModel, dummyDeliverables, dummyWorkflow, INDEPENDENT_HERO_VISUAL_CANDIDATE, INDEPENDENT_ASSESSMENT_VISUAL_CANDIDATE, INDEPENDENT_SERVICES_VISUAL_CANDIDATE, INDEPENDENT_MODEL_VISUAL_CANDIDATE, INDEPENDENT_DELIVERABLES_VISUAL_CANDIDATE, INDEPENDENT_WORKFLOW_VISUAL_CANDIDATE, INDEPENDENT_FIT_VISUAL_LEGACY, ""]);
  const scope = uniqueVisual(parsed.scope.visual, dummyScope, [hero.src, assessment.src, services.src, model.src, deliverables.src, workflow.src, fit.src, dummyHero, dummyAssessment, dummyServices, dummyModel, dummyDeliverables, dummyWorkflow, dummyFit, INDEPENDENT_HERO_VISUAL_CANDIDATE, INDEPENDENT_ASSESSMENT_VISUAL_CANDIDATE, INDEPENDENT_SERVICES_VISUAL_CANDIDATE, INDEPENDENT_MODEL_VISUAL_CANDIDATE, INDEPENDENT_DELIVERABLES_VISUAL_CANDIDATE, INDEPENDENT_WORKFLOW_VISUAL_CANDIDATE, INDEPENDENT_FIT_VISUAL_CANDIDATE, ""]);
  const plan = uniqueVisual(parsed.plan.visual, dummyPlan, [hero.src, assessment.src, services.src, model.src, deliverables.src, workflow.src, fit.src, scope.src, dummyHero, dummyAssessment, dummyServices, dummyModel, dummyDeliverables, dummyWorkflow, dummyFit, dummyScope, INDEPENDENT_HERO_VISUAL_CANDIDATE, INDEPENDENT_ASSESSMENT_VISUAL_CANDIDATE, INDEPENDENT_SERVICES_VISUAL_CANDIDATE, INDEPENDENT_MODEL_VISUAL_CANDIDATE, INDEPENDENT_DELIVERABLES_VISUAL_CANDIDATE, INDEPENDENT_WORKFLOW_VISUAL_CANDIDATE, INDEPENDENT_FIT_VISUAL_CANDIDATE, INDEPENDENT_SCOPE_VISUAL_CANDIDATE, INDEPENDENT_PLAN_VISUAL_LEGACY, ""]);
  const related = uniqueVisual(parsed.related.visual, dummyRelated, [hero.src, assessment.src, services.src, model.src, deliverables.src, workflow.src, fit.src, scope.src, plan.src, dummyHero, dummyAssessment, dummyServices, dummyModel, dummyDeliverables, dummyWorkflow, dummyFit, dummyScope, dummyPlan, dummyForm, INDEPENDENT_HERO_VISUAL_CANDIDATE, INDEPENDENT_ASSESSMENT_VISUAL_CANDIDATE, INDEPENDENT_SERVICES_VISUAL_CANDIDATE, INDEPENDENT_MODEL_VISUAL_CANDIDATE, INDEPENDENT_DELIVERABLES_VISUAL_CANDIDATE, INDEPENDENT_WORKFLOW_VISUAL_CANDIDATE, INDEPENDENT_FIT_VISUAL_CANDIDATE, INDEPENDENT_SCOPE_VISUAL_CANDIDATE, INDEPENDENT_PLAN_VISUAL_CANDIDATE, INDEPENDENT_ENQUIRY_VISUAL_CANDIDATE, INDEPENDENT_ENQUIRY_VISUAL_LEGACY, ""]);
  const form = uniqueVisual(parsed.form.visual, dummyForm, [hero.src, assessment.src, services.src, model.src, deliverables.src, workflow.src, fit.src, scope.src, plan.src, related.src, dummyHero, dummyAssessment, dummyServices, dummyModel, dummyDeliverables, dummyWorkflow, dummyFit, dummyScope, dummyPlan, dummyRelated, INDEPENDENT_HERO_VISUAL_CANDIDATE, INDEPENDENT_ASSESSMENT_VISUAL_CANDIDATE, INDEPENDENT_SERVICES_VISUAL_CANDIDATE, INDEPENDENT_MODEL_VISUAL_CANDIDATE, INDEPENDENT_DELIVERABLES_VISUAL_CANDIDATE, INDEPENDENT_WORKFLOW_VISUAL_CANDIDATE, INDEPENDENT_FIT_VISUAL_CANDIDATE, INDEPENDENT_SCOPE_VISUAL_CANDIDATE, INDEPENDENT_PLAN_VISUAL_CANDIDATE, INDEPENDENT_RELATED_VISUAL_CANDIDATE, INDEPENDENT_ENQUIRY_VISUAL_LEGACY, ""]);
  return {
    ...parsed,
    hero: { ...parsed.hero, visual: hero },
    assessment: { ...parsed.assessment, visual: assessment },
    services: { ...parsed.services, visual: services },
    model: { ...parsed.model, visual: model },
    deliverables: { ...parsed.deliverables, visual: deliverables },
    workflow: { ...parsed.workflow, visual: workflow },
    fit: { ...parsed.fit, visual: fit },
    scope: { ...parsed.scope, visual: scope },
    plan: { ...parsed.plan, visual: plan },
    related: { ...parsed.related, visual: related },
    form: { ...parsed.form, visual: form },
    seo: { ...parsed.seo, social: withVisualSrc(parsed.seo.social) },
  };
}

export async function loadIndependentHotelPage(locale: Locale): Promise<IndependentHotelResolvedPage> {
  const resolvedLocale = locale === "ru" || locale === "zh" ? "en" : locale;
  const base = defaultIndependentHotelCms(resolvedLocale === "th" ? "th" : "en");
  const preferred = await pageDocumentBySlug(INDEPENDENT_HOTEL_PAGE_SLUG, resolvedLocale).catch(() => null);
  const doc = preferred && isCmsPageLive(preferred) ? preferred : null;
  if (!doc || doc.template !== INDEPENDENT_HOTEL_CMS_TEMPLATE) {
    return { ...withResolvedVisuals(base), fromCms: false };
  }
  const parsed = parseIndependentHotelPageBody(doc.body, resolvedLocale === "th" ? "th" : "en");
  if (!parsed) return { ...withResolvedVisuals(base), fromCms: false };
  return { ...withResolvedVisuals(parsed), fromCms: true };
}

export async function loadIndependentHotelPagePreview(id: string) {
  const doc = await documentById(id);
  if (!doc) return null;
  const locale = (["th", "en", "ru", "zh"].includes(doc.locale) ? doc.locale : "th") as Locale;
  const parsed = parseIndependentHotelPageBody(doc.body, locale) ?? defaultIndependentHotelCms(locale);
  return {
    locale,
    live: isCmsPageLive(doc),
    content: withResolvedVisuals(parsed),
  };
}

export function independentHotelFaqsFromCms(content: CmsIndependentPage | null | undefined, locale: Locale): FaqItem[] {
  const english = locale !== "th";
  const mapped =
    content?.faqs.map((item) => ({
      q: english && item.qEn.trim() ? item.qEn : item.q,
      a: english && item.aEn.trim() ? item.aEn : item.a,
    })) ?? [];
  return mapped.length && !independentHotelFaqsAreStale(mapped) ? mapped : independentHotelFaqs(locale === "th" ? "th" : "en");
}
