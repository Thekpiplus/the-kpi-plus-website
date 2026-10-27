import { ADS_VISIBILITY_PATH, ADS_VISIBILITY_VISUAL, adsSampleLabel, adsShowsSampleBadge } from "@/lib/google-ads";
import type { Locale } from "@/lib/seo";
import "./google-ads-visuals.css";

const TILES = [
  { title: "Search Ads", noteTh: "พาไปหน้าโรงแรมที่ตรงคำค้น", noteEn: "Opens a matching hotel page" },
  { title: "Hotel Ads", noteTh: "รายการราคา ไม่ใช่บัญชีจริง", noteEn: "Rate listing, not a live account" },
  { title: "Free Booking Links", noteTh: "ลิงก์จองเมื่อข้อมูลพร้อม", noteEn: "Booking link when data is ready" },
  { title: "Hotel page", noteTh: "หน้าห้องพักหรือข้อเสนอ", noteEn: "Room or offer landing page" },
] as const;

export function AdsVisibilityVisual({
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
  const alt = altProp || (thai ? ADS_VISIBILITY_VISUAL.alt.th : ADS_VISIBILITY_VISUAL.alt.en);
  const label = labelProp || (thai ? ADS_VISIBILITY_VISUAL.label.th : ADS_VISIBILITY_VISUAL.label.en);
  const visualMeta = meta || (thai ? ADS_VISIBILITY_VISUAL.meta.th : ADS_VISIBILITY_VISUAL.meta.en);
  const visualCaption = caption || (thai ? ADS_VISIBILITY_VISUAL.caption.th : ADS_VISIBILITY_VISUAL.caption.en);

  return (
    <figure className="ads-visual ads-visibility-visual">
      <div className="ads-visual-frame ads-visibility-frame">
        {hasAsset ? (
          <div className="ads-visibility-asset">
            <img
              src={fileSrc}
              alt={alt}
              width={ADS_VISIBILITY_VISUAL.displayWidth}
              height={ADS_VISIBILITY_VISUAL.displayHeight}
              loading="lazy"
              decoding="async"
            />
            {adsShowsSampleBadge(status) ? <span className="ads-visual-badge">{sample}</span> : null}
          </div>
        ) : (
          <div className="ads-mock ads-visibility-mock" role="img" aria-label={`${alt}. ${label}. ${visualMeta}`}>
            <div className="ads-mock__bar" aria-hidden="true" />
            <div className="ads-mock__head">
              <span className="ads-mock__badge">{sample}</span>
              <strong>{label}</strong>
              <small>{visualMeta}</small>
            </div>
            <ul className="ads-visibility-mock__tiles">
              {TILES.map((tile) => (
                <li key={tile.title}>
                  <span>{tile.title}</span>
                  <small>{thai ? tile.noteTh : tile.noteEn}</small>
                </li>
              ))}
            </ul>
            <ol className="ads-visibility-mock__path">
              {ADS_VISIBILITY_PATH.map((step) => (
                <li key={step.en}>{thai ? step.th : step.en}</li>
              ))}
            </ol>
            <p className="ads-mock__note">
              {thai ? "ตัวอย่างข้อมูล ไม่ใช่ผลอันดับหรือบัญชีจริง" : "Sample data · not a ranking or live account"}
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
