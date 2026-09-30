import { ConversionView } from "@/components/ConversionView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/solutions/hotel-direct-bookings");

export default function WebsiteConversionPage() {
  return <ConversionView locale="th" />;
}
