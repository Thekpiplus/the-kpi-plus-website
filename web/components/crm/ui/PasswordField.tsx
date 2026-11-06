"use client";

import { useId, useRef, useState } from "react";

function generatePassword(length = 6) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

function IconEye({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <path
          d="M3 3l18 18M10.6 10.7a2.5 2.5 0 0 0 3.5 3.5M9.9 5.2A10.4 10.4 0 0 1 12 5c5.2 0 8.9 4.2 10.2 6.1a1.3 1.3 0 0 1 0 1.5c-.5.8-1.5 2.1-2.9 3.3M6.7 6.8C4.8 8.2 3.5 9.9 2.8 11a1.3 1.3 0 0 0 0 1.5C4.1 14.4 7.8 18 13 18c1.1 0 2.1-.2 3-.5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M2.8 11.2C4.1 9.2 7.8 5.5 12 5.5s7.9 3.7 9.2 5.7a1.3 1.3 0 0 1 0 1.5C19.9 14.7 16.2 18.5 12 18.5s-7.9-3.8-9.2-5.8a1.3 1.3 0 0 1 0-1.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function PasswordField({
  name = "password",
  label = "รหัสผ่าน",
  required = true,
  minLength = 4,
  autoFocus = false,
  autoComplete = "new-password",
  showGenerate = true,
  syncToName,
  value,
  onChange,
  onGenerated,
  className = "",
}: {
  name?: string;
  label?: string;
  required?: boolean;
  minLength?: number;
  autoFocus?: boolean;
  autoComplete?: string;
  showGenerate?: boolean;
  /** When generating, also fill another input in the same form (e.g. passwordConfirm). */
  syncToName?: string;
  value?: string;
  onChange?: (value: string) => void;
  onGenerated?: (value: string) => void;
  className?: string;
}) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [visible, setVisible] = useState(false);
  const [internal, setInternal] = useState("");
  const controlled = value !== undefined;
  const current = controlled ? value : internal;

  function setPassword(next: string) {
    if (!controlled) setInternal(next);
    onChange?.(next);
  }

  function syncConfirm(next: string) {
    if (!syncToName) return;
    const form = inputRef.current?.form;
    if (!form) return;
    const target = form.elements.namedItem(syncToName);
    if (target instanceof HTMLInputElement) {
      const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
      setter?.call(target, next);
      target.dispatchEvent(new Event("input", { bubbles: true }));
      target.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  function onGenerate() {
    const next = generatePassword(6);
    setPassword(next);
    setVisible(true);
    syncConfirm(next);
    onGenerated?.(next);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <div className={`crm-modal-field crm-password-field-wrap ${className}`.trim()}>
      <div className="crm-password-field-label">
        <label htmlFor={inputId}>{label}</label>
        {showGenerate ? (
          <button type="button" className="crm-password-generate" onClick={onGenerate}>
            สร้างรหัสผ่าน
          </button>
        ) : null}
      </div>
      <div className="crm-password-field">
        <input
          ref={inputRef}
          id={inputId}
          className="crm-field"
          type={visible ? "text" : "password"}
          name={name}
          value={current}
          onChange={(event) => setPassword(event.target.value)}
          minLength={minLength}
          required={required}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="crm-password-toggle"
          onClick={() => setVisible((currentVisible) => !currentVisible)}
          aria-label={visible ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
          aria-pressed={visible}
          title={visible ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
        >
          <IconEye open={visible} />
        </button>
      </div>
    </div>
  );
}

/** Password + confirm fields that stay in sync when generating. */
export function PasswordChangeFields() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [confirmVisible, setConfirmVisible] = useState(false);
  const confirmId = useId();

  return (
    <>
      <PasswordField
        name="password"
        label="รหัสผ่านใหม่"
        value={password}
        onChange={setPassword}
        onGenerated={(next) => {
          setPassword(next);
          setConfirm(next);
          setConfirmVisible(true);
        }}
        autoFocus
      />
      <div className="crm-modal-field crm-password-field-wrap">
        <div className="crm-password-field-label">
          <label htmlFor={confirmId}>ยืนยันรหัสผ่านใหม่</label>
        </div>
        <div className="crm-password-field">
          <input
            id={confirmId}
            className="crm-field"
            type={confirmVisible ? "text" : "password"}
            name="passwordConfirm"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            minLength={4}
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            className="crm-password-toggle"
            onClick={() => setConfirmVisible((current) => !current)}
            aria-label={confirmVisible ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
            aria-pressed={confirmVisible}
            title={confirmVisible ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
          >
            <IconEye open={confirmVisible} />
          </button>
        </div>
      </div>
    </>
  );
}
