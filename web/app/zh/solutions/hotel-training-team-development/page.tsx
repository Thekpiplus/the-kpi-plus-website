import { TrainingView } from "@/components/TrainingView";
import { hotelTrainingPublicMetadata } from "@/lib/cms/hotel-training-page-public";

export function generateMetadata() {
  return hotelTrainingPublicMetadata("/zh/solutions/hotel-training-team-development");
}

export default function TrainingPageZh() {
  return <TrainingView locale="zh" />;
}
