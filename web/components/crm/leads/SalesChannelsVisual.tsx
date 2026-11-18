import Link from "next/link";
import { channelFill } from "@/components/crm/leads/lead-channel-types";

export type SalesChannelRow = {
  source: string;
  label: string;
  count: number;
};

export function SalesChannelsVisual({ channels }: { channels: SalesChannelRow[] }) {
  const total = channels.reduce((sum, item) => sum + item.count, 0);
  const dealTotal = Math.max(1, total);
  const chartMax = Math.max(1, ...channels.map((item) => item.count));

  const rows = channels.map((item, index) => ({
    ...item,
    fill: channelFill(item.source, index),
    share: Math.round((item.count / dealTotal) * 100),
  }));

  let cursor = 0;
  const donutParts: string[] = [];
  for (const row of rows) {
    if (row.count <= 0) continue;
    const start = cursor;
    const end = cursor + (row.count / dealTotal) * 100;
    donutParts.push(`${row.fill} ${start}% ${end}%`);
    cursor = end;
  }
  if (cursor < 100) donutParts.push(`#eef1ee ${cursor}% 100%`);
  const donutStyle = {
    background:
      total <= 0 ? "conic-gradient(#eef1ee 0 100%)" : `conic-gradient(${donutParts.join(", ")})`,
  };

  return (
    <div className="kpi-leads-ch-visual">
      <div className="kpi-leads-ch-donut-wrap">
        <div
          className="kpi-leads-ch-donut"
          style={donutStyle}
          role="img"
          aria-label={`สัดส่วนลีดตามช่องทาง รวม ${total} รายการ`}
        >
          <div className="kpi-leads-ch-donut-hole">
            <strong className="num">{total}</strong>
            <span>รายการ</span>
          </div>
        </div>
        <ul className="kpi-leads-ch-legend">
          {rows
            .filter((row) => row.count > 0)
            .map((row) => (
              <li key={row.source} style={{ ["--ch-fill" as string]: row.fill }}>
                <i aria-hidden="true" />
                <span>{row.label}</span>
                <em className="num">{row.share}%</em>
              </li>
            ))}
        </ul>
      </div>

      <div className="kpi-leads-ch-chart" role="list" aria-label="กราฟแท่งจำนวนลีดตามช่องทาง">
        {rows.map((row, index) => {
          const barWidth =
            row.count > 0 ? Math.max(8, Math.round((row.count / chartMax) * 100)) : 0;
          return (
            <Link
              key={row.source}
              href={`/crm/leads?view=channel&source=${encodeURIComponent(row.source)}`}
              role="listitem"
              className={`kpi-leads-ch-chart-row${row.count === 0 ? " is-empty" : ""}`}
              style={{ ["--ch-fill" as string]: row.fill }}
              title={`${row.label}: ${row.count} รายการ (${row.share}%)`}
              aria-label={`${row.label} ${row.count} รายการ สัดส่วน ${row.share} เปอร์เซ็นต์ — เปิดรายการช่องทางนี้`}
            >
              <span className="kpi-leads-ch-chart-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="kpi-leads-ch-chart-label">{row.label}</span>
              <span className="kpi-leads-ch-chart-track" aria-hidden="true">
                <span className="kpi-leads-ch-chart-bar" style={{ width: `${barWidth}%` }} />
              </span>
              <span className="kpi-leads-ch-chart-meta" aria-hidden="true">
                <strong className="num">{row.count}</strong>
                <em className="num">{row.share}%</em>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
