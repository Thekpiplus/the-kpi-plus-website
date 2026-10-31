import { TechnologyView } from "@/components/TechnologyView";
import { hotelAiPublicMetadata } from "@/lib/cms/hotel-ai-page-public";

export async function generateMetadata() {
  return hotelAiPublicMetadata("/ru/solutions/hotel-ai-automation");
}

export default function TechnologyPageRu() {
  return <TechnologyView locale="ru" />;
}
