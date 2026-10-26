import { ReservationsView } from "@/components/ReservationsView";
import { reservationsPublicMetadata } from "@/lib/cms/reservations-page-public";

export async function generateMetadata() {
  return reservationsPublicMetadata("/solutions/outsourced-hotel-reservations");
}

export default function ReservationsPage() {
  return <ReservationsView locale="th" />;
}
