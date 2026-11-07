import { redirect } from "next/navigation";
import { ensureAboutPageFromSite } from "@/lib/cms/about-page-actions";

export default async function AboutUsCmsRedirect({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const id = await ensureAboutPageFromSite();
  redirect(`/crm/cms/pages/${id}${tab ? `?tab=${encodeURIComponent(tab)}` : "?tab=hero"}`);
}
