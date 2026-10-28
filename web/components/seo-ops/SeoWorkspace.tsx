import { redirect } from "next/navigation";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { SeoOpsBoard } from "@/components/seo-ops/SeoOpsBoard";
import { SeoSettingsPanel } from "@/components/seo-ops/SeoSettingsPanel";
import { canOpenSeo } from "@/lib/seo-ops/access";
import { listSeoAccessRows, listSeoProperties } from "@/lib/seo-ops/queries";
import { SEO_SECTION_LABEL, type SeoListFilters, type SeoSection } from "@/lib/seo-ops/types";
import { requireUser } from "@/lib/crm/auth";
import "./seo-ops.css";

const DESCRIPTIONS: Record<SeoSection, string> = {
  visibility: "บอร์ดภายในสำหรับงาน Local Search ไม่มีการนำเข้าข้อมูล และไม่แสดงบนหน้าสาธารณะ",
  website: "งานเว็บไซต์และ SEO ของแต่ละโรงแรม รหัส Search Console ถูกปกปิดตามสิทธิ์",
  gbp: "งาน Google Business Profile บันทึกด้วยตนเอง ไม่ดึงข้อมูลจากบัญชี Google",
  maps: "งาน Maps และการลงรายชื่อในพื้นที่",
  aeo: "งาน AI Search / AEO ไม่รับประกันการปรากฏในคำตอบ AI",
  reviews: "เวิร์กโฟลว์รีวิวและคำถามภายใน ไม่แสดงชื่อผู้รีวิว",
  contact: "เส้นทางติดต่อและการจองของแต่ละโรงแรม",
  audit: "งานตรวจและ action ที่ต้องทำต่อ",
  reports: "KPI ภายใน ไม่ใช่ผลโรงแรมสาธารณะ",
  sources: "แหล่งอ้างอิงและสถานะอนุมัติ",
  settings: "แผนกที่ขยายได้: Marketing, Revenue, Distribution, Sales และ Management",
};

export async function SeoWorkspace({
  section,
  searchParams,
}: {
  section: SeoSection;
  searchParams: Promise<SeoListFilters>;
}) {
  const user = await requireUser();
  if (!canOpenSeo(user)) redirect("/crm?error=forbidden");
  const filters = await searchParams;

  if (section === "settings") {
    const [{ access }, { rows, staff }] = await Promise.all([listSeoProperties(user, filters, "visibility"), listSeoAccessRows()]);
    return (
      <div className="b2b-page seo-ops-page">
        <PageHeader eyebrow="Local Search Operations" title={SEO_SECTION_LABEL[section]} description={DESCRIPTIONS[section]} />
        <SeoSettingsPanel rows={rows} staff={staff} canManage={access.canManageSettings} departments={access.departments} />
      </div>
    );
  }

  const { access, items, staff, facets, groupBy, sort } = await listSeoProperties(user, filters, section);

  return (
    <div className="b2b-page seo-ops-page">
      <PageHeader eyebrow="Local Search Operations" title={SEO_SECTION_LABEL[section]} description={DESCRIPTIONS[section]} />
      <SeoOpsBoard
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
