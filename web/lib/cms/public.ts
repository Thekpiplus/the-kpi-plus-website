import { insightPosts, type InsightPost } from "@/lib/insights";
import { SITE, type Locale } from "@/lib/seo";
import { documentPath, estimateMinutes, parseCmsBody } from "./body";
import { publishedDocumentByPath, publishedDocuments } from "./queries";
import type { CmsDocumentRow } from "./types";

function localeCopy(value: string): Record<Locale, string> {
  return { th: value, en: value, ru: value, zh: value };
}

export function documentToInsight(doc: CmsDocumentRow): InsightPost {
  const href = documentPath(doc);
  const published = (doc.publishedAt ?? doc.createdAt).toISOString().slice(0, 10);
  const modified = doc.updatedAt.toISOString().slice(0, 10);
  const title = localeCopy(doc.title);
  const description = localeCopy(doc.excerpt || doc.metaDescription || doc.title);
  const category = localeCopy(doc.category || "บทความ");
  return {
    slug: doc.slug,
    href,
    published,
    modified,
    minutes: estimateMinutes(parseCmsBody(doc.body)),
    image: doc.featuredImage || "/media/the-kpi-plus-performance-hero_2f986b5f.jpg",
    imageAlt: doc.imageAlt || doc.title,
    category,
    title,
    description,
  };
}

export async function cmsInsightPosts() {
  const docs = await publishedDocuments("insight").catch(() => []);
  return docs.filter((doc) => doc.locale === "th" || doc.slug).map(documentToInsight);
}

export async function allInsightPosts() {
  const extra = await cmsInsightPosts();
  const seen = new Set(insightPosts.map((post) => post.slug));
  return [...insightPosts, ...extra.filter((post) => !seen.has(post.slug))];
}

export async function cmsPageByPath(pathname: string) {
  const doc = await publishedDocumentByPath(pathname).catch(() => null);
  if (!doc || doc.kind !== "page") return null;
  return doc;
}

export async function cmsInsightBySlug(slug: string) {
  const docs = await publishedDocuments("insight").catch(() => []);
  return docs.find((doc) => doc.slug === slug) ?? null;
}

export function cmsMetadata(doc: CmsDocumentRow) {
  const route = documentPath(doc);
  const title = doc.seoTitle || doc.title;
  const description = doc.metaDescription || doc.excerpt;
  const canonical = doc.canonical || `${SITE}${route}`;
  const image = doc.ogImage || doc.featuredImage;
  return {
    title,
    description,
    robots: {
      index: !doc.noindex,
      follow: !doc.noindex,
    },
    alternates: { canonical },
    openGraph: {
      type: doc.kind === "insight" ? ("article" as const) : ("website" as const),
      title,
      description,
      url: canonical,
      images: image ? [{ url: image.startsWith("http") ? image : `${SITE}${image}` }] : undefined,
    },
  };
}
