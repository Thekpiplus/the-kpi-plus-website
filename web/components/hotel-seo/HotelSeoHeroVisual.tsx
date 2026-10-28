import { HOTEL_SEO_HERO_VISUAL, hotelSeoSampleLabel } from "@/lib/hotel-seo";
import type { Locale } from "@/lib/seo";
import { SeoVisualFrame } from "./SeoVisualFrame";
import "./hotel-seo-visuals.css";

const PANELS = [
  { titleTh: "01 Search / AI", titleEn: "01 Search / AI", hintTh: "ข้อมูลธุรกิจที่ชัดและสอดคล้องกัน", hintEn: "Clear, consistent business facts" },
  { titleTh: "02 Maps / Profile", titleEn: "02 Maps / Profile", hintTh: "รองรับการตัดสินใจชุดเดียวกัน", hintEn: "The same customer decision" },
  { titleTh: "03 Website", titleEn: "03 Website", hintTh: "หน้าธุรกิจที่มีประโยชน์", hintEn: "A useful business page" },
  { titleTh: "04 Contact / Booking", titleEn: "04 Contact / Booking", hintTh: "เส้นทางที่วัดผลได้", hintEn: "A measurable contact path" },
] as const;

export function HotelSeoHeroVisual({
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
  const alt = altProp || (thai ? HOTEL_SEO_HERO_VISUAL.alt.th : HOTEL_SEO_HERO_VISUAL.alt.en);
  const label = labelProp || (thai ? HOTEL_SEO_HERO_VISUAL.label.th : HOTEL_SEO_HERO_VISUAL.label.en);
  const visualMeta = meta || (thai ? HOTEL_SEO_HERO_VISUAL.meta.th : HOTEL_SEO_HERO_VISUAL.meta.en);
  const visualCaption = caption || (thai ? HOTEL_SEO_HERO_VISUAL.caption.th : HOTEL_SEO_HERO_VISUAL.caption.en);

  return (
    <SeoVisualFrame
      locale={locale}
      src={src}
      alt={alt}
      label={label}
      caption={visualCaption}
      meta={visualMeta}
      status={status}
      eager
      width={HOTEL_SEO_HERO_VISUAL.displayWidth}
      height={HOTEL_SEO_HERO_VISUAL.displayHeight}
      frameClass="seo-hero-frame"
      visualClass="seo-hero-visual"
    >
      <div className="seo-mock seo-hero-mock" role="img" aria-label={`${alt}. ${label}. ${visualMeta}`}>
        <div className="seo-mock__bar" aria-hidden="true" />
        <div className="seo-mock__head">
          <span className="seo-mock__badge">{sample}</span>
          <strong>{label}</strong>
          <small>{visualMeta}</small>
        </div>
        <div className="seo-hero-mock__panels">
          {PANELS.map((panel) => (
            <div key={panel.titleEn}>
              <span>{thai ? panel.titleTh : panel.titleEn}</span>
              <small>{thai ? panel.hintTh : panel.hintEn}</small>
            </div>
          ))}
        </div>
        <p className="seo-mock__note">
          {thai ? "ตัวอย่างข้อมูล ไม่ใช่ผล Search, Maps หรือคำตอบ AI ของโรงแรม" : "Sample data · not hotel Search, Maps, or AI answer results"}
        </p>
      </div>
    </SeoVisualFrame>
  );
}
