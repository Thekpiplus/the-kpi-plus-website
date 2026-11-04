import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import { InsightCover } from "@/components/insights/InsightCover";
import {
  formatInsightDate,
  insightExcerpt,
  insightsIndexCopy,
  insightUpdatedAt,
  type InsightPost,
} from "@/lib/insights";
import type { Locale } from "@/lib/seo";

export function InsightRelatedCard({ post, locale }: { post: InsightPost; locale: Locale }) {
  const t = insightsIndexCopy[locale];
  const title = post.title[locale] || post.title.th;
  const category = post.category[locale] || post.category.th;
  const excerpt = insightExcerpt(post, locale);
  const updated = insightUpdatedAt(post);
  const dateIso = updated || post.publishedAt?.trim() || "";
  const dateLabel = updated ? t.updated : t.published;

  return (
    <article className="kpi-article-related-card">
      <Link href={post.href} className="kpi-article-related-card-link">
        <div className="kpi-article-related-cover">
          <InsightCover post={post} locale={locale} variant="related" />
        </div>
        <div className="kpi-article-related-card-body">
          <p className="kpi-article-related-category">{category}</p>
          <h3 className="kpi-article-related-card-title">{title}</h3>
          <p className="kpi-article-related-excerpt is-compact">{excerpt}</p>
          {dateIso ? (
            <p className="kpi-article-related-date">
              <span>{dateLabel}</span>{" "}
              <time dateTime={dateIso}>{formatInsightDate(dateIso, locale)}</time>
            </p>
          ) : null}
          <span className="kpi-article-related-read">
            {t.read}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}
