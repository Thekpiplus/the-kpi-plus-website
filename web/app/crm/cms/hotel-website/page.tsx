import { redirect } from "next/navigation";
import { ensureHotelWebsitePageFromSite } from "@/lib/cms/hotel-website-page-actions";

export default async function HotelWebsiteCmsRedirect({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const id = await ensureHotelWebsitePageFromSite();
  redirect(`/crm/cms/pages/${id}${tab ? `?tab=${encodeURIComponent(tab)}` : "?tab=hero"}`);
}
