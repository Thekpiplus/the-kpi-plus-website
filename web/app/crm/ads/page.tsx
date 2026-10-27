import { AdsWorkspace } from "@/components/ads-ops/AdsWorkspace";
import type { AdsListFilters } from "@/lib/ads-ops/queries";

export default function AdsCampaignsPage({ searchParams }: { searchParams: Promise<AdsListFilters> }) {
  return <AdsWorkspace section="campaigns" searchParams={searchParams} />;
}
