import { ManagementWorkspace } from "@/components/management-ops/ManagementWorkspace";
import type { MgmtListFilters } from "@/lib/management-ops/types";

export default function ManagementMarketingPage({ searchParams }: { searchParams: Promise<MgmtListFilters> }) {
  return <ManagementWorkspace section="marketing" searchParams={searchParams} />;
}
