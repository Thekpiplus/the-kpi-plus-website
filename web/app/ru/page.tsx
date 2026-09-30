import { HomeView } from "@/components/HomeView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/ru");

export default function Page() {
  return <HomeView locale="ru" />;
}
