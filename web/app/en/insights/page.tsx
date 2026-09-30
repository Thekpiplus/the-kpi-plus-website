import { InsightsIndexView } from "@/components/InsightsIndexView";
import { cmsInsightPosts } from "@/lib/cms/public";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/en/insights");

export default async function Page() {
  const extraPosts = await cmsInsightPosts();
  return <InsightsIndexView locale="en" extraPosts={extraPosts} />;
}
