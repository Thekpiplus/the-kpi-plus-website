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
import { getStoredInsightOrder, resolveInsightOrder, sortByInsightOrder } from "@/lib/cms/insight-order";
import { hiddenInsightSlugs } from "@/lib/cms/queries";
import { blogSchema } from "@/lib/schema";
import { auditHref, localizePath, SITE, type Locale } from "@/lib/seo";

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

export async function InsightsIndexView({ locale, extraPosts = [] }: { locale: Locale; extraPosts?: InsightPost[] }) {
  const t = insightsIndexCopy[locale];
  const isTh = locale === "th";
  const insightsHref = localizePath("/insights", locale);
  const hidden = new Set(await hiddenInsightSlugs());
  const bySlug = new Map(insightPosts.map((post) => [post.slug, post]));
  for (const post of extraPosts) bySlug.set(post.slug, post);
  const visible = [...bySlug.values()].filter((post) => !hidden.has(post.slug));
  const storedOrder = await getStoredInsightOrder();
  const posts =
    storedOrder.length > 0
      ? sortByInsightOrder(visible, await resolveInsightOrder(visible.map((post) => post.slug)))
      : [...visible].sort((a, b) => b.published.localeCompare(a.published));
  const featured =
    storedOrder.length > 0
      ? posts[0]
      : (posts.find((post) => post.slug === FEATURED_INSIGHT_SLUG) ?? posts[0]);
  const listing = posts.filter((post) => post.slug !== featured?.slug);

  return (
    <SiteShell locale={locale} route={insightsHref}>
      <JsonLd
        data={blogSchema(posts, `${SITE}${insightsHref === "/" ? "" : insightsHref}`, t.title, t.lead, locale)}
      />

      <header className="kpi-insight-index-header">
        <div className="kpi-wrap">
          <p className={`kpi-insight-index-eyebrow${isTh ? "" : " kpi-latin"}`}>{t.eyebrow}</p>
          <h1 className="kpi-h1 kpi-insight-index-title">{t.title}</h1>
          <p className="kpi-insight-index-lead">{t.lead}</p>
        </div>
      </header>

      {featured ? (
        <section className="kpi-insight-index-block kpi-insight-index-featured" aria-labelledby="insight-featured-heading">
          <div className="kpi-wrap">
            <h2 id="insight-featured-heading" className="sr-only">
              {t.featured}
            </h2>
            <article className="kpi-insight-featured">
              <Link href={featured.href} className="kpi-insight-featured-link">
                <div className="kpi-insight-featured-media">
                  <img
                    src={insightCardImage(featured)}
                    alt={featured.imageAlt}
                    width={960}
                    height={640}
                    className="kpi-insight-featured-image"
                  />
                </div>
                <div className="kpi-insight-featured-body">
                  <p className="kpi-insight-category">{featured.category[locale]}</p>
                  <h3 className="kpi-insight-featured-title">{featured.title[locale]}</h3>
                  <p className="kpi-insight-summary kpi-insight-featured-summary">{featured.description[locale]}</p>
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
                    <div className="kpi-insight-card-media">
                      <img
                        src={insightCardImage(post)}
                        alt={post.imageAlt}
                        width={640}
                        height={400}
                        loading="lazy"
                        decoding="async"
                        className="kpi-insight-card-image"
                      />
                    </div>
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
          <h2 id="insight-cta-heading" className="kpi-h2 kpi-insight-cta-title">
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
