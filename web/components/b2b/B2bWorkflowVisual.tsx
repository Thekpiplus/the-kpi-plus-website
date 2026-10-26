import { b2bSampleLabel } from "@/lib/b2b";
import type { Locale } from "@/lib/seo";
import "./b2b-ops.css";

const PHASES = ["Assess", "Evaluate", "Connect", "Sell", "Review"] as const;

export function B2bWorkflowVisual({
  locale,
  steps,
}: {
  locale: Locale;
  steps: Array<{ num: string; title: string }>;
}) {
  const sample = b2bSampleLabel(locale);
  const title = locale === "th" ? "ตัวอย่างลำดับงานกับโรงแรม" : "Sample hotel working sequence";

  return (
    <figure className="kpi-b2b-workflow-visual">
      <div className="b2b-ops-frame kpi-b2b-workflow-photo" aria-label={title}>
        <svg className="b2b-ops-svg" viewBox="0 0 720 360" width={720} height={360} role="img">
          <title>{title}</title>
          <rect width="720" height="360" fill="#0b1f33" />
          <text x="24" y="36" fill="#ebe722" fontSize="11" fontWeight="800" letterSpacing="1.4">
            SAMPLE WORKFLOW
          </text>
          {steps.slice(0, 5).map((step, index) => {
            const y = 58 + index * 58;
            return (
              <g key={step.num}>
                <circle cx="48" cy={y + 18} r="16" fill="#a2dc25" />
                <text x="48" y={y + 23} textAnchor="middle" fill="#1a3a02" fontSize="11" fontWeight="800">
                  {step.num}
                </text>
                <text x="80" y={y + 12} fill="rgba(247,251,255,0.55)" fontSize="11" fontWeight="700">
                  {PHASES[index]}
                </text>
                <text x="80" y={y + 34} fill="#f7fbff" fontSize="15" fontWeight="700">
                  {typeof step.title === "string" ? step.title : PHASES[index]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="b2b-ops-caption">
        <span className="b2b-ops-badge">{sample}</span> {title}
      </figcaption>
    </figure>
  );
}
