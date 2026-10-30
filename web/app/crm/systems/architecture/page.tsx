import { SystemsWorkspace } from "@/components/systems-ops/SystemsWorkspace";
import type { SysListFilters } from "@/lib/systems-ops/types";

export default function SystemsArchitecturePage({ searchParams }: { searchParams: Promise<SysListFilters> }) {
  return <SystemsWorkspace section="architecture" searchParams={searchParams} />;
}
