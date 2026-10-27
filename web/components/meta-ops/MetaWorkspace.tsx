import { redirect } from "next/navigation";
import { MetaOpsBoard } from "@/components/meta-ops/MetaOpsBoard";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { canOpenMeta } from "@/lib/meta-ops/access";
import { listMetaCampaigns, type MetaListFilters } from "@/lib/meta-ops/queries";
import { META_SECTION_LABEL, type MetaSection } from "@/lib/meta-ops/types";
import { requireUser } from "@/lib/crm/auth";

const DESCRIPTIONS: Record<MetaSection, string> = {
  campaigns: "บอร์ดภายในสำหรับสร้าง แก้ไข และติดตามแคมเปญ Meta Ads ด้วยตนเอง ไม่มีการนำเข้าข้อมูล และไม่แสดงบนหน้าสาธารณะ",
  audiences: "กลุ่มเป้าหมายของแคมเปญ — บันทึก segment ด้วยตนเอง รหัสออดิเอนซ์และ Pixel ถูกปกปิดตามสิทธิ์",
  "creative-matrix": "แมทริกซ์ครีเอทีฟของแต่ละแคมเปญ อ้างอิงและบันทึกชุดโฆษณาด้วยตนเอง",
  ads: "บอร์ด Meta Ads ทั้งหมด จัดกลุ่มตามประเภทแคมเปญ Awareness, Consideration, Lead, Direct Booking, Remarketing",
  remarketing: "แคมเปญ Remarketing ภายใน",
  "landing-pages": "ตรวจ URL หน้าปลายทาง และระบบจองของแต่ละแคมเปญ",
  tracking: "สถานะการวัดผลของแคมเปญภายใน Pixel ID ถูกปกปิดตามสิทธิ์",
  optimization: "บันทึกการ optimize และกิจกรรมต่อแคมเปญ",
  reports: "KPI และรายงานภายใน ข้อมูลตัวอย่างมีป้าย Sample data",
  approvals: "คิวแคมเปญที่รออนุมัติ",
  settings: "สิทธิ์แผนก Marketing, Revenue, Distribution, Sales, Management และข้อมูลบัญชี/งบ",
};

export async function MetaWorkspace({
  section,
  searchParams,
}: {
  section: MetaSection;
  searchParams: Promise<MetaListFilters>;
}) {
  const user = await requireUser();
  if (!canOpenMeta(user)) redirect("/crm?error=forbidden");
  const filters = await searchParams;
  const { access, items, staff, facets, groupBy, sort } = await listMetaCampaigns(user, filters, section);

  return (
    <div className="b2b-page ads-ops meta-ops">
      <PageHeader eyebrow="Campaign Operations" title={META_SECTION_LABEL[section]} description={DESCRIPTIONS[section]} />
      <MetaOpsBoard
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
