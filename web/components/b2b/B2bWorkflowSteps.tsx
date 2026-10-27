import type { Locale } from "@/lib/seo";

export type B2bWorkflowStepView = {
  id: string;
  number: string;
  title: string;
  owner: string;
  input: string;
  action: string;
  output: string;
  escalation: string;
};

export function B2bWorkflowSteps({
  locale,
  steps,
}: {
  locale: Locale;
  steps: B2bWorkflowStepView[];
}) {
  const thai = locale === "th";
  const ownerLabel = thai ? "ผู้รับผิดชอบ" : "Owner";
  const inputLabel = "Input";
  const actionLabel = thai ? "สิ่งที่ทำ" : "Action";
  const outputLabel = thai ? "สิ่งที่ได้" : "Output";
  const handoffLabel = thai ? "การส่งต่องาน" : "Handoff";

  return (
    <ol className="kpi-b2b-workflow-steps">
      {steps.map((step) => (
        <li key={step.id} className="kpi-b2b-workflow-step">
          <span className="kpi-latin kpi-b2b-workflow-step-num">{step.number}</span>
          <div className="kpi-b2b-workflow-step-copy">
            <h3 className="kpi-latin">{step.title}</h3>
            <dl>
              <div>
                <dt>{ownerLabel}</dt>
                <dd>{step.owner}</dd>
              </div>
              <div>
                <dt className="kpi-latin">{inputLabel}</dt>
                <dd>{step.input}</dd>
              </div>
              <div>
                <dt>{actionLabel}</dt>
                <dd>{step.action}</dd>
              </div>
              <div>
                <dt className="kpi-latin">{outputLabel}</dt>
                <dd>
                  <span className="kpi-latin kpi-b2b-workflow-output">{step.output}</span>
                </dd>
              </div>
              <div>
                <dt>{handoffLabel}</dt>
                <dd>{step.escalation || "—"}</dd>
              </div>
            </dl>
          </div>
        </li>
      ))}
    </ol>
  );
}
