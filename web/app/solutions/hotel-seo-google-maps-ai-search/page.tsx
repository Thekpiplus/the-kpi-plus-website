import { SeoLocalView } from "@/components/SeoLocalView";
import { hotelSeoPublicMetadata } from "@/lib/cms/hotel-seo-page-public";

export async function generateMetadata() {
  return hotelSeoPublicMetadata("/solutions/hotel-seo-google-maps-ai-search");
}

export default function SeoLocalPage() {
  return <SeoLocalView locale="th" />;
}
