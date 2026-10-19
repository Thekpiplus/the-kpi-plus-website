import { AssociationsView } from "@/components/AssociationsView";
import { CmsAwarePage, cmsAwareMetadata } from "@/components/CmsAwarePage";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return cmsAwareMetadata("/en/associations");
}

export default async function Page() {
  return (
    <CmsAwarePage route="/en/associations">
      <AssociationsView locale="en" />
    </CmsAwarePage>
  );
}
