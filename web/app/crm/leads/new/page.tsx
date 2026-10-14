import { redirect } from "next/navigation";

export default async function NewLeadPage({
  searchParams,
}: {
  searchParams: Promise<{ duplicate?: string; error?: string }>;
}) {
  const { duplicate, error } = await searchParams;
  const query = new URLSearchParams({ newLead: "1" });
  if (duplicate) query.set("duplicate", duplicate);
  if (error) query.set("error", error);
  redirect(`/crm/leads?${query.toString()}`);
}