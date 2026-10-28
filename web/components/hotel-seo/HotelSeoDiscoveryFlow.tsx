import {
  HOTEL_SEO_FLOW_STAGES,
  HOTEL_SEO_FLOW_VISUAL,
  hotelSeoSampleLabel,
  hotelSeoShowsSampleBadge,
} from "@/lib/hotel-seo";
import type { Locale } from "@/lib/seo";
import "./hotel-seo-visuals.css";

export function HotelSeoDiscoveryFlow({
  locale,
  src,
  status,
  alt: altProp,
  label: labelProp,
  caption: captionProp,
  stages,
}: {
  locale: Locale;
  src?: string;
  status?: string;
  alt?: string;
  label?: string;
  caption?: string;
  stages?: Array<{ id: string; label: string; output: string }>;
}) {
  const thai = locale === "th";
  const sample = hotelSeoSampleLabel(locale);
  const alt = altProp || (thai ? HOTEL_SEO_FLOW_VISUAL.alt.th : HOTEL_SEO_FLOW_VISUAL.alt.en);
  const label = labelProp || (thai ? HOTEL_SEO_FLOW_VISUAL.label.th : HOTEL_SEO_FLOW_VISUAL.label.en);
  const meta = thai ? HOTEL_SEO_FLOW_VISUAL.meta.th : HOTEL_SEO_FLOW_VISUAL.meta.en;
  const caption = captionProp || (thai ? HOTEL_SEO_FLOW_VISUAL.caption.th : HOTEL_SEO_FLOW_VISUAL.caption.en);
  const fileSrc = src?.trim() || "";
  const flowStages =
    stages?.length
      ? stages
      : HOTEL_SEO_FLOW_STAGES.map((stage) => ({
          id: stage.id,
          label: thai ? stage.th : stage.en,
          output: thai ? stage.outputTh : stage.outputEn,
        }));

  return (
    <figure className="seo-visual seo-flow-visual">
      <div className="seo-visual-frame seo-flow-frame">
        {fileSrc ? (
          <div className="seo-visual-asset">
            <img
              src={fileSrc}
              alt={alt}
              width={HOTEL_SEO_FLOW_VISUAL.displayWidth}
              height={HOTEL_SEO_FLOW_VISUAL.displayHeight}
              loading="lazy"
              decoding="async"
            />
            {hotelSeoShowsSampleBadge(status) ? <span className="seo-visual-badge">{sample}</span> : null}
          </div>
        ) : (
          <div className="seo-mock seo-flow-mock" role="img" aria-label={`${alt}. ${label}. ${meta}`}>
            <div className="seo-mock__bar" aria-hidden="true" />
            <div className="seo-mock__head">
              <span className="seo-mock__badge">{sample}</span>
              <strong>{label}</strong>
              <small>{meta}</small>
            </div>
            <ol className="seo-flow-stages">
              {flowStages.map((stage, index) => (
                <li key={stage.id}>
                  <span className="kpi-latin seo-flow-stage-num">{String(index + 1).padStart(2, "0")}</span>
                  <strong className="kpi-latin">{stage.label}</strong>
                  <small className="kpi-latin">{stage.output}</small>
                  {index < flowStages.length - 1 ? (
                    <svg className="seo-flow-arrow" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4 12h14M13 6l7 6-7 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : null}
                </li>
              ))}
            </ol>
            <p className="seo-mock__note">
              {thai
                ? "ตัวอย่างเส้นทาง ไม่ใช่ผล Search, Maps, คำตอบ AI หรือการจองของโรงแรม"
                : "Sample path. Not a hotel Search, Maps, AI answer, or booking result"}
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
