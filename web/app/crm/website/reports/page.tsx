import { WebsiteWorkspace } from "@/components/website-ops/WebsiteWorkspace";
import type { WebListFilters } from "@/lib/website-ops/types";

export default function WebsiteReportsPage({ searchParams }: { searchParams: Promise<WebListFilters> }) {
  return <WebsiteWorkspace section="reports" searchParams={searchParams} />;
}
