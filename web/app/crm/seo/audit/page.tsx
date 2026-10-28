import { SeoWorkspace } from "@/components/seo-ops/SeoWorkspace";
import type { SeoListFilters } from "@/lib/seo-ops/types";

export default function SeoAuditPage({ searchParams }: { searchParams: Promise<SeoListFilters> }) {
  return <SeoWorkspace section="audit" searchParams={searchParams} />;
}
