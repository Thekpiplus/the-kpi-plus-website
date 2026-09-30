import type { ReactNode } from "react";

export function PageHero({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={className ? `kpi-hero ${className}` : "kpi-hero"}>
      <div className="kpi-wrap">{children}</div>
    </section>
  );
}
