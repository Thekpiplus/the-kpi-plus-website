import { SeoWorkspace } from "@/components/seo-ops/SeoWorkspace";
import type { SeoListFilters } from "@/lib/seo-ops/types";

export default function SeoReviewsPage({ searchParams }: { searchParams: Promise<SeoListFilters> }) {
  return <SeoWorkspace section="reviews" searchParams={searchParams} />;
}
