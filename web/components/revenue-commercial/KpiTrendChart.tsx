import { REVENUE_KPI_TREND_VISUAL } from "@/lib/revenue";
import "./revenue-commercial.css";

export type KpiSeries = {
  name: string;
  color: string;
  values: number[];
  dashed?: boolean;
};

type KpiTrendChartProps = {
  title: string;
  subtitle: string;
  labels: string[];
  series: KpiSeries[];
  unit?: string;
  statusLabel?: string;
  periodLabel: string;
  updatedLabel: string;
  axisXLabel: string;
  axisYLabel: string;
  disclaimer: string;
  src?: string;
};

const WIDTH = 720;
const HEIGHT = 405;
const PAD = { top: 28, right: 72, bottom: 64, left: 52 };

function plotY(value: number, minValue: number, range: number, plotHeight: number) {
  return PAD.top + plotHeight - ((value - minValue) / range) * plotHeight;
}

function createPath(values: number[], minValue: number, range: number) {
  const plotWidth = WIDTH - PAD.left - PAD.right;
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;
  const step = values.length > 1 ? plotWidth / (values.length - 1) : plotWidth;

  return values
    .map((value, index) => {
      const x = PAD.left + index * step;
      const y = plotY(value, minValue, range, plotHeight);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function formatTick(value: number, unit: string) {
  return unit === "%" ? `${value.toFixed(0)}%` : `${value.toFixed(0)}${unit}`;
}

export function KpiTrendChart({
  title,
  subtitle,
  labels,
  series,
  unit = "%",
  statusLabel = "Sample data",
  periodLabel,
  updatedLabel,
  axisXLabel,
  axisYLabel,
  disclaimer,
  src,
}: KpiTrendChartProps) {
  const idSlug = title.replace(/\s+/g, "-").slice(0, 32) || "chart";
  const chartTitleId = `kpi-trend-title-${idSlug}`;
  const chartDescId = `kpi-trend-desc-${idSlug}`;
  const hasAsset = Boolean(src?.trim());
  const visibleSeries = series.filter((item) => item.values.length > 0);
  const allValues = visibleSeries.flatMap((item) => item.values).filter((value) => Number.isFinite(value));
  const peak = allValues.length ? Math.max(...allValues) : 1;
  const floor = allValues.length ? Math.min(...allValues) : 0;
  const minValue = Math.max(0, Math.floor((floor - 5) / 10) * 10);
  const maxValue = Math.max(minValue + 10, Math.ceil((peak + 5) / 10) * 10);
  const range = maxValue - minValue;
  const plotWidth = WIDTH - PAD.left - PAD.right;
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;
  const xStep = labels.length > 1 ? plotWidth / (labels.length - 1) : plotWidth;
  const yTicks = Math.max(1, Math.round(range / 10));

  return (
    <figure className="kpi-chart-card">
      <div className="kpi-chart-card__header">
        <div>
          <h3 id={chartTitleId}>{title}</h3>
          <p>{subtitle}</p>
        </div>
        {statusLabel.trim() ? <span className="kpi-chart-card__status">{statusLabel}</span> : null}
      </div>
      <p className="kpi-chart-card__meta">
        <span>{periodLabel}</span>
        <span>{axisYLabel}</span>
        <span>{updatedLabel}</span>
      </p>

      {hasAsset ? (
        <div className="kpi-chart-asset">
          <img
            src={src}
            alt={REVENUE_KPI_TREND_VISUAL.label}
            width={REVENUE_KPI_TREND_VISUAL.displayWidth}
            height={REVENUE_KPI_TREND_VISUAL.displayHeight}
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : (
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          width={REVENUE_KPI_TREND_VISUAL.displayWidth}
          height={REVENUE_KPI_TREND_VISUAL.displayHeight}
          role="img"
          aria-labelledby={`${chartTitleId} ${chartDescId}`}
        >
          <title>{title}</title>
          <desc id={chartDescId}>
            {subtitle}. {periodLabel}. {disclaimer}
          </desc>

          {Array.from({ length: yTicks + 1 }).map((_, index) => {
            const y = PAD.top + (plotHeight / yTicks) * index;
            const value = maxValue - (range / yTicks) * index;

            return (
              <g key={`y-${index}`}>
                <line
                  x1={PAD.left}
                  x2={WIDTH - PAD.right}
                  y1={y}
                  y2={y}
                  stroke="#e3e8eb"
                />
                <text x={PAD.left - 10} y={y + 5} textAnchor="end" className="kpi-chart-tick">
                  {formatTick(value, unit)}
                </text>
              </g>
            );
          })}

          {labels.map((label, index) => {
            const x = PAD.left + index * xStep;
            const show = labels.length <= 6 || index === 0 || index === labels.length - 1 || index % 2 === 0;
            if (!show) return null;
            return (
              <text key={`${label}-${index}`} x={x} y={HEIGHT - 28} textAnchor="middle" className="kpi-chart-tick">
                {label}
              </text>
            );
          })}
          <text x={PAD.left + plotWidth / 2} y={HEIGHT - 8} textAnchor="middle" className="kpi-chart-axis">
            {axisXLabel}
          </text>

          {visibleSeries.map((item) => {
            const lastIndex = item.values.length - 1;
            const lastX = PAD.left + lastIndex * xStep;
            const lastY = plotY(item.values[lastIndex], minValue, range, plotHeight);
            const flat = item.values.every((value) => value === item.values[0]);

            return (
              <g key={item.name}>
                {item.dashed && flat ? (
                  <line
                    x1={PAD.left}
                    x2={WIDTH - PAD.right}
                    y1={lastY}
                    y2={lastY}
                    stroke={item.color}
                    strokeWidth="3"
                    strokeDasharray="7 6"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d={createPath(item.values, minValue, range)}
                    fill="none"
                    stroke={item.color}
                    strokeWidth={item.dashed ? 3 : 4}
                    strokeDasharray={item.dashed ? "7 6" : undefined}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}
                {!item.dashed
                  ? item.values.map((value, index) => {
                      const x = PAD.left + index * xStep;
                      const y = plotY(value, minValue, range, plotHeight);
                      return (
                        <circle
                          key={`${item.name}-${index}`}
                          cx={x}
                          cy={y}
                          r="4"
                          fill="#fff"
                          stroke={item.color}
                          strokeWidth="3"
                        />
                      );
                    })
                  : null}
                <text
                  x={Math.min(lastX + 8, WIDTH - 8)}
                  y={lastY + 4}
                  className="kpi-chart-end"
                  fill="#0B1F33"
                >
                  {formatTick(item.values[lastIndex], unit)}
                </text>
              </g>
            );
          })}
        </svg>
      )}

      <div className="kpi-chart-card__legend">
        {visibleSeries.map((item) => (
          <span key={item.name}>
            <i
              className={item.dashed ? "is-dashed" : undefined}
              style={item.dashed ? { color: item.color } : { backgroundColor: item.color }}
            />
            {item.name}
          </span>
        ))}
      </div>
      <figcaption className="kpi-chart-card__note">{disclaimer}</figcaption>
    </figure>
  );
}
