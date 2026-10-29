import { ManagementWorkspace } from "@/components/management-ops/ManagementWorkspace";
import type { MgmtListFilters } from "@/lib/management-ops/types";

export default function ManagementPlansPage({ searchParams }: { searchParams: Promise<MgmtListFilters> }) {
  return <ManagementWorkspace section="plans" searchParams={searchParams} />;
}
