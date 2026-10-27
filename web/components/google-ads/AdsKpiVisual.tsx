import { ADS_KPIS, ADS_KPI_VISUAL, adsSampleLabel, adsShowsSampleBadge } from "@/lib/google-ads";
import type { Locale } from "@/lib/seo";
import "./google-ads-visuals.css";

export function AdsKpiVisual({
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
  const alt = altProp || (thai ? ADS_KPI_VISUAL.alt.th : ADS_KPI_VISUAL.alt.en);
  const label = labelProp || (thai ? ADS_KPI_VISUAL.label.th : ADS_KPI_VISUAL.label.en);
  const visualMeta = meta || (thai ? ADS_KPI_VISUAL.meta.th : ADS_KPI_VISUAL.meta.en);
  const visualCaption = caption || (thai ? ADS_KPI_VISUAL.caption.th : ADS_KPI_VISUAL.caption.en);

  return (
    <figure className="ads-visual ads-kpi-visual">
      <div className="ads-visual-frame ads-kpi-frame">
        {hasAsset ? (
          <div className="ads-kpi-asset">
            <img
              src={fileSrc}
              alt={alt}
              width={ADS_KPI_VISUAL.displayWidth}
              height={ADS_KPI_VISUAL.displayHeight}
              loading="lazy"
              decoding="async"
            />
            {adsShowsSampleBadge(status) ? <span className="ads-visual-badge">{sample}</span> : null}
          </div>
        ) : (
          <div className="ads-mock ads-kpi-mock" role="img" aria-label={`${alt}. ${label}. ${visualMeta}`}>
            <div className="ads-mock__bar" aria-hidden="true" />
            <div className="ads-mock__head">
              <span className="ads-mock__badge">{sample}</span>
              <strong>{label}</strong>
              <small>{visualMeta}</small>
            </div>
            <ul className="ads-kpi-mock__slots">
              {ADS_KPIS.map((kpi) => (
                <li key={kpi.id} className="ads-kpi-mock__slot">
                  <span className="kpi-latin">{kpi.name}</span>
                  <small>{thai ? kpi.definitionTh : kpi.definitionEn}</small>
                </li>
              ))}
            </ul>
            <p className="ads-mock__note">
              {thai ? "กรอบตัวอย่าง ไม่มี CTR CPC ROAS หรือยอดจองจริง" : "Sample frame, not a live CTR, CPC, ROAS, or booking figure"}
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
