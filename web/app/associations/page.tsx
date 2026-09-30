import { AssociationsView } from "@/components/AssociationsView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/associations");

export default function Page() {
  return <AssociationsView locale="th" />;
}
