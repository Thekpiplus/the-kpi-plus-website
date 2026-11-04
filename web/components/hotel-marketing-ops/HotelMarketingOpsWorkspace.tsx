import { redirect } from "next/navigation";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { HotelMarketingOpsBoard } from "@/components/hotel-marketing-ops/HotelMarketingOpsBoard";
import { HotelMarketingOpsSettingsPanel } from "@/components/hotel-marketing-ops/HotelMarketingOpsSettingsPanel";
import { canOpenHotelMarketingOps, hotelMarketingOpsAccessFor } from "@/lib/hotel-marketing-ops/access";
import { listHmoAudit, listHmoRecords, listHotelMarketingOpsAccessRows } from "@/lib/hotel-marketing-ops/queries";
import {
  HMO_BASE_PATH,
  HMO_DEPARTMENT_PATH,
  HMO_DEPARTMENT_RESPONSIBILITY,
  HMO_KIND_LABEL,
  HMO_SECTION_LABEL,
  HMO_SECTION_PATH,
  hmoDepartmentLabel,
  hmoFormatDate,
  isHmoDepartment,
  type HmoDepartment,
  type HmoListFilters,
  type HmoRawSearchParams,
  type HmoSection,
} from "@/lib/hotel-marketing-ops/types";
import { requireUser } from "@/lib/crm/auth";
import "@/components/b2b-ops/b2b-ops.css";
import "./hotel-marketing-ops.css";

const DESCRIPTIONS: Record<HmoSection, string> = {
  overview: "บอร์ดภายในสำหรับงานบรรณาธิการและปฏิบัติการ Hotel Marketing — สร้างและแก้ไขด้วยตนเอง ไม่มีการนำเข้าข้อมูล ไม่แสดงบนหน้าสาธารณะ และแยกจากตัวแก้ไขบทความ CMS",
  editorial_calendar: "ปฏิทินบทความ จัดกลุ่มและเรียงตามวันเผยแพร่",
  article_backlog: "รายการบทความรอดำเนินการ ลำดับความสำคัญ และเจ้าของงาน",
  drafts_reviews: "ฉบับร่างและรอบตรวจ ตรวจแหล่งอ้างอิงและสิทธิ์รูปภาพก่อนอนุมัติ",
  seo_briefs: "บรีฟ SEO / เนื้อหา: intent, คำค้น, โครงเรื่อง, บริการที่เกี่ยวข้อง",
  campaign_calendar: "ปฏิทินแคมเปญ (เริ่มว่าง — ไม่มีข้อมูลแคมเปญตัวอย่าง) เรียงตามวันเผยแพร่/กำหนดส่ง",
  channel_plan: "แผนช่องทางและการกระจาย บทบาทในเส้นทางการจอง และสิ่งที่ต้องพึ่งพา",
  metrics: "นิยามตัวชี้วัด: Definition, Period, Source, Owner, Verified — ไม่มีการใส่ตัวเลขสมมติ",
  assets: "คลังแอสเซ็ตและการตรวจสิทธิ์ ข้อมูลลูกค้า/แขกต้องได้รับอนุมัติหรือปกปิดก่อน",
  approvals: "คิวอนุมัติ: In review, Needs sources, Needs permissions",
  related_links: "ลิงก์บริการที่เกี่ยวข้องและเหตุผลที่เชื่อมโยง",
  translation: "รายการตรวจการแปล ภาษาต้นทาง/ปลายทาง และหมายเหตุสถานะ",
  reports: "รายงานภายใน: นิยาม ช่วงเวลา และวิธีการ",
  audit: "ประวัติการสร้าง แก้ไข เปลี่ยนสถานะ อนุมัติ และ archive",
  settings: "สิทธิ์ตามแผนกและสิทธิ์อนุมัติ ไม่มีการนำเข้าข้อมูล",
  departments: "พื้นที่ทำงานตามแผนก รวมทุกประเภทงานของแผนกนั้น",
};

type RawParams = HmoRawSearchParams;

function cleanFilters(raw: RawParams): HmoListFilters {
  const pick = (key: string) => {
    const value = raw[key];
    const first = Array.isArray(value) ? value[0] : value;
    return typeof first === "string" ? first.slice(0, 200) : undefined;
  };
  const date = (key: string) => {
    const value = pick(key);
    return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : undefined;
  };
  return {
    q: pick("q"),
    department: pick("department"),
    ownerId: pick("ownerId"),
    channel: pick("channel"),
    status: pick("status"),
    category: pick("category"),
    kind: pick("kind"),
    dateFrom: date("dateFrom"),
    dateTo: date("dateTo"),
    group: pick("group"),
    sort: pick("sort"),
    view: pick("view"),
    archived: pick("archived"),
  };
}

export async function HotelMarketingOpsWorkspace({
  section,
  searchParams,
  department,
}: {
  section: HmoSection;
  searchParams: Promise<RawParams>;
  /** Locks the workspace to one department (used by /departments/{slug}). */
  department?: HmoDepartment;
}) {
  const user = await requireUser();
  if (!canOpenHotelMarketingOps(user)) redirect("/crm?error=forbidden");
  const filters = cleanFilters(await searchParams);
  if (department) filters.department = department;

  const title = department ? `${HMO_SECTION_LABEL.departments}: ${hmoDepartmentLabel(department)}` : HMO_SECTION_LABEL[section];
  const description = department
    ? `${HMO_DEPARTMENT_RESPONSIBILITY[department]} — งานย่อยข้ามแผนก 1–10 รายการต่อบทความ/แคมเปญ พร้อม badge ความคืบหน้า และงานที่ติดขัด (source / permission / privacy / approval) จะบล็อกการเผยแพร่`
    : DESCRIPTIONS[section];
  const eyebrow = "Hotel Marketing Editorial Operations";

  if (section === "settings") {
    const { rows, staff, settings } = await listHotelMarketingOpsAccessRows();
    const access = await hotelMarketingOpsAccessFor(user);
    return (
      <div className="b2b-page hmo-ops-page">
        <PageHeader eyebrow={eyebrow} title={title} description={DESCRIPTIONS[section]} />
        <HotelMarketingOpsSettingsPanel rows={rows} staff={staff} canManage={access.canManageSettings} settings={settings} />
      </div>
    );
  }

  if (section === "audit") {
    const { entries, settings } = await listHmoAudit(user);
    return (
      <div className="b2b-page hmo-ops-page hmo-ops">
        <PageHeader eyebrow={eyebrow} title={title} description={DESCRIPTIONS[section]} />
        <div className="crm-pipe-table-wrap b2b-table-wrap">
          {entries.length === 0 ? (
            <p className="crm-pipe-table-empty">ยังไม่มีประวัติ / No audit entries yet — entries are written when records are created, updated, approved, or archived.</p>
          ) : (
            <table className="crm-pipe-table b2b-table hmo-audit-table" aria-label="Audit history">
              <thead>
                <tr>
                  <th scope="col">เวลา / When</th>
                  <th scope="col">ผู้ทำ / By</th>
                  <th scope="col">Action</th>
                  <th scope="col">รายการ / Record</th>
                  <th scope="col">Department</th>
                  <th scope="col">รายละเอียด / Detail</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td data-label="When">{hmoFormatDate(entry.createdAt, true)}</td>
                    <td data-label="By">{entry.createdBy || "—"}</td>
                    <td data-label="Action">
                      <span className="b2b-status is-draft">{entry.action}</span>
                    </td>
                    <td data-label="Record">
                      {entry.deleted ? "(deleted record)" : entry.recordTitle || "—"}
                      {entry.recordKind ? <small>{HMO_KIND_LABEL[entry.recordKind]}</small> : null}
                    </td>
                    <td data-label="Department">{entry.department && isHmoDepartment(entry.department, settings.extraDepartments) ? hmoDepartmentLabel(entry.department, settings.extraDepartments) : "—"}</td>
                    <td data-label="Detail">{entry.detail || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  const { access, settings, items, staff, facets, groupBy, sort, kindCounts } = await listHmoRecords(user, filters, section);
  const basePath = department ? HMO_DEPARTMENT_PATH[department] : HMO_SECTION_PATH[section] || HMO_BASE_PATH;

  return (
    <div className="b2b-page hmo-ops-page">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <HotelMarketingOpsBoard
        section={section}
        items={items}
        staff={staff}
        access={access}
        settings={settings}
        facets={facets}
        filters={filters}
        groupBy={groupBy}
        sort={sort}
        kindCounts={kindCounts}
        basePath={basePath}
        lockedDepartment={department}
      />
    </div>
  );
}
