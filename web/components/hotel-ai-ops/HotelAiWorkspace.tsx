import { redirect } from "next/navigation";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { HotelAiOpsBoard } from "@/components/hotel-ai-ops/HotelAiOpsBoard";
import { HotelAiSettingsPanel } from "@/components/hotel-ai-ops/HotelAiSettingsPanel";
import { canOpenHotelAi } from "@/lib/hotel-ai-ops/access";
import { listHotelAiAccessRows, listHotelAiWorkflows } from "@/lib/hotel-ai-ops/queries";
import { HAI_SECTION_LABEL, type HaiListFilters, type HaiSection } from "@/lib/hotel-ai-ops/types";
import { requireUser } from "@/lib/crm/auth";
import "@/components/b2b-ops/b2b-ops.css";
import "@/components/systems-ops/systems-ops.css";
import "./hotel-ai-ops.css";

const DESCRIPTIONS: Record<HaiSection, string> = {
  overview: "บอร์ดภายใน Hotel AI & Automation — สร้าง แก้ไข และบันทึกด้วยตนเอง ไม่มีการนำเข้าข้อมูล และไม่แสดงบนหน้าสาธารณะ",
  inventory: "รายการเวิร์กโฟลว์ทั้งหมด พร้อมเจ้าของ แผนก สถานะ และแนวทาง Simplify / Automate / AI-assisted",
  backlog: "งานที่ยังเป็น Backlog หรือ Discovery ก่อนเข้าสู่ไพลอต",
  pilots: "Pilot Charter, เกณฑ์คุณภาพ, จุดหยุด และคำตัดสิน Scale / Adjust / Stop",
  use_cases: "Use case ของแต่ละเวิร์กโฟลว์ บันทึกด้วยตนเอง ไม่นำเข้าข้อมูล",
  data: "ทบทวนแหล่งข้อมูลและสิทธิ์ โดยไม่เก็บคีย์ รหัสผ่าน หรือข้อมูลแขก",
  approvals: "Human review และบันทึกการอนุมัติภายใน",
  tests: "Test case, ผลที่คาดหวัง, ผลจริง และหลักฐานเป็น URL",
  issues: "Exception และ issue log โดยไม่ใส่ข้อมูลส่วนบุคคลของแขก",
  metrics: "Pilot scorecard ภายใน มี baseline, target และ actual ตามที่บันทึก",
  handover: "SOP, เจ้าของ และสถานะการส่งมอบหลังอนุมัติขยาย",
  departments: "พื้นที่ทำงานตามแผนก — Reservations, Revenue, Distribution, Marketing, Operations, Sales, Management, IT / Data",
  history: "ประวัติการสร้าง แก้ไข สถานะ และการอนุมัติ",
  settings: "แผนกที่ขยายได้ สิทธิ์ผู้ใช้ และลิงก์คลังรหัสที่อนุมัติแล้ว ไม่มีการนำเข้าข้อมูล",
};

export async function HotelAiWorkspace({
  section,
  searchParams,
}: {
  section: HaiSection;
  searchParams: Promise<HaiListFilters>;
}) {
  const user = await requireUser();
  if (!canOpenHotelAi(user)) redirect("/crm?error=forbidden");
  const filters = await searchParams;

  if (section === "settings") {
    const [{ access }, { rows, staff, settings }] = await Promise.all([
      listHotelAiWorkflows(user, filters, "overview"),
      listHotelAiAccessRows(),
    ]);
    return (
      <div className="b2b-page seo-ops-page sys-ops-page hai-ops-page">
        <PageHeader eyebrow="Hotel AI & Automation Workflow" title={HAI_SECTION_LABEL[section]} description={DESCRIPTIONS[section]} />
        <HotelAiSettingsPanel rows={rows} staff={staff} canManage={access.canManageSettings} departments={access.departments} settings={settings} />
      </div>
    );
  }

  const { access, settings, items, staff, facets, groupBy, sort } = await listHotelAiWorkflows(user, filters, section);

  return (
    <div className="b2b-page seo-ops-page sys-ops-page hai-ops-page">
      <PageHeader eyebrow="Hotel AI & Automation Workflow" title={HAI_SECTION_LABEL[section]} description={DESCRIPTIONS[section]} />
      <HotelAiOpsBoard
        section={section}
        items={items}
        staff={staff}
        access={access}
        settings={settings}
        facets={facets}
        filters={filters}
        groupBy={groupBy}
        sort={sort}
      />
    </div>
  );
}
