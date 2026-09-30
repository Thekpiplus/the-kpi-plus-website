import { SeoLocalView } from "@/components/SeoLocalView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/solutions/hotel-seo-google-maps-ai-search");

export default function SeoLocalPage() {
  return <SeoLocalView locale="th" />;
}
