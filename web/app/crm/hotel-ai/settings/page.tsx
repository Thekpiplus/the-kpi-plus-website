import { HotelAiWorkspace } from "@/components/hotel-ai-ops/HotelAiWorkspace";
import type { HaiListFilters } from "@/lib/hotel-ai-ops/types";

export default function HotelAiSettingsPage({ searchParams }: { searchParams: Promise<HaiListFilters> }) {
  return <HotelAiWorkspace section="settings" searchParams={searchParams} />;
}
