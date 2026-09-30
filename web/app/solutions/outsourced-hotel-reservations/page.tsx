import { ReservationsView } from "@/components/ReservationsView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/solutions/outsourced-hotel-reservations");

export default function ReservationsPage() {
  return <ReservationsView locale="th" />;
}
