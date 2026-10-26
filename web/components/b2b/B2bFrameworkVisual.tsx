import { B2B_FRAMEWORK_ROWS, B2B_FRAMEWORK_VISUAL } from "@/lib/b2b";
import type { Locale } from "@/lib/seo";
import "./b2b-ops.css";

export function B2bFrameworkVisual({
  src,
  locale,
  caption,
  meta,
  alt: altProp,
  label: labelProp,
}: {
  src?: string;
  locale: Locale;
  caption?: string;
  meta?: string;
  alt?: string;
  label?: string;
}) {
  const fileSrc = src?.trim() || "";
  const hasAsset = Boolean(fileSrc);
  const thai = locale === "th";
  const sample = thai ? B2B_FRAMEWORK_VISUAL.sample.th : B2B_FRAMEWORK_VISUAL.sample.en;
  const alt = altProp || (thai ? B2B_FRAMEWORK_VISUAL.alt.th : B2B_FRAMEWORK_VISUAL.alt.en);
  const label = labelProp || B2B_FRAMEWORK_VISUAL.label.en;
  const visualMeta = meta || (thai ? B2B_FRAMEWORK_VISUAL.meta.th : B2B_FRAMEWORK_VISUAL.meta.en);
  const visualCaption = caption || (thai ? B2B_FRAMEWORK_VISUAL.caption.th : B2B_FRAMEWORK_VISUAL.caption.en);
  const recommended = thai
    ? `ขนาดแนะนำ ${B2B_FRAMEWORK_VISUAL.recommendedSize}`
    : `Recommended ${B2B_FRAMEWORK_VISUAL.recommendedSize}`;

  return (
    <figure className="kpi-b2b-framework-visual">
      <div className="kpi-b2b-framework-visual-frame">
        {hasAsset ? (
          <>
            <img
              src={fileSrc}
              alt={alt}
              width={B2B_FRAMEWORK_VISUAL.displayWidth}
              height={B2B_FRAMEWORK_VISUAL.displayHeight}
              loading="lazy"
              decoding="async"
            />
            <span className="kpi-b2b-framework-visual-badge">{sample}</span>
          </>
        ) : (
          <div className="b2b-framework-mock" role="img" aria-label={`${alt}. ${label}. ${visualMeta}. ${recommended}`}>
            <div className="b2b-framework-mock__bar" aria-hidden="true" />
            <div className="b2b-framework-mock__head">
              <span className="b2b-framework-mock__badge">{sample}</span>
              <strong>{label}</strong>
              <small>{visualMeta}</small>
            </div>
            <ol className="b2b-framework-mock__rows">
              {B2B_FRAMEWORK_ROWS.map((row) => (
                <li key={row.id}>
                  <span>{row.area}</span>
                  <small>{thai ? row.outputTh : row.outputEn}</small>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
      <figcaption className="kpi-b2b-framework-visual-caption">
        <span className="kpi-b2b-framework-visual-meta">{visualMeta}</span>
        <span>{visualCaption}</span>
      </figcaption>
    </figure>
  );
}
