import { SystemsWorkspace } from "@/components/systems-ops/SystemsWorkspace";
import type { SysListFilters } from "@/lib/systems-ops/types";

export default function SystemsIssuesPage({ searchParams }: { searchParams: Promise<SysListFilters> }) {
  return <SystemsWorkspace section="issues" searchParams={searchParams} />;
}
