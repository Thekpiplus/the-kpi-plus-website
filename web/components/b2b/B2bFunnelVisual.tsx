import { B2B_FUNNEL_STEPS, B2B_FUNNEL_VISUAL, b2bShowsSampleBadge } from "@/lib/b2b";
import type { Locale } from "@/lib/seo";
import "./b2b-ops.css";

export function B2bFunnelVisual({
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
  const sample = thai ? B2B_FUNNEL_VISUAL.sample.th : B2B_FUNNEL_VISUAL.sample.en;
  const alt = altProp || (thai ? B2B_FUNNEL_VISUAL.alt.th : B2B_FUNNEL_VISUAL.alt.en);
  const label = labelProp || (thai ? B2B_FUNNEL_VISUAL.label.th : B2B_FUNNEL_VISUAL.label.en);
  const visualMeta = meta || (thai ? B2B_FUNNEL_VISUAL.meta.th : B2B_FUNNEL_VISUAL.meta.en);
  const visualCaption = caption || (thai ? B2B_FUNNEL_VISUAL.caption.th : B2B_FUNNEL_VISUAL.caption.en);
  const recommended = thai
    ? `ขนาดแนะนำ ${B2B_FUNNEL_VISUAL.recommendedSize}`
    : `Recommended ${B2B_FUNNEL_VISUAL.recommendedSize}`;

  return (
    <figure className="kpi-b2b-funnel-visual">
      <div className="kpi-b2b-funnel-visual-frame">
        {hasAsset ? (
          <>
            <img
              src={fileSrc}
              alt={alt}
              width={B2B_FUNNEL_VISUAL.displayWidth}
              height={B2B_FUNNEL_VISUAL.displayHeight}
              loading="lazy"
              decoding="async"
            />
            {b2bShowsSampleBadge(status) ? <span className="kpi-b2b-funnel-visual-badge">{sample}</span> : null}
          </>
        ) : (
          <div className="b2b-funnel-mock" role="img" aria-label={`${alt}. ${label}. ${visualMeta}. ${recommended}`}>
            <div className="b2b-funnel-mock__bar" aria-hidden="true" />
            <div className="b2b-funnel-mock__head">
              <span className="b2b-funnel-mock__badge">{sample}</span>
              <strong>{label}</strong>
              {visualMeta && visualMeta !== label ? <small>{visualMeta}</small> : null}
            </div>
            <ol className="b2b-funnel-mock__path">
              {B2B_FUNNEL_STEPS.map((step, index) => (
                <li key={step.id} className={`is-${step.marker}`}>
                  <span className="kpi-latin">{thai ? step.labelTh : step.labelEn}</span>
                  {index < B2B_FUNNEL_STEPS.length - 1 ? (
                    <b className="b2b-funnel-mock__arrow" aria-hidden="true">
                      ↓
                    </b>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
      <figcaption className="kpi-b2b-funnel-visual-caption">
        <span className="kpi-b2b-funnel-visual-meta">{visualMeta}</span>
        <span>{visualCaption}</span>
      </figcaption>
    </figure>
  );
}
