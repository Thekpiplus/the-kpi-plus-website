import { SeoLocalView } from "@/components/SeoLocalView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/ru/solutions/hotel-seo-google-maps-ai-search");

export default function Page() {
  return <SeoLocalView locale="ru" />;
}
