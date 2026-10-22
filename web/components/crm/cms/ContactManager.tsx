"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { ContactCard } from "@/components/ContactCard";
import { deleteContact, saveContact, setPrimaryContact } from "@/lib/cms/actions";
import {
  CONSULTANT_IMAGE_HINT,
  LOCATION_IMAGE_HINT,
  companyFromInput,
  contactErrorMessage,
  emptyContactInput,
  validateContactInput,
  type ContactSaveInput,
} from "@/lib/cms/contact";
import { contactInfoFromCompany, whatsappHrefFromNumber } from "@/lib/company";
import type { CmsContactRow } from "@/lib/cms/types";

function ImagePreview({
  src,
  alt,
  recommended,
}: {
  src: string;
  alt: string;
  recommended: string;
}) {
  const [meta, setMeta] = useState("");
  if (!src) return <p className="crm-contact-image-hint">{recommended}</p>;
  return (
    <figure className="crm-contact-image-preview">
      <img
        src={src}
        alt={alt || ""}
        width={480}
        height={320}
        onLoad={(event) => {
          const img = event.currentTarget;
          setMeta(`${img.naturalWidth}×${img.naturalHeight} px`);
        }}
      />
      <figcaption>
        {meta || "กำลังอ่านขนาดรูป…"} · {recommended}
      </figcaption>
    </figure>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="crm-cms-field">
      <span>{label}</span>
      {children}
      {hint ? <small>{hint}</small> : null}
    </label>
  );
}

export function ContactManager({
  records,
  selected,
  creating,
  notice,
  error,
  placeholders,
}: {
  records: CmsContactRow[];
  selected: ContactSaveInput;
  creating: boolean;
  notice?: string;
  error?: string;
  placeholders: ContactSaveInput;
}) {
  const router = useRouter();
  const [form, setForm] = useState<ContactSaveInput>(selected);
  const [status, setStatus] = useState(error ? contactErrorMessage(error) : "");
  const [ok, setOk] = useState(notice ?? "");
  const [pending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState("");
  const [locationPreview, setLocationPreview] = useState(selected.locationImage);
  const [consultantPreview, setConsultantPreview] = useState(selected.consultantImage);

  const preview = useMemo(() => contactInfoFromCompany(companyFromInput(form), "th"), [form]);
  const waPreview = whatsappHrefFromNumber(form.whatsappNumber);

  function patch<K extends keyof ContactSaveInput>(key: K, value: ContactSaveInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setOk("");
    setStatus("");
  }

  function onFile(kind: "location" | "consultant", file: File | undefined) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (kind === "location") setLocationPreview(url);
    else setConsultantPreview(url);
  }

  return (
    <div className="crm-contact-layout">
      <section className="crm-contact-list" aria-label="รายการสถานที่">
        <div className="crm-contact-list-head">
          <div>
            <p className="crm-cms-globals-kicker">สถานที่</p>
            <h2>รายการติดต่อ</h2>
          </div>
          <button
            type="button"
            className="kpi-button"
            onClick={() => {
              setForm({ ...emptyContactInput(), isPrimary: records.length === 0 });
              setLocationPreview("");
              setConsultantPreview("");
              router.push("/crm/cms/contacts?new=1");
            }}
          >
            เพิ่มสถานที่
          </button>
        </div>
        {records.length === 0 ? (
          <p className="crm-cms-globals-card-body">ยังไม่มีรายการ — ระบบจะสร้างสำนักงานภูเก็ตจากค่าเริ่มต้นเมื่อเปิดหน้านี้</p>
        ) : (
          <ul className="crm-contact-records">
            {records.map((row) => (
              <li key={row.id} className={row.id === form.id ? "is-active" : ""}>
                <button type="button" className="crm-contact-record" onClick={() => router.push(`/crm/cms/contacts?id=${row.id}`)}>
                  <strong>
                    {row.label || row.companyNameTh || row.companyNameEn || "ไม่มีชื่อ"}
                    {row.isPrimary ? <span className="crm-contact-badge">หลัก</span> : null}
                  </strong>
                  <span>{[row.phone, row.email].filter(Boolean).join(" · ") || "ยังไม่มีช่องทาง"}</span>
                </button>
                <div className="crm-contact-record-actions">
                  {!row.isPrimary ? (
                    <form action={setPrimaryContact}>
                      <input type="hidden" name="id" value={row.id} />
                      <button className="crm-users-secondary" type="submit">
                        ตั้งเป็นหลัก
                      </button>
                    </form>
                  ) : null}
                  {row.isPrimary && records.length === 1 ? (
                    <p className="crm-contact-image-hint">ต้องมีรายการหลักอย่างน้อยหนึ่งรายการ</p>
                  ) : confirmId === row.id ? (
                    <div className="crm-contact-inline-confirm" role="status">
                      <p>
                        {row.isPrimary
                          ? "นี่คือรายการหลักของหน้า Contact หากลบ ระบบจะตั้งรายการถัดไปเป็นหลัก"
                          : `ยืนยันลบ “${row.label || row.companyNameTh || "รายการนี้"}”?`}
                      </p>
                      <div>
                        <button type="button" className="crm-users-secondary" onClick={() => setConfirmId("")}>
                          ยกเลิก
                        </button>
                        <form action={deleteContact}>
                          <input type="hidden" name="id" value={row.id} />
                          <button className="kpi-button crm-users-delete-btn" type="submit">
                            ลบรายการ
                          </button>
                        </form>
                      </div>
                    </div>
                  ) : (
                    <button type="button" className="crm-users-secondary" onClick={() => setConfirmId(row.id)}>
                      ลบ
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="crm-contact-editor" aria-label={creating ? "เพิ่มข้อมูลติดต่อ" : "แก้ไขข้อมูลติดต่อ"}>
        <div className="crm-cms-globals-panel-head">
          <div>
            <p className="crm-cms-globals-kicker">{creating ? "เพิ่มใหม่" : "แก้ไข"}</p>
            <h2>{creating ? "รายการติดต่อใหม่" : "ข้อมูลติดต่อสาธารณะ"}</h2>
            <p>ค่าที่บันทึกในรายการหลักจะไปแสดงบนหน้า Contact, Hero และ Footer บันทึกภายในไม่ถูกเผยแพร่</p>
          </div>
        </div>

        {ok ? (
          <p className="crm-users-alert is-ok" role="status">
            {ok}
          </p>
        ) : null}
        {status ? (
          <p className="crm-users-alert is-warn" role="alert">
            {status}
          </p>
        ) : null}

        <form
          className="crm-cms-globals-form crm-contact-form"
          onSubmit={(event) => {
            event.preventDefault();
            const invalid = validateContactInput(form);
            if (invalid) {
              setStatus(contactErrorMessage(invalid));
              setOk("");
              return;
            }
            const data = new FormData(event.currentTarget);
            startTransition(async () => {
              const result = await saveContact(data);
              if (!result.ok) {
                setStatus(contactErrorMessage(result.error));
                setOk("");
                return;
              }
              setOk("บันทึกข้อมูลติดต่อแล้ว — หน้า Contact สาธารณะอัปเดตแล้ว");
              setStatus("");
              router.push(`/crm/cms/contacts?id=${result.id}&saved=1`);
              router.refresh();
            });
          }}
        >
          {form.id ? <input type="hidden" name="id" value={form.id} /> : null}
          <input type="hidden" name="locationImage" value={form.locationImage} />
          <input type="hidden" name="consultantImage" value={form.consultantImage} />

          <Field label="ชื่อภายใน (ไม่แสดงบนเว็บ)" hint="ใช้ในแอดมิน เช่น สำนักงานภูเก็ต">
            <input className="crm-field" name="label" value={form.label} onChange={(e) => patch("label", e.target.value)} />
          </Field>
          <div className="crm-contact-pair">
            <Field label="ชื่อบริษัท (ไทย)">
              <input className="crm-field" name="companyNameTh" value={form.companyNameTh} placeholder={placeholders.companyNameTh} onChange={(e) => patch("companyNameTh", e.target.value)} />
            </Field>
            <Field label="ชื่อบริษัท (อังกฤษ)">
              <input className="crm-field" name="companyNameEn" value={form.companyNameEn} placeholder={placeholders.companyNameEn} onChange={(e) => patch("companyNameEn", e.target.value)} />
            </Field>
          </div>
          <Field label="ที่อยู่ (ไทย)">
            <textarea className="crm-area" name="addressTh" rows={3} value={form.addressTh} placeholder={placeholders.addressTh} onChange={(e) => patch("addressTh", e.target.value)} />
          </Field>
          <Field label="ที่อยู่ (อังกฤษ)">
            <textarea className="crm-area" name="addressEn" rows={3} value={form.addressEn} placeholder={placeholders.addressEn} onChange={(e) => patch("addressEn", e.target.value)} />
          </Field>
          <div className="crm-contact-pair">
            <Field label="โทรศัพท์หลัก">
              <input className="crm-field" name="phone" value={form.phone} placeholder={placeholders.phone} onChange={(e) => patch("phone", e.target.value)} />
            </Field>
            <Field label="โทรศัพท์สำรอง (ไม่บังคับ)">
              <input className="crm-field" name="secondaryPhone" value={form.secondaryPhone} placeholder={placeholders.secondaryPhone} onChange={(e) => patch("secondaryPhone", e.target.value)} />
            </Field>
          </div>
          <Field label="อีเมล">
            <input className="crm-field" name="email" type="email" value={form.email} placeholder={placeholders.email} onChange={(e) => patch("email", e.target.value)} />
          </Field>
          <Field label="หมายเลข WhatsApp (ไม่บังคับ)" hint="ใส่รหัสประเทศ เช่น 66826356266 — แยกจากเบอร์โทรหลักได้">
            <input className="crm-field" name="whatsappNumber" value={form.whatsappNumber} placeholder={placeholders.whatsappNumber} onChange={(e) => patch("whatsappNumber", e.target.value)} />
            {waPreview ? (
              <small>
                พรีวิวลิงก์:{" "}
                <a href={waPreview}>
                  {waPreview}
                </a>
              </small>
            ) : null}
          </Field>
          <Field label="Google Maps URL (ไม่บังคับ)">
            <input className="crm-field" name="googleMapsUrl" value={form.googleMapsUrl} placeholder={placeholders.googleMapsUrl} onChange={(e) => patch("googleMapsUrl", e.target.value)} />
          </Field>
          <Field label="Google Maps embed URL (ไม่บังคับ)">
            <textarea className="crm-area" name="googleMapsEmbed" rows={2} value={form.googleMapsEmbed} placeholder={placeholders.googleMapsEmbed} onChange={(e) => patch("googleMapsEmbed", e.target.value)} />
          </Field>
          <div className="crm-contact-pair">
            <Field label="เวลาทำการ ไทย (ไม่บังคับ)">
              <input className="crm-field" name="hoursTh" value={form.hoursTh} onChange={(e) => patch("hoursTh", e.target.value)} />
            </Field>
            <Field label="เวลาทำการ อังกฤษ (ไม่บังคับ)">
              <input className="crm-field" name="hoursEn" value={form.hoursEn} onChange={(e) => patch("hoursEn", e.target.value)} />
            </Field>
          </div>
          <div className="crm-contact-pair">
            <Field label="Facebook">
              <input className="crm-field" name="facebook" value={form.facebook} onChange={(e) => patch("facebook", e.target.value)} />
            </Field>
            <Field label="Instagram">
              <input className="crm-field" name="instagram" value={form.instagram} onChange={(e) => patch("instagram", e.target.value)} />
            </Field>
            <Field label="LinkedIn">
              <input className="crm-field" name="linkedin" value={form.linkedin} onChange={(e) => patch("linkedin", e.target.value)} />
            </Field>
            <Field label="TikTok">
              <input className="crm-field" name="tiktok" value={form.tiktok} onChange={(e) => patch("tiktok", e.target.value)} />
            </Field>
            <Field label="LINE URL">
              <input className="crm-field" name="lineHref" value={form.lineHref} onChange={(e) => patch("lineHref", e.target.value)} />
            </Field>
          </div>

          <Field label="รูปสถานที่ (ไม่บังคับ)" hint={LOCATION_IMAGE_HINT}>
            <input
              className="crm-field"
              type="file"
              name="locationImageFile"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => onFile("location", event.target.files?.[0])}
            />
            {form.locationImage ? (
              <label className="crm-contact-clear">
                <input type="checkbox" name="clearLocationImage" value="1" onChange={(e) => e.target.checked && patch("locationImage", "")} />
                ลบรูปสถานที่เมื่อบันทึก
              </label>
            ) : null}
            <ImagePreview src={locationPreview} alt={form.locationImageAlt} recommended={LOCATION_IMAGE_HINT} />
            <input className="crm-field" name="locationImageAlt" value={form.locationImageAlt} placeholder="คำอธิบายรูปสถานที่" onChange={(e) => patch("locationImageAlt", e.target.value)} />
          </Field>

          <Field label="รูปที่ปรึกษา (ไม่บังคับ)" hint={CONSULTANT_IMAGE_HINT}>
            <input
              className="crm-field"
              type="file"
              name="consultantImageFile"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => onFile("consultant", event.target.files?.[0])}
            />
            {form.consultantImage ? (
              <label className="crm-contact-clear">
                <input type="checkbox" name="clearConsultantImage" value="1" onChange={(e) => e.target.checked && patch("consultantImage", "")} />
                ลบรูปที่ปรึกษาเมื่อบันทึก
              </label>
            ) : null}
            <ImagePreview src={consultantPreview} alt={form.consultantImageAlt} recommended={CONSULTANT_IMAGE_HINT} />
            <input className="crm-field" name="consultantImageAlt" value={form.consultantImageAlt} placeholder="คำอธิบายรูป ถ้ามีรูปจริงเท่านั้น" onChange={(e) => patch("consultantImageAlt", e.target.value)} />
          </Field>

          <Field label="บันทึกภายใน (ไม่แสดงบนเว็บ)">
            <textarea className="crm-area" name="adminNotes" rows={3} value={form.adminNotes} onChange={(e) => patch("adminNotes", e.target.value)} />
          </Field>

          <label className="crm-contact-primary">
            <input type="checkbox" name="isPrimary" value="1" checked={form.isPrimary} onChange={(e) => patch("isPrimary", e.target.checked)} />
            ใช้เป็นข้อมูลติดต่อหลักบนเว็บสาธารณะ
          </label>

          <div className="crm-cms-globals-form-actions">
            <button className="kpi-button" type="submit" disabled={pending}>
              {pending ? "กำลังบันทึก…" : "บันทึกข้อมูลติดต่อ"}
            </button>
          </div>
        </form>
      </section>

      <aside className="crm-contact-preview" aria-label="ตัวอย่างหน้า Contact">
        <p className="crm-cms-globals-kicker">ตัวอย่าง</p>
        <h2>การ์ดบนหน้า Contact</h2>
        <p>ซ่อนช่องว่างโดยอัตโนมัติ บันทึกภายในและรูปที่ไม่มีจะไม่ถูกแสดง</p>
        {form.locationImage || locationPreview ? (
          <img className="crm-contact-preview-photo" src={locationPreview || form.locationImage} alt={form.locationImageAlt || ""} width={480} height={320} />
        ) : null}
        {form.consultantImage || consultantPreview ? (
          <img className="crm-contact-preview-photo" src={consultantPreview || form.consultantImage} alt={form.consultantImageAlt || ""} width={320} height={400} />
        ) : null}
        <ContactCard locale="th" contact={preview} variant="preview" />
      </aside>
    </div>
  );
}
