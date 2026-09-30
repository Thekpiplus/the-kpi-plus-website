import { AssociationsView } from "@/components/AssociationsView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/zh/associations");

export default function Page() {
  return <AssociationsView locale="zh" />;
}
