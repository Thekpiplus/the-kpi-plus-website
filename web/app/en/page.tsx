import { HomeView } from "@/components/HomeView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/en");

export default function Page() {
  return <HomeView locale="en" />;
}
