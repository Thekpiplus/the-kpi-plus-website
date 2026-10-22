import { insightsIndexCopy, type InsightPost } from "@/lib/insights";
import { insightCoverAlt, insightSampleLabel } from "@/lib/insights-media";
import type { Locale } from "@/lib/seo";

const SEO_SEM_SLUG = "seo-vs-sem-for-hotels-which-one-should-you-focus-on";

/** Comparison from the article. No Google branding and no invented traffic numbers. */
const CHANNELS = [
  { id: "seo", name: "SEO", kind: "Organic Search", notes: ["Website", "Visibility"] },
  { id: "sem", name: "SEM", kind: "Paid Search", notes: ["Intent", "Conversion"] },
] as const;

export function InsightSeoSemVisual({ post, locale }: { post: InsightPost; locale: Locale }) {
  const t = insightsIndexCopy[locale];
  const sample = insightSampleLabel(locale);

  // TODO: Replace /images/insights-seo-sem-placeholder.webp with a unique approved 1200×675 Organic vs Paid Search comparison, search funnel, website traffic report, conversion-by-channel view, or a redacted search performance screenshot. No Google branding or search-result screenshots unless usage and data are approved. Do not invent traffic or conversion numbers. Do not use a hotel exterior as the only cover.
  if (post.slug !== SEO_SEM_SLUG) return null;

  return (
    <div className="kpi-insight-seo-sample" role="img" aria-label={insightCoverAlt(post, locale)}>
      <span className={`kpi-insight-sample-label${locale === "th" ? "" : " kpi-latin"}`}>{sample}</span>
      <p className="kpi-insight-seo-sample-kicker kpi-latin">{t.seoSampleKicker}</p>
      <ul className="kpi-insight-seo-compare kpi-latin" aria-hidden="true">
        {CHANNELS.map((channel) => (
          <li key={channel.id}>
            <span className="kpi-insight-seo-compare-name">{channel.name}</span>
            <span className="kpi-insight-seo-compare-kind">{channel.kind}</span>
            {channel.notes.map((note) => (
              <span key={note} className="kpi-insight-seo-compare-note">
                {note}
              </span>
            ))}
          </li>
        ))}
      </ul>
      <p className={`kpi-insight-seo-sample-note${locale === "th" ? "" : " kpi-latin"}`}>
        {`${t.sampleVisual} · ${t.sampleNotClient}`}
      </p>
    </div>
  );
}
