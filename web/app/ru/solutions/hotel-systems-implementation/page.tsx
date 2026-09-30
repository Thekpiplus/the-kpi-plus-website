import { HotelSystemsView } from "@/components/HotelSystemsView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/ru/solutions/hotel-systems-implementation");

export default function Page() {
  return <HotelSystemsView locale="ru" />;
}
