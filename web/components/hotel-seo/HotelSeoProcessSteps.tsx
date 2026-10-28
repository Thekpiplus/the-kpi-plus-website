import { HOTEL_SEO_PROCESS_FIELDS, HOTEL_SEO_PROCESS_STEPS } from "@/lib/hotel-seo";
import type { Locale } from "@/lib/seo";

export type HotelSeoProcessStepView = {
  id: string;
  num: string;
  phase: string;
  title: string;
  action: string;
  owner: string;
  input: string;
  output: string;
  nextDecision: string;
};

export function HotelSeoProcessSteps({ locale, steps }: { locale: Locale; steps?: HotelSeoProcessStepView[] }) {
  const thai = locale === "th";
  const data =
    steps?.length
      ? steps
      : HOTEL_SEO_PROCESS_STEPS.map((step) => ({
          id: step.id,
          num: step.num,
          phase: step.phase,
          title: thai ? step.titleTh : step.titleEn,
          action: thai ? step.actionTh : step.actionEn,
          owner: thai ? step.ownerTh : step.ownerEn,
          input: thai ? step.inputTh : step.inputEn,
          output: thai ? step.outputTh : step.outputEn,
          nextDecision: thai ? step.nextDecisionTh : step.nextDecisionEn,
        }));

  return (
    <ol className="kpi-seo-local-process-steps" aria-label={thai ? "ขั้นตอนการตรวจการค้นพบ" : "Hotel search visibility audit process"}>
      {data.map((step) => (
        <li key={step.id}>
          <span className="kpi-latin kpi-seo-local-process-num">{step.num}</span>
          <div className="kpi-seo-local-process-card">
            <p className="kpi-latin kpi-seo-local-process-phase">
              {step.num} / {step.phase}
            </p>
            <h3>{step.title}</h3>
            <p className="kpi-seo-local-process-action">{step.action}</p>
            <p className="kpi-latin kpi-seo-local-process-output">{step.output}</p>
            <dl>
              <div>
                <dt>{thai ? HOTEL_SEO_PROCESS_FIELDS[0].th : HOTEL_SEO_PROCESS_FIELDS[0].en}</dt>
                <dd>{step.owner}</dd>
              </div>
              <div>
                <dt>{thai ? HOTEL_SEO_PROCESS_FIELDS[1].th : HOTEL_SEO_PROCESS_FIELDS[1].en}</dt>
                <dd>{step.input}</dd>
              </div>
              <div>
                <dt>{thai ? HOTEL_SEO_PROCESS_FIELDS[2].th : HOTEL_SEO_PROCESS_FIELDS[2].en}</dt>
                <dd>
                  <span className="kpi-latin kpi-seo-local-process-output">{step.output}</span>
                </dd>
              </div>
              <div>
                <dt>{thai ? HOTEL_SEO_PROCESS_FIELDS[3].th : HOTEL_SEO_PROCESS_FIELDS[3].en}</dt>
                <dd>{step.nextDecision}</dd>
              </div>
            </dl>
          </div>
        </li>
      ))}
    </ol>
  );
}
