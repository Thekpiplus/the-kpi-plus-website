import {
  DIRECT_BOOKING_FRAMEWORK,
  DIRECT_BOOKING_FRAMEWORK_BOUNDARY,
  DIRECT_BOOKING_FRAMEWORK_STAGES,
  DIRECT_BOOKING_FRAMEWORK_VISUAL,
  directBookingSampleLabel,
} from "@/lib/direct-bookings";
import type { Locale } from "@/lib/seo";
import { ConversionVisualFrame } from "./ConversionVisualFrame";

const FIELDS = {
  input: { th: "ข้อมูลตั้งต้น", en: "Input" },
  action: { th: "สิ่งที่ทำ", en: "Action" },
  output: { th: "ผลลัพธ์", en: "Output" },
  approval: { th: "จุดที่โรงแรมอนุมัติ", en: "Hotel approval point" },
  measure: { th: "ขอบเขตการวัดผล", en: "Measurement boundary" },
} as const;

export type ConversionFrameworkStepView = {
  id: string;
  num: string;
  stage: string;
  title: string;
  input: string;
  action: string;
  output: string;
  approval: string;
  measure: string;
};

export function ConversionFramework({
  locale,
  src,
  steps,
  boundaryNote,
  supportTitle,
  hotelTitle,
  support,
  hotel,
  visual,
}: {
  locale: Locale;
  src?: string;
  steps?: ConversionFrameworkStepView[];
  boundaryNote?: string;
  supportTitle?: string;
  hotelTitle?: string;
  support?: Array<{ id: string; label: string }>;
  hotel?: Array<{ id: string; label: string }>;
  visual?: { alt?: string; label?: string; caption?: string; status?: string };
}) {
  const thai = locale === "th";
  const label = visual?.label?.trim() || (thai ? DIRECT_BOOKING_FRAMEWORK_VISUAL.labelTh : DIRECT_BOOKING_FRAMEWORK_VISUAL.labelEn);
  const caption = visual?.caption?.trim() || (thai ? DIRECT_BOOKING_FRAMEWORK_VISUAL.captionTh : DIRECT_BOOKING_FRAMEWORK_VISUAL.captionEn);
  const alt = visual?.alt?.trim() || (thai ? DIRECT_BOOKING_FRAMEWORK_VISUAL.altTh : DIRECT_BOOKING_FRAMEWORK_VISUAL.altEn);
  const status = visual?.status || DIRECT_BOOKING_FRAMEWORK_VISUAL.status;
  const boundary = DIRECT_BOOKING_FRAMEWORK_BOUNDARY;
  const rows =
    steps?.length
      ? steps
      : DIRECT_BOOKING_FRAMEWORK.map((step) => ({
          id: step.id,
          num: step.num,
          stage: step.stage,
          title: thai ? step.titleTh : step.titleEn,
          input: thai ? step.inputTh : step.inputEn,
          action: thai ? step.actionTh : step.actionEn,
          output: step.output,
          approval: thai ? step.approvalTh : step.approvalEn,
          measure: thai ? step.measureTh : step.measureEn,
        }));
  const supportItems = support?.length ? support.map((item) => item.label) : boundary.support.map((item) => (thai ? item.th : item.en));
  const hotelItems = hotel?.length ? hotel.map((item) => item.label) : boundary.hotel.map((item) => (thai ? item.th : item.en));
  return (
    <div className="db-framework">
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
        meta={thai ? DIRECT_BOOKING_FRAMEWORK_VISUAL.metaTh : DIRECT_BOOKING_FRAMEWORK_VISUAL.metaEn}
        status={status}
        width={DIRECT_BOOKING_FRAMEWORK_VISUAL.displayWidth}
        height={DIRECT_BOOKING_FRAMEWORK_VISUAL.displayHeight}
        variant="framework"
      >
        <div className="db-framework-mock" role="img" aria-label={alt}>
          <span className="db-visual-badge">{directBookingSampleLabel(locale)}</span>
          <p className="db-framework-mock-kicker kpi-latin">Sample framework</p>
          <p className="db-framework-mock-title kpi-latin">{DIRECT_BOOKING_FRAMEWORK_VISUAL.labelEn}</p>
          <ol className="db-framework-mock-flow">
            {rows.map((step) => (
              <li key={step.id}>
                <span className="kpi-latin">{step.num}</span>
                <strong className="kpi-latin">{step.stage}</strong>
                <small className="kpi-latin">{step.output}</small>
              </li>
            ))}
          </ol>
          <p className="db-framework-mock-note kpi-latin">Sample diagram · not a client project</p>
        </div>
      </ConversionVisualFrame>
      <ol className="db-framework-path" aria-label={thai ? "กรอบบริการการจองตรง" : "Direct booking conversion framework"}>
        {DIRECT_BOOKING_FRAMEWORK_STAGES.map((stage, index) => (
          <li key={stage.id}>
            <span className="kpi-latin db-path-num">{String(index + 1).padStart(2, "0")}</span>
            <span className="kpi-latin">{thai ? stage.th : stage.en}</span>
          </li>
        ))}
      </ol>
      <div className="db-framework-board">
        {rows.map((step) => (
          <article key={step.id} className="db-framework-card">
            <header>
              <p className="kpi-latin db-framework-card-num">{step.num}</p>
              <p className="kpi-latin db-stage">{step.stage}</p>
              <h3 className={thai ? undefined : "kpi-latin"}>{step.title}</h3>
            </header>
            <dl>
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
                <dt>{thai ? FIELDS.measure.th : FIELDS.measure.en}</dt>
                <dd>{step.measure}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
      <aside className="db-framework-boundary" aria-label={boundary.kicker}>
        <p className="kpi-latin db-framework-boundary-kicker">{boundary.kicker}</p>
        <p className="db-framework-boundary-note">{boundaryNote?.trim() || (thai ? boundary.note.th : boundary.note.en)}</p>
        <div className="db-framework-boundary-grid">
          <article>
            <h3>{supportTitle?.trim() || (thai ? boundary.supportTitle.th : boundary.supportTitle.en)}</h3>
            <ul>
              {supportItems.map((item) => (
                <li key={item} className={thai ? "db-framework-chip" : "kpi-latin db-framework-chip"}>
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <article>
            <h3>{hotelTitle?.trim() || (thai ? boundary.hotelTitle.th : boundary.hotelTitle.en)}</h3>
            <ul>
              {hotelItems.map((item) => (
                <li key={item} className={thai ? "db-framework-chip is-hotel" : "kpi-latin db-framework-chip is-hotel"}>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </aside>
    </div>
  );
}
