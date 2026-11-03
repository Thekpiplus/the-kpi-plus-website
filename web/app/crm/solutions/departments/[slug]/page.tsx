import { SolutionsOpsWorkspace } from "@/components/solutions-ops/SolutionsOpsWorkspace";
import type { SolListFilters } from "@/lib/solutions-ops/types";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SolListFilters>;
}) {
  const { slug } = await params;
  return <SolutionsOpsWorkspace section="departments" department={slug} searchParams={searchParams} />;
}
