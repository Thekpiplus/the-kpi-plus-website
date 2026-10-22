import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { SiteShell } from "@/components/SiteShell";
import { InsightArticleCard } from "@/components/insights/InsightArticleCard";
import { InsightFeaturedVisual } from "@/components/insights/InsightFeaturedVisual";
import { InsightsTopicNav } from "@/components/insights/InsightsTopicNav";
import { InsightArticleMeta } from "@/components/insights/InsightArticleMeta";
import {
  INSIGHT_PAGE_SIZE,
  INSIGHT_SEARCH_MIN,
  insightAuthor,
  insightExcerpt,
  insightIndexHref,
  insightPosts,
  insightsIndexCopy,
  isPublishedInsight,
  parseInsightPage,
  parseInsightQuery,
  parseInsightSort,
  parseInsightTopic,
  postsForInsightTopic,
  postsMatchingInsightQuery,
  sortInsightPosts,
  type InsightPost,
} from "@/lib/insights";
import { getStoredInsightOrder, resolveInsightOrder, sortByInsightOrder } from "@/lib/cms/insight-order";
import { hiddenInsightSlugs } from "@/lib/cms/queries";
import { blogSchema } from "@/lib/schema";
import { auditHref, localizePath, SITE, type Locale } from "@/lib/seo";

function FeaturedMeta({
  post,
  locale,
}: {
  post: InsightPost;
  locale: Locale;
}) {
  const t = insightsIndexCopy[locale];
  const author = insightAuthor(post, locale);
  const role = author && post.authorRole?.trim() ? post.authorRole.trim() : "";
  return (
    <div className="kpi-insight-featured-meta">
      {author ? (
        <p className="kpi-insight-featured-byline">
          {t.byline} {author}
          {role ? ` · ${role}` : ""}
        </p>
      ) : null}
      <InsightArticleMeta post={post} locale={locale} showAuthor={false} showPublishedLabel />
    </div>
  );
}

export async function InsightsIndexView({
  locale,
  extraPosts = [],
  topic,
  sort,
  q,
  page,
}: {
  locale: Locale;
  extraPosts?: InsightPost[];
  topic?: string;
  sort?: string;
  q?: string;
  page?: string;
}) {
  const t = insightsIndexCopy[locale];
  const isTh = locale === "th";
  const insightsHref = localizePath("/insights", locale);
  const activeTopic = parseInsightTopic(topic);
  const activeSort = parseInsightSort(sort);
  const query = parseInsightQuery(q);
  const activePage = parseInsightPage(page);
  const hidden = new Set(await hiddenInsightSlugs());
  const bySlug = new Map(insightPosts.map((post) => [post.slug, post]));
  for (const post of extraPosts) bySlug.set(post.slug, post);
  const visible = [...bySlug.values()].filter((post) => isPublishedInsight(post) && !hidden.has(post.slug));
  const storedOrder = await getStoredInsightOrder();
  const editorial =
    storedOrder.length > 0
      ? sortByInsightOrder(visible, await resolveInsightOrder(visible.map((post) => post.slug)))
      : [...visible].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const scoped = sortInsightPosts(
    postsMatchingInsightQuery(postsForInsightTopic(editorial, activeTopic), query, locale),
    activeSort,
  );
  const showSearch = visible.length >= INSIGHT_SEARCH_MIN || Boolean(query);
  const showFeatured = activeSort === "relevant" && activeTopic === "all" && !query && activePage === 1;
  const featured = showFeatured
    ? storedOrder.length > 0
      ? scoped[0]
      : (scoped.find((post) => post.isFeatured) ?? scoped[0])
    : null;
  const rest = featured ? scoped.filter((post) => post.slug !== featured.slug) : scoped;
  const listing = rest.slice(0, activePage * INSIGHT_PAGE_SIZE);
  const hasMore = listing.length < rest.length;
  const emptyMessage = query ? t.emptySearch : t.emptyTopic;
  const clearHref = insightIndexHref(insightsHref);

  return (
    <SiteShell locale={locale} route={insightsHref}>
      <JsonLd
        data={blogSchema(editorial, `${SITE}${insightsHref === "/" ? "" : insightsHref}`, t.title, t.lead, locale)}
      />

      <header className="kpi-insight-index-header">
        <div className="kpi-wrap">
          <p className={`kpi-insight-index-eyebrow${isTh ? "" : " kpi-latin"}`}>{t.eyebrow}</p>
          <h1 className="kpi-h1 kpi-insight-index-title">{t.title}</h1>
          <p className="kpi-insight-index-lead">{t.lead}</p>
          <InsightsTopicNav
            locale={locale}
            insightsHref={insightsHref}
            activeTopic={activeTopic}
            sort={activeSort}
            q={query}
            showSearch={showSearch}
          />
        </div>
      </header>

      <div id="insight-feed" aria-live="polite">
      {featured ? (
        <section className="kpi-insight-index-block kpi-insight-index-featured" aria-labelledby="insight-featured-heading">
          <div className="kpi-wrap">
            <h2 id="insight-featured-heading" className={`kpi-insight-index-kicker${isTh ? "" : " kpi-latin"}`}>
              {t.featured}
            </h2>
            <article className="kpi-insight-featured">
              <Link
                href={featured.href}
                className="kpi-insight-featured-link"
                aria-labelledby="insight-featured-title"
              >
                <InsightFeaturedVisual post={featured} locale={locale} />
                <div className="kpi-insight-featured-body">
                  <p className="kpi-insight-category">{featured.category[locale]}</p>
                  <h3 id="insight-featured-title" className="kpi-insight-featured-title">
                    {featured.title[locale]}
                  </h3>
                  <p className="kpi-insight-summary kpi-insight-featured-summary">{insightExcerpt(featured, locale)}</p>
                  <FeaturedMeta post={featured} locale={locale} />
                  <span className="kpi-insight-read">
                    {t.read} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </article>
          </div>
        </section>
      ) : null}

      {listing.length ? (
        <section className="kpi-insight-index-block kpi-insight-index-list" aria-labelledby="insight-list-heading">
          <div className="kpi-wrap">
            <h2
              id="insight-list-heading"
              className={
                featured
                  ? `kpi-insight-index-kicker${isTh ? "" : " kpi-latin"}`
                  : "sr-only"
              }
            >
              {featured ? t.more : t.insights}
            </h2>
            <div className="kpi-insight-grid">
              {listing.map((post) => (
                <InsightArticleCard key={post.href} post={post} locale={locale} />
              ))}
            </div>
            {hasMore ? (
              <p className="kpi-insight-load-more">
                <Link
                  href={insightIndexHref(insightsHref, {
                    topic: activeTopic,
                    sort: activeSort,
                    q: query,
                    page: activePage + 1,
                  })}
                  scroll={false}
                  className="kpi-insight-load-more-link"
                >
                  {t.loadMore}
                </Link>
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      {!featured && !listing.length ? (
        <div className="kpi-insight-topic-empty">
          <div className="kpi-wrap">
            <p>{emptyMessage}</p>
            {activeTopic !== "all" || query || activeSort !== "relevant" ? (
              <p className="kpi-insight-topic-empty-action">
                <Link href={clearHref} scroll={false}>
                  {t.all}
                </Link>
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
      </div>

      <section className="kpi-insight-index-cta" aria-labelledby="insight-cta-heading">
        <div className="kpi-wrap kpi-insight-index-cta-inner">
          <h2 id="insight-cta-heading" className="kpi-h2 kpi-insight-cta-title">
            {t.indexCtaTitle}
          </h2>
          <p className="kpi-insight-cta-body">{t.indexCtaBody}</p>
          <ul className="kpi-insight-index-cta-points">
            {t.indexCtaPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <Link href={auditHref(locale)} className="kpi-button">
            {t.cta} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
