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
import { createPartner } from "@/lib/partners/actions";

type ModalApi = { open: () => void; close: () => void };

const NewPartnerModalContext = createContext<ModalApi | null>(null);

export function useNewPartnerModal() {
  const ctx = useContext(NewPartnerModalContext);
  if (!ctx) throw new Error("useNewPartnerModal must be used within NewPartnerModalProvider");
  return ctx;
}

export function NewPartnerOpenButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ctx = useContext(NewPartnerModalContext);
  if (!ctx) {
    return (
      <a href="/crm/partners?newPartner=1" className={className}>
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

export function NewPartnerModalProvider({
  error,
  autoOpen = false,
  children,
}: {
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
  }, [autoOpen, error]);

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
          className="crm-modal-panel crm-modal-panel-partner"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <div className="crm-modal-head">
            <div>
              <p className="crm-modal-eyebrow">Partner Management</p>
              <h2 id={titleId} className="crm-modal-title">
                เพิ่มพาร์ตเนอร์
              </h2>
              <p className="crm-modal-lead">สร้างบัญชีพาร์ตเนอร์ใหม่ พร้อม tier และ PIN สำหรับพอร์ทัล</p>
            </div>
            <button type="button" className="crm-modal-close" aria-label="ปิด" onClick={closeModal}>
              ✕
            </button>
          </div>

          <form action={createPartner} className="crm-modal-form">
            {error ? (
              <p className="crm-users-alert is-warn" role="alert">
                ไม่สามารถสร้างพาร์ตเนอร์ได้ ตรวจข้อมูลแล้วลองอีกครั้ง
              </p>
            ) : null}

            <div className="crm-modal-grid">
              <label className="crm-modal-field">
                ประเภท
                <select className="crm-select" name="type" defaultValue="individual">
                  <option value="individual">บุคคลธรรมดา</option>
                  <option value="company">นิติบุคคล</option>
                </select>
              </label>
              <label className="crm-modal-field">
                Tier
                <select className="crm-select" name="tier" defaultValue="referral">
                  <option value="referral">Referral Partner</option>
                  <option value="certified">Certified Partner</option>
                  <option value="solution">Solution Partner</option>
                </select>
              </label>
              <label className="crm-modal-field">
                ชื่อตามเอกสาร
                <input className="crm-field" name="legalName" placeholder="ชื่อตามเอกสาร" required autoFocus />
              </label>
              <label className="crm-modal-field">
                ชื่อที่แสดง
                <input className="crm-field" name="displayName" placeholder="ชื่อที่แสดง" required />
              </label>
              <label className="crm-modal-field">
                อีเมล
                <input className="crm-field" name="email" type="email" required />
              </label>
              <label className="crm-modal-field">
                เบอร์โทร
                <input className="crm-field" name="phone" placeholder="เบอร์โทร" required />
              </label>
              <label className="crm-modal-field crm-modal-span-2">
                ที่อยู่
                <input className="crm-field" name="address" placeholder="ที่อยู่" />
              </label>
              <label className="crm-modal-field">
                เลขผู้เสียภาษี
                <input className="crm-field" name="taxId" placeholder="เลขผู้เสียภาษี" />
              </label>
              <label className="crm-modal-field">
                PIN 4 หลัก
                <input
                  className="crm-field"
                  name="pin"
                  inputMode="numeric"
                  maxLength={4}
                  pattern="[0-9]{4}"
                  placeholder="PIN 4 หลัก"
                  required
                />
              </label>
            </div>

            <div className="crm-modal-actions">
              <button type="button" className="crm-users-secondary" onClick={closeModal}>
                ยกเลิก
              </button>
              <button className="kpi-button" type="submit">
                สร้างพาร์ตเนอร์
              </button>
            </div>
          </form>
        </div>
      </div>
    ) : null;

  return (
    <NewPartnerModalContext.Provider value={{ open: openModal, close: closeModal }}>
      {children}
      {dialog && mounted ? createPortal(dialog, document.body) : null}
    </NewPartnerModalContext.Provider>
  );
}
