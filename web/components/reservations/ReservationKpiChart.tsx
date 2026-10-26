import { useId } from "react";
import {
  RESERVATION_KPI_COLORS,
  reservationKpiSeriesColor,
  type ReservationKpiSeries,
} from "@/lib/reservations";
import "./reservations-ops.css";

type ReservationKpiChartProps = {
  title: string;
  subtitle: string;
  labels: string[];
  series: ReservationKpiSeries[];
  unit?: string;
  statusLabel?: string;
  periodLabel?: string;
  axisXLabel?: string;
  axisYLabel?: string;
  updatedLabel?: string;
  disclaimer?: string;
  empty?: boolean;
};

const WIDTH = 720;
const HEIGHT = 405;
const PAD = { top: 28, right: 28, bottom: 52, left: 56 };

function createPath(values: number[], maxValue: number) {
  if (!values.length || maxValue <= 0) return "";
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

export function ReservationKpiChart({
  title,
  subtitle,
  labels,
  series,
  unit = "",
  statusLabel = "Sample data",
  periodLabel,
  axisXLabel = "Measurement period",
  axisYLabel = "Value",
  updatedLabel,
  disclaimer,
  empty = false,
}: ReservationKpiChartProps) {
  const uid = useId();
  const titleId = `${uid}-title`;
  const descId = `${uid}-desc`;
  const visibleSeries = series
    .map((item) => ({
      ...item,
      color: reservationKpiSeriesColor(item),
      values: item.values.filter((value) => Number.isFinite(value)),
    }))
    .filter((item) => item.values.length > 0);

  if (!empty && (!visibleSeries.length || !labels.length)) return null;

  const pointCount = visibleSeries.length
    ? Math.min(labels.length, ...visibleSeries.map((item) => item.values.length))
    : 0;
  const plotLabels = labels.slice(0, pointCount);
  const plotSeries = visibleSeries.map((item) => ({
    ...item,
    values: item.values.slice(0, pointCount),
  }));
  const allValues = plotSeries.flatMap((item) => item.values);
  const peak = allValues.length ? Math.max(...allValues) : 1;
  const maxValue = Math.max(1, Math.ceil(peak / 5) * 5);
  const plotWidth = WIDTH - PAD.left - PAD.right;
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;
  const xStep = plotLabels.length > 1 ? plotWidth / (plotLabels.length - 1) : plotWidth;
  const yTicks = 4;
  const showValues = !empty && plotSeries.length > 0;
  const legend = empty
    ? [
        { name: "Actual", color: RESERVATION_KPI_COLORS.positive, kind: "positive" as const },
        { name: "Target", color: RESERVATION_KPI_COLORS.target, kind: "target" as const },
        { name: "Watch", color: RESERVATION_KPI_COLORS.warning, kind: "warning" as const },
      ]
    : plotSeries;

  return (
    <figure className="reservation-kpi-card">
      <div className="reservation-kpi-card__header">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <span className="reservation-kpi-card__status">{statusLabel}</span>
      </div>
      {periodLabel || axisYLabel || updatedLabel ? (
        <p className="reservation-kpi-card__meta">
          {periodLabel ? <span>{periodLabel}</span> : null}
          {axisYLabel ? <span>{axisYLabel}</span> : null}
          {updatedLabel ? <span>{updatedLabel}</span> : null}
        </p>
      ) : null}

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width={WIDTH}
        height={HEIGHT}
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
      >
        <title id={titleId}>{title}</title>
        <desc id={descId}>
          {subtitle}. {disclaimer ?? "Sample chart frame for reservation operation KPIs. Not hotel results."}
        </desc>
        <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill="#fff" />

        {Array.from({ length: yTicks + 1 }).map((_, index) => {
          const y = PAD.top + (plotHeight / yTicks) * index;
          const value = maxValue - (maxValue / yTicks) * index;

          return (
            <g key={`grid-${index}`}>
              <line
                x1={PAD.left}
                x2={WIDTH - PAD.right}
                y1={y}
                y2={y}
                stroke="rgba(11,31,51,0.12)"
              />
              {showValues ? (
                <text
                  x={PAD.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="11"
                  fill={RESERVATION_KPI_COLORS.axis}
                >
                  {value.toFixed(0)}
                  {unit}
                </text>
              ) : null}
            </g>
          );
        })}

        <line
          x1={PAD.left}
          x2={PAD.left}
          y1={PAD.top}
          y2={PAD.top + plotHeight}
          stroke={RESERVATION_KPI_COLORS.navy}
          strokeWidth="1.25"
        />
        <line
          x1={PAD.left}
          x2={WIDTH - PAD.right}
          y1={PAD.top + plotHeight}
          y2={PAD.top + plotHeight}
          stroke={RESERVATION_KPI_COLORS.navy}
          strokeWidth="1.25"
        />

        {plotLabels.map((label, index) => {
          const x = PAD.left + index * xStep;
          return (
            <text
              key={`${label}-${index}`}
              x={x}
              y={HEIGHT - 28}
              textAnchor="middle"
              fontSize="11"
              fill={RESERVATION_KPI_COLORS.axis}
            >
              {label}
            </text>
          );
        })}

        <text
          x={PAD.left + plotWidth / 2}
          y={HEIGHT - 10}
          textAnchor="middle"
          fontSize="11"
          fill={RESERVATION_KPI_COLORS.navy}
        >
          {axisXLabel}
        </text>

        {plotSeries.map((item) => {
          const dashed = item.kind === "target";
          const flat = item.values.every((value) => value === item.values[0]);
          const yFlat =
            PAD.top + plotHeight - ((item.values[0] ?? 0) / maxValue) * plotHeight;

          return (
            <g key={item.name}>
              {dashed && flat ? (
                <line
                  x1={PAD.left}
                  x2={WIDTH - PAD.right}
                  y1={yFlat}
                  y2={yFlat}
                  stroke={item.color}
                  strokeWidth="3"
                  strokeDasharray="7 6"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d={createPath(item.values, maxValue)}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={dashed ? 3 : 4}
                  strokeDasharray={dashed ? "7 6" : undefined}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              {!dashed
                ? item.values.map((value, index) => {
                    const x = PAD.left + index * xStep;
                    const y = PAD.top + plotHeight - (value / maxValue) * plotHeight;
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
            </g>
          );
        })}
      </svg>

      <div className="reservation-kpi-card__legend">
        {legend.map((item) => (
          <span key={item.name}>
            <i
              className={item.kind === "target" ? "is-dashed" : undefined}
              style={
                item.kind === "target"
                  ? { color: item.color }
                  : { backgroundColor: item.color }
              }
            />
            {item.name}
          </span>
        ))}
      </div>
      {disclaimer ? <figcaption className="reservation-kpi-card__note">{disclaimer}</figcaption> : null}
    </figure>
  );
}
