import { MetaWorkspace } from "@/components/meta-ops/MetaWorkspace";
import type { MetaListFilters } from "@/lib/meta-ops/queries";

export default function AdsApprovalsPage({ searchParams }: { searchParams: Promise<MetaListFilters> }) {
  return <MetaWorkspace section="approvals" searchParams={searchParams} />;
}
