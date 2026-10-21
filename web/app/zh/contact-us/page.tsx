import { ContactView } from "@/components/ContactView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/zh/contact-us");

export default function Page() {
  return <ContactView locale="zh" />;
}
