import { redirect } from "next/navigation";
import { ensureHotelAiPageFromSite } from "@/lib/cms/hotel-ai-page-actions";

export default async function HotelAiCmsRedirect({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const id = await ensureHotelAiPageFromSite();
  redirect(`/crm/cms/pages/${id}${tab ? `?tab=${encodeURIComponent(tab)}` : "?tab=hero"}`);
}
