import { ContentPage } from "@/components/ContentPage";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/hotel-website-conversion");

export default function Page() {
  return <ContentPage route="/hotel-website-conversion" />;
}
