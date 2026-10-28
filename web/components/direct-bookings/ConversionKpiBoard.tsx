import {
  DIRECT_BOOKING_KPI_COLORS,
  DIRECT_BOOKING_KPI_GROUPS,
  DIRECT_BOOKING_KPI_SAMPLE,
  DIRECT_BOOKING_KPI_SERIES,
  DIRECT_BOOKING_KPIS,
  directBookingKpiIsPublic,
  directBookingKpiStatusLabel,
  directBookingSampleLabel,
  type DirectBookingKpiStatus,
} from "@/lib/direct-bookings";
import type { Locale } from "@/lib/seo";

export type ConversionKpiCard = {
  id: string;
  name: string;
  group: string;
  period: string;
  unit: string;
  definition: string;
  comparison?: string;
  target?: string;
  market?: string;
  source?: string;
  sourceUrl?: string;
  value?: string;
  labels?: string[];
  values?: number[];
  dataStatus: DirectBookingKpiStatus;
  hideUntilData?: boolean;
  updatedAt?: string;
  tone?: "green" | "yellow" | "amber";
};

const WIDTH = 720;
const HEIGHT = 405;
const PAD = { top: 28, right: 28, bottom: 52, left: 56 };

function createPath(values: number[], maxValue: number) {
  const plotWidth = WIDTH - PAD.left - PAD.right;
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;
  const step = values.length > 1 ? plotWidth / (values.length - 1) : plotWidth;
  return values
    .map((value, index) => {
      const x = PAD.left + index * step;
      const y = PAD.top + plotHeight - (value / maxValue) * plotHeight;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function parseTarget(value?: string) {
  if (!value) return null;
  const next = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(next) ? next : null;
}

function matchOverride(kpiId: string, kpiName: string, items?: ConversionKpiCard[]) {
  return items?.find((row) => row.id === kpiId || row.name.trim() === kpiName);
}

function statusClass(status: DirectBookingKpiStatus) {
  if (status === "approved" || status === "anonymised") return "";
  return " is-sample";
}

export function ConversionKpiBoard({
  locale,
  items,
  trackingReady = false,
}: {
  locale: Locale;
  items?: ConversionKpiCard[];
  trackingReady?: boolean;
}) {
  const thai = locale === "th";
  const knownIds = new Set<string>(DIRECT_BOOKING_KPIS.map((kpi) => kpi.id));
  const extras = (items || []).filter((row) => row.id && !knownIds.has(row.id) && row.name.trim());
  const chartSeries = (items || [])
    .filter((kpi) => kpi.group !== "complete" && kpi.labels?.length && kpi.values?.length)
    .map((kpi) => ({
      id: kpi.id,
      name: kpi.name,
      labels: kpi.labels || [],
      values: kpi.values || [],
      target: kpi.target,
      sample: kpi.dataStatus === "sample" || kpi.dataStatus === "draft",
    }));
  const series = chartSeries.length
    ? chartSeries
    : DIRECT_BOOKING_KPI_SERIES.map((item) => ({
        id: item.id,
        name: item.name,
        labels: [...item.labels],
        values: [...item.values],
        target: item.target,
        sample: true,
      }));
  const labels = series[0]?.labels?.length ? series[0].labels : [...DIRECT_BOOKING_KPI_SERIES[0].labels];
  const peak = Math.max(...series.flatMap((item) => item.values), ...series.map((item) => parseTarget(item.target) ?? 0), 1);
  const maxValue = Math.max(1, Math.ceil(peak / 5) * 5);
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;
  const sampleChart = series.every((item) => item.sample) || !trackingReady;
  const title = "Direct Booking Performance Metrics";
  const subtitle = thai
    ? "ดัชนีตัวอย่าง มีป้ายกำกับ ไม่ใช่ยอดโรงแรม และไม่รวม Booking Complete จนกว่าระบบจองจะยืนยันได้"
    : "Labelled sample index. Not a hotel result. Booking Complete is not plotted until a verifiable source exists.";
  const colors = [DIRECT_BOOKING_KPI_COLORS.positive, DIRECT_BOOKING_KPI_COLORS.target, DIRECT_BOOKING_KPI_COLORS.warning];

  return (
    <div className="db-kpi-board">
      <figure className="db-kpi-chart">
        <div className="db-kpi-chart-head">
          <div>
            <h3 className="kpi-latin">{title}</h3>
            <p>{subtitle}</p>
          </div>
          {sampleChart ? <span className="kpi-latin db-kpi-status is-sample">{directBookingSampleLabel(locale)}</span> : null}
        </div>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          width={720}
          height={405}
          role="img"
          aria-labelledby="direct-booking-kpi-chart-title"
          aria-describedby="direct-booking-kpi-chart-desc"
        >
          <title id="direct-booking-kpi-chart-title">{title}</title>
          <desc id="direct-booking-kpi-chart-desc">{subtitle}</desc>
          <rect width={WIDTH} height={HEIGHT} fill="#ffffff" />
          {[0, 1, 2, 3, 4].map((tick) => {
            const y = PAD.top + (plotHeight / 4) * tick;
            const value = maxValue - (maxValue / 4) * tick;
            return (
              <g key={tick}>
                <line x1={PAD.left} x2={WIDTH - PAD.right} y1={y} y2={y} stroke={DIRECT_BOOKING_KPI_COLORS.grid} />
                <text x={PAD.left - 8} y={y + 4} textAnchor="end" fill={DIRECT_BOOKING_KPI_COLORS.label} fontSize="11">
                  {Math.round(value)}
                </text>
              </g>
            );
          })}
          {labels.map((label, index) => {
            const x = PAD.left + (labels.length > 1 ? ((WIDTH - PAD.left - PAD.right) / (labels.length - 1)) * index : 0);
            return (
              <text key={`${label}-${index}`} x={x} y={HEIGHT - 18} textAnchor="middle" fill={DIRECT_BOOKING_KPI_COLORS.axis} fontSize="11">
                {label}
              </text>
            );
          })}
          {series.map((item, index) => (
            <path
              key={item.id}
              d={createPath(item.values, maxValue)}
              fill="none"
              stroke={colors[index % colors.length]}
              strokeWidth="3"
              strokeDasharray={item.sample ? "7 5" : undefined}
            />
          ))}
        </svg>
        <div className="db-kpi-chart-legend">
          {series.map((item, index) => (
            <span key={item.id} className="kpi-latin">
              <i style={{ background: colors[index % colors.length] }} />
              {item.name}
            </span>
          ))}
        </div>
      </figure>
      {DIRECT_BOOKING_KPI_GROUPS.map((group) => {
        const rows = DIRECT_BOOKING_KPIS.filter((kpi) => kpi.group === group.id).map((kpi) => {
          const override = matchOverride(kpi.id, kpi.nameEn, items);
          return {
            ...kpi,
            name: override?.name?.trim() || (thai ? kpi.nameTh : kpi.nameEn),
            period: override?.period?.trim() || (thai ? DIRECT_BOOKING_KPI_SAMPLE.periodTh : DIRECT_BOOKING_KPI_SAMPLE.period),
            market: override?.market?.trim() || (thai ? DIRECT_BOOKING_KPI_SAMPLE.marketTh : DIRECT_BOOKING_KPI_SAMPLE.market),
            source: override?.source?.trim() || (thai ? DIRECT_BOOKING_KPI_SAMPLE.sourceTh : DIRECT_BOOKING_KPI_SAMPLE.source),
            sourceUrl: override?.sourceUrl || "",
            unit: override?.unit?.trim() || (thai ? kpi.unitTh : kpi.unit),
            definition: override?.definition?.trim() || (thai ? kpi.definitionTh : kpi.definition),
            comparison: override?.comparison?.trim() || (thai ? DIRECT_BOOKING_KPI_SAMPLE.comparisonTh : DIRECT_BOOKING_KPI_SAMPLE.comparison),
            dataStatus: override?.dataStatus || kpi.dataStatus,
            hideUntilData: override?.hideUntilData ?? kpi.hideUntilData,
            value: override?.value || "",
            updatedAt: override?.updatedAt?.trim() || DIRECT_BOOKING_KPI_SAMPLE.updatedAt,
            tone: override?.tone || kpi.tone,
            group: kpi.group,
          };
        });
        const extraRows = extras.filter((row) => (row.group || "") === group.id);
        const cards = [...rows, ...extraRows];
        if (!cards.length) return null;
        return (
          <section key={group.id} className="db-kpi-group">
            <p className="kpi-latin db-kpi-group-num">{group.num}</p>
            <h3 className="kpi-latin">{thai ? group.titleTh : group.titleEn}</h3>
            <p className="db-kpi-group-note">{thai ? group.noteTh : group.noteEn}</p>
            <div className="db-kpi-cards">
              {cards.map((kpi) => {
                const complete = kpi.group === "complete";
                const publicValue = complete && !trackingReady ? false : directBookingKpiIsPublic(kpi);
                const status = kpi.dataStatus;
                const valueLabel = publicValue
                  ? kpi.value
                  : complete
                    ? thai
                      ? "ยังไม่เชื่อมการวัดผล"
                      : "Tracking not configured"
                    : thai
                      ? "ชุดข้อมูลตัวอย่าง"
                      : "Sample series";
                return (
                  <article
                    key={kpi.id}
                    className={`db-kpi-card${complete || kpi.tone === "amber" ? " is-amber" : kpi.tone === "yellow" ? " is-yellow" : ""}`}
                  >
                    <div className="db-kpi-card-head">
                      <h4 className="kpi-latin">{kpi.name}</h4>
                      <span className={`kpi-latin db-kpi-status${statusClass(status)}`}>
                        {directBookingKpiStatusLabel(status, locale)}
                      </span>
                    </div>
                    <p className={`kpi-latin db-kpi-value${publicValue ? "" : " is-pending"}`}>{valueLabel}</p>
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
                        <dd>
                          {kpi.sourceUrl ? (
                            <a href={kpi.sourceUrl} target="_blank" rel="noreferrer">
                              {kpi.source}
                            </a>
                          ) : (
                            kpi.source
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt>{thai ? "สถานะข้อมูล" : "Data status"}</dt>
                        <dd>
                          <span className={`kpi-latin db-kpi-status${statusClass(status)}`}>
                            {directBookingKpiStatusLabel(status, locale)}
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
    </div>
  );
}
