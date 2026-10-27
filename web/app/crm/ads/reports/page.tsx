import { AdsWorkspace } from "@/components/ads-ops/AdsWorkspace";
import type { AdsListFilters } from "@/lib/ads-ops/queries";

export default function AdsReportsPage({ searchParams }: { searchParams: Promise<AdsListFilters> }) {
  return <AdsWorkspace section="reports" searchParams={searchParams} />;
}
