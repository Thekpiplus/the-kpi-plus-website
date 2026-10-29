import { ManagementWorkspace } from "@/components/management-ops/ManagementWorkspace";
import type { MgmtListFilters } from "@/lib/management-ops/types";

export default function ManagementApprovalsPage({ searchParams }: { searchParams: Promise<MgmtListFilters> }) {
  return <ManagementWorkspace section="approvals" searchParams={searchParams} />;
}
