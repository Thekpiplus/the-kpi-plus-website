import { MetaWorkspace } from "@/components/meta-ops/MetaWorkspace";
import type { MetaListFilters } from "@/lib/meta-ops/queries";

export default function MetaCreativeMatrixPage({ searchParams }: { searchParams: Promise<MetaListFilters> }) {
  return <MetaWorkspace section="creative-matrix" searchParams={searchParams} />;
}
