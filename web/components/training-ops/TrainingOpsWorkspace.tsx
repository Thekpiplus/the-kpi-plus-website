import { redirect } from "next/navigation";
import { OverviewHero } from "@/components/crm/ui/OverviewHero";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { TrainingOpsBoard } from "@/components/training-ops/TrainingOpsBoard";
import { TrainingOpsSettingsPanel } from "@/components/training-ops/TrainingOpsSettingsPanel";
import { canOpenTrainingOps } from "@/lib/training-ops/access";
import { listTrainingOpsAccessRows, listTrainingOpsRecords } from "@/lib/training-ops/queries";
import { TRN_SECTION_LABEL, type TrnListFilters, type TrnSection } from "@/lib/training-ops/types";
import { requireUser } from "@/lib/crm/auth";
import "@/components/b2b-ops/b2b-ops.css";
import "./training-ops.css";

const DESCRIPTIONS: Record<TrnSection, string> = {
  overview: "บอร์ดภายใน Hotel Training Operations — สร้าง แก้ไข และบันทึกด้วยตนเอง ไม่มีการนำเข้าข้อมูล และไม่แสดงบนหน้าสาธารณะ",
  requests: "คำขออบรมจากโรงแรม แผนก เจ้าของ และผู้อนุมัติ",
  calendar: "ปฏิทินรอบอบรม จัดกลุ่มตามวันที่",
  programs: "หลักสูตรและกิจกรรม สถานะ Draft / Review / Approved / Published / Archived",
  groups: "กลุ่มผู้เรียนตามบทบาท ไม่เก็บรายชื่อในช่องสาธารณะ",
  needs: "แบบสำรวจความต้องการและรายการตรวจเอง",
  materials: "วาระและสื่อประกอบ ไม่ใส่เอกสารลับในช่องเปิด",
  sessions: "รอบอบรม การเข้าเรียนแบบผลรวม และแผนกิจกรรม",
  assessment: "การประเมินผลรวม รูบริก และระดับการมองเห็น",
  followup: "แผนทดลองใช้ที่หน้างานหลังอบรม",
  trainers: "ทำเนียบวิทยากร วุฒิบัตรแสดงเมื่อยืนยันแล้ว",
  departments: "พื้นที่ทำงานตามแผนก รวม HR / Learning & Development",
  feedback: "ผลลัพธ์และข้อคิดเห็นแบบผลรวม",
  reports: "รายงาน KPI ภายใน มีนิยาม วิธี และช่วงวัด",
  approvals: "คิวอนุมัติคำขอ โปรแกรม และแผนติดตาม",
  history: "ประวัติการสร้าง แก้ไข สถานะ และการอนุมัติ",
  settings: "แผนกที่ขยายได้และสิทธิ์ผู้ใช้ ไม่มีการนำเข้าข้อมูล",
};

function TrainingSectionChrome({ section }: { section: TrnSection }) {
  const eyebrow = "Hotel Training Operations";
  const title = TRN_SECTION_LABEL[section];
  const description = DESCRIPTIONS[section];
  if (section === "overview") {
    return <OverviewHero variant="compact" eyebrow={eyebrow} title={title} description={description} label={title} />;
  }
  return <PageHeader eyebrow={eyebrow} title={title} description={description} />;
}

export async function TrainingOpsWorkspace({
  section,
  searchParams,
}: {
  section: TrnSection;
  searchParams: Promise<TrnListFilters>;
}) {
  const user = await requireUser();
  if (!canOpenTrainingOps(user)) redirect("/crm?error=forbidden");
  const filters = await searchParams;

  if (section === "settings") {
    const { rows, staff, settings } = await listTrainingOpsAccessRows();
    const { access } = await listTrainingOpsRecords(user, filters, "overview");
    return (
      <div className="b2b-page seo-ops-page trn-ops-page">
        <PageHeader eyebrow="Hotel Training Operations" title={TRN_SECTION_LABEL[section]} description={DESCRIPTIONS[section]} />
        <TrainingOpsSettingsPanel rows={rows} staff={staff} canManage={access.canManageSettings} settings={settings} />
      </div>
    );
  }

  const { access, settings, items, staff, facets, programOptions, groupBy, sort } = await listTrainingOpsRecords(user, filters, section);

  return (
    <div className="b2b-page seo-ops-page trn-ops-page">
      <TrainingSectionChrome section={section} />
      <TrainingOpsBoard
        section={section}
        items={items}
        staff={staff}
        access={access}
        settings={settings}
        facets={facets}
        programOptions={programOptions}
        filters={filters}
        groupBy={groupBy}
        sort={sort}
      />
    </div>
  );
}
