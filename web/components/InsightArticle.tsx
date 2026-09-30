import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { SiteShell } from "@/components/SiteShell";
import type { HandoffBlock } from "@/lib/handoff";
import {
  formatInsightDate,
  insightBody,
  insightHeadingId,
  insightsIndexCopy,
  relatedInsights,
  type InsightPost,
} from "@/lib/insights";
import { relatedServiceLinks } from "@/lib/insight-links";
import { articleSchema } from "@/lib/schema";
import { auditHref, homeHref, htmlLang, localizePath, resolvePageHref, SITE, type Locale } from "@/lib/seo";

function ArticleBlocks({ blocks, locale }: { blocks: HandoffBlock[]; locale: Locale }) {
  return (
    <div className="kpi-article-prose">
      {blocks.map((block, index) => {
        if (block.type === "h1") return null;
        if (block.type === "h2") {
          return (
            <h2 key={`${block.text}-${index}`} id={insightHeadingId(block.text)}>
              {block.text}
            </h2>
          );
        }
        if (block.type === "h3") {
          return (
            <h3 key={`${block.text}-${index}`} id={insightHeadingId(block.text)}>
              {block.text}
            </h3>
          );
        }
        if (block.type === "p") {
          return <p key={`${block.text}-${index}`}>{block.text}</p>;
        }
        if (block.type === "image") {
          return (
            <figure key={block.src}>
              <img
                src={block.src}
                alt={block.alt || ""}
                width={1200}
                height={750}
                sizes="(max-width: 48rem) 100vw, min(70rem, 100vw)"
                loading="lazy"
                decoding="async"
              />
              {block.alt ? <figcaption className="sr-only">{block.alt}</figcaption> : null}
            </figure>
          );
        }
        if (block.type === "link") {
          const href = resolvePageHref(block.href, locale);
          if (!href) return null;
          const external = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
          return external ? (
            <a key={`${href}-${index}`} href={href} className="kpi-article-inline-link">
              {block.text}
            </a>
          ) : (
            <Link key={`${href}-${index}`} href={href} className="kpi-article-inline-link">
              {block.text}
            </Link>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={`list-${index}`}>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "table") {
          return (
            <div key={`table-${index}`} className="kpi-article-table-wrap">
              <table>
                <thead>
                  <tr>
                    {block.headers.map((header) => (
                      <th key={header} scope="col">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row) => (
                    <tr key={row.join("|")}>
                      {row.map((cell, cellIndex) => (
                        <td key={`${cell}-${cellIndex}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export function InsightArticle({
  post,
  blocks,
  locale = "th",
}: {
  post: InsightPost;
  blocks: HandoffBlock[];
  locale?: Locale;
}) {
  const t = insightsIndexCopy[locale];
  const body = insightBody(blocks);
  const related = relatedInsights(post.href, 4);
  const services = relatedServiceLinks(post.slug, locale);
  const insightsHref = localizePath("/insights", locale);
  const title = post.title[locale] || post.title.th;
  const description = post.description[locale] || post.description.th;
  const crumbs = [
    { name: t.home, href: homeHref(locale) },
    { name: t.insights, href: insightsHref },
    { name: title, href: post.href },
  ];
  const canonical = `${SITE}${post.href}`;
  const headings = body.filter((block) => block.type === "h2");
  const showToc = post.minutes >= 8 || headings.length >= 7;
  const updated = post.modified !== post.published;

  return (
    <SiteShell locale={locale} route={post.href}>
      <JsonLd data={articleSchema(post, canonical, locale)} />

      <article className="kpi-article" lang={htmlLang(locale)}>
        <header className="kpi-article-header">
          <nav aria-label="Breadcrumb" className="kpi-article-crumb">
            <ol>
              {crumbs.map((crumb, index) => (
                <li key={crumb.href}>
                  {index > 0 ? <span aria-hidden="true"> / </span> : null}
                  {index === crumbs.length - 1 ? (
                    <span>{crumb.name}</span>
                  ) : (
                    <Link href={crumb.href}>{crumb.name}</Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <p className="kpi-insight-category">{post.category[locale]}</p>
          <h1>{title}</h1>
          <p className="kpi-article-lead">{description}</p>
          <p className="kpi-insight-meta">
            <Link href={localizePath("/about", locale)}>{t.author}</Link>
            <span aria-hidden="true"> · </span>
            <time dateTime={post.published}>{formatInsightDate(post.published, locale)}</time>
            {updated ? (
              <>
                <span aria-hidden="true"> · </span>
                <span>
                  {t.updated} <time dateTime={post.modified}>{formatInsightDate(post.modified, locale)}</time>
                </span>
              </>
            ) : null}
            <span aria-hidden="true"> · </span>
            <span>{`${post.minutes} ${t.minutes}`}</span>
          </p>
        </header>

        <figure className="kpi-article-hero">
          <img
            src={post.image}
            alt={post.imageAlt}
            width={1200}
            height={750}
            sizes="(max-width: 48rem) 100vw, min(70rem, 100vw)"
            fetchPriority="high"
            decoding="async"
            style={post.imagePosition ? { objectPosition: post.imagePosition } : undefined}
          />
        </figure>

        <div className="kpi-article-main">
          {showToc ? (
            <nav className="kpi-article-toc" aria-labelledby="article-toc">
              <p id="article-toc">{t.toc}</p>
              <ol>
                {headings.map((heading) =>
                  heading.type === "h2" ? (
                    <li key={heading.text}>
                      <a href={`#${insightHeadingId(heading.text)}`}>{heading.text}</a>
                    </li>
                  ) : null,
                )}
              </ol>
            </nav>
          ) : null}

          <ArticleBlocks blocks={body} locale={locale} />

          {services.length ? (
            <aside className="kpi-article-services">
              <h2>{t.services}</h2>
              <ul>
                {services.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}

          <aside className="kpi-insight-index-cta kpi-article-cta">
            <h2 className="kpi-insight-cta-title">{t.ctaTitle}</h2>
            <p className="kpi-insight-cta-body">{t.ctaBody}</p>
            <Link href={auditHref(locale)} className="kpi-button">
              {t.cta}
            </Link>
          </aside>
        </div>
      </article>

      <section className="kpi-article-related" aria-labelledby="related-insights">
        <div className="kpi-article-related-inner">
          <div className="kpi-article-related-top">
            <h2 id="related-insights">{t.related}</h2>
            <Link href={insightsHref}>{t.all}</Link>
          </div>
          <div className="kpi-insight-grid">
            {related.map((item) => (
              <article key={item.href} className="kpi-insight-card">
                <Link href={item.href} className="kpi-insight-card-link">
                  <div className="kpi-insight-card-body">
                    <p className="kpi-insight-category">{item.category[locale]}</p>
                    <h3 className="kpi-insight-card-title">{item.title[locale]}</h3>
                    <p className="kpi-insight-summary">{item.description[locale]}</p>
                    <p className="kpi-insight-read-quiet">{t.read}</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
