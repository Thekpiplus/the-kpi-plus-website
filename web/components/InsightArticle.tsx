import Link from "next/link";
import type { ReactNode } from "react";
import { ArticleReadingProgress } from "@/components/ArticleReadingProgress";
import { ArticleToc } from "@/components/ArticleToc";
import { ArrowUpRight } from "@/components/Icons";
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

const EMPHASIS_TERMS = [
  "Revenue Management",
  "Google Business Profile",
  "Google Maps",
  "Google Search",
  "Google Ads",
  "Meta Ads",
  "Direct Booking",
  "Booking Engine",
  "Distribution",
  "Social Media",
  "Online Advertising",
  "Trust Signals",
  "Local Search",
  "Guest Experience",
  "Length of Stay",
  "Cancellation Rate",
  "Website Traffic",
  "Review Score",
  "Metasearch",
  "Travel Agents",
  "B2B Partners",
  "Hotel Marketing",
  "Visibility",
  "Interest",
  "Consideration",
  "Booking",
  "Revenue",
  "Occupancy",
  "RevPAR",
  "ROAS",
  "CRM",
  "OTA",
  "SEO",
  "ADR",
  "Meta",
];

function emphasizeTerms(text: string) {
  const pattern = new RegExp(`\\b(${EMPHASIS_TERMS.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`, "g");
  const parts: Array<string | { term: string }> = [];
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push({ term: match[0] });
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  if (parts.length <= 1 && typeof parts[0] === "string") return text;
  return parts.map((part, index) =>
    typeof part === "string" ? (
      <span key={`t-${index}`}>{part}</span>
    ) : (
      <strong key={`e-${index}`} className="kpi-article-term">
        {part.term}
      </strong>
    ),
  );
}

function isJourneyLine(text: string) {
  return text.includes("→") && text.split("→").length >= 3 && text.length < 120;
}

function isCompareHeading(text: string) {
  return /Revenue Management|ต่างกัน|versus|vs\.?/i.test(text);
}

function isStartHeading(text: string) {
  return /ควรเริ่ม|เริ่มทำการตลาด|where (should|to) (a )?hotel|where to begin|getting started checklist/i.test(text);
}

function isSummaryHeading(text: string) {
  return /สรุป|summary|conclusion/i.test(text);
}

function strategyParts(text: string) {
  const match = text.match(/^(\d+)\.\s+(.+)$/);
  if (!match) return null;
  return { num: match[1].padStart(2, "0"), title: match[2] };
}

function Paragraph({ text, className }: { text: string; className?: string }) {
  return <p className={className}>{emphasizeTerms(text)}</p>;
}

function ArticleBlocks({
  blocks,
  locale,
  takeawayLabel,
  leadText,
}: {
  blocks: HandoffBlock[];
  locale: Locale;
  takeawayLabel: string;
  leadText?: string;
}) {
  const firstH2 = blocks.findIndex((block) => block.type === "h2");
  const preface = firstH2 === -1 ? blocks : blocks.slice(0, firstH2);
  const rest = firstH2 === -1 ? [] : blocks.slice(firstH2);
  const nodes: ReactNode[] = [];

  if (preface.length) {
    const prefaceParagraphs = preface
      .filter((block): block is Extract<HandoffBlock, { type: "p" }> => block.type === "p")
      .filter((block) => !leadText || block.text.trim() !== leadText.trim());
    if (prefaceParagraphs.length) {
      nodes.push(
        <aside key="takeaway" className="kpi-article-takeaway">
          <p className="kpi-article-takeaway-label">{takeawayLabel}</p>
          {prefaceParagraphs.map((block, index) =>
            isJourneyLine(block.text) ? (
              <p key={`path-${index}`} className="kpi-article-path">
                {block.text}
              </p>
            ) : (
              <Paragraph key={`pre-p-${index}`} text={block.text} />
            ),
          )}
        </aside>,
      );
    }

    preface.forEach((block, index) => {
      if (block.type === "list") {
        const signature = block.items.join("|");
        const duplicatedLater = rest.some(
          (later) => later.type === "list" && later.items.join("|") === signature,
        );
        if (duplicatedLater) return;
        const headingTexts = new Set(
          rest.filter((later): later is Extract<HandoffBlock, { type: "h2" }> => later.type === "h2").map((later) => later.text),
        );
        const looksLikeMiniToc = block.items.every((item) => headingTexts.has(item));
        if (looksLikeMiniToc) return;
        nodes.push(
          <ul key={`pre-list-${index}`}>
            {block.items.map((item) => (
              <li key={item}>{emphasizeTerms(item)}</li>
            ))}
          </ul>,
        );
        return;
      }
      if (block.type !== "table") return;
      nodes.push(
        <div key={`pre-table-${index}`} className="kpi-article-table-wrap">
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
        </div>,
      );
    });
  }

  for (let index = 0; index < rest.length; index += 1) {
    const block = rest[index];
    if (block.type === "h2") {
      const id = insightHeadingId(block.text);
      nodes.push(
        <h2 key={`h2-${id}-${index}`} id={id}>
          {block.text}
        </h2>,
      );

      if (isCompareHeading(block.text)) {
        const paragraphs: Extract<HandoffBlock, { type: "p" }>[] = [];
        let cursor = index + 1;
        while (cursor < rest.length && rest[cursor].type === "p" && paragraphs.length < 2) {
          paragraphs.push(rest[cursor] as Extract<HandoffBlock, { type: "p" }>);
          cursor += 1;
        }
        if (paragraphs.length) {
          nodes.push(
            <div key={`compare-${index}`} className="kpi-article-compare">
              {paragraphs.map((paragraph, paragraphIndex) => (
                <Paragraph
                  key={`compare-p-${paragraphIndex}`}
                  text={paragraph.text}
                  className={paragraphIndex === paragraphs.length - 1 ? "kpi-article-compare-join" : undefined}
                />
              ))}
            </div>,
          );
          index = cursor - 1;
          continue;
        }
      }

      if (isStartHeading(block.text)) {
        let cursor = index + 1;
        if (rest[cursor]?.type === "p") {
          nodes.push(<Paragraph key={`start-intro-${index}`} text={(rest[cursor] as Extract<HandoffBlock, { type: "p" }>).text} />);
          cursor += 1;
        }
        const list = rest[cursor];
        if (list?.type === "list") {
          nodes.push(
            <ul key={`start-list-${index}`} className="kpi-article-checklist">
              {list.items.map((item, itemIndex) => (
                <li key={item}>
                  <span className="kpi-article-checklist-num">{String(itemIndex + 1).padStart(2, "0")}</span>
                  <span>{emphasizeTerms(item)}</span>
                </li>
              ))}
            </ul>,
          );
          index = cursor;
          continue;
        }
      }

      if (isSummaryHeading(block.text)) {
        const next = rest[index + 1];
        if (next?.type === "p") {
          nodes.push(
            <Paragraph key={`summary-lead-${index}`} text={next.text} className="kpi-article-summary-lead" />,
          );
          index += 1;
          continue;
        }
      }
      continue;
    }

    if (block.type === "h3") {
      const parts = strategyParts(block.text);
      const id = insightHeadingId(block.text);
      if (parts) {
        nodes.push(
          <div key={`strategy-${id}-${index}`} className="kpi-article-strategy" id={id}>
            <p className="kpi-article-strategy-num">{parts.num}</p>
            <h3>{parts.title}</h3>
          </div>,
        );
      } else {
        nodes.push(
          <h3 key={`h3-${id}-${index}`} id={id}>
            {block.text}
          </h3>,
        );
      }
      continue;
    }

    if (block.type === "p") {
      if (isJourneyLine(block.text)) {
        nodes.push(
          <p key={`path-${index}`} className="kpi-article-path">
            {block.text}
          </p>,
        );
      } else {
        nodes.push(<Paragraph key={`p-${index}`} text={block.text} />);
      }
      continue;
    }

    if (block.type === "image") {
      nodes.push(
        <figure key={block.src}>
          <img
            src={block.src}
            alt={block.alt || ""}
            width={1200}
            height={750}
            sizes="(max-width: 48rem) 100vw, min(45rem, 100vw)"
            loading="lazy"
            decoding="async"
          />
          {block.alt ? <figcaption className="sr-only">{block.alt}</figcaption> : null}
        </figure>,
      );
      continue;
    }

    if (block.type === "link") {
      const href = resolvePageHref(block.href, locale);
      if (!href) continue;
      const external = href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:");
      nodes.push(
        external ? (
          <a key={`${href}-${index}`} href={href} className="kpi-article-inline-link">
            {block.text}
          </a>
        ) : (
          <Link key={`${href}-${index}`} href={href} className="kpi-article-inline-link">
            {block.text}
          </Link>
        ),
      );
      continue;
    }

    if (block.type === "list") {
      nodes.push(
        <ul key={`list-${index}`}>
          {block.items.map((item) => (
            <li key={item}>{emphasizeTerms(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (block.type === "table") {
      nodes.push(
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
        </div>,
      );
    }
  }

  return <div className="kpi-article-prose">{nodes}</div>;
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
  const headings = body.filter((block): block is Extract<HandoffBlock, { type: "h2" }> => block.type === "h2");
  const showToc = post.minutes >= 8 || headings.length >= 7;
  const updated = post.modified !== post.published;

  return (
    <SiteShell locale={locale} route={post.href}>
      <JsonLd data={articleSchema(post, canonical, locale)} />
      <ArticleReadingProgress />

      <article className="kpi-article" lang={htmlLang(locale)}>
        <div className={showToc ? "kpi-article-shell has-toc" : "kpi-article-shell"}>
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
              height={675}
              sizes="(max-width: 48rem) 100vw, min(46rem, 100vw)"
              fetchPriority="high"
              decoding="async"
              style={post.imagePosition ? { objectPosition: post.imagePosition } : undefined}
            />
          </figure>

          {showToc ? <ArticleToc headings={headings} label={t.toc} openLabel={t.tocOpen} /> : null}

          <div className="kpi-article-main">
            <div className="kpi-article-column">
              <ArticleBlocks blocks={body} locale={locale} takeawayLabel={t.takeaway} leadText={description} />

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

              <aside className="kpi-article-cta">
                <h2 className="kpi-insight-cta-title">{t.ctaTitle}</h2>
                <p className="kpi-insight-cta-body">{t.ctaBody}</p>
                <Link href={auditHref(locale)} className="kpi-button kpi-article-cta-btn">
                  {t.cta}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </aside>
            </div>
          </div>
        </div>
      </article>

      <section className="kpi-article-related" aria-labelledby="related-insights">
        <div className="kpi-article-related-inner">
          <div className="kpi-article-related-top">
            <h2 id="related-insights">{t.related}</h2>
            <Link href={insightsHref} className="kpi-article-related-all">
              {t.all}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          {related.length ? (
            <div className="kpi-article-related-layout">
              {related[0] ? (
                <article className="kpi-article-related-feature">
                  <Link href={related[0].href} className="kpi-article-related-link">
                    <p className="kpi-article-related-category">{related[0].category[locale]}</p>
                    <h3 className="kpi-article-related-feature-title">{related[0].title[locale]}</h3>
                    <p className="kpi-article-related-excerpt">{related[0].description[locale]}</p>
                    <span className="kpi-article-related-read">
                      {t.read}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </Link>
                </article>
              ) : null}

              {related.length > 1 ? (
                <div className="kpi-article-related-stack">
                  {related.slice(1).map((item) => (
                    <article key={item.href} className="kpi-article-related-item">
                      <Link href={item.href} className="kpi-article-related-link">
                        <p className="kpi-article-related-category">{item.category[locale]}</p>
                        <h3 className="kpi-article-related-item-title">{item.title[locale]}</h3>
                        <p className="kpi-article-related-excerpt is-compact">{item.description[locale]}</p>
                        <span className="kpi-article-related-read">
                          {t.read}
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                      </Link>
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
    </SiteShell>
  );
}
