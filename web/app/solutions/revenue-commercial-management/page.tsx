import { RevenueView } from "@/components/RevenueView";
import { revenuePublicMetadata } from "@/lib/cms/revenue-page-public";

export async function generateMetadata() {
  return revenuePublicMetadata("/solutions/revenue-commercial-management");
}

export default function RevenuePage() {
  return <RevenueView locale="th" />;
}
