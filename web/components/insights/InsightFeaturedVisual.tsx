import { InsightMediaFrame } from "@/components/insights/InsightMediaFrame";
import { insightsIndexCopy, type InsightPost } from "@/lib/insights";
import { insightCoverAlt, resolveInsightMedia } from "@/lib/insights-media";
import type { Locale } from "@/lib/seo";

const REVENUE_FEATURED_SLUG = "hotel-revenue-meetings-that-lead-to-decisions";

function latinLabel(label: string, isTh: boolean) {
  return !isTh || !/[\u0E00-\u0E7F]/.test(label);
}

function RevenueReviewSample({ locale, alt }: { locale: Locale; alt: string }) {
  const t = insightsIndexCopy[locale];
  const isTh = locale === "th";
  const rows = [
    t.featuredSampleSignal,
    t.featuredSampleDecision,
    t.featuredSampleOwner,
    t.featuredSampleReview,
  ];

  return (
    <div className="kpi-insight-review-sample" role="img" aria-label={alt}>
      <span className={`kpi-insight-review-sample-badge${isTh ? "" : " kpi-latin"}`}>{t.sampleVisual}</span>
      <p className="kpi-insight-review-sample-kicker kpi-latin">{t.featuredSampleKicker}</p>
      <ul className="kpi-insight-review-sample-grid">
        {rows.map((label) => (
          <li key={label}>
            <span className={latinLabel(label, isTh) ? "kpi-latin" : undefined}>{label}</span>
            <span className="kpi-insight-review-sample-rule" aria-hidden="true" />
          </li>
        ))}
      </ul>
      <p className={`kpi-insight-review-sample-note${isTh ? "" : " kpi-latin"}`}>
        {`${t.sampleVisual} · ${t.sampleNotClient}`}
      </p>
    </div>
  );
}

export function InsightFeaturedVisual({ post, locale }: { post: InsightPost; locale: Locale }) {
  const t = insightsIndexCopy[locale];
  const media = resolveInsightMedia(post, "featured");
  const isRevenue = post.slug === REVENUE_FEATURED_SLUG;
  const alt = insightCoverAlt(post, locale);
  const sampleBadge = `${t.sampleVisual} · ${t.sampleNotClient}`;
  const caption = isRevenue ? t.featuredCaption : null;

  return (
    <figure className="kpi-insight-featured-figure">
      {media.hasAsset ? (
        <InsightMediaFrame
          src={media.src}
          alt={alt}
          label={locale === "th" ? media.slot.label.th : media.slot.label.en}
          locale={locale}
          fit={media.fit}
          status={media.status}
          displayWidth={media.displayWidth}
          displayHeight={media.displayHeight}
          sourceWidth={media.sourceWidth}
          sourceHeight={media.sourceHeight}
          lazy={false}
          priority
          className="kpi-insight-featured-media"
          imageClassName="kpi-insight-featured-image"
          objectPosition={post.coverImagePosition}
          sampleLabel={media.showSampleLabel ? sampleBadge : undefined}
        />
      ) : isRevenue ? (
        <RevenueReviewSample locale={locale} alt={alt} />
      ) : (
        <InsightMediaFrame
          src=""
          alt={alt}
          label={locale === "th" ? media.slot.label.th : media.slot.label.en}
          locale={locale}
          fit={media.fit}
          status={media.status}
          displayWidth={media.displayWidth}
          displayHeight={media.displayHeight}
          sourceWidth={media.sourceWidth}
          sourceHeight={media.sourceHeight}
          lazy={false}
          priority
          className="kpi-insight-featured-media"
          imageClassName="kpi-insight-featured-image"
          sampleLabel={sampleBadge}
        />
      )}
      {caption ? <figcaption className="kpi-insight-featured-caption">{caption}</figcaption> : null}
    </figure>
  );
}
