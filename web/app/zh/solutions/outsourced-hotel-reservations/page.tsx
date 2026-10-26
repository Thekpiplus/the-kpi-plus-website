import { ReservationsView } from "@/components/ReservationsView";
import { reservationsPublicMetadata } from "@/lib/cms/reservations-page-public";

export async function generateMetadata() {
  return reservationsPublicMetadata("/zh/solutions/outsourced-hotel-reservations");
}

export default function Page() {
  return <ReservationsView locale="zh" />;
}
