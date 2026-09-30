import { ContentPage } from "@/components/ContentPage";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/en/hotel-revenue-management");

export default function Page() {
  return <ContentPage route="/en/hotel-revenue-management" />;
}
