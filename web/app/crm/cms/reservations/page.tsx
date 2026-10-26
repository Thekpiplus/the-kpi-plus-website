import { redirect } from "next/navigation";
import { ensureReservationsPageFromSite } from "@/lib/cms/reservations-page-actions";

export default async function ReservationsCmsRedirect({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const id = await ensureReservationsPageFromSite();
  redirect(`/crm/cms/pages/${id}${tab ? `?tab=${encodeURIComponent(tab)}` : "?tab=boundaries"}`);
}
