import { AdsWorkspace } from "@/components/ads-ops/AdsWorkspace";
import type { AdsListFilters } from "@/lib/ads-ops/queries";

export default function AdsOptimizationPage({ searchParams }: { searchParams: Promise<AdsListFilters> }) {
  return <AdsWorkspace section="optimization" searchParams={searchParams} />;
}
