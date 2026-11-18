import Link from "next/link";
import type { ReactNode } from "react";
import "./leads-a.css";

export function LeadsPageChrome({
  title,
  description,
  meta,
  actions,
  notice,
  heroVariant = "default",
  children,
}: {
  title: string;
  description: string;
  meta?: ReactNode;
  actions?: ReactNode;
  notice?: ReactNode;
  heroVariant?: "default" | "pipeline" | "activities";
  children: ReactNode;
}) {
  return (
    <div className="kpi-leads-a">
      <header
        className={`kpi-leads-hero${
          heroVariant === "pipeline" ? " is-pipeline" : heroVariant === "activities" ? " is-activities" : ""
        }`}
      >
        <nav className="kpi-leads-breadcrumb" aria-label="เส้นทาง">
          <Link href="/crm">การขายและลูกค้า</Link>
          <span aria-hidden="true">/</span>
          <span>Lead Management</span>
        </nav>
        <div className="kpi-leads-hero-row">
          <div>
            <h1 className="kpi-leads-title">{title}</h1>
            <p className="kpi-leads-desc">{description}</p>
            {meta ? <p className="kpi-leads-hero-meta">{meta}</p> : null}
          </div>
          {actions ? <div className="kpi-leads-hero-actions">{actions}</div> : null}
        </div>
      </header>

      {notice ? (
        <div className="kpi-leads-notice" role="status" aria-live="polite">
          {notice}
        </div>
      ) : null}

      {children}
    </div>
  );
}
