"use client";

import { useId } from "react";
import type { B2bKpi } from "@/lib/b2b";
import { b2bSampleLabel } from "@/lib/b2b";
import type { Locale } from "@/lib/seo";
import "./b2b-ops.css";

const WIDTH = 720;
const HEIGHT = 405;
const PAD = { top: 28, right: 28, bottom: 52, left: 56 };
const COLORS = ["#A2DC25", "#0B6660", "#EBE722", "#0A2472"];

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

export function B2bKpiChart({
  locale,
  kpis,
  title,
  subtitle,
}: {
  locale: Locale;
  kpis: B2bKpi[];
  title: string;
  subtitle: string;
}) {
  const uid = useId();
  const sample = b2bSampleLabel(locale);
  const series = kpis.filter((kpi) => kpi.values.length);
  if (!series.length) return null;
  const labels = series[0].labels;
  const peak = Math.max(...series.flatMap((item) => item.values), 1);
  const maxValue = Math.max(1, Math.ceil(peak / 5) * 5);

  return (
    <div className="b2b-kpi-card">
      <div className="b2b-kpi-card__header">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        <span className="b2b-kpi-card__status">{sample}</span>
      </div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width={WIDTH} height={HEIGHT} role="img" aria-labelledby={`${uid}-title`}>
        <title id={`${uid}-title`}>{title}</title>
        <rect width={WIDTH} height={HEIGHT} fill="#fff" />
        {Array.from({ length: 5 }, (_, index) => {
          const y = PAD.top + ((HEIGHT - PAD.top - PAD.bottom) / 4) * index;
          const value = maxValue - (maxValue / 4) * index;
          return (
            <g key={value}>
              <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y} y2={y} stroke="#e3e8eb" />
              <text x={PAD.left - 10} y={y + 4} textAnchor="end" fill="#617487" fontSize="11">
                {value}
              </text>
            </g>
          );
        })}
        {series.map((item, index) => (
          <path
            key={item.id}
            d={createPath(item.values, maxValue)}
            fill="none"
            stroke={COLORS[index % COLORS.length]}
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
        {labels.map((label, index) => {
          const x = PAD.left + (labels.length > 1 ? (index * (WIDTH - PAD.left - PAD.right)) / (labels.length - 1) : 0);
          return (
            <text key={label} x={x} y={HEIGHT - 18} textAnchor="middle" fill="#617487" fontSize="11">
              {label}
            </text>
          );
        })}
      </svg>
      <div className="b2b-kpi-card__legend">
        {series.map((item, index) => (
          <span key={item.id}>
            <i className="b2b-kpi-card__swatch" style={{ background: COLORS[index % COLORS.length] }} />
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}
