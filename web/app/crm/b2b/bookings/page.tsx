import { redirect } from "next/navigation";
import { B2bBookingsPanel } from "@/components/b2b-ops/B2bOpsPanels";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { canOpenB2b } from "@/lib/b2b-ops/access";
import { listB2bBookings, listB2bPartners } from "@/lib/b2b-ops/queries";
import { requireUser } from "@/lib/crm/auth";

export default async function B2bBookingsPage() {
  const user = await requireUser();
  if (!canOpenB2b(user)) redirect("/crm?error=forbidden");
  const [{ access, items }, partners] = await Promise.all([listB2bBookings(user), listB2bPartners(user, { sort: "name" })]);

  return (
    <div className="b2b-page">
      <PageHeader
        eyebrow="B2B Sales Operations"
        title="Booking Outcomes"
        description="ผลจองที่ทีมบันทึกเองต่อพาร์ตเนอร์ — ไม่ดึงจากระบบจองภายนอก"
      />
      <B2bBookingsPanel
        items={items}
        access={access}
        partners={partners.items.map((item) => ({ id: item.id, name: item.name }))}
      />
    </div>
  );
}
