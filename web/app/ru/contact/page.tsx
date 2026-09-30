import { ContactView } from "@/components/ContactView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/ru/contact");

export default function Page() {
  return <ContactView locale="ru" />;
}
