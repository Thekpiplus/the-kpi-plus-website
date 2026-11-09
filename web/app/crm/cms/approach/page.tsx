import { redirect } from "next/navigation";
import { ensureApproachPageFromSite } from "@/lib/cms/approach-page-actions";

export default async function ApproachPageCmsRedirect({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const id = await ensureApproachPageFromSite();
  redirect(`/crm/cms/pages/${id}${tab ? `?tab=${encodeURIComponent(tab)}` : "?tab=hero"}`);
}
