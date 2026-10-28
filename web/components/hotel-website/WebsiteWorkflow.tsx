import { WEBSITE_WORKFLOW_STEPS } from "@/lib/hotel-website";
import type { Locale } from "@/lib/seo";
import { WebsiteWorkflowHandover } from "./WebsiteWorkflowHandover";
import { WebsiteWorkflowMatrix, type WebsiteWorkflowStepView } from "./WebsiteWorkflowMatrix";
import { WebsiteWorkflowVisual } from "./WebsiteWorkflowVisual";

export function WebsiteWorkflow({
  locale,
  src,
  alt,
  status,
  steps,
  handover,
}: {
  locale: Locale;
  src?: string;
  alt?: string;
  status?: string;
  steps?: WebsiteWorkflowStepView[];
  handover?: Array<{ id?: string; label?: string }>;
}) {
  const thai = locale === "th";
  return (
    <div className="web-workflow">
      <WebsiteWorkflowVisual locale={locale} src={src} alt={alt} status={status} />
      <ol className="web-workflow-path" aria-label={thai ? "เส้นทางงานจนถึงการส่งมอบ" : "Project workflow path"}>
        {WEBSITE_WORKFLOW_STEPS.map((step) => (
          <li key={step.id}>
            <span className="kpi-latin web-workflow-path-num">{step.num}</span>
            <span className="kpi-latin web-workflow-path-label">{step.label}</span>
          </li>
        ))}
      </ol>
      <WebsiteWorkflowMatrix locale={locale} steps={steps} />
      <WebsiteWorkflowHandover locale={locale} items={handover} />
    </div>
  );
}
