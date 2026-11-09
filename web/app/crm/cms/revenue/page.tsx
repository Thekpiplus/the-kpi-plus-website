import { redirect } from "next/navigation";
import { ensureRevenuePageFromSite } from "@/lib/cms/revenue-page-actions";

export default async function RevenueCmsRedirect({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const id = await ensureRevenuePageFromSite("th");
  redirect(`/crm/cms/pages/${id}${tab ? `?tab=${encodeURIComponent(tab)}` : "?tab=hero"}`);
}
