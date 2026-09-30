import { ContentPage } from "@/components/ContentPage";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/hotel-revenue-management");

export default function Page() {
  return <ContentPage route="/hotel-revenue-management" />;
}
