import { REVENUE_DECISION_FLOW_VISUAL, type DecisionStep } from "@/lib/revenue";
import "./revenue-commercial.css";

type DecisionFlowDiagramProps = {
  locale?: "th" | "en";
  src?: string;
  title?: string;
  description?: string;
  statusLabel?: string;
  steps: Pick<DecisionStep, "number" | "output">[];
};

const flowCopy = {
  th: {
    eyebrow: "DECISION FLOW",
    title: "โรงแรมจะได้รับอะไรในแต่ละขั้น",
    desc: "แต่ละขั้นส่งมอบผลงานที่โรงแรมนำไปใช้ต่อได้ จาก Revenue Snapshot ถึง KPI Review และ Next Action",
  },
  en: {
    eyebrow: "DECISION FLOW",
    title: "What the hotel receives after each stage",
    desc: "Each stage hands over a deliverable the hotel can use next, from a Revenue Snapshot to KPI Review and Next Action.",
  },
} as const;

export function DecisionFlowDiagram({
  locale = "en",
  src,
  title,
  description,
  statusLabel,
  steps,
}: DecisionFlowDiagramProps) {
  const ui = locale === "th" ? flowCopy.th : flowCopy.en;
  const hasAsset = Boolean(src?.trim());
  const label = statusLabel || REVENUE_DECISION_FLOW_VISUAL.label;
  const heading = title || ui.title;
  const desc = description || ui.desc;

  return (
    <figure className="decision-flow-card">
      <div className="decision-flow-card__header">
        <span className="decision-flow-card__eyebrow">{ui.eyebrow}</span>
        <h3>{heading}</h3>
      </div>

      {hasAsset ? (
        <div className="decision-flow-asset">
          <img
            src={src}
            alt={label}
            width={REVENUE_DECISION_FLOW_VISUAL.displayWidth}
            height={REVENUE_DECISION_FLOW_VISUAL.displayHeight}
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : (
        <ol className="decision-flow-list" aria-label={desc}>
          {steps.flatMap((step, index) => {
            const item = (
              <li key={step.number} className={`decision-flow-node decision-flow-node--${index + 1}`}>
                <span className="decision-flow-node__num">{step.number}</span>
                <strong className="decision-flow-node__out">{step.output}</strong>
              </li>
            );
            if (index === steps.length - 1) return [item];
            return [
              item,
              <li key={`${step.number}-arrow`} className="decision-flow-arrow" aria-hidden="true">
                →
              </li>,
            ];
          })}
        </ol>
      )}
      <figcaption className="decision-flow-card__status">{label}</figcaption>
    </figure>
  );
}
