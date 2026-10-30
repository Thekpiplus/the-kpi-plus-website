import Link from "next/link";
import { HotelSystemsEnquiry } from "@/components/HotelSystemsEnquiry";
import { HotelSystemsStickyCta } from "@/components/HotelSystemsStickyCta";
import {
  HotelSystemsReviewChecklist,
} from "@/components/hotel-systems/HotelSystemsReviewChecklist";
import { HotelSystemsBeforeAfter } from "@/components/hotel-systems/HotelSystemsBeforeAfter";
import { HotelSystemsLandscape } from "@/components/hotel-systems/HotelSystemsLandscape";
import { HotelSystemsReadiness } from "@/components/hotel-systems/HotelSystemsReadiness";
import { HotelSystemsPlatforms } from "@/components/hotel-systems/HotelSystemsPlatforms";
import { HotelSystemsInventory } from "@/components/hotel-systems/HotelSystemsInventory";
import { HotelSystemsHandover } from "@/components/hotel-systems/HotelSystemsHandover";
import { HotelSystemsResponsibility } from "@/components/hotel-systems/HotelSystemsResponsibility";
import { HotelSystemsTesting } from "@/components/hotel-systems/HotelSystemsTesting";
import { HotelSystemsWorkflow } from "@/components/hotel-systems/HotelSystemsWorkflow";
import {
  HotelSystemsReviewVisual,
  HotelSystemsHeroVisual,
  HotelSystemsRelatedVisual,
} from "@/components/hotel-systems/HotelSystemsVisuals";
import "@/components/hotel-systems/hotel-systems-visuals.css";
import { PageFaqs } from "@/components/PageFaqs";
import { SiteShell } from "@/components/SiteShell";
import type { CmsSystemsPage } from "@/lib/cms/hotel-systems-page";
import {
  hotelSystemsFaqsFromCms,
  loadHotelSystemsPage,
} from "@/lib/cms/hotel-systems-page-public";
import {
  SYSTEMS_DELIVERABLES_BOUNDARY,
  SYSTEMS_DELIVERABLES_VISUAL,
  SYSTEMS_FIT_NOT,
  SYSTEMS_FIT_VISUAL,
  SYSTEMS_INVENTORY_VISUAL,
  SYSTEMS_TESTING_VISUAL,
  SYSTEMS_ASSESSMENT_VISUAL,
  SYSTEMS_HERO_JOURNEY,
  SYSTEMS_HERO_VISUAL,
  SYSTEMS_KPIS,
  SYSTEMS_KPI_SAMPLE,
  SYSTEMS_MODEL_BOUNDARY,
  SYSTEMS_MODEL_STEPS,
  SYSTEMS_MODEL_VISUAL,
  SYSTEMS_HANDOVER_NOTE,
  SYSTEMS_PLAN_VISUAL,
  SYSTEMS_SCOPE_BOUNDARY,
  SYSTEMS_SCOPE_VISUAL,
  SYSTEMS_SERVICES_VISUAL,
  SYSTEMS_SOURCES,
  SYSTEMS_WORKFLOW_APPROVALS,
  SYSTEMS_WORKFLOW_GATE,
  SYSTEMS_WORKFLOW_VISUAL,
  hotelSystemsCopy,
  hotelSystemsRelatedCards,
  systemsAssessmentCmsRows,
  systemsAssessmentRowsAreStale,
  systemsBeforeAfterCmsFields,
  systemsBeforeAfterFieldsAreStale,
  systemsLandscapeCmsItems,
  systemsLandscapeConnectionsCms,
  systemsLandscapeItemsAreStale,
  systemsLandscapeConnectionsAreStale,
  systemsLandscapePathIsStale,
  SYSTEMS_LANDSCAPE_PATH,
  systemsModelStepsAreStale,
  systemsReadinessCmsRows,
  systemsReadinessRowsAreStale,
  systemsFitCmsRows,
  systemsFitRowsAreStale,
  systemsDictionaryCmsRows,
  systemsDictionaryRowsAreStale,
  systemsInventoryCmsRows,
  systemsInventoryRowsAreStale,
  systemsTestingCmsCases,
  systemsTestingCasesAreStale,
  systemsTestingErrorCmsSteps,
  systemsHandoverCmsItems,
  systemsHandoverItemsAreStale,
  systemsOwnershipCmsRows,
  systemsOwnershipRowsAreStale,
  systemsResponsibilityCmsRows,
  systemsResponsibilityRowsAreStale,
  systemsScopeCmsRows,
  systemsScopeRowsAreStale,
  systemsWorkflowCmsSteps,
  systemsWorkflowStepsAreStale,
} from "@/lib/hotel-systems";
import { solutionNavLabel } from "@/lib/nav";
import { existingHref, localizePath, type Locale } from "@/lib/seo";

function systemsPublicHref(href: string, locale: Locale, fallback: string) {
  const next = href.trim() || fallback;
  if (/^(#|https?:\/\/|mailto:|tel:)/i.test(next)) return next;
  return existingHref(next, locale) || localizePath(next, locale) || next;
}

function systemsHeroText(cmsValue: string, next: string, staleStarts: string[]) {
  const value = cmsValue.trim();
  if (!value || staleStarts.some((start) => value === start || value.startsWith(start))) return next;
  return value;
}

export async function HotelSystemsView({
  locale,
  previewContent,
  embedded = false,
}: {
  locale: Locale;
  previewContent?: CmsSystemsPage;
  embedded?: boolean;
}) {
  const cms = previewContent ? { ...previewContent, fromCms: true } : await loadHotelSystemsPage(locale);
  const fromCms = cms.fromCms;
  const t = locale === "th" ? hotelSystemsCopy.th : hotelSystemsCopy.en;
  const solutions = localizePath("/solutions", locale);
  const approach = existingHref("/approach", locale) || localizePath("/approach", locale);
  const thai = locale === "th";
  const faqItems = hotelSystemsFaqsFromCms(fromCms ? cms : null, locale);
  const related =
    fromCms && cms.related.cards.length
      ? cms.related.cards.map((card) => ({
          id: card.id,
          href: systemsPublicHref(card.href, locale, "/solutions"),
          title: thai ? card.titleTh || card.titleEn : card.titleEn || card.titleTh,
          body: thai ? card.bodyTh || card.bodyEn : card.bodyEn || card.bodyTh,
          cta: thai ? card.ctaTh || card.ctaEn : card.ctaEn || card.ctaTh,
        }))
      : hotelSystemsRelatedCards(locale);
  const assessmentRows =
    fromCms && cms.assessment.rows.length && !systemsAssessmentRowsAreStale(cms.assessment.rows)
      ? cms.assessment.rows
      : systemsAssessmentCmsRows();
  const needTitle = systemsHeroText(fromCms ? cms.assessment.title : "", t.needTitle, [
    "Is the hotel meeting one of these?",
  ]);
  const needLead = systemsHeroText(fromCms ? cms.assessment.lead : "", t.needLead, [
    "PMS, Channel Manager, OTA, Booking Engine, รายงาน และทีมโรงแรมอาจยังไม่ได้ทำงานจากชุดข้อมูลเดียวกัน",
    "The PMS, channel manager, OTA, booking engine, reporting, and hotel teams may not work from one consistent data flow.",
  ]);
  const needClose = systemsHeroText(fromCms ? cms.assessment.close : "", t.needClose, [
    "ไม่ใช่ผลตรวจโรงแรมจริง และไม่ใช่สถานะเชื่อมต่อที่ตรวจแล้ว",
    "It is not a live hotel audit, and not a verified integration status.",
  ]);
  const reviewLabel = systemsHeroText(fromCms ? cms.assessment.visual.label : "", thai ? SYSTEMS_ASSESSMENT_VISUAL.labelTh : SYSTEMS_ASSESSMENT_VISUAL.labelEn, [
    "ตัวอย่าง Data Consistency Audit",
    "Sample Data Consistency Audit",
  ]);
  const reviewCaption = systemsHeroText(fromCms ? cms.assessment.visual.caption : "", thai ? SYSTEMS_ASSESSMENT_VISUAL.captionTh : SYSTEMS_ASSESSMENT_VISUAL.captionEn, [
    "ตัวอย่างข้อมูล ใช้จัดประเด็นการจับคู่",
    "Sample data used to locate mapping issues",
  ]);
  const landscapeItems =
    fromCms && cms.services.items.length && !systemsLandscapeItemsAreStale(cms.services.items)
      ? cms.services.items
      : systemsLandscapeCmsItems();
  const helpTitle = systemsHeroText(fromCms ? cms.services.title : "", t.helpTitle, [
    "ระบบที่ต้องทำงานร่วมกัน",
    "What hotel systems need to work together",
  ]);
  const helpLead = systemsHeroText(fromCms ? cms.services.lead : "", t.helpLead, [
    "งานแบ่งเป็น PMS โครงสร้างห้อง",
    "The work is grouped into PMS",
  ]);
  const helpBoundary = systemsHeroText(fromCms ? cms.services.boundary : "", t.helpBoundary, []);
  const landscapeLabel = systemsHeroText(
    fromCms ? cms.services.visual.label : "",
    thai ? SYSTEMS_SERVICES_VISUAL.labelTh : SYSTEMS_SERVICES_VISUAL.labelEn,
    ["ตัวอย่าง Systems Landscape", "Sample Systems Landscape"],
  );
  const landscapeCaption = systemsHeroText(
    fromCms ? cms.services.visual.caption : "",
    thai ? SYSTEMS_SERVICES_VISUAL.captionTh : SYSTEMS_SERVICES_VISUAL.captionEn,
    [],
  );
  const modelTitle = systemsHeroText(fromCms ? cms.model.title : "", t.modelTitle, [
    "รองรับทั้งโรงแรมก่อนเปิด",
    "For hotels before opening",
  ]);
  const modelLead = systemsHeroText(fromCms ? cms.model.lead : "", t.modelLead, []);
  const modelNote = systemsHeroText(fromCms ? cms.model.note : "", t.modelNote, []);
  const modelLabel = systemsHeroText(
    fromCms ? cms.model.visual.label : "",
    SYSTEMS_MODEL_VISUAL.labelEn,
    ["Before / After", "ก่อนและหลัง"],
  );
  const modelCaption = systemsHeroText(
    fromCms ? cms.model.visual.caption : "",
    thai ? SYSTEMS_MODEL_VISUAL.captionTh : SYSTEMS_MODEL_VISUAL.captionEn,
    [],
  );
  const modelSteps =
    fromCms && cms.model.steps.length && !systemsModelStepsAreStale(cms.model.steps) ? cms.model.steps : SYSTEMS_MODEL_STEPS;
  const modelFields =
    fromCms && cms.model.fields.length && !systemsBeforeAfterFieldsAreStale(cms.model.fields)
      ? cms.model.fields
      : systemsBeforeAfterCmsFields();
  const deliverablesTitle = systemsHeroText(fromCms ? cms.deliverables.title : "", t.deliverablesTitle, [
    "เราดูอย่างไรว่าระบบพร้อมใช้งาน?",
    "How do we know a system is ready to use?",
  ]);
  const deliverablesLead = systemsHeroText(fromCms ? cms.deliverables.lead : "", t.deliverablesLead, [
    "เราไม่ได้ดูเพียงสถานะว่า",
    "We do not only look at a status that says",
  ]);
  const readinessLabel = systemsHeroText(
    fromCms ? cms.deliverables.visual.label : "",
    SYSTEMS_DELIVERABLES_VISUAL.labelEn,
    ["ตัวอย่าง Integration Readiness", "Sample Integration Readiness"],
  );
  const readinessCaption = systemsHeroText(
    fromCms ? cms.deliverables.visual.caption : "",
    thai ? SYSTEMS_DELIVERABLES_VISUAL.captionTh : SYSTEMS_DELIVERABLES_VISUAL.captionEn,
    [],
  );
  const readinessRows =
    fromCms && cms.deliverables.rows.length && !systemsReadinessRowsAreStale(cms.deliverables.rows)
      ? cms.deliverables.rows
      : systemsReadinessCmsRows();
  const deliverableSupport = fromCms && cms.deliverables.supportItems.length ? cms.deliverables.supportItems : SYSTEMS_DELIVERABLES_BOUNDARY.supportItems.map((item, index) => ({ id: `support-${index + 1}`, th: item.th, en: item.en }));
  const deliverableHotel = fromCms && cms.deliverables.hotelItems.length ? cms.deliverables.hotelItems : SYSTEMS_DELIVERABLES_BOUNDARY.hotelItems.map((item, index) => ({ id: `hotel-${index + 1}`, th: item.th, en: item.en }));
  const workflowTitle = systemsHeroText(fromCms ? cms.workflow.title : "", t.methodTitle, []);
  const workflowLead = systemsHeroText(fromCms ? cms.workflow.lead : "", t.methodLead, [
    "งานเริ่มจากสำรวจระบบ แล้วจับคู่ข้อมูล ตั้งค่า ทดสอบ อบรม",
    "The work starts with a systems review, then mapping, configuration, testing, training",
  ]);
  const workflowLabel = systemsHeroText(
    fromCms ? cms.workflow.visual.label : "",
    SYSTEMS_WORKFLOW_VISUAL.labelEn,
    ["ตัวอย่างขั้นตอนนำระบบไปใช้", "Sample implementation workflow"],
  );
  const workflowCaption = systemsHeroText(
    fromCms ? cms.workflow.visual.caption : "",
    thai ? SYSTEMS_WORKFLOW_VISUAL.captionTh : SYSTEMS_WORKFLOW_VISUAL.captionEn,
    ["ลำดับตัวอย่าง งานเชื่อมต่อบางส่วน", "A sample sequence. Some connection work"],
  );
  const workflowSteps =
    fromCms && cms.workflow.steps.length && !systemsWorkflowStepsAreStale(cms.workflow.steps)
      ? cms.workflow.steps
      : systemsWorkflowCmsSteps();
  const workflowApprovals =
    fromCms && cms.workflow.approvals.length && !cms.workflow.approvals.some((item) => item.id === "credentials" || item.id === "access")
      ? cms.workflow.approvals
      : SYSTEMS_WORKFLOW_APPROVALS.map((item) => ({ id: item.id, th: item.th, en: item.en }));
  const workflowGateTitle = systemsHeroText(
    fromCms ? cms.workflow.gateTitle : "",
    thai ? SYSTEMS_WORKFLOW_GATE.titleTh : SYSTEMS_WORKFLOW_GATE.titleEn,
    ["จุดที่โรงแรมหรือผู้ให้บริการต้องอนุมัติ", "Hotel or provider approval points"],
  );
  const workflowGate = systemsHeroText(
    fromCms ? cms.workflow.gate : "",
    thai ? SYSTEMS_WORKFLOW_GATE.th : SYSTEMS_WORKFLOW_GATE.en,
    [],
  );
  const fitTitle = systemsHeroText(fromCms ? cms.fit.title : "", t.fitTitle, [
    "ระบบโรงแรมที่ทีมมีประสบการณ์ในการติดตั้งและประสานงาน",
    "Hotel systems the team has experience implementing and coordinating",
  ]);
  const fitLead = systemsHeroText(fromCms ? cms.fit.lead : "", t.fitLead, [
    "ชื่อและโลโก้ใช้เพื่อระบุแพลตฟอร์มที่เกี่ยวข้องกับงานเท่านั้น",
    "Names and logos are used only to name platforms related to the work",
  ]);
  const fitLabel = systemsHeroText(
    fromCms ? cms.fit.visual.label : "",
    SYSTEMS_FIT_VISUAL.labelEn,
    ["หมวดแพลตฟอร์มตัวอย่าง", "Example platform categories"],
  );
  const fitCaption = systemsHeroText(
    fromCms ? cms.fit.visual.caption : "",
    thai ? SYSTEMS_FIT_VISUAL.captionTh : SYSTEMS_FIT_VISUAL.captionEn,
    ["ชื่อและโลโก้ใช้ระบุแพลตฟอร์มที่เกี่ยวข้องกับงานเท่านั้น", "Names and logos identify platforms related to the work"],
  );
  const fitScenarios =
    fromCms && cms.fit.scenarios.length && !systemsFitRowsAreStale(cms.fit.scenarios)
      ? cms.fit.scenarios
      : systemsFitCmsRows();
  const fitNot =
    fromCms && cms.fit.notItems.length && !cms.fit.notItems.some((item) => item.id === "revenue")
      ? cms.fit.notItems
      : SYSTEMS_FIT_NOT.map((item) => ({ id: item.id, th: item.th, en: item.en }));
  const inventoryTitle = systemsHeroText(fromCms ? cms.inventory.title : "", t.inventoryTitle, []);
  const inventoryLead = systemsHeroText(fromCms ? cms.inventory.lead : "", t.inventoryLead, []);
  const inventorySystemsTitle = systemsHeroText(fromCms ? cms.inventory.systemsTitle : "", t.inventorySystemsTitle, []);
  const inventoryFieldsTitle = systemsHeroText(fromCms ? cms.inventory.fieldsTitle : "", t.inventoryFieldsTitle, []);
  const inventoryLabel = systemsHeroText(
    fromCms ? cms.inventory.visual.label : "",
    SYSTEMS_INVENTORY_VISUAL.labelEn,
    [],
  );
  const inventoryCaption = systemsHeroText(
    fromCms ? cms.inventory.visual.caption : "",
    thai ? SYSTEMS_INVENTORY_VISUAL.captionTh : SYSTEMS_INVENTORY_VISUAL.captionEn,
    [],
  );
  const inventoryRows =
    fromCms && cms.inventory.rows.length && !systemsInventoryRowsAreStale(cms.inventory.rows)
      ? cms.inventory.rows
      : systemsInventoryCmsRows();
  const inventoryFields =
    fromCms && cms.inventory.fields.length && !systemsDictionaryRowsAreStale(cms.inventory.fields)
      ? cms.inventory.fields
      : systemsDictionaryCmsRows();
  const scopeTitle = systemsHeroText(fromCms ? cms.scope.title : "", t.scopeTitle, [
    "ขอบเขต ความรับผิดชอบ และการอนุมัติ",
    "Scope, responsibility, and approval",
  ]);
  const scopeLead = systemsHeroText(fromCms ? cms.scope.lead : "", t.scopeLead, []);
  const scopeSupportTitle = systemsHeroText(fromCms ? cms.scope.supportTitle : "", t.scopeSupportTitle, [
    "เดอะ เคพีไอ พลัส อาจช่วย",
    "The KPI Plus may support",
  ]);
  const scopeHotelTitle = systemsHeroText(fromCms ? cms.scope.hotelTitle : "", t.scopeHotelTitle, [
    "โรงแรมและผู้ให้บริการยังคงรับผิดชอบ",
    "The hotel and providers remain responsible for",
  ]);
  const scopeMatrixTitle = systemsHeroText(fromCms ? cms.scope.matrixTitle : "", t.scopeMatrixTitle, []);
  const scopeLabel = systemsHeroText(fromCms ? cms.scope.visual.label : "", SYSTEMS_SCOPE_VISUAL.labelEn, [
    "ตารางขอบเขตและความรับผิดชอบ",
    "Scope / Approval / Hotel",
  ]);
  const scopeCaption = systemsHeroText(
    fromCms ? cms.scope.visual.caption : "",
    thai ? SYSTEMS_SCOPE_VISUAL.captionTh : SYSTEMS_SCOPE_VISUAL.captionEn,
    [],
  );
  const scopeRows =
    fromCms && cms.scope.rows.length && !systemsScopeRowsAreStale(cms.scope.rows)
      ? cms.scope.rows
      : systemsScopeCmsRows();
  const scopeMatrix =
    fromCms && cms.scope.matrix.length && !systemsResponsibilityRowsAreStale(cms.scope.matrix)
      ? cms.scope.matrix
      : systemsResponsibilityCmsRows();
  const scopeBoundary = systemsHeroText(
    fromCms ? cms.scope.boundary : "",
    thai ? SYSTEMS_SCOPE_BOUNDARY.th : SYSTEMS_SCOPE_BOUNDARY.en,
    [hotelSystemsCopy.th.deliverablesBoundary, hotelSystemsCopy.en.deliverablesBoundary],
  );
  const planTitle = systemsHeroText(fromCms ? cms.plan.title : "", t.planTitle, [
    "แผนสำรวจ ตั้งค่า ทดสอบ และส่งมอบ — ตัวอย่าง",
    "Inventory, configure, test, and handover — Sample",
    "แผน 30 / 60 / 90 วัน — ตัวอย่าง",
  ]);
  const planLead = systemsHeroText(fromCms ? cms.plan.lead : "", t.planLead, [
    "นี่เป็นลำดับตัวอย่าง",
    "This is a sample sequence",
  ]);
  const planChecklistTitle = systemsHeroText(fromCms ? cms.plan.checklistTitle : "", t.planChecklistTitle, []);
  const planOwnershipTitle = systemsHeroText(fromCms ? cms.plan.ownershipTitle : "", t.planOwnershipTitle, []);
  const planClose = systemsHeroText(fromCms ? cms.plan.close : "", t.planClose, [
    "รายละเอียดการทดสอบจะกำหนดตามระบบ",
    "The test detail is set from the systems",
  ]);
  const planLabel = systemsHeroText(fromCms ? cms.plan.visual.label : "", SYSTEMS_PLAN_VISUAL.labelEn, [
    "ตัวอย่างแผนทดสอบและส่งมอบ",
    "Sample handover and test cases",
    "Sample Architecture",
  ]);
  const planCaption = systemsHeroText(
    fromCms ? cms.plan.visual.caption : "",
    thai ? SYSTEMS_PLAN_VISUAL.captionTh : SYSTEMS_PLAN_VISUAL.captionEn,
    ["ลำดับตัวอย่างตามขอบเขตที่ตกลง", "A sample sequence within the agreed scope"],
  );
  const planChecklist =
    fromCms && cms.plan.checklist.length && !systemsHandoverItemsAreStale(cms.plan.checklist)
      ? cms.plan.checklist
      : systemsHandoverCmsItems();
  const planOwnership =
    fromCms && cms.plan.ownership.length && !systemsOwnershipRowsAreStale(cms.plan.ownership)
      ? cms.plan.ownership
      : systemsOwnershipCmsRows();
  const kpiRows = (fromCms && cms.measure.kpis.length ? cms.measure.kpis : SYSTEMS_KPIS).filter(
    (kpi) => !kpi.hideUntilData,
  );
  const sourceRows = fromCms && cms.measure.sources.length ? cms.measure.sources : SYSTEMS_SOURCES;
  const heroLead = systemsHeroText(fromCms ? cms.hero.description : "", t.lead, [
    "PMS, Channel Manager, Booking Engine และ OTA เป็นส่วนสำคัญ",
    "The PMS, channel manager, booking engine, and OTAs are a core part",
  ]);
  const heroClose = systemsHeroText(fromCms ? cms.hero.close : "", t.leadClose, [
    "เดอะ เคพีไอ พลัส ช่วยโรงแรมเลือก",
    "The KPI Plus helps hotels choose",
  ]);
  const heroCta = systemsHeroText(fromCms ? cms.hero.primaryCta.label : "", t.cta, [
    "ให้ทีมตรวจโครงสร้างระบบโรงแรม",
    "Ask the team to review the hotel system setup",
  ]);
  const heroSecondary = systemsHeroText(fromCms ? cms.hero.secondaryCta.label : "", t.secondary, ["ดูโซลูชันทั้งหมด", "All solutions"]);
  const heroLabel = systemsHeroText(fromCms ? cms.hero.visual.label : "", thai ? SYSTEMS_HERO_VISUAL.labelTh : SYSTEMS_HERO_VISUAL.labelEn, [
    "ตัวอย่างสถาปัตยกรรมระบบโรงแรม",
    "Sample Architecture",
  ]);
  const heroCaption = systemsHeroText(fromCms ? cms.hero.visual.caption : "", thai ? SYSTEMS_HERO_VISUAL.captionTh : SYSTEMS_HERO_VISUAL.captionEn, [
    "แสดงเส้นทางข้อมูลตัวอย่าง",
    "A sample data path",
  ]);
  const primaryHref = systemsPublicHref(fromCms ? cms.hero.primaryCta.href : "", locale, "#hotel-systems-enquiry");
  const secondaryPath =
    fromCms && cms.hero.secondaryCta.href.trim() && cms.hero.secondaryCta.href.trim() !== "/solutions"
      ? cms.hero.secondaryCta.href
      : "/approach";
  const secondaryHref = existingHref(secondaryPath, locale) || approach;
  const closerHref = systemsPublicHref(fromCms ? cms.related.closerHref : "", locale, "#hotel-systems-enquiry");
  const sampleLabel = systemsHeroText(fromCms ? cms.plan.sampleLabel : "", SYSTEMS_PLAN_VISUAL.labelEn, [
    "Sample plan",
    "Sample Architecture",
  ]);
  const testingTitle = systemsHeroText(fromCms ? cms.testing.title : "", t.testingTitle, []);
  const testingLead = systemsHeroText(fromCms ? cms.testing.lead : "", t.testingLead, []);
  const testingCasesTitle = systemsHeroText(fromCms ? cms.testing.casesTitle : "", t.testingCasesTitle, []);
  const testingErrorTitle = systemsHeroText(fromCms ? cms.testing.errorTitle : "", t.testingErrorTitle, []);
  const testingLabel = systemsHeroText(fromCms ? cms.testing.visual.label : "", SYSTEMS_TESTING_VISUAL.labelEn, []);
  const testingCaption = systemsHeroText(
    fromCms ? cms.testing.visual.caption : "",
    thai ? SYSTEMS_TESTING_VISUAL.captionTh : SYSTEMS_TESTING_VISUAL.captionEn,
    [],
  );
  const testingCases =
    fromCms && cms.testing.cases.length && !systemsTestingCasesAreStale(cms.testing.cases)
      ? cms.testing.cases
      : systemsTestingCmsCases();
  const testingErrorSteps =
    fromCms && cms.testing.errorSteps.length && cms.testing.errorSteps.some((item) => item.id === "detect")
      ? cms.testing.errorSteps
      : systemsTestingErrorCmsSteps();

  const inner = (
    <div className="kpi-systems">
      <section className="kpi-hero kpi-home-hero-section kpi-systems-hero">
        <div className="kpi-wrap">
          <nav aria-label="Breadcrumb" className="kpi-systems-hero-crumb">
            <ol>
              <li>
                <Link href={solutions}>{t.crumb}</Link>
              </li>
              <li>
                <span aria-hidden="true">/</span>
                <span>{solutionNavLabel("/solutions/hotel-systems-implementation", locale)}</span>
              </li>
            </ol>
          </nav>
          <div className="kpi-home-hero">
            <div className="kpi-home-hero-copy">
              <p className="kpi-home-eyebrow kpi-latin">{fromCms && cms?.hero.eyebrow.trim() ? cms.hero.eyebrow : t.eyebrow}</p>
              <h1 className="kpi-h1 kpi-home-h1">
                {thai &&
                (!cms.hero.title.trim() ||
                  cms.hero.title.trim() === hotelSystemsCopy.th.title ||
                  cms.hero.title.trim() === "ระบบเชื่อมกันได้ แต่ทีมและข้อมูลต้องทำงานไปด้วยกัน") ? (
                  <>
                    <span className="kpi-home-h1-lead">ระบบเชื่อมต่อได้ แต่ข้อมูลและการทำงานยังไม่</span>
                    <span className="kpi-home-h1-rest">
                      <span className="kpi-home-accent">ไปทางเดียวกัน</span>
                    </span>
                  </>
                ) : !thai &&
                  (!cms.hero.title.trim() ||
                    cms.hero.title.trim() === hotelSystemsCopy.en.title ||
                    cms.hero.title.trim() === "Systems can connect. The team and the data still have to work together.") ? (
                  <>
                    <span className="kpi-home-h1-lead">Systems can connect.</span>
                    <span className="kpi-home-h1-rest">
                      Data and operations still do not run <span className="kpi-home-accent">the same way</span>.
                    </span>
                  </>
                ) : (
                  cms.hero.title.trim() || t.title
                )}
              </h1>
              <p className="kpi-lead kpi-home-lead">{heroLead}</p>
              <p className="kpi-systems-lead-close">{heroClose}</p>
              <div className="kpi-actions">
                <a href={primaryHref} className="kpi-button bg-[#a2dc25] text-[#1a3a02]">
                  {heroCta} <span aria-hidden="true">↗</span>
                </a>
                <Link href={secondaryHref} className="kpi-button-ghost">
                  {heroSecondary}
                </Link>
              </div>
              <p className="kpi-systems-hero-note">{fromCms && cms?.hero.underCta.trim() ? cms.hero.underCta : t.underCta}</p>
              <p className="kpi-systems-hero-trust" aria-label={thai ? "งานเริ่มจากสำรวจระบบ เส้นทางข้อมูล การจับคู่ และความพร้อม" : "The work starts with inventory, data flow, mapping, and readiness"}>
                {SYSTEMS_HERO_JOURNEY.map((item) => (
                  <span key={item.id}>{thai ? item.th : item.en}</span>
                ))}
              </p>
            </div>
            <div className="kpi-hero-visual kpi-home-photo">
              <HotelSystemsHeroVisual
                locale={locale}
                src={cms.hero.visual.src}
                alt={thai ? cms.hero.visual.altTh : cms.hero.visual.altEn}
                status={cms.hero.visual.status}
                label={heroLabel}
                caption={heroCaption}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="kpi-section kpi-systems-need">
        <div className="kpi-systems-need-grid">
          <div className="kpi-systems-need-copy">
            <h2 className="kpi-h2">{needTitle}</h2>
            <p className="kpi-systems-need-lead">{needLead}</p>
            <p className="kpi-systems-need-close">{needClose}</p>
          </div>
          <HotelSystemsReviewVisual
            locale={locale}
            src={cms.assessment.visual.src}
            alt={thai ? cms.assessment.visual.altTh : cms.assessment.visual.altEn}
            status={cms.assessment.visual.status}
            label={reviewLabel}
            caption={reviewCaption}
          />
        </div>
        <HotelSystemsReviewChecklist locale={locale} rows={assessmentRows} />
      </section>

      <section className="kpi-systems-help border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <p className="kpi-systems-help-kicker kpi-latin">PMS · Channel Manager · OTA · Booking Engine · Website · Reporting · Hotel Team</p>
          <h2 className="kpi-h2">{helpTitle}</h2>
          <p className="kpi-systems-help-lead">{helpLead}</p>
          <HotelSystemsLandscape
            locale={locale}
            src={cms.services.visual.src}
            status={cms.services.visual.status}
            label={landscapeLabel}
            caption={landscapeCaption}
            note={helpBoundary}
            nodes={landscapeItems}
            categories={cms.services.categories}
            connections={
              fromCms && cms.services.connections.length && !systemsLandscapeConnectionsAreStale(cms.services.connections)
                ? cms.services.connections
                : systemsLandscapeConnectionsCms()
            }
            pathLabel={
              fromCms && !systemsLandscapePathIsStale(cms.services.pathLabel)
                ? cms.services.pathLabel
                : thai
                  ? SYSTEMS_LANDSCAPE_PATH.th
                  : SYSTEMS_LANDSCAPE_PATH.en
            }
          />
        </div>
      </section>

      <section className="kpi-section">
        <h2 className="kpi-h2">{modelTitle}</h2>
        <p className="kpi-systems-help-lead">{modelLead}</p>
        <HotelSystemsBeforeAfter
          locale={locale}
          src={cms.model.visual.src}
          status={cms.model.visual.status}
          label={modelLabel}
          caption={modelCaption}
          note={modelNote}
          steps={modelSteps}
          fields={modelFields}
        />
        <div className="kpi-systems-board is-2">
          <article className="kpi-systems-card is-green">
            <h3>{fromCms && cms.model.supportTitle.trim() ? cms.model.supportTitle : thai ? SYSTEMS_MODEL_BOUNDARY.supportTitle.th : SYSTEMS_MODEL_BOUNDARY.supportTitle.en}</h3>
            <p>{fromCms && cms.model.support.trim() ? cms.model.support : thai ? SYSTEMS_MODEL_BOUNDARY.support.th : SYSTEMS_MODEL_BOUNDARY.support.en}</p>
          </article>
          <article className="kpi-systems-card is-amber">
            <h3>{fromCms && cms.model.hotelTitle.trim() ? cms.model.hotelTitle : thai ? SYSTEMS_MODEL_BOUNDARY.hotelTitle.th : SYSTEMS_MODEL_BOUNDARY.hotelTitle.en}</h3>
            <p>{fromCms && cms.model.hotel.trim() ? cms.model.hotel : thai ? SYSTEMS_MODEL_BOUNDARY.hotel.th : SYSTEMS_MODEL_BOUNDARY.hotel.en}</p>
          </article>
        </div>
      </section>

      <section className="kpi-section kpi-systems-deliverables">
        <h2 className="kpi-h2">{deliverablesTitle}</h2>
        <p className="kpi-systems-deliverables-lead">{deliverablesLead}</p>
        <HotelSystemsReadiness
          locale={locale}
          src={cms.deliverables.visual.src}
          status={cms.deliverables.visual.status}
          label={readinessLabel}
          caption={readinessCaption}
          rows={readinessRows}
        />
        <div className="kpi-systems-deliverables-split">
          <article className="kpi-systems-card is-green">
            <h3>{fromCms && cms.deliverables.supportTitle.trim() ? cms.deliverables.supportTitle : thai ? SYSTEMS_DELIVERABLES_BOUNDARY.supportTitle.th : SYSTEMS_DELIVERABLES_BOUNDARY.supportTitle.en}</h3>
            <ul>
              {deliverableSupport.map((item) => (
                <li key={item.id}>{thai ? item.th : item.en}</li>
              ))}
            </ul>
          </article>
          <article className="kpi-systems-card is-amber">
            <h3>{fromCms && cms.deliverables.hotelTitle.trim() ? cms.deliverables.hotelTitle : thai ? SYSTEMS_DELIVERABLES_BOUNDARY.hotelTitle.th : SYSTEMS_DELIVERABLES_BOUNDARY.hotelTitle.en}</h3>
            <ul>
              {deliverableHotel.map((item) => (
                <li key={item.id}>{thai ? item.th : item.en}</li>
              ))}
            </ul>
          </article>
        </div>
        <p className="kpi-systems-deliverables-boundary">{fromCms && cms.deliverables.boundary.trim() ? cms.deliverables.boundary : t.deliverablesBoundary}</p>
      </section>

      <section className="kpi-section kpi-systems-method">
        <h2 className="kpi-h2">{workflowTitle}</h2>
        <p className="kpi-systems-method-lead">{workflowLead}</p>
        <HotelSystemsWorkflow
          locale={locale}
          src={cms.workflow.visual.src}
          status={cms.workflow.visual.status}
          label={workflowLabel}
          caption={workflowCaption}
          steps={workflowSteps}
          approvals={workflowApprovals}
          gateTitle={workflowGateTitle}
          gate={workflowGate}
        />
      </section>

      <section className="kpi-systems-fit border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <h2 className="kpi-h2">{fitTitle}</h2>
          <p className="kpi-systems-fit-lead">{fitLead}</p>
          <HotelSystemsPlatforms
            locale={locale}
            src={cms.fit.visual.src}
            status={cms.fit.visual.status}
            label={fitLabel}
            caption={fitCaption}
            rows={fitScenarios}
            notTitle={fromCms && cms.fit.notTitle.trim() ? cms.fit.notTitle : t.fitNotTitle}
            notItems={fitNot}
          />
        </div>
      </section>

      <section id="inventory" className="kpi-systems-inventory border-y border-[#E3E8EB] bg-[#F4F4F4]">
        <div className="kpi-section">
          <h2 className="kpi-h2">{inventoryTitle}</h2>
          <p className="kpi-systems-inventory-lead">{inventoryLead}</p>
          <HotelSystemsInventory
            locale={locale}
            src={cms.inventory.visual.src}
            status={cms.inventory.visual.status}
            label={inventoryLabel}
            caption={inventoryCaption}
            systemsTitle={inventorySystemsTitle}
            fieldsTitle={inventoryFieldsTitle}
            rows={inventoryRows}
            fields={inventoryFields}
          />
        </div>
      </section>

      <section id="scope" className="kpi-systems-scope kpi-section">
        <h2 className="kpi-h2">{scopeTitle}</h2>
        <p className="kpi-systems-scope-lead">{scopeLead}</p>
        <HotelSystemsResponsibility
          locale={locale}
          src={cms.scope.visual.src}
          status={cms.scope.visual.status}
          label={scopeLabel}
          caption={scopeCaption}
          supportTitle={scopeSupportTitle}
          hotelTitle={scopeHotelTitle}
          matrixTitle={scopeMatrixTitle}
          rows={scopeRows}
          matrix={scopeMatrix}
          boundary={scopeBoundary}
        />
      </section>

      <section id="handover" className="kpi-section kpi-systems-plan kpi-systems-handover">
        <p className="kpi-latin kpi-systems-plan-kicker">{sampleLabel}</p>
        <h2 className="kpi-h2">{planTitle}</h2>
        <p className="kpi-systems-plan-lead">{planLead}</p>
        <HotelSystemsHandover
          locale={locale}
          src={cms.plan.visual.src}
          status={cms.plan.visual.status}
          label={planLabel}
          caption={planCaption}
          checklistTitle={planChecklistTitle}
          ownershipTitle={planOwnershipTitle}
          checklist={planChecklist}
          ownership={planOwnership}
          note={thai ? SYSTEMS_HANDOVER_NOTE.th : SYSTEMS_HANDOVER_NOTE.en}
        />
        <p className="kpi-systems-plan-close">{planClose}</p>
      </section>

      <section id="testing" className="kpi-systems-testing border-y border-[#E3E8EB] bg-[#F4F4F4]">
        <div className="kpi-section">
          <h2 className="kpi-h2">{testingTitle}</h2>
          <p className="kpi-systems-testing-lead">{testingLead}</p>
          <HotelSystemsTesting
            locale={locale}
            src={cms.testing.visual.src}
            status={cms.testing.visual.status}
            label={testingLabel}
            caption={testingCaption}
            casesTitle={testingCasesTitle}
            errorTitle={testingErrorTitle}
            cases={testingCases}
            errorSteps={testingErrorSteps}
          />
        </div>
      </section>

      <section className="kpi-section" aria-labelledby="hotel-systems-measure-heading">
        <h2 id="hotel-systems-measure-heading" className="kpi-h2">
          {fromCms && cms?.measure.title.trim() ? cms.measure.title : t.measureTitle}
        </h2>
        <p id="hotel-systems-measure-desc">
          {thai
            ? "ตัวชี้วัดตัวอย่างสำหรับทบทวนจังหวะงาน ไม่ใช่ผลโรงแรมจริง และไม่ใช่ผลที่การันตี"
            : "Sample review measures for management rhythm. Not a live hotel result, and not a guaranteed outcome."}
        </p>
        <p id="hotel-systems-sources">
          {(sourceRows[0] && (thai ? sourceRows[0].nameTh : sourceRows[0].nameEn)) || (thai ? SYSTEMS_KPI_SAMPLE.sourceTh : SYSTEMS_KPI_SAMPLE.source)}
          {" · "}
          {sourceRows[0]?.publishedAt || SYSTEMS_KPI_SAMPLE.updatedAt}
        </p>
        <p>
          <a href={sourceRows[0]?.url || "#hotel-systems-sources"}>{thai ? sourceRows[0]?.nameTh || SYSTEMS_SOURCES[0].nameTh : sourceRows[0]?.nameEn || SYSTEMS_SOURCES[0].nameEn}</a>
        </p>
        <div className="kpi-systems-kpi" role="group" aria-labelledby="hotel-systems-measure-heading" aria-describedby="hotel-systems-measure-desc">
          {kpiRows.map((kpi) => {
            const definition = "definitionEn" in kpi ? (thai ? kpi.definitionTh : kpi.definitionEn || kpi.definitionTh) : thai ? kpi.definitionTh : kpi.definition;
            const period = "period" in kpi && kpi.period ? kpi.period : thai ? SYSTEMS_KPI_SAMPLE.periodTh : SYSTEMS_KPI_SAMPLE.period;
            const market = "market" in kpi && kpi.market ? kpi.market : thai ? SYSTEMS_KPI_SAMPLE.marketTh : SYSTEMS_KPI_SAMPLE.market;
            const source = "source" in kpi && kpi.source ? kpi.source : thai ? SYSTEMS_KPI_SAMPLE.sourceTh : SYSTEMS_KPI_SAMPLE.source;
            const tone = "tone" in kpi ? kpi.tone : kpi.dataStatus === "not-configured" ? "amber" : kpi.dataStatus === "sample" ? "yellow" : "green";
            const unit = "unitTh" in kpi && thai ? kpi.unitTh : kpi.unit;
            return (
              <article key={kpi.id} className={`kpi-systems-card is-${tone}`}>
                <h3 className="kpi-latin">{thai ? kpi.nameTh : kpi.nameEn}</h3>
                <p>{definition}</p>
                <small className="kpi-latin">{unit}</small>
                <small className="kpi-latin">{kpi.dataStatus === "not-configured" ? (thai ? "ยังไม่เชื่อมข้อมูล" : "Not configured") : kpi.dataStatus}</small>
                <small>{period}</small>
                <small>{market}</small>
                <small>{source}</small>
              </article>
            );
          })}
        </div>
      </section>

      <section className="kpi-systems-related">
        <div className="kpi-section">
          <h2 className="kpi-h2">{fromCms && cms?.related.title.trim() ? cms.related.title : t.relatedTitle}</h2>
          <HotelSystemsRelatedVisual locale={locale} src={cms.related.visual.src} />
          <div className="kpi-systems-related-grid">
            {related.map((card) => (
              <Link key={card.id} href={card.href} className="kpi-systems-related-card">
                <h3>{card.title}</h3>
                <p>{card.body}</p>
                <span className="kpi-latin">{card.cta}</span>
              </Link>
            ))}
          </div>
          <aside className="kpi-systems-closer kpi-systems-card">
            <h3>
              {(() => {
                const value = fromCms ? cms.related.closerTitle.trim() : "";
                if (!value || value === "คุยเรื่องระบบโรงแรม" || value === "Talk about hotel systems") return t.closerTitle;
                return value;
              })()}
            </h3>
            <p>
              {systemsHeroText(fromCms ? cms.related.closerBody : "", t.closerBody, [
                "คุณไม่จำเป็นต้องรู้ก่อนว่าต้องเปลี่ยนระบบหรือไม่ เพียงเล่าระบบที่ใช้อยู่และปัญหาที่พบ",
                "You do not need to know in advance whether the system must change. Tell us the systems in use and the problem.",
              ])}
            </p>
            <a
              href={closerHref}
              className="kpi-button kpi-systems-closer-cta bg-[#a2dc25] text-[#1a3a02]"
            >
              {systemsHeroText(fromCms ? cms.related.closerCta : "", t.closerCta, [
                "ให้ทีมตรวจโครงสร้างระบบโรงแรม",
                "Ask the team to review the hotel system setup",
                "ส่งข้อความถึงทีม",
                "Send to the team",
              ])}{" "}
              <span aria-hidden="true">↗</span>
            </a>
          </aside>
        </div>
      </section>

      <HotelSystemsEnquiry locale={locale} visualSrc={cms.form.visual.src} helper={fromCms ? cms.form : undefined} />
      <PageFaqs items={faqItems} locale={locale} sectionId="hotel-systems-faq" />
      <HotelSystemsStickyCta
        label={systemsHeroText(fromCms ? cms.form.submit : "", t.closerCta, [
          "ให้ทีมตรวจโครงสร้างระบบโรงแรม",
          "Ask the team to review the hotel system setup",
          "ส่งข้อความถึงทีม",
          "Send to the team",
        ])}
      />
    </div>
  );

  if (embedded) return inner;
  return (
    <SiteShell locale={locale} route={localizePath("/solutions/hotel-systems-implementation", locale)} hideFaqs>
      {inner}
    </SiteShell>
  );
}
