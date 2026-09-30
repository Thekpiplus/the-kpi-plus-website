import { notFound, permanentRedirect, redirect } from "next/navigation";
import { CmsDocumentView } from "@/components/CmsDocumentView";
import { ContentPage } from "@/components/ContentPage";
import { CookiePolicyView } from "@/components/CookiePolicyView";
import { PrivacyNoticeView } from "@/components/PrivacyNoticeView";
import { matchCmsRedirect } from "@/lib/cms/files";
import { cmsMetadata, cmsPageByPath } from "@/lib/cms/public";
import { handoffRoutes } from "@/lib/handoff";
import { localeFromPath, metadataFor, pageByRoute } from "@/lib/seo";

type Params = { slug: string[] };

export function generateStaticParams() {
  const reserved = new Set([
    "about",
    "approach",
    "associations",
    "case-studies",
    "contact",
    "cookies",
    "insights",
    "privacy",
    "solutions",
    "tools",
    "hotel-digital-marketing",
    "hotel-marketing",
    "hotel-revenue-management",
    "hotel-seo-local-search",
    "hotel-technology-ai",
    "hotel-website-conversion",
    "phuket-hotel-marketing",
    "partner",
  ]);

  const dedicated = new Set([
    "/",
    "/en",
    "/ru",
    "/zh",
    "/en/contact",
    "/ru/contact",
    "/zh/contact",
    "/en/solutions",
    "/ru/solutions",
    "/zh/solutions",
    "/en/associations",
    "/ru/associations",
    "/zh/associations",
    "/en/about",
    "/en/case-studies",
    "/en/approach",
    "/en/insights",
    "/ru/insights",
    "/zh/insights",
    "/en/phuket-hotel-marketing",
    "/solutions/meta-ads-management",
    "/ru/solutions/meta-ads-management",
    "/zh/solutions/meta-ads-management",
    "/solutions/google-ads-management",
    "/ru/solutions/google-ads-management",
    "/zh/solutions/google-ads-management",
    "/solutions/hotel-seo-google-maps-ai-search",
    "/ru/solutions/hotel-seo-google-maps-ai-search",
    "/zh/solutions/hotel-seo-google-maps-ai-search",
    "/solutions/revenue-commercial-management",
    "/ru/solutions/revenue-commercial-management",
    "/zh/solutions/revenue-commercial-management",
    "/solutions/outsourced-hotel-reservations",
    "/ru/solutions/outsourced-hotel-reservations",
    "/zh/solutions/outsourced-hotel-reservations",
    "/solutions/b2b-agent-sales",
    "/ru/solutions/b2b-agent-sales",
    "/zh/solutions/b2b-agent-sales",
    "/solutions/hotel-website-design",
    "/ru/solutions/hotel-website-design",
    "/zh/solutions/hotel-website-design",
    "/solutions/hotel-direct-bookings",
    "/ru/solutions/hotel-direct-bookings",
    "/zh/solutions/hotel-direct-bookings",
    "/solutions/hotel-systems-implementation",
    "/ru/solutions/hotel-systems-implementation",
    "/zh/solutions/hotel-systems-implementation",
    "/solutions/hotel-ai-automation",
    "/ru/solutions/hotel-ai-automation",
    "/zh/solutions/hotel-ai-automation",
    "/solutions/hotel-training-team-development",
    "/ru/solutions/hotel-training-team-development",
    "/zh/solutions/hotel-training-team-development",
    "/solutions/independent-hotel-management",
    "/ru/solutions/independent-hotel-management",
    "/zh/solutions/independent-hotel-management",
    "/ru/about",
    "/zh/about",
    "/ru/approach",
    "/zh/approach",
    "/ru/case-studies",
    "/zh/case-studies",
    "/partner",
  ]);

  return handoffRoutes()
    .filter(
      (route) =>
        !dedicated.has(route) &&
        !route.startsWith("/en/solutions/") &&
        !route.startsWith("/en/hotel-") &&
        !route.startsWith("/insights/"),
    )
    .map((route) => ({ slug: route.replace(/^\//, "").split("/") }))
    .filter((params) => !reserved.has(params.slug[0] ?? "") || params.slug.length > 1);
}

function followCmsRedirect(route: string) {
  const hit = matchCmsRedirect(route);
  if (!hit) return;
  if (hit.statusCode === 302) redirect(hit.toPath);
  permanentRedirect(hit.toPath);
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const route = `/${slug.join("/")}`;
  if (pageByRoute.has(route)) return metadataFor(route);
  const cms = await cmsPageByPath(route);
  if (cms) return cmsMetadata(cms);
  return {};
}

export default async function CatchAllPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const route = `/${slug.join("/")}`;
  followCmsRedirect(route);
  if (pageByRoute.has(route)) {
    const locale = localeFromPath(route);
    if (route.endsWith("/privacy")) return <PrivacyNoticeView locale={locale} route={route} />;
    if (route.endsWith("/cookies")) return <CookiePolicyView locale={locale} route={route} />;
    return <ContentPage route={route} />;
  }
  const cms = await cmsPageByPath(route);
  if (cms) return <CmsDocumentView doc={cms} />;
  notFound();
}
