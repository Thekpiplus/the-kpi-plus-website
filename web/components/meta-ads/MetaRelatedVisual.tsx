import { META_RELATED_VISUAL, META_RELATED_VISUAL_OPTIONS, metaSampleLabel, metaShowsSampleBadge } from "@/lib/meta-ads";
import type { Locale } from "@/lib/seo";
import "./meta-ads-visuals.css";

export function MetaRelatedVisual({
  src,
  locale,
  caption,
  alt: altProp,
  label: labelProp,
  status,
}: {
  src?: string;
  locale: Locale;
  caption?: string;
  alt?: string;
  label?: string;
  status?: string;
}) {
  const fileSrc = src?.trim() || "";
  const hasAsset = Boolean(fileSrc);
  const thai = locale === "th";
  const sample = metaSampleLabel(locale);
  const alt = altProp || (thai ? META_RELATED_VISUAL.alt.th : META_RELATED_VISUAL.alt.en);
  const label = labelProp || (thai ? META_RELATED_VISUAL.label.th : META_RELATED_VISUAL.label.en);
  const visualCaption = caption || (thai ? META_RELATED_VISUAL.caption.th : META_RELATED_VISUAL.caption.en);
  const visualMeta = thai ? META_RELATED_VISUAL.meta.th : META_RELATED_VISUAL.meta.en;
  const recommended = thai
    ? `ขนาดแนะนำ ${META_RELATED_VISUAL.recommendedSize}`
    : `Recommended ${META_RELATED_VISUAL.recommendedSize}`;

  return (
    <figure className="ads-visual ads-related-visual">
      <div className="ads-visual-frame ads-related-frame">
        {hasAsset ? (
          <>
            <img
              src={fileSrc}
              alt={alt}
              width={META_RELATED_VISUAL.displayWidth}
              height={META_RELATED_VISUAL.displayHeight}
              loading="lazy"
              decoding="async"
            />
            {metaShowsSampleBadge(status) ? <span className="ads-visual-badge">{sample}</span> : null}
          </>
        ) : (
          <div className="ads-mock ads-related-mock" role="img" aria-label={`${alt}. ${label}. ${visualMeta}. ${recommended}`}>
            <div className="ads-mock__bar" aria-hidden="true" />
            <div className="ads-mock__head">
              <span className="ads-mock__badge">{sample}</span>
              <strong>{label}</strong>
              <small>{visualMeta}</small>
            </div>
            <ul className="ads-related-mock__list">
              {META_RELATED_VISUAL_OPTIONS.map((item) => (
                <li key={item.id}>
                  <span className="kpi-latin">{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <figcaption className="ads-visual-caption">
        <strong className="ads-hero-caption-label">{label}</strong>
        <span className="ads-visual-meta">{visualMeta}</span>
        <span>{visualCaption}</span>
      </figcaption>
    </figure>
  );
}
