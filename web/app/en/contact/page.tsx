import { ContactView } from "@/components/ContactView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/en/contact");

export default function Page() {
  return <ContactView locale="en" />;
}
