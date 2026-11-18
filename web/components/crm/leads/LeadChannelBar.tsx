"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  formatChannelValue,
  type LeadChannelStat,
} from "@/components/crm/leads/lead-channel-types";
import "./lead-channel-a.css";

export function LeadChannelBar({
  channels,
  selected,
  clearHref,
  onSelect,
}: {
  channels: LeadChannelStat[];
  selected: string;
  clearHref: string;
  onSelect: (source: string) => void;
}) {
  const totalActive = channels.reduce((sum, item) => sum + item.active, 0);
  const chartMax = Math.max(1, ...channels.map((item) => item.active));

  const donutStyle = useMemo(() => {
    if (totalActive <= 0) {
      return { background: "conic-gradient(#eef1ee 0 100%)" };
    }
    let cursor = 0;
    const parts: string[] = [];
    for (const channel of channels) {
      if (channel.active <= 0) continue;
      const start = cursor;
      const end = cursor + (channel.active / totalActive) * 100;
      parts.push(`${channel.fill} ${start}% ${end}%`);
      cursor = end;
    }
    if (cursor < 100) parts.push(`#eef1ee ${cursor}% 100%`);
    return { background: `conic-gradient(${parts.join(", ")})` };
  }, [channels, totalActive]);

  if (channels.length === 0) {
    return (
      <section className="kpi-lead-ch" aria-label="แยกตามช่องทางที่ได้มา">
        <div className="kpi-lead-ch-head">
          <div>
            <h2>แยกตามช่องทางที่ได้มา</h2>
            <p>ยังไม่มีลีดที่ใช้งานอยู่ให้จัดกลุ่มตามช่องทาง</p>
          </div>
        </div>
        <p className="kpi-lead-ch-empty">เมื่อมีลีดเข้ามา กราฟช่องทางจะปรากฏที่นี่</p>
      </section>
    );
  }

  return (
    <section className="kpi-lead-ch" aria-label="แยกตามช่องทางที่ได้มา">
      <div className="kpi-lead-ch-head">
        <div>
          <h2>แยกตามช่องทางที่ได้มา</h2>
          <p>
            กราฟสัดส่วนจากลีดที่ใช้งานอยู่ {totalActive} รายการ · แต่ละช่องทางมีสีเฉพาะ · คลิกเพื่อกรอง
          </p>
        </div>
        {selected ? (
          <Link href={clearHref} className="kpi-leads-btn-secondary">
            ทุกช่องทาง
          </Link>
        ) : null}
      </div>

      <div className="kpi-lead-ch-visual">
        <div className="kpi-lead-ch-donut-wrap">
          <div
            className="kpi-lead-ch-donut"
            style={donutStyle}
            role="img"
            aria-label={`สัดส่วนลีดตามช่องทาง รวม ${totalActive} รายการ`}
          >
            <div className="kpi-lead-ch-donut-hole">
              <strong className="num">{totalActive}</strong>
              <span>รายการ</span>
            </div>
          </div>
          <ul className="kpi-lead-ch-legend">
            {channels
              .filter((channel) => channel.active > 0)
              .map((channel) => {
                const pct = totalActive > 0 ? Math.round((channel.active / totalActive) * 100) : 0;
                return (
                  <li key={channel.source} style={{ ["--ch-fill" as string]: channel.fill }}>
                    <i aria-hidden="true" />
                    <span>{channel.label}</span>
                    <em className="num">{pct}%</em>
                  </li>
                );
              })}
          </ul>
        </div>

        <div
          className="kpi-lead-ch-chart"
          role="list"
          aria-label="กราฟแท่งจำนวนลีดตามช่องทาง"
        >
          {channels.map((channel, index) => {
            const pct = totalActive > 0 ? Math.round((channel.active / totalActive) * 100) : 0;
            const barWidth =
              channel.active > 0 ? Math.max(8, Math.round((channel.active / chartMax) * 100)) : 0;
            const active = selected === channel.source;
            return (
              <button
                key={channel.source}
                type="button"
                role="listitem"
                className={`kpi-lead-ch-chart-row${active ? " is-active" : ""}${channel.active === 0 ? " is-empty" : ""}`}
                style={{ ["--ch-fill" as string]: channel.fill }}
                title={`${channel.label}: ${channel.active} รายการ (${pct}%) · ${formatChannelValue(channel.value)}`}
                aria-label={`${channel.label} ${channel.active} รายการ สัดส่วน ${pct} เปอร์เซ็นต์ มูลค่า ${formatChannelValue(channel.value)}`}
                aria-pressed={active}
                onClick={() => onSelect(channel.source)}
              >
                <span className="kpi-lead-ch-chart-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="kpi-lead-ch-chart-label">{channel.label}</span>
                <span className="kpi-lead-ch-chart-track" aria-hidden="true">
                  <span className="kpi-lead-ch-chart-bar" style={{ width: `${barWidth}%` }} />
                </span>
                <span className="kpi-lead-ch-chart-meta">
                  <strong className="num">{channel.active}</strong>
                  <em className="num">{pct}%</em>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="kpi-lead-ch-cards" role="list">
        {channels.map((channel) => {
          const active = selected === channel.source;
          const pct = totalActive > 0 ? Math.round((channel.active / totalActive) * 100) : 0;
          return (
            <button
              key={channel.source}
              type="button"
              role="listitem"
              className={`kpi-lead-ch-card${active ? " is-active" : ""}`}
              style={{ ["--ch-fill" as string]: channel.fill }}
              aria-pressed={active}
              onClick={() => onSelect(channel.source)}
            >
              <div className="kpi-lead-ch-card-swatch" aria-hidden="true" />
              <div className="kpi-lead-ch-card-top">
                <span className="kpi-lead-ch-card-name">{channel.label}</span>
                <span className="kpi-lead-ch-card-count num">
                  {channel.active}
                  <em>{pct}%</em>
                </span>
              </div>
              <div className="kpi-lead-ch-card-spark" aria-hidden="true">
                <i style={{ width: `${Math.max(channel.active > 0 ? 8 : 0, pct)}%` }} />
              </div>
              <dl className="kpi-lead-ch-card-meta">
                <div>
                  มูลค่ารวม <strong className="num">{formatChannelValue(channel.value)}</strong>
                </div>
                <div className={channel.overdue > 0 ? "is-warn" : undefined}>
                  เกินกำหนด <strong className="num">{channel.overdue}</strong>
                </div>
                <div className={channel.unassigned > 0 ? "is-warn" : undefined}>
                  ยังไม่มอบหมาย <strong className="num">{channel.unassigned}</strong>
                </div>
              </dl>
            </button>
          );
        })}
      </div>

      <div className="kpi-lead-ch-chips" role="list" aria-label="ช่องทางแบบชิป">
        {channels.map((channel) => {
          const pct = totalActive > 0 ? Math.round((channel.active / totalActive) * 100) : 0;
          return (
            <button
              key={channel.source}
              type="button"
              role="listitem"
              className={`kpi-lead-ch-chip${selected === channel.source ? " is-active" : ""}`}
              style={{ ["--ch-fill" as string]: channel.fill }}
              aria-pressed={selected === channel.source}
              onClick={() => onSelect(channel.source)}
            >
              <i aria-hidden="true" />
              {channel.label}{" "}
              <strong className="num">
                {channel.active}
                <em>{pct}%</em>
              </strong>
            </button>
          );
        })}
      </div>
    </section>
  );
}
