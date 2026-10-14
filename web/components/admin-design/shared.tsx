import type { ReactNode } from "react";
import { ACTIVITY, ARTICLES, LEADS, QUICK_ACTIONS, STATS } from "./data";

export function SectionHeader({
  title,
  lead,
  action,
}: {
  title: string;
  lead?: string;
  action?: ReactNode;
}) {
  return (
    <div className="ad-section-head">
      <div>
        <h2 className="ad-section-title">{title}</h2>
        {lead ? <p className="ad-section-lead">{lead}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  tone = "neutral",
}: {
  label: string;
  value: string;
  delta: string;
  tone?: "up" | "warn" | "neutral";
}) {
  return (
    <article className="ad-stat">
      <p className="ad-stat-label">{label}</p>
      <p className="ad-stat-value">{value}</p>
      <p className={`ad-stat-delta ad-stat-delta-${tone}`}>{delta}</p>
    </article>
  );
}

export function QuickActionCard({ label, hint }: { label: string; hint: string }) {
  return (
    <button type="button" className="ad-quick">
      <span className="ad-quick-label">{label}</span>
      <span className="ad-quick-hint">{hint}</span>
    </button>
  );
}

export function FilterBar({ placeholder = "Search leads, hotels, articles…" }: { placeholder?: string }) {
  return (
    <div className="ad-filters">
      <label className="ad-search">
        <span className="ad-search-icon" aria-hidden="true">
          ⌕
        </span>
        <input type="search" placeholder={placeholder} />
      </label>
      <div className="ad-filter-chips">
        <button type="button" className="ad-chip is-active">
          All
        </button>
        <button type="button" className="ad-chip">
          New
        </button>
        <button type="button" className="ad-chip">
          Contacted
        </button>
        <button type="button" className="ad-chip">
          Qualified
        </button>
      </div>
      <button type="button" className="ad-btn-secondary">
        Filters
      </button>
    </div>
  );
}

export function StatusTag({ status }: { status: string }) {
  const tone =
    status === "New" || status === "Published"
      ? "lime"
      : status === "Draft" || status === "Unassigned"
        ? "muted"
        : status === "Review" || status === "Proposal"
          ? "navy"
          : "soft";
  return <span className={`ad-tag ad-tag-${tone}`}>{status}</span>;
}

export function DataTable({ variant = "leads" }: { variant?: "leads" | "articles" | "empty" }) {
  if (variant === "empty") {
    return (
      <EmptyState
        title="No leads in this view"
        body="ปรับตัวกรอง หรือเพิ่มลีดใหม่เพื่อเริ่มติดตามงานวันนี้"
        cta="Add lead"
      />
    );
  }

  if (variant === "articles") {
    return (
      <div className="ad-table-wrap">
        <table className="ad-table">
          <thead>
            <tr>
              <th>Article</th>
              <th>Status</th>
              <th>Author</th>
              <th>Locale</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {ARTICLES.map((row) => (
              <tr key={row.title}>
                <td className="ad-table-primary">{row.title}</td>
                <td>
                  <StatusTag status={row.status} />
                </td>
                <td>{row.author}</td>
                <td>{row.locale}</td>
                <td>{row.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="ad-table-wrap">
      <table className="ad-table">
        <thead>
          <tr>
            <th>Hotel</th>
            <th>Contact</th>
            <th>Source</th>
            <th>Status</th>
            <th>Owner</th>
            <th>Updated</th>
          </tr>
        </thead>
        <tbody>
          {LEADS.map((row) => (
            <tr key={row.hotel}>
              <td className="ad-table-primary">{row.hotel}</td>
              <td>{row.contact}</td>
              <td>{row.source}</td>
              <td>
                <StatusTag status={row.status} />
              </td>
              <td>{row.owner}</td>
              <td>{row.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function EmptyState({ title, body, cta }: { title: string; body: string; cta: string }) {
  return (
    <div className="ad-empty">
      <div className="ad-empty-mark" aria-hidden="true">
        ◇
      </div>
      <h3 className="ad-empty-title">{title}</h3>
      <p className="ad-empty-body">{body}</p>
      <button type="button" className="ad-btn-primary">
        {cta}
      </button>
    </div>
  );
}

export function ActivityList() {
  return (
    <ul className="ad-activity">
      {ACTIVITY.map((item) => (
        <li key={item.title}>
          <div>
            <p className="ad-activity-title">{item.title}</p>
            <p className="ad-activity-meta">{item.meta}</p>
          </div>
          <StatusTag status={item.tag} />
        </li>
      ))}
    </ul>
  );
}

export function StatsRow() {
  return (
    <div className="ad-stats">
      {STATS.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}

export function QuickActionsRow() {
  return (
    <div className="ad-quicks">
      {QUICK_ACTIONS.map((item) => (
        <QuickActionCard key={item.label} {...item} />
      ))}
    </div>
  );
}

export function Topbar({
  title = "Dashboard",
  dense = false,
}: {
  title?: string;
  dense?: boolean;
}) {
  return (
    <header className={`ad-topbar${dense ? " is-dense" : ""}`}>
      <div className="ad-topbar-left">
        <p className="ad-topbar-kicker">The KPI Plus Admin</p>
        <h1 className="ad-topbar-title">{title}</h1>
      </div>
      <div className="ad-topbar-tools">
        <label className="ad-top-search">
          <span aria-hidden="true">⌕</span>
          <input type="search" placeholder="Search workspace…" />
        </label>
        <button type="button" className="ad-icon-btn" aria-label="Notifications">
          ⌖
        </button>
        <div className="ad-profile">
          <span className="ad-avatar" aria-hidden="true">
            IK
          </span>
          <span className="ad-profile-meta">
            <strong>Isara</strong>
            <em>Superadmin</em>
          </span>
        </div>
      </div>
    </header>
  );
}

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`ad-brand${compact ? " is-compact" : ""}`}>
      <span className="ad-brand-mark" aria-hidden="true">
        K
      </span>
      {!compact ? (
        <span className="ad-brand-copy">
          <strong>KPI Plus</strong>
          <em>Admin</em>
        </span>
      ) : null}
    </div>
  );
}
