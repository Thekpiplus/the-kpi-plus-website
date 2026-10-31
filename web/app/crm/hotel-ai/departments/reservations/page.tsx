import { HotelAiWorkspace } from "@/components/hotel-ai-ops/HotelAiWorkspace";
import { withHaiDepartmentFilter, type HaiListFilters } from "@/lib/hotel-ai-ops/types";

export default function HotelAiReservationsPage({ searchParams }: { searchParams: Promise<HaiListFilters> }) {
  return <HotelAiWorkspace section="departments" searchParams={withHaiDepartmentFilter(searchParams, "reservations")} />;
}
