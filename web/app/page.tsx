import { notFound } from "next/navigation";
import { HomeView } from "@/components/HomeView";
import { isCmsPageLive, storedPageByPath } from "@/lib/cms/public";
import { metadataFor } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = metadataFor("/");

export default async function HomePage() {
  const stored = await storedPageByPath("/");
  if (stored && !isCmsPageLive(stored)) notFound();
  return <HomeView locale="th" />;
}
