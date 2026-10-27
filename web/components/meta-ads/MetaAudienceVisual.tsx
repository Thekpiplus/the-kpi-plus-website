import { META_AUDIENCE_PATH, META_AUDIENCE_VISUAL, metaSampleLabel, metaShowsSampleBadge } from "@/lib/meta-ads";
import type { Locale } from "@/lib/seo";
import "./meta-ads-visuals.css";

const SEGMENTS = [
  { en: "Stay", th: "การเข้าพัก", hintEn: "Room and stay type", hintTh: "ประเภทห้องและการเข้าพัก" },
  { en: "Occasion", th: "โอกาส", hintEn: "Leisure, work, or event", hintTh: "พักผ่อน ทำงาน หรืออีเวนต์" },
  { en: "Market", th: "ตลาด", hintEn: "Language and source market", hintTh: "ภาษาและตลาดต้นทาง" },
] as const;

const CREATIVES = [
  { en: "Creative A", th: "ครีเอทีฟ A", hintEn: "Offer fit · sample", hintTh: "สอดคล้องข้อเสนอ · ตัวอย่าง" },
  { en: "Creative B", th: "ครีเอทีฟ B", hintEn: "Audience fit · sample", hintTh: "สอดคล้องกลุ่มลูกค้า · ตัวอย่าง" },
] as const;

export function MetaAudienceVisual({
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
  const sample = metaSampleLabel(locale);
  const alt = altProp || (thai ? META_AUDIENCE_VISUAL.alt.th : META_AUDIENCE_VISUAL.alt.en);
  const label = labelProp || (thai ? META_AUDIENCE_VISUAL.label.th : META_AUDIENCE_VISUAL.label.en);
  const visualMeta = meta || (thai ? META_AUDIENCE_VISUAL.meta.th : META_AUDIENCE_VISUAL.meta.en);
  const visualCaption = caption || (thai ? META_AUDIENCE_VISUAL.caption.th : META_AUDIENCE_VISUAL.caption.en);

  return (
    <figure className="ads-visual ads-visibility-visual">
      <div className="ads-visual-frame ads-visibility-frame">
        {hasAsset ? (
          <div className="ads-visibility-asset">
            <img
              src={fileSrc}
              alt={alt}
              width={META_AUDIENCE_VISUAL.displayWidth}
              height={META_AUDIENCE_VISUAL.displayHeight}
              loading="lazy"
              decoding="async"
            />
            {metaShowsSampleBadge(status) ? <span className="ads-visual-badge">{sample}</span> : null}
          </div>
        ) : (
          <div className="ads-mock ads-visibility-mock" role="img" aria-label={`${alt}. ${label}. ${visualMeta}`}>
            <div className="ads-mock__bar" aria-hidden="true" />
            <div className="ads-mock__head">
              <span className="ads-mock__badge">{sample}</span>
              <strong>{label}</strong>
              <small>{visualMeta}</small>
            </div>
            <div className="ads-visibility-mock__board">
              <ul className="ads-visibility-mock__tiles">
                {SEGMENTS.map((tile) => (
                  <li key={tile.en}>
                    <span>{thai ? tile.th : tile.en}</span>
                    <small>{thai ? tile.hintTh : tile.hintEn}</small>
                  </li>
                ))}
              </ul>
              <ul className="ads-visibility-mock__creatives">
                {CREATIVES.map((tile) => (
                  <li key={tile.en}>
                    <span>{thai ? tile.th : tile.en}</span>
                    <b aria-hidden="true" />
                    <small>{thai ? tile.hintTh : tile.hintEn}</small>
                  </li>
                ))}
              </ul>
            </div>
            <ol className="ads-visibility-mock__path">
              {META_AUDIENCE_PATH.map((step) => (
                <li key={step.en}>{thai ? step.th : step.en}</li>
              ))}
            </ol>
            <p className="ads-mock__note">
              {thai ? "ตัวอย่างข้อมูล ไม่ใช่ยอด Reach หรือผลจองของโรงแรม" : "Sample data · not campaign reach or a hotel booking result"}
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
