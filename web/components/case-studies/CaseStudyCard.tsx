import Link from "next/link";
import { DummyImage } from "@/components/case-studies/DummyImage";
import {
  caseStudyActionItems,
  caseStudyCardStatus,
  caseStudyIdentity,
  caseStudyMetricLabel,
  caseStudyParagraphs,
  caseStudyPrimaryMetric,
  caseStudyPublicMetricParts,
  caseStudyResultsNote,
  type CaseStudy,
} from "@/lib/case-studies";
import { CASE_STUDY_CARD_VISUAL, caseStudyCardVisual } from "@/lib/case-studies-media";
import { localizePath, type Locale } from "@/lib/seo";

const STORY_LABELS = {
  challenge: "Challenge",
  analysis: "Analysis",
  action: "Action",
  result: "Result",
} as const;

export function CaseStudyCard({
  study,
  locale,
  ctaLabel,
  featured = false,
}: {
  study: CaseStudy;
  locale: Locale;
  ctaLabel: string;
  featured?: boolean;
}) {
  const status = caseStudyCardStatus(study);
  const identity = caseStudyIdentity(study);
  const metric = caseStudyPrimaryMetric(study);
  const showMetric = Boolean(metric);
  const visual = caseStudyCardVisual(study);
  const challenge = caseStudyParagraphs(study.challenge);
  const analysis = caseStudyParagraphs(study.analysis);
  const actions = caseStudyActionItems(study);
  const resultCopy = caseStudyParagraphs(study.result)[0];
  const hasDetail = study.isPublished;
  const detailHref = localizePath(`/case-studies/${study.slug}`, locale);
  const metricName = metric ? caseStudyMetricLabel(metric) : "";

  return (
    <article className={`kpi-cs-study-card${featured ? " is-featured" : ""}`}>
      <div className="kpi-cs-study-visual">
        <DummyImage
          src={visual.src}
          alt={visual.alt}
          label={visual.label}
          recommendedSize="1200 × 800 px"
          ratio={CASE_STUDY_CARD_VISUAL.ratio}
          fit="cover"
          locale={locale}
          status={visual.status}
          width={CASE_STUDY_CARD_VISUAL.sourceWidth}
          height={CASE_STUDY_CARD_VISUAL.sourceHeight}
          className="kpi-cs-cover"
        />
        <p className="kpi-cs-study-caption kpi-latin">{visual.caption}</p>
      </div>

      <div className="kpi-cs-study-body">
        <div className="kpi-cs-study-meta">
          <p className="kpi-latin kpi-cs-category">{study.serviceArea}</p>
          <p className="kpi-cs-study-status kpi-latin">{status}</p>
        </div>

        <h3 className="kpi-cs-study-title">{study.title}</h3>
        {identity ? <p className="kpi-cs-place">{identity}</p> : null}
        {study.measurementPeriod ? (
          <p className="kpi-cs-study-period">{study.measurementPeriod}</p>
        ) : null}

        {showMetric && metric ? (
          <p className={`kpi-latin kpi-cs-result${featured ? " is-featured" : ""}`}>
            {metric.value} {metricName}
          </p>
        ) : null}

        <div className="kpi-cs-story">
          {challenge.length ? (
            <div className="kpi-cs-story-block">
              <h4 className="kpi-cs-story-label kpi-latin">{STORY_LABELS.challenge}</h4>
              {challenge.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ) : null}

          {analysis.length ? (
            <div className="kpi-cs-story-block">
              <h4 className="kpi-cs-story-label kpi-latin">{STORY_LABELS.analysis}</h4>
              {analysis.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          ) : null}

          {actions.length ? (
            <div className="kpi-cs-story-block">
              <h4 className="kpi-cs-story-label kpi-latin">{STORY_LABELS.action}</h4>
              <ul>
                {actions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="kpi-cs-story-block">
            <h4 className="kpi-cs-story-label kpi-latin">{STORY_LABELS.result}</h4>
            {showMetric && metric ? (
              <>
                <p className="kpi-latin kpi-cs-story-metric">
                  {metric.value} {metricName}
                </p>
                {caseStudyPublicMetricParts(metric, locale).parts.map((line) => (
                  <p key={line} className="kpi-cs-story-metric-context">
                    {line}
                  </p>
                ))}
                {metric.definition ? <p>{metric.definition}</p> : null}
              </>
            ) : null}
            {resultCopy ? <p>{resultCopy}</p> : null}
            <p className="kpi-cs-results-note">{caseStudyResultsNote(study, locale)}</p>
          </div>
        </div>

        {hasDetail ? (
          <Link href={detailHref} className="kpi-cs-study-cta">
            {ctaLabel}
            <span aria-hidden="true">↗</span>
          </Link>
        ) : null}
      </div>
    </article>
  );
}
