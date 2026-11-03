import { SolutionsOpsWorkspace } from "@/components/solutions-ops/SolutionsOpsWorkspace";
import type { SolListFilters } from "@/lib/solutions-ops/types";

export const dynamic = "force-dynamic";

export default function Page({ searchParams }: { searchParams: Promise<SolListFilters> }) {
  return <SolutionsOpsWorkspace section="approvals" searchParams={searchParams} />;
}
