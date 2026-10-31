import { TechnologyView } from "@/components/TechnologyView";
import { hotelAiPublicMetadata } from "@/lib/cms/hotel-ai-page-public";

export async function generateMetadata() {
  return hotelAiPublicMetadata("/solutions/hotel-ai-automation");
}

export default function TechnologyPage() {
  return <TechnologyView locale="th" />;
}
