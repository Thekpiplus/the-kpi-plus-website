import { redirect } from "next/navigation";
import { B2bActivityQueue } from "@/components/b2b-ops/B2bActivityQueue";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { canOpenB2b } from "@/lib/b2b-ops/access";
import { listB2bActivities, listB2bPartners } from "@/lib/b2b-ops/queries";
import { requireUser } from "@/lib/crm/auth";

export default async function B2bActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; status?: string; ownerId?: string }>;
}) {
  const user = await requireUser();
  if (!canOpenB2b(user)) redirect("/crm?error=forbidden");
  const query = await searchParams;
  const [{ access, staff, items }, partners] = await Promise.all([
    listB2bActivities(user, query),
    listB2bPartners(user, { sort: "name" }),
  ]);

  return (
    <div className="b2b-page">
      <PageHeader
        eyebrow="B2B Sales Operations"
        title="Activities / Follow-up"
        description="งานติดตามของพาร์ตเนอร์ทั้งหมด แยกจากหน้า B2B สาธารณะ — Sales บันทึก ซับงาน และปิดงานได้"
      />
      <B2bActivityQueue
        items={items}
        access={access}
        staff={staff}
        partners={partners.items.map((item) => ({ id: item.id, name: item.name, hotels: item.hotels }))}
        filters={query}
      />
    </div>
  );
}
