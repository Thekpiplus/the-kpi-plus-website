import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import { InsightArticleMeta } from "@/components/insights/InsightArticleMeta";
import { InsightCover } from "@/components/insights/InsightCover";
import { insightExcerpt, insightsIndexCopy, type InsightPost } from "@/lib/insights";
import type { Locale } from "@/lib/seo";

export function InsightArticleCard({ post, locale }: { post: InsightPost; locale: Locale }) {
  const t = insightsIndexCopy[locale];
  const category = post.category[locale];
  const latinCategory = !/[\u0E00-\u0E7F]/.test(category);
  const titleId = `insight-card-title-${post.slug}`;

  return (
    <article className="kpi-insight-card">
      <Link href={post.href} className="kpi-insight-card-link" aria-labelledby={titleId}>
        <InsightCover post={post} locale={locale} />
        <div className="kpi-insight-card-body">
          <p className={`kpi-insight-category${latinCategory ? " kpi-latin" : ""}`}>{category}</p>
          <h3 id={titleId} className="kpi-insight-card-title">
            {post.title[locale]}
          </h3>
          <p className="kpi-insight-summary">{insightExcerpt(post, locale)}</p>
          <InsightArticleMeta post={post} locale={locale} />
          <span className="kpi-insight-read kpi-insight-read-quiet">
            {t.read} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  );
}
