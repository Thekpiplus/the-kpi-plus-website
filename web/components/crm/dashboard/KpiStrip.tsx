import Link from "next/link";
import type { DashKpi } from "./types";

export function KpiStrip({ items }: { items: DashKpi[] }) {
  if (!items.length) return null;

  return (
    <section className="kpi-dash-a-kpi" aria-label="สถิติภาพรวม">
      {items.map((item) => {
        const tone = item.value > 0 || item.tone === "sky" || item.tone === "brand" ? item.tone : "neutral";
        const className = `kpi-dash-a-kpi-card is-${tone}${item.href ? "" : " is-static"}`;
        const body = (
          <>
            <span className="kpi-dash-a-kpi-label">{item.label}</span>
            <strong className="kpi-dash-a-kpi-value">{item.value}</strong>
            <span className="kpi-dash-a-kpi-note">{item.note}</span>
          </>
        );
        return item.href ? (
          <Link key={item.key} href={item.href} className={className}>
            {body}
          </Link>
        ) : (
          <div key={item.key} className={className}>
            {body}
          </div>
        );
      })}
    </section>
  );
}
