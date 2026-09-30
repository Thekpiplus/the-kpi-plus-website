import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";
import {
  caseStudies,
  caseStudyDisclaimer,
  getCaseStudy,
  type CaseStudy,
} from "@/lib/case-studies";
import { auditHref, localizePath, type Locale } from "@/lib/seo";

const chrome = {
  th: {
    back: "กลับไป Case Studies",
    introduction: "Introduction",
    keyMetrics: "Key Metrics",
    results: "Results",
    before: "Before",
    after: "After",
    change: "Change",
    breakdown: "Revenue Growth Breakdown",
    whatChanged: "What We Changed",
    keyInsight: "Key Insight",
    keyTakeaway: "Key Takeaway",
    property: "Property",
    location: "Location",
    started: "Management start",
    period: "Period",
    next: "Next case study",
    primaryCta: "ขอวิเคราะห์ Performance โรงแรม",
    secondaryCta: "คุยกับทีม เดอะ เคพีไอ พลัส",
    closerEyebrow: "Hotel Performance Review",
    closerTitle: "What Could Your Hotel Be Leaving on the Table?",
    closerBody:
      "We review your pricing, distribution, booking pace and commercial performance to identify where additional revenue opportunities may exist.",
  },
  en: {
    back: "Back to Case Studies",
    introduction: "Introduction",
    keyMetrics: "Key Metrics",
    results: "Results",
    before: "Before",
    after: "After",
    change: "Change",
    breakdown: "Revenue Growth Breakdown",
    whatChanged: "What We Changed",
    keyInsight: "Key Insight",
    keyTakeaway: "Key Takeaway",
    property: "Property",
    location: "Location",
    started: "Management start",
    period: "Period",
    next: "Next case study",
    primaryCta: "Request a Hotel Performance Review",
    secondaryCta: "Talk to Our Team",
    closerEyebrow: "Hotel Performance Review",
    closerTitle: "What Could Your Hotel Be Leaving on the Table?",
    closerBody:
      "We review your pricing, distribution, booking pace and commercial performance to identify where additional revenue opportunities may exist.",
  },
  ru: {
    back: "Back to Case Studies",
    introduction: "Introduction",
    keyMetrics: "Key Metrics",
    results: "Results",
    before: "Before",
    after: "After",
    change: "Change",
    breakdown: "Revenue Growth Breakdown",
    whatChanged: "What We Changed",
    keyInsight: "Key Insight",
    keyTakeaway: "Key Takeaway",
    property: "Property",
    location: "Location",
    started: "Management start",
    period: "Period",
    next: "Next case study",
    primaryCta: "Запросить аудит Performance отеля",
    secondaryCta: "Поговорить с командой The KPI Plus",
    closerEyebrow: "Hotel Performance Review",
    closerTitle: "What Could Your Hotel Be Leaving on the Table?",
    closerBody:
      "We review your pricing, distribution, booking pace and commercial performance to identify where additional revenue opportunities may exist.",
  },
  zh: {
    back: "Back to Case Studies",
    introduction: "Introduction",
    keyMetrics: "Key Metrics",
    results: "Results",
    before: "Before",
    after: "After",
    change: "Change",
    breakdown: "Revenue Growth Breakdown",
    whatChanged: "What We Changed",
    keyInsight: "Key Insight",
    keyTakeaway: "Key Takeaway",
    property: "Property",
    location: "Location",
    started: "Management start",
    period: "Period",
    next: "Next case study",
    primaryCta: "申請飯店 Performance 分析",
    secondaryCta: "與 The KPI Plus 團隊談談",
    closerEyebrow: "Hotel Performance Review",
    closerTitle: "What Could Your Hotel Be Leaving on the Table?",
    closerBody:
      "We review your pricing, distribution, booking pace and commercial performance to identify where additional revenue opportunities may exist.",
  },
} as const;

function nextStudy(current: CaseStudy) {
  const index = caseStudies.findIndex((item) => item.slug === current.slug);
  return caseStudies[(index + 1) % caseStudies.length]!;
}

export function CaseStudyDetailView({ locale, slug }: { locale: Locale; slug: string }) {
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const t = chrome[locale];
  const audit = auditHref(locale);
  const contact = localizePath("/contact", locale);
  const indexHref = localizePath("/case-studies", locale);
  const route = localizePath(`/case-studies/${study.slug}`, locale);
  const next = nextStudy(study);

  return (
    <SiteShell locale={locale} route={route}>
      <PageHero>
        <Link href={indexHref} className="text-sm font-semibold text-[#F2F8E2]">
          {t.back}
        </Link>
        <p className="kpi-kicker mt-6 text-[#F2F8E2]">{study.eyebrow}</p>
        <h1 className="kpi-h1 mt-4">{study.headline}</h1>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs font-bold uppercase tracking-[.12em] text-[#F2F8E2]">{t.property}</dt>
            <dd className="mt-2 text-base font-semibold text-white">{study.propertyType}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase tracking-[.12em] text-[#F2F8E2]">{t.location}</dt>
            <dd className="mt-2 text-base font-semibold text-white">{study.location}</dd>
          </div>
          {study.managementStart ? (
            <div>
              <dt className="text-xs font-bold uppercase tracking-[.12em] text-[#F2F8E2]">{t.started}</dt>
              <dd className="mt-2 text-base font-semibold text-white">{study.managementStart}</dd>
            </div>
          ) : null}
          {study.period ? (
            <div>
              <dt className="text-xs font-bold uppercase tracking-[.12em] text-[#F2F8E2]">{t.period}</dt>
              <dd className="mt-2 text-base font-semibold text-white">{study.period}</dd>
            </div>
          ) : null}
        </dl>
      </PageHero>

      <section className="kpi-section">
        <div className="kpi-cs-detail">
          <div>
            <h2 className="kpi-h2">{t.introduction}</h2>
            {study.introduction.map((paragraph) => (
              <p key={paragraph} className="mt-5 max-w-2xl text-base leading-8 text-[#555555]">
                {paragraph}
              </p>
            ))}
          </div>
          <div>
            <h2 className="kpi-h2">{t.keyMetrics}</h2>
            <div className="kpi-cs-metric-grid mt-6">
              {study.metrics.map((metric) => (
                <div key={metric.label} className="kpi-cs-metric">
                  <p className="kpi-cs-stat-value kpi-latin text-[#063F3B]">{metric.value}</p>
                  <p className="mt-2 text-sm font-semibold text-[#3B3B3B]">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {study.resultsTable?.length ? (
        <section className="border-y border-[#E3E8EB] bg-white">
          <div className="kpi-section">
            <h2 className="kpi-h2">{t.results}</h2>
            <div className="mt-8 grid gap-4">
              {study.resultsTable.map((row) => (
                <div key={row.label} className="kpi-cs-result-row">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <h3 className="text-lg font-extrabold text-[#3B3B3B]">{row.label}</h3>
                    <p className="kpi-latin text-lg font-extrabold text-[#0B6660]">{row.change}</p>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[.12em] text-[#3B3B3B]">{t.before}</p>
                      <p className="kpi-latin mt-1 text-xl font-bold text-[#3B3B3B]">{row.before}</p>
                      <div className="kpi-cs-bar mt-3" aria-hidden="true">
                        <span style={{ width: "62%" }} />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[.12em] text-[#3B3B3B]">{t.after}</p>
                      <p className="kpi-latin mt-1 text-xl font-bold text-[#063F3B]">{row.after}</p>
                      <div className="kpi-cs-bar kpi-cs-bar-after mt-3" aria-hidden="true">
                        <span style={{ width: `${row.bar ?? 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {study.breakdown ? (
        <section className="kpi-section">
          <h2 className="kpi-h2">{t.breakdown}</h2>
          <div className="mt-8 kpi-cs-breakdown">
            <div>
              <p className="text-sm font-semibold text-[#3B3B3B]">{study.breakdown.totalLabel}</p>
              <p className="kpi-latin mt-2 text-4xl font-extrabold text-[#063F3B]">{study.breakdown.totalValue}</p>
            </div>
            <div className="grid gap-4">
              {study.breakdown.parts.map((part) => (
                <div key={part.label}>
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-semibold text-[#3B3B3B]">{part.label}</p>
                    <p className="kpi-latin text-sm font-bold text-[#0B6660]">{part.share}</p>
                  </div>
                  <p className="kpi-latin mt-1 text-xl font-extrabold text-[#063F3B]">{part.value}</p>
                  <div className="kpi-cs-bar kpi-cs-bar-after mt-3" aria-hidden="true">
                    <span style={{ width: `${part.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className={study.breakdown ? "border-y border-[#E3E8EB] bg-white" : "kpi-section"}>
        <div className={study.breakdown ? "kpi-section" : undefined}>
          <h2 className="kpi-h2">{t.whatChanged}</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {study.whatWeChanged.map((item) => (
              <li key={item} className="border-b border-[#E3E8EB] py-3 text-base text-[#555555]">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="kpi-section">
        <div className="kpi-grid-2">
          {study.keyInsight ? (
            <article className="kpi-cs-callout">
              <p className="kpi-kicker text-[#0B6660]">{t.keyInsight}</p>
              <p className="mt-4 text-xl font-extrabold leading-8 text-[#063F3B]">{study.keyInsight}</p>
            </article>
          ) : null}
          <article className="kpi-cs-callout kpi-cs-callout-dark">
            <p className="kpi-kicker text-[#F2F8E2]">{t.keyTakeaway}</p>
            <p className="mt-4 text-xl font-extrabold leading-8 text-white">{study.keyTakeaway}</p>
          </article>
        </div>
        <p className="mt-10 max-w-3xl text-sm leading-7 text-[#555555]">{caseStudyDisclaimer}</p>
        <Link
          href={localizePath(`/case-studies/${next.slug}`, locale)}
          className="mt-8 inline-flex text-sm font-semibold text-[#0B6660]"
        >
          {t.next}: {next.mainResult}
        </Link>
      </section>

      <section className="bg-[#063F3B] text-white">
        <div className="kpi-section">
          <p className="kpi-kicker text-[#F2F8E2]">{t.closerEyebrow}</p>
          <h2 className="kpi-h2 mt-4 text-white">{t.closerTitle}</h2>
          <p className="kpi-lead mt-5 max-w-3xl text-white">{t.closerBody}</p>
          <div className="kpi-actions">
            <Link href={audit} className="kpi-button">
              {t.primaryCta}
            </Link>
            <Link href={contact} className="kpi-button-ghost">
              {t.secondaryCta}
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
