import {
  DIRECT_BOOKING_MEASURE_NOTE,
  DIRECT_BOOKING_MEASURE_STAGES,
  DIRECT_BOOKING_MEASURE_VISUAL,
  directBookingMeasureStatus,
  directBookingMeasureStatusLabel,
  directBookingSampleLabel,
} from "@/lib/direct-bookings";
import type { Locale } from "@/lib/seo";
import { ConversionKpiBoard, type ConversionKpiCard } from "./ConversionKpiBoard";
import { ConversionVisualFrame } from "./ConversionVisualFrame";

export type ConversionMeasureStageView = {
  id: string;
  num: string;
  event: string;
  title: string;
  action: string;
  source: string;
  owner: string;
  conclude: string;
  tracking: string;
};

const FIELDS = {
  action: { th: "การกระทำของลูกค้า", en: "Customer action" },
  event: { th: "ชื่ออีเวนต์", en: "Event name" },
  source: { th: "แหล่งข้อมูล", en: "Data source" },
  tracking: { th: "สถานะการวัดผล", en: "Tracking status" },
  owner: { th: "ผู้รับผิดชอบ", en: "Owner" },
  conclude: { th: "สรุปอะไรได้และสรุปอะไรไม่ได้", en: "What can and cannot be concluded" },
} as const;

const FUNNEL_TOP = [680, 560, 430, 300];
const FUNNEL_BOTTOM = [560, 430, 300, 200];

function stageTracking(stage: ConversionMeasureStageView, flags: { bookingEngineConfigured: boolean; trackingConfigured: boolean }) {
  if (stage.id === "complete" || stage.event.toLowerCase().includes("complete")) {
    return directBookingMeasureStatus("complete", flags);
  }
  if (stage.tracking === "supported" || stage.tracking === "pending-approval" || stage.tracking === "not-configured") {
    return stage.tracking === "supported" ? "needs-review" : stage.tracking === "not-configured" ? "not-configured" : "needs-review";
  }
  return directBookingMeasureStatus((stage.id as (typeof DIRECT_BOOKING_MEASURE_STAGES)[number]["id"]) || "visit", flags);
}

function ConversionMeasureFunnel({
  locale,
  stages,
  bookingEngineConfigured,
  trackingConfigured,
}: {
  locale: Locale;
  stages: ConversionMeasureStageView[];
  bookingEngineConfigured: boolean;
  trackingConfigured: boolean;
}) {
  const thai = locale === "th";
  const completeReady = bookingEngineConfigured && trackingConfigured;
  const rows = stages.slice(0, 4);
  return (
    <figure className="db-funnel">
      <svg viewBox="0 0 720 405" width="720" height="405" role="img" aria-labelledby="direct-booking-funnel-title">
        <title id="direct-booking-funnel-title">
          {thai ? DIRECT_BOOKING_MEASURE_VISUAL.labelTh : DIRECT_BOOKING_MEASURE_VISUAL.labelEn}
        </title>
        <rect width="720" height="405" fill="#0b1f33" />
        {rows.map((stage, index) => {
          const status = stageTracking(stage, { bookingEngineConfigured, trackingConfigured });
          const y = 18 + index * 96;
          const h = 84;
          const top = FUNNEL_TOP[index];
          const bot = FUNNEL_BOTTOM[index];
          const tx = (720 - top) / 2;
          const bx = (720 - bot) / 2;
          const fill = status === "not-configured" ? "#F8E6C8" : "#F2F8E2";
          const stroke = status === "not-configured" ? "#E3A008" : "#A2DC25";
          const dash = status === "not-configured" ? "6 5" : undefined;
          return (
            <g key={stage.id}>
              <polygon
                points={`${tx},${y} ${tx + top},${y} ${bx + bot},${y + h} ${bx},${y + h}`}
                fill={fill}
                stroke={stroke}
                strokeWidth="3"
                strokeDasharray={dash}
              />
              <text x="360" y={y + 34} textAnchor="middle" fill="#0B6660" fontFamily="Montserrat, Segoe UI, sans-serif" fontSize="12" fontWeight="800">
                {stage.num} · {stage.event}
              </text>
              <text x="360" y={y + 58} textAnchor="middle" fill="#3B3B3B" fontFamily="Montserrat, Segoe UI, sans-serif" fontSize="12" fontWeight="700">
                {directBookingMeasureStatusLabel(status, locale)}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="db-funnel-caption">
        <span className={`db-status ${completeReady ? "is-yellow" : "is-amber"}`}>
          {completeReady ? (thai ? "ต้องตรวจ" : "Needs review") : thai ? "เริ่มจองเท่านั้น" : "Booking start only"}
        </span>
        <span>
          {thai
            ? "กรวยตัวอย่าง ไม่ใช่ยอดโรงแรม Booking Complete ไม่ถูกสร้างจากคลิกจอง"
            : "Sample funnel, not a hotel result. Booking Complete is not inferred from a Book click."}
        </span>
      </figcaption>
    </figure>
  );
}

export function ConversionMeasure({
  locale,
  src,
  bookingEngineConfigured = false,
  trackingConfigured = false,
  stages,
  kpis,
  note,
  boundary,
  visual,
}: {
  locale: Locale;
  src?: string;
  bookingEngineConfigured?: boolean;
  trackingConfigured?: boolean;
  stages?: ConversionMeasureStageView[];
  kpis?: ConversionKpiCard[];
  note?: string;
  boundary?: string;
  visual?: { alt?: string; label?: string; caption?: string; status?: string };
}) {
  const thai = locale === "th";
  const label = visual?.label?.trim() || (thai ? DIRECT_BOOKING_MEASURE_VISUAL.labelTh : DIRECT_BOOKING_MEASURE_VISUAL.labelEn);
  const caption = visual?.caption?.trim() || (thai ? DIRECT_BOOKING_MEASURE_VISUAL.captionTh : DIRECT_BOOKING_MEASURE_VISUAL.captionEn);
  const alt = visual?.alt?.trim() || (thai ? DIRECT_BOOKING_MEASURE_VISUAL.altTh : DIRECT_BOOKING_MEASURE_VISUAL.altEn);
  const status = visual?.status || DIRECT_BOOKING_MEASURE_VISUAL.status;
  const completeReady = bookingEngineConfigured && trackingConfigured;
  const rows =
    stages?.length
      ? stages
      : DIRECT_BOOKING_MEASURE_STAGES.map((stage) => ({
          id: stage.id,
          num: stage.num,
          event: stage.event,
          title: thai ? stage.titleTh : stage.titleEn,
          action: thai ? stage.actionTh : stage.actionEn,
          source: thai ? stage.sourceTh : stage.sourceEn,
          owner: thai ? stage.ownerTh : stage.ownerEn,
          conclude: thai ? stage.concludeTh : stage.concludeEn,
          tracking: stage.id === "complete" ? "not-configured" : "supported",
        }));
  return (
    <div className="db-measure">
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
        meta={thai ? DIRECT_BOOKING_MEASURE_VISUAL.metaTh : DIRECT_BOOKING_MEASURE_VISUAL.metaEn}
        status={status}
        width={DIRECT_BOOKING_MEASURE_VISUAL.displayWidth}
        height={DIRECT_BOOKING_MEASURE_VISUAL.displayHeight}
        variant="measure"
      >
        <div className="db-measure-mock" role="img" aria-label={alt}>
          <span className="db-visual-badge">{directBookingSampleLabel(locale)}</span>
          <p className="db-measure-mock-kicker kpi-latin">Sample data</p>
          <p className="db-measure-mock-title kpi-latin">{DIRECT_BOOKING_MEASURE_VISUAL.labelEn}</p>
          <ol className="db-measure-mock-flow">
            {rows.map((stage) => (
              <li key={stage.id} className={stage.id === "complete" ? "is-amber" : undefined}>
                <span className="kpi-latin">{stage.num}</span>
                <strong className="kpi-latin">{stage.event}</strong>
              </li>
            ))}
          </ol>
          <p className="db-measure-mock-note kpi-latin">Booking Complete · Tracking not configured</p>
        </div>
      </ConversionVisualFrame>
      <div className="db-measure-layout">
        <ConversionMeasureFunnel
          locale={locale}
          stages={rows}
          bookingEngineConfigured={bookingEngineConfigured}
          trackingConfigured={trackingConfigured}
        />
        <div className="db-measure-board">
          {rows.map((stage) => {
            const tracking = stageTracking(stage, { bookingEngineConfigured, trackingConfigured });
            const completeBlocked = (stage.id === "complete" || stage.event.toLowerCase().includes("complete")) && !completeReady;
            return (
              <article key={stage.id} className={`db-measure-card${completeBlocked ? " is-amber" : " is-yellow"}`}>
                <header>
                  <p className="kpi-latin db-measure-card-num">{stage.num}</p>
                  <h3 className="kpi-latin">{stage.title}</h3>
                </header>
                <dl>
                  <div>
                    <dt>{thai ? FIELDS.action.th : FIELDS.action.en}</dt>
                    <dd>{stage.action}</dd>
                  </div>
                  <div>
                    <dt>{thai ? FIELDS.event.th : FIELDS.event.en}</dt>
                    <dd>
                      <span className="kpi-latin db-output">{stage.event}</span>
                    </dd>
                  </div>
                  <div>
                    <dt>{thai ? FIELDS.source.th : FIELDS.source.en}</dt>
                    <dd>{stage.source}</dd>
                  </div>
                  <div>
                    <dt>{thai ? FIELDS.tracking.th : FIELDS.tracking.en}</dt>
                    <dd className="db-measure-status-row">
                      <span className={`db-status is-${tracking === "not-configured" ? "amber" : tracking === "clear" ? "green" : "yellow"}`}>
                        {directBookingMeasureStatusLabel(tracking, locale)}
                      </span>
                      {completeBlocked ? (
                        <span className="db-status is-amber">{thai ? "เริ่มจองเท่านั้น" : "Booking start only"}</span>
                      ) : null}
                    </dd>
                  </div>
                  <div>
                    <dt>{thai ? FIELDS.owner.th : FIELDS.owner.en}</dt>
                    <dd>{stage.owner}</dd>
                  </div>
                  <div>
                    <dt>{thai ? FIELDS.conclude.th : FIELDS.conclude.en}</dt>
                    <dd>{stage.conclude}</dd>
                  </div>
                </dl>
              </article>
            );
          })}
        </div>
      </div>
      <p className="db-measure-callout" role="note">
        {note?.trim() || (thai ? DIRECT_BOOKING_MEASURE_NOTE.th : DIRECT_BOOKING_MEASURE_NOTE.en)}
      </p>
      {boundary?.trim() ? <p className="db-measure-note">{boundary}</p> : null}
      <ConversionKpiBoard locale={locale} items={kpis} trackingReady={completeReady} />
    </div>
  );
}
