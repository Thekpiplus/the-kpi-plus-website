import { AssociationsView } from "@/components/AssociationsView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/en/associations");

export default function Page() {
  return <AssociationsView locale="en" />;
}
