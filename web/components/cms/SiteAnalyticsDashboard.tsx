import Link from "next/link";
import { formatGa4Number, type Ga4Overview, type Ga4Range } from "@/lib/ga4/reports";

const RANGES: Array<{ id: Ga4Range; label: string }> = [
  { id: "7", label: "7 วัน" },
  { id: "28", label: "28 วัน" },
  { id: "90", label: "90 วัน" },
];

function MetricCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="crm-dash-stat is-cms is-static" role="listitem">
      <span className="crm-dash-stat-label">{label}</span>
      <strong className="crm-dash-stat-value">{value}</strong>
      {hint ? <span className="crm-dash-stat-hint">{hint}</span> : null}
    </div>
  );
}

function RankTable({
  title,
  rows,
  empty,
}: {
  title: string;
  rows: Array<{ label: string; value: string; secondary?: string }>;
  empty: string;
}) {
  return (
    <section className="crm-cms-panel crm-cms-analytics-panel">
      <h2 className="crm-cms-overview-section-title">{title}</h2>
      {rows.length === 0 ? (
        <p className="crm-cms-empty-note">{empty}</p>
      ) : (
        <ul className="crm-cms-analytics-list">
          {rows.map((row) => (
            <li key={`${title}-${row.label}`}>
              <div>
                <strong>{row.label}</strong>
                {row.secondary ? <span>{row.secondary}</span> : null}
              </div>
              <em>{row.value}</em>
            </li>
          ))}
        </ul>
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
  const maxViews = Math.max(1, ...data.daily.map((day) => day.views));

  return (
    <div className="crm-cms-analytics">
      <div className="crm-cms-analytics-toolbar">
        <p className="crm-cms-analytics-note">
          ข้อมูลจาก GA4 property <code>{data.propertyId}</code> · ไม่รวมวันนี้ · ไม่แสดง IP รายบุคคล
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

      <section className="crm-cms-panel crm-cms-analytics-panel">
        <h2 className="crm-cms-overview-section-title">แนวโน้มรายวัน</h2>
        {data.daily.length === 0 ? (
          <p className="crm-cms-empty-note">ยังไม่มีข้อมูลในช่วงนี้</p>
        ) : (
          <div className="crm-cms-analytics-chart" role="img" aria-label="กราฟการดูหน้ารายวัน">
            {data.daily.map((day) => (
              <div key={day.date} className="crm-cms-analytics-bar-wrap" title={`${day.date}: ${day.views} หน้า`}>
                <span
                  className="crm-cms-analytics-bar"
                  style={{ height: `${Math.max(8, (day.views / maxViews) * 100)}%` }}
                />
                <em>{day.date.slice(5)}</em>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="crm-cms-overview-grid">
        <RankTable title="หน้ายอดนิยม" rows={data.topPages} empty="ยังไม่มีข้อมูลหน้า" />
        <RankTable title="ประเทศ" rows={data.countries} empty="ยังไม่มีข้อมูลประเทศ" />
        <RankTable title="เมือง / ที่ตั้งโดยประมาณ" rows={data.cities} empty="ยังไม่มีข้อมูลเมือง" />
        <RankTable title="อุปกรณ์" rows={data.devices} empty="ยังไม่มีข้อมูลอุปกรณ์" />
        <RankTable title="ช่องทางเข้าชม" rows={data.sources} empty="ยังไม่มีข้อมูลช่องทาง" />
      </div>
    </div>
  );
}
