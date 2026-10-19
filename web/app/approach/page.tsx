import { ApproachView } from "@/components/ApproachView";
import { CmsAwarePage, cmsAwareMetadata } from "@/components/CmsAwarePage";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return cmsAwareMetadata("/approach");
}

export default async function Page() {
  return (
    <CmsAwarePage route="/approach">
      <ApproachView locale="th" />
    </CmsAwarePage>
  );
}
