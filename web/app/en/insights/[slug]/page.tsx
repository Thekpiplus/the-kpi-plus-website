import { notFound, permanentRedirect, redirect } from "next/navigation";
import { CmsDocumentView } from "@/components/CmsDocumentView";
import { InsightArticle } from "@/components/InsightArticle";
import { matchCmsRedirect } from "@/lib/cms/files";
import { cmsInsightBySlug, cmsMetadata, isCmsPageLive } from "@/lib/cms/public";
import { insightDocumentBySlug } from "@/lib/cms/queries";
import { loadHandoff } from "@/lib/handoff";
import { insightBySlug, insightPosts, insightUpdatedAt, isPublishedInsight, type InsightPost } from "@/lib/insights";
import { existingPublicSrc } from "@/lib/insights-media";
import { metadataFor, pageByRoute } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Params = { slug: string };

const EN_COVER: Record<string, { src: string; alt: string }> = {
  "10-hotel-marketing-strategies": {
    src: "/images/blog/10-hotel-marketing-strategies/en/cover.webp",
    alt: "Cover image for ten hotel marketing strategies that make bookings pay off, late 2026 update, by The KPI Plus",
  },
  "7-hotel-marketing-methods": {
    src: "/images/blog/7-hotel-marketing-methods/en/cover.webp",
    alt: "Cover image for seven hotel marketing ideas that keep working, 2026 update, by The KPI Plus",
  },
  "hotel-branding": {
    src: "/images/blog/hotel-branding/en/cover.webp",
    alt: "Cover image for hotel branding in 2026: how to make guests remember you and book with confidence, by The KPI Plus",
  },
  "hotel-local-seo": {
    src: "/images/blog/hotel-local-seo/en/cover.webp",
    alt: "Cover image for local SEO for hotels: making Google Maps and your Business Profile drive bookings, by The KPI Plus",
  },
  "hotel-marketing": {
    src: "/images/blog/hotel-marketing/en/cover.webp",
    alt: "Cover image for What Is Hotel Marketing and Why It Matters, with an illustration of a hotel building, a phone showing a booking screen and a suitcase",
  },
  "hotel-marketing-plan-2027": {
    src: "/images/blog/hotel-marketing-plan-2027/en/cover.webp",
    alt: "Cover image for the hotel marketing plan 2027: planning for net revenue when the market isn't growing, by The KPI Plus",
  },
  "hotel-organizational-structure": {
    src: "/images/blog/hotel-organizational-structure/en/cover.webp",
    alt: "Cover image for hotel organizational structure: departments, people and systems that must work together, by The KPI Plus",
  },
  "hotel-rate-parity": {
    src: "/images/blog/hotel-rate-parity/en/cover.webp",
    alt: "Cover image for hotel rate parity: what it means and how to control prices across channels, by The KPI Plus",
  },
  "hotel-review-management": {
    src: "/images/blog/hotel-review-management/en/cover.webp",
    alt: "Cover image for hotel review management: asking for reviews, replying, and turning reviews into bookings, by The KPI Plus",
  },
  "hotel-seo": {
    src: "/images/blog/hotel-seo/en/cover.webp",
    alt: "Cover image for hotel SEO: how to get your hotel website on page one of Google, by The KPI Plus",
  },
  "hotel-social-media": {
    src: "/images/blog/hotel-social-media/en/cover.webp",
    alt: "Cover image for Hotel Social Media: which channels drive bookings, showing a phone with a hotel post and a guest message asking about availability",
  },
  "hotel-social-media-mistakes": {
    src: "/images/blog/hotel-social-media-mistakes/en/cover.webp",
    alt: "Cover image for hotel social media mistakes: seven checks before you post, by The KPI Plus",
  },
  "hotel-website-content": {
    src: "/images/blog/hotel-website-content/en/cover.webp",
    alt: "Cover image for hotel website content: how to get found on Google and make booking easier, by The KPI Plus",
  },
  "increase-hotel-bookings-from-google": {
    src: "/images/blog/increase-hotel-bookings-from-google/en/cover.webp",
    alt: "Cover image for how to increase hotel bookings from Google with SEO, Google Maps and Google Ads, by The KPI Plus",
  },
  "small-hotel-marketing-and-operations": {
    src: "/images/blog/small-hotel-marketing-and-operations/en/cover.webp",
    alt: "Cover image for small hotel marketing: seven ways to run and market a small hotel with a small team, by The KPI Plus",
  },
  "what-is-ota": {
    src: "/images/blog/what-is-ota/en/cover.webp",
    alt: "Cover image for What Is an OTA and how it helps hotels grow, showing a network connecting a hotel, online booking channels and guests",
  },
  "hotel-revenue-meetings-that-lead-to-decisions": {
    src: "/images/blog/hotel-revenue-meetings-that-lead-to-decisions/en/cover.webp",
    alt: "Cover image for hotel revenue meetings that end in a usable decision, by The KPI Plus",
  },
  "hotel-technology-adoption-commercial-project": {
    src: "/images/blog/hotel-technology-adoption-commercial-project/en/cover.webp",
    alt: "Cover image for hotel technology and AI adoption as a commercial project, by The KPI Plus",
  },
  "direct-booking-journey-audit": {
    src: "/images/blog/direct-booking-journey-audit/en/cover.webp",
    alt: "Cover image for auditing the hotel direct-booking journey from search to booking engine, by The KPI Plus",
  },
  "seo-vs-sem-for-hotels-which-one-should-you-focus-on": {
    src: "/images/blog/seo-vs-sem-for-hotels-which-one-should-you-focus-on/en/cover.webp",
    alt: "Cover image for SEO vs SEM for hotels: where to start, by The KPI Plus",
  },
};

function enInsightPost(slug: string): InsightPost | null {
  const base = insightBySlug(slug);
  if (!base || !isPublishedInsight(base)) return null;
  const route = `/en/insights/${slug}`;
  if (!pageByRoute.has(route)) return null;
  const cover = EN_COVER[slug];
  return {
    ...base,
    href: route,
    coverImage: cover?.src ?? base.coverImage,
    coverImageAlt: cover?.alt ?? base.coverImageAlt,
    coverImageStatus: cover ? "approved" : base.coverImageStatus,
    sampleVisual: cover ? false : base.sampleVisual,
    readingTimeMinutes: base.readingTimeMinutes,
  };
}

export function generateStaticParams() {
  return insightPosts
    .filter((post) => isPublishedInsight(post) && pageByRoute.has(`/en/insights/${post.slug}`))
    .map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const route = `/en/insights/${slug}`;
  const post = enInsightPost(slug);
  if (post && pageByRoute.has(route)) {
    return metadataFor(route, {
      type: "article",
      published: post.publishedAt,
      modified: insightUpdatedAt(post) || undefined,
      image: existingPublicSrc(post.coverImage) || undefined,
      imageAlt: post.coverImageAlt,
    });
  }
  const stored = await insightDocumentBySlug(slug);
  if (stored && isCmsPageLive(stored)) return cmsMetadata(stored);
  return {};
}

export default async function EnInsightPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const route = `/en/insights/${slug}`;
  const hit = matchCmsRedirect(route);
  if (hit) {
    if (hit.statusCode === 302) redirect(hit.toPath);
    permanentRedirect(hit.toPath);
  }

  const post = enInsightPost(slug);
  if (post) {
    return <InsightArticle post={post} blocks={loadHandoff(route)} locale="en" />;
  }

  const stored = await insightDocumentBySlug(slug);
  if (stored && isCmsPageLive(stored)) return <CmsDocumentView doc={stored} />;
  const cms = await cmsInsightBySlug(slug);
  if (cms && isCmsPageLive(cms)) return <CmsDocumentView doc={cms} />;
  notFound();
}
