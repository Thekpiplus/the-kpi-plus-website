import { InsightCardPlaceholder } from "@/components/insights/InsightCardPlaceholder";
import { InsightDirectBookingVisual } from "@/components/insights/InsightDirectBookingVisual";
import { InsightHotelAiVisual } from "@/components/insights/InsightHotelAiVisual";
import { InsightHotelMarketingVisual } from "@/components/insights/InsightHotelMarketingVisual";
import { InsightSeoSemVisual } from "@/components/insights/InsightSeoSemVisual";
import { InsightMediaFrame } from "@/components/insights/InsightMediaFrame";
import { insightCoverAlt, resolveInsightMedia, type InsightMediaVariant } from "@/lib/insights-media";
import type { InsightPost } from "@/lib/insights";
import type { Locale } from "@/lib/seo";

const HOTEL_MARKETING_SLUG = "hotel-marketing";
const DIRECT_BOOKING_SLUG = "direct-booking-journey-audit";
const HOTEL_AI_SLUG = "hotel-technology-adoption-commercial-project";
const SEO_SEM_SLUG = "seo-vs-sem-for-hotels-which-one-should-you-focus-on";

export function InsightCover({
  post,
  locale,
  variant = "card",
}: {
  post: InsightPost;
  locale: Locale;
  variant?: InsightMediaVariant;
}) {
  const media = resolveInsightMedia(post, variant);
  const copy = locale === "th" ? media.slot.label.th : media.slot.label.en;
  const isCard = variant === "card";
  const isRelated = variant === "related";
  const useCompactCover = isCard || isRelated;

  const useHotelMarketingDiagram =
    post.slug === HOTEL_MARKETING_SLUG &&
    !(media.hasAsset && (post.coverImageStatus === "approved" || post.coverImageStatus === "real"));

  if (useHotelMarketingDiagram) {
    return <InsightHotelMarketingVisual post={post} locale={locale} variant={variant} />;
  }

  if (useCompactCover && !media.hasAsset) {
    if (post.slug === DIRECT_BOOKING_SLUG) {
      return <InsightDirectBookingVisual post={post} locale={locale} />;
    }
    if (post.slug === HOTEL_AI_SLUG) {
      return <InsightHotelAiVisual post={post} locale={locale} />;
    }
    if (post.slug === SEO_SEM_SLUG) {
      return <InsightSeoSemVisual post={post} locale={locale} />;
    }
    return <InsightCardPlaceholder post={post} locale={locale} />;
  }

  return (
    <InsightMediaFrame
      src={media.src}
      alt={insightCoverAlt(post, locale)}
      label={copy}
      locale={locale}
      fit={media.fit}
      status={media.status}
      displayWidth={media.displayWidth}
      displayHeight={media.displayHeight}
      sourceWidth={useCompactCover ? (isRelated ? 1200 : 1200) : media.sourceWidth}
      sourceHeight={useCompactCover ? (isRelated ? 800 : 675) : media.sourceHeight}
      lazy={variant !== "featured"}
      priority={variant === "featured"}
      fill={useCompactCover}
      className={
        isRelated ? "kpi-insight-related-media" : isCard ? "kpi-insight-card-media" : "kpi-insight-featured-media"
      }
      imageClassName={
        isRelated ? "kpi-insight-related-image" : isCard ? "kpi-insight-card-image" : "kpi-insight-featured-image"
      }
      objectPosition={post.coverImagePosition}
    />
  );
}
