import { redirect } from "next/navigation";
import { B2bOpsBoard } from "@/components/b2b-ops/B2bOpsBoard";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { canOpenB2b } from "@/lib/b2b-ops/access";
import { listB2bPartners } from "@/lib/b2b-ops/queries";
import { requireUser } from "@/lib/crm/auth";

export default async function B2bPipelinePage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    ownerId?: string;
    department?: string;
    market?: string;
    hotel?: string;
    sort?: string;
    group?: string;
    view?: string;
  }>;
}) {
  const user = await requireUser();
  if (!canOpenB2b(user)) redirect("/crm?error=forbidden");
  const filters = await searchParams;
  const { access, items, staff, facets } = await listB2bPartners(user, filters);

  return (
    <div className="b2b-page">
      <PageHeader
        eyebrow="B2B Sales Operations"
        title="Partner Pipeline"
        description="บอร์ดภายในสำหรับติดตามพาร์ตเนอร์ท่องเที่ยว — สร้าง แก้ไข และบันทึกด้วยตนเอง ไม่มีการนำเข้าข้อมูล"
      />
      <B2bOpsBoard items={items} staff={staff} access={access} facets={facets} filters={filters} />
    </div>
  );
}
