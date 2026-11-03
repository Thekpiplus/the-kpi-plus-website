import { redirect } from "next/navigation";
import { ensureHotelTrainingPageFromSite } from "@/lib/cms/hotel-training-page-actions";

export default async function HotelTrainingCmsRedirect({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const id = await ensureHotelTrainingPageFromSite();
  redirect(`/crm/cms/pages/${id}${tab ? `?tab=${encodeURIComponent(tab)}` : "?tab=hero"}`);
}
