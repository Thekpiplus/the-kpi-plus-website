import { insightTopicId, type InsightPost } from "@/lib/insights";
import { insightCoverAlt, insightSampleLabel } from "@/lib/insights-media";
import type { Locale } from "@/lib/seo";

export function InsightCardPlaceholder({ post, locale }: { post: InsightPost; locale: Locale }) {
  const topic = insightTopicId(post) ?? "other";
  const sample = insightSampleLabel(locale);
  const category = post.category[locale];
  const latinCategory = !/[\u0E00-\u0E7F]/.test(category);

  // TODO: Replace the reserved 1200×675 card cover with a unique approved visual for this category. Do not use an AI face, a generic hotel room, or an image reused from another page.
  return (
    <div
      className={`kpi-insight-card-placeholder kpi-insight-card-placeholder--${topic}`}
      role="img"
      aria-label={insightCoverAlt(post, locale)}
    >
      <span className={`kpi-insight-sample-label${locale === "th" ? "" : " kpi-latin"}`}>{sample}</span>
      <p className={`kpi-insight-card-placeholder-kicker${latinCategory ? " kpi-latin" : ""}`}>{category}</p>
      <div className="kpi-insight-card-placeholder-marks" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
