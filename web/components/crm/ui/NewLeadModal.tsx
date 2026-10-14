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
import { createLeadAndOpen } from "@/lib/crm/actions";
import { SERVICES, SOURCES } from "@/lib/crm/constants";
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
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const dialog =
    open && mounted ? (
        <div className="crm-modal" role="presentation">
          <button type="button" className="crm-modal-backdrop" aria-label="ปิดหน้าต่าง" onClick={closeModal} />
          <div
            className="crm-modal-panel crm-modal-panel-lead"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <div className="crm-modal-head">
              <div>
                <p className="crm-modal-eyebrow">Lead Management</p>
                <h2 id={titleId} className="crm-modal-title">
                  คีย์ลีด
                </h2>
                <p className="crm-modal-lead">บันทึกลีดจากโทร LINE WhatsApp หรือแหล่งอื่น แล้วติดตามต่อได้ทันที</p>
              </div>
              <button type="button" className="crm-modal-close" aria-label="ปิด" onClick={closeModal}>
                ✕
              </button>
            </div>

            <form action={createLeadAndOpen} method="post" className="crm-modal-form">
              {duplicateId ? (
                <p className="crm-users-alert is-warn" role="alert">
                  พบบันทึกที่อาจซ้ำ{" "}
                  <a className="underline" href={`/crm/leads/${duplicateId}`}>
                    เปิดลีดเดิม
                  </a>{" "}
                  หรือกดบันทึกอีกครั้งเพื่อสร้างต่อ
                </p>
              ) : null}
              {error && !duplicateId ? (
                <p className="crm-users-alert is-warn" role="alert">
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
                  <select className="crm-select" name="ownerId" defaultValue={currentUserId ?? ""}>
                    {owners.map((owner) => (
                      <option key={owner.id} value={owner.id}>
                        {owner.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="crm-modal-field">
                  แหล่งที่มา
                  <select className="crm-select" name="source" defaultValue="manual">
                    {KEY_SOURCES.map((source) => (
                      <option key={source} value={source}>
                        {sourceLabel(source)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="crm-modal-field">
                  พาร์ตเนอร์ที่ได้รับเครดิต
                  <select className="crm-select" name="partnerId" defaultValue="">
                    <option value="">ไม่มี</option>
                    {partners.map((partner) => (
                      <option key={partner.id} value={partner.id}>
                        {partner.displayName}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="crm-modal-field">
                  มูลค่าโดยประมาณ
                  <input className="crm-field" name="estimatedValue" type="number" min="0" />
                </label>
              </div>

              <fieldset className="crm-modal-modules">
                <legend>บริการที่สนใจ</legend>
                <div className="crm-modal-module-grid">
                  {SERVICES.map((service) => (
                    <label key={service} className="crm-modal-check">
                      <input type="checkbox" name="services" value={service} />
                      <span>{service}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="crm-modal-field">
                บันทึกการคุยครั้งนี้
                <textarea
                  className="crm-field"
                  name="notes"
                  rows={2}
                  placeholder="คุยอะไรไปแล้ว ต้องติดตามเรื่องอะไร"
                />
              </label>

              <div className="crm-modal-actions">
                <button type="button" className="crm-users-secondary" onClick={closeModal}>
                  ยกเลิก
                </button>
                <button className="kpi-button" type="submit">
                  บันทึกลีดแล้วไปติดตาม
                </button>
              </div>
            </form>
          </div>
        </div>
    ) : null;

  return (
    <NewLeadModalContext.Provider value={{ open: openModal, close: closeModal }}>
      {children}
      {dialog && mounted ? createPortal(dialog, document.body) : null}
    </NewLeadModalContext.Provider>
  );
}
