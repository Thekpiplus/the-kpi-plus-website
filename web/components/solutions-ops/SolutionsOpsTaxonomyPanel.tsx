"use client";

import { useState } from "react";
import { B2bDialog, Field, SaveBar } from "@/components/b2b-ops/ui";
import { removeSolutionsRelationship, saveSolutionsCategory, saveSolutionsRelationship } from "@/lib/solutions-ops/actions";
import {
  SOL_CATEGORY_STATUSES,
  SOL_RELATION_KINDS,
  SOL_RELATION_LABEL,
  departmentLabelIn,
  hasSensitiveText,
  type SolAccessView,
  type SolCategoryRow,
  type SolDepartmentOption,
  type SolRelationKind,
  type SolRelationshipRow,
} from "@/lib/solutions-ops/types";
import { useSolRun } from "./useSolRun";
import "./solutions-ops.css";

function canEditDept(access: SolAccessView, department: string) {
  return access.canEdit && (access.isManagement || access.departments.includes(department));
}

/* -------------------------------------------------------------------------- */
/* Categories                                                                 */
/* -------------------------------------------------------------------------- */

function CategoryEditor({
  category,
  access,
  allDepartmentOptions,
  isNew = false,
}: {
  category?: SolCategoryRow;
  access: SolAccessView;
  allDepartmentOptions: SolDepartmentOption[];
  isNew?: boolean;
}) {
  const { pending, error, ok, setError, setOk, run } = useSolRun();
  const initial = {
    name: category?.name ?? "",
    description: category?.description ?? "",
    ownerDepartment: category?.ownerDepartment || (access.departments[0] ?? "management"),
    sortOrder: String(category?.sortOrder ?? 0),
    status: category?.status ?? "active",
  };
  const [form, setForm] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const [touched, setTouched] = useState(false);
  const editable = isNew ? access.canEdit : canEditDept(access, category?.ownerDepartment ?? "");
  const departments = allDepartmentOptions.filter((item) => access.isManagement || access.departments.includes(item.id));

  function patch(next: Partial<typeof form>) {
    setDirty(true);
    setForm({ ...form, ...next });
  }

  const validation = !form.name.trim() ? "กรุณากรอกชื่อหมวด" : hasSensitiveText(form.name, form.description) ? "พบข้อความที่ไม่ควรบันทึก (รหัสผ่าน/ข้อมูลส่วนบุคคล)" : "";

  return (
    <section className="crm-cms-block" aria-label={isNew ? "เพิ่มหมวดใหม่" : `หมวด ${category?.name}`}>
      <h2>{isNew ? "เพิ่มหมวดใหม่ / New category" : category?.name}</h2>
      {!isNew && category ? <p className="b2b-muted">{category.serviceCount} บริการในหมวดนี้ · id: {category.id}</p> : null}
      <fieldset className="sol-fieldset" disabled={!editable || pending}>
        <legend>ข้อมูลหมวด</legend>
        <div className="sol-form-grid">
          <Field label="ชื่อหมวด / Name *">
            <input className="crm-field" value={form.name} aria-invalid={touched && !form.name.trim()} onChange={(event) => patch({ name: event.target.value })} />
          </Field>
          <Field label="แผนกเจ้าของ / Owner department">
            <select className="crm-field" value={form.ownerDepartment} onChange={(event) => patch({ ownerDepartment: event.target.value })}>
              {(departments.length ? departments : [{ id: form.ownerDepartment, label: departmentLabelIn(form.ownerDepartment, allDepartmentOptions) }]).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="ลำดับ / Sort order">
            <input className="crm-field" type="number" min={0} max={9999} value={form.sortOrder} onChange={(event) => patch({ sortOrder: event.target.value })} />
          </Field>
          <Field label="สถานะ / Status">
            <select className="crm-field" value={form.status} onChange={(event) => patch({ status: event.target.value as typeof form.status })}>
              {SOL_CATEGORY_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
          <div className="sol-span-2">
            <Field label="คำอธิบายภายใน / Internal description">
              <textarea className="crm-field" rows={2} value={form.description} onChange={(event) => patch({ description: event.target.value })} />
            </Field>
          </div>
        </div>
      </fieldset>
      {editable ? (
        <SaveBar
          pending={pending}
          ok={ok}
          error={touched && validation ? validation : error}
          dirty={dirty}
          saveLabel={isNew ? "สร้างหมวด / Create" : "บันทึก / Save"}
          onSave={() => {
            setTouched(true);
            setOk("");
            if (validation) {
              setError("");
              return;
            }
            const data = new FormData();
            data.set("id", category?.id ?? "");
            data.set("name", form.name);
            data.set("description", form.description);
            data.set("ownerDepartment", form.ownerDepartment);
            data.set("sortOrder", form.sortOrder);
            data.set("status", form.status);
            run(
              () => saveSolutionsCategory(data),
              isNew ? "สร้างหมวดแล้ว / Created" : "บันทึกแล้ว / Saved",
              () => {
                setDirty(false);
                setTouched(false);
                if (isNew) setForm({ ...initial, name: "", description: "", sortOrder: "0" });
              },
            );
          }}
        />
      ) : (
        <p className="b2b-muted">ดูอย่างเดียว — หมวดนี้เป็นของแผนก {departmentLabelIn(category?.ownerDepartment ?? "", allDepartmentOptions)}</p>
      )}
    </section>
  );
}

export function SolutionsOpsCategoriesPanel({
  categories,
  access,
  departments,
}: {
  categories: SolCategoryRow[];
  access: SolAccessView;
  departments: SolDepartmentOption[];
}) {
  return (
    <div className="b2b-page sol-ops">
      <p className="sol-note">หมวดเริ่มต้นสร้างจากเมนู Solutions บนเว็บ (ชื่อเท่านั้น) — แก้ไขได้ที่นี่ การแก้ไขไม่เปลี่ยนเมนูสาธารณะ</p>
      {categories.length === 0 ? <p className="crm-pipe-table-empty">ยังไม่มีหมวด — สร้างด้านล่าง</p> : null}
      {categories.map((category) => (
        <CategoryEditor key={category.id} category={category} access={access} allDepartmentOptions={departments} />
      ))}
      {access.canEdit ? <CategoryEditor isNew access={access} allDepartmentOptions={departments} /> : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Relationships                                                              */
/* -------------------------------------------------------------------------- */

type ServiceOption = { id: string; name: string; ownerDepartment: string };

function RelationshipEditor({
  relation,
  services,
  access,
  isNew = false,
}: {
  relation?: SolRelationshipRow;
  services: ServiceOption[];
  access: SolAccessView;
  isNew?: boolean;
}) {
  const { pending, error, ok, setError, setOk, run } = useSolRun();
  const initial = {
    fromServiceId: relation?.fromServiceId ?? "",
    toServiceId: relation?.toServiceId ?? "",
    kind: (relation?.kind ?? "pairs_with") as SolRelationKind,
    notes: relation?.notes ?? "",
  };
  const [form, setForm] = useState(initial);
  const [dirty, setDirty] = useState(false);
  const [touched, setTouched] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const fromService = services.find((item) => item.id === form.fromServiceId);
  const editable = access.canEdit && (isNew || !fromService || canEditDept(access, fromService.ownerDepartment));

  function patch(next: Partial<typeof form>) {
    setDirty(true);
    setForm({ ...form, ...next });
  }

  const validation = !form.fromServiceId || !form.toServiceId
    ? "กรุณาเลือกบริการทั้งสองฝั่ง"
    : form.fromServiceId === form.toServiceId
      ? "ต้องเลือกบริการสองรายการที่ต่างกัน"
      : hasSensitiveText(form.notes)
        ? "พบข้อความที่ไม่ควรบันทึก"
        : "";

  const options = (
    <>
      <option value="">— เลือกบริการ —</option>
      {services.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </>
  );

  return (
    <section className="crm-cms-block" aria-label={isNew ? "เพิ่มความสัมพันธ์" : `${relation?.fromName} → ${relation?.toName}`}>
      <h2>{isNew ? "เพิ่มความสัมพันธ์ / New relationship" : `${relation?.fromName} → ${relation?.toName}`}</h2>
      <fieldset className="sol-fieldset" disabled={!editable || pending}>
        <legend>ความสัมพันธ์</legend>
        <div className="sol-form-grid">
          <Field label="จากบริการ / From *">
            <select className="crm-field" value={form.fromServiceId} onChange={(event) => patch({ fromServiceId: event.target.value })}>
              {options}
            </select>
          </Field>
          <Field label="ประเภท / Kind">
            <select className="crm-field" value={form.kind} onChange={(event) => patch({ kind: event.target.value as SolRelationKind })}>
              {SOL_RELATION_KINDS.map((item) => (
                <option key={item} value={item}>
                  {SOL_RELATION_LABEL[item]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="ไปยังบริการ / To *">
            <select className="crm-field" value={form.toServiceId} onChange={(event) => patch({ toServiceId: event.target.value })}>
              {options}
            </select>
          </Field>
          <Field label="หมายเหตุ / Notes">
            <input className="crm-field" value={form.notes} onChange={(event) => patch({ notes: event.target.value })} />
          </Field>
        </div>
      </fieldset>
      {editable ? (
        <>
          <SaveBar
            pending={pending}
            ok={ok}
            error={touched && validation ? validation : error}
            dirty={dirty}
            saveLabel={isNew ? "สร้างความสัมพันธ์ / Create" : "บันทึก / Save"}
            onSave={() => {
              setTouched(true);
              setOk("");
              if (validation) {
                setError("");
                return;
              }
              const data = new FormData();
              data.set("id", relation?.id ?? "");
              data.set("fromServiceId", form.fromServiceId);
              data.set("toServiceId", form.toServiceId);
              data.set("kind", form.kind);
              data.set("notes", form.notes);
              run(
                () => saveSolutionsRelationship(data),
                isNew ? "สร้างแล้ว / Created" : "บันทึกแล้ว / Saved",
                () => {
                  setDirty(false);
                  setTouched(false);
                  if (isNew) setForm({ ...initial });
                },
              );
            }}
          />
          {!isNew && relation ? (
            <button type="button" className="crm-users-secondary" onClick={() => setConfirmRemove(true)}>
              ลบความสัมพันธ์
            </button>
          ) : null}
        </>
      ) : (
        <p className="b2b-muted">ดูอย่างเดียว</p>
      )}
      {confirmRemove && relation ? (
        <B2bDialog
          title="ลบความสัมพันธ์"
          body={`ยืนยันลบ “${relation.fromName} → ${relation.toName}”? ไม่กระทบบริการและหน้าสาธารณะ`}
          confirmLabel="ลบ"
          pending={pending}
          onCancel={() => setConfirmRemove(false)}
          onConfirm={() => {
            const data = new FormData();
            data.set("id", relation.id);
            run(() => removeSolutionsRelationship(data), "ลบแล้ว");
            setConfirmRemove(false);
          }}
        />
      ) : null}
    </section>
  );
}

export function SolutionsOpsRelationshipsPanel({
  relationships,
  services,
  access,
}: {
  relationships: SolRelationshipRow[];
  services: ServiceOption[];
  access: SolAccessView;
}) {
  return (
    <div className="b2b-page sol-ops">
      <p className="sol-note">ความสัมพันธ์ใช้ภายในเพื่อวางแผนการนำเสนอบริการ ไม่แสดงบนหน้าสาธารณะ</p>
      {services.length < 2 ? <p className="sol-note is-warn">ต้องมีบริการอย่างน้อย 2 รายการจึงจะสร้างความสัมพันธ์ได้ — เพิ่มที่ Service Catalog</p> : null}
      {relationships.length === 0 ? <p className="crm-pipe-table-empty">ยังไม่มีความสัมพันธ์ — ไม่มีการนำเข้าข้อมูล สร้างด้วยแบบฟอร์มด้านล่าง</p> : null}
      {relationships.map((relation) => (
        <RelationshipEditor key={relation.id} relation={relation} services={services} access={access} />
      ))}
      {access.canEdit && services.length >= 2 ? <RelationshipEditor isNew services={services} access={access} /> : null}
    </div>
  );
}
