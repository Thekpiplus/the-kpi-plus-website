import { b2bRealKpi, type B2bFunnelMarker, type B2bKpi } from "@/lib/b2b";
import type { Locale } from "@/lib/seo";

export type B2bFunnelStage = {
  id: string;
  number: string;
  marker: B2bFunnelMarker;
  label: string;
  definition: string;
  output: string;
  kpiId: string;
  kpiName: string;
  extraKpis?: Array<{ id: string; name: string }>;
};

export function B2bFunnelStages({
  locale,
  steps,
  kpis,
}: {
  locale: Locale;
  steps: B2bFunnelStage[];
  kpis: B2bKpi[];
}) {
  const thai = locale === "th";
  const definitionLabel = thai ? "ความหมาย" : "Definition";
  const outputLabel = thai ? "สิ่งที่ได้" : "Expected output";
  const kpiLabel = thai ? "ตัวชี้วัด" : "KPI";
  const periodLabel = thai ? "ช่วงเวลา" : "Period";
  const unitLabel = thai ? "หน่วย" : "Unit";
  const comparisonLabel = thai ? "เปรียบเทียบ" : "Comparison";
  const statusLabel = thai ? "สถานะข้อมูล" : "Data status";

  return (
    <ol className="kpi-b2b-funnel-stages">
      {steps.map((step, index) => {
        const kpiFields = [
          ...(step.kpiId && step.kpiName ? [{ id: step.kpiId, name: step.kpiName }] : []),
          ...(step.extraKpis ?? []),
        ];
        return (
          <li key={step.id} className={`kpi-b2b-funnel-stage is-${step.marker}`}>
            <span className="kpi-latin kpi-b2b-funnel-stage-num">{step.number}</span>
            <div className="kpi-b2b-funnel-stage-copy">
              <h3 className="kpi-latin">{step.label}</h3>
              <dl>
                <div>
                  <dt>{definitionLabel}</dt>
                  <dd>{step.definition}</dd>
                </div>
                <div>
                  <dt>{outputLabel}</dt>
                  <dd>
                    <span className="kpi-b2b-funnel-output">{step.output}</span>
                  </dd>
                </div>
                {kpiFields.length ? (
                  <div>
                    <dt>{kpiLabel}</dt>
                    <dd>
                      <ul className="kpi-b2b-funnel-kpis">
                        {kpiFields.map((field) => {
                          const kpi = b2bRealKpi(kpis, field.id, locale);
                          if (!kpi) {
                            return (
                              <li key={field.id || field.name} className="kpi-latin kpi-b2b-funnel-kpi-slot">
                                {field.name}
                              </li>
                            );
                          }
                          return (
                            <li key={kpi.id}>
                              <p className="kpi-latin kpi-b2b-funnel-kpi-name">{kpi.name}</p>
                              <p className="kpi-b2b-funnel-kpi-value">{kpi.display}</p>
                              <dl className="kpi-b2b-funnel-kpi-meta">
                                <div>
                                  <dt>{periodLabel}</dt>
                                  <dd>{kpi.period}</dd>
                                </div>
                                <div>
                                  <dt>{unitLabel}</dt>
                                  <dd>{kpi.unit}</dd>
                                </div>
                                <div>
                                  <dt>{comparisonLabel}</dt>
                                  <dd>{kpi.comparison || "—"}</dd>
                                </div>
                                <div>
                                  <dt>{statusLabel}</dt>
                                  <dd>{kpi.dataStatus}</dd>
                                </div>
                              </dl>
                            </li>
                          );
                        })}
                      </ul>
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>
            {index < steps.length - 1 ? (
              <span className={`kpi-b2b-funnel-down is-${steps[index + 1]?.marker === "risk" ? "risk" : "path"}`} aria-hidden="true">
                ↓
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
