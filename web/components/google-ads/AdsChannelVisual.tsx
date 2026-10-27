import { ADS_CHANNEL_ROWS, ADS_CHANNEL_VISUAL, adsSampleLabel, adsShowsSampleBadge } from "@/lib/google-ads";
import type { Locale } from "@/lib/seo";
import "./google-ads-visuals.css";

export function AdsChannelVisual({
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
  const alt = altProp || (thai ? ADS_CHANNEL_VISUAL.alt.th : ADS_CHANNEL_VISUAL.alt.en);
  const label = labelProp || (thai ? ADS_CHANNEL_VISUAL.label.th : ADS_CHANNEL_VISUAL.label.en);
  const visualMeta = meta || (thai ? ADS_CHANNEL_VISUAL.meta.th : ADS_CHANNEL_VISUAL.meta.en);
  const visualCaption = caption || (thai ? ADS_CHANNEL_VISUAL.caption.th : ADS_CHANNEL_VISUAL.caption.en);

  return (
    <figure className="ads-visual ads-channel-visual">
      <div className="ads-visual-frame ads-channel-frame">
        {hasAsset ? (
          <div className="ads-channel-asset">
            <img
              src={fileSrc}
              alt={alt}
              width={ADS_CHANNEL_VISUAL.displayWidth}
              height={ADS_CHANNEL_VISUAL.displayHeight}
              loading="lazy"
              decoding="async"
            />
            {adsShowsSampleBadge(status) ? <span className="ads-visual-badge">{sample}</span> : null}
          </div>
        ) : (
          <div className="ads-mock ads-channel-mock" role="img" aria-label={`${alt}. ${label}. ${visualMeta}`}>
            <div className="ads-mock__bar" aria-hidden="true" />
            <div className="ads-mock__head">
              <span className="ads-mock__badge">{sample}</span>
              <strong>{label}</strong>
              <small>{visualMeta}</small>
            </div>
            <ol className="ads-channel-mock__cols">
              {ADS_CHANNEL_ROWS.map((row) => (
                <li key={row.id}>
                  <span className="kpi-latin">{row.channel}</span>
                  <small>{thai ? row.useCaseTh : row.useCaseEn}</small>
                </li>
              ))}
            </ol>
            <p className="ads-mock__note">
              {thai
                ? "กรอบตัวอย่าง ไม่ใช่ภาพผลการค้นหาหรือตัวเลขบัญชีโฆษณา"
                : "Sample comparison, not a search screenshot or live ad-account figure"}
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
