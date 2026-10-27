import { notFound, redirect } from "next/navigation";
import { B2bPartnerForm } from "@/components/b2b-ops/B2bPartnerForm";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { canOpenB2b } from "@/lib/b2b-ops/access";
import { getB2bPartner } from "@/lib/b2b-ops/queries";
import { requireUser } from "@/lib/crm/auth";

export default async function B2bPartnerDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const user = await requireUser();
  if (!canOpenB2b(user)) redirect("/crm?error=forbidden");
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const data = await getB2bPartner(user, id);
  if (!data) notFound();

  return (
    <div className="b2b-page">
      <PageHeader
        eyebrow="B2B Sales Operations"
        title={data.partner.name}
        description="ฟอร์มรายละเอียดพาร์ตเนอร์ แยกแท็บตามงาน และบันทึกทีละส่วน"
      />
      <B2bPartnerForm partner={data.partner} staff={data.staff} access={data.access} initialTab={query.tab} />
    </div>
  );
}
