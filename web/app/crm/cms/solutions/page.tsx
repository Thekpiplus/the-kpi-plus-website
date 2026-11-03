import { redirect } from "next/navigation";
import { ensureSolutionsIndexPageFromSite } from "@/lib/cms/solutions-index-page-actions";

export default async function SolutionsIndexCmsRedirect({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const id = await ensureSolutionsIndexPageFromSite();
  redirect(`/crm/cms/pages/${id}${tab ? `?tab=${encodeURIComponent(tab)}` : "?tab=hero"}`);
}
