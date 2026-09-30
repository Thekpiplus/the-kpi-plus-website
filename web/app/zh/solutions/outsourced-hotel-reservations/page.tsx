import { ReservationsView } from "@/components/ReservationsView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/zh/solutions/outsourced-hotel-reservations");

export default function Page() {
  return <ReservationsView locale="zh" />;
}
