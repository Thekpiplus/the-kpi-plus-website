import { Fragment } from "react";
import {
  INDEPENDENT_ASSESSMENT_EVIDENCE,
  INDEPENDENT_ASSESSMENT_PANELS,
  INDEPENDENT_ASSESSMENT_VISUAL,
  INDEPENDENT_DELIVERABLES,
  INDEPENDENT_DELIVERABLES_BOUNDARY,
  INDEPENDENT_DELIVERABLES_COLUMNS,
  INDEPENDENT_DELIVERABLES_VISUAL,
  INDEPENDENT_ENQUIRY_FLOW,
  INDEPENDENT_ENQUIRY_VISUAL,
  INDEPENDENT_FIT_COLUMNS,
  INDEPENDENT_FIT_SCENARIOS,
  INDEPENDENT_FIT_VISUAL,
  INDEPENDENT_HERO_REVIEW,
  INDEPENDENT_HERO_VISUAL,
  INDEPENDENT_MODEL_STEPS,
  INDEPENDENT_MODEL_VISUAL,
  INDEPENDENT_OPERATING_FLOW,
  INDEPENDENT_CADENCE,
  INDEPENDENT_PLAN,
  INDEPENDENT_PLAN_VISUAL,
  INDEPENDENT_RELATED_VISUAL,
  INDEPENDENT_SCOPE_ROWS,
  INDEPENDENT_SCOPE_VISUAL,
  INDEPENDENT_SERVICES_VISUAL,
  INDEPENDENT_WORKFLOW,
  INDEPENDENT_WORKFLOW_APPROVALS,
  INDEPENDENT_WORKFLOW_VISUAL,
  INDEPENDENT_WORKSTREAMS,
  independentSampleLabel,
} from "@/lib/independent-hotel";
import type { Locale } from "@/lib/seo";
import { IndependentVisualFrame } from "./IndependentVisualFrame";

export function IndependentHeroVisual({
  locale,
  src,
  alt,
  status,
  label,
  caption,
}: {
  locale: Locale;
  src?: string;
  alt?: string;
  status?: string;
  label?: string;
  caption?: string;
}) {
  const thai = locale === "th";
  return (
    <IndependentVisualFrame
      locale={locale}
      src={src}
      alt={alt || (thai ? INDEPENDENT_HERO_VISUAL.altTh : INDEPENDENT_HERO_VISUAL.altEn)}
      label={label?.trim() || (thai ? INDEPENDENT_HERO_VISUAL.labelTh : INDEPENDENT_HERO_VISUAL.labelEn)}
      caption={caption?.trim() || (thai ? INDEPENDENT_HERO_VISUAL.captionTh : INDEPENDENT_HERO_VISUAL.captionEn)}
      meta={thai ? INDEPENDENT_HERO_VISUAL.metaTh : INDEPENDENT_HERO_VISUAL.metaEn}
      status={status || INDEPENDENT_HERO_VISUAL.status}
      width={INDEPENDENT_HERO_VISUAL.displayWidth}
      height={INDEPENDENT_HERO_VISUAL.displayHeight}
      variant="hero"
      eager
    >
      <div className="ihm-hero-mock" role="img" aria-label={thai ? INDEPENDENT_HERO_VISUAL.altTh : INDEPENDENT_HERO_VISUAL.altEn}>
        <span className="ihm-visual-badge">{independentSampleLabel(locale)}</span>
        <p className="ihm-mock-kicker kpi-latin">Owner / GM · Hotel Team Review</p>
        <p className="ihm-mock-title">{thai ? "ตัวอย่างการทบทวนกับเจ้าของ GM และทีมโรงแรม" : "Sample Owner/GM and Hotel Team Review"}</p>
        <ul className="ihm-hero-reviews">
          {INDEPENDENT_HERO_REVIEW.map((item) => (
            <li key={item.id}>
              <span className="kpi-latin">{item.num}</span>
              <strong>{thai ? item.titleTh : item.titleEn}</strong>
              <small>{thai ? item.bodyTh : item.bodyEn}</small>
            </li>
          ))}
        </ul>
        <p className="ihm-hero-context">
          {thai ? "บริบทดำเนินงานโรงแรม · ตัวอย่าง ไม่ใช่โครงการลูกค้าจริง" : "Hotel operating context · Sample, not a live client project"}
        </p>
      </div>
    </IndependentVisualFrame>
  );
}

export function IndependentAssessmentVisual({ locale, src }: { locale: Locale; src?: string }) {
  const thai = locale === "th";
  return (
    <IndependentVisualFrame
      locale={locale}
      src={src}
      alt={thai ? INDEPENDENT_ASSESSMENT_VISUAL.altTh : INDEPENDENT_ASSESSMENT_VISUAL.altEn}
      label={thai ? INDEPENDENT_ASSESSMENT_VISUAL.labelTh : INDEPENDENT_ASSESSMENT_VISUAL.labelEn}
      caption={thai ? INDEPENDENT_ASSESSMENT_VISUAL.captionTh : INDEPENDENT_ASSESSMENT_VISUAL.captionEn}
      meta={thai ? INDEPENDENT_ASSESSMENT_VISUAL.metaTh : INDEPENDENT_ASSESSMENT_VISUAL.metaEn}
      status={INDEPENDENT_ASSESSMENT_VISUAL.status}
      width={INDEPENDENT_ASSESSMENT_VISUAL.displayWidth}
      height={INDEPENDENT_ASSESSMENT_VISUAL.displayHeight}
      variant="assessment"
      badge={thai ? INDEPENDENT_ASSESSMENT_VISUAL.metaTh : INDEPENDENT_ASSESSMENT_VISUAL.metaEn}
    >
      <div className="ihm-board-mock" role="img" aria-label={thai ? INDEPENDENT_ASSESSMENT_VISUAL.altTh : INDEPENDENT_ASSESSMENT_VISUAL.altEn}>
        <span className="ihm-visual-badge">{thai ? INDEPENDENT_ASSESSMENT_VISUAL.metaTh : INDEPENDENT_ASSESSMENT_VISUAL.metaEn}</span>
        <p className="ihm-mock-kicker kpi-latin">Property Walkthrough · Operations Review · Management Assessment</p>
        <p className="ihm-mock-title">{thai ? "ตัวอย่าง Independent Hotel Assessment" : "Sample Independent Hotel Assessment"}</p>
        <ul className="ihm-assessment-panels">
          {INDEPENDENT_ASSESSMENT_PANELS.map((row) => (
            <li key={row.id}>
              <span className="kpi-latin">{row.num}</span>
              <strong>{thai ? row.titleTh : row.titleEn}</strong>
              <small>{thai ? row.bodyTh : row.bodyEn}</small>
            </li>
          ))}
        </ul>
        <ul className="ihm-assessment-evidence">
          {INDEPENDENT_ASSESSMENT_EVIDENCE.map((item) => (
            <li key={item.id}>{thai ? item.th : item.en}</li>
          ))}
        </ul>
      </div>
    </IndependentVisualFrame>
  );
}

export function IndependentServicesVisual({ locale, src }: { locale: Locale; src?: string }) {
  const thai = locale === "th";
  return (
    <IndependentVisualFrame
      locale={locale}
      src={src}
      alt={thai ? INDEPENDENT_SERVICES_VISUAL.altTh : INDEPENDENT_SERVICES_VISUAL.altEn}
      label={thai ? INDEPENDENT_SERVICES_VISUAL.labelTh : INDEPENDENT_SERVICES_VISUAL.labelEn}
      caption={thai ? INDEPENDENT_SERVICES_VISUAL.captionTh : INDEPENDENT_SERVICES_VISUAL.captionEn}
      meta={thai ? INDEPENDENT_SERVICES_VISUAL.metaTh : INDEPENDENT_SERVICES_VISUAL.metaEn}
      status={INDEPENDENT_SERVICES_VISUAL.status}
      width={INDEPENDENT_SERVICES_VISUAL.displayWidth}
      height={INDEPENDENT_SERVICES_VISUAL.displayHeight}
      variant="operating"
      badge={thai ? INDEPENDENT_SERVICES_VISUAL.metaTh : INDEPENDENT_SERVICES_VISUAL.metaEn}
    >
      <div className="ihm-operating-model" role="img" aria-label={thai ? INDEPENDENT_SERVICES_VISUAL.altTh : INDEPENDENT_SERVICES_VISUAL.altEn}>
        <span className="ihm-visual-badge">{thai ? INDEPENDENT_SERVICES_VISUAL.metaTh : INDEPENDENT_SERVICES_VISUAL.metaEn}</span>
        <p className="ihm-mock-kicker kpi-latin">Independent Hotel Operating Model</p>
        <p className="ihm-mock-title">{thai ? "ลำดับงานที่เชื่อมกัน ตามขอบเขตที่โรงแรมอนุมัติ" : "A connected sequence, within the scope the hotel approves"}</p>
        <ol className="ihm-operating-flow">
          {INDEPENDENT_OPERATING_FLOW.map((step, index) => (
            <li key={step.id}>
              <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
              <strong>{thai ? step.th : step.en}</strong>
            </li>
          ))}
        </ol>
        <ul className="ihm-operating-streams">
          {INDEPENDENT_WORKSTREAMS.map((stream) => (
            <li key={stream.id}>
              <span className="kpi-latin">{stream.num}</span>
              <strong>{thai ? stream.titleTh : stream.titleEn}</strong>
            </li>
          ))}
        </ul>
      </div>
    </IndependentVisualFrame>
  );
}

export function IndependentModelVisual({ locale, src }: { locale: Locale; src?: string }) {
  const thai = locale === "th";
  return (
    <IndependentVisualFrame
      locale={locale}
      src={src}
      alt={thai ? INDEPENDENT_MODEL_VISUAL.altTh : INDEPENDENT_MODEL_VISUAL.altEn}
      label={thai ? INDEPENDENT_MODEL_VISUAL.labelTh : INDEPENDENT_MODEL_VISUAL.labelEn}
      caption={thai ? INDEPENDENT_MODEL_VISUAL.captionTh : INDEPENDENT_MODEL_VISUAL.captionEn}
      meta={thai ? INDEPENDENT_MODEL_VISUAL.metaTh : INDEPENDENT_MODEL_VISUAL.metaEn}
      status={INDEPENDENT_MODEL_VISUAL.status}
      width={INDEPENDENT_MODEL_VISUAL.displayWidth}
      height={INDEPENDENT_MODEL_VISUAL.displayHeight}
      variant="wide"
    >
      <div className="ihm-board-mock" role="img" aria-label={thai ? INDEPENDENT_MODEL_VISUAL.altTh : INDEPENDENT_MODEL_VISUAL.altEn}>
        <span className="ihm-visual-badge">{independentSampleLabel(locale)}</span>
        <p className="ihm-mock-title kpi-latin">Diagnose → Align → Coordinate → Review → Adjust</p>
        <ol>
          {INDEPENDENT_MODEL_STEPS.map((step) => (
            <li key={step.id}>
              <span className="kpi-latin">{step.label}</span>
              <small className="kpi-latin">{step.output}</small>
            </li>
          ))}
        </ol>
      </div>
    </IndependentVisualFrame>
  );
}

export function IndependentDeliverablesVisual({ locale, src }: { locale: Locale; src?: string }) {
  const thai = locale === "th";
  return (
    <IndependentVisualFrame
      locale={locale}
      src={src}
      alt={thai ? INDEPENDENT_DELIVERABLES_VISUAL.altTh : INDEPENDENT_DELIVERABLES_VISUAL.altEn}
      label={thai ? INDEPENDENT_DELIVERABLES_VISUAL.labelTh : INDEPENDENT_DELIVERABLES_VISUAL.labelEn}
      caption={thai ? INDEPENDENT_DELIVERABLES_VISUAL.captionTh : INDEPENDENT_DELIVERABLES_VISUAL.captionEn}
      meta={thai ? INDEPENDENT_DELIVERABLES_VISUAL.metaTh : INDEPENDENT_DELIVERABLES_VISUAL.metaEn}
      status={INDEPENDENT_DELIVERABLES_VISUAL.status}
      width={INDEPENDENT_DELIVERABLES_VISUAL.displayWidth}
      height={INDEPENDENT_DELIVERABLES_VISUAL.displayHeight}
      variant="deliverables"
      badge={thai ? INDEPENDENT_DELIVERABLES_VISUAL.metaTh : INDEPENDENT_DELIVERABLES_VISUAL.metaEn}
    >
      <div className="ihm-deliverables-model" role="img" aria-label={thai ? INDEPENDENT_DELIVERABLES_VISUAL.altTh : INDEPENDENT_DELIVERABLES_VISUAL.altEn}>
        <span className="ihm-visual-badge">{thai ? INDEPENDENT_DELIVERABLES_VISUAL.metaTh : INDEPENDENT_DELIVERABLES_VISUAL.metaEn}</span>
        <p className="ihm-mock-kicker kpi-latin">Independent Hotel Management Deliverables — Sample</p>
        <p className="ihm-mock-title">{thai ? "เอกสารที่ส่งมอบ และจุดที่โรงแรมอนุมัติ" : "Named deliverables and hotel approval points"}</p>
        <div className="ihm-deliverables-grid">
          <p className="kpi-latin">{INDEPENDENT_DELIVERABLES_COLUMNS.area.en}</p>
          <p className="kpi-latin">{INDEPENDENT_DELIVERABLES_COLUMNS.deliverable.en}</p>
          <p className="kpi-latin">{INDEPENDENT_DELIVERABLES_COLUMNS.approval.en}</p>
          {INDEPENDENT_DELIVERABLES.map((row) => (
            <Fragment key={row.id}>
              <strong>{thai ? row.areaTh : row.areaEn}</strong>
              <span className="kpi-latin">{row.deliverable}</span>
              <span>{thai ? row.approvalTh : row.approvalEn}</span>
            </Fragment>
          ))}
        </div>
        <ul className="ihm-deliverables-boundary">
          <li>{thai ? INDEPENDENT_DELIVERABLES_BOUNDARY.supportTitle.th : INDEPENDENT_DELIVERABLES_BOUNDARY.supportTitle.en}</li>
          <li>{thai ? INDEPENDENT_DELIVERABLES_BOUNDARY.hotelTitle.th : INDEPENDENT_DELIVERABLES_BOUNDARY.hotelTitle.en}</li>
        </ul>
      </div>
    </IndependentVisualFrame>
  );
}

export function IndependentWorkflowVisual({ locale, src }: { locale: Locale; src?: string }) {
  const thai = locale === "th";
  return (
    <IndependentVisualFrame
      locale={locale}
      src={src}
      alt={thai ? INDEPENDENT_WORKFLOW_VISUAL.altTh : INDEPENDENT_WORKFLOW_VISUAL.altEn}
      label={thai ? INDEPENDENT_WORKFLOW_VISUAL.labelTh : INDEPENDENT_WORKFLOW_VISUAL.labelEn}
      caption={thai ? INDEPENDENT_WORKFLOW_VISUAL.captionTh : INDEPENDENT_WORKFLOW_VISUAL.captionEn}
      meta={thai ? INDEPENDENT_WORKFLOW_VISUAL.metaTh : INDEPENDENT_WORKFLOW_VISUAL.metaEn}
      status={INDEPENDENT_WORKFLOW_VISUAL.status}
      width={INDEPENDENT_WORKFLOW_VISUAL.displayWidth}
      height={INDEPENDENT_WORKFLOW_VISUAL.displayHeight}
      variant="workflow"
      badge={thai ? INDEPENDENT_WORKFLOW_VISUAL.metaTh : INDEPENDENT_WORKFLOW_VISUAL.metaEn}
    >
      <div className="ihm-workflow-model" role="img" aria-label={thai ? INDEPENDENT_WORKFLOW_VISUAL.altTh : INDEPENDENT_WORKFLOW_VISUAL.altEn}>
        <span className="ihm-visual-badge">{thai ? INDEPENDENT_WORKFLOW_VISUAL.metaTh : INDEPENDENT_WORKFLOW_VISUAL.metaEn}</span>
        <p className="ihm-mock-kicker kpi-latin">Assess → Align → Operate</p>
        <p className="ihm-mock-title">{thai ? "ไทม์ไลน์ จุดส่งมอบ และผลลัพธ์" : "Timeline, handoff map, and deliverables"}</p>
        <ol className="ihm-workflow-timeline">
          {INDEPENDENT_WORKFLOW.map((step) => (
            <li key={step.id}>
              <span className="kpi-latin">{step.num} {step.label}</span>
              <strong>{thai ? step.titleTh : step.titleEn}</strong>
              <small className="kpi-latin">{step.output}</small>
            </li>
          ))}
        </ol>
        <ul className="ihm-workflow-handoff">
          {INDEPENDENT_WORKFLOW.map((step) => (
            <li key={`${step.id}-handoff`}>
              <span className="kpi-latin">{step.label}</span>
              <strong>{thai ? step.ownerTh : step.ownerEn}</strong>
            </li>
          ))}
        </ul>
        <ul className="ihm-workflow-approvals">
          {INDEPENDENT_WORKFLOW_APPROVALS.map((item) => (
            <li key={item.id}>{thai ? item.th : item.en}</li>
          ))}
        </ul>
      </div>
    </IndependentVisualFrame>
  );
}

export function IndependentFitVisual({ locale, src }: { locale: Locale; src?: string }) {
  const thai = locale === "th";
  return (
    <IndependentVisualFrame
      locale={locale}
      src={src}
      alt={thai ? INDEPENDENT_FIT_VISUAL.altTh : INDEPENDENT_FIT_VISUAL.altEn}
      label={thai ? INDEPENDENT_FIT_VISUAL.labelTh : INDEPENDENT_FIT_VISUAL.labelEn}
      caption={thai ? INDEPENDENT_FIT_VISUAL.captionTh : INDEPENDENT_FIT_VISUAL.captionEn}
      meta={thai ? INDEPENDENT_FIT_VISUAL.metaTh : INDEPENDENT_FIT_VISUAL.metaEn}
      status={INDEPENDENT_FIT_VISUAL.status}
      width={INDEPENDENT_FIT_VISUAL.displayWidth}
      height={INDEPENDENT_FIT_VISUAL.displayHeight}
      variant="fit"
      badge={thai ? INDEPENDENT_FIT_VISUAL.metaTh : INDEPENDENT_FIT_VISUAL.metaEn}
    >
      <div className="ihm-fit-model" role="img" aria-label={thai ? INDEPENDENT_FIT_VISUAL.altTh : INDEPENDENT_FIT_VISUAL.altEn}>
        <span className="ihm-visual-badge">{thai ? INDEPENDENT_FIT_VISUAL.metaTh : INDEPENDENT_FIT_VISUAL.metaEn}</span>
        <p className="ihm-mock-kicker kpi-latin">Decision Matrix — Sample</p>
        <p className="ihm-mock-title">{thai ? "ตัวอย่างสถานการณ์ที่มักคุยกัน ไม่ใช่ผลการวินิจฉัย" : "Sample situations often discussed. Not a diagnosis."}</p>
        <div className="ihm-fit-grid">
          <p className="kpi-latin">{INDEPENDENT_FIT_COLUMNS.situation.en}</p>
          <p className="kpi-latin">{INDEPENDENT_FIT_COLUMNS.support.en}</p>
          <p className="kpi-latin">{INDEPENDENT_FIT_COLUMNS.output.en}</p>
          {INDEPENDENT_FIT_SCENARIOS.map((row) => (
            <Fragment key={row.id}>
              <strong>{thai ? row.situationTh : row.situationEn}</strong>
              <span>{thai ? row.supportTh : row.supportEn}</span>
              <span className="kpi-latin">{row.output}</span>
            </Fragment>
          ))}
        </div>
      </div>
    </IndependentVisualFrame>
  );
}

export function IndependentScopeVisual({ locale, src }: { locale: Locale; src?: string }) {
  const thai = locale === "th";
  return (
    <IndependentVisualFrame
      locale={locale}
      src={src}
      alt={thai ? INDEPENDENT_SCOPE_VISUAL.altTh : INDEPENDENT_SCOPE_VISUAL.altEn}
      label={thai ? INDEPENDENT_SCOPE_VISUAL.labelTh : INDEPENDENT_SCOPE_VISUAL.labelEn}
      caption={thai ? INDEPENDENT_SCOPE_VISUAL.captionTh : INDEPENDENT_SCOPE_VISUAL.captionEn}
      meta={thai ? INDEPENDENT_SCOPE_VISUAL.metaTh : INDEPENDENT_SCOPE_VISUAL.metaEn}
      status={INDEPENDENT_SCOPE_VISUAL.status}
      width={INDEPENDENT_SCOPE_VISUAL.displayWidth}
      height={INDEPENDENT_SCOPE_VISUAL.displayHeight}
      variant="wide"
    >
      <div className="ihm-board-mock" role="img" aria-label={thai ? INDEPENDENT_SCOPE_VISUAL.altTh : INDEPENDENT_SCOPE_VISUAL.altEn}>
        <span className="ihm-visual-badge">{independentSampleLabel(locale)}</span>
        <p className="ihm-mock-title kpi-latin">Scope / Approval / Hotel</p>
        <ol>
          {INDEPENDENT_SCOPE_ROWS.map((row) => (
            <li key={row.id}>
              <strong>{thai ? row.titleTh : row.titleEn}</strong>
            </li>
          ))}
        </ol>
      </div>
    </IndependentVisualFrame>
  );
}

export function IndependentPlanVisual({ locale, src }: { locale: Locale; src?: string }) {
  const thai = locale === "th";
  return (
    <IndependentVisualFrame
      locale={locale}
      src={src}
      alt={thai ? INDEPENDENT_PLAN_VISUAL.altTh : INDEPENDENT_PLAN_VISUAL.altEn}
      label={thai ? INDEPENDENT_PLAN_VISUAL.labelTh : INDEPENDENT_PLAN_VISUAL.labelEn}
      caption={thai ? INDEPENDENT_PLAN_VISUAL.captionTh : INDEPENDENT_PLAN_VISUAL.captionEn}
      meta={thai ? INDEPENDENT_PLAN_VISUAL.metaTh : INDEPENDENT_PLAN_VISUAL.metaEn}
      status={INDEPENDENT_PLAN_VISUAL.status}
      width={INDEPENDENT_PLAN_VISUAL.displayWidth}
      height={INDEPENDENT_PLAN_VISUAL.displayHeight}
      variant="plan"
      badge={thai ? INDEPENDENT_PLAN_VISUAL.metaTh : INDEPENDENT_PLAN_VISUAL.metaEn}
    >
      <div className="ihm-plan-model" role="img" aria-label={thai ? INDEPENDENT_PLAN_VISUAL.altTh : INDEPENDENT_PLAN_VISUAL.altEn}>
        <span className="ihm-visual-badge">Sample plan</span>
        <p className="ihm-mock-kicker kpi-latin">30/60/90-Day Hotel Management Plan — Sample</p>
        <p className="ihm-mock-title">{thai ? "แผนตัวอย่างสำหรับจัดลำดับงาน ไม่ใช่ผลที่การันตี" : "A sample sequence of work. Not a promised result."}</p>
        <ol className="ihm-plan-phases">
          {INDEPENDENT_PLAN.map((step) => (
            <li key={step.id}>
              <span className="kpi-latin">{step.label}</span>
              <strong className="kpi-latin">{step.output}</strong>
            </li>
          ))}
        </ol>
        <ul className="ihm-plan-cadence">
          {INDEPENDENT_CADENCE.map((item) => (
            <li key={item.id}>{item.label}</li>
          ))}
        </ul>
      </div>
    </IndependentVisualFrame>
  );
}

export function IndependentRelatedVisual({ locale, src }: { locale: Locale; src?: string }) {
  const thai = locale === "th";
  return (
    <IndependentVisualFrame
      locale={locale}
      src={src}
      alt={thai ? INDEPENDENT_RELATED_VISUAL.altTh : INDEPENDENT_RELATED_VISUAL.altEn}
      label={thai ? INDEPENDENT_RELATED_VISUAL.labelTh : INDEPENDENT_RELATED_VISUAL.labelEn}
      caption={thai ? INDEPENDENT_RELATED_VISUAL.captionTh : INDEPENDENT_RELATED_VISUAL.captionEn}
      meta={thai ? INDEPENDENT_RELATED_VISUAL.metaTh : INDEPENDENT_RELATED_VISUAL.metaEn}
      status={INDEPENDENT_RELATED_VISUAL.status}
      width={INDEPENDENT_RELATED_VISUAL.displayWidth}
      height={INDEPENDENT_RELATED_VISUAL.displayHeight}
      variant="related"
    >
      <div className="ihm-board-mock" role="img" aria-label={thai ? INDEPENDENT_RELATED_VISUAL.altTh : INDEPENDENT_RELATED_VISUAL.altEn}>
        <span className="ihm-visual-badge">{independentSampleLabel(locale)}</span>
        <p className="ihm-mock-title kpi-latin">Related Hotel Work</p>
      </div>
    </IndependentVisualFrame>
  );
}

export function IndependentEnquiryVisual({ locale, src }: { locale: Locale; src?: string }) {
  const thai = locale === "th";
  return (
    <IndependentVisualFrame
      locale={locale}
      src={src}
      alt={thai ? INDEPENDENT_ENQUIRY_VISUAL.altTh : INDEPENDENT_ENQUIRY_VISUAL.altEn}
      label={thai ? INDEPENDENT_ENQUIRY_VISUAL.labelTh : INDEPENDENT_ENQUIRY_VISUAL.labelEn}
      caption={thai ? INDEPENDENT_ENQUIRY_VISUAL.captionTh : INDEPENDENT_ENQUIRY_VISUAL.captionEn}
      meta={thai ? INDEPENDENT_ENQUIRY_VISUAL.metaTh : INDEPENDENT_ENQUIRY_VISUAL.metaEn}
      status={INDEPENDENT_ENQUIRY_VISUAL.status}
      width={INDEPENDENT_ENQUIRY_VISUAL.displayWidth}
      height={INDEPENDENT_ENQUIRY_VISUAL.displayHeight}
      variant="enquiry"
      badge={thai ? INDEPENDENT_ENQUIRY_VISUAL.labelTh : INDEPENDENT_ENQUIRY_VISUAL.labelEn}
    >
      <div className="ihm-enquiry-process" role="img" aria-label={thai ? INDEPENDENT_ENQUIRY_VISUAL.altTh : INDEPENDENT_ENQUIRY_VISUAL.altEn}>
        <span className="ihm-visual-badge">{thai ? INDEPENDENT_ENQUIRY_VISUAL.labelTh : INDEPENDENT_ENQUIRY_VISUAL.labelEn}</span>
        <p className="ihm-enquiry-path kpi-latin">Context → Assessment → Scope → Operating Plan</p>
        <ol className="ihm-enquiry-flow">
          {INDEPENDENT_ENQUIRY_FLOW.map((step, index) => (
            <li key={step.id}>
              <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
              <strong>{thai ? step.th : step.en}</strong>
            </li>
          ))}
        </ol>
      </div>
    </IndependentVisualFrame>
  );
}
