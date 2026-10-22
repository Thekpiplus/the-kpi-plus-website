import { insightPosts, isPublishedInsight, type InsightPost } from "@/lib/insights";
import { existingPublicSrc, parseInsightImageMeta } from "@/lib/insights-media";
import { SITE, barePath, localeFromPath, type Locale } from "@/lib/seo";
import { documentPath, estimateMinutes, parseCmsBody } from "./body";
import { pageDocumentBySlug, publishedDocumentByPath, publishedDocuments } from "./queries";
import type { CmsDocumentRow } from "./types";

function localeCopy(value: string): Record<Locale, string> {
  return { th: value, en: value, ru: value, zh: value };
}

export function documentToInsight(doc: CmsDocumentRow): InsightPost {
  const href = documentPath(doc);
  const publishedAt = (doc.publishedAt ?? doc.createdAt).toISOString().slice(0, 10);
  const updatedAt = doc.updatedAt.toISOString().slice(0, 10);
  const title = localeCopy(doc.title);
  const excerpt = localeCopy(doc.excerpt || doc.metaDescription || doc.title);
  const category = localeCopy(doc.category || "บทความ");
  const coverImage = doc.featuredImage?.trim() ?? "";
  const media = parseInsightImageMeta(doc.tags);
  return {
    id: doc.id || doc.slug,
    slug: doc.slug,
    href,
    publishedAt,
    updatedAt: updatedAt !== publishedAt ? updatedAt : undefined,
    readingTimeMinutes: estimateMinutes(parseCmsBody(doc.body)),
    coverImage,
    coverImageAlt: doc.imageAlt || doc.title,
    coverImageFit: media.imageFit,
    coverImageStatus: media.imageStatus,
    authorName: doc.author?.trim() || undefined,
    authorRole: media.authorRole,
    sources: media.sources,
    relatedArticleIds: media.relatedArticleIds,
    isFeatured: media.isFeatured,
    isPublished: isCmsPageLive(doc),
    sampleVisual: media.imageStatus === "sample" || media.imageStatus === "placeholder" || !coverImage,
    content: doc.body,
    category,
    title,
    excerpt,
  };
}

export async function cmsInsightPosts() {
  const docs = await publishedDocuments("insight").catch(() => []);
  return docs.filter((doc) => doc.locale === "th" || doc.slug).map(documentToInsight);
}

export async function allInsightPosts() {
  const extra = await cmsInsightPosts();
  const seen = new Set(insightPosts.map((post) => post.slug));
  return [...insightPosts, ...extra.filter((post) => !seen.has(post.slug))].filter(isPublishedInsight);
}

export function isCmsPageLive(doc: CmsDocumentRow) {
  if (doc.trashedAt) return false;
  if (doc.status === "published") return true;
  if (doc.status === "scheduled" && doc.scheduledAt && doc.scheduledAt <= new Date()) return true;
  return false;
}

export async function storedPageByPath(pathname: string) {
  const locale = localeFromPath(pathname);
  const bare = barePath(pathname);
  const slug = bare === "/" ? "" : bare.replace(/^\//, "");
  const doc = await pageDocumentBySlug(slug, locale).catch(() => null);
  // Include trashed docs so public routes can 404 instead of falling back to code pages.
  if (doc) return doc;
  if (slug === "about-us") return pageDocumentBySlug("about", locale).catch(() => null);
  if (slug === "contact-us") return pageDocumentBySlug("contact", locale).catch(() => null);
  return null;
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
  const canonical = (doc.canonical || `${SITE}${route}`)
    .replace(/\/about$/, "/about-us")
    .replace(/\/contact$/, "/contact-us");
  const image = existingPublicSrc(doc.ogImage) || existingPublicSrc(doc.featuredImage);
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
