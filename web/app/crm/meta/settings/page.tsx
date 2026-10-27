import { redirect } from "next/navigation";
import { MetaSettingsPanel } from "@/components/meta-ops/MetaSettingsPanel";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { metaAccessFor, canOpenMeta } from "@/lib/meta-ops/access";
import { listMetaAccessRows } from "@/lib/meta-ops/queries";
import { requireUser } from "@/lib/crm/auth";

export default async function AdsSettingsPage() {
  const user = await requireUser();
  if (!canOpenMeta(user)) redirect("/crm?error=forbidden");
  const [access, { rows, staff }] = await Promise.all([metaAccessFor(user), listMetaAccessRows()]);

  return (
    <div className="b2b-page">
      <PageHeader
        eyebrow="Meta Ads Operations"
        title="Settings"
        description="กำหนดแผนก Marketing, Revenue, Distribution, Sales, Management และสิทธิ์เห็นบัญชีโฆษณาหรืองบ รหัสบัญชีลูกค้า, Pixel ID, billing และข้อมูลออดิเอนซ์ไม่แสดงต่อผู้ไม่มีสิทธิ์"
      />
      <MetaSettingsPanel rows={rows} staff={staff} canManage={access.canManageSettings} />
    </div>
  );
}
