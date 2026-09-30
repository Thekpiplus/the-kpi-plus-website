import { WebsiteView } from "@/components/WebsiteView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/solutions/hotel-website-design");

export default function WebsiteDesignPage() {
  return <WebsiteView locale="th" />;
}
