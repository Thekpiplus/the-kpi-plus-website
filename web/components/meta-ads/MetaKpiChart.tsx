import { META_KPI_COLORS, META_KPI_VISUAL, metaKpiStatusLabel, metaParseTargetNumber, type MetaKpiTone } from "@/lib/meta-ads";
import type { Locale } from "@/lib/seo";
import "./meta-ads-visuals.css";

export type MetaKpiSeries = {
  id: string;
  name: string;
  labels: string[];
  values: number[];
  target?: string;
  tone?: MetaKpiTone;
  dataStatus?: string;
};

const WIDTH = 720;
const HEIGHT = 405;
const PAD = { top: 28, right: 28, bottom: 52, left: 56 };

function toneColor(tone?: MetaKpiTone) {
  if (tone === "risk") return META_KPI_COLORS.risk;
  if (tone === "target") return META_KPI_COLORS.target;
  return META_KPI_COLORS.positive;
}

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

export function MetaKpiChart({
  locale,
  series,
}: {
  locale: Locale;
  series: MetaKpiSeries[];
}) {
  const ready = series.filter((item) => item.values.length > 1 && item.labels.length === item.values.length);
  if (!ready.length) return null;
  const labels = ready[0].labels;
  const peak = Math.max(...ready.flatMap((item) => item.values), ...ready.map((item) => metaParseTargetNumber(item.target) ?? 0), 1);
  const maxValue = Math.max(1, Math.ceil(peak / 5) * 5);
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;
  const thai = locale === "th";
  const title = "Meta Ads Performance KPI";
  const titleId = `ads-kpi-chart-title-${ready.map((item) => item.id).join("-")}`;
  const descId = `ads-kpi-chart-desc-${ready.map((item) => item.id).join("-")}`;
  const statuses = ready.map((item) => metaKpiStatusLabel(item.dataStatus));
  const status = statuses.every((item) => item === "Anonymised")
    ? "Anonymised"
    : statuses.every((item) => item === "Sample")
      ? "Sample"
      : statuses.every((item) => item === "Approved" || item === "Anonymised")
        ? "Approved"
        : "Sample";
  const subtitle =
    status === "Sample"
      ? thai
        ? "ตัวอย่างข้อมูลที่มีป้ายกำกับ ไม่ใช่ผลบัญชีโฆษณาจริง"
        : "Labelled sample data, not a live ad-account result"
      : thai
        ? "ชุดข้อมูลที่อนุมัติหรือปกปิดตัวตนแล้ว"
        : "Approved or anonymised figures only";
  const description = ready
    .map((item) => `${item.name}: ${item.labels.join(", ")}`)
    .join(". ");

  return (
    <figure className="ads-kpi-chart">
      <div className="ads-kpi-chart__header">
        <div>
          <h3 className="kpi-latin">{title}</h3>
          <p>{subtitle}</p>
        </div>
        <span className={`kpi-meta-ads-kpi-status is-${status.toLowerCase()}`}>{status}</span>
      </div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width={META_KPI_VISUAL.displayWidth}
        height={META_KPI_VISUAL.displayHeight}
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
      >
        <title id={titleId}>{title}</title>
        <desc id={descId}>{`${subtitle}. ${description}`}</desc>
        <rect width={WIDTH} height={HEIGHT} fill="#fff" />
        {Array.from({ length: 5 }, (_, index) => {
          const y = PAD.top + (plotHeight / 4) * index;
          const value = maxValue - (maxValue / 4) * index;
          return (
            <g key={value}>
              <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y} y2={y} stroke={META_KPI_COLORS.grid} />
              <text x={PAD.left - 10} y={y + 4} textAnchor="end" fill={META_KPI_COLORS.label} fontSize="11">
                {value}
              </text>
            </g>
          );
        })}
        <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={HEIGHT - PAD.bottom} stroke={META_KPI_COLORS.axis} />
        <line x1={PAD.left} x2={WIDTH - PAD.right} y1={HEIGHT - PAD.bottom} y2={HEIGHT - PAD.bottom} stroke={META_KPI_COLORS.axis} />
        {ready.map((item) => {
          const target = metaParseTargetNumber(item.target);
          const y = target == null ? null : PAD.top + plotHeight - (target / maxValue) * plotHeight;
          return (
            <g key={item.id}>
              {y != null ? (
                <line
                  x1={PAD.left}
                  x2={WIDTH - PAD.right}
                  y1={y}
                  y2={y}
                  stroke={META_KPI_COLORS.target}
                  strokeWidth="2"
                  strokeDasharray="6 5"
                />
              ) : null}
              <path
                d={createPath(item.values, maxValue)}
                fill="none"
                stroke={toneColor(item.tone)}
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
            <text key={`${label}-${index}`} x={x} y={HEIGHT - 18} textAnchor="middle" fill={META_KPI_COLORS.label} fontSize="11">
              {label}
            </text>
          );
        })}
      </svg>
      <div className="ads-kpi-chart__legend">
        {ready.map((item) => (
          <span key={item.id}>
            <i style={{ background: toneColor(item.tone) }} />
            <span className="kpi-latin">{item.name}</span>
          </span>
        ))}
        {ready.some((item) => metaParseTargetNumber(item.target) != null) ? (
          <span>
            <i className="is-target" style={{ background: META_KPI_COLORS.target }} />
            {thai ? "เป้าหมายหรือเปรียบเทียบ" : "Target or comparison"}
          </span>
        ) : null}
      </div>
    </figure>
  );
}
