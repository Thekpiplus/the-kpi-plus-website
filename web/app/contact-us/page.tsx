import { ContactView } from "@/components/ContactView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/contact-us");

export default function ContactPage() {
  return <ContactView locale="th" />;
}
