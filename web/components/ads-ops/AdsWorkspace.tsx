import { redirect } from "next/navigation";
import { AdsOpsBoard } from "@/components/ads-ops/AdsOpsBoard";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { canOpenAds } from "@/lib/ads-ops/access";
import { listAdsCampaigns, type AdsListFilters } from "@/lib/ads-ops/queries";
import { ADS_SECTION_LABEL, type AdsSection } from "@/lib/ads-ops/types";
import { requireUser } from "@/lib/crm/auth";

const DESCRIPTIONS: Record<AdsSection, string> = {
  campaigns: "บอร์ดภายในสำหรับสร้าง แก้ไข และติดตามแคมเปญด้วยตนเอง ไม่มีการนำเข้าข้อมูล และไม่แสดงบนหน้าสาธารณะ",
  search: "แคมเปญ Search Ads ภายใน — ดู จัดกลุ่ม และบันทึกงานของช่องทางนี้เท่านั้น",
  hotel: "แคมเปญ Hotel Ads ภายใน",
  "free-links": "งาน Free Booking Links ภายใน",
  "landing-pages": "ตรวจ URL หน้าปลายทางและระบบจองของแต่ละแคมเปญ",
  tracking: "สถานะการวัดผลและ conversion ของแคมเปญภายใน",
  optimization: "บันทึกการ optimize และกิจกรรมต่อแคมเปญ",
  reports: "KPI และรายงานภายใน ข้อมูลตัวอย่างมีป้าย Sample data",
  approvals: "คิวแคมเปญที่รออนุมัติ",
  settings: "สิทธิ์แผนกและข้อมูลบัญชี/งบ",
};

export async function AdsWorkspace({
  section,
  searchParams,
}: {
  section: AdsSection;
  searchParams: Promise<AdsListFilters>;
}) {
  const user = await requireUser();
  if (!canOpenAds(user)) redirect("/crm?error=forbidden");
  const filters = await searchParams;
  const { access, items, staff, facets, groupBy, sort } = await listAdsCampaigns(user, filters, section);

  return (
    <div className="b2b-page ads-ops">
      <PageHeader eyebrow="Campaign Operations" title={ADS_SECTION_LABEL[section]} description={DESCRIPTIONS[section]} />
      <AdsOpsBoard
        section={section}
        items={items}
        staff={staff}
        access={access}
        facets={facets}
        filters={filters}
        groupBy={groupBy}
        sort={sort}
      />
    </div>
  );
}
