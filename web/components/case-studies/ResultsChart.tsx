"use client";

import { useId } from "react";

type Series = {
  name: string;
  color: string;
  values: number[];
};

type ResultsChartProps = {
  labels: string[];
  series: Series[];
  title: string;
  subtitle?: string;
  unit?: string;
  tickSuffix?: string;
  axisLabel?: string;
  statusLabel?: string;
  valueLabels?: string[];
  baseline?: { value: number; label: string; color?: string };
  caption?: string;
};

const WIDTH = 760;
const HEIGHT = 360;
const PAD = { top: 48, right: 28, bottom: 56, left: 72 };

function plotPoint(index: number, value: number, maxValue: number, count: number) {
  const plotWidth = WIDTH - PAD.left - PAD.right;
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;
  const step = count > 1 ? plotWidth / (count - 1) : plotWidth;
  const x = PAD.left + index * step;
  const y = PAD.top + plotHeight - (value / maxValue) * plotHeight;
  return { x, y };
}

function pathFor(values: number[], maxValue: number) {
  return values
    .map((value, index) => {
      const { x, y } = plotPoint(index, value, maxValue, values.length);
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

export function ResultsChart({
  labels,
  series,
  title,
  subtitle,
  unit = "",
  tickSuffix = "",
  axisLabel,
  statusLabel = "Sample data",
  valueLabels,
  baseline,
  caption,
}: ResultsChartProps) {
  const reactId = useId();
  const titleId = `${reactId}-title`;
  const descId = `${reactId}-desc`;
  const allValues = series.flatMap((item) => item.values);
  if (baseline) allValues.push(baseline.value);
  const rawMax = Math.max(...allValues, 1);
  const tickStep = rawMax <= 30 ? 5 : rawMax <= 200 ? 20 : 50;
  const maxValue = Math.max(tickStep, Math.ceil(rawMax / tickStep) * tickStep);
  const plotWidth = WIDTH - PAD.left - PAD.right;
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;
  const xStep = labels.length > 1 ? plotWidth / (labels.length - 1) : plotWidth;
  const yTicks = Math.max(1, Math.round(maxValue / tickStep));
  const primary = series[0];
  const baselineColor = baseline?.color ?? "#EBE722";

  if (!series.length || !labels.length) return null;

  const formatTick = (value: number) => `${unit}${value.toFixed(0)}${tickSuffix}`;

  return (
    <figure className="results-chart-card">
      <div className="results-chart-card__header">
        <div>
          <h3>{title}</h3>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        <span className="results-chart-card__status">{statusLabel}</span>
      </div>

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-labelledby={`${titleId} ${descId}`}>
        <title id={titleId}>{title}</title>
        <desc id={descId}>
          {subtitle || "Performance comparison chart with labelled values."}
          {caption ? ` ${caption}` : ""}
        </desc>

        {axisLabel ? (
          <text
            x={16}
            y={PAD.top + plotHeight / 2}
            textAnchor="middle"
            fontSize="11"
            fill="#555555"
            transform={`rotate(-90 16 ${PAD.top + plotHeight / 2})`}
          >
            {axisLabel}
          </text>
        ) : null}

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
                stroke="rgba(9,36,65,0.12)"
              />
              <text x={PAD.left - 12} y={y + 4} textAnchor="end" fontSize="11" fill="#555555">
                {formatTick(value)}
              </text>
            </g>
          );
        })}

        {labels.map((label, index) => {
          const x = PAD.left + index * xStep;
          return (
            <text key={`${label}-${index}`} x={x} y={HEIGHT - 18} textAnchor="middle" fontSize="11" fill="#555555">
              {label}
            </text>
          );
        })}

        {baseline ? (
          <line
            x1={PAD.left}
            x2={WIDTH - PAD.right}
            y1={plotPoint(0, baseline.value, maxValue, 2).y}
            y2={plotPoint(0, baseline.value, maxValue, 2).y}
            stroke={baselineColor}
            strokeWidth="2"
            strokeDasharray="6 5"
          />
        ) : null}

        {series.length === 1 && primary && baseline ? (
          <path
            d={`${pathFor(primary.values, maxValue)} L ${plotPoint(primary.values.length - 1, baseline.value, maxValue, primary.values.length).x.toFixed(2)} ${plotPoint(0, baseline.value, maxValue, 2).y.toFixed(2)} Z`}
            fill={primary.color}
            opacity="0.16"
          />
        ) : null}

        {series.map((item) => (
          <path
            key={item.name}
            d={pathFor(item.values, maxValue)}
            fill="none"
            stroke={item.color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {primary
          ? primary.values.map((value, index) => {
              const { x, y } = plotPoint(index, value, maxValue, primary.values.length);
              const label = valueLabels?.[index];
              const labelY = y < PAD.top + 18 ? y + 22 : y - 12;
              return (
                <g key={`${primary.name}-point-${index}`}>
                  <circle cx={x} cy={y} r="5" fill="#fff" stroke={primary.color} strokeWidth="3" />
                  {label ? (
                    <text
                      x={x}
                      y={labelY}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="700"
                      fill="#0B1F33"
                    >
                      {label}
                    </text>
                  ) : null}
                </g>
              );
            })
          : null}
      </svg>

      <div className="results-chart-card__legend">
        {series.map((item) => (
          <span key={item.name}>
            <i style={{ backgroundColor: item.color }} />
            {item.name}
          </span>
        ))}
        {baseline ? (
          <span>
            <i style={{ backgroundColor: baselineColor }} />
            {baseline.label}
          </span>
        ) : null}
      </div>
      {caption ? <p className="results-chart-card__caption">{caption}</p> : null}
    </figure>
  );
}
