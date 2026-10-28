import { SeoWorkspace } from "@/components/seo-ops/SeoWorkspace";
import type { SeoListFilters } from "@/lib/seo-ops/types";

export default function SeoSettingsPage({ searchParams }: { searchParams: Promise<SeoListFilters> }) {
  return <SeoWorkspace section="settings" searchParams={searchParams} />;
}
