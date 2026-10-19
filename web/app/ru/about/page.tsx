import { AboutView } from "@/components/AboutView";
import { CmsAwarePage, cmsAwareMetadata } from "@/components/CmsAwarePage";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return cmsAwareMetadata("/ru/about");
}

export default async function Page() {
  return (
    <CmsAwarePage route="/ru/about">
      <AboutView locale="ru" />
    </CmsAwarePage>
  );
}
