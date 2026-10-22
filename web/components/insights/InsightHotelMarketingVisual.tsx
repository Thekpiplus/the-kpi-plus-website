import { insightsIndexCopy, type InsightPost } from "@/lib/insights";
import { insightCoverAlt, insightSampleLabel } from "@/lib/insights-media";
import type { Locale } from "@/lib/seo";

const HOTEL_MARKETING_SLUG = "hotel-marketing";

/** Stages as published in the article. Do not add invented metrics or channel logos. */
const FUNNEL_STEPS = ["Visibility", "Interest", "Consideration", "Booking"] as const;

export function InsightHotelMarketingVisual({ post, locale }: { post: InsightPost; locale: Locale }) {
  const t = insightsIndexCopy[locale];
  const sample = insightSampleLabel(locale);

  // TODO: Replace /images/insights-hotel-marketing-placeholder.webp with a unique approved 1200×675 campaign performance report, direct-booking funnel, content planning board, hotel website conversion view, or team planning a hotel marketing strategy. Redact client names, account IDs, emails, and confidential metrics. Do not use Google, Meta, Booking.com, Agoda, or Expedia logos without permission. Do not use a generic hotel room or exterior unless it shows a clear marketing context. Mark the asset as Sample Visual until the data is public.
  if (post.slug !== HOTEL_MARKETING_SLUG) return null;

  return (
    <div className="kpi-insight-marketing-sample" role="img" aria-label={insightCoverAlt(post, locale)}>
      <span className={`kpi-insight-sample-label${locale === "th" ? "" : " kpi-latin"}`}>{sample}</span>
      <p className="kpi-insight-marketing-sample-kicker kpi-latin">{t.marketingSampleKicker}</p>
      <ol className="kpi-insight-marketing-funnel kpi-latin" aria-hidden="true">
        {FUNNEL_STEPS.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <p className={`kpi-insight-marketing-sample-note${locale === "th" ? "" : " kpi-latin"}`}>
        {`${t.sampleVisual} · ${t.sampleNotClient}`}
      </p>
    </div>
  );
}
