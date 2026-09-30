import { AboutView } from "@/components/AboutView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/about");

export default function Page() {
  return <AboutView locale="th" />;
}
