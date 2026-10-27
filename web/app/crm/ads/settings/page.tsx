import { redirect } from "next/navigation";
import { AdsSettingsPanel } from "@/components/ads-ops/AdsSettingsPanel";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { adsAccessFor, canOpenAds } from "@/lib/ads-ops/access";
import { listAdsAccessRows } from "@/lib/ads-ops/queries";
import { requireUser } from "@/lib/crm/auth";

export default async function AdsSettingsPage() {
  const user = await requireUser();
  if (!canOpenAds(user)) redirect("/crm?error=forbidden");
  const [access, { rows, staff }] = await Promise.all([adsAccessFor(user), listAdsAccessRows()]);

  return (
    <div className="b2b-page">
      <PageHeader
        eyebrow="Google Ads Operations"
        title="Settings"
        description="กำหนดแผนก Marketing, Revenue, Distribution, Sales, Management และสิทธิ์เห็นบัญชีโฆษณาหรืองบ รหัสบัญชีลูกค้าและ billing ไม่แสดงต่อผู้ไม่มีสิทธิ์"
      />
      <AdsSettingsPanel rows={rows} staff={staff} canManage={access.canManageSettings} />
    </div>
  );
}
