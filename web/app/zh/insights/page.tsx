import { InsightsIndexView } from "@/components/InsightsIndexView";
import { cmsInsightPosts } from "@/lib/cms/public";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/zh/insights");

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; sort?: string; q?: string; page?: string }>;
}) {
  const extraPosts = await cmsInsightPosts();
  const { topic, sort, q, page } = await searchParams;
  return <InsightsIndexView locale="zh" extraPosts={extraPosts} topic={topic} sort={sort} q={q} page={page} />;
}
