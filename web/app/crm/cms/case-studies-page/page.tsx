import { redirect } from "next/navigation";
import { ensureCaseStudiesPageFromSite } from "@/lib/cms/case-studies-page-actions";

export default async function CaseStudiesPageCmsRedirect({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const id = await ensureCaseStudiesPageFromSite();
  redirect(`/crm/cms/pages/${id}${tab ? `?tab=${encodeURIComponent(tab)}` : "?tab=hero"}`);
}
