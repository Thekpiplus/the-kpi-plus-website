import { IndependentHotelView } from "@/components/IndependentHotelView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/zh/solutions/independent-hotel-management");

export default function IndependentHotelPageZh() {
  return <IndependentHotelView locale="zh" />;
}
