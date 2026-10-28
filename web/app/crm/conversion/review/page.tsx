import { ConversionWorkspace } from "@/components/conversion-ops/ConversionWorkspace";
import type { ConvListFilters } from "@/lib/conversion-ops/types";

export default function ConversionReviewPage({ searchParams }: { searchParams: Promise<ConvListFilters> }) {
  return <ConversionWorkspace section="review" searchParams={searchParams} />;
}
