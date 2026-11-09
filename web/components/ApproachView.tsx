import Link from "next/link";
import { ApproachHeroVisual } from "@/components/approach/ApproachHeroVisual";
import { Occupancy60DayForecast } from "@/components/approach/Occupancy60DayForecast";
import { HeroCta } from "@/components/HeroCta";
import { SiteShell } from "@/components/SiteShell";
import { loadApproachPageCopy } from "@/lib/cms/approach-page-public";
import { auditHref, localizePath, type Locale } from "@/lib/seo";

export async function ApproachView({ locale }: { locale: Locale }) {
  const t = await loadApproachPageCopy(locale);
  const splitTitle = Boolean(t.titleRest.trim() || t.titleAccent.trim());

  return (
    <SiteShell locale={locale} route={localizePath("/approach", locale)}>
      <section className="kpi-hero kpi-home-hero-section kpi-approach-hero">
        <div className="kpi-wrap">
          <div className="kpi-home-hero">
            <div className="kpi-home-hero-copy">
              <p className="kpi-home-eyebrow kpi-latin">{t.eyebrow}</p>
              <h1 className="kpi-h1 kpi-home-h1">
                {splitTitle ? (
                  <>
                    <span className="kpi-home-h1-lead">{t.titleLead}</span>
                    <span className="kpi-home-h1-rest">
                      {t.titleRest}
                      {t.titleAccent ? <span className="kpi-home-accent">{t.titleAccent}</span> : null}
                    </span>
                  </>
                ) : (
                  t.titleLead
                )}
              </h1>
              <p className="kpi-lead kpi-home-lead">{t.lead}</p>
              <p className="kpi-approach-subline">{t.subline}</p>
              <HeroCta locale={locale} className="kpi-approach-hero-cta" />
            </div>
            <ApproachHeroVisual locale={locale} alt={t.photoAlt} />
          </div>
        </div>
      </section>

      <section className="kpi-section kpi-approach-method">
        <h2 className="kpi-h2">{t.method}</h2>
        <ol className="kpi-approach-steps">
          {t.steps.map((step, index) => (
            <li key={`${step.num}-${step.title}`} className="kpi-approach-step">
              {index < t.steps.length - 1 ? (
                <span className="kpi-approach-step-connector" aria-hidden="true" />
              ) : null}
              <span className="kpi-latin kpi-approach-num kpi-approach-step-num">{step.num}</span>
              <div className="kpi-approach-step-copy">
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                <p className="kpi-approach-step-output">{step.output}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="kpi-approach-example border-y border-[#E3E8EB] bg-white">
        <div className="kpi-section">
          <p className="kpi-latin kpi-approach-example-eyebrow">{t.exampleEyebrow}</p>
          <h2 className="kpi-h2">{t.exampleTitle}</h2>
          <p className="kpi-approach-example-lead">{t.exampleLead}</p>
          <div className="kpi-approach-example-grid">
            <Occupancy60DayForecast locale={locale} caption={t.exampleCaption} />
            <div className="kpi-approach-framework">
              <ol className="kpi-approach-checklist">
                {t.exampleSteps.map((step) => (
                  <li key={`${step.num}-${step.text}`} className="kpi-approach-check-item">
                    <span className="kpi-latin kpi-approach-num">{step.num}</span>
                    <div className="kpi-approach-check-copy">
                      <div className="kpi-approach-check-meta">
                        <span className="kpi-latin kpi-approach-check-label">{step.label}</span>
                        <span className="kpi-latin kpi-approach-check-output">{step.output}</span>
                      </div>
                      <h3>{step.text}</h3>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="kpi-approach-framework-note">{t.exampleFrameworkNote}</p>
            </div>
          </div>
          <aside className="kpi-approach-closer">
            <p className="kpi-approach-close">{t.close}</p>
            <h3 className="kpi-approach-receive-title">{t.receiveTitle}</h3>
            <ul className="kpi-approach-receive">
              {t.receive.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link href={auditHref(locale, "ota")} className="kpi-button kpi-approach-cta">
              {t.cta} <span aria-hidden="true">↗</span>
            </Link>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
