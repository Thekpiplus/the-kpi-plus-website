import type { ReactNode } from "react";

export type OverviewHeroVariant = "dashboard" | "welcome" | "compact";

type OverviewHeroProps = {
  variant?: OverviewHeroVariant;
  eyebrow?: string;
  badge?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  /** Accessible name for the hero region */
  label?: string;
};

/**
 * Shared hero for Dashboard, My Work (welcome), and module Overview pages.
 * Do not use on dense tables, forms, detail pages, or login logs.
 */
export function OverviewHero({
  variant = "compact",
  eyebrow,
  badge,
  title,
  description,
  actions,
  aside,
  label,
}: OverviewHeroProps) {
  const classes = ["crm-hero", `crm-hero-${variant}`];
  if (aside) classes.push("has-aside");
  /** Welcome without metrics card: park actions on the right to fill empty space. */
  const actionsEnd = variant === "welcome" && !aside && Boolean(actions);

  return (
    <section className={classes.join(" ")} aria-label={label}>
      <div className="crm-hero-copy">
        {eyebrow || badge ? (
          <div className="crm-hero-meta">
            {eyebrow ? <p className="crm-hero-kicker">{eyebrow}</p> : null}
            {badge}
          </div>
        ) : null}
        <h1 className="crm-hero-title">{title}</h1>
        {description ? <p className="crm-hero-lead">{description}</p> : null}
        {actions && !actionsEnd ? <div className="crm-hero-actions">{actions}</div> : null}
      </div>
      {actionsEnd ? <div className="crm-hero-actions crm-hero-actions-end">{actions}</div> : null}
      {aside}
    </section>
  );
}

type HeroMetric = {
  value: ReactNode;
  label: string;
  tone?: "default" | "today" | "overdue";
};

type OverviewHeroMetricsCardProps = {
  label: string;
  hint?: string;
  pulse?: string;
  pulseHot?: boolean;
  value: ReactNode;
  unit?: string;
  metrics?: HeroMetric[];
  footer?: ReactNode;
};

/** Optional summary card for Dashboard / welcome heroes. */
export function OverviewHeroMetricsCard({
  label,
  hint,
  pulse,
  pulseHot,
  value,
  unit = "รายการ",
  metrics,
  footer,
}: OverviewHeroMetricsCardProps) {
  return (
    <aside className="crm-hero-card" aria-label={label}>
      <div className="crm-hero-card-head">
        <div>
          <p className="crm-hero-card-label">{label}</p>
          {hint ? <p className="crm-hero-card-hint">{hint}</p> : null}
        </div>
        {pulse ? (
          <span className={`crm-hero-card-pulse${pulseHot ? " is-hot" : ""}`}>{pulse}</span>
        ) : null}
      </div>

      <div className="crm-hero-card-main">
        <p className="crm-hero-card-value">{value}</p>
        {unit ? <p className="crm-hero-card-unit">{unit}</p> : null}
      </div>

      {metrics?.length ? (
        <div className="crm-hero-card-split">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className={`crm-hero-stat${metric.tone && metric.tone !== "default" ? ` is-${metric.tone}` : ""}`}
            >
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </div>
          ))}
        </div>
      ) : null}

      {footer}
    </aside>
  );
}

export function greetingForHour(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "สวัสดีตอนเช้า";
  if (hour < 18) return "สวัสดีตอนบ่าย";
  return "สวัสดีตอนเย็น";
}
