"use client";

import { useMemo } from "react";
import {
  kindFill,
  type ActivityKindFilter,
  type ActivityStatusFilter,
} from "@/components/crm/activities/activity-types";
import { ACTIVITY_TONES, type ActivityKindTone } from "@/components/crm/activities/activity-tones";

type StatusSlice = {
  id: Exclude<ActivityStatusFilter, "open">;
  label: string;
  count: number;
  fill: string;
};

type KindRow = {
  id: ActivityKindTone;
  label: string;
  count: number;
};

export function ActivitiesVisual({
  openTotal,
  statusSlices,
  kindRows,
  activeStatus,
  activeKind,
  onStatus,
  onKind,
}: {
  openTotal: number;
  statusSlices: StatusSlice[];
  kindRows: KindRow[];
  activeStatus: ActivityStatusFilter;
  activeKind: ActivityKindFilter;
  onStatus: (next: ActivityStatusFilter) => void;
  onKind: (next: ActivityKindFilter) => void;
}) {
  const statusTotal = Math.max(
    1,
    statusSlices.reduce((sum, item) => sum + item.count, 0),
  );
  const chartMax = Math.max(1, ...kindRows.map((item) => item.count));

  const donutStyle = useMemo(() => {
    const positive = statusSlices.filter((item) => item.count > 0);
    if (positive.length === 0) {
      return { background: `conic-gradient(${ACTIVITY_TONES.border} 0 100%)` };
    }
    let cursor = 0;
    const parts: string[] = [];
    for (const slice of positive) {
      const start = cursor;
      const end = cursor + (slice.count / statusTotal) * 100;
      parts.push(`${slice.fill} ${start}% ${end}%`);
      cursor = end;
    }
    if (cursor < 100) parts.push(`${ACTIVITY_TONES.border} ${cursor}% 100%`);
    return { background: `conic-gradient(${parts.join(", ")})` };
  }, [statusSlices, statusTotal]);

  return (
    <section className="kpi-act-visual" aria-label="ภาพรวมงานแบบกราฟ">
      <header className="kpi-act-visual-head">
        <h2>ภาพรวมงาน</h2>
        <p>โดนัทตามกำหนด + กราฟแท่งตามประเภท · คลิกเพื่อกรอง</p>
      </header>

      <div className="kpi-act-visual-grid">
        <div className="kpi-act-donut-wrap">
          <button
            type="button"
            className={`kpi-act-donut${activeStatus === "open" ? " is-active" : ""}`}
            style={donutStyle}
            aria-label={`สัดส่วนงานตามกำหนด รวม ${openTotal} งาน — กดเพื่อดูทั้งหมด`}
            aria-pressed={activeStatus === "open"}
            onClick={() => onStatus("open")}
          >
            <span className="kpi-act-donut-hole">
              <strong className="num">{openTotal}</strong>
              <em>งาน</em>
            </span>
          </button>
          <ul className="kpi-act-legend">
            {statusSlices.map((slice) => {
              const share = Math.round((slice.count / statusTotal) * 100);
              return (
                <li key={slice.id}>
                  <button
                    type="button"
                    className={activeStatus === slice.id ? "is-active" : undefined}
                    style={{ ["--act-fill" as string]: slice.fill }}
                    aria-pressed={activeStatus === slice.id}
                    onClick={() => onStatus(slice.id)}
                  >
                    <i aria-hidden="true" />
                    <span>{slice.label}</span>
                    <em className="num">
                      {slice.count}
                      <b>{share}%</b>
                    </em>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="kpi-act-chart" role="list" aria-label="กราฟแท่งจำนวนงานตามประเภท">
          {kindRows.map((row, index) => {
            const share = openTotal > 0 ? Math.round((row.count / openTotal) * 100) : 0;
            const barWidth =
              row.count > 0 ? Math.max(8, Math.round((row.count / chartMax) * 100)) : 0;
            const fill = kindFill(row.id);
            const active = activeKind === row.id;
            return (
              <button
                key={row.id}
                type="button"
                role="listitem"
                className={`kpi-act-chart-row${active ? " is-active" : ""}${row.count === 0 ? " is-empty" : ""}`}
                style={{ ["--act-fill" as string]: fill }}
                aria-label={`${row.label} ${row.count} งาน สัดส่วน ${share} เปอร์เซ็นต์`}
                aria-pressed={active}
                onClick={() => onKind(active ? "all" : row.id)}
              >
                <span className="kpi-act-chart-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="kpi-act-chart-label">{row.label}</span>
                <span className="kpi-act-chart-track" aria-hidden="true">
                  <span className="kpi-act-chart-bar" style={{ width: `${barWidth}%` }} />
                </span>
                <span className="kpi-act-chart-meta" aria-hidden="true">
                  <strong className="num">{row.count}</strong>
                  <em className="num">{share}%</em>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
