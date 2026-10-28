import { ConversionWorkspace } from "@/components/conversion-ops/ConversionWorkspace";
import type { ConvListFilters } from "@/lib/conversion-ops/types";

export default function ConversionProjectsPage({ searchParams }: { searchParams: Promise<ConvListFilters> }) {
  return <ConversionWorkspace section="project" searchParams={searchParams} />;
}
