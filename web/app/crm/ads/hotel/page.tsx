import { AdsWorkspace } from "@/components/ads-ops/AdsWorkspace";
import type { AdsListFilters } from "@/lib/ads-ops/queries";

export default function AdsHotelPage({ searchParams }: { searchParams: Promise<AdsListFilters> }) {
  return <AdsWorkspace section="hotel" searchParams={searchParams} />;
}
