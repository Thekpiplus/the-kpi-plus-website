import { TechnologyView } from "@/components/TechnologyView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/zh/solutions/hotel-ai-automation");

export default function TechnologyPageZh() {
  return <TechnologyView locale="zh" />;
}
