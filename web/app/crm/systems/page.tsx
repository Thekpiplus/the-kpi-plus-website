import { SystemsWorkspace } from "@/components/systems-ops/SystemsWorkspace";
import type { SysListFilters } from "@/lib/systems-ops/types";

export default function SystemsOverviewPage({ searchParams }: { searchParams: Promise<SysListFilters> }) {
  return <SystemsWorkspace section="overview" searchParams={searchParams} />;
}
