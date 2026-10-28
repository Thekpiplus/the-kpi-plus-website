import { HOTEL_SEO_HELP_FIELDS, HOTEL_SEO_HELP_STEPS } from "@/lib/hotel-seo";
import type { Locale } from "@/lib/seo";

export type HotelSeoHelpStepView = {
  id: string;
  num: string;
  title: string;
  owner: string;
  input: string;
  action: string;
  output: string;
  nextDecision: string;
};

export function HotelSeoHelpSteps({ locale, steps }: { locale: Locale; steps?: HotelSeoHelpStepView[] }) {
  const thai = locale === "th";
  const data =
    steps?.length
      ? steps
      : HOTEL_SEO_HELP_STEPS.map((step) => ({
          id: step.id,
          num: step.num,
          title: thai ? step.titleTh : step.titleEn,
          owner: thai ? step.ownerTh : step.ownerEn,
          input: thai ? step.inputTh : step.inputEn,
          action: thai ? step.actionTh : step.actionEn,
          output: thai ? step.outputTh : step.outputEn,
          nextDecision: thai ? step.nextDecisionTh : step.nextDecisionEn,
        }));

  return (
    <ol className="kpi-seo-local-help-steps" aria-label={thai ? "ขั้นตอนการช่วยให้ธุรกิจถูกค้นพบและติดต่อได้" : "How The KPI Plus helps the business become discoverable and contactable"}>
      {data.map((step) => (
        <li key={step.id}>
          <span className="kpi-latin kpi-seo-local-help-num">{step.num}</span>
          <div className="kpi-seo-local-help-card">
            <h3>{step.title}</h3>
            <p className="kpi-latin kpi-seo-local-help-output">{step.output}</p>
            <dl>
              <div>
                <dt>{thai ? HOTEL_SEO_HELP_FIELDS[0].th : HOTEL_SEO_HELP_FIELDS[0].en}</dt>
                <dd>{step.owner}</dd>
              </div>
              <div>
                <dt>{thai ? HOTEL_SEO_HELP_FIELDS[1].th : HOTEL_SEO_HELP_FIELDS[1].en}</dt>
                <dd>{step.input}</dd>
              </div>
              <div>
                <dt>{thai ? HOTEL_SEO_HELP_FIELDS[2].th : HOTEL_SEO_HELP_FIELDS[2].en}</dt>
                <dd>{step.action}</dd>
              </div>
              <div>
                <dt>{thai ? HOTEL_SEO_HELP_FIELDS[3].th : HOTEL_SEO_HELP_FIELDS[3].en}</dt>
                <dd>
                  <span className="kpi-latin kpi-seo-local-help-output">{step.output}</span>
                </dd>
              </div>
              <div>
                <dt>{thai ? HOTEL_SEO_HELP_FIELDS[4].th : HOTEL_SEO_HELP_FIELDS[4].en}</dt>
                <dd>{step.nextDecision}</dd>
              </div>
            </dl>
          </div>
        </li>
      ))}
    </ol>
  );
}
