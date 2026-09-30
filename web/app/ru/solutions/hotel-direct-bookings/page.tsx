import { ConversionView } from "@/components/ConversionView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/ru/solutions/hotel-direct-bookings");

export default function Page() {
  return <ConversionView locale="ru" />;
}
