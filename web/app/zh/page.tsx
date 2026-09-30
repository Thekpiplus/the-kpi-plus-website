import { HomeView } from "@/components/HomeView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/zh");

export default function Page() {
  return <HomeView locale="zh" />;
}
