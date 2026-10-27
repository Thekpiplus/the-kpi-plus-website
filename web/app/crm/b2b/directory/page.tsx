import { redirect } from "next/navigation";
import { B2bDirectory } from "@/components/b2b-ops/B2bOpsPanels";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { canOpenB2b } from "@/lib/b2b-ops/access";
import { listB2bPartners } from "@/lib/b2b-ops/queries";
import { requireUser } from "@/lib/crm/auth";

export default async function B2bDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await requireUser();
  if (!canOpenB2b(user)) redirect("/crm?error=forbidden");
  const filters = await searchParams;
  const { items } = await listB2bPartners(user, { q: filters.q, sort: "name" });

  return (
    <div className="b2b-page">
      <PageHeader
        eyebrow="B2B Sales Operations"
        title="Partner Directory"
        description="รายชื่อพาร์ตเนอร์ทั้งหมดที่สร้างในระบบภายใน"
      />
      <form className="b2b-filters" method="get">
        <input className="crm-field" name="q" defaultValue={filters.q ?? ""} placeholder="ค้นหาชื่อหรือตลาด" />
        <button className="crm-users-secondary" type="submit">
          ค้นหา
        </button>
      </form>
      <B2bDirectory items={items} />
    </div>
  );
}
