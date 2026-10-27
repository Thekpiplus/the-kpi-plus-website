import { AdsWorkspace } from "@/components/ads-ops/AdsWorkspace";
import type { AdsListFilters } from "@/lib/ads-ops/queries";

export default function AdsLandingPagesPage({ searchParams }: { searchParams: Promise<AdsListFilters> }) {
  return <AdsWorkspace section="landing-pages" searchParams={searchParams} />;
}
