import { IndependentHotelView } from "@/components/IndependentHotelView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/solutions/independent-hotel-management");

export default function IndependentHotelPage() {
  return <IndependentHotelView locale="th" />;
}
