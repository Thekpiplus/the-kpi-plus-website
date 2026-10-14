import { redirect } from "next/navigation";

export default async function NewUserPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  if (error) redirect(`/crm/users?new=1&error=${encodeURIComponent(error)}`);
  redirect("/crm/users?new=1");
}
