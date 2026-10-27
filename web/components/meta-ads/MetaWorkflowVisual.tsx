import { META_WORKFLOW_STEPS, META_WORKFLOW_VISUAL, metaSampleLabel, metaShowsSampleBadge } from "@/lib/meta-ads";
import type { Locale } from "@/lib/seo";
import type { AdsWorkflowStepView } from "./MetaWorkflowSteps";
import "./meta-ads-visuals.css";

export function MetaWorkflowVisual({
  src,
  locale,
  caption,
  meta,
  alt: altProp,
  label: labelProp,
  status,
  steps,
}: {
  src?: string;
  locale: Locale;
  caption?: string;
  meta?: string;
  alt?: string;
  label?: string;
  status?: string;
  steps?: AdsWorkflowStepView[];
}) {
  const fileSrc = src?.trim() || "";
  const hasAsset = Boolean(fileSrc);
  const thai = locale === "th";
  const sample = metaSampleLabel(locale);
  const alt = altProp || (thai ? META_WORKFLOW_VISUAL.alt.th : META_WORKFLOW_VISUAL.alt.en);
  const label = labelProp || (thai ? META_WORKFLOW_VISUAL.label.th : META_WORKFLOW_VISUAL.label.en);
  const visualMeta = meta || (thai ? META_WORKFLOW_VISUAL.meta.th : META_WORKFLOW_VISUAL.meta.en);
  const visualCaption = caption || (thai ? META_WORKFLOW_VISUAL.caption.th : META_WORKFLOW_VISUAL.caption.en);
  const changeById = Object.fromEntries(
    META_WORKFLOW_STEPS.map((step) => [step.id, thai ? step.changeTh : step.changeEn]),
  );
  const stages = (
    steps?.length
      ? steps.map((step) => ({
          id: step.id,
          title: step.title,
          change: changeById[step.id] || "",
          output: step.output,
        }))
      : META_WORKFLOW_STEPS.map((step) => ({
          id: step.id,
          title: thai ? step.titleTh : step.titleEn,
          change: thai ? step.changeTh : step.changeEn,
          output: thai ? step.outputTh : step.outputEn,
        }))
  );

  return (
    <figure className="ads-visual ads-workflow-visual">
      <div className="ads-visual-frame ads-workflow-frame">
        {hasAsset ? (
          <div className="ads-workflow-asset">
            <img
              src={fileSrc}
              alt={alt}
              width={META_WORKFLOW_VISUAL.displayWidth}
              height={META_WORKFLOW_VISUAL.displayHeight}
              loading="lazy"
              decoding="async"
            />
            {metaShowsSampleBadge(status) ? <span className="ads-visual-badge">{sample}</span> : null}
          </div>
        ) : (
          <div className="ads-mock ads-workflow-mock" role="img" aria-label={`${alt}. ${label}. ${visualMeta}`}>
            <div className="ads-mock__bar" aria-hidden="true" />
            <div className="ads-mock__head">
              <span className="ads-mock__badge">{sample}</span>
              <strong>{label}</strong>
              <small>{visualMeta}</small>
            </div>
            <ol className="ads-workflow-mock__stages">
              {stages.map((step) => (
                <li key={step.id} data-stage={step.id}>
                  <span className="kpi-latin">{step.title}</span>
                  {step.change ? <small>{step.change}</small> : null}
                  <em className="kpi-latin">{step.output}</em>
                </li>
              ))}
            </ol>
            <p className="ads-mock__note">
              {thai
                ? "สิ่งที่เปลี่ยนระหว่าง Audit, Launch, Optimize และ Report ไม่ใช่รูปประชุม"
                : "What changes between Audit, Launch, Optimize, and Report, not a meeting photo"}
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
