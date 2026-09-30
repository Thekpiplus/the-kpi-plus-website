import { NewLeadForm } from "@/components/crm/NewLeadForm";
import { currentUser } from "@/lib/crm/auth";
import { prisma } from "@/lib/crm/db";
import { staffDirectory } from "@/lib/crm/queries";

export default async function NewLeadPage({
  searchParams,
}: {
  searchParams: Promise<{ duplicate?: string; error?: string }>;
}) {
  const { duplicate, error } = await searchParams;
  const [partners, owners, user] = await Promise.all([
    prisma()
      .partner.findMany({
        where: { status: { in: ["active", "pending"] } },
        orderBy: { displayName: "asc" },
        select: { id: true, displayName: true, tier: true },
      })
      .catch(() => []),
    staffDirectory(),
    currentUser(),
  ]);
  return (
    <NewLeadForm
      partners={partners}
      owners={owners}
      currentUserId={user?.id}
      duplicateId={duplicate}
      error={error}
    />
  );
}
