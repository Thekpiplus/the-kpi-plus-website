import { ADS_HERO_VISUAL, adsSampleLabel, adsShowsSampleBadge } from "@/lib/google-ads";
import type { Locale } from "@/lib/seo";
import "./google-ads-visuals.css";

const PANELS = [
  { titleEn: "Search intent", titleTh: "คำค้นหา", hintEn: "Tied to campaign structure", hintTh: "โยงกับโครงสร้างแคมเปญ" },
  { titleEn: "Hotel page", titleTh: "หน้าโรงแรม", hintEn: "Ad opens a relevant page", hintTh: "โฆษณาพาไปหน้าที่ตรง" },
  { titleEn: "Booking path", titleTh: "เส้นทางจอง", hintEn: "Measurable after the click", hintTh: "วัดผลได้หลังคลิก" },
] as const;

const PATH = [
  { en: "Search intent", th: "คำค้น" },
  { en: "Campaign", th: "แคมเปญ" },
  { en: "Hotel page", th: "หน้าโรงแรม" },
  { en: "Booking path", th: "เส้นทางจอง" },
  { en: "Review", th: "ทบทวน" },
] as const;

export function AdsHeroVisual({
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
  const alt = altProp || (thai ? ADS_HERO_VISUAL.alt.th : ADS_HERO_VISUAL.alt.en);
  const label = labelProp || (thai ? ADS_HERO_VISUAL.label.th : ADS_HERO_VISUAL.label.en);
  const visualMeta = meta || (thai ? ADS_HERO_VISUAL.meta.th : ADS_HERO_VISUAL.meta.en);
  const visualCaption = caption || (thai ? ADS_HERO_VISUAL.caption.th : ADS_HERO_VISUAL.caption.en);

  return (
    <figure className="ads-visual ads-hero-visual">
      <div className="ads-visual-frame ads-hero-frame">
        {hasAsset ? (
          <div className="ads-hero-asset">
            <img
              src={fileSrc}
              alt={alt}
              width={ADS_HERO_VISUAL.displayWidth}
              height={ADS_HERO_VISUAL.displayHeight}
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            {adsShowsSampleBadge(status) ? <span className="ads-visual-badge">{sample}</span> : null}
          </div>
        ) : (
          <div className="ads-mock ads-hero-mock" role="img" aria-label={`${alt}. ${label}. ${visualMeta}`}>
            <div className="ads-mock__bar" aria-hidden="true" />
            <div className="ads-mock__head">
              <span className="ads-mock__badge">{sample}</span>
              <strong>{label}</strong>
              <small>{visualMeta}</small>
            </div>
            <div className="ads-hero-mock__panels">
              {PANELS.map((panel) => (
                <div key={panel.titleEn}>
                  <span>{thai ? panel.titleTh : panel.titleEn}</span>
                  <small>{thai ? panel.hintTh : panel.hintEn}</small>
                </div>
              ))}
            </div>
            <ol className="ads-hero-mock__path">
              {PATH.map((step) => (
                <li key={step.en}>{thai ? step.th : step.en}</li>
              ))}
            </ol>
            <p className="ads-mock__note">
              {thai ? "ตัวอย่างข้อมูล ไม่ใช่ผลแคมเปญจริง" : "Sample data · not live campaign results"}
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
