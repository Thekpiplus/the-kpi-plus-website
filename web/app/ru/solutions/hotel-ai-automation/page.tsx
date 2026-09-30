import { TechnologyView } from "@/components/TechnologyView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/ru/solutions/hotel-ai-automation");

export default function TechnologyPageRu() {
  return <TechnologyView locale="ru" />;
}
