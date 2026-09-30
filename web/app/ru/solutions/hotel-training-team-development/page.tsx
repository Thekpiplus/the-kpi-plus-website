import { TrainingView } from "@/components/TrainingView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/ru/solutions/hotel-training-team-development");

export default function TrainingPageRu() {
  return <TrainingView locale="ru" />;
}
