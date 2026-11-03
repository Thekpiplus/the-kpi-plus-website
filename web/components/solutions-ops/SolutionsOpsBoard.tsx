"use client";

import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import { B2bDialog } from "@/components/b2b-ops/ui";
import {
  changeSolutionsServiceStatus,
  quickUpdateSolutionsService,
  saveSolutionsService,
} from "@/lib/solutions-ops/actions";
import type { SolLocaleMeta } from "@/lib/solutions-ops/public-meta";
import { solPrimaryOwner } from "@/lib/solutions-ops/progress";
import {
  SOL_APPROVER_STATUSES,
  SOL_CONTENT_STATUSES,
  SOL_CONTENT_STATUS_LABEL,
  SOL_DUE_FILTERS,
  SOL_DUE_LABEL,
  SOL_GROUP_BY,
  SOL_GROUP_LABEL,
  SOL_IMAGE_PERMISSIONS,
  SOL_IMAGE_PERMISSION_LABEL,
  SOL_SECTION_LABEL,
  SOL_SORTS,
  SOL_SORT_LABEL,
  SOL_STATUSES,
  SOL_STATUS_LABEL,
  SOL_VIEWS,
  SOL_VIEW_LABEL,
  departmentLabelIn,
  normalizeView,
  sectionPath,
  type SolAccessView,
  type SolCategoryRow,
  type SolDepartmentOption,
  type SolGroupBy,
  type SolListFilters,
  type SolSection,
  type SolServiceRow,
  type SolStatus,
} from "@/lib/solutions-ops/types";
import { formatDate, isOverdue } from "./format";
import { SolutionsOpsInlineForm } from "./SolutionsOpsInlineForm";
import { SolProgressBadge, SolutionsOpsSubtasksPanel } from "./SolutionsOpsSubtasksPanel";
import {
  SolutionsOpsRecordForm,
  draftFromService,
  emptyServiceDraft,
  serviceDraftToFormData,
  type SolServiceDraft,
} from "./SolutionsOpsRecordForm";
import { useSolRun } from "./useSolRun";
import "./solutions-ops.css";

function groupKey(row: SolServiceRow, groupBy: SolGroupBy) {
  if (groupBy === "status") return row.status;
  if (groupBy === "category") return row.categoryId || "none";
  if (groupBy === "owner") return solPrimaryOwner(row.subtasks);
  return row.ownerDepartment;
}

function extraLabel(section: SolSection) {
  if (section === "proof") return "หลักฐาน / Proof";
  if (section === "assets") return "สิทธิ์ใช้รูป";
  if (section === "translations") return "TH / EN / RU / ZH";
  if (section === "seo") return "SEO title";
  if (section === "approvals") return "บันทึกล่าสุด";
  return "อัปเดตล่าสุด";
}

export function SolutionsOpsBoard({
  section,
  department,
  items,
  categories,
  access,
  filters,
  groupBy,
  staff = [],
  departments,
  localeMeta = {},
}: {
  section: SolSection;
  department?: string;
  items: SolServiceRow[];
  categories: SolCategoryRow[];
  access: SolAccessView;
  filters: SolListFilters;
  groupBy: SolGroupBy;
  staff?: Array<{ id: string; name: string }>;
  departments: SolDepartmentOption[];
  localeMeta?: Record<string, SolLocaleMeta[]>;
}) {
  const { pending, error, ok, setError, setOk, reset, run } = useSolRun();
  const [drawer, setDrawer] = useState(false);
  const [draft, setDraft] = useState<SolServiceDraft>(() => emptyServiceDraft(access, department, filters.category));
  const [expanded, setExpanded] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [archiveId, setArchiveId] = useState("");
  const [dueMode, setDueMode] = useState(filters.due ?? "");
  const view = normalizeView(filters.view);
  const deptLabel = (value: string) => departmentLabelIn(value, departments);
  const staffName = (id: string) => staff.find((item) => item.id === id)?.name ?? id;
  const current = items.find((item) => item.id === draft.id);
  const basePath = sectionPath(section, department);

  const counts = useMemo(
    () => ({
      total: items.length,
      review: items.filter((item) => item.status === "review").length,
      live: items.filter((item) => item.status === "approved" || item.status === "published").length,
      due: items.filter((item) => item.status !== "archived" && isOverdue(item.nextReviewAt)).length,
    }),
    [items],
  );

  const groups = useMemo(() => {
    const ownerKeys = Array.from(new Set(items.map((item) => solPrimaryOwner(item.subtasks)))).filter((key) => key !== "none");
    const order: string[] =
      groupBy === "status"
        ? [...SOL_STATUSES]
        : groupBy === "category"
          ? [...categories.map((item) => item.id), "none"]
          : groupBy === "owner"
            ? [...ownerKeys, "none"]
            : departments.map((item) => item.id);
    return order.map((key) => ({
      key,
      label:
        groupBy === "status"
          ? SOL_STATUS_LABEL[key as SolStatus]
          : groupBy === "category"
            ? key === "none"
              ? "ไม่มีหมวด"
              : categories.find((item) => item.id === key)?.name || key
            : groupBy === "owner"
              ? key === "none"
                ? "ยังไม่มอบหมาย"
                : staff.find((item) => item.id === key)?.name || key
              : departmentLabelIn(key, departments),
      items: items.filter((item) => groupKey(item, groupBy) === key),
    }));
  }, [categories, departments, groupBy, items, staff]);

  const query = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value && !(department && key === "department")) query.set(key, value);
  });
  function hrefFor(next: Record<string, string>) {
    const params = new URLSearchParams(query);
    Object.entries(next).forEach(([key, value]) => (value ? params.set(key, value) : params.delete(key)));
    const text = params.toString();
    return text ? `${basePath}?${text}` : basePath;
  }

  function openNew() {
    setDraft(emptyServiceDraft(access, department, filters.category));
    setDrawer(true);
    reset();
  }

  function openRow(row: SolServiceRow) {
    setDraft(draftFromService(row));
    setDrawer(true);
    reset();
  }

  function saveDraft() {
    run(
      () => saveSolutionsService(serviceDraftToFormData(draft)),
      draft.id ? "บันทึกแล้ว / Saved" : "สร้างบริการแล้ว / Created",
      (result) => setDraft((currentDraft) => ({ ...currentDraft, id: result.id })),
    );
  }

  const statusOptions = (row: SolServiceRow) =>
    SOL_STATUSES.filter((item) => access.canApprove || !SOL_APPROVER_STATUSES.includes(item) || item === row.status);

  const inlineControls = (row: SolServiceRow) => {
    if (!row.editable) return <span className="b2b-muted">ดูอย่างเดียว</span>;
    const key = row.id;

    if (section === "approvals") {
      if (!access.canApprove) return <span className="b2b-muted">ไม่มีสิทธิ์อนุมัติ</span>;
      return (
        <SolutionsOpsInlineForm key={key} id={row.id} action={changeSolutionsServiceStatus} ariaLabel={`ตัดสินใจ ${row.name}`} saveLabel="บันทึกการตัดสินใจ" successLabel="บันทึกการอนุมัติแล้ว">
          <select className="crm-select" name="status" defaultValue={row.status} aria-label={`การตัดสินใจ ${row.name}`}>
            <option value="approved">Approve</option>
            <option value="published">Publish (internal flag)</option>
            <option value="draft">ส่งกลับแก้ไข (Draft)</option>
            <option value="review">คงสถานะ Review</option>
          </select>
          <input className="crm-field sol-inline-note" name="note" placeholder="หมายเหตุการตัดสินใจ" aria-label="หมายเหตุ" maxLength={300} />
        </SolutionsOpsInlineForm>
      );
    }

    if (section === "assets") {
      return (
        <SolutionsOpsInlineForm key={key} id={row.id} action={quickUpdateSolutionsService} ariaLabel={`สิทธิ์รูป ${row.name}`}>
          <select className="crm-select" name="imagePermissionStatus" defaultValue={row.imagePermissionStatus} aria-label={`สิทธิ์ใช้รูป ${row.name}`}>
            {SOL_IMAGE_PERMISSIONS.map((item) => (
              <option key={item} value={item}>
                {SOL_IMAGE_PERMISSION_LABEL[item]}
              </option>
            ))}
          </select>
        </SolutionsOpsInlineForm>
      );
    }

    if (section === "translations") {
      return (
        <SolutionsOpsInlineForm key={key} id={row.id} action={quickUpdateSolutionsService} ariaLabel={`สถานะเนื้อหา ${row.name}`}>
          <select className="crm-select" name="contentStatusTh" defaultValue={row.contentStatusTh} aria-label={`TH ${row.name}`}>
            {SOL_CONTENT_STATUSES.map((item) => (
              <option key={item} value={item}>
                TH · {SOL_CONTENT_STATUS_LABEL[item]}
              </option>
            ))}
          </select>
          <select className="crm-select" name="contentStatusEn" defaultValue={row.contentStatusEn} aria-label={`EN ${row.name}`}>
            {SOL_CONTENT_STATUSES.map((item) => (
              <option key={item} value={item}>
                EN · {SOL_CONTENT_STATUS_LABEL[item]}
              </option>
            ))}
          </select>
        </SolutionsOpsInlineForm>
      );
    }

    return (
      <SolutionsOpsInlineForm key={key} id={row.id} action={changeSolutionsServiceStatus} ariaLabel={`สถานะ ${row.name}`}>
        <select className="crm-select" name="status" defaultValue={row.status} aria-label={`สถานะ ${row.name}`}>
          {statusOptions(row).map((item) => (
            <option key={item} value={item}>
              {SOL_STATUS_LABEL[item]}
            </option>
          ))}
        </select>
      </SolutionsOpsInlineForm>
    );
  };

  const extraCell = (row: SolServiceRow) => {
    if (section === "proof") {
      return (
        <>
          {row.proofSourceRef || <span className="b2b-muted">ยังไม่มีแหล่งอ้างอิง</span>}
          {row.payload.proofSummary ? <small>{row.payload.proofSummary}</small> : null}
        </>
      );
    }
    if (section === "assets") {
      return (
        <>
          <span className={`b2b-status is-${row.imagePermissionStatus}`}>{SOL_IMAGE_PERMISSION_LABEL[row.imagePermissionStatus]}</span>
          {row.payload.assetNote ? <small>{row.payload.assetNote}</small> : null}
        </>
      );
    }
    if (section === "translations") {
      const meta = localeMeta[row.publicRoute] ?? [];
      return (
        <>
          <span className={`b2b-status is-${row.contentStatusTh}`}>TH {SOL_CONTENT_STATUS_LABEL[row.contentStatusTh]}</span>{" "}
          <span className={`b2b-status is-${row.contentStatusEn}`}>EN {SOL_CONTENT_STATUS_LABEL[row.contentStatusEn]}</span>
          <small>
            {meta.length
              ? meta.map((item) => (
                  <span key={item.locale} className={`sol-chip ${item.contentExists ? "is-yes" : "is-no"}`}>
                    {item.locale.toUpperCase()} {item.contentExists ? "มีเนื้อหา" : "ยังไม่มี"}
                  </span>
                ))
              : "ยังไม่ระบุ public route"}
          </small>
        </>
      );
    }
    if (section === "seo") {
      return (
        <>
          {row.payload.seoTitle || <span className="b2b-muted">ยังไม่มีข้อเสนอ</span>}
          <small>{row.payload.seoTitle.length}/70 · desc {row.payload.seoDescription.length}/200</small>
        </>
      );
    }
    if (section === "approvals") {
      return (
        <>
          {row.payload.reviewNote || <span className="b2b-muted">—</span>}
          <small>{row.updatedByName || "—"} · {formatDate(row.updatedAt)}</small>
        </>
      );
    }
    return (
      <>
        {formatDate(row.updatedAt) || "—"}
        <small>{row.updatedByName || ""}</small>
      </>
    );
  };

  const expandBlock = (row: SolServiceRow) => {
    const meta = localeMeta[row.publicRoute] ?? [];
    return (
      <div className="b2b-expand">
        <p>
          <strong>คำอธิบาย:</strong> {row.publicDescription || "ยังไม่มี"}
        </p>
        <p>
          <strong>ปัญหาที่แก้:</strong> {row.problemSolved || "—"}
        </p>
        <p>
          <strong>เหมาะกับ:</strong> {row.suitableFor || "—"}
        </p>
        <p>
          <strong>ส่งมอบ:</strong> {row.deliverables || "—"}
        </p>
        <p>
          <strong>พึ่งพา:</strong> {row.dependencies || "—"}
        </p>
        <p>
          <strong>หลักฐาน:</strong> {row.proofSourceRef || "ยังไม่มี"} {row.payload.proofSummary ? `· ${row.payload.proofSummary}` : ""}
        </p>
        {row.payload.reviewNote ? (
          <p>
            <strong>บันทึกตรวจ:</strong> {row.payload.reviewNote}
          </p>
        ) : null}
        {section === "seo" || section === "translations" ? (
          <ul>
            {meta.length ? (
              meta.map((item) => (
                <li key={item.locale}>
                  {item.locale.toUpperCase()} · {item.route} · {item.contentExists ? "มีไฟล์เนื้อหา" : "ไม่มีไฟล์เนื้อหา"}
                  {item.manifestTitle ? ` · manifest: ${item.manifestTitle}` : " · ไม่พบใน seo-manifest"}
                </li>
              ))
            ) : (
              <li>ยังไม่ได้ระบุ public route</li>
            )}
          </ul>
        ) : null}
        <p className="b2b-muted">
          สร้างโดย {row.createdByName || "—"} · แก้ไขล่าสุดโดย {row.updatedByName || "—"}
        </p>
        <SolutionsOpsSubtasksPanel
          parentType="service"
          parentId={row.id}
          parentDepartment={row.ownerDepartment}
          subtasks={row.subtasks}
          progress={row.progress}
          staff={staff}
          departments={departments}
          access={access}
        />
      </div>
    );
  };

  const rowActions = (row: SolServiceRow) => (
    <div className="b2b-row-actions">
      <button type="button" className="crm-users-secondary" aria-expanded={expanded === row.id} onClick={() => setExpanded(expanded === row.id ? "" : row.id)}>
        {expanded === row.id ? "ซ่อน" : "ขยาย"}
      </button>
      {inlineControls(row)}
      <button type="button" className="crm-users-secondary" onClick={() => openRow(row)}>
        {row.editable ? "แก้ไข" : "ดู"}
      </button>
      {row.editable && row.status !== "archived" ? (
        <button type="button" className="crm-users-secondary" onClick={() => setArchiveId(row.id)}>
          Archive
        </button>
      ) : null}
    </div>
  );

  const dueCell = (row: SolServiceRow) =>
    row.nextDueAt ? (
      <>
        {formatDate(row.nextDueAt)}
        {row.status !== "archived" && isOverdue(row.nextDueAt) ? <small className="sol-overdue">เลยกำหนด</small> : null}
      </>
    ) : (
      "—"
    );

  const card = (row: SolServiceRow, forceOpen = false) => (
    <article className="b2b-card" key={row.id}>
      <button type="button" className="b2b-name" onClick={() => openRow(row)}>
        {row.name}
      </button>
      <p>
        {deptLabel(row.ownerDepartment)} · {row.categoryName || "ไม่มีหมวด"}
      </p>
      <div className="b2b-meta">
        <span className={`b2b-status is-${row.status}`}>{SOL_STATUS_LABEL[row.status]}</span>
        <SolProgressBadge progress={row.progress} />
        {row.nextDueAt ? (
          <span className={`b2b-status${isOverdue(row.nextDueAt) ? " is-overdue" : ""}`}>กำหนด {formatDate(row.nextDueAt)}</span>
        ) : null}
        {row.subtasks.length && solPrimaryOwner(row.subtasks) !== "none" ? <span className="b2b-status">{staffName(solPrimaryOwner(row.subtasks))}</span> : null}
      </div>
      <p>{extraCell(row)}</p>
      {rowActions(row)}
      {forceOpen || expanded === row.id ? expandBlock(row) : null}
    </article>
  );

  const tableRows = (rows: SolServiceRow[]) =>
    rows.map((row) => (
      <Fragment key={row.id}>
        <tr>
          <td data-label="บริการ">
            <button type="button" className="b2b-name" onClick={() => openRow(row)}>
              {row.name}
            </button>
            <small>{row.publicRoute || "ยังไม่ระบุ route"}</small>
          </td>
          <td data-label="หมวด">{row.categoryName || "—"}</td>
          <td data-label="แผนก">{deptLabel(row.ownerDepartment)}</td>
          <td data-label="สถานะ">
            <span className={`b2b-status is-${row.status}`}>{SOL_STATUS_LABEL[row.status]}</span>
          </td>
          <td data-label="งานย่อย">
            <SolProgressBadge progress={row.progress} />
          </td>
          <td data-label="กำหนดส่ง / ทบทวน">{dueCell(row)}</td>
          <td data-label={extraLabel(section)}>{extraCell(row)}</td>
          <td data-label="การดำเนินการ">{rowActions(row)}</td>
        </tr>
        {expanded === row.id ? (
          <tr>
            <td colSpan={8}>{expandBlock(row)}</td>
          </tr>
        ) : null}
      </Fragment>
    ));

  const visibleGroups = groups.filter((group) => group.items.length);

  return (
    <div className="b2b-page sol-ops">
      {error ? (
        <p className="crm-users-alert is-warn" role="alert">
          {error}
        </p>
      ) : null}
      {ok ? (
        <p className="crm-users-alert is-ok" role="status">
          {ok}
        </p>
      ) : null}
      {!access.canEdit ? (
        <p className="sol-note is-warn">บัญชีของคุณดูได้อย่างเดียว — ผู้จัดการต้องให้สิทธิ์แผนกใน Settings ก่อนจึงจะสร้างหรือแก้ไขได้</p>
      ) : null}

      <div className="sol-stats" aria-label={`สรุป ${SOL_SECTION_LABEL[section]}`}>
        <div className="sol-stat">
          <strong>{counts.total}</strong>
          <span>บริการในมุมมองนี้</span>
        </div>
        <div className="sol-stat">
          <strong>{counts.review}</strong>
          <span>รอตรวจ (Review)</span>
        </div>
        <div className="sol-stat">
          <strong>{counts.live}</strong>
          <span>Approved / Published</span>
        </div>
        <div className="sol-stat">
          <strong>{counts.due}</strong>
          <span>เลยกำหนดทบทวน</span>
        </div>
      </div>

      <div className="b2b-toolbar">
        <div className="b2b-tabs" role="tablist" aria-label="มุมมองบอร์ด">
          {SOL_VIEWS.map((item) => (
            <Link key={item} className={`b2b-tab${view === item ? " is-active" : ""}`} href={hrefFor({ view: item })} aria-current={view === item ? "page" : undefined}>
              {SOL_VIEW_LABEL[item]}
            </Link>
          ))}
        </div>
        <form className="b2b-filters" method="get" action={basePath}>
          <input type="hidden" name="view" value={view} />
          <input className="crm-field" name="q" defaultValue={filters.q ?? ""} placeholder="ค้นหาชื่อบริการ route งานย่อย หรือหลักฐาน" aria-label="ค้นหา" />
          {!department ? (
            <select className="crm-select" name="department" defaultValue={filters.department ?? ""} aria-label="แผนก">
              <option value="">ทุกแผนก</option>
              {departments.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          ) : null}
          <select className="crm-select" name="owner" defaultValue={filters.owner ?? ""} aria-label="ผู้รับผิดชอบงานย่อย">
            <option value="">ทุกผู้รับผิดชอบ</option>
            {staff.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <select className="crm-select" name="due" value={dueMode} onChange={(event) => setDueMode(event.target.value)} aria-label="กำหนดส่ง">
            <option value="">ทุกกำหนดส่ง</option>
            {SOL_DUE_FILTERS.map((item) => (
              <option key={item} value={item}>
                {SOL_DUE_LABEL[item]}
              </option>
            ))}
          </select>
          {dueMode === "range" ? (
            <>
              <input className="crm-field" type="date" name="dueFrom" defaultValue={filters.dueFrom ?? ""} aria-label="ตั้งแต่วันที่" />
              <input className="crm-field" type="date" name="dueTo" defaultValue={filters.dueTo ?? ""} aria-label="ถึงวันที่" />
            </>
          ) : null}
          <select className="crm-select" name="sort" defaultValue={filters.sort ?? ""} aria-label="เรียงลำดับ">
            <option value="">เรียง: ชื่อ</option>
            {SOL_SORTS.map((item) => (
              <option key={item} value={item}>
                เรียง: {SOL_SORT_LABEL[item]}
              </option>
            ))}
          </select>
          {section !== "approvals" ? (
            <select className="crm-select" name="status" defaultValue={filters.status ?? ""} aria-label="สถานะ">
              <option value="">ทุกสถานะ (ไม่รวม Archived)</option>
              {SOL_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {SOL_STATUS_LABEL[item]}
                </option>
              ))}
            </select>
          ) : null}
          <select className="crm-select" name="category" defaultValue={filters.category ?? ""} aria-label="หมวด">
            <option value="">ทุกหมวด</option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <select className="crm-select" name="group" defaultValue={groupBy} aria-label="จัดกลุ่ม">
            {SOL_GROUP_BY.map((item) => (
              <option key={item} value={item}>
                Group: {SOL_GROUP_LABEL[item]}
              </option>
            ))}
          </select>
          <button className="crm-users-secondary" type="submit">
            กรอง
          </button>
          {access.canEdit ? (
            <button className="kpi-button b2b-save" type="button" onClick={openNew}>
              เพิ่มบริการ
            </button>
          ) : null}
        </form>
      </div>

      {view === "board" || view === "form" ? (
        <div className={`b2b-board${view === "board" ? " is-columns" : " sol-form-view"}`}>
          {(view === "form" ? visibleGroups : groups).map((group) => (
            <section className="b2b-group" key={group.key}>
              <button
                type="button"
                className="sol-group-toggle"
                aria-expanded={!collapsed[group.key]}
                onClick={() => setCollapsed({ ...collapsed, [group.key]: !collapsed[group.key] })}
              >
                <strong>{group.label}</strong>
                <span className="sol-count">{group.items.length}</span>
              </button>
              {collapsed[group.key] ? null : (
                <div className="b2b-group-body">
                  {group.items.length ? group.items.map((row) => card(row, view === "form")) : <p className="b2b-muted">ยังไม่มีบริการ</p>}
                </div>
              )}
            </section>
          ))}
          {view === "form" && visibleGroups.length === 0 ? (
            <p className="crm-pipe-table-empty">ยังไม่มีบริการในมุมมองนี้{access.canEdit ? " — สร้างด้วยปุ่ม “เพิ่มบริการ”" : ""}</p>
          ) : null}
        </div>
      ) : (
        <div className="crm-pipe-table-wrap b2b-table-wrap">
          {items.length === 0 ? (
            <p className="crm-pipe-table-empty">
              ยังไม่มีบริการในมุมมองนี้{access.canEdit ? " — สร้างด้วยปุ่ม “เพิ่มบริการ”" : ""} · ไม่มีการนำเข้าข้อมูล
            </p>
          ) : (
            visibleGroups.map((group) => (
              <section className="b2b-group" key={group.key} style={{ marginBottom: "0.9rem" }}>
                <button
                  type="button"
                  className="sol-group-toggle"
                  aria-expanded={!collapsed[group.key]}
                  onClick={() => setCollapsed({ ...collapsed, [group.key]: !collapsed[group.key] })}
                >
                  <strong>{group.label}</strong>
                  <span className="sol-count">{group.items.length}</span>
                </button>
                {collapsed[group.key] ? null : (
                  <table className="crm-pipe-table b2b-table" aria-label={`ตาราง ${group.label}`}>
                    <thead>
                      <tr>
                        <th scope="col">บริการ</th>
                        <th scope="col">หมวด</th>
                        <th scope="col">แผนก</th>
                        <th scope="col">สถานะ</th>
                        <th scope="col">งานย่อย</th>
                        <th scope="col">กำหนดส่ง / ทบทวน</th>
                        <th scope="col">{extraLabel(section)}</th>
                        <th scope="col">การดำเนินการ</th>
                      </tr>
                    </thead>
                    <tbody>{tableRows(group.items)}</tbody>
                  </table>
                )}
              </section>
            ))
          )}
        </div>
      )}

      {drawer ? (
        <SolutionsOpsRecordForm
          key={draft.id || "new"}
          draft={draft}
          row={current}
          categories={categories}
          access={access}
          departments={departments}
          focus={section === "overview" || section === "catalog" || section === "departments" ? undefined : section}
          pending={pending}
          ok={ok}
          error={error}
          onChange={setDraft}
          onSave={saveDraft}
          onClose={() => {
            setDrawer(false);
            setError("");
            setOk("");
          }}
          onArchive={() => setArchiveId(draft.id)}
        />
      ) : null}

      {archiveId ? (
        <B2bDialog
          title="Archive บริการ"
          body="ยืนยันเก็บบริการนี้เข้าคลังภายใน? จะไม่แสดงในมุมมองหลัก ไม่ลบประวัติ และไม่เปลี่ยนหน้า /solutions สาธารณะ"
          confirmLabel="Archive"
          pending={pending}
          onCancel={() => setArchiveId("")}
          onConfirm={() => {
            const data = new FormData();
            data.set("id", archiveId);
            data.set("status", "archived");
            run(() => changeSolutionsServiceStatus(data), "เก็บเข้าคลังแล้ว / Archived");
            setArchiveId("");
            setDrawer(false);
          }}
        />
      ) : null}
    </div>
  );
}
