import { HotelSystemsView } from "@/components/HotelSystemsView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/zh/solutions/hotel-systems-implementation");

export default function Page() {
  return <HotelSystemsView locale="zh" />;
}
