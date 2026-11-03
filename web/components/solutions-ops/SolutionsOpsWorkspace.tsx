import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { canOpenSolutionsOps, solutionsOpsAccessFor } from "@/lib/solutions-ops/access";
import { requireUser } from "@/lib/crm/auth";
import { loadSolutionsLocaleMeta, type SolLocaleMeta } from "@/lib/solutions-ops/public-meta";
import {
  getSolutionsSettings,
  listSolutionsAccessRows,
  listSolutionsAudit,
  listSolutionsCategories,
  listSolutionsInquiries,
  listSolutionsRelationships,
  listSolutionsServices,
  solutionsOpsOverview,
} from "@/lib/solutions-ops/queries";
import {
  SOL_CMS_PATH,
  SOL_SECTIONS,
  SOL_SECTION_DESCRIPTION,
  SOL_SECTION_LABEL,
  SOL_SECTION_PATH,
  SOL_STATUSES,
  SOL_STATUS_LABEL,
  allDepartments,
  departmentDuty,
  departmentPath,
  type SolListFilters,
  type SolSection,
} from "@/lib/solutions-ops/types";
import { formatDateTime } from "./format";
import { SolutionsOpsBoard } from "./SolutionsOpsBoard";
import { SolutionsOpsInquiryQueue } from "./SolutionsOpsInquiryQueue";
import { SolutionsOpsPreviewPanel } from "./SolutionsOpsPreviewPanel";
import { SolutionsOpsSettingsPanel } from "./SolutionsOpsSettingsPanel";
import { SolutionsOpsCategoriesPanel, SolutionsOpsRelationshipsPanel } from "./SolutionsOpsTaxonomyPanel";
import "./solutions-ops.css";

const BOARD_SECTIONS: SolSection[] = ["catalog", "proof", "assets", "translations", "seo", "approvals", "departments"];

export async function SolutionsOpsWorkspace({
  section,
  department,
  searchParams,
}: {
  section: SolSection;
  /** Department slug for /crm/solutions/departments/[slug]. */
  department?: string;
  searchParams: Promise<SolListFilters>;
}) {
  const user = await requireUser();
  if (!canOpenSolutionsOps(user)) redirect("/crm?error=forbidden");
  // Departments = the core nine plus any extras added in Settings (no code deploy).
  const settings = await getSolutionsSettings();
  const departments = allDepartments(settings);
  const currentDepartment = department ? departments.find((item) => item.id === department) : undefined;
  if (department && !currentDepartment) notFound();
  const rawFilters = await searchParams;
  const filters: SolListFilters = department ? { ...rawFilters, department } : { ...rawFilters };
  if (!filters.group && (department || section === "approvals")) filters.group = "status";

  const title = currentDepartment ? currentDepartment.label : SOL_SECTION_LABEL[section];
  const description = currentDepartment ? `${departmentDuty(currentDepartment.id)} — บริการที่แผนกนี้เป็นเจ้าของ` : SOL_SECTION_DESCRIPTION[section];
  const header = <PageHeader eyebrow="Hotel Solutions Service Directory" title={title} description={description} />;
  const wrap = (body: React.ReactNode) => (
    <div className="b2b-page sol-ops-page">
      {header}
      {body}
    </div>
  );

  /* ---- Overview ---- */
  if (section === "overview") {
    const [overview, inquiries, access] = await Promise.all([solutionsOpsOverview(), listSolutionsInquiries(user), solutionsOpsAccessFor(user)]);
    const newInquiries = inquiries.items.filter((item) => item.status === "new").length;
    return wrap(
      <div className="sol-ops">
        <p className="sol-note">
          ไดเรกทอรีนี้เป็นพื้นที่ภายในที่แยกจากตัวแก้ไขหน้าสาธารณะ (<Link href={SOL_CMS_PATH}>/crm/cms/solutions</Link>) — สร้างและแก้ไขด้วยตนเอง ไม่มีการนำเข้าข้อมูล และไม่แสดงข้อมูลลูกค้าบนหน้าสาธารณะ
        </p>
        {!access.canEdit ? <p className="sol-note is-warn">บัญชีของคุณดูอย่างเดียว — ขอสิทธิ์แผนกจากผู้จัดการ (Settings)</p> : null}
        <div className="sol-stats" aria-label="สรุปไดเรกทอรีบริการ">
          <Link className="sol-stat" href={SOL_SECTION_PATH.catalog}>
            <strong>{overview.total}</strong>
            <span>บริการ (ไม่รวม Archived)</span>
          </Link>
          <Link className="sol-stat" href={SOL_SECTION_PATH.categories}>
            <strong>{overview.categories}</strong>
            <span>หมวดบริการ</span>
          </Link>
          <Link className="sol-stat" href={SOL_SECTION_PATH.approvals}>
            <strong>{overview.needsApproval}</strong>
            <span>รออนุมัติ (Review)</span>
          </Link>
          <Link className="sol-stat" href={`${SOL_SECTION_PATH.catalog}?status=draft`}>
            <strong>{overview.byStatus.draft ?? 0}</strong>
            <span>Draft</span>
          </Link>
          <Link className="sol-stat" href={SOL_SECTION_PATH.assets}>
            <strong>{overview.imagePending}</strong>
            <span>สิทธิ์รูปยังไม่ตรวจ / รออนุญาต</span>
          </Link>
          <Link className="sol-stat" href={SOL_SECTION_PATH.catalog}>
            <strong>{overview.dueReview}</strong>
            <span>เลยกำหนดทบทวน</span>
          </Link>
          <Link className="sol-stat" href={SOL_SECTION_PATH.inquiries}>
            <strong>{inquiries.available ? newInquiries : "—"}</strong>
            <span>{inquiries.available ? "คำขอใหม่ใน Inquiry Queue" : "Inquiry Queue (ยังไม่เชื่อมต่อ)"}</span>
          </Link>
        </div>

        <h2>สถานะบริการ</h2>
        <div className="sol-stats">
          {SOL_STATUSES.filter((item) => item !== "archived").map((item) => (
            <Link key={item} className="sol-stat" href={`${SOL_SECTION_PATH.catalog}?status=${item}`}>
              <strong>{overview.byStatus[item] ?? 0}</strong>
              <span>{SOL_STATUS_LABEL[item]}</span>
            </Link>
          ))}
        </div>

        <h2>แผนก</h2>
        <nav className="sol-dept-hub" aria-label="Department workspaces">
          {departments.map((item) => (
            <Link key={item.id} className="sol-dept-card" href={departmentPath(item.id)}>
              <strong>{item.label}</strong>
              <span>
                {overview.byDepartment[item.id] ?? 0} บริการ · {departmentDuty(item.id)}
              </span>
            </Link>
          ))}
        </nav>

        <h2>เมนูทั้งหมด</h2>
        <nav className="sol-dept-hub" aria-label="Solutions menus">
          {SOL_SECTIONS.filter((item) => item !== "overview" && item !== "departments").map((item) => (
            <Link key={item} className="sol-dept-card" href={SOL_SECTION_PATH[item]}>
              <strong>{SOL_SECTION_LABEL[item]}</strong>
              <span>{SOL_SECTION_DESCRIPTION[item]}</span>
            </Link>
          ))}
        </nav>
      </div>,
    );
  }

  /* ---- Departments hub ---- */
  if (section === "departments" && !department) {
    const overview = await solutionsOpsOverview();
    return wrap(
      <div className="sol-ops">
        <nav className="sol-dept-hub" aria-label="Department workspaces">
          {departments.map((item) => (
            <Link key={item.id} className="sol-dept-card" href={departmentPath(item.id)}>
              <strong>{item.label}</strong>
              <span>
                {overview.byDepartment[item.id] ?? 0} บริการ · {departmentDuty(item.id)}
              </span>
            </Link>
          ))}
        </nav>
      </div>,
    );
  }

  /* ---- Boards (catalog / proof / assets / translations / seo / approvals / department) ---- */
  if (BOARD_SECTIONS.includes(section)) {
    const result = await listSolutionsServices(user, filters, section);
    let localeMeta: Record<string, SolLocaleMeta[]> = {};
    if (section === "translations" || section === "seo") {
      const map = await loadSolutionsLocaleMeta(result.items.map((item) => item.publicRoute).filter(Boolean));
      localeMeta = Object.fromEntries(map);
    }
    return wrap(
      <SolutionsOpsBoard
        section={section}
        department={department}
        items={result.items}
        categories={result.categories}
        access={result.access}
        filters={filters}
        groupBy={result.groupBy}
        staff={result.staff}
        departments={result.departments}
        localeMeta={localeMeta}
      />,
    );
  }

  /* ---- Categories ---- */
  if (section === "categories") {
    const { access, categories } = await listSolutionsServices(user, {}, "categories");
    return wrap(<SolutionsOpsCategoriesPanel categories={categories} access={access} departments={departments} />);
  }

  /* ---- Relationships ---- */
  if (section === "relationships") {
    const [{ access }, relationships] = await Promise.all([listSolutionsServices(user, {}, "relationships"), listSolutionsRelationships()]);
    return wrap(<SolutionsOpsRelationshipsPanel relationships={relationships.items} services={relationships.services} access={access} />);
  }

  /* ---- Preview ---- */
  if (section === "preview") {
    const { items } = await listSolutionsServices(user, {}, "preview");
    return wrap(
      <SolutionsOpsPreviewPanel
        departments={departments}
        services={items.map((item) => ({ id: item.id, name: item.name, publicRoute: item.publicRoute, status: item.status, ownerDepartment: item.ownerDepartment }))}
      />,
    );
  }

  /* ---- Inquiries ---- */
  if (section === "inquiries") {
    const result = await listSolutionsInquiries(user);
    return wrap(
      <SolutionsOpsInquiryQueue items={result.items} available={result.available} staff={result.staff} access={result.access} departments={result.departments} />,
    );
  }

  /* ---- Audit ---- */
  if (section === "audit") {
    const rows = await listSolutionsAudit(200);
    return wrap(
      <div className="sol-ops crm-pipe-table-wrap b2b-table-wrap">
        {rows.length === 0 ? (
          <p className="crm-pipe-table-empty">ยังไม่มีกิจกรรม — ประวัติจะเกิดขึ้นเมื่อมีการสร้าง แก้ไข หรืออนุมัติ (ไม่บันทึกข้อมูลส่วนบุคคล)</p>
        ) : (
          <table className="crm-pipe-table b2b-table" aria-label="Activity / Audit log">
            <thead>
              <tr>
                <th scope="col">เวลา</th>
                <th scope="col">ประเภท</th>
                <th scope="col">รายการ</th>
                <th scope="col">การกระทำ</th>
                <th scope="col">รายละเอียด</th>
                <th scope="col">โดย</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td data-label="เวลา">{formatDateTime(row.createdAt)}</td>
                  <td data-label="ประเภท">{row.entityType}</td>
                  <td data-label="รายการ">{row.entityName}</td>
                  <td data-label="การกระทำ">{row.action}</td>
                  <td data-label="รายละเอียด">{row.detail}</td>
                  <td data-label="โดย">{row.createdByName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>,
    );
  }

  /* ---- Settings ---- */
  const [{ rows, staff, settings: currentSettings }, access] = await Promise.all([listSolutionsAccessRows(), solutionsOpsAccessFor(user)]);
  return wrap(<SolutionsOpsSettingsPanel rows={rows} staff={staff} settings={currentSettings} access={access} />);
}
