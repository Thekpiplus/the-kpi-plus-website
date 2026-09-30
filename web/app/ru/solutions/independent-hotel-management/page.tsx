import { IndependentHotelView } from "@/components/IndependentHotelView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/ru/solutions/independent-hotel-management");

export default function IndependentHotelPageRu() {
  return <IndependentHotelView locale="ru" />;
}
