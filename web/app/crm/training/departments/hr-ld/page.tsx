import { TrainingOpsWorkspace } from "@/components/training-ops/TrainingOpsWorkspace";
import { withTrnDepartmentFilter, type TrnListFilters } from "@/lib/training-ops/types";

export default function Page({ searchParams }: { searchParams: Promise<TrnListFilters> }) {
  return <TrainingOpsWorkspace section="departments" searchParams={withTrnDepartmentFilter(searchParams, "hr_ld")} />;
}
