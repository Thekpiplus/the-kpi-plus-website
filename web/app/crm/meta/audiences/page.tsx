import { MetaWorkspace } from "@/components/meta-ops/MetaWorkspace";
import type { MetaListFilters } from "@/lib/meta-ops/queries";

export default function MetaAudiencesPage({ searchParams }: { searchParams: Promise<MetaListFilters> }) {
  return <MetaWorkspace section="audiences" searchParams={searchParams} />;
}
