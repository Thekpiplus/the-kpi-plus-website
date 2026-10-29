import { redirect } from "next/navigation";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { ManagementOpsBoard } from "@/components/management-ops/ManagementOpsBoard";
import { ManagementSettingsPanel } from "@/components/management-ops/ManagementSettingsPanel";
import { canOpenManagement } from "@/lib/management-ops/access";
import { listManagementAccessRows, listManagementProjects } from "@/lib/management-ops/queries";
import { MGMT_SECTION_LABEL, type MgmtListFilters, type MgmtSection } from "@/lib/management-ops/types";
import { requireUser } from "@/lib/crm/auth";
import "./management-ops.css";

const DESCRIPTIONS: Record<MgmtSection, string> = {
  overview: "ภาพรวมงาน Independent Hotel Operations ภายใน ไม่มีการนำเข้าข้อมูล และไม่แสดงบนหน้าสาธารณะ",
  properties: "บอร์ดทรัพย์สินโรงแรม สถานะ เจ้าของ แผนก และ next action",
  assessments: "งานประเมิน Direction, Commercial, Operations, People, Guest Experience และ Measurement",
  plans: "แผน First 30 / 31–60 / 61–90 วัน และงาน ongoing ที่โรงแรมอนุมัติ",
  commercial: "งาน Commercial / Revenue ที่แผนก Revenue และ Sales ขยายได้",
  marketing: "งาน Marketing ของโรงแรมอิสระ ขยายตามแผนกได้",
  distribution: "งาน Distribution ช่องทางและความพร้อมของระบบที่โรงแรมเป็นเจ้าของ",
  operations: "งาน Operations จังหวะปฏิบัติการโดยไม่แทนที่ GM",
  guest: "งาน Guest Experience มาตรฐานบริการ ไม่เก็บข้อมูลส่วนตัวของแขก",
  people: "บทบาทและวิธีทำงานร่วมกัน การจ้างงานยังเป็นของโรงแรม",
  meetings: "จังหวะประชุม Weekly / Monthly / Quarterly / Ad hoc",
  kpi: "KPI ภายใน มีช่วงเวลา นิยาม แหล่งที่มา และสถานะข้อมูล ไม่ใช่ผลสาธารณะ",
  actions: "บันทึกการกระทำ เจ้าของ แผนก ความสำคัญ และกำหนดส่ง",
  approvals: "รายการรออนุมัติจากโรงแรม ผู้จัดการ และฝ่ายที่เกี่ยวข้อง",
  handover: "กรรมสิทธิ์ข้อมูลและการส่งมอบหลังทำงาน",
  settings: "แผนกที่ขยายได้: Marketing, Revenue, Distribution, Sales และ Management แต่ละสายงานมีงานย่อย 1–10 รายการ พร้อมมอบหมาย เปลี่ยนแผนก สถานะ ความเห็น และหลักฐาน",
};

export async function ManagementWorkspace({
  section,
  searchParams,
}: {
  section: MgmtSection;
  searchParams: Promise<MgmtListFilters>;
}) {
  const user = await requireUser();
  if (!canOpenManagement(user)) redirect("/crm?error=forbidden");
  const filters = await searchParams;

  if (section === "settings") {
    const [{ access }, { rows, staff }] = await Promise.all([listManagementProjects(user, filters, "properties"), listManagementAccessRows()]);
    return (
      <div className="b2b-page seo-ops-page mgmt-ops-page">
        <PageHeader eyebrow="Hotel Management Operations" title={MGMT_SECTION_LABEL[section]} description={DESCRIPTIONS[section]} />
        <ManagementSettingsPanel rows={rows} staff={staff} canManage={access.canManageSettings} departments={access.departments} />
      </div>
    );
  }

  const { access, items, staff, facets, groupBy, sort } = await listManagementProjects(user, filters, section);

  return (
    <div className="b2b-page seo-ops-page mgmt-ops-page">
      <PageHeader eyebrow="Hotel Management Operations" title={MGMT_SECTION_LABEL[section]} description={DESCRIPTIONS[section]} />
      <ManagementOpsBoard
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
