import { adsKpiStatusLabel } from "@/lib/google-ads";
import type { Locale } from "@/lib/seo";

export type AdsKpiCard = {
  id: string;
  name: string;
  definition: string;
  unit: string;
  period: string;
  target: string;
  value: string;
  context: string;
  dataStatus: string;
  updatedAt: string;
};

export function AdsKpiCards({ locale, kpis }: { locale: Locale; kpis: AdsKpiCard[] }) {
  const thai = locale === "th";
  if (!kpis.length) return null;

  return (
    <div className="kpi-google-ads-measure-metrics">
      {kpis.map((kpi) => {
        const status = adsKpiStatusLabel(kpi.dataStatus);
        return (
          <article key={kpi.id} className="kpi-google-ads-measure-metric">
            {kpi.dataStatus !== "approved" && kpi.dataStatus !== "anonymised" ? (
              <p className="kpi-google-ads-measure-sample">{thai ? "ตัวอย่างข้อมูล" : "Sample data"}</p>
            ) : null}
            <p className="kpi-latin kpi-google-ads-measure-name">{kpi.name}</p>
            <p className="kpi-latin kpi-google-ads-measure-value">{kpi.value.trim() || "—"}</p>
            <p className="kpi-google-ads-measure-label">{kpi.definition}</p>
            <dl className="kpi-google-ads-kpi-meta">
              <div>
                <dt>{thai ? "ช่วงเวลา" : "Period"}</dt>
                <dd>{kpi.period.trim() || "—"}</dd>
              </div>
              <div>
                <dt>{thai ? "หน่วย / คำนิยาม" : "Unit / definition"}</dt>
                <dd>{kpi.unit || kpi.definition}</dd>
              </div>
              <div>
                <dt>{thai ? "เป้าหมายหรือเปรียบเทียบ" : "Target or comparison"}</dt>
                <dd>{kpi.target.trim() || "—"}</dd>
              </div>
              <div>
                <dt>{thai ? "แคมเปญหรือช่องทาง" : "Campaign or channel"}</dt>
                <dd>{kpi.context.trim() || "—"}</dd>
              </div>
              <div>
                <dt>{thai ? "สถานะข้อมูล" : "Data status"}</dt>
                <dd>
                  <span className={`kpi-google-ads-kpi-status is-${status.toLowerCase()}`}>{status}</span>
                </dd>
              </div>
              <div>
                <dt>{thai ? "วันที่อัปเดต" : "Updated date"}</dt>
                <dd>{kpi.updatedAt.trim() || "—"}</dd>
              </div>
            </dl>
          </article>
        );
      })}
    </div>
  );
}
