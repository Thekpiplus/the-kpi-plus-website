import { redirect } from "next/navigation";
import { ensureIndependentHotelPageFromSite } from "@/lib/cms/independent-hotel-page-actions";

export default async function IndependentHotelCmsRedirect({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const id = await ensureIndependentHotelPageFromSite();
  redirect(`/crm/cms/pages/${id}${tab ? `?tab=${encodeURIComponent(tab)}` : "?tab=hero"}`);
}
