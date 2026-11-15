import Link from "next/link";
import type { DashModule } from "./types";

export function ModuleGrid({ modules }: { modules: DashModule[] }) {
  if (!modules.length) {
    return (
      <section className="kpi-dash-a-panel" aria-label="ทางลัดโมดูล">
        <div className="kpi-dash-a-section-head">
          <div>
            <h2>ทางลัดโมดูล</h2>
            <p>แสดงเฉพาะโมดูลที่บัญชีนี้เข้าถึงได้</p>
          </div>
        </div>
        <div className="kpi-dash-a-empty">
          <strong>ยังไม่มีโมดูลที่เข้าได้</strong>
          <p>ติดต่อ Superadmin เพื่อเปิดสิทธิ์ Lead / Partner / Reservations / B2B / Users / CMS</p>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="ทางลัดโมดูล">
      <div className="kpi-dash-a-section-head kpi-dash-a-section-head-spaced">
        <div>
          <h2>ทางลัดโมดูล</h2>
          <p>แสดงเฉพาะโมดูลที่บัญชีนี้เข้าถึงได้</p>
        </div>
      </div>
      <div className="kpi-dash-a-module-grid">
        {modules.map((module) => (
          <article key={module.href} className="kpi-dash-a-module">
            <div className="kpi-dash-a-module-top">
              <span className="kpi-dash-a-module-icon" aria-hidden="true">
                {module.icon}
              </span>
              <span className="kpi-dash-a-module-code">{module.code}</span>
            </div>
            <h3>{module.name}</h3>
            <p className="kpi-dash-a-module-blurb" title={module.blurb}>
              {module.blurb}
            </p>
            <dl className="kpi-dash-a-module-metrics">
              {module.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt>{metric.label}</dt>
                  <dd>{metric.value}</dd>
                </div>
              ))}
            </dl>
            <Link href={module.href} className="kpi-dash-a-btn is-brand kpi-dash-a-module-cta" role="button">
              {module.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
