import { RevenueView } from "@/components/RevenueView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/solutions/revenue-commercial-management");

export default function RevenuePage() {
  return <RevenueView locale="th" />;
}
