import { Fragment } from "react";
import {
  SYSTEMS_ASSESSMENT_VISUAL,
  SYSTEMS_REVIEW_CHECKS,
  SYSTEMS_REVIEW_COMPARE,
  SYSTEMS_DELIVERABLES,
  SYSTEMS_DELIVERABLES_BOUNDARY,
  SYSTEMS_DELIVERABLES_COLUMNS,
  SYSTEMS_DELIVERABLES_VISUAL,
  SYSTEMS_ENQUIRY_FLOW,
  SYSTEMS_ENQUIRY_VISUAL,
  SYSTEMS_FIT_COLUMNS,
  SYSTEMS_FIT_SCENARIOS,
  SYSTEMS_FIT_VISUAL,
  SYSTEMS_HERO_FLOW,
  SYSTEMS_HERO_LEGEND,
  SYSTEMS_HERO_VISUAL,
  SYSTEMS_MODEL_STEPS,
  SYSTEMS_MODEL_VISUAL,
  SYSTEMS_OPERATING_FLOW,
  SYSTEMS_CADENCE,
  SYSTEMS_PLAN,
  SYSTEMS_PLAN_VISUAL,
  SYSTEMS_RELATED_VISUAL,
  SYSTEMS_SCOPE_ROWS,
  SYSTEMS_SCOPE_VISUAL,
  SYSTEMS_SERVICES_VISUAL,
  SYSTEMS_WORKFLOW,
  SYSTEMS_WORKFLOW_APPROVALS,
  SYSTEMS_WORKFLOW_VISUAL,
  SYSTEMS_WORKSTREAMS,
  systemsReviewStatus,
  systemsSampleLabel,
} from "@/lib/hotel-systems";
import type { Locale } from "@/lib/seo";
import { HotelSystemsVisualFrame } from "./HotelSystemsVisualFrame";

export function HotelSystemsHeroVisual({
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
    <HotelSystemsVisualFrame
      locale={locale}
      src={src}
      alt={alt || (thai ? SYSTEMS_HERO_VISUAL.altTh : SYSTEMS_HERO_VISUAL.altEn)}
      label={label?.trim() || (thai ? SYSTEMS_HERO_VISUAL.labelTh : SYSTEMS_HERO_VISUAL.labelEn)}
      caption={caption?.trim() || (thai ? SYSTEMS_HERO_VISUAL.captionTh : SYSTEMS_HERO_VISUAL.captionEn)}
      meta={thai ? SYSTEMS_HERO_VISUAL.metaTh : SYSTEMS_HERO_VISUAL.metaEn}
      status={status || SYSTEMS_HERO_VISUAL.status}
      width={SYSTEMS_HERO_VISUAL.displayWidth}
      height={SYSTEMS_HERO_VISUAL.displayHeight}
      variant="hero"
      eager
    >
      <div className="hsi-hero-mock" role="img" aria-label={thai ? SYSTEMS_HERO_VISUAL.altTh : SYSTEMS_HERO_VISUAL.altEn}>
        <div className="hsi-hero-desk">
          <span className="hsi-visual-badge">{thai ? "ตัวอย่าง Hotel System Architecture และ Data Flow" : "Sample Architecture"}</span>
          <p className="hsi-mock-kicker kpi-latin">Website → Booking Engine → PMS → Channel Manager → OTA → Reporting → Hotel Team</p>
          <p className="hsi-mock-title">{thai ? "ตัวอย่างการทบทวนเส้นทางข้อมูล" : "Sample data-flow review"}</p>
          <ol className="hsi-hero-flow">
            {SYSTEMS_HERO_FLOW.map((item) => (
              <li key={item.id} className={`is-${SYSTEMS_HERO_LEGEND.find((row) => row.id === item.status)?.tone || "yellow"}`}>
                <span className="kpi-latin">{item.num}</span>
                <strong className="kpi-latin">{thai ? item.titleTh : item.titleEn}</strong>
                <em className={`hsi-status is-${SYSTEMS_HERO_LEGEND.find((row) => row.id === item.status)?.tone || "yellow"}`}>{item.statusLabel}</em>
                <small>{thai ? item.bodyTh : item.bodyEn}</small>
              </li>
            ))}
          </ol>
        </div>
        <ul className="hsi-hero-legend" aria-label={thai ? "คำอธิบายสถานะตัวอย่าง ไม่ใช่สถานะเชื่อมต่อที่ตรวจแล้ว" : "Sample status legend. Not a verified integration status."}>
          {SYSTEMS_HERO_LEGEND.map((item) => (
            <li key={item.id}>
              <span className={`hsi-status is-${item.tone}`}>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </HotelSystemsVisualFrame>
  );
}

export function HotelSystemsReviewVisual({
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
  const sample = status !== "approved" && status !== "real";
  return (
    <HotelSystemsVisualFrame
      locale={locale}
      src={src}
      alt={alt || (thai ? SYSTEMS_ASSESSMENT_VISUAL.altTh : SYSTEMS_ASSESSMENT_VISUAL.altEn)}
      label={label?.trim() || (thai ? SYSTEMS_ASSESSMENT_VISUAL.labelTh : SYSTEMS_ASSESSMENT_VISUAL.labelEn)}
      caption={caption?.trim() || (thai ? SYSTEMS_ASSESSMENT_VISUAL.captionTh : SYSTEMS_ASSESSMENT_VISUAL.captionEn)}
      meta={thai ? SYSTEMS_ASSESSMENT_VISUAL.metaTh : SYSTEMS_ASSESSMENT_VISUAL.metaEn}
      status={status || SYSTEMS_ASSESSMENT_VISUAL.status}
      width={SYSTEMS_ASSESSMENT_VISUAL.displayWidth}
      height={SYSTEMS_ASSESSMENT_VISUAL.displayHeight}
      variant="assessment"
      badge={sample ? "Sample review framework" : undefined}
    >
      <div className="hsi-review-mock" role="img" aria-label={thai ? SYSTEMS_ASSESSMENT_VISUAL.altTh : SYSTEMS_ASSESSMENT_VISUAL.altEn}>
        {sample ? <span className="hsi-visual-badge">Sample review framework</span> : null}
        <p className="hsi-mock-kicker kpi-latin">Data Consistency Audit · Redacted</p>
        <p className="hsi-mock-title">{thai ? "ตัวอย่างการเทียบห้อง ราคา และห้องว่าง" : "Room / rate / availability comparison"}</p>
        <table className="hsi-review-compare">
          <caption className="sr-only">{thai ? "ตารางเทียบข้อมูลตัวอย่างแบบปกปิด ไม่ใช่ผลตรวจโรงแรมจริง" : "Redacted sample comparison. Not a live hotel diagnosis."}</caption>
          <thead>
            <tr>
              <th scope="col">{thai ? "รายการ" : "Item"}</th>
              <th scope="col" className="kpi-latin">PMS</th>
              <th scope="col" className="kpi-latin">CM</th>
              <th scope="col" className="kpi-latin">OTA/BE</th>
              <th scope="col">{thai ? "สถานะ" : "Status"}</th>
            </tr>
          </thead>
          <tbody>
            {SYSTEMS_REVIEW_COMPARE.map((row) => {
              const status = systemsReviewStatus(row.status);
              return (
                <tr key={row.id}>
                  <th scope="row">{thai ? row.itemTh : row.itemEn}</th>
                  <td className="kpi-latin">{row.pms}</td>
                  <td className="kpi-latin">{row.cm}</td>
                  <td className="kpi-latin">{row.be}</td>
                  <td>
                    <em className={`hsi-status is-${status.tone}`}>{status.label}</em>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <ul className="hsi-review-checks">
          {SYSTEMS_REVIEW_CHECKS.map((item) => {
            const status = systemsReviewStatus(item.status);
            return (
              <li key={item.id}>
                <strong className="kpi-latin">{thai ? item.th : item.en}</strong>
                <span className={`hsi-status is-${status.tone}`}>{status.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </HotelSystemsVisualFrame>
  );
}

export function HotelSystemsLandscapeVisual({ locale, src }: { locale: Locale; src?: string }) {
  const thai = locale === "th";
  return (
    <HotelSystemsVisualFrame
      locale={locale}
      src={src}
      alt={thai ? SYSTEMS_SERVICES_VISUAL.altTh : SYSTEMS_SERVICES_VISUAL.altEn}
      label={thai ? SYSTEMS_SERVICES_VISUAL.labelTh : SYSTEMS_SERVICES_VISUAL.labelEn}
      caption={thai ? SYSTEMS_SERVICES_VISUAL.captionTh : SYSTEMS_SERVICES_VISUAL.captionEn}
      meta={thai ? SYSTEMS_SERVICES_VISUAL.metaTh : SYSTEMS_SERVICES_VISUAL.metaEn}
      status={SYSTEMS_SERVICES_VISUAL.status}
      width={SYSTEMS_SERVICES_VISUAL.displayWidth}
      height={SYSTEMS_SERVICES_VISUAL.displayHeight}
      variant="operating"
      badge={thai ? SYSTEMS_SERVICES_VISUAL.metaTh : SYSTEMS_SERVICES_VISUAL.metaEn}
    >
      <div className="hsi-operating-model" role="img" aria-label={thai ? SYSTEMS_SERVICES_VISUAL.altTh : SYSTEMS_SERVICES_VISUAL.altEn}>
        <span className="hsi-visual-badge">{thai ? SYSTEMS_SERVICES_VISUAL.metaTh : SYSTEMS_SERVICES_VISUAL.metaEn}</span>
        <p className="hsi-mock-kicker kpi-latin">Source of Truth · Data In · Data Out · Owner · Provider</p>
        <p className="hsi-mock-title">{thai ? "ตัวอย่าง Systems Landscape ไม่ใช่โลโก้วอลล์" : "Sample Systems Landscape — not a logo wall"}</p>
        <ol className="hsi-operating-flow">
          {SYSTEMS_OPERATING_FLOW.map((step, index) => (
            <li key={step.id}>
              <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
              <strong>{thai ? step.th : step.en}</strong>
            </li>
          ))}
        </ol>
        <ul className="hsi-operating-streams">
          {SYSTEMS_WORKSTREAMS.map((stream) => (
            <li key={stream.id}>
              <span className="kpi-latin">{stream.num}</span>
              <strong>{thai ? stream.titleTh : stream.titleEn}</strong>
            </li>
          ))}
        </ul>
      </div>
    </HotelSystemsVisualFrame>
  );
}

export function HotelSystemsBeforeAfterVisual({ locale, src }: { locale: Locale; src?: string }) {
  const thai = locale === "th";
  return (
    <HotelSystemsVisualFrame
      locale={locale}
      src={src}
      alt={thai ? SYSTEMS_MODEL_VISUAL.altTh : SYSTEMS_MODEL_VISUAL.altEn}
      label={thai ? SYSTEMS_MODEL_VISUAL.labelTh : SYSTEMS_MODEL_VISUAL.labelEn}
      caption={thai ? SYSTEMS_MODEL_VISUAL.captionTh : SYSTEMS_MODEL_VISUAL.captionEn}
      meta={thai ? SYSTEMS_MODEL_VISUAL.metaTh : SYSTEMS_MODEL_VISUAL.metaEn}
      status={SYSTEMS_MODEL_VISUAL.status}
      width={SYSTEMS_MODEL_VISUAL.displayWidth}
      height={SYSTEMS_MODEL_VISUAL.displayHeight}
      variant="wide"
    >
      <div className="hsi-board-mock" role="img" aria-label={thai ? SYSTEMS_MODEL_VISUAL.altTh : SYSTEMS_MODEL_VISUAL.altEn}>
        <span className="hsi-visual-badge">{systemsSampleLabel(locale)}</span>
        <p className="hsi-mock-title kpi-latin">Before opening · Operating · Moving systems</p>
        <ol>
          {SYSTEMS_MODEL_STEPS.map((step) => (
            <li key={step.id}>
              <span className="kpi-latin">{step.label}</span>
              <small className="kpi-latin">{step.output}</small>
            </li>
          ))}
        </ol>
      </div>
    </HotelSystemsVisualFrame>
  );
}

export function HotelSystemsReadinessVisual({ locale, src }: { locale: Locale; src?: string }) {
  const thai = locale === "th";
  return (
    <HotelSystemsVisualFrame
      locale={locale}
      src={src}
      alt={thai ? SYSTEMS_DELIVERABLES_VISUAL.altTh : SYSTEMS_DELIVERABLES_VISUAL.altEn}
      label={thai ? SYSTEMS_DELIVERABLES_VISUAL.labelTh : SYSTEMS_DELIVERABLES_VISUAL.labelEn}
      caption={thai ? SYSTEMS_DELIVERABLES_VISUAL.captionTh : SYSTEMS_DELIVERABLES_VISUAL.captionEn}
      meta={thai ? SYSTEMS_DELIVERABLES_VISUAL.metaTh : SYSTEMS_DELIVERABLES_VISUAL.metaEn}
      status={SYSTEMS_DELIVERABLES_VISUAL.status}
      width={SYSTEMS_DELIVERABLES_VISUAL.displayWidth}
      height={SYSTEMS_DELIVERABLES_VISUAL.displayHeight}
      variant="deliverables"
      badge={thai ? SYSTEMS_DELIVERABLES_VISUAL.metaTh : SYSTEMS_DELIVERABLES_VISUAL.metaEn}
    >
      <div className="hsi-deliverables-model" role="img" aria-label={thai ? SYSTEMS_DELIVERABLES_VISUAL.altTh : SYSTEMS_DELIVERABLES_VISUAL.altEn}>
        <span className="hsi-visual-badge">{thai ? SYSTEMS_DELIVERABLES_VISUAL.metaTh : SYSTEMS_DELIVERABLES_VISUAL.metaEn}</span>
        <p className="hsi-mock-kicker kpi-latin">Connected · Needs Mapping · Pending Access · Testing</p>
        <p className="hsi-mock-title">{thai ? "ตัวอย่าง Integration Readiness" : "Sample Integration Readiness"}</p>
        <div className="hsi-deliverables-grid">
          <p className="kpi-latin">{SYSTEMS_DELIVERABLES_COLUMNS.area.en}</p>
          <p className="kpi-latin">{SYSTEMS_DELIVERABLES_COLUMNS.deliverable.en}</p>
          <p className="kpi-latin">{SYSTEMS_DELIVERABLES_COLUMNS.approval.en}</p>
          {SYSTEMS_DELIVERABLES.map((row) => (
            <Fragment key={row.id}>
              <strong>{thai ? row.areaTh : row.areaEn}</strong>
              <span className="kpi-latin">{row.output}</span>
              <span>{thai ? row.actionTh : row.actionEn}</span>
            </Fragment>
          ))}
        </div>
        <ul className="hsi-deliverables-boundary">
          <li>{thai ? SYSTEMS_DELIVERABLES_BOUNDARY.supportTitle.th : SYSTEMS_DELIVERABLES_BOUNDARY.supportTitle.en}</li>
          <li>{thai ? SYSTEMS_DELIVERABLES_BOUNDARY.hotelTitle.th : SYSTEMS_DELIVERABLES_BOUNDARY.hotelTitle.en}</li>
        </ul>
      </div>
    </HotelSystemsVisualFrame>
  );
}

export function HotelSystemsWorkflowVisual({ locale, src }: { locale: Locale; src?: string }) {
  const thai = locale === "th";
  return (
    <HotelSystemsVisualFrame
      locale={locale}
      src={src}
      alt={thai ? SYSTEMS_WORKFLOW_VISUAL.altTh : SYSTEMS_WORKFLOW_VISUAL.altEn}
      label={thai ? SYSTEMS_WORKFLOW_VISUAL.labelTh : SYSTEMS_WORKFLOW_VISUAL.labelEn}
      caption={thai ? SYSTEMS_WORKFLOW_VISUAL.captionTh : SYSTEMS_WORKFLOW_VISUAL.captionEn}
      meta={thai ? SYSTEMS_WORKFLOW_VISUAL.metaTh : SYSTEMS_WORKFLOW_VISUAL.metaEn}
      status={SYSTEMS_WORKFLOW_VISUAL.status}
      width={SYSTEMS_WORKFLOW_VISUAL.displayWidth}
      height={SYSTEMS_WORKFLOW_VISUAL.displayHeight}
      variant="workflow"
      badge={thai ? SYSTEMS_WORKFLOW_VISUAL.metaTh : SYSTEMS_WORKFLOW_VISUAL.metaEn}
    >
      <div className="hsi-workflow-model" role="img" aria-label={thai ? SYSTEMS_WORKFLOW_VISUAL.altTh : SYSTEMS_WORKFLOW_VISUAL.altEn}>
        <span className="hsi-visual-badge">Hotel Systems Implementation Workflow — Sample</span>
        <p className="hsi-mock-kicker kpi-latin">DISCOVER · MAP · CONFIGURE · TEST · HANDOVER</p>
        <p className="hsi-mock-title">{thai ? "ไทม์ไลน์ จุดส่งต่อ และผลลัพธ์" : "Timeline, handoff map, and deliverables"}</p>
        <ol className="hsi-workflow-timeline">
          {SYSTEMS_WORKFLOW.map((step) => (
            <li key={step.id}>
              <span className="kpi-latin">{step.num} {step.label}</span>
              <strong>{thai ? step.titleTh : step.titleEn}</strong>
              <small className="kpi-latin">{step.output}</small>
            </li>
          ))}
        </ol>
        <ul className="hsi-workflow-handoff">
          {SYSTEMS_WORKFLOW.map((step) => (
            <li key={`${step.id}-handoff`}>
              <span className="kpi-latin">{step.label}</span>
              <strong>{thai ? step.ownerTh : step.ownerEn}</strong>
            </li>
          ))}
        </ul>
        <ul className="hsi-workflow-approvals">
          {SYSTEMS_WORKFLOW_APPROVALS.map((item) => (
            <li key={item.id}>{thai ? item.th : item.en}</li>
          ))}
        </ul>
      </div>
    </HotelSystemsVisualFrame>
  );
}

export function HotelSystemsPlatformVisual({ locale, src }: { locale: Locale; src?: string }) {
  const thai = locale === "th";
  return (
    <HotelSystemsVisualFrame
      locale={locale}
      src={src}
      alt={thai ? SYSTEMS_FIT_VISUAL.altTh : SYSTEMS_FIT_VISUAL.altEn}
      label={thai ? SYSTEMS_FIT_VISUAL.labelTh : SYSTEMS_FIT_VISUAL.labelEn}
      caption={thai ? SYSTEMS_FIT_VISUAL.captionTh : SYSTEMS_FIT_VISUAL.captionEn}
      meta={thai ? SYSTEMS_FIT_VISUAL.metaTh : SYSTEMS_FIT_VISUAL.metaEn}
      status={SYSTEMS_FIT_VISUAL.status}
      width={SYSTEMS_FIT_VISUAL.displayWidth}
      height={SYSTEMS_FIT_VISUAL.displayHeight}
      variant="fit"
      badge={thai ? SYSTEMS_FIT_VISUAL.metaTh : SYSTEMS_FIT_VISUAL.metaEn}
    >
      <div className="hsi-fit-model" role="img" aria-label={thai ? SYSTEMS_FIT_VISUAL.altTh : SYSTEMS_FIT_VISUAL.altEn}>
        <span className="hsi-visual-badge">{thai ? SYSTEMS_FIT_VISUAL.metaTh : SYSTEMS_FIT_VISUAL.metaEn}</span>
        <p className="hsi-mock-kicker kpi-latin">Examples / Subject to technical verification</p>
        <p className="hsi-mock-title">{thai ? "แผนที่หมวด ไม่ใช่โลโก้วอลล์" : "Category map, not a logo wall"}</p>
        <div className="hsi-fit-grid">
          <p className="kpi-latin">{SYSTEMS_FIT_COLUMNS.category.en}</p>
          <p className="kpi-latin">{SYSTEMS_FIT_COLUMNS.example.en}</p>
          <p className="kpi-latin">{SYSTEMS_FIT_COLUMNS.integration.en}</p>
          {SYSTEMS_FIT_SCENARIOS.map((row) => (
            <Fragment key={row.id}>
              <strong className="kpi-latin">{thai ? row.categoryTh : row.categoryEn}</strong>
              <span className="kpi-latin">{row.example}</span>
              <span className="kpi-latin">{row.integrationStatus}</span>
            </Fragment>
          ))}
        </div>
      </div>
    </HotelSystemsVisualFrame>
  );
}

export function HotelSystemsScopeVisual({ locale, src }: { locale: Locale; src?: string }) {
  const thai = locale === "th";
  return (
    <HotelSystemsVisualFrame
      locale={locale}
      src={src}
      alt={thai ? SYSTEMS_SCOPE_VISUAL.altTh : SYSTEMS_SCOPE_VISUAL.altEn}
      label={thai ? SYSTEMS_SCOPE_VISUAL.labelTh : SYSTEMS_SCOPE_VISUAL.labelEn}
      caption={thai ? SYSTEMS_SCOPE_VISUAL.captionTh : SYSTEMS_SCOPE_VISUAL.captionEn}
      meta={thai ? SYSTEMS_SCOPE_VISUAL.metaTh : SYSTEMS_SCOPE_VISUAL.metaEn}
      status={SYSTEMS_SCOPE_VISUAL.status}
      width={SYSTEMS_SCOPE_VISUAL.displayWidth}
      height={SYSTEMS_SCOPE_VISUAL.displayHeight}
      variant="wide"
    >
      <div className="hsi-board-mock" role="img" aria-label={thai ? SYSTEMS_SCOPE_VISUAL.altTh : SYSTEMS_SCOPE_VISUAL.altEn}>
        <span className="hsi-visual-badge">{systemsSampleLabel(locale)}</span>
        <p className="hsi-mock-title kpi-latin">Implementation Responsibility Matrix — Sample</p>
        <ol>
          {SYSTEMS_SCOPE_ROWS.map((row) => (
            <li key={row.id}>
              <strong>{thai ? row.titleTh : row.titleEn}</strong>
            </li>
          ))}
        </ol>
      </div>
    </HotelSystemsVisualFrame>
  );
}

export function HotelSystemsHandoverVisual({ locale, src }: { locale: Locale; src?: string }) {
  const thai = locale === "th";
  return (
    <HotelSystemsVisualFrame
      locale={locale}
      src={src}
      alt={thai ? SYSTEMS_PLAN_VISUAL.altTh : SYSTEMS_PLAN_VISUAL.altEn}
      label={thai ? SYSTEMS_PLAN_VISUAL.labelTh : SYSTEMS_PLAN_VISUAL.labelEn}
      caption={thai ? SYSTEMS_PLAN_VISUAL.captionTh : SYSTEMS_PLAN_VISUAL.captionEn}
      meta={thai ? SYSTEMS_PLAN_VISUAL.metaTh : SYSTEMS_PLAN_VISUAL.metaEn}
      status={SYSTEMS_PLAN_VISUAL.status}
      width={SYSTEMS_PLAN_VISUAL.displayWidth}
      height={SYSTEMS_PLAN_VISUAL.displayHeight}
      variant="plan"
      badge={thai ? SYSTEMS_PLAN_VISUAL.metaTh : SYSTEMS_PLAN_VISUAL.metaEn}
    >
      <div className="hsi-plan-model" role="img" aria-label={thai ? SYSTEMS_PLAN_VISUAL.altTh : SYSTEMS_PLAN_VISUAL.altEn}>
        <span className="hsi-visual-badge">Hotel Systems Handover and Ownership — Sample</span>
        <p className="hsi-mock-kicker kpi-latin">Sample handover · No credentials · Not Live</p>
        <p className="hsi-mock-title">{thai ? "ส่งมอบเมื่ออนุมัติและเอกสารครบ" : "Hand over only after approval and documentation"}</p>
        <ol className="hsi-plan-phases">
          {SYSTEMS_PLAN.map((step) => (
            <li key={step.id}>
              <span className="kpi-latin">{step.label}</span>
              <strong className="kpi-latin">{step.output}</strong>
            </li>
          ))}
        </ol>
        <ul className="hsi-plan-cadence">
          {SYSTEMS_CADENCE.map((item) => (
            <li key={item.id}>{item.label}</li>
          ))}
        </ul>
      </div>
    </HotelSystemsVisualFrame>
  );
}

export function HotelSystemsRelatedVisual({ locale, src }: { locale: Locale; src?: string }) {
  const thai = locale === "th";
  return (
    <HotelSystemsVisualFrame
      locale={locale}
      src={src}
      alt={thai ? SYSTEMS_RELATED_VISUAL.altTh : SYSTEMS_RELATED_VISUAL.altEn}
      label={thai ? SYSTEMS_RELATED_VISUAL.labelTh : SYSTEMS_RELATED_VISUAL.labelEn}
      caption={thai ? SYSTEMS_RELATED_VISUAL.captionTh : SYSTEMS_RELATED_VISUAL.captionEn}
      meta={thai ? SYSTEMS_RELATED_VISUAL.metaTh : SYSTEMS_RELATED_VISUAL.metaEn}
      status={SYSTEMS_RELATED_VISUAL.status}
      width={SYSTEMS_RELATED_VISUAL.displayWidth}
      height={SYSTEMS_RELATED_VISUAL.displayHeight}
      variant="related"
    >
      <div className="hsi-board-mock" role="img" aria-label={thai ? SYSTEMS_RELATED_VISUAL.altTh : SYSTEMS_RELATED_VISUAL.altEn}>
        <span className="hsi-visual-badge">{systemsSampleLabel(locale)}</span>
        <p className="hsi-mock-title kpi-latin">Related Hotel Work</p>
      </div>
    </HotelSystemsVisualFrame>
  );
}

export function HotelSystemsEnquiryVisual({ locale, src }: { locale: Locale; src?: string }) {
  const thai = locale === "th";
  return (
    <HotelSystemsVisualFrame
      locale={locale}
      src={src}
      alt={thai ? SYSTEMS_ENQUIRY_VISUAL.altTh : SYSTEMS_ENQUIRY_VISUAL.altEn}
      label={thai ? SYSTEMS_ENQUIRY_VISUAL.labelTh : SYSTEMS_ENQUIRY_VISUAL.labelEn}
      caption={thai ? SYSTEMS_ENQUIRY_VISUAL.captionTh : SYSTEMS_ENQUIRY_VISUAL.captionEn}
      meta={thai ? SYSTEMS_ENQUIRY_VISUAL.metaTh : SYSTEMS_ENQUIRY_VISUAL.metaEn}
      status={SYSTEMS_ENQUIRY_VISUAL.status}
      width={SYSTEMS_ENQUIRY_VISUAL.displayWidth}
      height={SYSTEMS_ENQUIRY_VISUAL.displayHeight}
      variant="enquiry"
      badge={thai ? SYSTEMS_ENQUIRY_VISUAL.labelTh : SYSTEMS_ENQUIRY_VISUAL.labelEn}
    >
      <div className="hsi-enquiry-process" role="img" aria-label={thai ? SYSTEMS_ENQUIRY_VISUAL.altTh : SYSTEMS_ENQUIRY_VISUAL.altEn}>
        <span className="hsi-visual-badge">{thai ? SYSTEMS_ENQUIRY_VISUAL.labelTh : SYSTEMS_ENQUIRY_VISUAL.labelEn}</span>
        <p className="hsi-enquiry-path kpi-latin">System Inventory → Data Mapping → Testing → Handover</p>
        <ol className="hsi-enquiry-flow">
          {SYSTEMS_ENQUIRY_FLOW.map((step, index) => (
            <li key={step.id}>
              <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
              <strong>{thai ? step.th : step.en}</strong>
            </li>
          ))}
        </ol>
      </div>
    </HotelSystemsVisualFrame>
  );
}
