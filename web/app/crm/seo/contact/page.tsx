import { SeoWorkspace } from "@/components/seo-ops/SeoWorkspace";
import type { SeoListFilters } from "@/lib/seo-ops/types";

export default function SeoContactPage({ searchParams }: { searchParams: Promise<SeoListFilters> }) {
  return <SeoWorkspace section="contact" searchParams={searchParams} />;
}
