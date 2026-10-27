import { redirect } from "next/navigation";
import { B2bReportsView } from "@/components/b2b-ops/B2bOpsPanels";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { canOpenB2b } from "@/lib/b2b-ops/access";
import { b2bReportStats } from "@/lib/b2b-ops/queries";
import { requireUser } from "@/lib/crm/auth";

export default async function B2bReportsPage() {
  const user = await requireUser();
  if (!canOpenB2b(user)) redirect("/crm?error=forbidden");
  const stats = await b2bReportStats();

  return (
    <div className="b2b-page">
      <PageHeader
        eyebrow="B2B Sales Operations"
        title="Reports / KPI"
        description="นับจากรายการที่บันทึกในระบบเท่านั้น ไม่มีการสมมุติตัวเลข"
      />
      <B2bReportsView stats={stats} />
    </div>
  );
}
