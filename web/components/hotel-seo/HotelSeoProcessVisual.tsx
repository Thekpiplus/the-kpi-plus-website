import {
  HOTEL_SEO_PROCESS_STEPS,
  HOTEL_SEO_PROCESS_VISUAL,
  hotelSeoSampleLabel,
  hotelSeoShowsSampleBadge,
} from "@/lib/hotel-seo";
import type { Locale } from "@/lib/seo";
import "./hotel-seo-visuals.css";

export function HotelSeoProcessVisual({
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
  const alt = thai ? HOTEL_SEO_PROCESS_VISUAL.alt.th : HOTEL_SEO_PROCESS_VISUAL.alt.en;
  const label = thai ? HOTEL_SEO_PROCESS_VISUAL.label.th : HOTEL_SEO_PROCESS_VISUAL.label.en;
  const meta = thai ? HOTEL_SEO_PROCESS_VISUAL.meta.th : HOTEL_SEO_PROCESS_VISUAL.meta.en;
  const caption = thai ? HOTEL_SEO_PROCESS_VISUAL.caption.th : HOTEL_SEO_PROCESS_VISUAL.caption.en;
  const fileSrc = src?.trim() || "";

  return (
    <figure className="seo-visual seo-process-visual">
      <div className="seo-visual-frame seo-process-frame">
        {fileSrc ? (
          <div className="seo-visual-asset">
            <img
              src={fileSrc}
              alt={alt}
              width={HOTEL_SEO_PROCESS_VISUAL.displayWidth}
              height={HOTEL_SEO_PROCESS_VISUAL.displayHeight}
              loading="lazy"
              decoding="async"
            />
            {hotelSeoShowsSampleBadge(status) ? <span className="seo-visual-badge">{sample}</span> : null}
          </div>
        ) : (
          <div className="seo-mock seo-process-mock" role="img" aria-label={`${alt}. ${label}. ${meta}`}>
            <div className="seo-mock__bar" aria-hidden="true" />
            <div className="seo-mock__head">
              <span className="seo-mock__badge">{sample}</span>
              <strong>{label}</strong>
              <small>{meta}</small>
            </div>
            <ol className="seo-process-stages">
              {HOTEL_SEO_PROCESS_STEPS.map((step, index) => (
                <li key={step.id}>
                  <span className="kpi-latin seo-process-stage-num">{step.num}</span>
                  <strong className="kpi-latin">{step.phase}</strong>
                  <small className="kpi-latin">{thai ? step.outputTh : step.outputEn}</small>
                  {index < HOTEL_SEO_PROCESS_STEPS.length - 1 ? (
                    <svg className="seo-process-arrow" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4 12h14M13 6l7 6-7 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : null}
                </li>
              ))}
            </ol>
            <p className="seo-mock__note">
              {thai
                ? "ตัวอย่างเส้นทางงาน ไม่ใช่รูปประชุม และไม่ใช่ผลอันดับหรือยอดจอง"
                : "Sample process path. Not a meeting photo, ranking, or booking result"}
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
