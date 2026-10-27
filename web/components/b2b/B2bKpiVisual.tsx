import { B2B_KPIS, B2B_KPI_VISUAL, b2bShowsSampleBadge } from "@/lib/b2b";
import type { Locale } from "@/lib/seo";
import "./b2b-ops.css";

export function B2bKpiVisual({
  src,
  locale,
  caption,
  meta,
  alt: altProp,
  label: labelProp,
  status,
}: {
  src?: string;
  locale: Locale;
  caption?: string;
  meta?: string;
  alt?: string;
  label?: string;
  status?: string;
}) {
  const fileSrc = src?.trim() || "";
  const hasAsset = Boolean(fileSrc);
  const thai = locale === "th";
  const sample = thai ? B2B_KPI_VISUAL.sample.th : B2B_KPI_VISUAL.sample.en;
  const alt = altProp || (thai ? B2B_KPI_VISUAL.alt.th : B2B_KPI_VISUAL.alt.en);
  const label = labelProp || (thai ? B2B_KPI_VISUAL.label.th : B2B_KPI_VISUAL.label.en);
  const visualMeta = meta || (thai ? B2B_KPI_VISUAL.meta.th : B2B_KPI_VISUAL.meta.en);
  const visualCaption = caption || (thai ? B2B_KPI_VISUAL.caption.th : B2B_KPI_VISUAL.caption.en);
  const recommended = thai
    ? `ขนาดแนะนำ ${B2B_KPI_VISUAL.recommendedSize}`
    : `Recommended ${B2B_KPI_VISUAL.recommendedSize}`;

  return (
    <figure className="kpi-b2b-kpi-visual">
      <div className="kpi-b2b-kpi-visual-frame">
        {hasAsset ? (
          <>
            <img
              src={fileSrc}
              alt={alt}
              width={B2B_KPI_VISUAL.displayWidth}
              height={B2B_KPI_VISUAL.displayHeight}
              loading="lazy"
              decoding="async"
            />
            {b2bShowsSampleBadge(status) ? <span className="kpi-b2b-kpi-visual-badge">{sample}</span> : null}
          </>
        ) : (
          <div className="b2b-kpi-mock" role="img" aria-label={`${alt}. ${label}. ${visualMeta}. ${recommended}`}>
            <div className="b2b-kpi-mock__bar" aria-hidden="true" />
            <div className="b2b-kpi-mock__head">
              <span className="b2b-kpi-mock__badge">{sample}</span>
              <strong>{label}</strong>
              {visualMeta && visualMeta !== label ? <small>{visualMeta}</small> : null}
            </div>
            <ul className="b2b-kpi-mock__grid">
              {B2B_KPIS.map((kpi) => (
                <li key={kpi.id}>
                  <span className="kpi-latin">{kpi.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <figcaption className="kpi-b2b-kpi-visual-caption">
        <span className="kpi-b2b-kpi-visual-meta">{visualMeta}</span>
        <span>{visualCaption}</span>
      </figcaption>
    </figure>
  );
}
