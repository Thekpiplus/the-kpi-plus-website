import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import { AuditSectionHost } from "@/components/AuditSection";
import { SiteShell } from "@/components/SiteShell";
import { insightPosts, insightsIndexCopy } from "@/lib/insights";
import { homeCopy } from "@/lib/localized-ui";
import { auditHref, existingHref, localizePath, type Locale } from "@/lib/seo";

const metrics = ["Revenue", "ADR", "Occupancy", "RevPAR", "ROAS", "Direct booking"];

const problemAnchors = [
  "grow-revenue",
  "grow-revenue",
  "grow-demand",
  "grow-demand",
  "grow-capability",
  "grow-capability",
] as const;

const pillarAnchors = ["grow-revenue", "grow-demand", "grow-capability"] as const;

export function HomeView({ locale }: { locale: Locale }) {
  const t = homeCopy[locale];
  const insightsUi = insightsIndexCopy[locale];
  const solutionsHref = localizePath("/solutions", locale);
  const insightsHref = localizePath("/insights", locale);
  const audit = auditHref(locale);
  const featuredInsights = insightPosts
    .filter((post) => existingHref(post.href, locale))
    .slice(0, 3);

  return (
    <SiteShell locale={locale} route={locale === "th" ? "/" : `/${locale}`}>
      <section className="kpi-hero">
        <div className="kpi-wrap kpi-home-hero">
          <div>
            <p className="kpi-kicker text-[#F2F8E2]">{t.kicker}</p>
            <p className="kpi-latin mt-4 text-sm font-semibold tracking-[.04em] text-[#F2F8E2]">
              Revenue Management · OTA Strategy · Digital Marketing
            </p>
            <h1 className="kpi-h1 mt-5 text-white">
              <span className="block">{t.h1a}</span>
              <span className="block">{t.h1b}</span>
              <span className="block text-[#E6E81F]">{t.h1c}</span>
            </h1>
            <p className="kpi-lead mt-6 text-white/72">{t.lead}</p>
            <div className="kpi-actions">
              <Link href={audit} className="kpi-button">
                {t.audit} <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link href={`${solutionsHref}#solutions`} className="kpi-button-ghost">
                {t.allSolutions}
              </Link>
            </div>
          </div>
          <div className="kpi-hero-visual kpi-home-photo">
            <img src="/media/kpi-plus-thai-hero-performance-corrected_2937c314.jpg" alt={t.heroAlt} />
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="kpi-wrap kpi-band-sm">
          <div className="kpi-home-diagnostics">
            {t.cards.map(([title, body]) => (
              <Link key={title} href={`${solutionsHref}#solutions`} className="kpi-home-diagnostic block">
                <p className="text-base font-extrabold leading-6 text-[#063F3B]">{title}</p>
                <p className="mt-2 text-sm leading-6 text-[#555555]">{body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="solutions" className="kpi-section scroll-mt-28">
        <p className="kpi-kicker text-[#0B6660]">{t.problemEyebrow}</p>
        <h2 className="kpi-h2 mt-4">{t.problemTitle}</h2>
        <p className="kpi-lead mt-5">{t.problemLead}</p>
        <div className="kpi-home-problems mt-10">
          {t.problems.map((problem, index) => (
            <Link
              key={problem}
              href={`${solutionsHref}#${problemAnchors[index]}`}
              className="kpi-home-problem"
            >
              <span className="kpi-latin w-8 shrink-0 text-xs font-black tracking-[.14em] text-[#0B6660]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-lg font-extrabold leading-7">{problem}</span>
            </Link>
          ))}
        </div>
        <Link href={solutionsHref} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#0B6660]">
          {t.allSolutions} <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="bg-white">
        <div className="kpi-section">
          <p className="kpi-kicker text-[#0B6660]">{t.pillarEyebrow}</p>
          <h2 className="kpi-h2 mt-4">{t.pillarTitle}</h2>
          <div className="kpi-grid-3 mt-12">
            {t.pillars.map(([num, title, body], index) => (
              <Link
                key={num}
                href={`${solutionsHref}#${pillarAnchors[index]}`}
                className="kpi-card relative flex flex-col overflow-hidden p-7 sm:p-8"
              >
                <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
                <span className="kpi-latin text-sm font-black tracking-[.16em] text-[#0B6660]">{num}</span>
                <h3 className="mt-8 text-2xl font-extrabold leading-snug tracking-[-.02em] text-[#3B3B3B]">{title}</h3>
                <p className={`${locale === "en" ? "kpi-latin " : ""}mt-4 text-sm leading-7 text-[#555555]`}>{body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#E3E8EB] bg-[#F4F4F4]">
        <div className="kpi-section">
          <p className="kpi-kicker text-[#0B6660]">{t.stepEyebrow}</p>
          <h2 className="kpi-h2 mt-4">{t.stepTitle}</h2>
          <div className="kpi-home-steps mt-12">
            {t.steps.map(([num, title, body]) => (
              <article key={num}>
                <span className="kpi-latin text-sm font-black tracking-[.16em] text-[#0B6660]">{num}</span>
                <h3 className="mt-4 text-xl font-extrabold leading-snug text-[#3B3B3B]">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#555555]">{body}</p>
              </article>
            ))}
          </div>
          <Link href={audit} className="kpi-button mt-12">
            {t.audit} <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="bg-[#063F3B] text-white">
        <div className="kpi-section kpi-split">
          <div className="kpi-home-photo">
            <img src="/media/the-kpi-plus-revenue-scene_4932d3c7.jpg" alt="Hospitality revenue-management workspace" />
          </div>
          <div>
            <p className="kpi-kicker text-[#F2F8E2]">{t.metricEyebrow}</p>
            <h2 className="kpi-h2 mt-4 text-white">{t.metricTitle}</h2>
            <p className="kpi-lead mt-6 text-white/72">{t.metricBody}</p>
            <div className="kpi-home-metrics kpi-latin mt-10">
              {metrics.map((metric) => (
                <div key={metric} className="kpi-home-metric">
                  {metric}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="kpi-section">
        <p className="kpi-kicker text-[#0B6660]">{t.insightEyebrow}</p>
        <div className="kpi-home-split mt-4">
          <h2 className="kpi-h2">{t.insightTitle}</h2>
          <p className="kpi-lead">{t.insightBody}</p>
        </div>
        {featuredInsights.length ? (
          <div className="kpi-grid-3 mt-12">
            {featuredInsights.map((post) => {
              const href = existingHref(post.href, locale) ?? insightsHref;
              return (
                <article key={post.slug} className="kpi-card relative flex flex-col overflow-hidden p-7">
                  <div className="kpi-lime-bar absolute left-0 right-0 top-0 h-1" />
                  <p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#0B6660]">{post.category[locale]}</p>
                  <h3 className="mt-4 text-xl font-extrabold leading-snug text-[#3B3B3B]">{post.title[locale]}</h3>
                  <Link href={href} className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-semibold text-[#0B6660]">
                    {insightsUi.read} <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="kpi-home-split mt-12">
            <div className="kpi-home-photo">
              <img src="/media/the-kpi-plus-insights-scene_8a7e72cb.jpg" alt="Hotel industry research materials" />
            </div>
            <div>
              <Link href={insightsHref} className="kpi-button">
                {t.insightCta} <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
        {featuredInsights.length ? (
          <Link href={insightsHref} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#0B6660]">
            {t.insightCta} <ArrowUpRight className="h-4 w-4" />
          </Link>
        ) : null}
      </section>

      <AuditSectionHost locale={locale} />
    </SiteShell>
  );
}
