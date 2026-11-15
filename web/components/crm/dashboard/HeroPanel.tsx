import Link from "next/link";
import type { ReactNode } from "react";

export function HeroPanel({
  greeting,
  name,
  role,
  dueToday,
  overdueCount,
  dueTodayCount,
  canLeads,
  canCms,
  primaryAction,
  secondaryAction,
}: {
  greeting: string;
  name: string;
  role: string;
  dueToday: number;
  overdueCount: number;
  dueTodayCount: number;
  canLeads: boolean;
  canCms: boolean;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
}) {
  const overdueChipClass = overdueCount > 0 ? "is-rose" : "is-neutral";
  const todayChipClass = dueTodayCount > 0 ? "is-brand" : "is-neutral";

  return (
    <section className="kpi-dash-a-hero" aria-label="แดชบอร์ดหลัก">
      <div className="kpi-dash-a-hero-main">
        <div className="kpi-dash-a-hero-meta">
          <p className="kpi-dash-a-hero-kicker">Dashboard</p>
          <span className="kpi-dash-a-chip">{role}</span>
        </div>
        <h1 className="kpi-dash-a-hero-title">
          {greeting}, {name}
        </h1>
        <p className="kpi-dash-a-hero-lead">ภาพรวมงานวันนี้และทางลัดเข้าโมดูลที่คุณมีสิทธิ์ใช้</p>
        <div className="kpi-dash-a-hero-actions">
          {primaryAction}
          {secondaryAction}
        </div>
      </div>

      <aside className="kpi-dash-a-summary" aria-label="งานที่ต้องจัดการ">
        <p className="kpi-dash-a-summary-label">งานที่ต้องจัดการ</p>
        <p className="kpi-dash-a-summary-value">{dueToday}</p>
        <p className="kpi-dash-a-summary-unit">รายการ</p>
        <div className="kpi-dash-a-summary-chips">
          <span className={`kpi-dash-a-chip ${overdueChipClass}`}>เกินกำหนด {overdueCount}</span>
          <span className={`kpi-dash-a-chip ${todayChipClass}`}>ถึงกำหนดวันนี้ {dueTodayCount}</span>
        </div>
        {canLeads ? (
          <Link href="/crm/sales" className="kpi-dash-a-summary-link">
            เปิดงานวันนี้ →
          </Link>
        ) : canCms ? (
          <Link href="/crm/cms" className="kpi-dash-a-summary-link">
            เปิด Content Management →
          </Link>
        ) : null}
      </aside>
    </section>
  );
}
