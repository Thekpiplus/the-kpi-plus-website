import { TechnologyView } from "@/components/TechnologyView";
import { hotelAiPublicMetadata } from "@/lib/cms/hotel-ai-page-public";

export async function generateMetadata() {
  return hotelAiPublicMetadata("/zh/solutions/hotel-ai-automation");
}

export default function TechnologyPageZh() {
  return <TechnologyView locale="zh" />;
}
