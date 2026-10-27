import { redirect } from "next/navigation";
import { ensureGoogleAdsPageFromSite } from "@/lib/cms/google-ads-page-actions";

export default async function GoogleAdsCmsRedirect({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const id = await ensureGoogleAdsPageFromSite();
  redirect(`/crm/cms/pages/${id}${tab ? `?tab=${encodeURIComponent(tab)}` : "?tab=hero"}`);
}
