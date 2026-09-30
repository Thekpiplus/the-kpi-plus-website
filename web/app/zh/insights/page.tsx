import { InsightsIndexView } from "@/components/InsightsIndexView";
import { cmsInsightPosts } from "@/lib/cms/public";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/zh/insights");

export default async function Page() {
  const extraPosts = await cmsInsightPosts();
  return <InsightsIndexView locale="zh" extraPosts={extraPosts} />;
}
