import { AboutView } from "@/components/AboutView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/en/about");

export default function Page() {
  return <AboutView locale="en" />;
}
