"use client";

import { useMemo, useState, type FormEvent } from "react";
import { SERVICE_GROUPS, SERVICES } from "@/lib/crm/constants";

function normalizeService(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function uniqueServices(values: string[]) {
  const seen = new Set<string>();
  const next: string[] = [];
  for (const raw of values) {
    const value = normalizeService(raw);
    if (!value) continue;
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    next.push(value);
  }
  return next;
}

export function LeadServicesField({
  selected = [],
  legend = "บริการที่สนใจ",
  hint = "เลือกได้หลายรายการ หรือเพิ่มบริการอื่นที่ไม่อยู่ในรายการ",
  compact = false,
}: {
  selected?: string[];
  legend?: string;
  hint?: string;
  compact?: boolean;
}) {
  const initial = useMemo(() => uniqueServices(selected), [selected]);
  const presetSet = useMemo(() => new Set(SERVICES.map((item) => item.toLowerCase())), []);
  const [checked, setChecked] = useState<string[]>(() => initial.filter((item) => presetSet.has(item.toLowerCase())));
  const [custom, setCustom] = useState<string[]>(() => initial.filter((item) => !presetSet.has(item.toLowerCase())));
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");

  function togglePreset(service: string, on: boolean) {
    setChecked((prev) => (on ? uniqueServices([...prev, service]) : prev.filter((item) => item !== service)));
  }

  function addCustom(event?: FormEvent) {
    event?.preventDefault();
    const value = normalizeService(draft);
    if (!value) {
      setError("กรอกชื่อบริการก่อนเพิ่ม");
      return;
    }
    const key = value.toLowerCase();
    if (checked.some((item) => item.toLowerCase() === key) || custom.some((item) => item.toLowerCase() === key)) {
      setError("บริการนี้อยู่ในรายการแล้ว");
      return;
    }
    const presetMatch = SERVICES.find((item) => item.toLowerCase() === key);
    if (presetMatch) {
      setChecked((prev) => uniqueServices([...prev, presetMatch]));
    } else {
      setCustom((prev) => uniqueServices([...prev, value]));
    }
    setDraft("");
    setError("");
  }

  function removeCustom(service: string) {
    setCustom((prev) => prev.filter((item) => item !== service));
  }

  return (
    <fieldset className={`crm-modal-modules crm-lead-services${compact ? " is-compact" : ""}`}>
      <legend>{legend}</legend>
      {hint ? <p>{hint}</p> : null}

      <div className="crm-lead-service-groups">
        {SERVICE_GROUPS.map((group) => (
          <div key={group.id} className="crm-lead-service-group">
            <p className="crm-lead-service-group-title">
              <span>{group.labelEn}</span>
              <span className="crm-lead-service-group-sub">{group.labelTh}</span>
            </p>
            <div className="crm-modal-module-grid">
              {group.items.map((service) => {
                const isOn = checked.includes(service);
                return (
                  <label key={service} className={`crm-modal-check${isOn ? " is-checked" : ""}`}>
                    <input
                      type="checkbox"
                      name="services"
                      value={service}
                      checked={isOn}
                      onChange={(event) => togglePreset(service, event.target.checked)}
                    />
                    <span>{service}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="crm-lead-service-custom">
        <p className="crm-lead-service-group-title">
          <span>Other / Custom</span>
          <span className="crm-lead-service-group-sub">บริการอื่น / เพิ่มเอง</span>
        </p>
        <div className="crm-lead-service-add">
          <input
            className="crm-field"
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              if (error) setError("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addCustom();
              }
            }}
            placeholder="เช่น Custom Package, Branding Sprint, PMS Migration"
            aria-label="เพิ่มบริการอื่น"
          />
          <button type="button" className="crm-users-secondary" onClick={() => addCustom()}>
            เพิ่ม
          </button>
        </div>
        {error ? (
          <p className="crm-lead-service-error" role="alert">
            {error}
          </p>
        ) : (
          <p className="crm-lead-service-help">ใช้เมื่อบริการไม่อยู่ในแคตตาล็อกด้านบน — ยังเลือกหลายรายการและเพิ่มเองได้</p>
        )}
        {custom.length ? (
          <ul className="crm-lead-service-chips" aria-label="บริการที่เพิ่มเอง">
            {custom.map((service) => (
              <li key={service}>
                <input type="hidden" name="services" value={service} />
                <span>{service}</span>
                <button type="button" aria-label={`ลบ ${service}`} onClick={() => removeCustom(service)}>
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </fieldset>
  );
}
