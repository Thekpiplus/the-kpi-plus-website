import { HomeView } from "@/components/HomeView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/");

export default function HomePage() {
  return <HomeView locale="th" />;
}
