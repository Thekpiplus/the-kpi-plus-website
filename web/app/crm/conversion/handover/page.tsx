import { ConversionWorkspace } from "@/components/conversion-ops/ConversionWorkspace";
import type { ConvListFilters } from "@/lib/conversion-ops/types";

export default function ConversionHandoverPage({ searchParams }: { searchParams: Promise<ConvListFilters> }) {
  return <ConversionWorkspace section="handover" searchParams={searchParams} />;
}
