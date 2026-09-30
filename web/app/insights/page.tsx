import { InsightsIndexView } from "@/components/InsightsIndexView";
import { cmsInsightPosts } from "@/lib/cms/public";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/insights");

export default async function Page() {
  const extraPosts = await cmsInsightPosts();
  return <InsightsIndexView locale="th" extraPosts={extraPosts} />;
}
