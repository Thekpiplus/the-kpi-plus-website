import {
  DIRECT_BOOKING_FRICTION_STAGES,
  DIRECT_BOOKING_FRICTION_VISUAL,
  directBookingFrictionStatusLabel,
  directBookingSampleLabel,
  type DirectBookingFrictionTracking,
} from "@/lib/direct-bookings";
import type { Locale } from "@/lib/seo";
import { ConversionVisualFrame } from "./ConversionVisualFrame";

export type ConversionFrictionRowView = {
  id: string;
  tone: string;
  tracking: string;
  stage: string;
  friction: string;
  question: string;
  risk: string;
  inspect: string;
  output: string;
};

function asTracking(value: string): DirectBookingFrictionTracking {
  if (value === "clear" || value === "not-configured") return value;
  return "needs-review";
}

const FIELDS = {
  question: { th: "คำถามของลูกค้า", en: "Customer question" },
  risk: { th: "ความเสี่ยงที่ทำให้หยุด", en: "Friction risk" },
  inspect: { th: "สิ่งที่ควรตรวจ", en: "What to inspect" },
  output: { th: "ผลลัพธ์ที่แนะนำ", en: "Suggested output" },
  tracking: { th: "สถานะการวัดผล", en: "Tracking status" },
} as const;

function frictionRows(locale: Locale, rows?: ConversionFrictionRowView[]): ConversionFrictionRowView[] {
  if (rows?.length) return rows;
  const thai = locale === "th";
  return DIRECT_BOOKING_FRICTION_STAGES.map((stage) => ({
    id: stage.id,
    tone: stage.tone,
    tracking: stage.tracking,
    stage: thai ? stage.stageTh : stage.stageEn,
    friction: thai ? stage.frictionTh : stage.frictionEn,
    question: thai ? stage.questionTh : stage.questionEn,
    risk: thai ? stage.riskTh : stage.riskEn,
    inspect: thai ? stage.inspectTh : stage.inspectEn,
    output: stage.output,
  }));
}

function FrictionFlow({ locale, rows }: { locale: Locale; rows: ConversionFrictionRowView[] }) {
  const thai = locale === "th";
  return (
    <ol className="db-friction-flow">
      {rows.map((stage, index) => (
        <li key={stage.id} className={`is-${stage.tone}`}>
          <span className="kpi-latin">{String(index + 1).padStart(2, "0")}</span>
          <strong className={thai ? undefined : "kpi-latin"}>{stage.stage}</strong>
          <small className={thai ? undefined : "kpi-latin"}>{stage.friction}</small>
        </li>
      ))}
    </ol>
  );
}

export function ConversionFrictionMap({
  locale,
  src,
  rows,
  visual,
}: {
  locale: Locale;
  src?: string;
  rows?: ConversionFrictionRowView[];
  visual?: { alt?: string; label?: string; caption?: string; status?: string };
}) {
  const thai = locale === "th";
  const stages = frictionRows(locale, rows);
  const label = visual?.label?.trim() || (thai ? DIRECT_BOOKING_FRICTION_VISUAL.labelTh : DIRECT_BOOKING_FRICTION_VISUAL.labelEn);
  const caption = visual?.caption?.trim() || (thai ? DIRECT_BOOKING_FRICTION_VISUAL.captionTh : DIRECT_BOOKING_FRICTION_VISUAL.captionEn);
  const alt = visual?.alt?.trim() || (thai ? DIRECT_BOOKING_FRICTION_VISUAL.altTh : DIRECT_BOOKING_FRICTION_VISUAL.altEn);
  const status = visual?.status || DIRECT_BOOKING_FRICTION_VISUAL.status;
  return (
    <section className="db-friction" aria-labelledby="direct-booking-friction-map-title">
      <p className="db-friction-kicker">
        <span className="db-visual-badge">{directBookingSampleLabel(locale)}</span>
        <span className="kpi-latin" id="direct-booking-friction-map-title">
          {label}
        </span>
      </p>
      <ConversionVisualFrame
        locale={locale}
        src={src}
        alt={alt}
        label={label}
        caption={caption}
        meta={thai ? DIRECT_BOOKING_FRICTION_VISUAL.metaTh : DIRECT_BOOKING_FRICTION_VISUAL.metaEn}
        status={status}
        width={DIRECT_BOOKING_FRICTION_VISUAL.displayWidth}
        height={DIRECT_BOOKING_FRICTION_VISUAL.displayHeight}
        variant="friction"
      >
        <div className="db-friction-mock" role="img" aria-label={alt}>
          <span className="db-visual-badge">{directBookingSampleLabel(locale)}</span>
          <p className="db-friction-mock-kicker kpi-latin">Sample flow</p>
          <p className="db-friction-mock-title kpi-latin">Direct Booking Friction Map — Sample</p>
          <FrictionFlow locale={locale} rows={stages} />
        </div>
      </ConversionVisualFrame>
      <FrictionFlow locale={locale} rows={stages} />
      <ul className="db-friction-legend" aria-label={thai ? "ความหมายสีสถานะ" : "Status colour key"}>
        <li className="is-green">
          <span />
          {thai ? "ชัดเจน" : "Clear"}
        </li>
        <li className="is-yellow">
          <span />
          {thai ? "ต้องตรวจ" : "Needs review"}
        </li>
        <li className="is-amber">
          <span />
          {thai ? "ติดขัด / ยังไม่เชื่อมการวัดผล" : "Blocked or tracking not configured"}
        </li>
      </ul>
      <div className="db-friction-board">
        {stages.map((stage, index) => (
          <article key={stage.id} className={`db-friction-card is-${stage.tone}`}>
            <header>
              <p className="kpi-latin db-friction-card-num">{String(index + 1).padStart(2, "0")}</p>
              <h3 className={thai ? undefined : "kpi-latin"}>{stage.stage}</h3>
              <p className={thai ? undefined : "kpi-latin"}>{stage.friction}</p>
            </header>
            <dl>
              <div>
                <dt>{thai ? FIELDS.question.th : FIELDS.question.en}</dt>
                <dd>{stage.question}</dd>
              </div>
              <div>
                <dt>{thai ? FIELDS.risk.th : FIELDS.risk.en}</dt>
                <dd>{stage.risk}</dd>
              </div>
              <div>
                <dt>{thai ? FIELDS.inspect.th : FIELDS.inspect.en}</dt>
                <dd>{stage.inspect}</dd>
              </div>
              <div>
                <dt>{thai ? FIELDS.output.th : FIELDS.output.en}</dt>
                <dd>
                  <span className="kpi-latin db-output">{stage.output}</span>
                </dd>
              </div>
              <div>
                <dt>{thai ? FIELDS.tracking.th : FIELDS.tracking.en}</dt>
                <dd>
                  <span className={`db-status is-${stage.tone}`}>{directBookingFrictionStatusLabel(asTracking(stage.tracking), locale)}</span>
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ConversionFrictionTable({
  locale,
  src,
  rows,
  visual,
}: {
  locale: Locale;
  src?: string;
  rows?: ConversionFrictionRowView[];
  visual?: { alt?: string; label?: string; caption?: string; status?: string };
}) {
  return <ConversionFrictionMap locale={locale} src={src} rows={rows} visual={visual} />;
}
