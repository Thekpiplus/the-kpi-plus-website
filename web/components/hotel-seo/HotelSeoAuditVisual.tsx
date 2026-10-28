import { HOTEL_SEO_AUDIT_VISUAL, HOTEL_SEO_LISTING_ROWS, hotelSeoSampleLabel } from "@/lib/hotel-seo";
import type { Locale } from "@/lib/seo";
import { SeoVisualFrame } from "./SeoVisualFrame";
import "./hotel-seo-visuals.css";

export function HotelSeoAuditVisual({
  locale,
  src,
  caption,
  meta,
  alt: altProp,
  label: labelProp,
  status,
  rows,
}: {
  locale: Locale;
  src?: string;
  caption?: string;
  meta?: string;
  alt?: string;
  label?: string;
  status?: string;
  rows?: Array<{ id: string; area: string; check: string }>;
}) {
  const thai = locale === "th";
  const sample = hotelSeoSampleLabel(locale);
  const alt = altProp || (thai ? HOTEL_SEO_AUDIT_VISUAL.alt.th : HOTEL_SEO_AUDIT_VISUAL.alt.en);
  const label = labelProp || (thai ? HOTEL_SEO_AUDIT_VISUAL.label.th : HOTEL_SEO_AUDIT_VISUAL.label.en);
  const visualMeta = meta || (thai ? HOTEL_SEO_AUDIT_VISUAL.meta.th : HOTEL_SEO_AUDIT_VISUAL.meta.en);
  const visualCaption = caption || (thai ? HOTEL_SEO_AUDIT_VISUAL.caption.th : HOTEL_SEO_AUDIT_VISUAL.caption.en);

  return (
    <SeoVisualFrame
      locale={locale}
      src={src}
      alt={alt}
      label={label}
      caption={visualCaption}
      meta={visualMeta}
      status={status}
      width={HOTEL_SEO_AUDIT_VISUAL.displayWidth}
      height={HOTEL_SEO_AUDIT_VISUAL.displayHeight}
      frameClass="seo-audit-frame"
      visualClass="seo-audit-visual"
    >
      <div className="seo-mock seo-audit-mock" role="img" aria-label={`${alt}. ${label}. ${visualMeta}`}>
        <div className="seo-mock__bar" aria-hidden="true" />
        <div className="seo-mock__head">
          <span className="seo-mock__badge">{sample}</span>
          <strong>{label}</strong>
          <small>{visualMeta}</small>
        </div>
        <ul className="seo-audit-rows">
          {(rows?.length
            ? rows
            : HOTEL_SEO_LISTING_ROWS.map((row) => ({
                id: row.id,
                area: thai ? row.areaTh : row.areaEn,
                check: thai ? row.checkTh : row.checkEn,
              }))
          ).map((row) => (
            <li key={row.id}>
              <strong>{row.area}</strong>
              <span>{row.check}</span>
            </li>
          ))}
        </ul>
        <p className="seo-mock__note">
          {thai
            ? "ตัวอย่างข้อมูล · ปิดชื่อบัญชี รหัสพร็อพเพอร์ตี้ อีเมล และตัวเลขลูกค้า"
            : "Sample data · account name, property ID, email, and client metrics redacted"}
        </p>
      </div>
    </SeoVisualFrame>
  );
}
