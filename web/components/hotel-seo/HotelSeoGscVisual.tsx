import { HOTEL_SEO_GSC_ROWS, HOTEL_SEO_GSC_VISUAL, hotelSeoSampleLabel } from "@/lib/hotel-seo";
import type { Locale } from "@/lib/seo";
import { SeoVisualFrame } from "./SeoVisualFrame";
import "./hotel-seo-visuals.css";

export function HotelSeoGscVisual({
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
  const alt = altProp || (thai ? HOTEL_SEO_GSC_VISUAL.alt.th : HOTEL_SEO_GSC_VISUAL.alt.en);
  const label = labelProp || (thai ? HOTEL_SEO_GSC_VISUAL.label.th : HOTEL_SEO_GSC_VISUAL.label.en);
  const visualMeta = meta || (thai ? HOTEL_SEO_GSC_VISUAL.meta.th : HOTEL_SEO_GSC_VISUAL.meta.en);
  const visualCaption = caption || (thai ? HOTEL_SEO_GSC_VISUAL.caption.th : HOTEL_SEO_GSC_VISUAL.caption.en);

  return (
    <SeoVisualFrame
      locale={locale}
      src={src}
      alt={alt}
      label={label}
      caption={visualCaption}
      meta={visualMeta}
      status={status}
      frameClass="seo-gsc-frame"
      visualClass="seo-gsc-visual"
    >
      <div className="seo-mock" role="img" aria-label={`${alt}. ${label}. ${visualMeta}`}>
        <div className="seo-mock__head">
          <span className="seo-mock__badge">{sample}</span>
          <strong>{label}</strong>
          <small>{visualMeta}</small>
        </div>
        <ul className="seo-gsc-rows">
          {(rows?.length
            ? rows
            : HOTEL_SEO_GSC_ROWS.map((row) => ({
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
            ? "ไม่มีรหัสพร็อพเพอร์ตี้ อีเมล หรือตัวเลขผลโรงแรม"
            : "No property IDs, emails, or hotel performance figures"}
        </p>
      </div>
    </SeoVisualFrame>
  );
}
