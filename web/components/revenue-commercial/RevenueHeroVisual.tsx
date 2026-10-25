import { OCCUPANCY_SAMPLE_SERIES } from "@/lib/occupancy-sample";
import { REVENUE_HERO_VISUAL } from "@/lib/revenue";
import type { Locale } from "@/lib/seo";
import "./revenue-commercial.css";

type RevenueHeroVisualProps = {
  src?: string;
  locale: Locale;
  caption: string;
  meta: string;
  alt?: string;
  label?: string;
  showSample?: boolean;
};

const PANELS = [
  { id: "revenue", title: "Revenue", hint: "Occupancy outlook" },
  { id: "demand", title: "Demand", hint: "Booking pace" },
  { id: "channel", title: "Channel", hint: "Mix layout" },
] as const;

function sparkPath(values: readonly number[], width: number, height: number) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);
  const padX = 4;
  const padY = 6;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;

  return values
    .map((value, index) => {
      const x = padX + (index / Math.max(1, values.length - 1)) * innerW;
      const y = padY + (1 - (value - min) / range) * innerH;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

function MiniSpark({
  values,
  color,
}: {
  values: readonly number[];
  color: string;
}) {
  const width = 160;
  const height = 44;
  return (
    <svg className="revenue-hero-mock__spark" viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <path
        d={sparkPath(values, width, height)}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RevenueHeroVisual({
  src,
  locale,
  caption,
  meta,
  alt: altProp,
  label: labelProp,
  showSample = true,
}: RevenueHeroVisualProps) {
  const hasAsset = Boolean(src?.trim());
  const isThai = locale === "th";
  const alt = altProp || (isThai ? REVENUE_HERO_VISUAL.alt.th : REVENUE_HERO_VISUAL.alt.en);
  const label = labelProp || (isThai ? REVENUE_HERO_VISUAL.label.th : REVENUE_HERO_VISUAL.label.en);
  const sampleLabel = isThai ? "ตัวอย่างข้อมูล" : "Sample data";
  const recommendedLabel = isThai
    ? `ขนาดแนะนำ ${REVENUE_HERO_VISUAL.recommendedSize}`
    : `Recommended ${REVENUE_HERO_VISUAL.recommendedSize}`;

  return (
    <figure className="kpi-revenue-hero-visual">
      {hasAsset ? (
        <div className="kpi-revenue-hero-visual-frame">
          <img
            src={src}
            alt={alt}
            width={REVENUE_HERO_VISUAL.displayWidth}
            height={REVENUE_HERO_VISUAL.displayHeight}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          {showSample ? <span className="kpi-revenue-hero-visual-badge">{sampleLabel}</span> : null}
        </div>
      ) : (
        <div
          className="revenue-hero-mock"
          role="img"
          aria-label={`${alt}. ${label}. ${meta}. ${recommendedLabel}`}
        >
          <div className="revenue-hero-mock__bar" aria-hidden="true" />
          <div className="revenue-hero-mock__head">
            <span className="revenue-hero-mock__badge">{sampleLabel}</span>
            <strong>{label}</strong>
            <small>{meta}</small>
          </div>
          <div className="revenue-hero-mock__panels">
            {PANELS.map((panel) => (
              <div key={panel.id} className={`revenue-hero-mock__panel revenue-hero-mock__panel--${panel.id}`}>
                <span>{panel.title}</span>
                <small>{panel.hint}</small>
                {panel.id === "revenue" ? (
                  <MiniSpark values={OCCUPANCY_SAMPLE_SERIES.forecast} color="#A2DC25" />
                ) : null}
                {panel.id === "demand" ? (
                  <MiniSpark values={OCCUPANCY_SAMPLE_SERIES.pace} color="#EBE722" />
                ) : null}
                {panel.id === "channel" ? (
                  <div className="revenue-hero-mock__mix" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <p className="revenue-hero-mock__note">
            {isThai ? "แผนภาพตัวอย่าง ไม่ใช่ผลลัพธ์ของโรงแรม" : "Sample layout, not a hotel result"}
          </p>
        </div>
      )}
      <figcaption className="kpi-revenue-hero-visual-caption">
        <span className="kpi-revenue-hero-visual-meta">{meta}</span>
        <span>{caption}</span>
      </figcaption>
    </figure>
  );
}
