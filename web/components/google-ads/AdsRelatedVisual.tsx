import { ADS_RELATED_VISUAL, ADS_RELATED_VISUAL_OPTIONS, adsSampleLabel, adsShowsSampleBadge } from "@/lib/google-ads";
import type { Locale } from "@/lib/seo";
import "./google-ads-visuals.css";

export function AdsRelatedVisual({
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
  const sample = adsSampleLabel(locale);
  const alt = altProp || (thai ? ADS_RELATED_VISUAL.alt.th : ADS_RELATED_VISUAL.alt.en);
  const label = labelProp || (thai ? ADS_RELATED_VISUAL.label.th : ADS_RELATED_VISUAL.label.en);
  const visualCaption = caption || (thai ? ADS_RELATED_VISUAL.caption.th : ADS_RELATED_VISUAL.caption.en);
  const visualMeta = thai ? ADS_RELATED_VISUAL.meta.th : ADS_RELATED_VISUAL.meta.en;
  const recommended = thai
    ? `ขนาดแนะนำ ${ADS_RELATED_VISUAL.recommendedSize}`
    : `Recommended ${ADS_RELATED_VISUAL.recommendedSize}`;

  return (
    <figure className="ads-visual ads-related-visual">
      <div className="ads-visual-frame ads-related-frame">
        {hasAsset ? (
          <>
            <img
              src={fileSrc}
              alt={alt}
              width={ADS_RELATED_VISUAL.displayWidth}
              height={ADS_RELATED_VISUAL.displayHeight}
              loading="lazy"
              decoding="async"
            />
            {adsShowsSampleBadge(status) ? <span className="ads-visual-badge">{sample}</span> : null}
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
              {ADS_RELATED_VISUAL_OPTIONS.map((item) => (
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
