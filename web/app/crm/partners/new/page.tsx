import { redirect } from "next/navigation";

export default async function NewPartnerPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const query = new URLSearchParams({ newPartner: "1" });
  if (error) query.set("error", error);
  redirect(`/crm/partners?${query.toString()}`);
}
