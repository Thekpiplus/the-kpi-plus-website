import { redirect } from "next/navigation";
import { ensureMetaAdsPageFromSite } from "@/lib/cms/meta-ads-page-actions";

export default async function MetaAdsCmsRedirect({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const id = await ensureMetaAdsPageFromSite();
  redirect(`/crm/cms/pages/${id}${tab ? `?tab=${encodeURIComponent(tab)}` : "?tab=hero"}`);
}
