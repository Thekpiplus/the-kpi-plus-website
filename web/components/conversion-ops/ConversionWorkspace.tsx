import { redirect } from "next/navigation";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { ConversionOpsBoard } from "@/components/conversion-ops/ConversionOpsBoard";
import { ConversionSettingsPanel } from "@/components/conversion-ops/ConversionSettingsPanel";
import { canOpenConversion } from "@/lib/conversion-ops/access";
import { listConversionAccessRows, listConversionProjects } from "@/lib/conversion-ops/queries";
import { CONV_SECTION_LABEL, type ConvListFilters, type ConvSection } from "@/lib/conversion-ops/types";
import { requireUser } from "@/lib/crm/auth";
import "./conversion-ops.css";

const DESCRIPTIONS: Record<ConvSection, string> = {
  project: "บอร์ดภายในสำหรับงาน Direct Booking ไม่มีการนำเข้าข้อมูล และไม่แสดงบนหน้าสาธารณะ",
  review: "งาน Website Review ของหน้าเว็บ มือถือ และเส้นทางก่อนเข้าสู่ระบบจอง",
  room: "งาน Room and Offer Information ให้ลูกค้าเปรียบเทียบห้อง ราคา และนโยบายได้ก่อนจอง",
  friction: "งาน Conversion Friction จุดติดขัดใน Funnel พร้อมหลักฐานและการวัด",
  booking: "งาน Booking Engine รหัสบัญชีถูกปกปิดตามสิทธิ์ การคลิกจองยังไม่ใช่การจองสำเร็จ",
  mobile: "งาน Mobile UX ของปุ่มจอง เมนู และเส้นทางบนมือถือ",
  tracking: "งาน Tracking and Analytics แยก Visit, Room Interest, Booking Start และ Booking Complete",
  experiments: "งาน Experiments / Changes จากหลักฐานที่มี ไม่สัญญายอดจองล่วงหน้า",
  reports: "KPI ภายใน ไม่ใช่ผลโรงแรมสาธารณะ Booking Complete ต้องมีข้อมูลที่ยืนยันได้",
  approvals: "คิวอนุมัติของโรงแรมและฝ่ายจัดการ",
  handover: "งาน Handover and Ownership ของเว็บไซต์ ระบบจอง Analytics โดเมน และโฮสต์",
  settings: "แผนกที่ขยายได้: Marketing, Revenue, Distribution, Sales และ Management แต่ละโปรเจกต์มีงานย่อย 1–10 รายการ",
};

export async function ConversionWorkspace({
  section,
  searchParams,
}: {
  section: ConvSection;
  searchParams: Promise<ConvListFilters>;
}) {
  const user = await requireUser();
  if (!canOpenConversion(user)) redirect("/crm?error=forbidden");
  const filters = await searchParams;

  if (section === "settings") {
    const [{ access }, { rows, staff }] = await Promise.all([listConversionProjects(user, filters, "project"), listConversionAccessRows()]);
    return (
      <div className="b2b-page seo-ops-page conv-ops-page">
        <PageHeader eyebrow="Direct Booking Operations" title={CONV_SECTION_LABEL[section]} description={DESCRIPTIONS[section]} />
        <ConversionSettingsPanel rows={rows} staff={staff} canManage={access.canManageSettings} departments={access.departments} />
      </div>
    );
  }

  const { access, items, staff, facets, groupBy, sort } = await listConversionProjects(user, filters, section);

  return (
    <div className="b2b-page seo-ops-page conv-ops-page">
      <PageHeader eyebrow="Direct Booking Operations" title={CONV_SECTION_LABEL[section]} description={DESCRIPTIONS[section]} />
      <ConversionOpsBoard
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
