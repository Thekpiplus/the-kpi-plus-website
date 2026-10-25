import { RevenueView } from "@/components/RevenueView";
import { revenuePublicMetadata } from "@/lib/cms/revenue-page-public";

export async function generateMetadata() {
  return revenuePublicMetadata("/zh/solutions/revenue-commercial-management");
}

export default function Page() {
  return <RevenueView locale="zh" />;
}
