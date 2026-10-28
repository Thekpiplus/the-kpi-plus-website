import {
  DIRECT_BOOKING_HANDOVER_LABEL,
  DIRECT_BOOKING_WORKFLOW,
  DIRECT_BOOKING_WORKFLOW_ADJUST_SCOPE,
  DIRECT_BOOKING_WORKFLOW_REVIEW_CHECKS,
  DIRECT_BOOKING_WORKFLOW_VISUAL,
  directBookingSampleLabel,
} from "@/lib/direct-bookings";
import type { Locale } from "@/lib/seo";
import { ConversionVisualFrame } from "./ConversionVisualFrame";

const FIELDS = {
  owner: { th: "ผู้รับผิดชอบ", en: "Owner" },
  input: { th: "ข้อมูลตั้งต้น", en: "Input" },
  action: { th: "สิ่งที่ทำ", en: "Action" },
  output: { th: "ผลลัพธ์", en: "Output" },
  approval: { th: "จุดที่โรงแรมอนุมัติ", en: "Approval point" },
  next: { th: "การตัดสินใจขั้นถัดไป", en: "Next decision" },
} as const;

export type ConversionWorkflowStepView = {
  id: string;
  num: string;
  label: string;
  title: string;
  owner: string;
  input: string;
  action: string;
  output: string;
  approval: string;
  next: string;
};

export function ConversionWorkflow({
  locale,
  src,
  steps,
  visual,
}: {
  locale: Locale;
  src?: string;
  steps?: ConversionWorkflowStepView[];
  visual?: { alt?: string; label?: string; caption?: string; status?: string };
}) {
  const thai = locale === "th";
  const label = visual?.label?.trim() || (thai ? DIRECT_BOOKING_WORKFLOW_VISUAL.labelTh : DIRECT_BOOKING_WORKFLOW_VISUAL.labelEn);
  const caption = visual?.caption?.trim() || (thai ? DIRECT_BOOKING_WORKFLOW_VISUAL.captionTh : DIRECT_BOOKING_WORKFLOW_VISUAL.captionEn);
  const alt = visual?.alt?.trim() || (thai ? DIRECT_BOOKING_WORKFLOW_VISUAL.altTh : DIRECT_BOOKING_WORKFLOW_VISUAL.altEn);
  const status = visual?.status || DIRECT_BOOKING_WORKFLOW_VISUAL.status;
  const rows =
    steps?.length
      ? steps
      : DIRECT_BOOKING_WORKFLOW.map((step) => ({
          id: step.id,
          num: step.num,
          label: step.label,
          title: thai ? step.titleTh : step.titleEn,
          owner: thai ? step.ownerTh : step.ownerEn,
          input: thai ? step.inputTh : step.inputEn,
          action: thai ? step.actionTh : step.actionEn,
          output: step.output,
          approval: thai ? step.approvalTh : step.approvalEn,
          next: thai ? step.nextTh : step.nextEn,
        }));
  return (
    <div className="db-workflow">
      <p className="db-friction-kicker">
        <span className="db-visual-badge">{directBookingSampleLabel(locale)}</span>
        <span className="kpi-latin">{label}</span>
      </p>
      <ConversionVisualFrame
        locale={locale}
        src={src}
        alt={alt}
        label={label}
        caption={caption}
        meta={thai ? DIRECT_BOOKING_WORKFLOW_VISUAL.metaTh : DIRECT_BOOKING_WORKFLOW_VISUAL.metaEn}
        status={status}
        width={DIRECT_BOOKING_WORKFLOW_VISUAL.displayWidth}
        height={DIRECT_BOOKING_WORKFLOW_VISUAL.displayHeight}
        variant="workflow"
      >
        <div className="db-workflow-mock" role="img" aria-label={alt}>
          <span className="db-visual-badge">{directBookingSampleLabel(locale)}</span>
          <p className="db-workflow-mock-kicker kpi-latin">Sample timeline</p>
          <p className="db-workflow-mock-title kpi-latin">{DIRECT_BOOKING_WORKFLOW_VISUAL.labelEn}</p>
          <ol className="db-workflow-mock-flow">
            {rows.map((step) => (
              <li key={step.id}>
                <span className="kpi-latin">{step.num}</span>
                <strong className="kpi-latin">{step.label}</strong>
                <small className="kpi-latin">{step.output}</small>
              </li>
            ))}
          </ol>
          <p className="db-workflow-mock-note kpi-latin">Handoff map · not a meeting photo</p>
        </div>
      </ConversionVisualFrame>
      <ol className="db-workflow-path" aria-label={thai ? "ไทม์ไลน์วิธีทำงานจองตรง" : "Direct booking optimization workflow"}>
        {rows.map((step) => (
          <li key={step.id}>
            <span className="kpi-latin db-path-num">{step.num}</span>
            <span className="kpi-latin">{step.label}</span>
            <small className="kpi-latin">{step.output}</small>
          </li>
        ))}
      </ol>
      <div className="db-workflow-board">
        {rows.map((step) => (
          <article key={step.id} className="db-workflow-card">
            <header>
              <p className="kpi-latin db-workflow-card-num">{step.num}</p>
              <p className="kpi-latin db-stage">{step.label}</p>
              <h3 className={thai ? undefined : "kpi-latin"}>{step.title}</h3>
            </header>
            <dl>
              <div>
                <dt>{thai ? FIELDS.owner.th : FIELDS.owner.en}</dt>
                <dd>{step.owner}</dd>
              </div>
              <div>
                <dt>{thai ? FIELDS.input.th : FIELDS.input.en}</dt>
                <dd>{step.input}</dd>
              </div>
              <div>
                <dt>{thai ? FIELDS.action.th : FIELDS.action.en}</dt>
                <dd>{step.action}</dd>
              </div>
              <div>
                <dt>{thai ? FIELDS.output.th : FIELDS.output.en}</dt>
                <dd>
                  <span className="kpi-latin db-output">{step.output}</span>
                </dd>
              </div>
              <div>
                <dt>{thai ? FIELDS.approval.th : FIELDS.approval.en}</dt>
                <dd>{step.approval}</dd>
              </div>
              <div>
                <dt>{thai ? FIELDS.next.th : FIELDS.next.en}</dt>
                <dd>{step.next}</dd>
              </div>
            </dl>
            {step.id === "review" ? (
              <ul className="db-workflow-chips" aria-label={thai ? "ขอบเขตการตรวจ" : "Review checklist"}>
                {DIRECT_BOOKING_WORKFLOW_REVIEW_CHECKS.map((item) => (
                  <li key={item.en} className={thai ? "db-workflow-chip" : "kpi-latin db-workflow-chip"}>
                    {thai ? item.th : item.en}
                  </li>
                ))}
              </ul>
            ) : null}
            {step.id === "adjust" ? (
              <ul className="db-workflow-chips" aria-label={thai ? "ขอบเขตที่อาจปรับ" : "Adjust scope"}>
                {DIRECT_BOOKING_WORKFLOW_ADJUST_SCOPE.map((item) => (
                  <li key={item.en} className={thai ? "db-workflow-chip" : "kpi-latin db-workflow-chip"}>
                    {thai ? item.th : item.en}
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
      <div className="db-handover">
        <h3>{thai ? "กรรมสิทธิ์หลังส่งมอบ" : "Ownership after handover"}</h3>
        <ul>
          {Object.entries(DIRECT_BOOKING_HANDOVER_LABEL).map(([id, item]) => (
            <li key={id}>
              <span className="kpi-latin">{item.en}</span>
              {thai ? <span>{item.th}</span> : null}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
