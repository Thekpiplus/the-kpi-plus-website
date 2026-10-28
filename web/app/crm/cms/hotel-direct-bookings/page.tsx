import { redirect } from "next/navigation";
import { ensureDirectBookingPageFromSite } from "@/lib/cms/hotel-direct-bookings-page-actions";

export default async function HotelDirectBookingsCmsRedirect({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const id = await ensureDirectBookingPageFromSite();
  redirect(`/crm/cms/pages/${id}${tab ? `?tab=${encodeURIComponent(tab)}` : "?tab=hero"}`);
}
