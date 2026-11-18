"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { CrmSelect } from "@/components/crm/CrmSelect";
import { LeadServicesField } from "@/components/crm/LeadServicesField";
import "@/components/crm/leads/leads-a.css";
import { createLeadAndOpen } from "@/lib/crm/actions";
import { SOURCES } from "@/lib/crm/constants";
import { sourceLabel } from "@/lib/crm/sources";

type ModalApi = { open: () => void; close: () => void };

const NewLeadModalContext = createContext<ModalApi | null>(null);

const KEY_SOURCES = SOURCES.filter((source) => source !== "website_form");

export function useNewLeadModal() {
  const ctx = useContext(NewLeadModalContext);
  if (!ctx) throw new Error("useNewLeadModal must be used within NewLeadModalProvider");
  return ctx;
}

export function NewLeadOpenButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ctx = useContext(NewLeadModalContext);
  if (!ctx) {
    return (
      <a href="/crm/leads?newLead=1" className={className}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={className} onClick={ctx.open}>
      {children}
    </button>
  );
}

export function NewLeadModalProvider({
  partners,
  owners,
  currentUserId,
  duplicateId,
  error,
  autoOpen = false,
  children,
}: {
  partners: { id: string; displayName: string; tier: string }[];
  owners: { id: string; name: string }[];
  currentUserId?: string;
  duplicateId?: string;
  error?: string;
  autoOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(autoOpen);
  const [mounted, setMounted] = useState(false);
  const titleId = useId();

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (autoOpen) setOpen(true);
  }, [autoOpen, duplicateId, error]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const panel =
    open && mounted ? (
      <div className={`kpi-leads-create-root is-open`} role="presentation">
        <button
          type="button"
          className="kpi-leads-create-scrim"
          aria-label="ปิดแผงเพิ่มลีด"
          onClick={closeModal}
        />
        <aside
          className="kpi-leads-create-panel"
          role="region"
          aria-labelledby={titleId}
        >
          <div className="kpi-leads-create-head">
            <div>
              <p className="kpi-leads-create-eyebrow">Lead Management</p>
              <h2 id={titleId} className="kpi-leads-create-title">
                เพิ่มลีดใหม่
              </h2>
              <p className="kpi-leads-create-lead">
                บันทึกลีดจากโทร LINE WhatsApp หรือแหล่งอื่น แล้วติดตามต่อได้ทันที
              </p>
            </div>
            <button
              type="button"
              className="kpi-leads-create-close"
              aria-label="ยกเลิกและปิดแผง"
              onClick={closeModal}
            >
              ✕
            </button>
          </div>

          <form action={createLeadAndOpen} method="post" className="kpi-leads-create-form">
            <div className="kpi-leads-create-body">
              {duplicateId ? (
                <p className="kpi-leads-alert" role="alert">
                  พบบันทึกที่อาจซ้ำ{" "}
                  <a className="underline" href={`/crm/leads/${duplicateId}`}>
                    เปิดลีดเดิม
                  </a>{" "}
                  หรือกดบันทึกอีกครั้งเพื่อสร้างต่อ
                </p>
              ) : null}
              {error && !duplicateId ? (
                <p className="kpi-leads-alert" role="alert">
                  บันทึกลีดไม่สำเร็จ ตรวจชื่อผู้ติดต่อแล้วลองใหม่
                </p>
              ) : null}
              {duplicateId ? <input type="hidden" name="confirmDuplicate" value="1" /> : null}

              <div className="crm-modal-grid">
                <label className="crm-modal-field">
                  ชื่อผู้ติดต่อ *
                  <input className="crm-field" name="contactName" required autoFocus />
                </label>
                <label className="crm-modal-field">
                  กิจการ
                  <input className="crm-field" name="businessName" />
                </label>
                <label className="crm-modal-field">
                  ประเภทกิจการ
                  <input className="crm-field" name="businessType" />
                </label>
                <label className="crm-modal-field">
                  เบอร์โทร
                  <input className="crm-field" name="phone" />
                </label>
                <label className="crm-modal-field">
                  อีเมล
                  <input className="crm-field" name="email" type="email" />
                </label>
                <label className="crm-modal-field">
                  ที่ตั้ง
                  <input className="crm-field" name="location" />
                </label>
                <label className="crm-modal-field">
                  เว็บไซต์
                  <input className="crm-field" name="website" />
                </label>
                <label className="crm-modal-field">
                  มอบหมายให้
                  <CrmSelect
                    name="ownerId"
                    aria-label="มอบหมายให้"
                    defaultValue={currentUserId ?? owners[0]?.id ?? ""}
                    options={owners.map((owner) => ({ value: owner.id, label: owner.name }))}
                  />
                </label>
                <label className="crm-modal-field">
                  แหล่งที่มา
                  <CrmSelect
                    name="source"
                    aria-label="แหล่งที่มา"
                    defaultValue="manual"
                    options={KEY_SOURCES.map((source) => ({
                      value: source,
                      label: sourceLabel(source),
                    }))}
                  />
                </label>
                <label className="crm-modal-field">
                  พาร์ตเนอร์ที่ได้รับเครดิต
                  <CrmSelect
                    name="partnerId"
                    aria-label="พาร์ตเนอร์ที่ได้รับเครดิต"
                    defaultValue=""
                    options={[
                      { value: "", label: "ไม่มี" },
                      ...partners.map((partner) => ({
                        value: partner.id,
                        label: partner.displayName,
                      })),
                    ]}
                  />
                </label>
                <label className="crm-modal-field">
                  มูลค่าโดยประมาณ
                  <input className="crm-field" name="estimatedValue" type="number" min="0" />
                </label>
              </div>

              <LeadServicesField compact />

              <label className="crm-modal-field">
                บันทึกการคุยครั้งนี้
                <textarea
                  className="crm-field"
                  name="notes"
                  rows={2}
                  placeholder="คุยอะไรไปแล้ว ต้องติดตามเรื่องอะไร"
                />
              </label>
            </div>

            <div className="kpi-leads-create-actions">
              <button type="button" className="kpi-leads-btn-secondary" onClick={closeModal}>
                ยกเลิก
              </button>
              <button className="kpi-leads-btn-primary" type="submit">
                บันทึกลีดแล้วไปติดตาม
              </button>
            </div>
          </form>
        </aside>
      </div>
    ) : null;

  return (
    <NewLeadModalContext.Provider value={{ open: openModal, close: closeModal }}>
      {children}
      {panel && mounted ? createPortal(panel, document.body) : null}
    </NewLeadModalContext.Provider>
  );
}
