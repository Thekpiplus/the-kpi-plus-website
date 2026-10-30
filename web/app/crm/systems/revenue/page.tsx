import { SystemsWorkspace } from "@/components/systems-ops/SystemsWorkspace";
import { withSysDepartmentFilter, type SysListFilters } from "@/lib/systems-ops/types";

export default function SystemsRevenuePage({ searchParams }: { searchParams: Promise<SysListFilters> }) {
  return <SystemsWorkspace section="overview" searchParams={withSysDepartmentFilter(searchParams, "revenue")} />;
}
