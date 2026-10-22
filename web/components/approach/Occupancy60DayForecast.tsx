import type { Locale } from "@/lib/seo";

const DISPLAY = { width: 640, height: 360 } as const;
const SOURCE = { width: 1600, height: 900 } as const;
const WEEKS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"] as const;
const SAMPLE_FORECAST = [74, 72, 70, 68, 66, 64, 63, 62] as const;
const SAMPLE_PACE = [71, 68, 65, 61, 58, 55, 53, 52] as const;
const SAMPLE_TARGET = 75;
const LOW_DEMAND_FROM = 4;
const CHART_SCALE = { min: 50, max: 80 } as const;
const CHART_SIZE = { width: 640, height: 360 } as const;
const CHART_PAD = { top: 36, right: 22, bottom: 58, left: 68 } as const;

/** Drop a verified 1600×900 occupancy forecast screenshot here (16:9). */
export const OCCUPANCY_FORECAST_SRC = "/images/occupancy-60-day-forecast-placeholder.webp";

export const OCCUPANCY_SAMPLE = {
  latest: SAMPLE_FORECAST[SAMPLE_FORECAST.length - 1],
  target: SAMPLE_TARGET,
} as const;

const chartCopy = {
  th: {
    badge: "ตัวอย่างข้อมูล",
    title: "Occupancy Forecast · มุมมอง 60 วัน · Sample data",
    compare: "เทียบกับ Target Occupancy 75%",
    review: "Booking Pace and Pickup review",
    caption: "ใช้มุมมองนี้เพื่อระบุวันที่ควรตัดสินใจเรื่องราคา ช่องทาง หรือ Promotion",
    target: "Target Occupancy 75%",
    forecast: "Current Forecast",
    pace: "Booking Pace",
    low: "ช่วง Demand ต่ำกว่าเป้า · W5–W8",
    yAxis: "Occupancy (%)",
    xAxis: "Week",
    aria: "กราฟตัวอย่าง Occupancy Forecast มุมมอง 60 วัน หน่วยเปอร์เซ็นต์ Current Forecast ลดจาก 74 เหลือ 62 ต่ำกว่าเป้า 75 Booking Pace ต่ำกว่า Forecast ในช่วง W5 ถึง W8 ข้อมูลตัวอย่าง",
  },
  en: {
    badge: "Sample data",
    title: "Occupancy Forecast · 60-day outlook · Sample data",
    compare: "Compared with target occupancy (75%)",
    review: "Booking Pace and Pickup review",
    caption: "Use this view to identify dates that need a pricing or channel action",
    target: "Target Occupancy 75%",
    forecast: "Current Forecast",
    pace: "Booking Pace",
    low: "Below-target period · W5–W8",
    yAxis: "Occupancy (%)",
    xAxis: "Week",
    aria: "Sample occupancy forecast, 60-day outlook. Current forecast falls from 74 to 62 percent, below the 75 percent target. Booking pace sits below forecast in weeks 5 to 8. Sample data.",
  },
} as const;

function chartX(index: number) {
  const inner = CHART_SIZE.width - CHART_PAD.left - CHART_PAD.right;
  return CHART_PAD.left + (index / (WEEKS.length - 1)) * inner;
}

function chartY(value: number) {
  const inner = CHART_SIZE.height - CHART_PAD.top - CHART_PAD.bottom;
  return CHART_PAD.top + ((CHART_SCALE.max - value) / (CHART_SCALE.max - CHART_SCALE.min)) * inner;
}

function toPoints(values: readonly number[]) {
  return values.map((value, index) => `${chartX(index)},${chartY(value)}`).join(" ");
}

function SampleOccupancyPlot({
  aria,
  yAxis,
  xAxis,
}: {
  aria: string;
  yAxis: string;
  xAxis: string;
}) {
  const plotLeft = CHART_PAD.left;
  const plotRight = CHART_SIZE.width - CHART_PAD.right;
  const plotBottom = CHART_SIZE.height - CHART_PAD.bottom;
  const plotMidY = (CHART_PAD.top + plotBottom) / 2;
  const plotMidX = (plotLeft + plotRight) / 2;
  const ticks = [80, 70, 60, 50];
  const targetY = chartY(SAMPLE_TARGET);
  const highlightX = chartX(LOW_DEMAND_FROM);
  const lastForecast = { x: chartX(SAMPLE_FORECAST.length - 1), y: chartY(SAMPLE_FORECAST[SAMPLE_FORECAST.length - 1]) };

  return (
    <svg
      className="kpi-approach-forecast-svg"
      viewBox={`0 0 ${CHART_SIZE.width} ${CHART_SIZE.height}`}
      width={DISPLAY.width}
      height={DISPLAY.height}
      role="img"
      aria-label={aria}
    >
      <title>{aria}</title>
      <rect width={CHART_SIZE.width} height={CHART_SIZE.height} fill="#FFFFFF" />
      <rect
        className="kpi-approach-forecast-band"
        x={highlightX}
        y={CHART_PAD.top}
        width={plotRight - highlightX}
        height={plotBottom - CHART_PAD.top}
      />
      <text x={highlightX + 12} y={CHART_PAD.top + 24} className="kpi-approach-forecast-band-label">
        W5–W8
      </text>
      {ticks.map((tick) => {
        const y = chartY(tick);
        return (
          <g key={tick}>
            <line x1={plotLeft} x2={plotRight} y1={y} y2={y} className="kpi-approach-chart-grid" />
            <text x={plotLeft - 10} y={y} className="kpi-approach-forecast-tick" textAnchor="end" dominantBaseline="middle">
              {tick}%
            </text>
          </g>
        );
      })}
      <text
        className="kpi-approach-forecast-axis"
        textAnchor="middle"
        transform={`rotate(-90 16 ${plotMidY})`}
        x={16}
        y={plotMidY}
      >
        {yAxis}
      </text>
      <line x1={plotLeft} x2={plotRight} y1={targetY} y2={targetY} className="kpi-approach-forecast-target" />
      <text x={plotRight} y={targetY - 10} className="kpi-approach-forecast-target-label" textAnchor="end">
        {SAMPLE_TARGET}% target
      </text>
      <polyline className="kpi-approach-forecast-pace" points={toPoints(SAMPLE_PACE)} />
      <polyline className="kpi-approach-forecast-current" points={toPoints(SAMPLE_FORECAST)} />
      {SAMPLE_FORECAST.map((value, index) => (
        <circle key={`f-${WEEKS[index]}`} cx={chartX(index)} cy={chartY(value)} r="5" className="kpi-approach-forecast-current-dot" />
      ))}
      {SAMPLE_PACE.map((value, index) => (
        <circle key={`p-${WEEKS[index]}`} cx={chartX(index)} cy={chartY(value)} r="4.5" className="kpi-approach-forecast-pace-dot" />
      ))}
      <text x={lastForecast.x - 8} y={lastForecast.y - 12} className="kpi-approach-forecast-end" textAnchor="end">
        {SAMPLE_FORECAST[SAMPLE_FORECAST.length - 1]}%
      </text>
      {WEEKS.map((week, index) => (
        <text key={week} x={chartX(index)} y={CHART_SIZE.height - 28} className="kpi-approach-forecast-week" textAnchor="middle">
          {week}
        </text>
      ))}
      <text x={plotMidX} y={CHART_SIZE.height - 8} className="kpi-approach-forecast-axis" textAnchor="middle">
        {xAxis}
      </text>
    </svg>
  );
}

export function Occupancy60DayForecast({
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
  const ui = locale === "th" ? chartCopy.th : chartCopy.en;
  const hasAsset = Boolean(src.trim());
  const resolvedAlt = alt ?? ui.aria;
  const resolvedCaption = caption ?? ui.caption;

  // TODO: Insert a verified 1600×900 occupancy forecast screenshot at OCCUPANCY_FORECAST_SRC. Keep the Sample data label unless the asset is a real, approved hotel report.
  return (
    <figure className={`kpi-approach-forecast${className ? ` ${className}` : ""}`} style={{ width: "100%", maxWidth: DISPLAY.width }}>
      <div className="kpi-approach-forecast-head">
        <p className="kpi-approach-forecast-badge">{ui.badge}</p>
        <p className={`kpi-approach-forecast-title${locale === "th" ? "" : " kpi-latin"}`}>{ui.title}</p>
        <p className="kpi-approach-forecast-compare">{ui.compare}</p>
        <p className="kpi-approach-forecast-review kpi-latin">{ui.review}</p>
      </div>
      <div className="kpi-approach-forecast-frame" style={{ aspectRatio: `${DISPLAY.width} / ${DISPLAY.height}` }}>
        {hasAsset ? (
          <img
            src={src}
            alt={resolvedAlt}
            width={SOURCE.width}
            height={SOURCE.height}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <SampleOccupancyPlot aria={resolvedAlt} yAxis={ui.yAxis} xAxis={ui.xAxis} />
        )}
      </div>
      <ul className="kpi-approach-forecast-legend">
        <li>
          <span className="kpi-approach-forecast-key kpi-approach-forecast-key-target" aria-hidden="true" />
          {ui.target}
        </li>
        <li>
          <span className="kpi-approach-forecast-key kpi-approach-forecast-key-current" aria-hidden="true" />
          {ui.forecast}
        </li>
        <li>
          <span className="kpi-approach-forecast-key kpi-approach-forecast-key-pace" aria-hidden="true" />
          {ui.pace}
        </li>
        <li>
          <span className="kpi-approach-forecast-key kpi-approach-forecast-key-low" aria-hidden="true" />
          {ui.low}
        </li>
      </ul>
      {resolvedCaption ? <figcaption className="kpi-approach-forecast-caption">{resolvedCaption}</figcaption> : null}
    </figure>
  );
}
