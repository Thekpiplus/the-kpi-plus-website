import { ApproachView } from "@/components/ApproachView";
import { CmsAwarePage, cmsAwareMetadata } from "@/components/CmsAwarePage";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return cmsAwareMetadata("/en/approach");
}

export default async function Page() {
  return (
    <CmsAwarePage route="/en/approach">
      <ApproachView locale="en" />
    </CmsAwarePage>
  );
}
