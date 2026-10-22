import { insightsIndexCopy, type InsightPost } from "@/lib/insights";
import { insightCoverAlt, insightSampleLabel } from "@/lib/insights-media";
import type { Locale } from "@/lib/seo";

const DIRECT_BOOKING_SLUG = "direct-booking-journey-audit";

/** Guest path named in the article brief. No conversion rates or client results. */
const JOURNEY_STEPS = ["Search", "Website", "Booking"] as const;

export function InsightDirectBookingVisual({ post, locale }: { post: InsightPost; locale: Locale }) {
  const t = insightsIndexCopy[locale];
  const sample = insightSampleLabel(locale);

  // TODO: Replace /images/insights-direct-booking-placeholder.webp with a unique approved 1200×675 website booking engine, traffic-to-booking funnel, Search → Website → Booking flow, conversion report, or hotel manager reviewing website performance. Redact booking IDs, guest names, emails, payment details, and private analytics. Do not use a generic person at a laptop without a visible booking context. Keep the sample label until the screenshot is approved for publication.
  if (post.slug !== DIRECT_BOOKING_SLUG) return null;

  return (
    <div className="kpi-insight-booking-sample" role="img" aria-label={insightCoverAlt(post, locale)}>
      <span className={`kpi-insight-sample-label${locale === "th" ? "" : " kpi-latin"}`}>{sample}</span>
      <p className="kpi-insight-booking-sample-kicker kpi-latin">{t.bookingSampleKicker}</p>
      <ol className="kpi-insight-booking-flow kpi-latin" aria-hidden="true">
        {JOURNEY_STEPS.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>
      <p className={`kpi-insight-booking-sample-note${locale === "th" ? "" : " kpi-latin"}`}>
        {`${t.sampleVisual} · ${t.sampleNotClient}`}
      </p>
    </div>
  );
}
