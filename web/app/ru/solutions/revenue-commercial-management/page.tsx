import { RevenueView } from "@/components/RevenueView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/ru/solutions/revenue-commercial-management");

export default function Page() {
  return <RevenueView locale="ru" />;
}
