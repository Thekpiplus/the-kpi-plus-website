import { B2B_WORKFLOW_STEPS, B2B_WORKFLOW_VISUAL, b2bShowsSampleBadge } from "@/lib/b2b";
import type { Locale } from "@/lib/seo";
import "./b2b-ops.css";

export function B2bWorkflowVisual({
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
  const sample = thai ? B2B_WORKFLOW_VISUAL.sample.th : B2B_WORKFLOW_VISUAL.sample.en;
  const alt = altProp || (thai ? B2B_WORKFLOW_VISUAL.alt.th : B2B_WORKFLOW_VISUAL.alt.en);
  const label = labelProp || (thai ? B2B_WORKFLOW_VISUAL.label.th : B2B_WORKFLOW_VISUAL.label.en);
  const visualMeta = meta || (thai ? B2B_WORKFLOW_VISUAL.meta.th : B2B_WORKFLOW_VISUAL.meta.en);
  const visualCaption = caption || (thai ? B2B_WORKFLOW_VISUAL.caption.th : B2B_WORKFLOW_VISUAL.caption.en);
  const recommended = thai
    ? `ขนาดแนะนำ ${B2B_WORKFLOW_VISUAL.recommendedSize}`
    : `Recommended ${B2B_WORKFLOW_VISUAL.recommendedSize}`;

  return (
    <figure className="kpi-b2b-workflow-visual">
      <div className="kpi-b2b-workflow-visual-frame">
        {hasAsset ? (
          <>
            <img
              src={fileSrc}
              alt={alt}
              width={B2B_WORKFLOW_VISUAL.displayWidth}
              height={B2B_WORKFLOW_VISUAL.displayHeight}
              loading="lazy"
              decoding="async"
            />
            {b2bShowsSampleBadge(status) ? <span className="kpi-b2b-workflow-visual-badge">{sample}</span> : null}
          </>
        ) : (
          <div className="b2b-workflow-mock" role="img" aria-label={`${alt}. ${label}. ${visualMeta}. ${recommended}`}>
            <div className="b2b-workflow-mock__bar" aria-hidden="true" />
            <div className="b2b-workflow-mock__head">
              <span className="b2b-workflow-mock__badge">{sample}</span>
              <strong>{label}</strong>
              {visualMeta && visualMeta !== label ? <small>{visualMeta}</small> : null}
            </div>
            <ol className="b2b-workflow-mock__path">
              {B2B_WORKFLOW_STEPS.map((step) => (
                <li key={step.id}>
                  <span className="kpi-latin b2b-workflow-mock__step">{thai ? step.titleTh : step.titleEn}</span>
                  <b className="b2b-workflow-mock__handoff" aria-hidden="true">
                    →
                  </b>
                  <span className="kpi-latin b2b-workflow-mock__output">{thai ? step.outputTh : step.outputEn}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
      <figcaption className="kpi-b2b-workflow-visual-caption">
        <span className="kpi-b2b-workflow-visual-meta">{visualMeta}</span>
        <span>{visualCaption}</span>
      </figcaption>
    </figure>
  );
}
