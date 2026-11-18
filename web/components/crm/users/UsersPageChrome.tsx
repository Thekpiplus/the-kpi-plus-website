import Link from "next/link";
import type { ReactNode } from "react";
import "./users-a.css";

export function UsersPageChrome({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="kpi-users-a">
      <header className="kpi-users-hero">
        <nav className="kpi-users-breadcrumb" aria-label="เส้นทาง">
          <Link href="/crm">ตั้งค่าระบบ</Link>
          <span aria-hidden="true">/</span>
          <span>ผู้ใช้งาน</span>
        </nav>
        <div className="kpi-users-hero-row">
          <div>
            <h1 className="kpi-users-title">{title}</h1>
            <p className="kpi-users-desc">{description}</p>
          </div>
          {actions ? <div className="kpi-users-hero-actions">{actions}</div> : null}
        </div>
      </header>
      {children}
    </div>
  );
}
