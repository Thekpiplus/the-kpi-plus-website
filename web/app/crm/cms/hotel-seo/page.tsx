import { redirect } from "next/navigation";
import { ensureHotelSeoPageFromSite } from "@/lib/cms/hotel-seo-page-actions";

export default async function HotelSeoCmsRedirect({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const id = await ensureHotelSeoPageFromSite();
  redirect(`/crm/cms/pages/${id}${tab ? `?tab=${encodeURIComponent(tab)}` : "?tab=hero"}`);
}
