import {
  HOTEL_SEO_KPI_COPY,
  HOTEL_SEO_KPI_FIELDS,
  HOTEL_SEO_KPI_GROUPS,
  HOTEL_SEO_KPIS,
  hotelSeoKpiSampleMeta,
  hotelSeoKpiShowsValue,
  hotelSeoKpiStatusLabel,
  type HotelSeoKpiOverride,
} from "@/lib/hotel-seo";
import type { Locale } from "@/lib/seo";

function matchOverride(kpiId: string, kpiName: string, overrides?: HotelSeoKpiOverride[]) {
  return overrides?.find((row) => row.id === kpiId || row.name?.trim() === kpiName);
}

export function HotelSeoKpiFramework({
  locale,
  overrides,
}: {
  locale: Locale;
  overrides?: HotelSeoKpiOverride[];
}) {
  const thai = locale === "th";
  const sample = hotelSeoKpiSampleMeta();
  const cmsItems = overrides?.filter((row) => row.id || row.name) ?? [];
  const useCmsItems = cmsItems.length > 0;
  const extraGroups = useCmsItems
    ? [...new Set(cmsItems.map((row) => row.group || "business"))].filter(
        (id) => !HOTEL_SEO_KPI_GROUPS.some((group) => group.id === id),
      )
    : [];
  const groups = [
    ...HOTEL_SEO_KPI_GROUPS,
    ...extraGroups.map((id, index) => ({
      id,
      num: String(HOTEL_SEO_KPI_GROUPS.length + index + 1).padStart(2, "0"),
      titleTh: id,
      titleEn: id,
      noteTh: "",
      noteEn: "",
    })),
  ];
  const showSampleBanner =
    !useCmsItems ||
    cmsItems.some((row) => row.dataStatus === "sample" || row.dataStatus === "draft" || !row.dataStatus);

  return (
    <div className="kpi-seo-local-kpi-framework">
      <p className="kpi-latin kpi-seo-local-kpi-kicker">{thai ? HOTEL_SEO_KPI_COPY.kicker.th : HOTEL_SEO_KPI_COPY.kicker.en}</p>
      {showSampleBanner ? <p className="kpi-seo-local-kpi-sample-label">{thai ? "ตัวอย่างข้อมูล" : "Sample data"}</p> : null}
      <div className="kpi-seo-local-kpi-groups">
        {groups.map((group) => {
          const rows = useCmsItems
            ? cmsItems.filter((row) => (row.group || "business") === group.id)
            : HOTEL_SEO_KPIS.filter((kpi) => kpi.group === group.id).map((kpi) => {
                const override = matchOverride(kpi.id, kpi.nameEn, overrides);
                return {
                  id: kpi.id,
                  name: override?.name?.trim() || (thai ? kpi.nameTh : kpi.nameEn),
                  group: kpi.group,
                  definition: override?.definition?.trim() || (thai ? kpi.definitionTh : kpi.definitionEn),
                  unit: override?.unit,
                  period: override?.period,
                  target: override?.target,
                  value: override?.value,
                  context: override?.context,
                  dataStatus: override?.dataStatus,
                  updatedAt: override?.updatedAt,
                  hideUntilData: override?.hideUntilData,
                  source: override?.source || kpi.source,
                };
              });
          if (!rows.length) return null;
          return (
            <section key={group.id} className={`kpi-seo-local-kpi-group is-${group.id}`}>
              <p className="kpi-latin kpi-seo-local-kpi-num">{group.num}</p>
              <h3 className="kpi-latin">{thai ? group.titleTh : group.titleEn}</h3>
              {group.noteTh || group.noteEn ? (
                <p className="kpi-seo-local-kpi-note">{thai ? group.noteTh : group.noteEn}</p>
              ) : null}
              <div className="kpi-seo-local-kpi-cards">
                {rows.map((row) => {
                  const status = hotelSeoKpiStatusLabel(row.dataStatus);
                  const showValue = hotelSeoKpiShowsValue(row);
                  const sourceName = row.source?.name?.trim() || (thai ? sample.propertyTh : sample.propertyEn);
                  const sourceUrl = row.source?.url?.trim() || "";
                  const period = row.period?.trim() || (thai ? sample.periodTh : sample.periodEn);
                  const property =
                    ("market" in (row.source || {}) ? String((row.source as { market?: string }).market || "").trim() : "") ||
                    row.context?.trim() ||
                    (thai ? sample.propertyTh : sample.propertyEn);
                  const definition = [row.unit?.trim(), row.definition?.trim()].filter(Boolean).join(" · ") || (thai ? sample.comparisonTh : sample.comparisonEn);
                  const comparison = row.target?.trim() || (showValue ? "—" : thai ? sample.comparisonTh : sample.comparisonEn);
                  const updated = row.updatedAt?.trim() || sample.updatedAt;
                  return (
                    <article key={row.id || row.name} className="kpi-seo-local-kpi-card">
                      <div className="kpi-seo-local-kpi-card-head">
                        <h4 className="kpi-latin">{row.name}</h4>
                        <span className={`kpi-latin kpi-seo-local-kpi-status is-${status.toLowerCase()}`}>{status}</span>
                      </div>
                      {showValue ? <p className="kpi-latin kpi-seo-local-kpi-value">{row.value}</p> : null}
                      <dl>
                        <div>
                          <dt>{thai ? HOTEL_SEO_KPI_FIELDS[0].th : HOTEL_SEO_KPI_FIELDS[0].en}</dt>
                          <dd>
                            {sourceUrl ? (
                              <a className="kpi-latin" href={sourceUrl} target="_blank" rel="noreferrer">
                                {sourceName}
                              </a>
                            ) : (
                              <span className="kpi-latin">{sourceName}</span>
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt>{thai ? HOTEL_SEO_KPI_FIELDS[1].th : HOTEL_SEO_KPI_FIELDS[1].en}</dt>
                          <dd>{period}</dd>
                        </div>
                        <div>
                          <dt>{thai ? HOTEL_SEO_KPI_FIELDS[2].th : HOTEL_SEO_KPI_FIELDS[2].en}</dt>
                          <dd>{property}</dd>
                        </div>
                        <div>
                          <dt>{thai ? HOTEL_SEO_KPI_FIELDS[3].th : HOTEL_SEO_KPI_FIELDS[3].en}</dt>
                          <dd>{definition}</dd>
                        </div>
                        <div>
                          <dt>{thai ? HOTEL_SEO_KPI_FIELDS[4].th : HOTEL_SEO_KPI_FIELDS[4].en}</dt>
                          <dd>
                            <span className={`kpi-latin kpi-seo-local-kpi-status is-${status.toLowerCase()}`}>{status}</span>
                          </dd>
                        </div>
                        <div>
                          <dt>{thai ? HOTEL_SEO_KPI_FIELDS[5].th : HOTEL_SEO_KPI_FIELDS[5].en}</dt>
                          <dd className="kpi-latin">{updated}</dd>
                        </div>
                        <div>
                          <dt>{thai ? HOTEL_SEO_KPI_FIELDS[6].th : HOTEL_SEO_KPI_FIELDS[6].en}</dt>
                          <dd>{comparison}</dd>
                        </div>
                      </dl>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
