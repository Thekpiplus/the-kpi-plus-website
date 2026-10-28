import {
  HOTEL_SEO_RELATED_VISUAL,
  HOTEL_SEO_RELATED_VISUAL_OPTIONS,
  hotelSeoSampleLabel,
  hotelSeoShowsSampleBadge,
} from "@/lib/hotel-seo";
import type { Locale } from "@/lib/seo";
import "./hotel-seo-visuals.css";

export function HotelSeoRelatedVisual({
  locale,
  src,
  status,
}: {
  locale: Locale;
  src?: string;
  status?: string;
}) {
  const thai = locale === "th";
  const sample = hotelSeoSampleLabel(locale);
  const alt = thai ? HOTEL_SEO_RELATED_VISUAL.alt.th : HOTEL_SEO_RELATED_VISUAL.alt.en;
  const label = thai ? HOTEL_SEO_RELATED_VISUAL.label.th : HOTEL_SEO_RELATED_VISUAL.label.en;
  const meta = thai ? HOTEL_SEO_RELATED_VISUAL.meta.th : HOTEL_SEO_RELATED_VISUAL.meta.en;
  const caption = thai ? HOTEL_SEO_RELATED_VISUAL.caption.th : HOTEL_SEO_RELATED_VISUAL.caption.en;
  const fileSrc = src?.trim() || "";

  return (
    <figure className="seo-visual seo-related-visual">
      <div className="seo-visual-frame seo-related-frame">
        {fileSrc ? (
          <div className="seo-visual-asset">
            <img
              src={fileSrc}
              alt={alt}
              width={HOTEL_SEO_RELATED_VISUAL.displayWidth}
              height={HOTEL_SEO_RELATED_VISUAL.displayHeight}
              loading="lazy"
              decoding="async"
            />
            {hotelSeoShowsSampleBadge(status) ? <span className="seo-visual-badge">{sample}</span> : null}
          </div>
        ) : (
          <div className="seo-mock seo-related-mock" role="img" aria-label={`${alt}. ${label}. ${meta}`}>
            <div className="seo-mock__bar" aria-hidden="true" />
            <div className="seo-mock__head">
              <span className="seo-mock__badge">{sample}</span>
              <strong>{label}</strong>
              <small>{meta}</small>
            </div>
            <ul className="seo-related-options">
              {HOTEL_SEO_RELATED_VISUAL_OPTIONS.map((item) => (
                <li key={item.id}>
                  <span className="kpi-latin">{item.label}</span>
                </li>
              ))}
            </ul>
            <p className="seo-mock__note">
              {thai
                ? "กรอบเนื้อหาตัวอย่าง ไม่ใช่รูป Hero หรือ Google Business Profile และไม่ใช่ผลอันดับ"
                : "Sample content frame. Not the hero or Google Business Profile image, and not a ranking result"}
            </p>
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
