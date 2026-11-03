import { TrainingView } from "@/components/TrainingView";
import { hotelTrainingPublicMetadata } from "@/lib/cms/hotel-training-page-public";

export function generateMetadata() {
  return hotelTrainingPublicMetadata("/ru/solutions/hotel-training-team-development");
}

export default function TrainingPageRu() {
  return <TrainingView locale="ru" />;
}
