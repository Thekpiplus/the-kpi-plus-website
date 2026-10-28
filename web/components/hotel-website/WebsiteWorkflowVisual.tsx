import {
  WEBSITE_WORKFLOW_STEPS,
  WEBSITE_WORKFLOW_VISUAL,
  websiteSampleLabel,
} from "@/lib/hotel-website";
import type { Locale } from "@/lib/seo";
import { WebsiteVisualFrame } from "./WebsiteVisualFrame";

export function WebsiteWorkflowVisual({
  locale,
  src,
  alt,
  status,
}: {
  locale: Locale;
  src?: string;
  alt?: string;
  status?: string;
}) {
  const thai = locale === "th";
  return (
    <WebsiteVisualFrame
      locale={locale}
      src={src}
      alt={alt || (thai ? WEBSITE_WORKFLOW_VISUAL.altTh : WEBSITE_WORKFLOW_VISUAL.altEn)}
      label={thai ? WEBSITE_WORKFLOW_VISUAL.labelTh : WEBSITE_WORKFLOW_VISUAL.labelEn}
      caption={thai ? WEBSITE_WORKFLOW_VISUAL.captionTh : WEBSITE_WORKFLOW_VISUAL.captionEn}
      meta={thai ? WEBSITE_WORKFLOW_VISUAL.metaTh : WEBSITE_WORKFLOW_VISUAL.metaEn}
      status={status || WEBSITE_WORKFLOW_VISUAL.status}
      width={WEBSITE_WORKFLOW_VISUAL.displayWidth}
      height={WEBSITE_WORKFLOW_VISUAL.displayHeight}
      variant="workflow"
    >
      <div
        className="web-workflow-mock"
        role="img"
        aria-label={thai ? WEBSITE_WORKFLOW_VISUAL.altTh : WEBSITE_WORKFLOW_VISUAL.altEn}
      >
        <span className="web-visual-badge">{websiteSampleLabel(locale)}</span>
        <p className="web-workflow-mock-kicker kpi-latin">Sample workflow</p>
        <p className="web-workflow-mock-title kpi-latin">{WEBSITE_WORKFLOW_VISUAL.labelEn}</p>
        <ol className="web-workflow-mock-flow">
          {WEBSITE_WORKFLOW_STEPS.map((step) => (
            <li key={step.id}>
              <span className="kpi-latin">{step.num}</span>
              <strong className="kpi-latin">{step.label}</strong>
              <small className="kpi-latin">{step.output}</small>
            </li>
          ))}
        </ol>
        <p className="web-workflow-mock-note kpi-latin">Sample timeline · not a client schedule</p>
      </div>
    </WebsiteVisualFrame>
  );
}
