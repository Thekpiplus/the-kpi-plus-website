import Link from "next/link";
import { notFound } from "next/navigation";
import { CaseStudyCta } from "@/components/case-studies/CaseStudyCta";
import { DummyImage } from "@/components/case-studies/DummyImage";
import { ResultsChart } from "@/components/case-studies/ResultsChart";
import { PageHero } from "@/components/PageHero";
import { SiteShell } from "@/components/SiteShell";
import { caseStudyOverviewChart, caseStudyResultsChart } from "@/lib/case-study-chart";
import {
  caseStudyActionItems,
  caseStudyComparisonFor,
  caseStudyDataStatusLabel,
  caseStudyDisclaimerFor,
  caseStudyEyebrow,
  caseStudyIdentity,
  caseStudyMethodologyNote,
  caseStudyMetricLabel,
  caseStudyParagraphs,
  caseStudyPrimaryMetric,
  caseStudyPublicMetricParts,
  caseStudyRelatedServices,
  caseStudyResultsNote,
  localizeCaseStudy,
  type CaseStudy,
} from "@/lib/case-studies";
import { loadPublishedCaseStudy, loadRelatedCaseStudies } from "@/lib/cms/case-study-public";
import { caseStudyPropertyEvidence, caseStudyReportEvidence } from "@/lib/case-studies-media";
import { auditHref, localizePath, type Locale } from "@/lib/seo";

const chrome = {
  th: {
    back: "กลับไปหน้าผลงาน",
    overview: "Case overview",
    challenge: "Challenge",
    analysis: "Analysis",
    actionPlan: "Action plan",
    result: "Result",
    before: "ก่อน",
    after: "หลัง",
    change: "เปลี่ยนแปลง",
    breakdown: "สัดส่วนการเติบโตของรายได้",
    period: "ช่วงเวลา",
    measurementPeriod: "Measurement period",
    methodology: "Methodology note",
    dataStatus: "Data status",
    relatedServices: "Related services",
    relatedCases: "Related case studies",
    property: "ประเภทที่พัก",
    primaryCta: "ประเมิน Performance โรงแรม",
    secondaryCta: "คุยกับทีม เดอะ เคพีไอ พลัส",
    closerEyebrow: "ทบทวน Performance โรงแรม",
    closerTitle: "โรงแรมของคุณอาจพลาดรายได้ตรงไหนอยู่?",
    closerBody:
      "เราทบทวนราคา Distribution Booking Pace และผลการดำเนินงานเชิงพาณิชย์ เพื่อหาจุดที่มีโอกาสสร้างรายได้เพิ่ม",
  },
  en: {
    back: "Back to Case Studies",
    overview: "Case overview",
    challenge: "Challenge",
    analysis: "Analysis",
    actionPlan: "Action plan",
    result: "Result",
    before: "Before",
    after: "After",
    change: "Change",
    breakdown: "Revenue Growth Breakdown",
    period: "Measurement period",
    measurementPeriod: "Measurement period",
    methodology: "Methodology note",
    dataStatus: "Data status",
    relatedServices: "Related services",
    relatedCases: "Related case studies",
    property: "Property",
    primaryCta: "Request a Hotel Performance Review",
    secondaryCta: "Talk to Our Team",
    closerEyebrow: "Hotel Performance Review",
    closerTitle: "What Could Your Hotel Be Leaving on the Table?",
    closerBody:
      "We review your pricing, distribution, booking pace and commercial performance to identify where additional revenue opportunities may exist.",
  },
  ru: {
    back: "Back to Case Studies",
    overview: "Case overview",
    challenge: "Challenge",
    analysis: "Analysis",
    actionPlan: "Action plan",
    result: "Result",
    before: "Before",
    after: "After",
    change: "Change",
    breakdown: "Revenue Growth Breakdown",
    period: "Measurement period",
    measurementPeriod: "Measurement period",
    methodology: "Methodology note",
    dataStatus: "Data status",
    relatedServices: "Related services",
    relatedCases: "Related case studies",
    property: "Property",
    primaryCta: "Запросить аудит Performance отеля",
    secondaryCta: "Поговорить с командой The KPI Plus",
    closerEyebrow: "Hotel Performance Review",
    closerTitle: "What Could Your Hotel Be Leaving on the Table?",
    closerBody:
      "We review your pricing, distribution, booking pace and commercial performance to identify where additional revenue opportunities may exist.",
  },
  zh: {
    back: "Back to Case Studies",
    overview: "Case overview",
    challenge: "Challenge",
    analysis: "Analysis",
    actionPlan: "Action plan",
    result: "Result",
    before: "Before",
    after: "After",
    change: "Change",
    breakdown: "Revenue Growth Breakdown",
    period: "Measurement period",
    measurementPeriod: "Measurement period",
    methodology: "Methodology note",
    dataStatus: "Data status",
    relatedServices: "Related services",
    relatedCases: "Related case studies",
    property: "Property",
    primaryCta: "申請飯店 Performance 分析",
    secondaryCta: "與 The KPI Plus 團隊談談",
    closerEyebrow: "Hotel Performance Review",
    closerTitle: "What Could Your Hotel Be Leaving on the Table?",
    closerBody:
      "We review your pricing, distribution, booking pace and commercial performance to identify where additional revenue opportunities may exist.",
  },
} as const;

function EvidenceFigure({
  visual,
  locale,
}: {
  visual: {
    src?: string;
    alt: string;
    status: "approved" | "placeholder";
    label: string;
    caption: string;
  };
  locale: Locale;
}) {
  return (
    <div className="kpi-cs-evidence">
      <DummyImage
        src={visual.src}
        alt={visual.alt}
        label={visual.label}
        recommendedSize="1600 × 900 px"
        ratio="16 / 9"
        fit="cover"
        locale={locale}
        status={visual.status}
        className="kpi-cs-detail-cover"
      />
      <p className="kpi-cs-evidence-caption kpi-latin">{visual.caption}</p>
    </div>
  );
}

export async function CaseStudyDetailView({
  locale,
  slug,
  previewStudy,
  embedded = false,
}: {
  locale: Locale;
  slug: string;
  previewStudy?: CaseStudy;
  embedded?: boolean;
}) {
  const base = previewStudy ?? (await loadPublishedCaseStudy(slug));
  if (!base) notFound();

  const study = localizeCaseStudy(base, locale);
  const t = chrome[locale];
  const audit = auditHref(locale);
  const contact = localizePath("/contact-us", locale);
  const indexHref = localizePath("/case-studies", locale);
  const route = localizePath(`/case-studies/${study.slug}`, locale);
  const disclaimer = caseStudyDisclaimerFor(locale);
  const comparison = study.comparison ?? caseStudyComparisonFor(study.slug, locale);
  const challengeParagraphs = caseStudyParagraphs(study.challenge);
  const analysisParagraphs = caseStudyParagraphs(study.analysis);
  const actionItems = caseStudyActionItems(study);
  const resultCopy = caseStudyParagraphs(study.result);
  const identity = caseStudyIdentity(study);
  const statusLabel = caseStudyDataStatusLabel(study, locale);
  const methodology = caseStudyMethodologyNote(study, locale);
  const metric = caseStudyPrimaryMetric(study);
  const services = caseStudyRelatedServices(study, locale);
  const related = (await loadRelatedCaseStudies(study)).map((item) => localizeCaseStudy(item, locale));
  const approvedTestimonial =
    study.testimonial?.approvalStatus === "approved" ? study.testimonial : null;
  const propertyVisual = caseStudyPropertyEvidence(study);
  const reportVisual = caseStudyReportEvidence(study);
  const overviewChart = caseStudyOverviewChart(study, comparison, locale);
  const indexedChart = caseStudyResultsChart(study, comparison, locale, {
    before: t.before,
    after: t.after,
  });
  const chart = overviewChart ?? indexedChart;

  const content = (
    <>
      <PageHero>
        <Link href={indexHref} className="text-sm font-semibold text-[#F2F8E2]">
          {t.back}
        </Link>
        <p className="kpi-kicker mt-6 text-[#F2F8E2]">{caseStudyEyebrow(study)}</p>
        <h1 className="kpi-h1 mt-4">{study.title}</h1>
        <p className="kpi-cs-hero-status kpi-latin">{statusLabel}</p>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {identity ? (
            <div>
              <dt className="text-xs font-bold uppercase tracking-[.12em] text-[#F2F8E2]">{t.property}</dt>
              <dd className="mt-2 text-base font-semibold text-white">{identity}</dd>
            </div>
          ) : null}
          {study.measurementPeriod ? (
            <div>
              <dt className="text-xs font-bold uppercase tracking-[.12em] text-[#F2F8E2]">{t.period}</dt>
              <dd className="mt-2 text-base font-semibold text-white">{study.measurementPeriod}</dd>
            </div>
          ) : null}
        </dl>
      </PageHero>

      <article className="kpi-cs-article">
        <div className="kpi-section kpi-cs-article-inner">
        <section aria-labelledby="cs-overview">
          <h2 id="cs-overview" className="kpi-h2 kpi-latin">
            {t.overview}
          </h2>
          <p className="kpi-cs-article-lead">{study.shortDescription}</p>
          {propertyVisual ? <EvidenceFigure visual={propertyVisual} locale={locale} /> : null}
        </section>

        {challengeParagraphs.length ? (
          <section aria-labelledby="cs-challenge">
            <h2 id="cs-challenge" className="kpi-h2 kpi-latin">
              {t.challenge}
            </h2>
            {challengeParagraphs.map((paragraph) => (
              <p key={paragraph} className="kpi-cs-article-copy">
                {paragraph}
              </p>
            ))}
          </section>
        ) : null}

        {analysisParagraphs.length ? (
          <section aria-labelledby="cs-analysis">
            <h2 id="cs-analysis" className="kpi-h2 kpi-latin">
              {t.analysis}
            </h2>
            {analysisParagraphs.map((paragraph) => (
              <p key={paragraph} className="kpi-cs-article-copy">
                {paragraph}
              </p>
            ))}
          </section>
        ) : null}

        {actionItems.length ? (
          <section aria-labelledby="cs-action">
            <h2 id="cs-action" className="kpi-h2 kpi-latin">
              {t.actionPlan}
            </h2>
            <ol className="kpi-cs-action-plan">
              {actionItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>
        ) : null}

        <section aria-labelledby="cs-result">
          <h2 id="cs-result" className="kpi-h2 kpi-latin">
            {t.result}
          </h2>
          {metric ? (
            <>
              <p className="kpi-latin kpi-cs-result-lead">
                {metric.value} {caseStudyMetricLabel(metric)}
              </p>
              {caseStudyPublicMetricParts(metric, locale).parts.map((line) => (
                <p key={line} className="kpi-cs-article-copy">
                  {line}
                </p>
              ))}
              {metric.definition ? <p className="kpi-cs-article-copy">{metric.definition}</p> : null}
            </>
          ) : null}
          {resultCopy.map((paragraph) => (
            <p key={paragraph} className="kpi-cs-article-copy">
              {paragraph}
            </p>
          ))}

          {chart ? (
            <div className="kpi-cs-evidence">
              <ResultsChart
                labels={chart.labels}
                series={chart.series}
                title={chart.title}
                subtitle={chart.subtitle}
                unit={chart.unit}
                tickSuffix={chart.tickSuffix}
                axisLabel={chart.axisLabel}
                statusLabel={chart.statusLabel}
                valueLabels={chart.valueLabels}
                baseline={chart.baseline}
                caption={chart.caption}
              />
            </div>
          ) : null}

          {comparison?.resultsTable?.length ? (
            <div className="kpi-cs-result-table">
              {comparison.resultsTable.map((row) => (
                <div key={row.label} className="kpi-cs-result-row">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <h3 className="text-lg font-extrabold text-[#3B3B3B]">{row.label}</h3>
                    <p className="kpi-latin text-lg font-extrabold text-[#0B6660]">{row.change}</p>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[.12em] text-[#3B3B3B]">{t.before}</p>
                      <p className="kpi-latin mt-1 text-xl font-bold text-[#3B3B3B]">{row.before}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[.12em] text-[#3B3B3B]">{t.after}</p>
                      <p className="kpi-latin mt-1 text-xl font-bold text-[#0B1F33]">{row.after}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {comparison?.breakdown ? (
            <div className="mt-8 kpi-cs-breakdown">
              <div>
                <h3 className="kpi-cs-story-label">{t.breakdown}</h3>
                <p className="text-sm font-semibold text-[#3B3B3B]">{comparison.breakdown.totalLabel}</p>
                <p className="kpi-latin mt-2 text-4xl font-extrabold text-[#0B1F33]">{comparison.breakdown.totalValue}</p>
              </div>
              <div className="grid gap-4">
                {comparison.breakdown.parts.map((part) => (
                  <div key={part.label}>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="font-semibold text-[#3B3B3B]">{part.label}</p>
                      <p className="kpi-latin text-sm font-bold text-[#0B6660]">{part.share}</p>
                    </div>
                    <p className="kpi-latin mt-1 text-xl font-extrabold text-[#0B1F33]">{part.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {reportVisual ? <EvidenceFigure visual={reportVisual} locale={locale} /> : null}

          {approvedTestimonial ? (
            <blockquote className="kpi-cs-callout">
              <p className="text-xl font-extrabold leading-8 text-[#0B1F33]">“{approvedTestimonial.quote}”</p>
              {approvedTestimonial.authorName || approvedTestimonial.authorRole ? (
                <footer className="mt-4 text-sm font-semibold text-[#3B3B3B]">
                  {approvedTestimonial.authorName}
                  {approvedTestimonial.authorName && approvedTestimonial.authorRole ? " · " : null}
                  {approvedTestimonial.authorRole}
                </footer>
              ) : null}
            </blockquote>
          ) : null}

          <p className="kpi-cs-results-note">{caseStudyResultsNote(study, locale)}</p>
        </section>

        <section aria-labelledby="cs-period">
          <h2 id="cs-period" className="kpi-h2 kpi-latin">
            {t.measurementPeriod}
          </h2>
          <p className="kpi-cs-article-copy">{study.measurementPeriod}</p>
          {metric?.comparison ? (
            <p className="kpi-latin kpi-cs-article-copy">{metric.comparison}</p>
          ) : null}
        </section>

        <section aria-labelledby="cs-methodology">
          <h2 id="cs-methodology" className="kpi-h2 kpi-latin">
            {t.methodology}
          </h2>
          <p className="kpi-cs-article-copy">{methodology}</p>
        </section>

        <section aria-labelledby="cs-status">
          <h2 id="cs-status" className="kpi-h2 kpi-latin">
            {t.dataStatus}
          </h2>
          <p className="kpi-cs-status-label kpi-latin">{statusLabel}</p>
          <p className="kpi-cs-article-copy">{disclaimer}</p>
        </section>

        {services.length ? (
          <section aria-labelledby="cs-services">
            <h2 id="cs-services" className="kpi-h2 kpi-latin">
              {t.relatedServices}
            </h2>
            <ul className="kpi-cs-related-links">
              {services.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {related.length ? (
          <section aria-labelledby="cs-related">
            <h2 id="cs-related" className="kpi-h2 kpi-latin">
              {t.relatedCases}
            </h2>
            <ul className="kpi-cs-related-cases">
              {related.map((item) => {
                const relatedMetric = caseStudyPrimaryMetric(item);
                return (
                  <li key={item.slug}>
                    <Link href={localizePath(`/case-studies/${item.slug}`, locale)} className="kpi-cs-related-case">
                      <span className="kpi-cs-related-case-title">{item.title}</span>
                      <span className="kpi-cs-related-case-meta">
                        {caseStudyIdentity(item)}
                        {relatedMetric ? ` · ${relatedMetric.value} ${caseStudyMetricLabel(relatedMetric)}` : ""}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}
        </div>
      </article>

      <CaseStudyCta
        locale={locale}
        eyebrow={t.closerEyebrow}
        title={t.closerTitle}
        body={t.closerBody}
        primaryHref={audit}
        primaryLabel={t.primaryCta}
        secondaryHref={contact}
        secondaryLabel={t.secondaryCta}
      />
    </>
  );

  if (embedded) return content;
  return (
    <SiteShell locale={locale} route={route}>
      {content}
    </SiteShell>
  );
}
