import { TrainingView } from "@/components/TrainingView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/solutions/hotel-training-team-development");

export default function TrainingPage() {
  return <TrainingView locale="th" />;
}
