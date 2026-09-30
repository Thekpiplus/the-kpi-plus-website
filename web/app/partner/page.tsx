import { PartnerProgramView } from "@/components/PartnerProgramView";
import { metadataFor } from "@/lib/seo";

export const metadata = metadataFor("/partner");

export default async function PartnerPage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { sent, error } = await searchParams;
  return <PartnerProgramView sent={sent === "1"} error={error} />;
}
