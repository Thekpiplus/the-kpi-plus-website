import { SystemsWorkspace } from "@/components/systems-ops/SystemsWorkspace";
import { withSysDepartmentFilter, type SysListFilters } from "@/lib/systems-ops/types";

export default function SystemsSalesPage({ searchParams }: { searchParams: Promise<SysListFilters> }) {
  return <SystemsWorkspace section="overview" searchParams={withSysDepartmentFilter(searchParams, "sales")} />;
}
