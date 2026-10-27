import { ADS_FRAMEWORK_ROWS, ADS_READINESS_VISUAL, adsSampleLabel, adsShowsSampleBadge } from "@/lib/google-ads";
import type { Locale } from "@/lib/seo";
import "./google-ads-visuals.css";

export function AdsFrameworkVisual({
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
  const sample = adsSampleLabel(locale);
  const alt = altProp || (thai ? ADS_READINESS_VISUAL.alt.th : ADS_READINESS_VISUAL.alt.en);
  const label = labelProp || (thai ? ADS_READINESS_VISUAL.label.th : ADS_READINESS_VISUAL.label.en);
  const visualMeta = meta || (thai ? ADS_READINESS_VISUAL.meta.th : ADS_READINESS_VISUAL.meta.en);
  const visualCaption = caption || (thai ? ADS_READINESS_VISUAL.caption.th : ADS_READINESS_VISUAL.caption.en);

  return (
    <figure className="ads-visual ads-framework-visual">
      <div className="ads-visual-frame ads-framework-frame">
        {hasAsset ? (
          <div className="ads-framework-asset">
            <img
              src={fileSrc}
              alt={alt}
              width={ADS_READINESS_VISUAL.displayWidth}
              height={ADS_READINESS_VISUAL.displayHeight}
              loading="lazy"
              decoding="async"
            />
            {adsShowsSampleBadge(status) ? <span className="ads-visual-badge">{sample}</span> : null}
          </div>
        ) : (
          <div className="ads-mock ads-framework-mock" role="img" aria-label={`${alt}. ${label}. ${visualMeta}`}>
            <div className="ads-mock__bar" aria-hidden="true" />
            <div className="ads-mock__head">
              <span className="ads-mock__badge">{sample}</span>
              <strong>{label}</strong>
              <small>{visualMeta}</small>
            </div>
            <ol className="ads-framework-mock__areas">
              {ADS_FRAMEWORK_ROWS.map((row) => (
                <li key={row.id}>
                  <span className="kpi-latin">{row.area}</span>
                  <small className="kpi-latin">{thai ? row.outputTh : row.outputEn}</small>
                </li>
              ))}
            </ol>
            <p className="ads-mock__note">
              {thai ? "กรอบตัวอย่าง ไม่ใช่ผลแคมเปญหรืออันดับบน Google" : "Sample framework, not campaign results or a ranking"}
            </p>
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
