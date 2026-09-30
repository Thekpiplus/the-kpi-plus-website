import { AssociationsView } from "@/components/AssociationsView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/ru/associations");

export default function Page() {
  return <AssociationsView locale="ru" />;
}
