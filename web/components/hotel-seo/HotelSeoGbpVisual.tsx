import {
  HOTEL_SEO_GBP_ACTIONS,
  HOTEL_SEO_GBP_FIELDS,
  HOTEL_SEO_GBP_VISUAL,
  hotelSeoSampleLabel,
} from "@/lib/hotel-seo";
import type { Locale } from "@/lib/seo";
import { SeoVisualFrame } from "./SeoVisualFrame";
import "./hotel-seo-visuals.css";

export function HotelSeoGbpVisual({
  locale,
  src,
  caption,
  meta,
  alt: altProp,
  label: labelProp,
  status,
  fields,
  actions,
}: {
  locale: Locale;
  src?: string;
  caption?: string;
  meta?: string;
  alt?: string;
  label?: string;
  status?: string;
  fields?: Array<{ id: string; label: string; check: string }>;
  actions?: Array<{ id: string; name: string; label?: string }>;
}) {
  const thai = locale === "th";
  const sample = hotelSeoSampleLabel(locale);
  const alt = altProp || (thai ? HOTEL_SEO_GBP_VISUAL.alt.th : HOTEL_SEO_GBP_VISUAL.alt.en);
  const label = labelProp || (thai ? HOTEL_SEO_GBP_VISUAL.label.th : HOTEL_SEO_GBP_VISUAL.label.en);
  const visualMeta = meta || (thai ? HOTEL_SEO_GBP_VISUAL.meta.th : HOTEL_SEO_GBP_VISUAL.meta.en);
  const visualCaption = caption || (thai ? HOTEL_SEO_GBP_VISUAL.caption.th : HOTEL_SEO_GBP_VISUAL.caption.en);

  return (
    <SeoVisualFrame
      locale={locale}
      src={src}
      alt={alt}
      label={label}
      caption={visualCaption}
      meta={visualMeta}
      status={status}
      width={HOTEL_SEO_GBP_VISUAL.displayWidth}
      height={HOTEL_SEO_GBP_VISUAL.displayHeight}
      frameClass="seo-gbp-frame"
      visualClass="seo-gbp-visual"
    >
      <div className="seo-mock seo-gbp-mock" role="img" aria-label={`${alt}. ${label}. ${visualMeta}`}>
        <div className="seo-mock__bar" aria-hidden="true" />
        <div className="seo-mock__head">
          <span className="seo-mock__badge">{sample}</span>
          <strong>{label}</strong>
          <small>{visualMeta}</small>
        </div>
        <p className="seo-gbp-mock__name">{thai ? "โรงแรม •••••" : "Hotel •••••"}</p>
        <ul className="seo-gbp-fields">
          {(fields?.length
            ? fields
            : HOTEL_SEO_GBP_FIELDS.map((field) => ({
                id: field.id,
                label: thai ? field.th : field.en,
                check: thai ? field.checkTh : field.checkEn,
              }))
          ).map((field) => (
            <li key={field.id}>
              <strong>{field.label}</strong>
              <span>{field.check}</span>
            </li>
          ))}
        </ul>
        <div className="seo-gbp-mock__actions">
          {(actions?.length
            ? actions
            : HOTEL_SEO_GBP_ACTIONS.map((action) => ({ id: action.id, name: action.name }))
          ).map((action) => (
            <span key={action.id} className="kpi-latin">
              {action.name}
            </span>
          ))}
        </div>
        <p className="seo-mock__note">
          {thai
            ? "ตัวอย่างข้อมูล · ปิดรหัสบัญชี อีเมล ชื่อผู้รีวิว และบันทึกภายใน ไม่ใช่ผลอันดับ Maps"
            : "Sample data · account IDs, email, review authors, and internal notes redacted. Not a Maps rank"}
        </p>
      </div>
    </SeoVisualFrame>
  );
}
