import { redirect } from "next/navigation";
import { ensureB2bPageFromSite } from "@/lib/cms/b2b-page-actions";

export default async function B2bCmsRedirect({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const id = await ensureB2bPageFromSite();
  redirect(`/crm/cms/pages/${id}${tab ? `?tab=${encodeURIComponent(tab)}` : "?tab=hero"}`);
}
