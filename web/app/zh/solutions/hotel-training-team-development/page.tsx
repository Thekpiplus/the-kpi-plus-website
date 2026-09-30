import { TrainingView } from "@/components/TrainingView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/zh/solutions/hotel-training-team-development");

export default function TrainingPageZh() {
  return <TrainingView locale="zh" />;
}
