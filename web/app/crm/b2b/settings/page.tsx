import { redirect } from "next/navigation";
import { B2bSettingsPanel } from "@/components/b2b-ops/B2bOpsPanels";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { b2bAccessFor, canOpenB2b } from "@/lib/b2b-ops/access";
import { listB2bAccessRows } from "@/lib/b2b-ops/queries";
import { requireUser } from "@/lib/crm/auth";

export default async function B2bSettingsPage() {
  const user = await requireUser();
  if (!canOpenB2b(user)) redirect("/crm?error=forbidden");
  const [access, { rows, staff }] = await Promise.all([b2bAccessFor(user), listB2bAccessRows()]);

  return (
    <div className="b2b-page">
      <PageHeader
        eyebrow="B2B Sales Operations"
        title="Settings"
        description="กำหนดแผนกและสิทธิ์ข้อมูลอ่อนไหวต่อผู้ใช้โมดูลนี้"
      />
      <B2bSettingsPanel rows={rows} staff={staff} canManage={access.canManageSettings} />
    </div>
  );
}
