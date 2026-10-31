import { notFound } from "next/navigation";
import { ContentPage } from "@/components/ContentPage";
import { GoogleAdsView } from "@/components/GoogleAdsView";
import { MetaAdsView } from "@/components/MetaAdsView";
import { B2bView } from "@/components/B2bView";
import { ReservationsView } from "@/components/ReservationsView";
import { RevenueView } from "@/components/RevenueView";
import { SeoLocalView } from "@/components/SeoLocalView";
import { ConversionView } from "@/components/ConversionView";
import { HotelSystemsView } from "@/components/HotelSystemsView";
import { IndependentHotelView } from "@/components/IndependentHotelView";
import { TechnologyView } from "@/components/TechnologyView";
import { TrainingView } from "@/components/TrainingView";
import { WebsiteView } from "@/components/WebsiteView";
import { SOLUTION_SLUGS } from "@/lib/solution-slugs";
import { b2bPublicMetadata } from "@/lib/cms/b2b-page-public";
import { googleAdsPublicMetadata } from "@/lib/cms/google-ads-page-public";
import { hotelSeoPublicMetadata } from "@/lib/cms/hotel-seo-page-public";
import { hotelAiPublicMetadata } from "@/lib/cms/hotel-ai-page-public";
import { reservationsPublicMetadata } from "@/lib/cms/reservations-page-public";
import { revenuePublicMetadata } from "@/lib/cms/revenue-page-public";
import { metadataFor, pageByRoute } from "@/lib/seo";

type Params = { slug: string };

export function generateStaticParams() {
  return SOLUTION_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const route = `/en/solutions/${slug}`;
  if (!pageByRoute.has(route)) return {};
  if (slug === "revenue-commercial-management") return revenuePublicMetadata(route);
  if (slug === "outsourced-hotel-reservations") return reservationsPublicMetadata(route);
  if (slug === "b2b-agent-sales") return b2bPublicMetadata(route);
  if (slug === "google-ads-management") return googleAdsPublicMetadata(route);
  if (slug === "hotel-seo-google-maps-ai-search") return hotelSeoPublicMetadata(route);
  if (slug === "hotel-ai-automation") return hotelAiPublicMetadata(route);
  return metadataFor(route);
}

export default async function EnglishSolutionPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const route = `/en/solutions/${slug}`;
  if (!pageByRoute.has(route)) notFound();
  if (slug === "meta-ads-management") return <MetaAdsView locale="en" />;
  if (slug === "google-ads-management") return <GoogleAdsView locale="en" />;
  if (slug === "hotel-seo-google-maps-ai-search") return <SeoLocalView locale="en" />;
  if (slug === "revenue-commercial-management") return <RevenueView locale="en" />;
  if (slug === "outsourced-hotel-reservations") return <ReservationsView locale="en" />;
  if (slug === "b2b-agent-sales") return <B2bView locale="en" />;
  if (slug === "hotel-website-design") return <WebsiteView locale="en" />;
  if (slug === "hotel-direct-bookings") return <ConversionView locale="en" />;
  if (slug === "hotel-systems-implementation") return <HotelSystemsView locale="en" />;
  if (slug === "independent-hotel-management") return <IndependentHotelView locale="en" />;
  if (slug === "hotel-ai-automation") return <TechnologyView locale="en" />;
  if (slug === "hotel-training-team-development") return <TrainingView locale="en" />;
  return <ContentPage route={route} />;
}
