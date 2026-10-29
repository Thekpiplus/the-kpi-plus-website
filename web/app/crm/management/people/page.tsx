import { ManagementWorkspace } from "@/components/management-ops/ManagementWorkspace";
import type { MgmtListFilters } from "@/lib/management-ops/types";

export default function ManagementPeoplePage({ searchParams }: { searchParams: Promise<MgmtListFilters> }) {
  return <ManagementWorkspace section="people" searchParams={searchParams} />;
}
