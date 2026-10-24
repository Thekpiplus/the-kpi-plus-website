import Link from "next/link";
import { ConfirmDeleteButton } from "@/components/crm/ui/ConfirmDeleteButton";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { deleteCaseStudy, duplicateCaseStudy, restoreCaseStudy } from "@/lib/cms/case-study-actions";
import {
  CASE_STUDY_DEPARTMENTS,
  dataStatusLabel,
  workflowLabel,
} from "@/lib/cms/case-studies";
import { listCaseStudies, listTrashedCaseStudies } from "@/lib/cms/queries";
import type { CmsCaseStudyRow } from "@/lib/cms/types";

function formatDate(value: Date | null) {
  if (!value) return "—";
  return value.toISOString().slice(0, 10);
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
      <td>{workflowLabel(row.workflowStatus)}</td>
      <td>{dataStatusLabel(row.dataStatus)}</td>
      <td>{row.isPublished ? "เผยแพร่" : "ไม่เผยแพร่"}</td>
      <td>{formatDate(row.updatedAt)}</td>
      <td>
        <div className="crm-cs-row-actions">
          <Link href={`/crm/cms/case-studies/${row.id}`} className="crm-cms-inline-link">
            แก้ไข
          </Link>
          <Link href={`/crm/cms/case-studies/${row.id}/preview`} className="crm-cms-inline-link" title="ตัวอย่างจากฉบับที่บันทึกล่าสุด">
            ตัวอย่าง
          </Link>
          <form action={duplicateCaseStudy}>
            <input type="hidden" name="id" value={row.id} />
            <button type="submit" className="crm-cms-inline-link">
              สำเนา
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
  searchParams: Promise<{ saved?: string; deleted?: string; restored?: string; error?: string }>;
}) {
  const params = await searchParams;
  const [rows, trashed] = await Promise.all([listCaseStudies(), listTrashedCaseStudies()]);
  const byDepartment = CASE_STUDY_DEPARTMENTS.map((department) => ({
    ...department,
    rows: rows.filter((row) => row.department === department.id),
  }));
  const ungrouped = rows.filter((row) => !CASE_STUDY_DEPARTMENTS.some((item) => item.id === row.department));

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

      <p className="crm-cms-count">{rows.length} เคสในระบบ · เฉพาะสถานะ Published เท่านั้นที่แสดงบนเว็บสาธารณะ</p>

      {rows.length === 0 ? (
        <EmptyState
          title="ยังไม่มีเคสสตัดดี"
          body="สร้างเคสแรกจากปุ่มด้านบน แล้วบันทึกเป็นฉบับร่างหรือเผยแพร่เมื่อข้อมูลครบ"
          action={
            <Link href="/crm/cms/case-studies/new" className="kpi-button">
              เพิ่มเคสสตัดดี
            </Link>
          }
        />
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
                        <th>สถานะงาน</th>
                        <th>สถานะข้อมูล</th>
                        <th>เผยแพร่</th>
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
                      <th>สถานะงาน</th>
                      <th>สถานะข้อมูล</th>
                      <th>เผยแพร่</th>
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
