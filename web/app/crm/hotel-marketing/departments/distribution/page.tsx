import { HotelMarketingOpsWorkspace } from "@/components/hotel-marketing-ops/HotelMarketingOpsWorkspace";
import type { HmoRawSearchParams } from "@/lib/hotel-marketing-ops/types";

export default function Page({ searchParams }: { searchParams: Promise<HmoRawSearchParams> }) {
  return <HotelMarketingOpsWorkspace section="departments" department="distribution" searchParams={searchParams} />;
}
