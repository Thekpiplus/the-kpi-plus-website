import Link from "next/link";

export type ModuleCardProps = {
  href: string;
  accent: "leads" | "partners" | "reservations" | "users" | "cms";
  icon: string;
  category: string;
  title: string;
  body: string;
  stats: Array<{ label: string; value: number | string }>;
  cta: string;
};

export function ModuleCard({ href, accent, icon, category, title, body, stats, cta }: ModuleCardProps) {
  return (
    <article className={`crm-dash-module crm-dash-module-${accent}`}>
      <div className="crm-dash-module-top">
        <div className="crm-dash-module-icon" aria-hidden="true">
          {icon}
        </div>
        <p className="crm-dash-module-cat">{category}</p>
      </div>
      <h3>{title}</h3>
      <p>{body}</p>
      <dl>
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt>{stat.label}</dt>
            <dd>{stat.value}</dd>
          </div>
        ))}
      </dl>
      <Link href={href} className="crm-dash-module-cta">
        {cta}
      </Link>
    </article>
  );
}
