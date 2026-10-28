import {
  HOTEL_SEO_BEHAVIOR_MAP,
  HOTEL_SEO_BEHAVIOR_TYPES,
  HOTEL_SEO_BEHAVIOR_VISUAL,
  hotelSeoSampleLabel,
} from "@/lib/hotel-seo";
import type { Locale } from "@/lib/seo";
import { SeoVisualFrame } from "./SeoVisualFrame";
import "./hotel-seo-visuals.css";

export function HotelSeoSearchBehaviorVisual({
  locale,
  src,
  caption,
  meta,
  alt: altProp,
  label: labelProp,
  status,
}: {
  locale: Locale;
  src?: string;
  caption?: string;
  meta?: string;
  alt?: string;
  label?: string;
  status?: string;
}) {
  const thai = locale === "th";
  const sample = hotelSeoSampleLabel(locale);
  const alt = altProp || (thai ? HOTEL_SEO_BEHAVIOR_VISUAL.alt.th : HOTEL_SEO_BEHAVIOR_VISUAL.alt.en);
  const label = labelProp || (thai ? HOTEL_SEO_BEHAVIOR_VISUAL.label.th : HOTEL_SEO_BEHAVIOR_VISUAL.label.en);
  const visualMeta = meta || (thai ? HOTEL_SEO_BEHAVIOR_VISUAL.meta.th : HOTEL_SEO_BEHAVIOR_VISUAL.meta.en);
  const visualCaption = caption || (thai ? HOTEL_SEO_BEHAVIOR_VISUAL.caption.th : HOTEL_SEO_BEHAVIOR_VISUAL.caption.en);

  return (
    <SeoVisualFrame
      locale={locale}
      src={src}
      alt={alt}
      label={label}
      caption={visualCaption}
      meta={visualMeta}
      status={status}
      width={HOTEL_SEO_BEHAVIOR_VISUAL.displayWidth}
      height={HOTEL_SEO_BEHAVIOR_VISUAL.displayHeight}
      frameClass="seo-behavior-frame"
      visualClass="seo-behavior-visual"
    >
      <div className="seo-mock seo-behavior-mock" role="img" aria-label={`${alt}. ${label}. ${visualMeta}`}>
        <div className="seo-mock__bar" aria-hidden="true" />
        <div className="seo-mock__head">
          <span className="seo-mock__badge">{sample}</span>
          <strong>{label}</strong>
          <small>{visualMeta}</small>
        </div>
        <ol className="seo-behavior-mock__map">
          {HOTEL_SEO_BEHAVIOR_MAP.map((step) => (
            <li key={step.id}>{thai ? step.th : step.en}</li>
          ))}
        </ol>
        <ul className="seo-behavior-mock__types">
          {HOTEL_SEO_BEHAVIOR_TYPES.map((type) => (
            <li key={type.id}>
              <span>{type.num}</span>
              <strong>{thai ? type.titleTh : type.titleEn}</strong>
            </li>
          ))}
        </ul>
        <p className="seo-mock__note">
          {thai
            ? "ตัวอย่างโครงสร้างคำถามและเส้นทาง Local Discovery ไม่ใช่ผล Search, Maps หรือคำตอบ AI จริง"
            : "Sample query structure and local-discovery path. Not a live Search, Maps, or AI answer result"}
        </p>
      </div>
    </SeoVisualFrame>
  );
}
