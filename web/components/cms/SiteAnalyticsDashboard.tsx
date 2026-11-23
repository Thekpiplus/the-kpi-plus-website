import Link from "next/link";
import { formatGa4Number, type Ga4MetricRow, type Ga4Overview, type Ga4Range } from "@/lib/ga4/reports";

const RANGES: Array<{ id: Ga4Range; label: string }> = [
  { id: "7", label: "7 วัน" },
  { id: "28", label: "28 วัน" },
  { id: "90", label: "90 วัน" },
];

const PALETTE = ["#0B6660", "#A3CE39", "#0B1F33", "#5B8A84", "#C5D96A", "#3B3B3B", "#7A9B98", "#E6E81F"];

function MetricCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="crm-dash-stat is-cms is-static crm-cms-analytics-metric" role="listitem">
      <span className="crm-dash-stat-label">{label}</span>
      <strong className="crm-dash-stat-value">{value}</strong>
      {hint ? <span className="crm-dash-stat-hint">{hint}</span> : null}
    </div>
  );
}

function donutBackground(rows: Ga4MetricRow[]) {
  const positive = rows.filter((row) => row.count > 0).slice(0, PALETTE.length);
  const total = positive.reduce((sum, row) => sum + row.count, 0);
  if (total <= 0 || positive.length === 0) {
    return { background: "conic-gradient(#E3E8EB 0 100%)", slices: [] as Array<Ga4MetricRow & { fill: string; share: number }> };
  }
  let cursor = 0;
  const parts: string[] = [];
  const slices = positive.map((row, index) => {
    const start = cursor;
    const end = cursor + (row.count / total) * 100;
    const fill = PALETTE[index % PALETTE.length];
    parts.push(`${fill} ${start}% ${end}%`);
    cursor = end;
    return { ...row, fill, share: Math.round((row.count / total) * 100) };
  });
  if (cursor < 100) parts.push(`#E3E8EB ${cursor}% 100%`);
  return { background: `conic-gradient(${parts.join(", ")})`, slices, total };
}

function DonutPanel({
  title,
  subtitle,
  rows,
  unit,
  empty,
}: {
  title: string;
  subtitle: string;
  rows: Ga4MetricRow[];
  unit: string;
  empty: string;
}) {
  const { background, slices, total = 0 } = donutBackground(rows);
  return (
    <section className="crm-cms-panel crm-cms-analytics-panel crm-cms-analytics-donut-panel">
      <header className="crm-cms-analytics-panel-head">
        <h2 className="crm-cms-overview-section-title">{title}</h2>
        <p className="crm-cms-analytics-panel-desc">{subtitle}</p>
      </header>
      {slices.length === 0 ? (
        <p className="crm-cms-empty-note">{empty}</p>
      ) : (
        <div className="crm-cms-analytics-donut-layout">
          <div
            className="crm-cms-analytics-donut"
            style={{ background }}
            role="img"
            aria-label={`${title} รวม ${formatGa4Number(total)} ${unit}`}
          >
            <span className="crm-cms-analytics-donut-hole">
              <strong>{formatGa4Number(total)}</strong>
              <em>{unit}</em>
            </span>
          </div>
          <ul className="crm-cms-analytics-legend">
            {slices.map((slice) => (
              <li key={`${title}-${slice.label}`}>
                <i style={{ background: slice.fill }} aria-hidden="true" />
                <div>
                  <strong>{slice.label}</strong>
                  {slice.secondary ? <span>{slice.secondary}</span> : null}
                </div>
                <em>
                  {slice.value}
                  <b>{slice.share}%</b>
                </em>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function HorizontalBars({
  title,
  subtitle,
  rows,
  empty,
}: {
  title: string;
  subtitle: string;
  rows: Ga4MetricRow[];
  empty: string;
}) {
  const max = Math.max(1, ...rows.map((row) => row.count));
  return (
    <section className="crm-cms-panel crm-cms-analytics-panel">
      <header className="crm-cms-analytics-panel-head">
        <h2 className="crm-cms-overview-section-title">{title}</h2>
        <p className="crm-cms-analytics-panel-desc">{subtitle}</p>
      </header>
      {rows.length === 0 ? (
        <p className="crm-cms-empty-note">{empty}</p>
      ) : (
        <ul className="crm-cms-analytics-hbar" role="list">
          {rows.slice(0, 8).map((row, index) => {
            const width = Math.max(6, Math.round((row.count / max) * 100));
            return (
              <li key={`${title}-${row.label}`} role="listitem">
                <span className="crm-cms-analytics-hbar-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="crm-cms-analytics-hbar-body">
                  <div className="crm-cms-analytics-hbar-label">
                    <strong title={row.label}>{row.label}</strong>
                    {row.secondary ? <span>{row.secondary}</span> : null}
                  </div>
                  <div className="crm-cms-analytics-hbar-track" aria-hidden="true">
                    <span style={{ width: `${width}%` }} />
                  </div>
                </div>
                <em>{row.value}</em>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function DailyTrendChart({
  daily,
}: {
  daily: Array<{ date: string; users: number; views: number }>;
}) {
  const width = 760;
  const height = 168;
  const padX = 14;
  const padTop = 14;
  const padBottom = 24;
  const innerW = width - padX * 2;
  const innerH = height - padTop - padBottom;
  const maxViews = Math.max(1, ...daily.map((d) => d.views));
  const maxUsers = Math.max(1, ...daily.map((d) => d.users));
  const n = Math.max(1, daily.length - 1);

  const point = (index: number, value: number, max: number) => {
    const x = padX + (index / n) * innerW;
    const y = padTop + innerH - (value / max) * innerH;
    return { x, y };
  };

  const viewsPoints = daily.map((d, i) => point(i, d.views, maxViews));
  const usersPoints = daily.map((d, i) => point(i, d.users, maxUsers));

  const toLine = (pts: Array<{ x: number; y: number }>) =>
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");

  const areaPath =
    viewsPoints.length > 0
      ? `${toLine(viewsPoints)} L${viewsPoints[viewsPoints.length - 1].x.toFixed(1)} ${(padTop + innerH).toFixed(1)} L${viewsPoints[0].x.toFixed(1)} ${(padTop + innerH).toFixed(1)} Z`
      : "";

  const labelEvery = daily.length > 20 ? 4 : daily.length > 12 ? 2 : 1;

  return (
    <section className="crm-cms-panel crm-cms-analytics-panel crm-cms-analytics-trend">
      <header className="crm-cms-analytics-panel-head crm-cms-analytics-trend-head">
        <div>
          <h2 className="crm-cms-overview-section-title">แนวโน้มรายวัน</h2>
          <p className="crm-cms-analytics-panel-desc">การดูหน้า (พื้นที่) และผู้ใช้ (เส้น) ตามวัน</p>
        </div>
        <ul className="crm-cms-analytics-trend-legend" aria-hidden="true">
          <li>
            <i className="is-views" />
            การดูหน้า
          </li>
          <li>
            <i className="is-users" />
            ผู้ใช้
          </li>
        </ul>
      </header>
      {daily.length === 0 ? (
        <p className="crm-cms-empty-note">ยังไม่มีข้อมูลในช่วงนี้</p>
      ) : (
        <div className="crm-cms-analytics-trend-frame">
          <svg
            className="crm-cms-analytics-trend-svg"
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label="กราฟแนวโน้มผู้ใช้และการดูหน้ารายวัน"
          >
            <defs>
              <linearGradient id="ga4ViewsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A3CE39" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#0B6660" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            {[0.25, 0.5, 0.75, 1].map((t) => {
              const y = padTop + innerH * (1 - t);
              return (
                <line
                  key={t}
                  x1={padX}
                  x2={width - padX}
                  y1={y}
                  y2={y}
                  className="crm-cms-analytics-trend-grid"
                />
              );
            })}
            {areaPath ? <path d={areaPath} fill="url(#ga4ViewsFill)" /> : null}
            <path d={toLine(viewsPoints)} className="crm-cms-analytics-trend-line is-views" fill="none" />
            <path d={toLine(usersPoints)} className="crm-cms-analytics-trend-line is-users" fill="none" />
            {usersPoints.map((p, i) =>
              i % labelEvery === 0 || i === usersPoints.length - 1 ? (
                <circle key={`u-${daily[i].date}`} cx={p.x} cy={p.y} r="2.6" className="crm-cms-analytics-trend-dot" />
              ) : null,
            )}
            {daily.map((day, i) =>
              i % labelEvery === 0 || i === daily.length - 1 ? (
                <text
                  key={`t-${day.date}`}
                  x={point(i, 0, 1).x}
                  y={height - 6}
                  textAnchor="middle"
                  className="crm-cms-analytics-trend-label"
                >
                  {day.date.slice(5)}
                </text>
              ) : null,
            )}
          </svg>
          <div className="crm-cms-analytics-trend-summary" aria-hidden="true">
            <span>
              สูงสุด <strong>{formatGa4Number(maxViews)}</strong> หน้า / วัน
            </span>
            <span>
              ผู้ใช้สูงสุด <strong>{formatGa4Number(maxUsers)}</strong> / วัน
            </span>
          </div>
        </div>
      )}
    </section>
  );
}

export function SiteAnalyticsSetup({
  propertyId,
  hasCredentials,
  clientEmail,
}: {
  propertyId: string;
  hasCredentials: boolean;
  clientEmail: string;
}) {
  return (
    <div className="crm-cms-analytics-setup">
      <section className="crm-cms-panel">
        <h2 className="crm-cms-overview-section-title">เชื่อมต่อ Google Analytics 4</h2>
        <p className="crm-cms-overview-section-desc">
          GTM แค่ยิงแท็ก — รายงานหน้าเพจ / ประเทศ / เมือง ดึงจาก GA4 Data API (ไม่มี IP รายบุคคลตามนโยบายความเป็นส่วนตัวของ Google)
        </p>
        <ol className="crm-cms-analytics-steps">
          <li>
            ใน GA4 ไปที่ <strong>Admin → Property settings</strong> คัดลอก <strong>Property ID</strong> (ตัวเลข)
            แล้วบันทึกที่{" "}
            <Link href="/crm/cms/globals">ตั้งค่าเว็บ</Link>
            {propertyId ? (
              <>
                {" "}
                · ตอนนี้ตั้งไว้แล้ว: <code>{propertyId}</code>
              </>
            ) : null}
          </li>
          <li>
            สร้าง Google Cloud <strong>Service Account</strong> เปิด <strong>Google Analytics Data API</strong>{" "}
            แล้วให้สิทธิ์ <strong>Viewer</strong> บน GA4 property นั้น
          </li>
          <li>
            ใส่ JSON ของ service account ทั้งก้อนใน env <code>GA4_SERVICE_ACCOUNT_JSON</code>
            {hasCredentials ? (
              <>
                {" "}
                · พร้อมแล้ว ({clientEmail || "service account"})
              </>
            ) : (
              " · ยังไม่พบใน environment"
            )}
          </li>
        </ol>
      </section>
    </div>
  );
}

export function SiteAnalyticsDashboard({
  data,
  range,
}: {
  data: Ga4Overview;
  range: Ga4Range;
}) {
  return (
    <div className="crm-cms-analytics">
      <div className="crm-cms-analytics-toolbar">
        <p className="crm-cms-analytics-note">
          ข้อมูลจาก GA4 property <code>{data.propertyId}</code> · รวมวันนี้ (อาจยังไม่ครบ) · ไม่แสดง IP รายบุคคล
        </p>
        <div className="crm-cms-analytics-ranges" role="group" aria-label="ช่วงเวลา">
          {RANGES.map((item) => (
            <Link
              key={item.id}
              href={`/crm/cms/analytics?range=${item.id}`}
              className={`crm-users-secondary${range === item.id ? " is-active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <section className="crm-dash-summary crm-cms-summary" aria-label="สรุปการเข้าชม">
        <div className="crm-dash-stats" role="list">
          <MetricCard label="ผู้ใช้" value={formatGa4Number(data.totals.activeUsers)} hint={`ย้อนหลัง ${range} วัน`} />
          <MetricCard label="เซสชัน" value={formatGa4Number(data.totals.sessions)} />
          <MetricCard label="การดูหน้า" value={formatGa4Number(data.totals.screenPageViews)} />
          <MetricCard
            label="Bounce rate"
            value={formatGa4Number(data.totals.bounceRate, "percent")}
            hint={`เฉลี่ย ${formatGa4Number(data.totals.averageSessionDuration, "duration")} / เซสชัน`}
          />
        </div>
      </section>

      {data.totals.activeUsers === 0 && data.totals.screenPageViews === 0 ? (
        <p className="crm-users-alert is-warn" role="status">
          เชื่อม GA4 สำเร็จแล้ว แต่ยังไม่พบข้อมูลในช่วงนี้ — เปิดหน้าเว็บสาธารณะแล้วกดยอมรับคุกกี้วิเคราะห์ รอสักครู่แล้วรีเฟรชหน้านี้
          (รายงานมาตรฐานอาจช้ากว่า Realtime)
        </p>
      ) : null}

      <DailyTrendChart daily={data.daily} />

      <div className="crm-cms-analytics-visual-grid">
        <DonutPanel
          title="อุปกรณ์"
          subtitle="สัดส่วนผู้ใช้ตามประเภทอุปกรณ์"
          rows={data.devices}
          unit="ผู้ใช้"
          empty="ยังไม่มีข้อมูลอุปกรณ์"
        />
        <DonutPanel
          title="ช่องทางเข้าชม"
          subtitle="สัดส่วนเซสชันตามช่องทาง"
          rows={data.sources}
          unit="เซสชัน"
          empty="ยังไม่มีข้อมูลช่องทาง"
        />
      </div>

      <div className="crm-cms-analytics-visual-grid is-bars">
        <HorizontalBars
          title="หน้ายอดนิยม"
          subtitle="อันดับตามจำนวนการดูหน้า"
          rows={data.topPages}
          empty="ยังไม่มีข้อมูลหน้า"
        />
        <HorizontalBars
          title="ประเทศ"
          subtitle="ผู้ใช้ตามประเทศ"
          rows={data.countries}
          empty="ยังไม่มีข้อมูลประเทศ"
        />
      </div>

      <HorizontalBars
        title="เมือง / ที่ตั้งโดยประมาณ"
        subtitle="ผู้ใช้ตามเมือง (ประมาณการจาก GA4)"
        rows={data.cities}
        empty="ยังไม่มีข้อมูลเมือง"
      />
    </div>
  );
}
