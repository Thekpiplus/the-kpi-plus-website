import { B2B_HERO_VISUAL, b2bSampleLabel, b2bShowsSampleBadge } from "@/lib/b2b";
import type { Locale } from "@/lib/seo";
import "./b2b-ops.css";

const PANELS = [
  { id: "partner", titleEn: "Partner Fit", titleTh: "Partner Fit", hintEn: "Market match", hintTh: "คู่กับตลาดโรงแรม" },
  { id: "rate", titleEn: "Rate & Offer", titleTh: "ราคาและข้อเสนอ", hintEn: "Rate structure", hintTh: "โครงสร้างราคา" },
  { id: "booking", titleEn: "Booking path", titleTh: "เส้นทางการจอง", hintEn: "Tied to revenue", hintTh: "โยงกับผลรายได้" },
] as const;

const FUNNEL = [
  { id: "fit", labelEn: "Fit", labelTh: "Fit" },
  { id: "offer", labelEn: "Offer", labelTh: "ข้อเสนอ" },
  { id: "kit", labelEn: "Sales Kit", labelTh: "Sales Kit" },
  { id: "outreach", labelEn: "Outreach", labelTh: "Outreach" },
  { id: "booking", labelEn: "Booking", labelTh: "การจอง" },
] as const;

export function B2bHeroVisual({
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
  const sample = b2bSampleLabel(locale);
  const alt = altProp || (thai ? B2B_HERO_VISUAL.alt.th : B2B_HERO_VISUAL.alt.en);
  const label = labelProp || (thai ? B2B_HERO_VISUAL.label.th : B2B_HERO_VISUAL.label.en);
  const visualMeta = meta || (thai ? B2B_HERO_VISUAL.meta.th : B2B_HERO_VISUAL.meta.en);
  const visualCaption = caption || (thai ? B2B_HERO_VISUAL.caption.th : B2B_HERO_VISUAL.caption.en);
  const recommended = thai
    ? `ขนาดแนะนำ ${B2B_HERO_VISUAL.recommendedSize}`
    : `Recommended ${B2B_HERO_VISUAL.recommendedSize}`;

  return (
    <figure className="kpi-b2b-hero-visual">
      {hasAsset ? (
        <div className="kpi-b2b-hero-visual-frame">
          <img
            src={fileSrc}
            alt={alt}
            width={B2B_HERO_VISUAL.displayWidth}
            height={B2B_HERO_VISUAL.displayHeight}
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          {b2bShowsSampleBadge(status) ? <span className="kpi-b2b-hero-visual-badge">{sample}</span> : null}
        </div>
      ) : (
        <div className="b2b-hero-mock" role="img" aria-label={`${alt}. ${label}. ${visualMeta}. ${recommended}`}>
          <div className="b2b-hero-mock__bar" aria-hidden="true" />
          <div className="b2b-hero-mock__head">
            <span className="b2b-hero-mock__badge">{sample}</span>
            <strong>{label}</strong>
            <small>{visualMeta}</small>
          </div>
          <div className="b2b-hero-mock__panels">
            {PANELS.map((panel) => (
              <div key={panel.id} className={`b2b-hero-mock__panel b2b-hero-mock__panel--${panel.id}`}>
                <span>{thai ? panel.titleTh : panel.titleEn}</span>
                <small>{thai ? panel.hintTh : panel.hintEn}</small>
              </div>
            ))}
          </div>
          <ol className="b2b-hero-mock__funnel">
            {FUNNEL.map((step) => (
              <li key={step.id}>{thai ? step.labelTh : step.labelEn}</li>
            ))}
          </ol>
          <p className="b2b-hero-mock__note">
            {thai ? "แผนภาพตัวอย่าง ไม่ใช่ผลงานพาร์ตเนอร์รายใด" : "Sample workflow, not one partner’s results"}
          </p>
        </div>
      )}
      <figcaption className="kpi-b2b-hero-caption">
        <span className="kpi-b2b-hero-visual-meta">{visualMeta}</span>
        <span>{visualCaption}</span>
      </figcaption>
    </figure>
  );
}
