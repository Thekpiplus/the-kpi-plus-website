import { WebsiteView } from "@/components/WebsiteView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/zh/solutions/hotel-website-design");

export default function Page() {
  return <WebsiteView locale="zh" />;
}
