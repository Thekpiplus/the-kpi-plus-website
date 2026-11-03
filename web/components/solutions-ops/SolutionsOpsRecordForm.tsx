"use client";

import { useState } from "react";
import { Field, SaveBar, toDateInput } from "@/components/b2b-ops/ui";
import {
  SOL_CONTENT_STATUSES,
  SOL_CONTENT_STATUS_LABEL,
  SOL_IMAGE_PERMISSIONS,
  SOL_IMAGE_PERMISSION_LABEL,
  SOL_SERVICE_GATED_STATUSES,
  SOL_STATUSES,
  SOL_STATUS_LABEL,
  SOL_APPROVER_STATUSES,
  blockedByGateMessage,
  departmentLabelIn,
  emptyPayload,
  hasSensitiveText,
  type SolAccessView,
  type SolCategoryRow,
  type SolContentStatus,
  type SolDepartmentOption,
  type SolImagePermission,
  type SolPayload,
  type SolServiceRow,
  type SolStatus,
} from "@/lib/solutions-ops/types";
import { SolProgressBadge } from "./SolutionsOpsSubtasksPanel";
import "./solutions-ops.css";

export type SolServiceDraft = {
  id: string;
  name: string;
  categoryId: string;
  publicDescription: string;
  problemSolved: string;
  suitableFor: string;
  deliverables: string;
  dependencies: string;
  ownerDepartment: string;
  publicRoute: string;
  contentStatusTh: SolContentStatus;
  contentStatusEn: SolContentStatus;
  imagePermissionStatus: SolImagePermission;
  proofSourceRef: string;
  status: SolStatus;
  nextReviewAt: string;
  payload: SolPayload;
};

export function emptyServiceDraft(access: SolAccessView, department = "", categoryId = ""): SolServiceDraft {
  const fallback = access.departments[0] ?? "management";
  return {
    id: "",
    name: "",
    categoryId,
    publicDescription: "",
    problemSolved: "",
    suitableFor: "",
    deliverables: "",
    dependencies: "",
    ownerDepartment: department && access.departments.includes(department) ? department : fallback,
    publicRoute: "",
    contentStatusTh: "not_started",
    contentStatusEn: "not_started",
    imagePermissionStatus: "unreviewed",
    proofSourceRef: "",
    status: "draft",
    nextReviewAt: "",
    payload: emptyPayload(),
  };
}

export function draftFromService(row: SolServiceRow): SolServiceDraft {
  return {
    id: row.id,
    name: row.name,
    categoryId: row.categoryId,
    publicDescription: row.publicDescription,
    problemSolved: row.problemSolved,
    suitableFor: row.suitableFor,
    deliverables: row.deliverables,
    dependencies: row.dependencies,
    ownerDepartment: row.ownerDepartment,
    publicRoute: row.publicRoute,
    contentStatusTh: row.contentStatusTh,
    contentStatusEn: row.contentStatusEn,
    imagePermissionStatus: row.imagePermissionStatus,
    proofSourceRef: row.proofSourceRef,
    status: row.status,
    nextReviewAt: row.nextReviewAt,
    payload: { ...row.payload },
  };
}

/** Client-side validation mirrors the server so the user sees the problem next to the field. */
export function validateServiceDraft(draft: SolServiceDraft, row?: SolServiceRow): Record<string, string> {
  const errors: Record<string, string> = {};
  // Blocked subtasks (permission / evidence / privacy / approval) stop a move to Approved or Published.
  if (row?.progress.blockedByGate && SOL_SERVICE_GATED_STATUSES.includes(draft.status) && draft.status !== row.status) {
    errors.gate = blockedByGateMessage(row.progress.gateReasons);
  }
  if (!draft.name.trim()) errors.name = "กรุณากรอกชื่อบริการ";
  if (draft.publicRoute && !(draft.publicRoute === "/solutions" || draft.publicRoute.startsWith("/solutions/"))) {
    errors.publicRoute = "ต้องขึ้นต้นด้วย /solutions";
  }
  if (draft.payload.seoTitle.length > 70) errors.seoTitle = "ยาวเกิน 70 ตัวอักษร";
  if (draft.payload.seoDescription.length > 200) errors.seoDescription = "ยาวเกิน 200 ตัวอักษร";
  const texts = [
    draft.name,
    draft.publicDescription,
    draft.problemSolved,
    draft.suitableFor,
    draft.deliverables,
    draft.dependencies,
    draft.proofSourceRef,
    ...Object.values(draft.payload),
  ];
  if (hasSensitiveText(...texts)) errors.sensitive = "พบข้อความที่เหมือนรหัสผ่าน/ข้อมูลแขก/เลขบัตร — ห้ามบันทึกในไดเรกทอรีนี้";
  return errors;
}

export function serviceDraftToFormData(draft: SolServiceDraft) {
  const data = new FormData();
  data.set("id", draft.id);
  data.set("name", draft.name);
  data.set("categoryId", draft.categoryId);
  data.set("publicDescription", draft.publicDescription);
  data.set("problemSolved", draft.problemSolved);
  data.set("suitableFor", draft.suitableFor);
  data.set("deliverables", draft.deliverables);
  data.set("dependencies", draft.dependencies);
  data.set("ownerDepartment", draft.ownerDepartment);
  data.set("publicRoute", draft.publicRoute);
  data.set("contentStatusTh", draft.contentStatusTh);
  data.set("contentStatusEn", draft.contentStatusEn);
  data.set("imagePermissionStatus", draft.imagePermissionStatus);
  data.set("proofSourceRef", draft.proofSourceRef);
  data.set("status", draft.status);
  data.set("nextReviewAt", draft.nextReviewAt);
  (Object.keys(draft.payload) as Array<keyof SolPayload>).forEach((key) => data.set(key, draft.payload[key]));
  return data;
}

export function SolutionsOpsRecordForm({
  draft,
  row,
  categories,
  access,
  departments: allDepartmentOptions,
  focus,
  pending,
  ok,
  error,
  onChange,
  onSave,
  onClose,
  onArchive,
}: {
  draft: SolServiceDraft;
  row?: SolServiceRow;
  categories: SolCategoryRow[];
  access: SolAccessView;
  /** Core + extra departments. */
  departments: SolDepartmentOption[];
  /** Section the user came from — only used to open the most relevant fieldset first. */
  focus?: string;
  pending: boolean;
  ok: string;
  error: string;
  onChange: (next: SolServiceDraft) => void;
  onSave: () => void;
  onClose: () => void;
  onArchive: () => void;
}) {
  const [dirty, setDirty] = useState(false);
  const [touched, setTouched] = useState(false);
  const errors = validateServiceDraft(draft, row);
  const showErrors = touched;

  function patch(next: Partial<SolServiceDraft>) {
    setDirty(true);
    onChange({ ...draft, ...next });
  }
  function patchPayload(next: Partial<SolPayload>) {
    patch({ payload: { ...draft.payload, ...next } });
  }

  const departments = allDepartmentOptions.filter((item) => access.isManagement || access.departments.includes(item.id) || item.id === draft.ownerDepartment);
  const canSetApproverStatus = access.canApprove;
  const statuses = SOL_STATUSES.filter((item) => canSetApproverStatus || !SOL_APPROVER_STATUSES.includes(item) || item === draft.status);

  const message = touched && Object.keys(errors).length ? "กรุณาแก้ไขช่องที่มีเครื่องหมายแจ้งเตือนก่อนบันทึก" : error;

  const saveBar = (
    <SaveBar
      pending={pending}
      ok={ok}
      error={message}
      dirty={dirty}
      idle={dirty ? "มีการแก้ไขที่ยังไม่บันทึก / Unsaved changes" : "พร้อมบันทึก / Ready to save"}
      onSave={() => {
        setTouched(true);
        if (Object.keys(validateServiceDraft(draft, row)).length) return;
        onSave();
        setDirty(false);
      }}
      saveLabel={draft.id ? "บันทึก / Save" : "สร้าง / Create"}
    />
  );

  const err = (key: string) => (showErrors && errors[key] ? <small role="alert" style={{ color: "#7a1212", fontWeight: 700 }}>{errors[key]}</small> : null);

  return (
    <div className="b2b-drawer sol-ops" role="dialog" aria-modal="true" aria-labelledby="sol-form-title">
      <button type="button" className="b2b-drawer-backdrop" aria-label="ปิด" onClick={onClose} />
      <div className="b2b-drawer-panel">
        <header className="b2b-inline" style={{ justifyContent: "space-between" }}>
          <div>
            <p className="crm-dash-kicker">Service record{focus ? ` · ${focus}` : ""}</p>
            <h2 id="sol-form-title">{draft.name || "บริการใหม่ / New service"}</h2>
          </div>
          <button type="button" className="crm-users-secondary" onClick={onClose}>
            ปิด
          </button>
        </header>
        {saveBar}
        {row && !row.editable ? <p className="sol-note is-warn">บริการนี้เป็นของแผนก {departmentLabelIn(row.ownerDepartment, allDepartmentOptions)} — คุณดูได้แต่แก้ไขไม่ได้</p> : null}
        {row ? (
          <p className="sol-note">
            งานย่อยข้ามแผนก: <SolProgressBadge progress={row.progress} /> — จัดการในแถวบริการ (ปุ่ม “ขยาย”) หรือมุมมอง Form
          </p>
        ) : null}
        {showErrors && errors.gate ? (
          <p className="sol-gate-alert" role="alert">
            {errors.gate}
          </p>
        ) : null}
        <p className="sol-note">ไดเรกทอรีภายในเท่านั้น — การบันทึกที่นี่ไม่เปลี่ยนหน้า /solutions สาธารณะ ห้ามใส่ข้อมูลแขก ข้อมูลลูกค้ารายบุคคล หรือรหัสผ่าน</p>
        {showErrors && errors.sensitive ? (
          <p className="sol-note is-warn" role="alert">
            {errors.sensitive}
          </p>
        ) : null}

        <fieldset className="sol-fieldset" disabled={row ? !row.editable : false}>
          <legend>ข้อมูลหลัก / Core</legend>
          <div className="sol-form-grid">
            <Field label="ชื่อบริการ / Name *">
              <input className="crm-field" value={draft.name} aria-invalid={showErrors && Boolean(errors.name)} onChange={(event) => patch({ name: event.target.value })} />
              {err("name")}
            </Field>
            <Field label="หมวด / Category">
              <select className="crm-field" value={draft.categoryId} onChange={(event) => patch({ categoryId: event.target.value })}>
                <option value="">— ไม่ระบุ —</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="แผนกเจ้าของ / Owner department">
              <select className="crm-field" value={draft.ownerDepartment} onChange={(event) => patch({ ownerDepartment: event.target.value })}>
                {departments.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Public route" hint="เช่น /solutions/b2b-agent-sales">
              <input className="crm-field" value={draft.publicRoute} aria-invalid={showErrors && Boolean(errors.publicRoute)} onChange={(event) => patch({ publicRoute: event.target.value })} />
              {err("publicRoute")}
            </Field>
            <Field label="สถานะ / Status">
              <select className="crm-field" value={draft.status} onChange={(event) => patch({ status: event.target.value as SolStatus })}>
                {statuses.map((item) => (
                  <option key={item} value={item}>
                    {SOL_STATUS_LABEL[item]}
                  </option>
                ))}
              </select>
              {!canSetApproverStatus ? <small>Approved / Published ตั้งได้เฉพาะผู้มีสิทธิ์อนุมัติ</small> : null}
            </Field>
            <Field label="ทบทวนครั้งถัดไป / Next review">
              <input className="crm-field" type="date" value={toDateInput(draft.nextReviewAt)} onChange={(event) => patch({ nextReviewAt: event.target.value })} />
            </Field>
            <div className="sol-span-2">
              <Field label="คำอธิบายสาธารณะ / Public description" hint="ข้อความที่จะเสนอใช้ — ไม่ใส่ตัวเลขผลลัพธ์ที่ไม่มีหลักฐาน">
                <textarea className="crm-field" rows={3} value={draft.publicDescription} onChange={(event) => patch({ publicDescription: event.target.value })} />
              </Field>
            </div>
          </div>
        </fieldset>

        <fieldset className="sol-fieldset" disabled={row ? !row.editable : false}>
          <legend>เนื้อหาบริการ / Service content</legend>
          <div className="sol-form-grid">
            <Field label="ปัญหาที่แก้ / Problem solved">
              <textarea className="crm-field" rows={3} value={draft.problemSolved} onChange={(event) => patch({ problemSolved: event.target.value })} />
            </Field>
            <Field label="เหมาะกับ / Suitable for">
              <textarea className="crm-field" rows={3} value={draft.suitableFor} onChange={(event) => patch({ suitableFor: event.target.value })} />
            </Field>
            <Field label="สิ่งที่ส่งมอบ / Deliverables">
              <textarea className="crm-field" rows={3} value={draft.deliverables} onChange={(event) => patch({ deliverables: event.target.value })} />
            </Field>
            <Field label="สิ่งที่ต้องพึ่งพา / Dependencies">
              <textarea className="crm-field" rows={3} value={draft.dependencies} onChange={(event) => patch({ dependencies: event.target.value })} />
            </Field>
          </div>
        </fieldset>

        <fieldset className="sol-fieldset" disabled={row ? !row.editable : false}>
          <legend>หลักฐาน / Proof {focus === "proof" ? "← ที่คุณเปิด" : ""}</legend>
          <div className="sol-form-grid">
            <Field label="แหล่งอ้างอิงหลักฐาน / Proof source ref" hint="ลิงก์หรือรหัสเอกสารที่ตรวจสอบได้ และได้รับอนุญาตให้ใช้แล้ว">
              <input className="crm-field" value={draft.proofSourceRef} onChange={(event) => patch({ proofSourceRef: event.target.value })} />
            </Field>
            <Field label="สรุปหลักฐาน / Proof summary" hint="ปล่อยว่างถ้ายังไม่มี — ไม่ต้องสมมติตัวเลข">
              <textarea className="crm-field" rows={2} value={draft.payload.proofSummary} onChange={(event) => patchPayload({ proofSummary: event.target.value })} />
            </Field>
          </div>
        </fieldset>

        <fieldset className="sol-fieldset" disabled={row ? !row.editable : false}>
          <legend>รูปภาพและสิทธิ์ / Assets</legend>
          <div className="sol-form-grid">
            <Field label="สิทธิ์ใช้รูป / Image permission">
              <select className="crm-field" value={draft.imagePermissionStatus} onChange={(event) => patch({ imagePermissionStatus: event.target.value as SolImagePermission })}>
                {SOL_IMAGE_PERMISSIONS.map((item) => (
                  <option key={item} value={item}>
                    {SOL_IMAGE_PERMISSION_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="บันทึกเรื่องรูป / Asset note">
              <textarea className="crm-field" rows={2} value={draft.payload.assetNote} onChange={(event) => patchPayload({ assetNote: event.target.value })} />
            </Field>
          </div>
        </fieldset>

        <fieldset className="sol-fieldset" disabled={row ? !row.editable : false}>
          <legend>การแปล / Translation</legend>
          <div className="sol-form-grid">
            <Field label="เนื้อหาไทย / TH content">
              <select className="crm-field" value={draft.contentStatusTh} onChange={(event) => patch({ contentStatusTh: event.target.value as SolContentStatus })}>
                {SOL_CONTENT_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {SOL_CONTENT_STATUS_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="เนื้อหาอังกฤษ / EN content">
              <select className="crm-field" value={draft.contentStatusEn} onChange={(event) => patch({ contentStatusEn: event.target.value as SolContentStatus })}>
                {SOL_CONTENT_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {SOL_CONTENT_STATUS_LABEL[item]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="บันทึกการแปล TH">
              <textarea className="crm-field" rows={2} value={draft.payload.translationNoteTh} onChange={(event) => patchPayload({ translationNoteTh: event.target.value })} />
            </Field>
            <Field label="บันทึกการแปล EN">
              <textarea className="crm-field" rows={2} value={draft.payload.translationNoteEn} onChange={(event) => patchPayload({ translationNoteEn: event.target.value })} />
            </Field>
          </div>
        </fieldset>

        <fieldset className="sol-fieldset" disabled={row ? !row.editable : false}>
          <legend>SEO / Metadata (ข้อเสนอ)</legend>
          <div className="sol-form-grid">
            <Field label={`SEO title (${draft.payload.seoTitle.length}/70)`}>
              <input className="crm-field" value={draft.payload.seoTitle} aria-invalid={showErrors && Boolean(errors.seoTitle)} onChange={(event) => patchPayload({ seoTitle: event.target.value })} />
              {err("seoTitle")}
            </Field>
            <Field label={`SEO description (${draft.payload.seoDescription.length}/200)`}>
              <textarea className="crm-field" rows={2} value={draft.payload.seoDescription} aria-invalid={showErrors && Boolean(errors.seoDescription)} onChange={(event) => patchPayload({ seoDescription: event.target.value })} />
              {err("seoDescription")}
            </Field>
            <div className="sol-span-2">
              <Field label="บันทึกการตรวจ / Review note">
                <textarea className="crm-field" rows={2} value={draft.payload.reviewNote} onChange={(event) => patchPayload({ reviewNote: event.target.value })} />
              </Field>
            </div>
          </div>
        </fieldset>

        {row ? (
          <p className="b2b-muted">
            สร้างโดย {row.createdByName || "—"} · อัปเดตล่าสุดโดย {row.updatedByName || "—"} · {row.updatedAt ? new Date(row.updatedAt).toLocaleString("th-TH") : "—"}
          </p>
        ) : null}

        {saveBar}
        {draft.id && (row ? row.editable : true) && draft.status !== "archived" ? (
          <button type="button" className="crm-users-secondary" onClick={onArchive}>
            Archive บริการนี้
          </button>
        ) : null}
      </div>
    </div>
  );
}
