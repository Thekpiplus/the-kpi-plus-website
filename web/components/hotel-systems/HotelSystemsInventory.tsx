"use client";

import { useEffect, useMemo, useState } from "react";
import type { CmsSystemsDictionaryRow, CmsSystemsInventoryRow } from "@/lib/cms/hotel-systems-page";
import {
  SYSTEMS_DICTIONARY_COLUMNS,
  SYSTEMS_INVENTORY_COLUMNS,
  SYSTEMS_INVENTORY_ENVIRONMENTS,
  SYSTEMS_INVENTORY_LABELS,
  SYSTEMS_INVENTORY_STATUSES,
  SYSTEMS_INVENTORY_VISUAL,
  SYSTEMS_MAPPING_STATUSES,
  systemsInventoryEnvironment,
  systemsInventoryStatus,
  systemsMappingStatus,
  systemsRenderableSrc,
  systemsSampleSafeText,
} from "@/lib/hotel-systems";
import type { Locale } from "@/lib/seo";

function storageKey(locale: Locale) {
  return `kpi-systems-inventory-dictionary-v1-${locale}`;
}

type InvDraft = {
  environment?: string;
  status?: string;
  owner?: string;
  reviewed?: string;
};

type DictDraft = {
  mapping?: string;
  owner?: string;
  notes?: string;
};

type StoreDraft = {
  inventory?: Record<string, InvDraft>;
  dictionary?: Record<string, DictDraft>;
};

function safe(value?: string) {
  return systemsSampleSafeText(value) || "";
}

function inventoryCopy(row: CmsSystemsInventoryRow, thai: boolean, sample: boolean, draft: InvDraft) {
  const rawStatus = draft.status || row.status;
  const status = systemsInventoryStatus((sample || !row.verified) && rawStatus === "connected" ? "not_configured" : rawStatus);
  return {
    id: row.id,
    system: safe(thai ? row.systemTh || row.systemEn : row.systemEn || row.systemTh),
    provider: safe(thai ? row.providerTh || row.providerEn : row.providerEn || row.providerTh),
    purpose: safe(thai ? row.purposeTh || row.purposeEn : row.purposeEn || row.purposeTh),
    owner: safe(draft.owner ?? (thai ? row.ownerTh || row.ownerEn : row.ownerEn || row.ownerTh)),
    dataIn: safe(thai ? row.dataInTh || row.dataInEn : row.dataInEn || row.dataInTh),
    dataOut: safe(thai ? row.dataOutTh || row.dataOutEn : row.dataOutEn || row.dataOutTh),
    connector: safe(row.connector),
    environment: systemsInventoryEnvironment(draft.environment || row.environment),
    status,
    reviewed: safe(draft.reviewed ?? row.reviewed),
  };
}

function dictionaryCopy(row: CmsSystemsDictionaryRow, thai: boolean, draft: DictDraft) {
  const required = String(row.required || "").toLowerCase() === "required";
  return {
    id: row.id,
    field: safe(row.field),
    meaning: safe(thai ? row.meaningTh || row.meaningEn : row.meaningEn || row.meaningTh),
    source: safe(thai ? row.sourceTh || row.sourceEn : row.sourceEn || row.sourceTh),
    destination: safe(thai ? row.destinationTh || row.destinationEn : row.destinationEn || row.destinationTh),
    format: safe(row.format),
    required: required ? (thai ? "จำเป็น" : "Required") : thai ? "ไม่บังคับ" : "Optional",
    mapping: systemsMappingStatus(draft.mapping || row.mappingStatus),
    owner: safe(draft.owner ?? (thai ? row.ownerTh || row.ownerEn : row.ownerEn || row.ownerTh)),
    notes: safe(draft.notes ?? (thai ? row.notesTh || row.notesEn : row.notesEn || row.notesTh)),
  };
}

export function HotelSystemsInventory({
  locale,
  src,
  alt,
  status,
  label,
  caption,
  sampleLabel,
  systemsTitle,
  fieldsTitle,
  rows,
  fields,
}: {
  locale: Locale;
  src?: string;
  alt?: string;
  status?: string;
  label?: string;
  caption?: string;
  sampleLabel?: string;
  systemsTitle?: string;
  fieldsTitle?: string;
  rows: CmsSystemsInventoryRow[];
  fields: CmsSystemsDictionaryRow[];
}) {
  const thai = locale === "th";
  const sample = status !== "approved" && status !== "real";
  const fileSrc = systemsRenderableSrc(src, status);
  const labels = SYSTEMS_INVENTORY_LABELS;
  const invCols = SYSTEMS_INVENTORY_COLUMNS;
  const dictCols = SYSTEMS_DICTIONARY_COLUMNS;
  const displaySample = sampleLabel?.trim() || SYSTEMS_INVENTORY_VISUAL.labelEn;
  const displayLabel = label?.trim() || displaySample;
  const displayCaption = caption?.trim() || (thai ? SYSTEMS_INVENTORY_VISUAL.captionTh : SYSTEMS_INVENTORY_VISUAL.captionEn);
  const displayAlt = alt?.trim() || (thai ? SYSTEMS_INVENTORY_VISUAL.altTh : SYSTEMS_INVENTORY_VISUAL.altEn);
  const [inventoryDrafts, setInventoryDrafts] = useState<Record<string, InvDraft>>({});
  const [dictionaryDrafts, setDictionaryDrafts] = useState<Record<string, DictDraft>>({});
  const [saved, setSaved] = useState("");

  useEffect(() => {
    setInventoryDrafts({});
    setDictionaryDrafts({});
    try {
      const raw = window.sessionStorage.getItem(storageKey(locale));
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoreDraft;
      if (parsed?.inventory && typeof parsed.inventory === "object") setInventoryDrafts(parsed.inventory);
      if (parsed?.dictionary && typeof parsed.dictionary === "object") setDictionaryDrafts(parsed.dictionary);
    } catch {
      /* ignore */
    }
  }, [locale]);

  const systems = useMemo(
    () => rows.map((row) => inventoryCopy(row, thai, sample, inventoryDrafts[row.id] || {})),
    [inventoryDrafts, rows, sample, thai],
  );
  const dictionary = useMemo(
    () => fields.map((row) => dictionaryCopy(row, thai, dictionaryDrafts[row.id] || {})),
    [dictionaryDrafts, fields, thai],
  );

  function patchInventory(id: string, next: InvDraft) {
    setSaved("");
    setInventoryDrafts((current) => ({
      ...current,
      [id]: {
        ...current[id],
        ...next,
        owner: next.owner !== undefined ? safe(next.owner) : current[id]?.owner,
        reviewed: next.reviewed !== undefined ? safe(next.reviewed) : current[id]?.reviewed,
      },
    }));
  }

  function patchDictionary(id: string, next: DictDraft) {
    setSaved("");
    setDictionaryDrafts((current) => ({
      ...current,
      [id]: {
        ...current[id],
        ...next,
        owner: next.owner !== undefined ? safe(next.owner) : current[id]?.owner,
        notes: next.notes !== undefined ? safe(next.notes) : current[id]?.notes,
      },
    }));
  }

  function saveSample() {
    const next: StoreDraft = {
      inventory: Object.fromEntries(systems.map((row) => [row.id, { environment: row.environment.id, status: row.status.id, owner: row.owner, reviewed: row.reviewed }])),
      dictionary: Object.fromEntries(dictionary.map((row) => [row.id, { mapping: row.mapping.id, owner: row.owner, notes: row.notes }])),
    };
    try {
      window.sessionStorage.setItem(storageKey(locale), JSON.stringify(next));
    } catch {
      /* ignore quota / private mode */
    }
    setSaved(thai ? "บันทึกบนอุปกรณ์นี้แล้ว เป็นตัวอย่าง ไม่ใช่บัญชีโรงแรมจริง" : "Saved on this device as a sample. Not a live hotel account.");
  }

  return (
    <div className="hsi-inv">
      <ul className="hsi-inv-flags" aria-label={thai ? "ป้ายข้อมูลตัวอย่าง" : "Sample data labels"}>
        <li className="kpi-latin">{thai ? labels.sample.th : labels.sample.en}</li>
        <li className="kpi-latin">{thai ? labels.replace.th : labels.replace.en}</li>
        <li className="kpi-latin">{thai ? labels.verify.th : labels.verify.en}</li>
      </ul>

      <figure className="hsi-inv-figure">
        {fileSrc ? (
          <div className="hsi-inv-photo">
            <img
              src={fileSrc}
              alt={displayAlt}
              width={SYSTEMS_INVENTORY_VISUAL.displayWidth}
              height={SYSTEMS_INVENTORY_VISUAL.displayHeight}
              style={{ aspectRatio: `${SYSTEMS_INVENTORY_VISUAL.displayWidth} / ${SYSTEMS_INVENTORY_VISUAL.displayHeight}` }}
              loading="lazy"
              decoding="async"
            />
            {sample ? <span className="hsi-visual-badge">{displaySample}</span> : null}
          </div>
        ) : (
          <div className="hsi-inv-board" role="img" aria-label={displayAlt}>
            {sample ? <span className="hsi-visual-badge">{displaySample}</span> : null}
            <p className="hsi-mock-kicker kpi-latin">Sample data · Replace with approved hotel data · Subject to provider verification</p>
            <p className="hsi-inv-board-title">{thai ? "ตารางสำรวจระบบ ไม่ใช่บัญชีโรงแรมจริง" : "Inventory table, not a live hotel account"}</p>
            <ul className="hsi-inv-preview">
              {systems.map((row) => (
                <li key={row.id}>
                  <strong className="kpi-latin">{row.system}</strong>
                  <span className="kpi-latin">{row.environment.label}</span>
                  <em className={`hsi-status is-${row.status.tone} kpi-latin`}>{row.status.label}</em>
                </li>
              ))}
            </ul>
          </div>
        )}
        <figcaption className="hsi-visual-caption">
          <strong>{displayLabel}</strong>
          <span className="hsi-visual-meta">{thai ? SYSTEMS_INVENTORY_VISUAL.metaTh : SYSTEMS_INVENTORY_VISUAL.metaEn}</span>
          <span>{displayCaption}</span>
        </figcaption>
      </figure>

      <p className="hsi-inv-note kpi-latin">Sample data. Replace with approved hotel data. Subject to provider verification. No account IDs, booking IDs, guest data, or passwords.</p>

      <ul className="hsi-inv-legend" aria-label={thai ? "คำอธิบายสถานะตัวอย่าง ไม่ใช่สถานะเชื่อมต่อของโรงแรมจริง" : "Sample status legend. Not a live hotel integration status."}>
        {SYSTEMS_INVENTORY_STATUSES.map((item) => (
          <li key={item.id}>
            <span className={`hsi-status is-${item.tone} kpi-latin`}>{item.label}</span>
          </li>
        ))}
        {SYSTEMS_MAPPING_STATUSES.filter((item) => !SYSTEMS_INVENTORY_STATUSES.some((status) => status.id === item.id)).map((item) => (
          <li key={`map-${item.id}`}>
            <span className={`hsi-status is-${item.tone} kpi-latin`}>{item.label}</span>
          </li>
        ))}
        {SYSTEMS_INVENTORY_ENVIRONMENTS.map((item) => (
          <li key={item.id}>
            <span className={`hsi-inv-env is-${item.id} kpi-latin`}>{item.label}</span>
          </li>
        ))}
      </ul>

      <div className="hsi-inv-block">
        <h3 className="hsi-inv-heading kpi-latin">{systemsTitle?.trim() || "System Inventory"}</h3>
        <div className="hsi-inv-table-wrap">
          <table className="hsi-inv-table">
            <caption className="sr-only">
              {thai
                ? "ตารางตัวอย่าง System Inventory ที่แก้ไขได้บนอุปกรณ์นี้ แสดงระบบ ผู้ให้บริการ วัตถุประสงค์ ผู้รับผิดชอบ ข้อมูลเข้า ข้อมูลออก API หรือ Connector สภาพแวดล้อม สถานะ และวันที่ตรวจล่าสุด ไม่มีรหัสบัญชี รหัสการจอง ข้อมูลแขก หรือรหัสผ่าน"
                : "Editable sample System Inventory of system, provider, purpose, owner, data in, data out, API or connector, environment, status, and last reviewed. No account IDs, booking IDs, guest data, or passwords."}
            </caption>
            <thead>
              <tr>
                <th scope="col">{thai ? invCols.system.th : invCols.system.en}</th>
                <th scope="col">{thai ? invCols.provider.th : invCols.provider.en}</th>
                <th scope="col">{thai ? invCols.purpose.th : invCols.purpose.en}</th>
                <th scope="col">{thai ? invCols.owner.th : invCols.owner.en}</th>
                <th scope="col">{thai ? invCols.dataIn.th : invCols.dataIn.en}</th>
                <th scope="col">{thai ? invCols.dataOut.th : invCols.dataOut.en}</th>
                <th scope="col">{thai ? invCols.connector.th : invCols.connector.en}</th>
                <th scope="col">{thai ? invCols.environment.th : invCols.environment.en}</th>
                <th scope="col">{thai ? invCols.status.th : invCols.status.en}</th>
                <th scope="col">{thai ? invCols.reviewed.th : invCols.reviewed.en}</th>
              </tr>
            </thead>
            <tbody>
              {systems.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.system}</th>
                  <td data-label={thai ? invCols.provider.th : invCols.provider.en}>{row.provider}</td>
                  <td data-label={thai ? invCols.purpose.th : invCols.purpose.en}>{row.purpose}</td>
                  <td data-label={thai ? invCols.owner.th : invCols.owner.en}>
                    <label>
                      <span className="sr-only">{thai ? invCols.owner.th : invCols.owner.en}</span>
                      <input className="hsi-review-field" value={row.owner} onChange={(event) => patchInventory(row.id, { owner: event.target.value })} />
                    </label>
                  </td>
                  <td data-label={thai ? invCols.dataIn.th : invCols.dataIn.en} className="kpi-latin">
                    {row.dataIn}
                  </td>
                  <td data-label={thai ? invCols.dataOut.th : invCols.dataOut.en} className="kpi-latin">
                    {row.dataOut}
                  </td>
                  <td data-label={thai ? invCols.connector.th : invCols.connector.en} className="kpi-latin">
                    {row.connector}
                  </td>
                  <td data-label={thai ? invCols.environment.th : invCols.environment.en}>
                    <label>
                      <span className="sr-only">{thai ? invCols.environment.th : invCols.environment.en}</span>
                      <select className={`hsi-inv-env is-${row.environment.id}`} value={row.environment.id} onChange={(event) => patchInventory(row.id, { environment: event.target.value })}>
                        {SYSTEMS_INVENTORY_ENVIRONMENTS.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </td>
                  <td data-label={thai ? invCols.status.th : invCols.status.en}>
                    <label className={`hsi-review-status is-${row.status.tone}`}>
                      <span className="sr-only">{thai ? invCols.status.th : invCols.status.en}</span>
                      <select value={row.status.id} onChange={(event) => patchInventory(row.id, { status: event.target.value })}>
                        {SYSTEMS_INVENTORY_STATUSES.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </td>
                  <td data-label={thai ? invCols.reviewed.th : invCols.reviewed.en}>
                    <label>
                      <span className="sr-only">{thai ? invCols.reviewed.th : invCols.reviewed.en}</span>
                      <input className="hsi-review-field" value={row.reviewed} onChange={(event) => patchInventory(row.id, { reviewed: event.target.value })} />
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="hsi-inv-block">
        <h3 className="hsi-inv-heading kpi-latin">{fieldsTitle?.trim() || "Data Dictionary"}</h3>
        <div className="hsi-inv-table-wrap">
          <table className="hsi-inv-table is-fields">
            <caption className="sr-only">
              {thai
                ? "ตารางตัวอย่าง Data Dictionary ที่แก้ไขได้บนอุปกรณ์นี้ แสดงชื่อฟิลด์ ความหมายทางธุรกิจ ระบบต้นทาง ระบบปลายทาง รูปแบบ จำเป็นหรือไม่บังคับ สถานะการจับคู่ ผู้รับผิดชอบ และหมายเหตุ ไม่มีรหัสบัญชี รหัสการจอง ข้อมูลแขก หรือรหัสผ่าน"
                : "Editable sample Data Dictionary of field name, business meaning, source system, destination system, format, required or optional, mapping status, owner, and notes. No account IDs, booking IDs, guest data, or passwords."}
            </caption>
            <thead>
              <tr>
                <th scope="col">{thai ? dictCols.field.th : dictCols.field.en}</th>
                <th scope="col">{thai ? dictCols.meaning.th : dictCols.meaning.en}</th>
                <th scope="col">{thai ? dictCols.source.th : dictCols.source.en}</th>
                <th scope="col">{thai ? dictCols.destination.th : dictCols.destination.en}</th>
                <th scope="col">{thai ? dictCols.format.th : dictCols.format.en}</th>
                <th scope="col">{thai ? dictCols.required.th : dictCols.required.en}</th>
                <th scope="col">{thai ? dictCols.mapping.th : dictCols.mapping.en}</th>
                <th scope="col">{thai ? dictCols.owner.th : dictCols.owner.en}</th>
                <th scope="col">{thai ? dictCols.notes.th : dictCols.notes.en}</th>
              </tr>
            </thead>
            <tbody>
              {dictionary.map((row) => (
                <tr key={row.id}>
                  <th scope="row" className="kpi-latin">
                    {row.field}
                  </th>
                  <td data-label={thai ? dictCols.meaning.th : dictCols.meaning.en}>{row.meaning}</td>
                  <td data-label={thai ? dictCols.source.th : dictCols.source.en} className="kpi-latin">
                    {row.source}
                  </td>
                  <td data-label={thai ? dictCols.destination.th : dictCols.destination.en} className="kpi-latin">
                    {row.destination}
                  </td>
                  <td data-label={thai ? dictCols.format.th : dictCols.format.en} className="kpi-latin">
                    {row.format}
                  </td>
                  <td data-label={thai ? dictCols.required.th : dictCols.required.en}>{row.required}</td>
                  <td data-label={thai ? dictCols.mapping.th : dictCols.mapping.en}>
                    <label className={`hsi-review-status is-${row.mapping.tone}`}>
                      <span className="sr-only">{thai ? dictCols.mapping.th : dictCols.mapping.en}</span>
                      <select value={row.mapping.id} onChange={(event) => patchDictionary(row.id, { mapping: event.target.value })}>
                        {SYSTEMS_MAPPING_STATUSES.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </td>
                  <td data-label={thai ? dictCols.owner.th : dictCols.owner.en}>
                    <label>
                      <span className="sr-only">{thai ? dictCols.owner.th : dictCols.owner.en}</span>
                      <input className="hsi-review-field" value={row.owner} onChange={(event) => patchDictionary(row.id, { owner: event.target.value })} />
                    </label>
                  </td>
                  <td data-label={thai ? dictCols.notes.th : dictCols.notes.en}>
                    <label>
                      <span className="sr-only">{thai ? dictCols.notes.th : dictCols.notes.en}</span>
                      <input className="hsi-review-field" value={row.notes} onChange={(event) => patchDictionary(row.id, { notes: event.target.value })} />
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="hsi-review-save">
        <button type="button" className="kpi-button bg-[#a2dc25] text-[#1a3a02]" onClick={saveSample}>
          {thai ? "บันทึกตัวอย่าง" : "Save sample"}
        </button>
        {saved ? (
          <p className="hsi-review-saved">{saved}</p>
        ) : (
          <p className="hsi-review-save-note">
            {thai
              ? "การบันทึกอยู่บนอุปกรณ์นี้เท่านั้น ไม่มีรหัสบัญชี รหัสการจอง ข้อมูลแขก หรือรหัสผ่าน"
              : "Save stays on this device. No account IDs, booking IDs, guest data, or passwords."}
          </p>
        )}
      </div>
    </div>
  );
}
