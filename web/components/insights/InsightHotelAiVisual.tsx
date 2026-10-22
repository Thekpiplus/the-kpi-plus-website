import { insightsIndexCopy, type InsightPost } from "@/lib/insights";
import { insightCoverAlt, insightSampleLabel } from "@/lib/insights-media";
import type { Locale } from "@/lib/seo";

const HOTEL_AI_SLUG = "hotel-technology-adoption-commercial-project";

/** Practical workflow from the brief. No robots, holograms, or performance claims. */
const WORKFLOW_STEPS = [
  { id: "input", label: "Input", human: false },
  { id: "ai", label: "AI", human: false },
  { id: "review", label: "Review", human: true },
  { id: "decision", label: "Decision", human: true },
] as const;

export function InsightHotelAiVisual({ post, locale }: { post: InsightPost; locale: Locale }) {
  const t = insightsIndexCopy[locale];
  const sample = insightSampleLabel(locale);

  // TODO: Replace /images/insights-hotel-ai-workflow-placeholder.webp with a unique approved 1200×675 visual of a person reviewing an AI-assisted hotel analysis, a redacted AI report screenshot, hotel staff using a data tool, or this Input → AI → Human review → Decision workflow. No robots, circuit-heads, holographic cities, neon brains, futuristic blue/purple UIs, or glowing networks. Do not claim AI replaces the hotel team.
  if (post.slug !== HOTEL_AI_SLUG) return null;

  return (
    <div className="kpi-insight-ai-sample" role="img" aria-label={insightCoverAlt(post, locale)}>
      <span className={`kpi-insight-sample-label${locale === "th" ? "" : " kpi-latin"}`}>{sample}</span>
      <p className="kpi-insight-ai-sample-kicker kpi-latin">{t.aiSampleKicker}</p>
      <ol className="kpi-insight-ai-flow kpi-latin" aria-hidden="true">
        {WORKFLOW_STEPS.map((step) => (
          <li key={step.id} className={step.human ? "is-human" : undefined}>
            {step.label}
          </li>
        ))}
      </ol>
      <p className={`kpi-insight-ai-sample-context${locale === "th" ? "" : " kpi-latin"}`}>
        {`${t.aiContext} · ${t.sampleNotClient}`}
      </p>
    </div>
  );
}
