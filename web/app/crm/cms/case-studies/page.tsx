import Link from "next/link";
import { ConfirmDeleteButton } from "@/components/crm/ui/ConfirmDeleteButton";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { deleteCaseStudy, duplicateCaseStudy, restoreCaseStudy } from "@/lib/cms/case-study-actions";
import {
  CASE_STUDY_DATA_STATUSES,
  CASE_STUDY_DEPARTMENTS,
  CASE_STUDY_HOTEL_TYPES,
  CASE_STUDY_SERVICE_AREAS,
  caseStudyListStatus,
  dataStatusLabel,
  listStatusLabel,
  type CaseStudyListStatus,
} from "@/lib/cms/case-studies";
import { listCaseStudies, listTrashedCaseStudies } from "@/lib/cms/queries";
import type { CmsCaseStudyRow } from "@/lib/cms/types";

export const dynamic = "force-dynamic";

function formatDate(value: Date | null) {
  if (!value) return "—";
  return value.toISOString().slice(0, 10);
}

function uniqueSorted(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function StatusBadge({ row }: { row: CmsCaseStudyRow }) {
  const status = caseStudyListStatus(row);
  return <span className={`crm-cs-status is-${status}`}>{listStatusLabel(status)}</span>;
}

function StudyRow({ row }: { row: CmsCaseStudyRow }) {
  return (
    <tr>
      <td>
        <Link href={`/crm/cms/case-studies/${row.id}`} className="crm-cms-inline-link">
          {row.title || row.slug || "Untitled"}
        </Link>
        <p className="crm-cs-row-slug">{row.slug}</p>
      </td>
      <td>
        <StatusBadge row={row} />
      </td>
      <td>{dataStatusLabel(row.dataStatus)}</td>
      <td>{row.serviceArea || "—"}</td>
      <td>{row.hotelType || "—"}</td>
      <td>{formatDate(row.updatedAt)}</td>
      <td>
        <div className="crm-cs-row-actions">
          <Link href={`/crm/cms/case-studies/${row.id}`} className="crm-cms-inline-link">
            แก้ไข
          </Link>
          <Link href={`/crm/cms/case-studies/${row.id}?tab=preview`} className="crm-cms-inline-link">
            ตัวอย่าง
          </Link>
          <form action={duplicateCaseStudy}>
            <input type="hidden" name="id" value={row.id} />
            <button type="submit" className="crm-cms-inline-link">
              สำเนาเป็นฉบับร่าง
            </button>
          </form>
          <ConfirmDeleteButton
            action={deleteCaseStudy}
            fields={{ id: row.id }}
            itemName={row.title || row.slug}
            eyebrow="Case Studies"
            title="ลบเคสสตัดดี"
            message={`ยืนยันลบ “${row.title || row.slug}”? เคสนี้จะไม่แสดงบนเว็บสาธารณะ`}
            buttonLabel="ลบ"
            confirmLabel="ลบเคส"
            className="crm-cms-inline-link crm-cs-delete-link"
          />
        </div>
      </td>
    </tr>
  );
}

export default async function CmsCaseStudiesPage({
  searchParams,
}: {
  searchParams: Promise<{
    saved?: string;
    deleted?: string;
    restored?: string;
    error?: string;
    status?: string;
    serviceArea?: string;
    hotelType?: string;
    dataStatus?: string;
    updatedFrom?: string;
    updatedTo?: string;
  }>;
}) {
  const params = await searchParams;
  const [allRows, trashed] = await Promise.all([listCaseStudies(), listTrashedCaseStudies()]);
  const statusFilter = (["draft", "review", "approved", "published"].includes(params.status ?? "")
    ? params.status
    : "") as CaseStudyListStatus | "";
  const updatedFrom = params.updatedFrom?.trim() ?? "";
  const updatedTo = params.updatedTo?.trim() ?? "";
  const serviceArea = params.serviceArea?.trim() ?? "";
  const hotelType = params.hotelType?.trim() ?? "";
  const dataStatus = params.dataStatus?.trim() ?? "";

  const rows = allRows.filter((row) => {
    if (statusFilter && caseStudyListStatus(row) !== statusFilter) return false;
    if (serviceArea && row.serviceArea !== serviceArea) return false;
    if (hotelType && row.hotelType !== hotelType) return false;
    if (dataStatus && row.dataStatus !== dataStatus) return false;
    const updated = formatDate(row.updatedAt);
    if (updatedFrom && updated < updatedFrom) return false;
    if (updatedTo && updated > updatedTo) return false;
    return true;
  });

  const counts = {
    draft: allRows.filter((row) => caseStudyListStatus(row) === "draft").length,
    review: allRows.filter((row) => caseStudyListStatus(row) === "review").length,
    approved: allRows.filter((row) => caseStudyListStatus(row) === "approved").length,
    published: allRows.filter((row) => caseStudyListStatus(row) === "published").length,
  };
  const serviceAreas = uniqueSorted([...CASE_STUDY_SERVICE_AREAS, ...allRows.map((row) => row.serviceArea)]);
  const hotelTypes = uniqueSorted([...CASE_STUDY_HOTEL_TYPES, ...allRows.map((row) => row.hotelType)]);
  const byDepartment = CASE_STUDY_DEPARTMENTS.map((department) => ({
    ...department,
    rows: rows.filter((row) => row.department === department.id),
  }));
  const ungrouped = rows.filter((row) => !CASE_STUDY_DEPARTMENTS.some((item) => item.id === row.department));
  const filterQuery = new URLSearchParams();
  if (serviceArea) filterQuery.set("serviceArea", serviceArea);
  if (hotelType) filterQuery.set("hotelType", hotelType);
  if (dataStatus) filterQuery.set("dataStatus", dataStatus);
  if (updatedFrom) filterQuery.set("updatedFrom", updatedFrom);
  if (updatedTo) filterQuery.set("updatedTo", updatedTo);
  const filterSuffix = filterQuery.toString();
  const statusHref = (status: string) =>
    `/crm/cms/case-studies${status || filterSuffix ? `?${new URLSearchParams({ ...(filterSuffix ? Object.fromEntries(filterQuery) : {}), ...(status ? { status } : {}) }).toString()}` : ""}`;

  return (
    <div className="crm-cms">
      <PageHeader
        eyebrow="Content Management"
        title="ผลงานลูกค้า"
        description="เพิ่ม แก้ไข บันทึก ดูตัวอย่าง และเผยแพร่เคสสตัดดีโดยไม่ต้องแก้โค้ด จัดกลุ่มตามแผนกเพื่อขยายงานในอนาคต"
        actions={
          <Link href="/crm/cms/case-studies/new" className="kpi-button">
            เพิ่มเคสสตัดดี
          </Link>
        }
      />

      {params.saved === "1" ? <p className="crm-users-alert is-ok">บันทึกแล้ว</p> : null}
      {params.deleted === "1" ? <p className="crm-users-alert is-ok">ลบเคสแล้ว</p> : null}
      {params.restored === "1" ? <p className="crm-users-alert is-ok">กู้คืนเคสแล้ว</p> : null}
      {params.error === "missing" ? <p className="crm-users-alert is-warn">ไม่พบเคสสตัดดี</p> : null}

      <div className="crm-cs-board" aria-label="สถานะเคสสตัดดี">
        {(
          [
            ["draft", "Draft", "ฉบับร่าง — ไม่แสดงสาธารณะ"],
            ["review", "Review", "รอตรวจ — ไม่แสดงสาธารณะ"],
            ["approved", "Approved", "อนุมัติแล้ว — ยังไม่เผยแพร่"],
            ["published", "Published", "แสดงบนเว็บสาธารณะ"],
          ] as const
        ).map(([id, label, hint]) => (
          <Link
            key={id}
            href={statusHref(statusFilter === id ? "" : id)}
            className={`crm-cs-board-card${statusFilter === id ? " is-active" : ""}`}
          >
            <p>{label}</p>
            <strong>{counts[id]}</strong>
            <span>{hint}</span>
          </Link>
        ))}
      </div>

      <form className="crm-cs-filters" method="get">
        {statusFilter ? <input type="hidden" name="status" value={statusFilter} /> : null}
        <label>
          สายบริการ
          <select className="crm-field" name="serviceArea" defaultValue={serviceArea}>
            <option value="">ทั้งหมด</option>
            {serviceAreas.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          ประเภทโรงแรม
          <select className="crm-field" name="hotelType" defaultValue={hotelType}>
            <option value="">ทั้งหมด</option>
            {hotelTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label>
          สถานะข้อมูล
          <select className="crm-field" name="dataStatus" defaultValue={dataStatus}>
            <option value="">ทั้งหมด</option>
            {CASE_STUDY_DATA_STATUSES.map((item) => (
              <option key={item} value={item}>
                {dataStatusLabel(item)}
              </option>
            ))}
          </select>
        </label>
        <label>
          อัปเดตตั้งแต่
          <input className="crm-field" type="date" name="updatedFrom" defaultValue={updatedFrom} />
        </label>
        <label>
          ถึงวันที่
          <input className="crm-field" type="date" name="updatedTo" defaultValue={updatedTo} />
        </label>
        <div className="crm-cs-filter-actions">
          <button className="kpi-button" type="submit">
            กรอง
          </button>
          <Link href="/crm/cms/case-studies" className="crm-users-secondary">
            ล้างตัวกรอง
          </Link>
        </div>
      </form>

      <p className="crm-cms-count">
        {rows.length} จาก {allRows.length} เคส · Draft และ Review ไม่แสดงบนเว็บสาธารณะ
      </p>

      {allRows.length === 0 ? (
        <EmptyState
          title="ยังไม่มีเคสสตัดดี"
          body="สร้างเคสแรกจากปุ่มด้านบน แล้วบันทึกเป็นฉบับร่างหรือเผยแพร่เมื่อข้อมูลครบ"
          action={
            <Link href="/crm/cms/case-studies/new" className="kpi-button">
              เพิ่มเคสสตัดดี
            </Link>
          }
        />
      ) : rows.length === 0 ? (
        <EmptyState title="ไม่พบเคสตามตัวกรอง" body="ลองล้างตัวกรองหรือเลือกแผนกอื่น" />
      ) : (
        <div className="crm-cs-departments">
          {byDepartment.map((department) => (
            <details key={department.id} className="crm-cms-panel crm-cs-department" open={department.rows.length > 0}>
              <summary>
                <span>
                  {department.labelTh} · {department.label}
                </span>
                <span className="crm-cs-dept-count">{department.rows.length}</span>
              </summary>
              {department.rows.length ? (
                <div className="crm-users-table-wrap">
                  <table className="crm-users-table crm-cs-table">
                    <thead>
                      <tr>
                        <th>ชื่อเรื่อง</th>
                        <th>Draft / Review / Approved / Published</th>
                        <th>สถานะข้อมูล</th>
                        <th>สายบริการ</th>
                        <th>ประเภทโรงแรม</th>
                        <th>อัปเดต</th>
                        <th>จัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {department.rows.map((row) => (
                        <StudyRow key={row.id} row={row} />
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="crm-cms-editor-note">ยังไม่มีเคสในแผนกนี้ — พร้อมใช้เมื่อทีม{department.labelTh}มีผลงาน</p>
              )}
            </details>
          ))}
          {ungrouped.length ? (
            <details className="crm-cms-panel crm-cs-department" open>
              <summary>
                <span>อื่น ๆ</span>
                <span className="crm-cs-dept-count">{ungrouped.length}</span>
              </summary>
              <div className="crm-users-table-wrap">
                <table className="crm-users-table crm-cs-table">
                  <thead>
                    <tr>
                      <th>ชื่อเรื่อง</th>
                      <th>สถานะ</th>
                      <th>สถานะข้อมูล</th>
                      <th>สายบริการ</th>
                      <th>ประเภทโรงแรม</th>
                      <th>อัปเดต</th>
                      <th>จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ungrouped.map((row) => (
                      <StudyRow key={row.id} row={row} />
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          ) : null}
        </div>
      )}

      {trashed.length ? (
        <details className="crm-cms-panel crm-cs-department crm-cs-trash">
          <summary>
            <span>รายการที่ลบแล้ว</span>
            <span className="crm-cs-dept-count">{trashed.length}</span>
          </summary>
          <div className="crm-users-table-wrap">
            <table className="crm-users-table crm-cs-table">
              <thead>
                <tr>
                  <th>ชื่อเรื่อง</th>
                  <th>แผนก</th>
                  <th>ลบเมื่อ</th>
                  <th>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {trashed.map((row) => (
                  <tr key={row.id}>
                    <td>
                      {row.title || row.slug}
                      <p className="crm-cs-row-slug">{row.slug}</p>
                    </td>
                    <td>{row.department}</td>
                    <td>{formatDate(row.trashedAt)}</td>
                    <td>
                      <form action={restoreCaseStudy}>
                        <input type="hidden" name="id" value={row.id} />
                        <button type="submit" className="crm-cms-inline-link">
                          กู้คืน
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      ) : null}
    </div>
  );
}
