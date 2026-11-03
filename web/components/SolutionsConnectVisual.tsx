import type { Locale } from "@/lib/seo";
import { solutionsConnectChain } from "@/lib/solutions-service-cards";

type ConnectCopy = {
  title: string;
  note: string;
};

/** Small illustrative chain — not interactive, not a required package. */
export function SolutionsConnectVisual({
  groupId,
  locale,
  copy,
  steps: stepsOverride,
}: {
  groupId: string;
  locale: Locale;
  copy: ConnectCopy;
  steps?: string[];
}) {
  const chain = solutionsConnectChain(groupId);
  const steps = stepsOverride?.length ? stepsOverride : chain ? chain.steps[locale] ?? chain.steps.en : [];
  if (!steps.length) return null;
  const chainId = chain?.id ?? groupId;

  return (
    <aside className="kpi-solutions-connect" aria-label={copy.title}>
      <p className="kpi-solutions-connect-title">{copy.title}</p>
      <ol className="kpi-solutions-connect-list">
        {steps.map((step, index) => (
          <li key={`${chainId}-${step}-${index}`}>
            <span className="kpi-solutions-connect-step kpi-latin">{step}</span>
            {index < steps.length - 1 ? (
              <span className="kpi-solutions-connect-arrow" aria-hidden="true">
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <p className="kpi-solutions-connect-note">{copy.note}</p>
    </aside>
  );
}
