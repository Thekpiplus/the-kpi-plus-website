import { TrainingView } from "@/components/TrainingView";
import { hotelTrainingPublicMetadata } from "@/lib/cms/hotel-training-page-public";

export function generateMetadata() {
  return hotelTrainingPublicMetadata("/solutions/hotel-training-team-development");
}

export default function TrainingPage() {
  return <TrainingView locale="th" />;
}

