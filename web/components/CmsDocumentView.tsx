import { HandoffArticle } from "@/components/HandoffArticle";
import { InsightArticle } from "@/components/InsightArticle";
import { SiteShell } from "@/components/SiteShell";
import { parseCmsBody } from "@/lib/cms/body";
import { documentToInsight } from "@/lib/cms/public";
import type { CmsDocumentRow } from "@/lib/cms/types";
import type { HandoffBlock } from "@/lib/handoff";
import { localeFromPath, type Locale } from "@/lib/seo";

function publicPath(doc: CmsDocumentRow) {
  const slug = doc.slug.replace(/^\/+|\/+$/g, "");
  const bare = doc.kind === "insight" ? `/insights/${slug}` : `/${slug}`;
  if (doc.locale === "th") return bare;
  return `/${doc.locale}${bare}`;
}

export function CmsDocumentView({ doc }: { doc: CmsDocumentRow }) {
  const locale = (["th", "en", "ru", "zh"].includes(doc.locale) ? doc.locale : localeFromPath(publicPath(doc))) as Locale;
  const blocks = parseCmsBody(doc.body);
  if (doc.kind === "insight") {
    return <InsightArticle post={documentToInsight(doc)} blocks={blocks} locale={locale} />;
  }

  const withHero: HandoffBlock[] = blocks.some((block) => block.type === "h1")
    ? blocks
    : [{ type: "h1", text: doc.title }, ...(doc.excerpt ? [{ type: "p" as const, text: doc.excerpt }] : []), ...blocks];

  return (
    <SiteShell locale={locale} route={publicPath(doc)} title={doc.seoTitle || doc.title} description={doc.metaDescription || doc.excerpt}>
      <HandoffArticle blocks={withHero} locale={locale} />
    </SiteShell>
  );
}
