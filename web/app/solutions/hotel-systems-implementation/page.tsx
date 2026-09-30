import { HotelSystemsView } from "@/components/HotelSystemsView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/solutions/hotel-systems-implementation");

export default function HotelSystemsPage() {
  return <HotelSystemsView locale="th" />;
}
