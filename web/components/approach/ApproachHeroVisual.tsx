import type { Locale } from "@/lib/seo";

const DISPLAY = { width: 560, height: 350 } as const;
const SOURCE = { width: 1600, height: 1000 } as const;
const SAMPLE_OCCUPANCY = [74, 72, 70, 68, 66, 64, 63, 62] as const;
const SAMPLE_TARGET = 75;
const SAMPLE_SCALE = { min: 50, max: 80 } as const;
const WEEKS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"] as const;

/** Drop a verified 1600×1000 Revenue/Demand screenshot here (8:5 / 16:10). */
export const APPROACH_HERO_DASHBOARD_SRC = "/images/approach-hero-dashboard-placeholder.webp";

const heroCopy = {
  th: {
    badge: "ตัวอย่างข้อมูล",
    title: "ทบทวนสัญญาณ Revenue และ Demand · มุมมอง 60 วัน",
    series: "Occupancy Forecast สัปดาห์ที่ 1 ถึง 8: 74, 72, 70, 68, 66, 64, 63 และ 62 เปอร์เซ็นต์ เป้า 75 เปอร์เซ็นต์",
    compare: "เทียบกับ Target Occupancy 75%",
    occupancy: "Occupancy Forecast",
    occupancyValue: "62%",
    occupancyVs: "Occupancy % · เทียบเป้า 75%",
    pace: "Booking Pace",
    paceValue: "Below LY",
    paceVs: "vs ปีก่อน · 60 วัน",
    axis: "Occupancy %",
    sample: "Sample data",
    decision: "ใช้มุมมองนี้เพื่อระบุวันที่ควรตัดสินใจเรื่องราคาหรือช่องทาง",
    alt: "ตัวอย่างแดชบอร์ดทบทวน Occupancy Forecast และ Booking Pace มุมมอง 60 วัน เทียบเป้า 75 เปอร์เซ็นต์ ข้อมูลตัวอย่าง",
  },
  en: {
    badge: "Sample data",
    title: "Revenue & Demand review · 60-day outlook",
    series: "Occupancy forecast weeks 1 to 8: 74, 72, 70, 68, 66, 64, 63 and 62 percent. Target 75 percent.",
    compare: "Compared with target occupancy (75%)",
    occupancy: "Occupancy Forecast",
    occupancyValue: "62%",
    occupancyVs: "Occupancy % · vs 75% target",
    pace: "Booking Pace",
    paceValue: "Below LY",
    paceVs: "vs last year · 60-day",
    axis: "Occupancy %",
    sample: "Sample data",
    decision: "Use this view to identify dates that need a pricing or channel action",
    alt: "Sample dashboard reviewing occupancy forecast and booking pace for a 60-day outlook, compared with a 75 percent target. Sample data.",
  },
} as const;

function sampleBarHeight(value: number) {
  return `${((value - SAMPLE_SCALE.min) / (SAMPLE_SCALE.max - SAMPLE_SCALE.min)) * 100}%`;
}

function HeroDashboardMock({ locale }: { locale: Locale }) {
  const ui = locale === "th" ? heroCopy.th : heroCopy.en;

  return (
    <div className="kpi-approach-hero-mock">
      <div className="kpi-approach-hero-mock-head">
        <span className="kpi-approach-hero-mock-badge">{ui.badge}</span>
        <span className="kpi-approach-hero-mock-meta kpi-latin">{ui.sample} · 60-day outlook</span>
      </div>
      <p className={`kpi-approach-hero-mock-title${locale === "th" ? "" : " kpi-latin"}`}>{ui.title}</p>
      <p className="kpi-approach-hero-mock-compare">{ui.compare}</p>
      <dl className="kpi-approach-hero-kpis">
        <div className="kpi-approach-hero-kpi">
          <dt className="kpi-latin">{ui.occupancy}</dt>
          <dd>
            {ui.occupancyValue}
            <span>{ui.occupancyVs}</span>
          </dd>
        </div>
        <div className="kpi-approach-hero-kpi">
          <dt className="kpi-latin">{ui.pace}</dt>
          <dd>
            {ui.paceValue}
            <span>{ui.paceVs}</span>
          </dd>
        </div>
      </dl>
      <p className="sr-only">{ui.series}</p>
      <div className="kpi-approach-hero-pace-block">
        <p className="kpi-approach-hero-pace-label kpi-latin">{ui.axis} · W1–W8</p>
        <div className="kpi-approach-hero-pace" aria-hidden="true">
          <span className="kpi-approach-hero-pace-target" style={{ height: sampleBarHeight(SAMPLE_TARGET) }} />
          {SAMPLE_OCCUPANCY.map((value, index) => (
            <span
              key={WEEKS[index]}
              className={index >= 4 ? "is-low" : undefined}
              style={{ height: sampleBarHeight(value) }}
            />
          ))}
        </div>
        <ol className="kpi-approach-hero-pace-axis kpi-latin" aria-hidden="true">
          {WEEKS.map((week) => (
            <li key={week}>{week}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function ApproachHeroVisual({
  locale,
  src = "",
  alt,
  caption,
  className = "",
}: {
  locale: Locale;
  src?: string;
  alt?: string;
  caption?: string;
  className?: string;
}) {
  const ui = locale === "th" ? heroCopy.th : heroCopy.en;
  const hasAsset = Boolean(src.trim());
  const resolvedAlt = alt ?? ui.alt;
  const decision = caption ?? ui.decision;

  // TODO: Insert a verified dashboard screenshot at APPROACH_HERO_DASHBOARD_SRC. Do not use stock people, hotel photos, or invented client names.
  return (
    <figure
      className={`kpi-approach-slot kpi-approach-slot--contain kpi-approach-hero-visual${className ? ` ${className}` : ""}`}
      style={{ width: "100%", maxWidth: DISPLAY.width }}
    >
      <div className="kpi-approach-slot-frame kpi-approach-hero-dash" style={{ aspectRatio: `${DISPLAY.width} / ${DISPLAY.height}` }}>
        {hasAsset ? (
          <img
            src={src}
            alt={resolvedAlt}
            width={SOURCE.width}
            height={SOURCE.height}
            decoding="async"
            fetchPriority="high"
          />
        ) : (
          <HeroDashboardMock locale={locale} />
        )}
      </div>
      <figcaption className="kpi-approach-slot-caption">
        <span>{locale === "th" ? "ทบทวนสัญญาณ Revenue และ Demand · มุมมอง 60 วัน · Sample data" : "Revenue & Demand review · 60-day outlook · Sample data"}</span>
        <span>{decision}</span>
      </figcaption>
    </figure>
  );
}
