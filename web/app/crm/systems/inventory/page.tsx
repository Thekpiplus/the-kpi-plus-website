import { SystemsWorkspace } from "@/components/systems-ops/SystemsWorkspace";
import type { SysListFilters } from "@/lib/systems-ops/types";

export default function SystemsInventoryPage({ searchParams }: { searchParams: Promise<SysListFilters> }) {
  return <SystemsWorkspace section="inventory" searchParams={searchParams} />;
}
