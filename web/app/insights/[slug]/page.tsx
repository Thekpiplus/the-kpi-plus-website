import { notFound, permanentRedirect, redirect } from "next/navigation";
import { CmsDocumentView } from "@/components/CmsDocumentView";
import { InsightArticle } from "@/components/InsightArticle";
import { matchCmsRedirect } from "@/lib/cms/files";
import { isHotelMarketingCmsBody, parseHotelMarketingInsightBody } from "@/lib/cms/hotel-marketing-insight";
import {
  hotelMarketingBlocksFromContent,
  hotelMarketingInsightPostFromContent,
  hotelMarketingMetadata,
} from "@/lib/cms/hotel-marketing-insight-public";
import { cmsInsightBySlug, cmsMetadata, isCmsPageLive } from "@/lib/cms/public";
import { insightDocumentBySlug } from "@/lib/cms/queries";
import { loadHandoff } from "@/lib/handoff";
import { insightBySlug, insightPosts, insightUpdatedAt, isPublishedInsight } from "@/lib/insights";
import { existingPublicSrc } from "@/lib/insights-media";
import { metadataFor, pageByRoute } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export function generateStaticParams() {
  return insightPosts
    .filter((post) => isPublishedInsight(post) && post.href.startsWith("/insights/"))
    .map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const stored = await insightDocumentBySlug(slug);
  if (stored?.trashedAt) return {};
  if (stored && !isCmsPageLive(stored)) return {};
  const cms = stored && isCmsPageLive(stored) ? stored : await cmsInsightBySlug(slug);
  if (cms && isCmsPageLive(cms)) {
    // Structured Hotel Marketing documents carry their SEO fields inside the JSON body.
    if (isHotelMarketingCmsBody(cms.body)) {
      const content = parseHotelMarketingInsightBody(cms.body);
      if (content) return hotelMarketingMetadata(content, cms);
    }
    return cmsMetadata(cms);
  }
  const post = insightBySlug(slug);
  const route = `/insights/${slug}`;
  if (post && isPublishedInsight(post) && pageByRoute.has(route)) {
    return metadataFor(route, {
      type: "article",
      published: post.publishedAt,
      modified: insightUpdatedAt(post) || undefined,
      image: existingPublicSrc(post.coverImage) || undefined,
      imageAlt: post.coverImageAlt,
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
  // Structured Hotel Marketing documents store JSON, not markdown blocks: render them with the CMS-driven article.
  if (stored && isCmsPageLive(stored) && isHotelMarketingCmsBody(stored.body)) {
    const content = parseHotelMarketingInsightBody(stored.body);
    if (content) {
      const cmsPost = hotelMarketingInsightPostFromContent(content, stored);
      const cmsBlocks = hotelMarketingBlocksFromContent(content, "th");
      return <InsightArticle post={cmsPost} blocks={cmsBlocks} locale="th" marketingCms={content} />;
    }
    // Unparseable JSON is never dumped through CmsDocumentView: fall through to the code-built article.
  } else if (stored && isCmsPageLive(stored)) {
    return <CmsDocumentView doc={stored} />;
  }
  if (post && post.href === route && isPublishedInsight(post)) {
    return <InsightArticle post={post} blocks={loadHandoff(route)} locale="th" />;
  }
  const cms = await cmsInsightBySlug(slug);
  if (cms && isCmsPageLive(cms)) return <CmsDocumentView doc={cms} />;
  notFound();
}
