import Link from "next/link";
import { CaseStudyCard } from "@/components/case-studies/CaseStudyCard";
import { CaseStudyCta } from "@/components/case-studies/CaseStudyCta";
import { DummyImage } from "@/components/case-studies/DummyImage";
import { MetricCard } from "@/components/case-studies/MetricCard";
import { ResultsChart } from "@/components/case-studies/ResultsChart";
import { ClientLogoGrid } from "@/components/ClientLogoGrid";
import { SiteShell } from "@/components/SiteShell";
import {
  caseStudyComparisonFor,
  caseStudyDisclaimerFor,
  caseStudyHeroStatsFor,
  caseStudyHeroStatusLabel,
  caseStudyResultsNote,
  localizeCaseStudy,
} from "@/lib/case-studies";
import { loadPublishedClientLogos } from "@/lib/cms/client-logo-public";
import { loadPublishedCaseStudies } from "@/lib/cms/case-study-public";
import { loadCaseStudiesPageCopy } from "@/lib/cms/case-studies-page-public";
import { caseStudyOverviewChart } from "@/lib/case-study-chart";
import {
  CASE_STUDIES_HERO_VISUAL,
  CASE_STUDIES_RESULTS_CHART,
  caseStudiesHeroVisual,
  caseStudiesResultsChartFallback,
} from "@/lib/case-studies-media";
import { auditHref, localizePath, type Locale } from "@/lib/seo";

export const caseStudiesHeading = {
  th: "ผลงานลูกค้า",
  en: "Case Studies",
  ru: "Кейсы",
  zh: "客戶案例",
} as const;

function PrimaryCtaLabel({ locale, fallback }: { locale: Locale; fallback: string }) {
  if (locale !== "th") return <>{fallback}</>;
  if (fallback.includes("Performance")) {
    const [before, after] = fallback.split("Performance");
    return (
      <>
        {before}
        <span className="kpi-latin">Performance</span>
        {after}
      </>
    );
  }
  return <>{fallback}</>;
}

function StackedLines({
  lines,
  stacked,
}: {
  lines: readonly string[];
  stacked: boolean;
}) {
  if (!stacked || lines.length <= 1) return <>{lines.join(" ")}</>;
  return (
    <>
      {lines.map((line) => (
        <span key={line} className="kpi-cs-line">
          {line}
        </span>
      ))}
    </>
  );
}

export async function CaseStudiesView({ locale }: { locale: Locale }) {
  const t = await loadCaseStudiesPageCopy(locale);
  const audit = auditHref(locale);
  const contact = localizePath("/contact-us", locale);
  const indexHref = localizePath("/case-studies", locale);
  const localizedStudies = (await loadPublishedCaseStudies()).map((study) => localizeCaseStudy(study, locale));
  const featured = localizedStudies.find((study) => study.isFeatured) ?? localizedStudies[0];
  const heroStats = caseStudyHeroStatsFor(locale);
  const heroVisual = caseStudiesHeroVisual(locale);
  const disclaimer = caseStudyDisclaimerFor(locale);
  const stackTh = locale === "th";
  const partnerLogos = await loadPublishedClientLogos();
  const partnersTitle = t.clientsLabelLines.join(" ");
  const overviewChart = featured
    ? caseStudyOverviewChart(featured, featured.comparison ?? caseStudyComparisonFor(featured.slug, locale), locale)
    : null;
  const overviewFallback = caseStudiesResultsChartFallback();
  const heroSrc = t.heroImage || heroVisual.src || CASE_STUDIES_HERO_VISUAL.approvedSrc || "";
  const heroApproved = Boolean(heroSrc);
  const heroAlt = t.heroAlt || heroVisual.alt;

  return (
    <SiteShell locale={locale} route={indexHref}>
      <section className={`kpi-hero kpi-cs-hero${heroApproved ? " kpi-cs-hero--photo" : ""}`}>
        <div className="kpi-wrap kpi-cs-hero-stage">
          <div className="kpi-cs-hero-copy">
            <p className={`kpi-home-eyebrow${locale === "th" ? "" : " kpi-latin"}`}>{t.heroEyebrow}</p>
            <h1 className={`kpi-h1 kpi-cs-hero-title${locale === "th" ? "" : " kpi-latin"}`}>
              <span className="kpi-cs-hero-title-lead">{t.heroHeadlineLead}</span>
              <span className="kpi-cs-hero-title-rest">
                {t.heroHeadlineRest}
                {t.heroHeadlineAccent ? <span className="kpi-home-accent"> {t.heroHeadlineAccent}</span> : null}
              </span>
            </h1>
            <p className="kpi-lead kpi-cs-hero-lead">{t.heroDescription}</p>
            <div className="kpi-actions kpi-cs-hero-actions">
              <a href="#case-studies" className="kpi-button">
                {t.viewGrid} <span aria-hidden="true">↗</span>
              </a>
              <Link href={audit} className="kpi-button-ghost">
                <PrimaryCtaLabel locale={locale} fallback={t.primaryCta} />
              </Link>
            </div>
          </div>

          <div className="kpi-cs-hero-visual">
            {heroApproved ? (
              <figure className="kpi-cs-hero-visual-frame">
                <img
                  src={heroSrc}
                  alt={heroAlt}
                  width={CASE_STUDIES_HERO_VISUAL.sourceWidth}
                  height={CASE_STUDIES_HERO_VISUAL.sourceHeight}
                  decoding="async"
                  fetchPriority="high"
                />
              </figure>
            ) : (
              <DummyImage
                src={heroVisual.src}
                alt={heroAlt || heroVisual.alt}
                label={heroVisual.label}
                recommendedSize="1600 × 900 px"
                ratio={CASE_STUDIES_HERO_VISUAL.ratio}
                fit="cover"
                locale={locale}
                status={heroVisual.status}
                width={CASE_STUDIES_HERO_VISUAL.sourceWidth}
                height={CASE_STUDIES_HERO_VISUAL.sourceHeight}
                className="kpi-cs-hero-visual-frame"
              />
            )}
          </div>
        </div>
      </section>

      {partnerLogos.length ? (
        <section className="kpi-cs-partners" aria-labelledby="kpi-cs-partners-title">
          <div className="kpi-section">
            <header className="kpi-cs-partners-head">
              <p className={`kpi-cs-partners-eyebrow${locale === "th" ? "" : " kpi-latin"}`}>{t.clientsEyebrow}</p>
              <h2 id="kpi-cs-partners-title" className={`kpi-cs-partners-title${locale === "th" ? "" : " kpi-latin"}`}>
                <StackedLines lines={t.clientsLabelLines} stacked={stackTh} />
              </h2>
            </header>
            <ClientLogoGrid logos={partnerLogos} label={partnersTitle} />
          </div>
        </section>
      ) : null}

      <section className="kpi-cs-overview" aria-labelledby="kpi-cs-overview-title">
        <div className="kpi-section">
          <h2 id="kpi-cs-overview-title" className="kpi-cs-overview-title kpi-latin">
            {t.overviewTitle}
          </h2>
          <div className="kpi-cs-overview-grid">
            {overviewChart ? (
              <ResultsChart
                labels={overviewChart.labels}
                series={overviewChart.series}
                title={overviewChart.title}
                subtitle={overviewChart.subtitle}
                unit={overviewChart.unit}
                tickSuffix={overviewChart.tickSuffix}
                axisLabel={overviewChart.axisLabel}
                statusLabel={overviewChart.statusLabel}
                valueLabels={overviewChart.valueLabels}
                baseline={overviewChart.baseline}
                caption={overviewChart.caption}
              />
            ) : (
              <DummyImage
                src={overviewFallback.src}
                alt={overviewFallback.alt}
                label={overviewFallback.label}
                recommendedSize="1600 × 900 px"
                ratio={CASE_STUDIES_RESULTS_CHART.ratio}
                fit="contain"
                locale={locale}
                status={overviewFallback.status}
                width={CASE_STUDIES_RESULTS_CHART.sourceWidth}
                height={CASE_STUDIES_RESULTS_CHART.sourceHeight}
                className="kpi-cs-overview-fallback"
              />
            )}
            <div className="kpi-cs-overview-cards">
              {heroStats.map((stat, index) => (
                <MetricCard
                  key={stat.id}
                  label={stat.label}
                  value={stat.value}
                  lines={[
                    stat.currency && !/[฿%×]/.test(stat.value) && !/pts/i.test(stat.value) ? stat.currency : "",
                    stat.period ?? "",
                    stat.comparison ?? (stat.baseline ? `${locale === "th" ? "เทียบกับ" : "Compared with"} ${stat.baseline}` : ""),
                  ]}
                  status={caseStudyHeroStatusLabel(stat.status, locale)}
                  tone={stat.tone ?? (index === 2 ? "amber" : index === 1 ? "yellow" : "lime")}
                />
              ))}
            </div>
          </div>
          <p className="kpi-cs-results-note">{caseStudyResultsNote(featured, locale)}</p>
        </div>
      </section>

      <section id="case-studies" className="kpi-section kpi-cs-grid scroll-mt-28">
        <p className={`kpi-cs-grid-eyebrow${locale === "th" ? "" : " kpi-latin"}`}>{t.gridEyebrow}</p>
        <h2 className="kpi-h2">
          <StackedLines lines={t.gridTitleLines} stacked={stackTh} />
        </h2>
        <div className="kpi-cs-layout">
          {localizedStudies.map((study) => (
            <CaseStudyCard
              key={study.slug}
              study={study}
              locale={locale}
              ctaLabel={t.viewStudy}
              featured={study.id === featured?.id}
            />
          ))}
        </div>
        <p className="kpi-cs-disclaimer">{disclaimer}</p>
      </section>

      <CaseStudyCta
        locale={locale}
        eyebrow={t.closerEyebrow}
        title={<StackedLines lines={t.closerTitleLines} stacked={stackTh} />}
        body={t.closerBody}
        primaryHref={audit}
        primaryLabel={
          <>
            <PrimaryCtaLabel locale={locale} fallback={t.closerPrimaryCta || t.primaryCta} />
            <span aria-hidden="true">↗</span>
          </>
        }
        secondaryHref={contact}
        secondaryLabel={t.secondaryCta}
      />
    </SiteShell>
  );
}
