"use client";

import { useMemo } from "react";
import { formatLeadValue } from "@/components/crm/leads/lead-all-types";
import type {
  PendingReason,
  PendingReasonStat,
  PendingScope,
  PendingScopeStat,
} from "@/components/crm/leads/lead-pending-types";
import "./lead-pending-a.css";

function ReasonIcon({ tone }: { tone: PendingReasonStat["tone"] }) {
  if (tone === "rose") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 8v5m0 3h.01M10.3 4.3 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (tone === "lime") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
        <path d="M12 8v4l2.5 1.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }
  if (tone === "sky") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 12h12m0 0-3.5-3.5M16 12l-3.5 3.5M20 7v10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (tone === "sun") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 5v2m0 10v2m7-7h-2M7 12H5m11.5-4.5-1.4 1.4M8.9 15.1l-1.4 1.4m0-8.6 1.4 1.4m8.6 8.6-1.4-1.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M16 18a4 4 0 0 0-8 0M12 13a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M19.5 18a3 3 0 0 0-2.2-2.9M6.7 15.1A3 3 0 0 0 4.5 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function LeadPendingRail({
  scopes,
  reasons,
  scope,
  reason,
  onScope,
  onReason,
}: {
  scopes: PendingScopeStat[];
  reasons: PendingReasonStat[];
  scope: PendingScope;
  reason: PendingReason | "";
  onScope: (next: PendingScope) => void;
  onReason: (next: PendingReason | "") => void;
}) {
  const pendingTotal = scopes.find((item) => item.id === scope)?.count ?? 0;
  const tagTotal = reasons.reduce((sum, item) => sum + item.count, 0);
  const chartMax = Math.max(1, ...reasons.map((item) => item.count));

  const donutStyle = useMemo(() => {
    if (tagTotal <= 0) {
      return { background: "conic-gradient(#eef1ee 0 100%)" };
    }
    let cursor = 0;
    const parts: string[] = [];
    for (const item of reasons) {
      if (item.count <= 0) continue;
      const start = cursor;
      const end = cursor + (item.count / tagTotal) * 100;
      parts.push(`${item.fill} ${start}% ${end}%`);
      cursor = end;
    }
    if (cursor < 100) parts.push(`#eef1ee ${cursor}% 100%`);
    return { background: `conic-gradient(${parts.join(", ")})` };
  }, [reasons, tagTotal]);

  return (
    <section className="kpi-lead-pd" aria-label="แยกตามสาเหตุที่ยังปิดไม่ได้">
      <div className="kpi-lead-pd-head">
        <h2>แยกตามสาเหตุที่ยังปิดไม่ได้</h2>
        <p>
          กราฟเปรียบเทียบสาเหตุจากงานค้าง {pendingTotal} รายการ · แต่ละสีแยกชัด · คลิกเพื่อกรอง
          (หนึ่งลีดอาจอยู่ในหลายสาเหตุ)
        </p>
      </div>

      <div className="kpi-lead-pd-scopes" role="group" aria-label="ขอบเขตช่องทาง">
        {scopes.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`kpi-lead-pd-scope${scope === item.id ? " is-active" : ""}`}
            aria-pressed={scope === item.id}
            onClick={() => onScope(item.id)}
          >
            {item.label} <strong className="num">{item.count}</strong>
          </button>
        ))}
      </div>

      <div className="kpi-lead-pd-visual">
        <div className="kpi-lead-pd-donut-wrap">
          <div
            className="kpi-lead-pd-donut"
            style={donutStyle}
            role="img"
            aria-label={`สัดส่วนการติดป้ายสาเหตุจากงานค้าง ${pendingTotal} รายการ (นับซ้อนได้)`}
          >
            <div className="kpi-lead-pd-donut-hole">
              <strong className="num">{pendingTotal}</strong>
              <span>งานค้าง</span>
            </div>
          </div>
          <ul className="kpi-lead-pd-legend">
            {reasons.map((item) => (
              <li key={item.id} style={{ ["--pd-fill" as string]: item.fill }}>
                <i aria-hidden="true" />
                <span>{item.label}</span>
                <em className="num">{item.share}%</em>
              </li>
            ))}
          </ul>
        </div>

        <div className="kpi-lead-pd-chart" role="list" aria-label="กราฟแท่งจำนวนลีดตามสาเหตุ">
          {reasons.map((item, index) => {
            const active = reason === item.id;
            const barWidth =
              item.count > 0 ? Math.max(8, Math.round((item.count / chartMax) * 100)) : 0;
            return (
              <button
                key={item.id}
                type="button"
                role="listitem"
                className={`kpi-lead-pd-chart-row${active ? " is-active" : ""}${item.count === 0 ? " is-empty" : ""}`}
                style={{ ["--pd-fill" as string]: item.fill }}
                title={`${item.label}: ${item.count} รายการ (${item.share}% ของงานค้าง) · ${formatLeadValue(item.value)}`}
                aria-label={`${item.label} ${item.count} รายการ คิดเป็น ${item.share} เปอร์เซ็นต์ของงานค้าง มูลค่า ${formatLeadValue(item.value)}`}
                aria-pressed={active}
                onClick={() => onReason(active ? "" : item.id)}
              >
                <span className="kpi-lead-pd-chart-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="kpi-lead-pd-chart-label">{item.label}</span>
                <span className="kpi-lead-pd-chart-track" aria-hidden="true">
                  <span className="kpi-lead-pd-chart-bar" style={{ width: `${barWidth}%` }} />
                </span>
                <span className="kpi-lead-pd-chart-meta" aria-hidden="true">
                  <strong className="num">{item.count}</strong>
                  <em className="num">{item.share}%</em>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="kpi-lead-pd-scroll">
        <div className="kpi-lead-pd-reasons" role="list">
          {reasons.map((item) => {
            const active = reason === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="listitem"
                className={`kpi-lead-pd-reason is-${item.tone}${active ? " is-active" : ""}`}
                style={{ ["--pd-fill" as string]: item.fill }}
                aria-pressed={active}
                onClick={() => onReason(active ? "" : item.id)}
              >
                <div className="kpi-lead-pd-reason-top">
                  <span className="kpi-lead-pd-reason-icon">
                    <ReasonIcon tone={item.tone} />
                  </span>
                </div>
                <p className="kpi-lead-pd-reason-label">{item.label}</p>
                <strong className="kpi-lead-pd-reason-value num">{item.count}</strong>
                <p className="kpi-lead-pd-reason-meta">
                  มูลค่ารวม <strong className="num">{formatLeadValue(item.value)}</strong>
                  <br />
                  คิดเป็น {item.share}% ของงานค้าง
                </p>
                <div className="kpi-lead-pd-reason-spark" aria-hidden="true">
                  <i
                    style={{
                      width: `${item.count > 0 ? Math.max(8, Math.round((item.count / chartMax) * 100)) : 0}%`,
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="kpi-lead-pd-chips" role="list" aria-label="สาเหตุแบบชิป">
        {reasons.map((item) => (
          <button
            key={item.id}
            type="button"
            role="listitem"
            className={`kpi-lead-pd-chip${reason === item.id ? " is-active" : ""}`}
            style={{ ["--pd-fill" as string]: item.fill }}
            aria-label={`${item.label} ${item.count} รายการ คิดเป็น ${item.share} เปอร์เซ็นต์ของงานค้าง`}
            aria-pressed={reason === item.id}
            onClick={() => onReason(reason === item.id ? "" : item.id)}
          >
            <i aria-hidden="true" />
            {item.label}{" "}
            <strong className="num" aria-hidden="true">
              {item.count}
              <em>{item.share}%</em>
            </strong>
          </button>
        ))}
      </div>

      <p className="kpi-lead-pd-footnote">
        หมายเหตุ: โดนัทแสดงน้ำหนักการติดป้ายสาเหตุ (นับซ้อนได้) · % บนแท่ง/การ์ดเทียบกับจำนวนงานค้างจริง ·
        ตัวเลขรวมกันจึงอาจเกิน 100%
      </p>
    </section>
  );
}
