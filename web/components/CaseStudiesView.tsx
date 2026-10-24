import Link from "next/link";
import { CaseStudyCard } from "@/components/case-studies/CaseStudyCard";
import { CaseStudyCta } from "@/components/case-studies/CaseStudyCta";
import { DummyImage } from "@/components/case-studies/DummyImage";
import { MetricCard } from "@/components/case-studies/MetricCard";
import { ResultsChart } from "@/components/case-studies/ResultsChart";
import { ClientLogoMarquee } from "@/components/ClientLogoMarquee";
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
import { caseStudyOverviewChart } from "@/lib/case-study-chart";
import {
  CASE_STUDIES_HERO_VISUAL,
  CASE_STUDIES_RESULTS_CHART,
  caseStudiesHeroVisual,
  caseStudiesResultsChartFallback,
} from "@/lib/case-studies-media";
import { auditHref, localizePath, type Locale } from "@/lib/seo";

/** Soft break between Thai phrases for body copy. */
const br = "\u200B";

const chrome = {
  th: {
    pageTitle: "ผลงานลูกค้า",
    heroEyebrow: "ผลลัพธ์โรงแรมจริง",
    heroHeadlineLines: ["วัดผลจากรายได้", "ไม่ใช่ตัวเลขที่ดูดี", "แต่ไม่สร้างผล"] as const,
    heroDescription: `ตั้งแต่การบริหารราคาและช่องทางการขาย${br} ไปจนถึงแคมเปญจองตรง${br} เราโฟกัสผลลัพธ์เชิงพาณิชย์ที่วัดได้${br} เช่น Room Revenue, ADR, Occupancy, RevPAR และ ROAS`,
    viewGrid: "ดูผลงาน",
    viewStudy: "ดูรายละเอียดผลงาน",
    clientsLabelLines: ["โรงแรมและที่พักที่เราเคยร่วมงานด้วย"] as const,
    clientsEyebrow: "โรงแรมและที่พักที่คัดสรร",
    overviewTitle: "Results Overview",
    gridEyebrow: "ผลงาน",
    gridTitleLines: ["ผลลัพธ์เชิงพาณิชย์ที่วัดได้"] as const,
    closerEyebrow: "ทบทวน Performance",
    closerTitleLines: [`โรงแรมของคุณ${br}อาจพลาดรายได้ตรงไหนอยู่?`] as const,
    closerBody: `เราทบทวนราคา Distribution Booking Pace${br} และผลการดำเนินงานเชิงพาณิชย์${br} เพื่อหาจุดที่มีโอกาสสร้างรายได้เพิ่ม`,
    primaryCta: "ประเมิน Performance โรงแรม",
    secondaryCta: "คุยกับทีม เดอะ เคพีไอ พลัส",
  },
  en: {
    pageTitle: "Case Studies",
    heroEyebrow: "Real Hotel Performance",
    heroHeadlineLines: ["Results Measured in Revenue, Not Vanity Metrics."] as const,
    heroDescription:
      "From pricing and distribution to direct-booking campaigns, we focus on measurable commercial performance — including Room Revenue, ADR, Occupancy, RevPAR, Direct Booking Revenue and ROAS.",
    viewGrid: "View Case Studies",
    viewStudy: "View Case Study",
    clientsLabelLines: ["Selected hotels and properties we've worked with"] as const,
    clientsEyebrow: "Selected Hotels & Properties",
    overviewTitle: "Results Overview",
    gridEyebrow: "Case Studies",
    gridTitleLines: ["Measurable commercial results"] as const,
    closerEyebrow: "Hotel Performance Review",
    closerTitleLines: ["Where Could Your Hotel Be Leaving Revenue on the Table?"] as const,
    closerBody:
      "We review your pricing, distribution, booking pace and commercial performance to identify where additional revenue opportunities may exist.",
    primaryCta: "Request a Hotel Performance Review",
    secondaryCta: "Talk to Our Team",
  },
  ru: {
    pageTitle: "Кейсы",
    heroEyebrow: "Real Hotel Performance",
    heroHeadlineLines: ["Results Measured in Revenue, Not Vanity Metrics."] as const,
    heroDescription:
      "From pricing and distribution to direct-booking campaigns, we focus on measurable commercial performance — including Room Revenue, ADR, Occupancy, RevPAR, Direct Booking Revenue and ROAS.",
    viewGrid: "View Case Studies",
    viewStudy: "View Case Study",
    clientsLabelLines: ["Selected hotels and properties we've worked with"] as const,
    clientsEyebrow: "Selected Hotels & Properties",
    overviewTitle: "Results Overview",
    gridEyebrow: "Case Studies",
    gridTitleLines: ["Measurable commercial results"] as const,
    closerEyebrow: "Hotel Performance Review",
    closerTitleLines: ["Where Could Your Hotel Be Leaving Revenue on the Table?"] as const,
    closerBody:
      "We review your pricing, distribution, booking pace and commercial performance to identify where additional revenue opportunities may exist.",
    primaryCta: "Запросить аудит Performance отеля",
    secondaryCta: "Поговорить с командой The KPI Plus",
  },
  zh: {
    pageTitle: "客戶案例",
    heroEyebrow: "Real Hotel Performance",
    heroHeadlineLines: ["Results Measured in Revenue, Not Vanity Metrics."] as const,
    heroDescription:
      "From pricing and distribution to direct-booking campaigns, we focus on measurable commercial performance — including Room Revenue, ADR, Occupancy, RevPAR, Direct Booking Revenue and ROAS.",
    viewGrid: "View Case Studies",
    viewStudy: "View Case Study",
    clientsLabelLines: ["Selected hotels and properties we've worked with"] as const,
    clientsEyebrow: "Selected Hotels & Properties",
    overviewTitle: "Results Overview",
    gridEyebrow: "Case Studies",
    gridTitleLines: ["Measurable commercial results"] as const,
    closerEyebrow: "Hotel Performance Review",
    closerTitleLines: ["Where Could Your Hotel Be Leaving Revenue on the Table?"] as const,
    closerBody:
      "We review your pricing, distribution, booking pace and commercial performance to identify where additional revenue opportunities may exist.",
    primaryCta: "申請飯店 Performance 分析",
    secondaryCta: "與 The KPI Plus 團隊談談",
  },
} as const;

export const caseStudiesHeading = {
  th: chrome.th.pageTitle,
  en: chrome.en.pageTitle,
  ru: chrome.ru.pageTitle,
  zh: chrome.zh.pageTitle,
} as const;

function PrimaryCtaLabel({ locale, fallback }: { locale: Locale; fallback: string }) {
  if (locale !== "th") return <>{fallback}</>;
  return (
    <>
      ประเมิน <span className="kpi-latin">Performance</span> โรงแรม
    </>
  );
}

function StackedLines({
  lines,
  stacked,
}: {
  lines: readonly string[];
  stacked: boolean;
}) {
  if (!stacked || lines.length === 1) return <>{lines.join(" ")}</>;
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
  const t = chrome[locale];
  const audit = auditHref(locale);
  const contact = localizePath("/contact-us", locale);
  const indexHref = localizePath("/case-studies", locale);
  const localizedStudies = (await loadPublishedCaseStudies()).map((study) => localizeCaseStudy(study, locale));
  const featured = localizedStudies.find((study) => study.isFeatured) ?? localizedStudies[0];
  const heroStats = caseStudyHeroStatsFor(locale);
  const heroVisual = caseStudiesHeroVisual();
  const disclaimer = caseStudyDisclaimerFor(locale);
  const stackTh = locale === "th";
  const partnersLabel = "Selected hospitality partners";
  const approvedLogos = await loadPublishedClientLogos();
  const overviewChart = featured
    ? caseStudyOverviewChart(featured, featured.comparison ?? caseStudyComparisonFor(featured.slug, locale), locale)
    : null;
  const overviewFallback = caseStudiesResultsChartFallback();

  return (
    <SiteShell locale={locale} route={indexHref}>
      <section className="kpi-hero kpi-home-hero-section kpi-cs-hero">
        <div className="kpi-wrap kpi-cs-hero-grid">
          <div className="kpi-cs-hero-copy">
            <p className={`kpi-home-eyebrow${locale === "th" ? "" : " kpi-latin"}`}>{t.heroEyebrow}</p>
            <h1 className="kpi-h1 kpi-home-h1 kpi-cs-hero-title">
              <StackedLines lines={t.heroHeadlineLines} stacked={stackTh} />
            </h1>
            <p className="kpi-lead kpi-home-lead kpi-cs-hero-lead">{t.heroDescription}</p>
            <div className="kpi-cs-hero-stats" aria-label={locale === "th" ? "ไฮไลต์ผลลัพธ์" : "Performance highlights"}>
              {heroStats.map((stat, index) => (
                <div
                  key={stat.id}
                  className={`kpi-cs-hero-stat is-${stat.tone ?? "lime"}${index === 0 ? " is-primary" : ""}`}
                >
                  <p className="kpi-cs-stat-value kpi-latin">
                    {stat.value}
                    <span className={`kpi-cs-stat-name${/[A-Za-z]/.test(stat.label) ? " kpi-latin" : ""}`}>
                      {stat.label}
                    </span>
                  </p>
                  {stat.currency && !/[฿%×]/.test(stat.value) && !/pts/i.test(stat.value) ? (
                    <p className="kpi-cs-stat-unit kpi-latin">{stat.currency}</p>
                  ) : null}
                  {stat.period ? <p className="kpi-cs-stat-period">{stat.period}</p> : null}
                  {stat.comparison ? (
                    <p className="kpi-cs-stat-baseline kpi-latin">{stat.comparison}</p>
                  ) : stat.baseline ? (
                    <p className="kpi-cs-stat-baseline">
                      {locale === "th" ? "เทียบกับ" : "Compared with"} {stat.baseline}
                    </p>
                  ) : null}
                  <p className="kpi-cs-stat-status">{caseStudyHeroStatusLabel(stat.status, locale)}</p>
                </div>
              ))}
            </div>
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
            <DummyImage
              src={heroVisual.src}
              alt={heroVisual.alt}
              label={heroVisual.label}
              recommendedSize="1600 × 900 px"
              ratio={CASE_STUDIES_HERO_VISUAL.ratio}
              fit="cover"
              locale={locale}
              status={heroVisual.status}
              className="kpi-cs-hero-visual-frame"
            />
          </div>
        </div>
      </section>

      {approvedLogos.length ? (
        <section className="kpi-cs-logos border-y border-[#E3E8EB] bg-white" aria-label={partnersLabel}>
          <div className="kpi-section pb-0">
            <h2 className="kpi-cs-logos-title kpi-latin">{partnersLabel}</h2>
          </div>
          <ClientLogoMarquee logos={approvedLogos} label={partnersLabel} className="kpi-cs-marquee mt-5 mb-10" />
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
            <PrimaryCtaLabel locale={locale} fallback={t.primaryCta} />
            <span aria-hidden="true">↗</span>
          </>
        }
        secondaryHref={contact}
        secondaryLabel={t.secondaryCta}
      />
    </SiteShell>
  );
}
