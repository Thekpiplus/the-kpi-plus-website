import { existsSync } from "fs";
import { join } from "path";
import type { FaqItem } from "@/lib/faqs";
import {
  SYSTEMS_ASSESSMENT_VISUAL_CANDIDATE,
  SYSTEMS_ASSESSMENT_VISUAL_LEGACY,
  SYSTEMS_DELIVERABLES_VISUAL_CANDIDATE,
  SYSTEMS_ENQUIRY_VISUAL_CANDIDATE,
  SYSTEMS_ENQUIRY_VISUAL_CONTACT,
  SYSTEMS_ENQUIRY_VISUAL_LEGACY,
  SYSTEMS_FIT_VISUAL_CANDIDATE,
  SYSTEMS_FIT_VISUAL_LEGACY,
  SYSTEMS_FIT_VISUAL_MATRIX,
  SYSTEMS_INVENTORY_VISUAL_CANDIDATE,
  SYSTEMS_HERO_VISUAL_CANDIDATE,
  SYSTEMS_HERO_VISUAL_LEGACY,
  SYSTEMS_MODEL_VISUAL_CANDIDATE,
  SYSTEMS_PLAN_VISUAL_CANDIDATE,
  SYSTEMS_PLAN_VISUAL_LEGACY,
  SYSTEMS_RELATED_VISUAL_CANDIDATE,
  SYSTEMS_TESTING_VISUAL_CANDIDATE,
  SYSTEMS_SCOPE_VISUAL_CANDIDATE,
  SYSTEMS_SCOPE_VISUAL_LEGACY,
  SYSTEMS_SERVICES_VISUAL_CANDIDATE,
  SYSTEMS_SERVICES_VISUAL_LEGACY,
  SYSTEMS_WORKFLOW_VISUAL_CANDIDATE,
  SYSTEMS_WORKFLOW_VISUAL_LEGACY,
  SYSTEMS_WORKFLOW_VISUAL_METHOD,
  hotelSystemsFaqs,
  hotelSystemsFaqsAreStale,
  systemsRenderableSrc,
} from "@/lib/hotel-systems";
import type { Locale } from "@/lib/seo";
import { isCmsPageLive } from "./public";
import { documentById, pageDocumentBySlug } from "./queries";
import {
  HOTEL_SYSTEMS_CMS_TEMPLATE,
  HOTEL_SYSTEMS_PAGE_SLUG,
  defaultHotelSystemsCms,
  parseHotelSystemsPageBody,
  type CmsSystemsPage,
  type CmsSystemsVisual,
} from "./hotel-systems-page";

function publicSrc(src?: string) {
  const next = src?.trim();
  if (!next) return undefined;
  if (/^https?:\/\//i.test(next)) return next;
  const relative = next.replace(/^\//, "");
  return existsSync(join(process.cwd(), "public", relative)) ? next : undefined;
}

function withVisualSrc(visual: CmsSystemsVisual): CmsSystemsVisual {
  return { ...visual, src: publicSrc(visual.src) || "" };
}

export function independentHeroVisualUrl() {
  return publicSrc(SYSTEMS_HERO_VISUAL_CANDIDATE);
}

function uniqueCandidate(src: string, blocked: string[]) {
  const next = publicSrc(src);
  if (!next || blocked.includes(next)) return undefined;
  return next;
}

export function independentAssessmentVisualUrl() {
  return uniqueCandidate(SYSTEMS_ASSESSMENT_VISUAL_CANDIDATE, [
    SYSTEMS_HERO_VISUAL_CANDIDATE,
    SYSTEMS_HERO_VISUAL_LEGACY,
    SYSTEMS_ASSESSMENT_VISUAL_LEGACY,
  ]);
}

export function independentServicesVisualUrl() {
  return uniqueCandidate(SYSTEMS_SERVICES_VISUAL_CANDIDATE, [
    SYSTEMS_HERO_VISUAL_CANDIDATE,
    SYSTEMS_ASSESSMENT_VISUAL_CANDIDATE,
    SYSTEMS_SERVICES_VISUAL_LEGACY,
  ]);
}

export function independentModelVisualUrl() {
  return uniqueCandidate(SYSTEMS_MODEL_VISUAL_CANDIDATE, [
    SYSTEMS_HERO_VISUAL_CANDIDATE,
    SYSTEMS_ASSESSMENT_VISUAL_CANDIDATE,
    SYSTEMS_SERVICES_VISUAL_CANDIDATE,
  ]);
}

export function independentDeliverablesVisualUrl() {
  return uniqueCandidate(SYSTEMS_DELIVERABLES_VISUAL_CANDIDATE, [
    SYSTEMS_HERO_VISUAL_CANDIDATE,
    SYSTEMS_ASSESSMENT_VISUAL_CANDIDATE,
    SYSTEMS_SERVICES_VISUAL_CANDIDATE,
    SYSTEMS_MODEL_VISUAL_CANDIDATE,
  ]);
}

export function independentWorkflowVisualUrl() {
  return uniqueCandidate(SYSTEMS_WORKFLOW_VISUAL_CANDIDATE, [
    SYSTEMS_HERO_VISUAL_CANDIDATE,
    SYSTEMS_ASSESSMENT_VISUAL_CANDIDATE,
    SYSTEMS_SERVICES_VISUAL_CANDIDATE,
    SYSTEMS_MODEL_VISUAL_CANDIDATE,
    SYSTEMS_DELIVERABLES_VISUAL_CANDIDATE,
    SYSTEMS_WORKFLOW_VISUAL_LEGACY,
    SYSTEMS_WORKFLOW_VISUAL_METHOD,
  ]);
}

export function independentFitVisualUrl() {
  return uniqueCandidate(SYSTEMS_FIT_VISUAL_CANDIDATE, [
    SYSTEMS_HERO_VISUAL_CANDIDATE,
    SYSTEMS_ASSESSMENT_VISUAL_CANDIDATE,
    SYSTEMS_SERVICES_VISUAL_CANDIDATE,
    SYSTEMS_MODEL_VISUAL_CANDIDATE,
    SYSTEMS_DELIVERABLES_VISUAL_CANDIDATE,
    SYSTEMS_WORKFLOW_VISUAL_CANDIDATE,
    SYSTEMS_FIT_VISUAL_LEGACY,
    SYSTEMS_FIT_VISUAL_MATRIX,
  ]);
}

export function independentInventoryVisualUrl() {
  return uniqueCandidate(SYSTEMS_INVENTORY_VISUAL_CANDIDATE, [
    SYSTEMS_HERO_VISUAL_CANDIDATE,
    SYSTEMS_ASSESSMENT_VISUAL_CANDIDATE,
    SYSTEMS_SERVICES_VISUAL_CANDIDATE,
    SYSTEMS_MODEL_VISUAL_CANDIDATE,
    SYSTEMS_DELIVERABLES_VISUAL_CANDIDATE,
    SYSTEMS_WORKFLOW_VISUAL_CANDIDATE,
    SYSTEMS_FIT_VISUAL_CANDIDATE,
    SYSTEMS_FIT_VISUAL_LEGACY,
    SYSTEMS_FIT_VISUAL_MATRIX,
  ]);
}

export function independentScopeVisualUrl() {
  return uniqueCandidate(SYSTEMS_SCOPE_VISUAL_CANDIDATE, [
    SYSTEMS_HERO_VISUAL_CANDIDATE,
    SYSTEMS_ASSESSMENT_VISUAL_CANDIDATE,
    SYSTEMS_SERVICES_VISUAL_CANDIDATE,
    SYSTEMS_MODEL_VISUAL_CANDIDATE,
    SYSTEMS_DELIVERABLES_VISUAL_CANDIDATE,
    SYSTEMS_WORKFLOW_VISUAL_CANDIDATE,
    SYSTEMS_FIT_VISUAL_CANDIDATE,
    SYSTEMS_INVENTORY_VISUAL_CANDIDATE,
    SYSTEMS_SCOPE_VISUAL_LEGACY,
  ]);
}

export function independentPlanVisualUrl() {
  return uniqueCandidate(SYSTEMS_PLAN_VISUAL_CANDIDATE, [
    SYSTEMS_HERO_VISUAL_CANDIDATE,
    SYSTEMS_ASSESSMENT_VISUAL_CANDIDATE,
    SYSTEMS_SERVICES_VISUAL_CANDIDATE,
    SYSTEMS_MODEL_VISUAL_CANDIDATE,
    SYSTEMS_DELIVERABLES_VISUAL_CANDIDATE,
    SYSTEMS_WORKFLOW_VISUAL_CANDIDATE,
    SYSTEMS_FIT_VISUAL_CANDIDATE,
    SYSTEMS_INVENTORY_VISUAL_CANDIDATE,
    SYSTEMS_SCOPE_VISUAL_CANDIDATE,
    SYSTEMS_PLAN_VISUAL_LEGACY,
  ]);
}

export function independentTestingVisualUrl() {
  return uniqueCandidate(SYSTEMS_TESTING_VISUAL_CANDIDATE, [
    SYSTEMS_HERO_VISUAL_CANDIDATE,
    SYSTEMS_ASSESSMENT_VISUAL_CANDIDATE,
    SYSTEMS_SERVICES_VISUAL_CANDIDATE,
    SYSTEMS_MODEL_VISUAL_CANDIDATE,
    SYSTEMS_DELIVERABLES_VISUAL_CANDIDATE,
    SYSTEMS_WORKFLOW_VISUAL_CANDIDATE,
    SYSTEMS_FIT_VISUAL_CANDIDATE,
    SYSTEMS_INVENTORY_VISUAL_CANDIDATE,
    SYSTEMS_SCOPE_VISUAL_CANDIDATE,
    SYSTEMS_PLAN_VISUAL_CANDIDATE,
    SYSTEMS_PLAN_VISUAL_LEGACY,
  ]);
}

export function independentRelatedVisualUrl() {
  return uniqueCandidate(SYSTEMS_RELATED_VISUAL_CANDIDATE, [
    SYSTEMS_HERO_VISUAL_CANDIDATE,
    SYSTEMS_ASSESSMENT_VISUAL_CANDIDATE,
    SYSTEMS_SERVICES_VISUAL_CANDIDATE,
    SYSTEMS_MODEL_VISUAL_CANDIDATE,
    SYSTEMS_DELIVERABLES_VISUAL_CANDIDATE,
    SYSTEMS_WORKFLOW_VISUAL_CANDIDATE,
    SYSTEMS_FIT_VISUAL_CANDIDATE,
    SYSTEMS_INVENTORY_VISUAL_CANDIDATE,
    SYSTEMS_SCOPE_VISUAL_CANDIDATE,
    SYSTEMS_PLAN_VISUAL_CANDIDATE,
    SYSTEMS_PLAN_VISUAL_LEGACY,
    SYSTEMS_TESTING_VISUAL_CANDIDATE,
    SYSTEMS_ENQUIRY_VISUAL_CANDIDATE,
    SYSTEMS_ENQUIRY_VISUAL_LEGACY,
  ]);
}

export function systemsEnquiryVisualUrl() {
  return uniqueCandidate(SYSTEMS_ENQUIRY_VISUAL_CANDIDATE, [
    SYSTEMS_HERO_VISUAL_CANDIDATE,
    SYSTEMS_ASSESSMENT_VISUAL_CANDIDATE,
    SYSTEMS_SERVICES_VISUAL_CANDIDATE,
    SYSTEMS_MODEL_VISUAL_CANDIDATE,
    SYSTEMS_DELIVERABLES_VISUAL_CANDIDATE,
    SYSTEMS_WORKFLOW_VISUAL_CANDIDATE,
    SYSTEMS_FIT_VISUAL_CANDIDATE,
    SYSTEMS_INVENTORY_VISUAL_CANDIDATE,
    SYSTEMS_SCOPE_VISUAL_CANDIDATE,
    SYSTEMS_PLAN_VISUAL_CANDIDATE,
    SYSTEMS_PLAN_VISUAL_LEGACY,
    SYSTEMS_TESTING_VISUAL_CANDIDATE,
    SYSTEMS_RELATED_VISUAL_CANDIDATE,
    SYSTEMS_ENQUIRY_VISUAL_LEGACY,
    SYSTEMS_ENQUIRY_VISUAL_CONTACT,
  ]);
}

export type HotelSystemsResolvedPage = CmsSystemsPage & { fromCms: boolean };

function uniqueVisual(visual: CmsSystemsVisual, dummy: string, blocked: string[]): CmsSystemsVisual {
  const next = publicSrc(visual.src) || dummy;
  const fallback = dummy && !blocked.includes(dummy) ? dummy : "";
  const resolved = !next || blocked.includes(next) ? fallback : next;
  return { ...visual, src: systemsRenderableSrc(resolved, visual.status) };
}

function withResolvedVisuals(parsed: CmsSystemsPage): CmsSystemsPage {
  const dummyHero = independentHeroVisualUrl() || "";
  const dummyAssessment = independentAssessmentVisualUrl() || "";
  const dummyServices = independentServicesVisualUrl() || "";
  const dummyModel = independentModelVisualUrl() || "";
  const dummyDeliverables = independentDeliverablesVisualUrl() || "";
  const dummyWorkflow = independentWorkflowVisualUrl() || "";
  const dummyFit = independentFitVisualUrl() || "";
  const dummyInventory = independentInventoryVisualUrl() || "";
  const dummyScope = independentScopeVisualUrl() || "";
  const dummyPlan = independentPlanVisualUrl() || "";
  const dummyTesting = independentTestingVisualUrl() || "";
  const dummyRelated = independentRelatedVisualUrl() || "";
  const dummyForm = systemsEnquiryVisualUrl() || "";
  const hero = uniqueVisual(parsed.hero.visual, dummyHero, []);
  const assessment = uniqueVisual(parsed.assessment.visual, dummyAssessment, [hero.src, dummyHero, SYSTEMS_HERO_VISUAL_CANDIDATE, SYSTEMS_HERO_VISUAL_LEGACY, SYSTEMS_ASSESSMENT_VISUAL_LEGACY, ""]);
  const services = uniqueVisual(parsed.services.visual, dummyServices, [hero.src, assessment.src, dummyHero, dummyAssessment, SYSTEMS_HERO_VISUAL_CANDIDATE, SYSTEMS_ASSESSMENT_VISUAL_CANDIDATE, SYSTEMS_SERVICES_VISUAL_LEGACY, ""]);
  const model = uniqueVisual(parsed.model.visual, dummyModel, [hero.src, assessment.src, services.src, dummyHero, dummyAssessment, dummyServices, SYSTEMS_HERO_VISUAL_CANDIDATE, SYSTEMS_ASSESSMENT_VISUAL_CANDIDATE, SYSTEMS_SERVICES_VISUAL_CANDIDATE, ""]);
  const deliverables = uniqueVisual(parsed.deliverables.visual, dummyDeliverables, [hero.src, assessment.src, services.src, model.src, dummyHero, dummyAssessment, dummyServices, dummyModel, SYSTEMS_HERO_VISUAL_CANDIDATE, SYSTEMS_ASSESSMENT_VISUAL_CANDIDATE, SYSTEMS_SERVICES_VISUAL_CANDIDATE, SYSTEMS_MODEL_VISUAL_CANDIDATE, ""]);
  const workflow = uniqueVisual(parsed.workflow.visual, dummyWorkflow, [hero.src, assessment.src, services.src, model.src, deliverables.src, dummyHero, dummyAssessment, dummyServices, dummyModel, dummyDeliverables, SYSTEMS_HERO_VISUAL_CANDIDATE, SYSTEMS_ASSESSMENT_VISUAL_CANDIDATE, SYSTEMS_SERVICES_VISUAL_CANDIDATE, SYSTEMS_MODEL_VISUAL_CANDIDATE, SYSTEMS_DELIVERABLES_VISUAL_CANDIDATE, SYSTEMS_WORKFLOW_VISUAL_LEGACY, SYSTEMS_WORKFLOW_VISUAL_METHOD, ""]);
  const fit = uniqueVisual(parsed.fit.visual, dummyFit, [hero.src, assessment.src, services.src, model.src, deliverables.src, workflow.src, dummyHero, dummyAssessment, dummyServices, dummyModel, dummyDeliverables, dummyWorkflow, SYSTEMS_HERO_VISUAL_CANDIDATE, SYSTEMS_ASSESSMENT_VISUAL_CANDIDATE, SYSTEMS_SERVICES_VISUAL_CANDIDATE, SYSTEMS_MODEL_VISUAL_CANDIDATE, SYSTEMS_DELIVERABLES_VISUAL_CANDIDATE, SYSTEMS_WORKFLOW_VISUAL_CANDIDATE, SYSTEMS_FIT_VISUAL_LEGACY, SYSTEMS_FIT_VISUAL_MATRIX, ""]);
  const inventory = uniqueVisual(parsed.inventory.visual, dummyInventory, [hero.src, assessment.src, services.src, model.src, deliverables.src, workflow.src, fit.src, dummyHero, dummyAssessment, dummyServices, dummyModel, dummyDeliverables, dummyWorkflow, dummyFit, SYSTEMS_HERO_VISUAL_CANDIDATE, SYSTEMS_ASSESSMENT_VISUAL_CANDIDATE, SYSTEMS_SERVICES_VISUAL_CANDIDATE, SYSTEMS_MODEL_VISUAL_CANDIDATE, SYSTEMS_DELIVERABLES_VISUAL_CANDIDATE, SYSTEMS_WORKFLOW_VISUAL_CANDIDATE, SYSTEMS_FIT_VISUAL_CANDIDATE, SYSTEMS_FIT_VISUAL_LEGACY, SYSTEMS_FIT_VISUAL_MATRIX, ""]);
  const scope = uniqueVisual(parsed.scope.visual, dummyScope, [hero.src, assessment.src, services.src, model.src, deliverables.src, workflow.src, fit.src, inventory.src, dummyHero, dummyAssessment, dummyServices, dummyModel, dummyDeliverables, dummyWorkflow, dummyFit, dummyInventory, SYSTEMS_HERO_VISUAL_CANDIDATE, SYSTEMS_ASSESSMENT_VISUAL_CANDIDATE, SYSTEMS_SERVICES_VISUAL_CANDIDATE, SYSTEMS_MODEL_VISUAL_CANDIDATE, SYSTEMS_DELIVERABLES_VISUAL_CANDIDATE, SYSTEMS_WORKFLOW_VISUAL_CANDIDATE, SYSTEMS_FIT_VISUAL_CANDIDATE, SYSTEMS_INVENTORY_VISUAL_CANDIDATE, SYSTEMS_SCOPE_VISUAL_LEGACY, ""]);
  const plan = uniqueVisual(parsed.plan.visual, dummyPlan, [hero.src, assessment.src, services.src, model.src, deliverables.src, workflow.src, fit.src, inventory.src, scope.src, dummyHero, dummyAssessment, dummyServices, dummyModel, dummyDeliverables, dummyWorkflow, dummyFit, dummyInventory, dummyScope, SYSTEMS_HERO_VISUAL_CANDIDATE, SYSTEMS_ASSESSMENT_VISUAL_CANDIDATE, SYSTEMS_SERVICES_VISUAL_CANDIDATE, SYSTEMS_MODEL_VISUAL_CANDIDATE, SYSTEMS_DELIVERABLES_VISUAL_CANDIDATE, SYSTEMS_WORKFLOW_VISUAL_CANDIDATE, SYSTEMS_FIT_VISUAL_CANDIDATE, SYSTEMS_INVENTORY_VISUAL_CANDIDATE, SYSTEMS_SCOPE_VISUAL_CANDIDATE, SYSTEMS_PLAN_VISUAL_LEGACY, ""]);
  const testing = uniqueVisual(parsed.testing.visual, dummyTesting, [hero.src, assessment.src, services.src, model.src, deliverables.src, workflow.src, fit.src, inventory.src, scope.src, plan.src, dummyHero, dummyAssessment, dummyServices, dummyModel, dummyDeliverables, dummyWorkflow, dummyFit, dummyInventory, dummyScope, dummyPlan, SYSTEMS_HERO_VISUAL_CANDIDATE, SYSTEMS_ASSESSMENT_VISUAL_CANDIDATE, SYSTEMS_SERVICES_VISUAL_CANDIDATE, SYSTEMS_MODEL_VISUAL_CANDIDATE, SYSTEMS_DELIVERABLES_VISUAL_CANDIDATE, SYSTEMS_WORKFLOW_VISUAL_CANDIDATE, SYSTEMS_FIT_VISUAL_CANDIDATE, SYSTEMS_INVENTORY_VISUAL_CANDIDATE, SYSTEMS_SCOPE_VISUAL_CANDIDATE, SYSTEMS_PLAN_VISUAL_CANDIDATE, SYSTEMS_PLAN_VISUAL_LEGACY, ""]);
  const related = uniqueVisual(parsed.related.visual, dummyRelated, [hero.src, assessment.src, services.src, model.src, deliverables.src, workflow.src, fit.src, inventory.src, scope.src, plan.src, testing.src, dummyHero, dummyAssessment, dummyServices, dummyModel, dummyDeliverables, dummyWorkflow, dummyFit, dummyInventory, dummyScope, dummyPlan, dummyTesting, dummyForm, SYSTEMS_HERO_VISUAL_CANDIDATE, SYSTEMS_ASSESSMENT_VISUAL_CANDIDATE, SYSTEMS_SERVICES_VISUAL_CANDIDATE, SYSTEMS_MODEL_VISUAL_CANDIDATE, SYSTEMS_DELIVERABLES_VISUAL_CANDIDATE, SYSTEMS_WORKFLOW_VISUAL_CANDIDATE, SYSTEMS_FIT_VISUAL_CANDIDATE, SYSTEMS_INVENTORY_VISUAL_CANDIDATE, SYSTEMS_SCOPE_VISUAL_CANDIDATE, SYSTEMS_PLAN_VISUAL_CANDIDATE, SYSTEMS_TESTING_VISUAL_CANDIDATE, SYSTEMS_ENQUIRY_VISUAL_CANDIDATE, SYSTEMS_ENQUIRY_VISUAL_LEGACY, ""]);
  const form = uniqueVisual(parsed.form.visual, dummyForm, [hero.src, assessment.src, services.src, model.src, deliverables.src, workflow.src, fit.src, inventory.src, scope.src, plan.src, testing.src, related.src, dummyHero, dummyAssessment, dummyServices, dummyModel, dummyDeliverables, dummyWorkflow, dummyFit, dummyInventory, dummyScope, dummyPlan, dummyTesting, dummyRelated, SYSTEMS_HERO_VISUAL_CANDIDATE, SYSTEMS_ASSESSMENT_VISUAL_CANDIDATE, SYSTEMS_SERVICES_VISUAL_CANDIDATE, SYSTEMS_MODEL_VISUAL_CANDIDATE, SYSTEMS_DELIVERABLES_VISUAL_CANDIDATE, SYSTEMS_WORKFLOW_VISUAL_CANDIDATE, SYSTEMS_FIT_VISUAL_CANDIDATE, SYSTEMS_INVENTORY_VISUAL_CANDIDATE, SYSTEMS_SCOPE_VISUAL_CANDIDATE, SYSTEMS_PLAN_VISUAL_CANDIDATE, SYSTEMS_TESTING_VISUAL_CANDIDATE, SYSTEMS_RELATED_VISUAL_CANDIDATE, SYSTEMS_ENQUIRY_VISUAL_LEGACY, SYSTEMS_ENQUIRY_VISUAL_CONTACT, ""]);
  return {
    ...parsed,
    hero: { ...parsed.hero, visual: hero },
    assessment: { ...parsed.assessment, visual: assessment },
    services: { ...parsed.services, visual: services },
    model: { ...parsed.model, visual: model },
    deliverables: { ...parsed.deliverables, visual: deliverables },
    workflow: { ...parsed.workflow, visual: workflow },
    fit: { ...parsed.fit, visual: fit },
    inventory: { ...parsed.inventory, visual: inventory },
    scope: { ...parsed.scope, visual: scope },
    plan: { ...parsed.plan, visual: plan },
    testing: { ...parsed.testing, visual: testing },
    related: { ...parsed.related, visual: related },
    form: { ...parsed.form, visual: form },
    seo: { ...parsed.seo, social: withVisualSrc(parsed.seo.social) },
  };
}

export async function loadHotelSystemsPage(locale: Locale): Promise<HotelSystemsResolvedPage> {
  const resolvedLocale = locale === "ru" || locale === "zh" ? "en" : locale;
  const base = defaultHotelSystemsCms(resolvedLocale === "th" ? "th" : "en");
  const preferred = await pageDocumentBySlug(HOTEL_SYSTEMS_PAGE_SLUG, resolvedLocale).catch(() => null);
  const doc = preferred && isCmsPageLive(preferred) ? preferred : null;
  if (!doc || doc.template !== HOTEL_SYSTEMS_CMS_TEMPLATE) {
    return { ...withResolvedVisuals(base), fromCms: false };
  }
  const parsed = parseHotelSystemsPageBody(doc.body, resolvedLocale === "th" ? "th" : "en");
  if (!parsed) return { ...withResolvedVisuals(base), fromCms: false };
  return { ...withResolvedVisuals(parsed), fromCms: true };
}

export async function loadHotelSystemsPagePreview(id: string) {
  const doc = await documentById(id);
  if (!doc) return null;
  const locale = (["th", "en", "ru", "zh"].includes(doc.locale) ? doc.locale : "th") as Locale;
  const parsed = parseHotelSystemsPageBody(doc.body, locale) ?? defaultHotelSystemsCms(locale);
  return {
    locale,
    live: isCmsPageLive(doc),
    content: withResolvedVisuals(parsed),
  };
}

export function hotelSystemsFaqsFromCms(content: CmsSystemsPage | null | undefined, locale: Locale): FaqItem[] {
  const english = locale !== "th";
  const mapped =
    content?.faqs.map((item) => ({
      q: english && item.qEn.trim() ? item.qEn : item.q,
      a: english && item.aEn.trim() ? item.aEn : item.a,
    })) ?? [];
  return mapped.length && !hotelSystemsFaqsAreStale(mapped) ? mapped : hotelSystemsFaqs(locale === "th" ? "th" : "en");
}
