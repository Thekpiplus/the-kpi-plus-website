import { redirect } from "next/navigation";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { WebsiteOpsBoard } from "@/components/website-ops/WebsiteOpsBoard";
import { WebsiteSettingsPanel } from "@/components/website-ops/WebsiteSettingsPanel";
import { canOpenWebsite } from "@/lib/website-ops/access";
import { listWebsiteAccessRows, listWebsiteProjects } from "@/lib/website-ops/queries";
import { WEB_SECTION_LABEL, type WebListFilters, type WebSection } from "@/lib/website-ops/types";
import { requireUser } from "@/lib/crm/auth";
import "./website-ops.css";

const DESCRIPTIONS: Record<WebSection, string> = {
  project: "บอร์ดภายในสำหรับโปรเจกต์เว็บไซต์โรงแรม ไม่มีการนำเข้าข้อมูล และไม่แสดงบนหน้าสาธารณะ",
  discovery: "งานค้นหาโครงสร้างและเนื้อหา ห้อง ข้อเสนอ และภาษาของเว็บไซต์",
  ux: "งาน UX และ Mobile ของเส้นทางจองและหน้าสำคัญ",
  cms: "งาน CMS เทคโนโลยี และการดูแลต่อโดยทีมโรงแรม",
  booking: "งาน Booking Engine รหัสบัญชีถูกปกปิดตามสิทธิ์",
  tracking: "งาน Tracking และ Analytics ไม่เปิดรหัสหรือข้อมูลผู้เข้าพักให้ผู้ไม่มีสิทธิ์",
  seo: "งาน SEO และ Search ของเว็บไซต์โรงแรมนี้ ไม่ดึง Search Console อัตโนมัติ",
  qa: "รายการ QA และการส่งมอบกรรมสิทธิ์ CMS โดเมน โฮสต์ และ Analytics",
  reports: "KPI ภายใน ไม่ใช่ผลโรงแรมสาธารณะ",
  approvals: "คิวอนุมัติของโรงแรมและฝ่ายจัดการ",
  settings: "แผนกที่ขยายได้: Marketing, Revenue, Distribution, Sales และ Management",
};

export async function WebsiteWorkspace({
  section,
  searchParams,
}: {
  section: WebSection;
  searchParams: Promise<WebListFilters>;
}) {
  const user = await requireUser();
  if (!canOpenWebsite(user)) redirect("/crm?error=forbidden");
  const filters = await searchParams;

  if (section === "settings") {
    const [{ access }, { rows, staff }] = await Promise.all([listWebsiteProjects(user, filters, "project"), listWebsiteAccessRows()]);
    return (
      <div className="b2b-page seo-ops-page web-ops-page">
        <PageHeader eyebrow="Website Operations" title={WEB_SECTION_LABEL[section]} description={DESCRIPTIONS[section]} />
        <WebsiteSettingsPanel rows={rows} staff={staff} canManage={access.canManageSettings} departments={access.departments} />
      </div>
    );
  }

  const { access, items, staff, facets, groupBy, sort } = await listWebsiteProjects(user, filters, section);

  return (
    <div className="b2b-page seo-ops-page web-ops-page">
      <PageHeader eyebrow="Website Operations" title={WEB_SECTION_LABEL[section]} description={DESCRIPTIONS[section]} />
      <WebsiteOpsBoard
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
