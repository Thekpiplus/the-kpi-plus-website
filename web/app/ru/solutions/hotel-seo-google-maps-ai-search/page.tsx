import { SeoLocalView } from "@/components/SeoLocalView";
import { hotelSeoPublicMetadata } from "@/lib/cms/hotel-seo-page-public";

export async function generateMetadata() {
  return hotelSeoPublicMetadata("/ru/solutions/hotel-seo-google-maps-ai-search");
}

export default function Page() {
  return <SeoLocalView locale="ru" />;
}
