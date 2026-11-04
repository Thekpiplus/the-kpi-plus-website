import {
  formatInsightDate,
  insightAuthor,
  insightUpdatedAt,
  insightsIndexCopy,
  type InsightPost,
} from "@/lib/insights";
import type { Locale } from "@/lib/seo";

export function InsightArticleMeta({
  post,
  locale,
  showAuthor = true,
  showPublishedLabel = false,
}: {
  post: InsightPost;
  locale: Locale;
  showAuthor?: boolean;
  showPublishedLabel?: boolean;
}) {
  const t = insightsIndexCopy[locale];
  const updatedAt = insightUpdatedAt(post);
  const author = showAuthor ? insightAuthor(post, locale) : "";
  const role = author && post.authorRole?.trim() ? post.authorRole.trim() : "";
  const reviewer = post.reviewerName?.trim() || "";

  const minutes = post.readingTimeMinutes > 0 ? post.readingTimeMinutes : 0;

  return (
    <p className="kpi-insight-meta">
      {showPublishedLabel ? (
        <span>
          {t.published} <time dateTime={post.publishedAt}>{formatInsightDate(post.publishedAt, locale)}</time>
        </span>
      ) : (
        <time dateTime={post.publishedAt}>{formatInsightDate(post.publishedAt, locale)}</time>
      )}
      {updatedAt ? (
        <>
          <span aria-hidden="true"> · </span>
          <span>
            {t.updated} <time dateTime={updatedAt}>{formatInsightDate(updatedAt, locale)}</time>
          </span>
        </>
      ) : null}
      {minutes ? (
        <>
          <span aria-hidden="true"> · </span>
          <span>{`${minutes} ${t.minutes}`}</span>
        </>
      ) : null}
      {author ? (
        <>
          <span aria-hidden="true"> · </span>
          <span>
            {author}
            {role ? ` · ${role}` : ""}
          </span>
        </>
      ) : null}
      {reviewer ? (
        <>
          <span aria-hidden="true"> · </span>
          <span>
            {t.reviewedBy} {reviewer}
          </span>
        </>
      ) : null}
    </p>
  );
}
