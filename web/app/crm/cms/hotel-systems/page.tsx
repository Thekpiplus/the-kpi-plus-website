import { redirect } from "next/navigation";
import { ensureHotelSystemsPageFromSite } from "@/lib/cms/hotel-systems-page-actions";

export default async function HotelSystemsCmsRedirect({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const id = await ensureHotelSystemsPageFromSite();
  redirect(`/crm/cms/pages/${id}${tab ? `?tab=${encodeURIComponent(tab)}` : "?tab=hero"}`);
}
