import { ManagementWorkspace } from "@/components/management-ops/ManagementWorkspace";
import type { MgmtListFilters } from "@/lib/management-ops/types";

export default function ManagementOverviewPage({ searchParams }: { searchParams: Promise<MgmtListFilters> }) {
  return <ManagementWorkspace section="overview" searchParams={searchParams} />;
}
