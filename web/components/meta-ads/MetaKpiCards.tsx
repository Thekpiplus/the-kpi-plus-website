import { META_KPI_GROUPS, metaKpiGroupFrom, metaKpiStatusLabel } from "@/lib/meta-ads";
import type { Locale } from "@/lib/seo";

export type AdsKpiCard = {
  id: string;
  name: string;
  group?: string;
  objective?: string;
  market?: string;
  definition: string;
  unit: string;
  period: string;
  target: string;
  value: string;
  context: string;
  dataStatus: string;
  updatedAt: string;
};

export function MetaKpiCards({ locale, kpis }: { locale: Locale; kpis: AdsKpiCard[] }) {
  const thai = locale === "th";
  if (!kpis.length) return null;
  const grouped = META_KPI_GROUPS.map((group) => ({
    ...group,
    items: kpis.filter((kpi) => metaKpiGroupFrom(kpi) === group.id),
  })).filter((group) => group.items.length);

  return (
    <div className="ads-kpi-board">
      {grouped.map((group) => (
        <section key={group.id} className={`ads-kpi-group is-${group.id}`}>
          <h3 className="kpi-latin">{thai ? group.titleTh : group.titleEn}</h3>
          <p>{thai ? group.noteTh : group.noteEn}</p>
          <div className="kpi-meta-ads-measure-metrics">
            {group.items.map((kpi) => {
              const status = metaKpiStatusLabel(kpi.dataStatus);
              return (
                <article key={kpi.id} className="kpi-meta-ads-measure-metric">
                  {kpi.dataStatus !== "approved" && kpi.dataStatus !== "anonymised" ? (
                    <p className="kpi-meta-ads-measure-sample">{thai ? "ตัวอย่างข้อมูล" : "Sample data"}</p>
                  ) : null}
                  <p className="kpi-latin kpi-meta-ads-measure-name">{kpi.name}</p>
                  <p className="kpi-latin kpi-meta-ads-measure-value">{kpi.value.trim() || "—"}</p>
                  <p className="kpi-meta-ads-measure-label">{kpi.definition}</p>
                  <dl className="kpi-meta-ads-kpi-meta">
                    <div>
                      <dt>{thai ? "วัตถุประสงค์แคมเปญ" : "Campaign objective"}</dt>
                      <dd>{kpi.objective?.trim() || kpi.context.trim() || "—"}</dd>
                    </div>
                    <div>
                      <dt>{thai ? "ตลาด / กลุ่มลูกค้า" : "Market/audience"}</dt>
                      <dd>{kpi.market?.trim() || "—"}</dd>
                    </div>
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
                      <dt>{thai ? "สถานะข้อมูล" : "Data status"}</dt>
                      <dd>
                        <span className={`kpi-meta-ads-kpi-status is-${status.toLowerCase()}`}>{status}</span>
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
        </section>
      ))}
    </div>
  );
}
