import { redirect } from "next/navigation";
import { B2bRatesPanel } from "@/components/b2b-ops/B2bOpsPanels";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { canOpenB2b } from "@/lib/b2b-ops/access";
import { listB2bPartners, listB2bTerms } from "@/lib/b2b-ops/queries";
import { requireUser } from "@/lib/crm/auth";

export default async function B2bRatesPage() {
  const user = await requireUser();
  if (!canOpenB2b(user)) redirect("/crm?error=forbidden");
  const [{ access, items }, partners] = await Promise.all([listB2bTerms(user), listB2bPartners(user, { sort: "name" })]);

  return (
    <div className="b2b-page">
      <PageHeader
        eyebrow="B2B Sales Operations"
        title="Rate & Commission"
        description="เงื่อนไขราคา ช่องทาง และคอมมิชชัน — ถูกปกปิดถ้าบัญชีนี้ไม่มีสิทธิ์เชิงพาณิชย์"
      />
      <B2bRatesPanel
        items={items}
        access={access}
        partners={partners.items.map((item) => ({ id: item.id, name: item.name }))}
      />
    </div>
  );
}
