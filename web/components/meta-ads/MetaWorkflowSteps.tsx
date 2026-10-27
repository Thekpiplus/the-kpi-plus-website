import { META_WORKFLOW_STEPS } from "@/lib/meta-ads";
import type { Locale } from "@/lib/seo";

export type AdsWorkflowStepView = {
  id: string;
  number: string;
  title: string;
  owner: string;
  input: string;
  action: string;
  output: string;
  nextDecision: string;
};

export function MetaWorkflowSteps({
  locale,
  steps,
}: {
  locale: Locale;
  steps?: AdsWorkflowStepView[];
}) {
  const thai = locale === "th";
  const data =
    steps?.length
      ? steps
      : META_WORKFLOW_STEPS.map((step) => ({
          id: step.id,
          number: step.number,
          title: thai ? step.titleTh : step.titleEn,
          owner: thai ? step.ownerTh : step.ownerEn,
          input: thai ? step.inputTh : step.inputEn,
          action: thai ? step.actionTh : step.actionEn,
          output: thai ? step.outputTh : step.outputEn,
          nextDecision: thai ? step.nextDecisionTh : step.nextDecisionEn,
        }));
  const labels = {
    owner: thai ? "ผู้รับผิดชอบ" : "Owner",
    input: thai ? "สิ่งที่รับ" : "Input",
    action: thai ? "สิ่งที่ทำ" : "Action",
    output: thai ? "สิ่งที่ได้" : "Output",
    next: thai ? "การตัดสินใจขั้นถัดไป" : "Next decision",
  };

  return (
    <>
      <ol className="ads-workflow-overview" aria-hidden="true">
        {data.map((step) => (
          <li key={`${step.id}-overview`}>
            <span className="kpi-latin ads-workflow-overview-num">{step.number}</span>
            <strong className="kpi-latin">{step.title}</strong>
            <small className="kpi-latin">{step.output}</small>
          </li>
        ))}
      </ol>
      <ol className="kpi-meta-ads-workflow-steps" aria-label={thai ? "ขั้นตอน Campaign Workflow" : "Campaign Workflow steps"}>
        {data.map((step) => (
          <li key={step.id} className="kpi-meta-ads-workflow-step">
            <span className="kpi-latin kpi-meta-ads-workflow-num">{step.number}</span>
            <div className="kpi-meta-ads-workflow-copy">
              <h3 className="kpi-latin">{step.title}</h3>
              <p className="kpi-latin ads-workflow-output-chip">{step.output}</p>
              <dl>
                <div>
                  <dt>{labels.owner}</dt>
                  <dd>{step.owner}</dd>
                </div>
                <div>
                  <dt>{labels.input}</dt>
                  <dd>{step.input}</dd>
                </div>
                <div>
                  <dt>{labels.action}</dt>
                  <dd>{step.action}</dd>
                </div>
                <div>
                  <dt>{labels.output}</dt>
                  <dd>
                    <span className="kpi-latin kpi-meta-ads-workflow-output">{step.output}</span>
                  </dd>
                </div>
                <div>
                  <dt>{labels.next}</dt>
                  <dd>{step.nextDecision}</dd>
                </div>
              </dl>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}
