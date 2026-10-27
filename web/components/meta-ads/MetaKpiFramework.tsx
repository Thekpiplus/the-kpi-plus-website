import { META_KPI_FUNNEL, META_KPI_GROUPS, META_KPIS } from "@/lib/meta-ads";
import type { Locale } from "@/lib/seo";

export function MetaKpiFramework({ locale }: { locale: Locale }) {
  const thai = locale === "th";
  return (
    <div className="ads-kpi-framework">
      <div className="ads-kpi-groups">
        {META_KPI_GROUPS.map((group) => (
          <section key={group.id} className={`ads-kpi-group is-${group.id}`}>
            <h3 className="kpi-latin">{thai ? group.titleTh : group.titleEn}</h3>
            <p>{thai ? group.noteTh : group.noteEn}</p>
            <ul>
              {META_KPIS.filter((kpi) => kpi.group === group.id).map((kpi) => (
                <li key={kpi.id}>
                  <span className="kpi-latin">{kpi.name}</span>
                  <small>{thai ? kpi.definitionTh : kpi.definitionEn}</small>
                  {"relevant" in kpi && kpi.relevant ? (
                    <em>{thai ? "ใช้เมื่อเกี่ยวข้องกับวัตถุประสงค์" : "When relevant to the objective"}</em>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <ol className="ads-kpi-funnel" aria-label={thai ? "กรวยการวัดผลจากโฆษณาถึงการจอง" : "Tracking funnel from ad view to booking"}>
        {META_KPI_FUNNEL.map((step, index) => (
          <li key={step.id}>
            <span className="kpi-latin ads-kpi-funnel__index">{String(index + 1).padStart(2, "0")}</span>
            <strong className="kpi-latin">{step.name}</strong>
            <small>{thai ? step.noteTh : step.noteEn}</small>
          </li>
        ))}
      </ol>
    </div>
  );
}
