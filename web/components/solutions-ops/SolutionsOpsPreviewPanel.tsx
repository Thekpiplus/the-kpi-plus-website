"use client";

import Link from "next/link";
import { useState } from "react";
import { localizedRoute, type SolLocale } from "@/lib/solutions-ops/locale-routes";
import { SOL_CMS_PATH, SOL_PUBLIC_PATH, SOL_STATUS_LABEL, departmentLabelIn, type SolDepartmentOption, type SolServiceRow } from "@/lib/solutions-ops/types";
import "./solutions-ops.css";

const LOCALES: SolLocale[] = ["th", "en", "ru", "zh"];

export function SolutionsOpsPreviewPanel({
  services,
  departments = [],
}: {
  services: Pick<SolServiceRow, "id" | "name" | "publicRoute" | "status" | "ownerDepartment">[];
  departments?: SolDepartmentOption[];
}) {
  const [route, setRoute] = useState(SOL_PUBLIC_PATH);
  const [locale, setLocale] = useState<SolLocale>("th");
  const [showFrame, setShowFrame] = useState(false);
  const src = localizedRoute(route, locale);
  const routed = services.filter((item) => item.publicRoute);

  return (
    <div className="b2b-page sol-ops">
      <p className="sol-note">
        หน้านี้ดูตัวอย่างหน้าสาธารณะที่เผยแพร่อยู่จริง — ไดเรกทอรีภายในไม่เขียนทับหน้าเว็บ การแก้ไขเนื้อหาสาธารณะทำที่ตัวแก้ไข CMS แยกต่างหาก ซึ่งไม่ถูกเปลี่ยนโดยโมดูลนี้
      </p>

      <div className="b2b-inline" style={{ marginBottom: "0.9rem" }}>
        <a className="kpi-button b2b-save" href={src} target="_blank" rel="noopener noreferrer">
          เปิด {src} ในแท็บใหม่
        </a>
        <Link className="crm-users-secondary" href={SOL_CMS_PATH}>
          แก้ไขหน้า Solutions ใน CMS →
        </Link>
        <button type="button" className="crm-users-secondary" aria-expanded={showFrame} onClick={() => setShowFrame((value) => !value)}>
          {showFrame ? "ซ่อนตัวอย่างในหน้านี้" : "แสดงตัวอย่างในหน้านี้ (iframe)"}
        </button>
      </div>

      <div className="b2b-filters" style={{ marginBottom: "0.9rem" }}>
        <select className="crm-select" value={route} onChange={(event) => setRoute(event.target.value)} aria-label="หน้าที่ต้องการดู">
          <option value={SOL_PUBLIC_PATH}>/solutions (หน้ารวม)</option>
          {routed.map((item) => (
            <option key={item.id} value={item.publicRoute}>
              {item.name} — {item.publicRoute}
            </option>
          ))}
        </select>
        <select className="crm-select" value={locale} onChange={(event) => setLocale(event.target.value as SolLocale)} aria-label="ภาษา">
          {LOCALES.map((item) => (
            <option key={item} value={item}>
              {item.toUpperCase()}
              {item === "th" ? " (ค่าเริ่มต้น ไม่มี prefix)" : ""}
            </option>
          ))}
        </select>
      </div>

      {showFrame ? (
        <iframe className="sol-preview-frame" src={src} title={`ตัวอย่าง ${src}`} loading="lazy" referrerPolicy="same-origin" />
      ) : (
        <p className="b2b-muted">กด “แสดงตัวอย่างในหน้านี้” เพื่อโหลดหน้าสาธารณะ ({src}) — หากไม่แสดง ให้เปิดในแท็บใหม่</p>
      )}

      <section className="crm-cms-block">
        <h2>เส้นทางสาธารณะของบริการ / Service routes</h2>
        {routed.length === 0 ? (
          <p className="crm-pipe-table-empty">ยังไม่มีบริการที่ระบุ public route — เพิ่มที่ Service Catalog</p>
        ) : (
          <table className="crm-pipe-table b2b-table" aria-label="เส้นทางสาธารณะของบริการ">
            <thead>
              <tr>
                <th scope="col">บริการ</th>
                <th scope="col">แผนก</th>
                <th scope="col">สถานะภายใน</th>
                <th scope="col">เปิดหน้าสาธารณะ</th>
              </tr>
            </thead>
            <tbody>
              {routed.map((item) => (
                <tr key={item.id}>
                  <td data-label="บริการ">{item.name}</td>
                  <td data-label="แผนก">{departmentLabelIn(item.ownerDepartment, departments)}</td>
                  <td data-label="สถานะภายใน">
                    <span className={`b2b-status is-${item.status}`}>{SOL_STATUS_LABEL[item.status]}</span>
                  </td>
                  <td data-label="เปิดหน้าสาธารณะ">
                    {LOCALES.map((item2) => (
                      <a key={item2} className="sol-chip is-yes" href={localizedRoute(item.publicRoute, item2)} target="_blank" rel="noopener noreferrer">
                        {item2.toUpperCase()}
                      </a>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
