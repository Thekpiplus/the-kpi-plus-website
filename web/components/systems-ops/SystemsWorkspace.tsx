import { redirect } from "next/navigation";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { SystemsOpsBoard } from "@/components/systems-ops/SystemsOpsBoard";
import { SystemsSettingsPanel } from "@/components/systems-ops/SystemsSettingsPanel";
import { canOpenSystems } from "@/lib/systems-ops/access";
import { listSystemsAccessRows, listSystemsProjects } from "@/lib/systems-ops/queries";
import { SYS_SECTION_LABEL, type SysListFilters, type SysSection } from "@/lib/systems-ops/types";
import { requireUser } from "@/lib/crm/auth";
import "./systems-ops.css";

const DESCRIPTIONS: Record<SysSection, string> = {
  overview: "บอร์ดภายใน Hotel Systems Operations — สร้าง แก้ไข และบันทึกด้วยตนเอง ไม่มีการนำเข้าข้อมูล และไม่แสดงบนหน้าสาธารณะ",
  properties: "โรงแรมและโปรเจกต์ระบบ พร้อม PMS, Channel Manager, Booking Engine และวันที่ Go-live",
  inventory: "สำรวจระบบที่ใช้จริง ผู้ให้บริการ เจ้าของ ข้อมูลเข้า-ออก และสถานะการเชื่อมต่อ โดยไม่เก็บรหัสผ่าน",
  architecture: "โหนด แหล่งข้อมูล ปลายทาง ทิศทาง และความถี่ของ data flow",
  mapping: "จับคู่ฟิลด์ต้นทาง-ปลายทาง ความหมายทางธุรกิจ และสถานะ mapping",
  readiness: "ความพร้อมด้านระบบ ข้อมูล สิทธิ์ การเชื่อมต่อ การทดสอบ และกรรมสิทธิ์",
  configuration: "ขั้นตอนการตั้งค่าตามสิทธิ์ที่ได้รับ ไม่เก็บคีย์หรือโทเคน",
  testing: "Test Case, ผลที่คาดหวัง, ผลจริง, ความรุนแรง และวันที่ทดสอบซ้ำ",
  issues: "บันทึกข้อผิดพลาดและปัญหา Open / In Progress / Blocked / Retest / Resolved / Closed",
  distribution: "Booking Engine / Distribution — ช่องทาง ห้องว่าง และเส้นทางจอง โดยไม่เก็บรหัสการจอง",
  analytics: "Analytics and Reporting ภายใน มีนิยาม แหล่งที่มา และสถานะข้อมูล",
  handover: "กรรมสิทธิ์ Website, PMS, Channel Manager, Booking Engine, Analytics และระดับสิทธิ์ ไม่เก็บรหัสผ่าน",
  approvals: "รายการรออนุมัติจากโรงแรมและผู้ให้บริการระบบ",
  kpi: "Reports / KPI ภายใน มีช่วงเวลา นิยาม แหล่งที่มา และสถานะข้อมูล ไม่ใช่ผลสาธารณะ",
  settings: "แผนกที่ขยายได้: Marketing, Revenue, Distribution, Sales และ Management แต่ละแผนกมีงานย่อย 1–10 รายการ พร้อมมอบหมาย เปลี่ยนแผนก สถานะ ความเห็น และหลักฐาน",
};

export async function SystemsWorkspace({
  section,
  searchParams,
}: {
  section: SysSection;
  searchParams: Promise<SysListFilters>;
}) {
  const user = await requireUser();
  if (!canOpenSystems(user)) redirect("/crm?error=forbidden");
  const filters = await searchParams;

  if (section === "settings") {
    const [{ access }, { rows, staff }] = await Promise.all([listSystemsProjects(user, filters, "properties"), listSystemsAccessRows()]);
    return (
      <div className="b2b-page seo-ops-page sys-ops-page">
        <PageHeader eyebrow="Hotel Systems Operations" title={SYS_SECTION_LABEL[section]} description={DESCRIPTIONS[section]} />
        <SystemsSettingsPanel rows={rows} staff={staff} canManage={access.canManageSettings} departments={access.departments} />
      </div>
    );
  }

  const { access, items, staff, facets, groupBy, sort } = await listSystemsProjects(user, filters, section);

  return (
    <div className="b2b-page seo-ops-page sys-ops-page">
      <PageHeader eyebrow="Hotel Systems Operations" title={SYS_SECTION_LABEL[section]} description={DESCRIPTIONS[section]} />
      <SystemsOpsBoard
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
