import { WebsiteWorkspace } from "@/components/website-ops/WebsiteWorkspace";
import type { WebListFilters } from "@/lib/website-ops/types";

export default function WebsiteBookingPage({ searchParams }: { searchParams: Promise<WebListFilters> }) {
  return <WebsiteWorkspace section="booking" searchParams={searchParams} />;
}
