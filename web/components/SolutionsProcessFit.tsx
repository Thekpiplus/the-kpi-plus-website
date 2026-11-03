import Link from "next/link";
import {
  SOLUTIONS_PROCESS_STEPS,
  solutionsProcessStepBody,
  solutionsProcessStepLabel,
  solutionsProofEligibleStudies,
} from "@/lib/solutions-proof";
import { localizePath, type Locale } from "@/lib/seo";

type ProcessCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  /** Shown only when eligible proof exists. */
  proofTitle: string;
  /** Shown when no Solutions-index-eligible proof exists. */
  noProofNote: string;
};

export type SolutionsProcessStepView = {
  id: string;
  title: string;
  body: string;
};

export type SolutionsProofCardView = {
  id: string;
  identity: string;
  challenge: string;
  scope: string;
  workDone: string;
  measurement: string;
  review: string;
  href?: string;
};

/**
 * Process / fit explanation for the Solutions index.
 * Case proof cards render only when studies pass the full publication checklist
 * (identity, challenge, scope, work done, measurement definition/period, source, permission, review date).
 * Metrics are never invented or shown here without that checklist.
 */
export function SolutionsProcessFit({
  locale,
  copy,
  steps,
  proofItems,
}: {
  locale: Locale;
  copy: ProcessCopy;
  steps?: SolutionsProcessStepView[];
  proofItems?: SolutionsProofCardView[];
}) {
  const processSteps =
    steps && steps.length
      ? steps
      : SOLUTIONS_PROCESS_STEPS.map((step) => ({
          id: step.id,
          title: solutionsProcessStepLabel(step, locale),
          body: solutionsProcessStepBody(step, locale),
        }));

  const eligible =
    proofItems ??
    solutionsProofEligibleStudies().map((study) => {
      const primary = study.metrics[0];
      return {
        id: study.id,
        identity: study.anonymisedLabel || study.clientName,
        challenge: study.challenge.split("\n").filter(Boolean)[0] || "",
        scope: study.serviceArea,
        workDone: study.action.split("\n").filter(Boolean).slice(0, 3).join(" · "),
        measurement: [primary?.definition, primary?.period, primary?.sourceNote].filter(Boolean).join(" · "),
        review: study.updatedAt || study.publishedAt,
        href: localizePath(`/case-studies/${study.slug}`, locale),
      };
    });

  return (
    <section className="kpi-section kpi-solutions-process" aria-labelledby="solutions-process-title">
      <p className="kpi-kicker text-[#0B6660]">{copy.eyebrow}</p>
      <h2 id="solutions-process-title" className="kpi-h2 mt-5">
        {copy.title}
      </h2>
      <p className="kpi-lead mt-5 max-w-3xl">{copy.lead}</p>

      <ol className="kpi-solutions-process-list">
        {processSteps.map((step, index) => (
          <li key={step.id}>
            <span className="kpi-solutions-process-num" aria-hidden="true">
              0{index + 1}
            </span>
            <h3 className="kpi-solutions-process-step-title">{step.title}</h3>
            <p className="kpi-solutions-process-step-body">{step.body}</p>
          </li>
        ))}
      </ol>

      {eligible.length > 0 ? (
        <div className="kpi-solutions-process-proof">
          <h3 className="kpi-solutions-process-proof-title">{copy.proofTitle}</h3>
          <ul className="kpi-solutions-process-proof-list">
            {eligible.map((study) => (
              <li key={study.id}>
                <article className="kpi-solutions-process-proof-card">
                  <p className="kpi-solutions-process-proof-identity">{study.identity}</p>
                  <p className="kpi-solutions-process-proof-challenge">{study.challenge}</p>
                  <dl className="kpi-solutions-process-proof-meta">
                    <div>
                      <dt>Scope</dt>
                      <dd>{study.scope}</dd>
                    </div>
                    <div>
                      <dt>What was done</dt>
                      <dd>{study.workDone}</dd>
                    </div>
                    {study.measurement ? (
                      <div>
                        <dt>Measurement</dt>
                        <dd>{study.measurement}</dd>
                      </div>
                    ) : null}
                    <div>
                      <dt>Review</dt>
                      <dd>{study.review}</dd>
                    </div>
                  </dl>
                  {study.href ? (
                    <Link href={study.href} className="kpi-solutions-process-proof-link">
                      View case details →
                    </Link>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="kpi-solutions-process-proof-note">{copy.noProofNote}</p>
      )}
    </section>
  );
}
