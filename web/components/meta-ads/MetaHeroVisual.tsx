import { META_HERO_VISUAL, metaSampleLabel, metaShowsSampleBadge } from "@/lib/meta-ads";
import type { Locale } from "@/lib/seo";
import "./meta-ads-visuals.css";

const FUNNEL = [
  { en: "Audience", th: "กลุ่มลูกค้า", hintEn: "Fit the hotel market", hintTh: "เข้ากับตลาดโรงแรม" },
  { en: "Offer page", th: "หน้าข้อเสนอ", hintEn: "Relevant hotel page", hintTh: "หน้าโรงแรมที่เกี่ยวข้อง" },
  { en: "Enquire or book", th: "สอบถามหรือจอง", hintEn: "Measurable next step", hintTh: "ขั้นถัดไปที่วัดได้" },
] as const;

const PATH = [
  { en: "Objective", th: "เป้าหมาย" },
  { en: "Audience", th: "กลุ่มลูกค้า" },
  { en: "Creative", th: "ครีเอทีฟ" },
  { en: "Offer page", th: "หน้าข้อเสนอ" },
  { en: "Enquire or book", th: "สอบถามหรือจอง" },
] as const;

export function MetaHeroVisual({
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
  const alt = altProp || (thai ? META_HERO_VISUAL.alt.th : META_HERO_VISUAL.alt.en);
  const label = labelProp || (thai ? META_HERO_VISUAL.label.th : META_HERO_VISUAL.label.en);
  const visualMeta = meta || (thai ? META_HERO_VISUAL.meta.th : META_HERO_VISUAL.meta.en);
  const visualCaption = caption || (thai ? META_HERO_VISUAL.caption.th : META_HERO_VISUAL.caption.en);

  return (
    <figure className="ads-visual ads-hero-visual">
      <div className="ads-visual-frame ads-hero-frame">
        {hasAsset ? (
          <div className="ads-hero-asset">
            <img
              src={fileSrc}
              alt={alt}
              width={META_HERO_VISUAL.displayWidth}
              height={META_HERO_VISUAL.displayHeight}
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            {metaShowsSampleBadge(status) ? <span className="ads-visual-badge">{sample}</span> : null}
          </div>
        ) : (
          <div className="ads-mock ads-hero-mock" role="img" aria-label={`${alt}. ${label}. ${visualMeta}`}>
            <div className="ads-mock__bar" aria-hidden="true" />
            <div className="ads-mock__head">
              <span className="ads-mock__badge">{sample}</span>
              <strong>{label}</strong>
              <small>{visualMeta}</small>
            </div>
            <div className="ads-hero-mock__board">
              <div className="ads-hero-mock__creative">
                <span>{thai ? "ครีเอทีฟ" : "Creative"}</span>
                <div className="ads-hero-mock__creative-frame" aria-hidden="true">
                  <b />
                  <i />
                  <i />
                </div>
                <small>{thai ? "ตัวอย่างครีเอทีฟที่ปิดข้อมูลบัญชี" : "Redacted sample creative"}</small>
              </div>
              <ol className="ads-hero-mock__funnel">
                {FUNNEL.map((step, index) => (
                  <li key={step.en}>
                    <em className="kpi-latin">{String(index + 1).padStart(2, "0")}</em>
                    <span>{thai ? step.th : step.en}</span>
                    <small>{thai ? step.hintTh : step.hintEn}</small>
                  </li>
                ))}
              </ol>
            </div>
            <ol className="ads-hero-mock__path">
              {PATH.map((step) => (
                <li key={step.en}>{thai ? step.th : step.en}</li>
              ))}
            </ol>
            <p className="ads-mock__note">
              {thai ? "ตัวอย่างข้อมูล ไม่ใช่ผลแคมเปญหรือบัญชีลูกค้า" : "Sample data · not a live campaign or client account"}
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
