import { B2B_READINESS_VISUAL } from "@/lib/b2b";
import type { Locale } from "@/lib/seo";
import "./b2b-ops.css";

const TILES = [
  { id: "profiles", title: "Agent Profile List", noteTh: "พาร์ตเนอร์ A / B / C", noteEn: "Partner A / B / C" },
  { id: "rates", title: "B2B Rate Sheet", noteTh: "ปิดตัวเลขราคา", noteEn: "Rates redacted" },
  { id: "commission", title: "Commission Structure", noteTh: "ปิดอัตราค่าคอม", noteEn: "Rates redacted" },
  { id: "kit", title: "Sales Kit", noteTh: "ข้อมูลสินค้า", noteEn: "Product pack" },
  { id: "map", title: "Partner Contact Map", noteTh: "ไม่มีอีเมลหรือเบอร์", noteEn: "No emails or phones" },
  { id: "segment", title: "Corporate/Wholesale Segment Notes", noteTh: "Corporate / Wholesale", noteEn: "Corporate / Wholesale" },
] as const;

export function B2bReadinessVisual({
  src,
  locale,
  caption,
  meta,
  alt: altProp,
  label: labelProp,
}: {
  src?: string;
  locale: Locale;
  caption?: string;
  meta?: string;
  alt?: string;
  label?: string;
}) {
  const fileSrc = src?.trim() || "";
  const hasAsset = Boolean(fileSrc);
  const thai = locale === "th";
  const sample = thai ? B2B_READINESS_VISUAL.sample.th : B2B_READINESS_VISUAL.sample.en;
  const alt = altProp || (thai ? B2B_READINESS_VISUAL.alt.th : B2B_READINESS_VISUAL.alt.en);
  const label = labelProp || (thai ? B2B_READINESS_VISUAL.label.th : B2B_READINESS_VISUAL.label.en);
  const visualMeta = meta || (thai ? B2B_READINESS_VISUAL.meta.th : B2B_READINESS_VISUAL.meta.en);
  const visualCaption = caption || (thai ? B2B_READINESS_VISUAL.caption.th : B2B_READINESS_VISUAL.caption.en);
  const recommended = thai
    ? `ขนาดแนะนำ ${B2B_READINESS_VISUAL.recommendedSize}`
    : `Recommended ${B2B_READINESS_VISUAL.recommendedSize}`;

  return (
    <figure className="kpi-b2b-readiness-visual">
      <div className="kpi-b2b-readiness-visual-frame">
        {hasAsset ? (
          <>
            <img
              src={fileSrc}
              alt={alt}
              width={B2B_READINESS_VISUAL.displayWidth}
              height={B2B_READINESS_VISUAL.displayHeight}
              loading="lazy"
              decoding="async"
            />
            <span className="kpi-b2b-readiness-visual-badge">{sample}</span>
          </>
        ) : (
          <div className="b2b-readiness-mock" role="img" aria-label={`${alt}. ${label}. ${visualMeta}. ${recommended}`}>
            <div className="b2b-readiness-mock__bar" aria-hidden="true" />
            <div className="b2b-readiness-mock__head">
              <span className="b2b-readiness-mock__badge">{sample}</span>
              <strong>{label}</strong>
              <small>{visualMeta}</small>
            </div>
            <ul className="b2b-readiness-mock__tiles">
              {TILES.map((tile) => (
                <li key={tile.id}>
                  <span>{tile.title}</span>
                  <small>{thai ? tile.noteTh : tile.noteEn}</small>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <figcaption className="kpi-b2b-readiness-caption">
        <span className="kpi-b2b-readiness-meta">{visualMeta}</span>
        <span>{visualCaption}</span>
      </figcaption>
    </figure>
  );
}
