import { TrainingOpsWorkspace } from "@/components/training-ops/TrainingOpsWorkspace";
import type { TrnListFilters } from "@/lib/training-ops/types";

export default function Page({ searchParams }: { searchParams: Promise<TrnListFilters> }) {
  return <TrainingOpsWorkspace section="requests" searchParams={searchParams} />;
}
