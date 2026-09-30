import { TechnologyView } from "@/components/TechnologyView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/solutions/hotel-ai-automation");

export default function TechnologyPage() {
  return <TechnologyView locale="th" />;
}
