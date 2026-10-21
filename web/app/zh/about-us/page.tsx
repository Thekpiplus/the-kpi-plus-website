import { AboutView } from "@/components/AboutView";
import { CmsAwarePage, cmsAwareMetadata } from "@/components/CmsAwarePage";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return cmsAwareMetadata("/zh/about-us");
}

export default async function Page() {
  return (
    <CmsAwarePage route="/zh/about-us">
      <AboutView locale="zh" />
    </CmsAwarePage>
  );
}
