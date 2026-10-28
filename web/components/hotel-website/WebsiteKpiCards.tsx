import {
  WEBSITE_KPI_GROUPS,
  WEBSITE_KPI_OUTCOME_NOTE,
  WEBSITE_KPI_SAMPLE,
  WEBSITE_KPIS,
  websiteKpiIsPublic,
  websiteKpiPublicStatus,
  websiteKpiStatusLabel,
  type WebsiteKpiStatus,
} from "@/lib/hotel-website";
import type { Locale } from "@/lib/seo";

export type WebsiteKpiCard = {
  id: string;
  name: string;
  group?: string;
  period: string;
  unit: string;
  definition: string;
  comparison?: string;
  market?: string;
  source?: string;
  dataStatus: WebsiteKpiStatus;
  hideUntilData?: boolean;
  value?: string;
  updatedAt?: string;
  tone?: "green" | "yellow" | "amber";
};

function matchOverride(kpiId: string, kpiName: string, items?: WebsiteKpiCard[]) {
  return items?.find((row) => row.id === kpiId || row.name.trim() === kpiName);
}

export function WebsiteKpiCards({ locale, items }: { locale: Locale; items?: WebsiteKpiCard[] }) {
  const thai = locale === "th";
  const knownIds = new Set<string>(WEBSITE_KPIS.map((kpi) => kpi.id));
  const extras = (items || []).filter((row) => row.id && !knownIds.has(row.id) && row.name.trim());

  return (
    <div className="web-kpi-board">
      {WEBSITE_KPI_GROUPS.map((group) => {
        const rows = WEBSITE_KPIS.filter((kpi) => kpi.group === group.id).map((kpi) => {
          const override = matchOverride(kpi.id, kpi.nameEn, items);
          return {
            ...kpi,
            name: override?.name?.trim() || (thai ? kpi.nameTh : kpi.nameEn),
            period: override?.period?.trim() || (thai ? WEBSITE_KPI_SAMPLE.periodTh : kpi.period),
            market: override?.market?.trim() || (thai ? WEBSITE_KPI_SAMPLE.marketTh : kpi.market),
            source: override?.source?.trim() || (thai ? WEBSITE_KPI_SAMPLE.sourceTh : kpi.source),
            unit: override?.unit?.trim() || kpi.unit,
            definition: override?.definition?.trim() || kpi.definition,
            comparison: override?.comparison?.trim() || (thai && kpi.comparison === WEBSITE_KPI_SAMPLE.comparison ? WEBSITE_KPI_SAMPLE.comparisonTh : kpi.comparison),
            dataStatus: override?.dataStatus || kpi.dataStatus,
            hideUntilData: override?.hideUntilData ?? kpi.hideUntilData,
            value: override?.value || "",
            updatedAt: override?.updatedAt?.trim() || kpi.updatedAt,
            tone: override?.tone || kpi.tone,
          };
        });
        const extraRows = extras.filter((row) => (row.group || "") === group.id);
        const cards = [...rows, ...extraRows];
        if (!cards.length) return null;
        return (
          <section key={group.id} className={`web-kpi-group is-${group.id}`}>
            <p className="kpi-latin web-kpi-group-num">{group.num}</p>
            <h3 className="kpi-latin">{thai ? group.titleTh : group.titleEn}</h3>
            <p className="web-kpi-group-note">{thai ? group.noteTh : group.noteEn}</p>
            <div className="web-kpi-cards">
              {cards.map((kpi) => {
                const outcome = kpi.group === "outcome";
                const publicValue = websiteKpiIsPublic(kpi);
                const status = websiteKpiPublicStatus(kpi.dataStatus);
                const valueLabel = publicValue
                  ? kpi.value
                  : outcome
                    ? "Tracking not configured"
                    : thai
                      ? "ชุดข้อมูลตัวอย่าง"
                      : "Sample series";
                return (
                  <article
                    key={kpi.id}
                    className={`web-kpi-card${outcome || kpi.tone === "amber" ? " is-amber" : kpi.tone === "yellow" ? " is-yellow" : ""}`}
                  >
                    <div className="web-kpi-card-head">
                      <h4 className="kpi-latin">{kpi.name}</h4>
                      <span className={`kpi-latin web-kpi-status is-${status.toLowerCase()}`}>
                        {locale === "th" ? websiteKpiStatusLabel(kpi.dataStatus, locale) : status}
                      </span>
                    </div>
                    <p className={`kpi-latin web-kpi-value${publicValue ? "" : " is-pending"}`}>{valueLabel}</p>
                    <dl>
                      <div>
                        <dt>{thai ? "ช่วงเวลา" : "Period"}</dt>
                        <dd>{kpi.period}</dd>
                      </div>
                      <div>
                        <dt>{thai ? "โรงแรม / ตลาด" : "Property/market"}</dt>
                        <dd>{kpi.market}</dd>
                      </div>
                      <div>
                        <dt>{thai ? "หน่วย / คำนิยาม" : "Unit/definition"}</dt>
                        <dd>{[kpi.unit, kpi.definition].filter(Boolean).join(" · ")}</dd>
                      </div>
                      <div>
                        <dt>{thai ? "เป้าหมายหรือเปรียบเทียบ" : "Target or comparison"}</dt>
                        <dd>{kpi.comparison || "—"}</dd>
                      </div>
                      <div>
                        <dt>{thai ? "ที่มา" : "Source"}</dt>
                        <dd>{kpi.source}</dd>
                      </div>
                      <div>
                        <dt>{thai ? "สถานะข้อมูล" : "Data status"}</dt>
                        <dd>
                          <span className={`kpi-latin web-kpi-status is-${status.toLowerCase()}`}>
                            {locale === "th" ? websiteKpiStatusLabel(kpi.dataStatus, locale) : status}
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt>{thai ? "วันที่อัปเดต" : "Updated date"}</dt>
                        <dd className="kpi-latin">{kpi.updatedAt}</dd>
                      </div>
                    </dl>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
      <p className="web-kpi-outcome-note">
        {thai ? WEBSITE_KPI_OUTCOME_NOTE : "Booking Outcome is shown only when the Booking Engine and tracking events are connected and approved for use."}
      </p>
    </div>
  );
}
