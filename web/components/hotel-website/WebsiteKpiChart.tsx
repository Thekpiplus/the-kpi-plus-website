import {
  WEBSITE_KPI_COLORS,
  WEBSITE_KPI_SAMPLE_SERIES,
  WEBSITE_KPI_VISUAL,
  websiteKpiPublicStatus,
} from "@/lib/hotel-website";
import type { Locale } from "@/lib/seo";

const WIDTH = 720;
const HEIGHT = 405;
const PAD = { top: 28, right: 28, bottom: 52, left: 56 };

function createPath(values: number[], maxValue: number) {
  const plotWidth = WIDTH - PAD.left - PAD.right;
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;
  const step = values.length > 1 ? plotWidth / (values.length - 1) : plotWidth;
  return values
    .map((value, index) => {
      const x = PAD.left + index * step;
      const y = PAD.top + plotHeight - (value / maxValue) * plotHeight;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function parseTarget(value?: string) {
  if (!value) return null;
  const next = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(next) ? next : null;
}

export type WebsiteKpiChartSeries = {
  id: string;
  name: string;
  labels: string[];
  values: number[];
  target?: string;
};

export function WebsiteKpiChart({
  locale,
  series: overrideSeries,
  sample = true,
}: {
  locale: Locale;
  series?: WebsiteKpiChartSeries[];
  sample?: boolean;
}) {
  const thai = locale === "th";
  const series = overrideSeries?.length ? overrideSeries : [...WEBSITE_KPI_SAMPLE_SERIES];
  const labels = series[0]?.labels?.length ? series[0].labels : [...WEBSITE_KPI_SAMPLE_SERIES[0].labels];
  const peak = Math.max(...series.flatMap((item) => item.values), ...series.map((item) => parseTarget(item.target) ?? 0), 1);
  const maxValue = Math.max(1, Math.ceil(peak / 5) * 5);
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;
  const title = "Hotel Website Performance Metrics";
  const status = websiteKpiPublicStatus(sample ? "sample" : "approved");
  const subtitle = thai
    ? "ดัชนีตัวอย่าง มีป้ายกำกับ ไม่ใช่ยอดโรงแรม และไม่รวม Booking Outcome"
    : "Labelled sample index. Not a hotel result. Booking Outcome is not plotted.";
  const titleId = "hotel-website-kpi-chart-title";
  const descId = "hotel-website-kpi-chart-desc";

  return (
    <figure className="web-kpi-chart">
      <div className="web-kpi-chart-head">
        <div>
          <h3 className="kpi-latin">{title}</h3>
          <p>{subtitle}</p>
        </div>
        <span className="kpi-latin web-kpi-status is-sample">{status}</span>
      </div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width={WEBSITE_KPI_VISUAL.displayWidth}
        height={WEBSITE_KPI_VISUAL.displayHeight}
        role="img"
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        <title id={titleId}>{title}</title>
        <desc id={descId}>{subtitle}</desc>
        <rect width={WIDTH} height={HEIGHT} fill="#fff" />
        {Array.from({ length: 5 }, (_, index) => {
          const y = PAD.top + (plotHeight / 4) * index;
          const value = maxValue - (maxValue / 4) * index;
          return (
            <g key={value}>
              <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y} y2={y} stroke={WEBSITE_KPI_COLORS.grid} />
              <text x={PAD.left - 10} y={y + 4} textAnchor="end" fill={WEBSITE_KPI_COLORS.label} fontSize="11">
                {value}
              </text>
            </g>
          );
        })}
        <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={HEIGHT - PAD.bottom} stroke={WEBSITE_KPI_COLORS.navy} />
        <line x1={PAD.left} x2={WIDTH - PAD.right} y1={HEIGHT - PAD.bottom} y2={HEIGHT - PAD.bottom} stroke={WEBSITE_KPI_COLORS.navy} />
        {series.map((item) => {
          const target = parseTarget(item.target);
          const y = target == null ? null : PAD.top + plotHeight - (target / maxValue) * plotHeight;
          return (
            <g key={item.id}>
              {y != null ? (
                <line
                  x1={PAD.left}
                  x2={WIDTH - PAD.right}
                  y1={y}
                  y2={y}
                  stroke={WEBSITE_KPI_COLORS.target}
                  strokeWidth="2"
                  strokeDasharray="6 5"
                />
              ) : null}
              <path
                d={createPath([...item.values], maxValue)}
                fill="none"
                stroke={WEBSITE_KPI_COLORS.positive}
                strokeWidth="3"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </g>
          );
        })}
        {labels.map((label, index) => {
          const x = PAD.left + (labels.length > 1 ? (index * (WIDTH - PAD.left - PAD.right)) / (labels.length - 1) : 0);
          return (
            <text key={`${label}-${index}`} x={x} y={HEIGHT - 18} textAnchor="middle" fill={WEBSITE_KPI_COLORS.label} fontSize="11">
              {label}
            </text>
          );
        })}
      </svg>
      <div className="web-kpi-chart-legend">
        {series.map((item) => (
          <span key={item.id}>
            <i style={{ background: WEBSITE_KPI_COLORS.positive }} />
            <span className="kpi-latin">{item.name}</span>
          </span>
        ))}
        <span>
          <i className="is-target" style={{ background: WEBSITE_KPI_COLORS.target }} />
          {thai ? "เป้าหมายหรือเปรียบเทียบ" : "Target or comparison"}
        </span>
        <span>
          <i style={{ background: WEBSITE_KPI_COLORS.warning }} />
          {thai ? "Tracking not configured" : "Tracking not configured"}
        </span>
      </div>
    </figure>
  );
}
