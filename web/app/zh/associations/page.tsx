import { AssociationsView } from "@/components/AssociationsView";
import { CmsAwarePage, cmsAwareMetadata } from "@/components/CmsAwarePage";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return cmsAwareMetadata("/zh/associations");
}

export default async function Page() {
  return (
    <CmsAwarePage route="/zh/associations">
      <AssociationsView locale="zh" />
    </CmsAwarePage>
  );
}
