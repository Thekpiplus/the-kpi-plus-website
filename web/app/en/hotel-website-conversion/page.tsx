import { ContentPage } from "@/components/ContentPage";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/en/hotel-website-conversion");

export default function Page() {
  return <ContentPage route="/en/hotel-website-conversion" />;
}
