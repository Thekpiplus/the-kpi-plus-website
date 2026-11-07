import { redirect } from "next/navigation";
import { ensureContactPageFromSite } from "@/lib/cms/contact-page-actions";

export default async function ContactUsCmsRedirect({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const id = await ensureContactPageFromSite();
  redirect(`/crm/cms/pages/${id}${tab ? `?tab=${encodeURIComponent(tab)}` : "?tab=hero"}`);
}
