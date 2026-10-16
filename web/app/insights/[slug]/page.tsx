import { notFound, permanentRedirect, redirect } from "next/navigation";
import { CmsDocumentView } from "@/components/CmsDocumentView";
import { InsightArticle } from "@/components/InsightArticle";
import { matchCmsRedirect } from "@/lib/cms/files";
import { cmsInsightBySlug, cmsMetadata, isCmsPageLive } from "@/lib/cms/public";
import { insightDocumentBySlug } from "@/lib/cms/queries";
import { loadHandoff } from "@/lib/handoff";
import { insightBySlug, insightPosts } from "@/lib/insights";
import { metadataFor, pageByRoute } from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams() {
  return insightPosts.filter((post) => post.href.startsWith("/insights/")).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const stored = await insightDocumentBySlug(slug);
  if (stored?.trashedAt) return {};
  if (stored && !isCmsPageLive(stored)) return {};
  const cms = stored && isCmsPageLive(stored) ? stored : await cmsInsightBySlug(slug);
  if (cms && isCmsPageLive(cms)) return cmsMetadata(cms);
  const post = insightBySlug(slug);
  const route = `/insights/${slug}`;
  if (post && pageByRoute.has(route)) {
    return metadataFor(route, {
      type: "article",
      published: post.published,
      modified: post.modified !== post.published ? post.modified : undefined,
      image: post.image,
      imageAlt: post.imageAlt,
    });
  }
  return {};
}

export default async function InsightPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = insightBySlug(slug);
  const route = `/insights/${slug}`;
  const hit = matchCmsRedirect(route);
  if (hit) {
    if (hit.statusCode === 302) redirect(hit.toPath);
    permanentRedirect(hit.toPath);
  }
  const stored = await insightDocumentBySlug(slug);
  if (stored?.trashedAt) notFound();
  if (stored && !isCmsPageLive(stored)) notFound();
  if (stored && isCmsPageLive(stored)) {
    return <CmsDocumentView doc={stored} />;
  }
  if (post && post.href === route) {
    return <InsightArticle post={post} blocks={loadHandoff(route)} locale="th" />;
  }
  const cms = await cmsInsightBySlug(slug);
  if (cms && isCmsPageLive(cms)) return <CmsDocumentView doc={cms} />;
  notFound();
}
