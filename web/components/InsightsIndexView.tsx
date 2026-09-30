import Link from "next/link";
import { ArrowUpRight } from "@/components/Icons";
import { JsonLd } from "@/components/JsonLd";
import { SiteShell } from "@/components/SiteShell";
import {
  FEATURED_INSIGHT_SLUG,
  formatInsightDate,
  insightCardImage,
  insightPosts,
  insightsIndexCopy,
  type InsightPost,
} from "@/lib/insights";
import { blogSchema } from "@/lib/schema";
import { auditHref, homeHref, localizePath, SITE, type Locale } from "@/lib/seo";

function PostMeta({
  post,
  locale,
  minutesLabel,
}: {
  post: InsightPost;
  locale: Locale;
  minutesLabel: string;
}) {
  return (
    <p className="kpi-insight-meta">
      <time dateTime={post.published}>{formatInsightDate(post.published, locale)}</time>
      <span aria-hidden="true"> · </span>
      <span>{`${post.minutes} ${minutesLabel}`}</span>
    </p>
  );
}

export function InsightsIndexView({ locale, extraPosts = [] }: { locale: Locale; extraPosts?: InsightPost[] }) {
  const t = insightsIndexCopy[locale];
  const insightsHref = localizePath("/insights", locale);
  const home = homeHref(locale);
  const posts = [...insightPosts, ...extraPosts.filter((post) => !insightPosts.some((item) => item.slug === post.slug))].sort((a, b) =>
    b.published.localeCompare(a.published),
  );
  const featured = posts.find((post) => post.slug === FEATURED_INSIGHT_SLUG) ?? posts[0];
  const listing = posts.filter((post) => post.slug !== featured.slug);

  return (
    <SiteShell locale={locale} route={insightsHref}>
      <JsonLd
        data={blogSchema(posts, `${SITE}${insightsHref === "/" ? "" : insightsHref}`, t.title, t.lead, locale)}
      />

      <header className="kpi-insight-index-header">
        <div className="kpi-wrap">
          <nav aria-label="Breadcrumb" className="text-sm text-[#555555]">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href={home} className="hover:text-[#0B6660]">
                  {t.home}
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                <span className="text-[#3B3B3B]">{t.insights}</span>
              </li>
            </ol>
          </nav>
          <h1 className="kpi-insight-index-title">{t.title}</h1>
          <p className="kpi-insight-index-lead">{t.lead}</p>
        </div>
      </header>

      {featured ? (
        <section className="kpi-insight-index-block" aria-labelledby="insight-featured-heading">
          <div className="kpi-wrap">
            <h2 id="insight-featured-heading" className="sr-only">
              {t.featured}
            </h2>
            <article className="kpi-insight-featured">
              <Link href={featured.href} className="kpi-insight-featured-link">
                <img
                  src={insightCardImage(featured)}
                  alt={featured.imageAlt}
                  width={960}
                  height={640}
                  className="kpi-insight-featured-image"
                />
                <div className="kpi-insight-featured-body">
                  <p className="kpi-insight-category">{featured.category[locale]}</p>
                  <h3 className="kpi-insight-featured-title">{featured.title[locale]}</h3>
                  <p className="kpi-insight-summary">{featured.description[locale]}</p>
                  <PostMeta post={featured} locale={locale} minutesLabel={t.minutes} />
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
            <h2 id="insight-list-heading" className="sr-only">
              {t.more}
            </h2>
            <div className="kpi-insight-grid">
              {listing.map((post) => (
                <article key={post.href} className="kpi-insight-card">
                  <Link href={post.href} className="kpi-insight-card-link">
                    <img
                      src={insightCardImage(post)}
                      alt={post.imageAlt}
                      width={640}
                      height={400}
                      loading="lazy"
                      decoding="async"
                      className="kpi-insight-card-image"
                    />
                    <div className="kpi-insight-card-body">
                      <p className="kpi-insight-category">{post.category[locale]}</p>
                      <h3 className="kpi-insight-card-title">{post.title[locale]}</h3>
                      <p className="kpi-insight-summary">{post.description[locale]}</p>
                      <PostMeta post={post} locale={locale} minutesLabel={t.minutes} />
                      <span className="kpi-insight-read kpi-insight-read-quiet">
                        {t.read} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="kpi-insight-index-cta" aria-labelledby="insight-cta-heading">
        <div className="kpi-wrap">
          <h2 id="insight-cta-heading" className="kpi-insight-cta-title">
            {t.ctaTitle}
          </h2>
          <p className="kpi-insight-cta-body">{t.ctaBody}</p>
          <Link href={auditHref(locale)} className="kpi-button">
            {t.cta} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
