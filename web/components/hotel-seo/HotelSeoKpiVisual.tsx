import {
  HOTEL_SEO_KPI_GROUPS,
  HOTEL_SEO_KPIS,
  HOTEL_SEO_KPI_VISUAL,
  hotelSeoSampleLabel,
  hotelSeoShowsSampleBadge,
} from "@/lib/hotel-seo";
import type { Locale } from "@/lib/seo";
import "./hotel-seo-visuals.css";

const WIDTH = 720;
const HEIGHT = 405;
const PAD = { top: 96, right: 36, bottom: 78, left: 64 };
const BAR_COLORS = ["#A2DC25", "#0B6660", "#EBE722"] as const;

export function HotelSeoKpiVisual({
  locale,
  src,
  status,
  alt: altProp,
  label: labelProp,
  caption: captionProp,
  chart,
}: {
  locale: Locale;
  src?: string;
  status?: string;
  alt?: string;
  label?: string;
  caption?: string;
  chart?: { labels: string[]; values: number[] };
}) {
  const thai = locale === "th";
  const sample = hotelSeoSampleLabel(locale);
  const alt = altProp || (thai ? HOTEL_SEO_KPI_VISUAL.alt.th : HOTEL_SEO_KPI_VISUAL.alt.en);
  const label = labelProp || (thai ? HOTEL_SEO_KPI_VISUAL.label.th : HOTEL_SEO_KPI_VISUAL.label.en);
  const meta = thai ? HOTEL_SEO_KPI_VISUAL.meta.th : HOTEL_SEO_KPI_VISUAL.meta.en;
  const caption = captionProp || (thai ? HOTEL_SEO_KPI_VISUAL.caption.th : HOTEL_SEO_KPI_VISUAL.caption.en);
  const fileSrc = src?.trim() || "";
  const chartLabels = chart?.labels.filter((item) => item.trim()) ?? [];
  const chartValues = chart?.values ?? [];
  const hasChart = chartLabels.length > 0 && chartValues.length > 0;
  const counts = hasChart
    ? chartLabels.map((_, index) => Number(chartValues[index] ?? 0))
    : HOTEL_SEO_KPI_GROUPS.map((group) => HOTEL_SEO_KPIS.filter((kpi) => kpi.group === group.id).length);
  const series = hasChart
    ? chartLabels.map((title, index) => ({ id: `chart-${index}`, titleEn: title, titleTh: title }))
    : HOTEL_SEO_KPI_GROUPS;
  const maxValue = Math.max(...counts, 1);
  const plotWidth = WIDTH - PAD.left - PAD.right;
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;
  const barWidth = plotWidth / (counts.length * 2.2);
  const titleId = "hotel-seo-kpi-chart-title";
  const descId = "hotel-seo-kpi-chart-desc";
  const axis = thai ? "จำนวนตัวชี้วัดในกรอบ" : "Metrics in this framework";
  const note = thai
    ? "กรอบตัวอย่าง ไม่ใช่ยอดแสดงผล คลิก โทร หรือจองของโรงแรม การแสดงผลไม่ใช่รายได้"
    : "Sample framework, not hotel impressions, clicks, calls, or bookings. Impressions are not revenue";

  return (
    <figure className="seo-visual seo-kpi-visual">
      <div className="seo-visual-frame seo-kpi-frame">
        {fileSrc ? (
          <div className="seo-visual-asset">
            <img
              src={fileSrc}
              alt={alt}
              width={HOTEL_SEO_KPI_VISUAL.displayWidth}
              height={HOTEL_SEO_KPI_VISUAL.displayHeight}
              loading="lazy"
              decoding="async"
            />
            {hotelSeoShowsSampleBadge(status) ? <span className="seo-visual-badge">{sample}</span> : null}
          </div>
        ) : (
          <div className="seo-kpi-mock">
            <svg
              viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
              width={HOTEL_SEO_KPI_VISUAL.displayWidth}
              height={HOTEL_SEO_KPI_VISUAL.displayHeight}
              role="img"
              aria-labelledby={`${titleId} ${descId}`}
            >
              <title id={titleId}>{label}</title>
              <desc id={descId}>{`${meta}. ${note}. ${series.map((group, index) => `${group.titleEn}: ${counts[index]}`).join(". ")}`}</desc>
              <rect width={WIDTH} height={HEIGHT} fill="#06182b" />
              <rect width={WIDTH} height="8" fill="#a2dc25" />
              <rect x="24" y="24" width="148" height="22" rx="4" fill="#04121f" />
              <text x="36" y="40" fill="#f2f8e2" fontFamily="Montserrat, Segoe UI, sans-serif" fontSize="11" fontWeight="800" letterSpacing="2">
                SAMPLE DATA
              </text>
              <text x="24" y="64" fill="#ffffff" fontFamily="Montserrat, Segoe UI, sans-serif" fontSize="16" fontWeight="700">
                {label}
              </text>
              {Array.from({ length: 6 }, (_, index) => {
                const value = maxValue - index;
                const y = PAD.top + (plotHeight / maxValue) * index;
                return (
                  <g key={value}>
                    <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y} y2={y} stroke="rgba(242,248,226,0.12)" />
                    <text x={PAD.left - 10} y={y + 4} textAnchor="end" fill="#9bb0c2" fontFamily="Montserrat, Segoe UI, sans-serif" fontSize="11">
                      {value}
                    </text>
                  </g>
                );
              })}
              <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={HEIGHT - PAD.bottom} stroke="#a2dc25" />
              <line x1={PAD.left} x2={WIDTH - PAD.right} y1={HEIGHT - PAD.bottom} y2={HEIGHT - PAD.bottom} stroke="#a2dc25" />
              {series.map((group, index) => {
                const count = counts[index];
                const x = PAD.left + (plotWidth / counts.length) * index + (plotWidth / counts.length - barWidth) / 2;
                const barHeight = (count / maxValue) * plotHeight;
                const y = HEIGHT - PAD.bottom - barHeight;
                return (
                  <g key={group.id}>
                    <rect x={x} y={y} width={barWidth} height={barHeight} rx="6" fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    <text
                      x={x + barWidth / 2}
                      y={y + 22}
                      textAnchor="middle"
                      fill={index % BAR_COLORS.length === 1 ? "#f2f8e2" : "#0b1f33"}
                      fontFamily="Montserrat, Segoe UI, sans-serif"
                      fontSize="12"
                      fontWeight="700"
                    >
                      {count}
                    </text>
                    <text x={x + barWidth / 2} y={HEIGHT - 46} textAnchor="middle" fill="#f2f8e2" fontFamily="Montserrat, Segoe UI, sans-serif" fontSize="11" fontWeight="700">
                      {group.titleEn.replace(" Performance", "").replace("Google ", "")}
                    </text>
                  </g>
                );
              })}
              <text x={PAD.left} y={HEIGHT - 18} fill="#9bb0c2" fontFamily="Montserrat, Segoe UI, sans-serif" fontSize="11">
                {axis}
              </text>
            </svg>
          </div>
        )}
      </div>
      <figcaption className="seo-visual-caption">
        <strong className="ads-hero-caption-label">{label}</strong>
        <span className="seo-visual-meta">{meta}</span>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
