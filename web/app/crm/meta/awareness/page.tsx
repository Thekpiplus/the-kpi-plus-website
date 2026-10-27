import { redirect } from "next/navigation";

export default async function MetaAwarenessRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    const text = Array.isArray(value) ? value[0] : value;
    if (text) query.set(key, text);
  });
  query.set("channel", "awareness");
  redirect(`/crm/meta/ads?${query.toString()}`);
}
