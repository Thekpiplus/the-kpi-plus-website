import Link from "next/link";
import type { ReactNode } from "react";
import "./leads-a.css";

export type LeadsTab = "today" | "pipeline" | "all";

const TABS: { id: LeadsTab; href: string; label: string }[] = [
  { id: "today", href: "/crm/sales", label: "ต้องติดต่อวันนี้" },
  { id: "pipeline", href: "/crm/pipeline", label: "Pipeline" },
  { id: "all", href: "/crm/leads", label: "ลีดทั้งหมด" },
];

export function LeadsPageChrome({
  tab,
  title,
  description,
  actions,
  notice,
  children,
}: {
  tab: LeadsTab;
  title: string;
  description: string;
  actions?: ReactNode;
  notice?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="kpi-leads-a">
      <header className="kpi-leads-hero">
        <nav className="kpi-leads-breadcrumb" aria-label="เส้นทาง">
          <Link href="/crm">การขายและลูกค้า</Link>
          <span aria-hidden="true">/</span>
          <span>Lead Management</span>
        </nav>
        <div className="kpi-leads-hero-row">
          <div>
            <h1 className="kpi-leads-title">{title}</h1>
            <p className="kpi-leads-desc">{description}</p>
          </div>
          {actions ? <div className="kpi-leads-hero-actions">{actions}</div> : null}
        </div>
      </header>

      <nav className="kpi-leads-tabs" aria-label="แท็บ Lead Management">
        {TABS.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`kpi-leads-tab${tab === item.id ? " is-active" : ""}`}
            aria-current={tab === item.id ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
        <Link href="/crm/users/roles" className="kpi-leads-tab is-shortcut">
          บทบาทและสิทธิ์
        </Link>
      </nav>

      {notice ? (
        <div className="kpi-leads-notice" role="status" aria-live="polite">
          {notice}
        </div>
      ) : null}

      {children}
    </div>
  );
}
