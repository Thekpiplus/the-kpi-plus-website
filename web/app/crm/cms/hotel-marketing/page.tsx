import { redirect } from "next/navigation";
import { ensureHotelMarketingInsightFromSite } from "@/lib/cms/hotel-marketing-insight-actions";

export default async function HotelMarketingCmsRedirect({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const id = await ensureHotelMarketingInsightFromSite();
  const params = new URLSearchParams({ editor: "structured", tab: tab || "basics" });
  redirect(`/crm/cms/insights/${id}?${params.toString()}`);
}
