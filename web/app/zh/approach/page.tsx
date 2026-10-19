import { ApproachView } from "@/components/ApproachView";
import { CmsAwarePage, cmsAwareMetadata } from "@/components/CmsAwarePage";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return cmsAwareMetadata("/zh/approach");
}

export default async function Page() {
  return (
    <CmsAwarePage route="/zh/approach">
      <ApproachView locale="zh" />
    </CmsAwarePage>
  );
}
