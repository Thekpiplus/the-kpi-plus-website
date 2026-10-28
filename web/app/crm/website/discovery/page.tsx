import { WebsiteWorkspace } from "@/components/website-ops/WebsiteWorkspace";
import type { WebListFilters } from "@/lib/website-ops/types";

export default function WebsiteDiscoveryPage({ searchParams }: { searchParams: Promise<WebListFilters> }) {
  return <WebsiteWorkspace section="discovery" searchParams={searchParams} />;
}
