import type { CmsSystemsDictionaryRow, CmsSystemsInventoryRow } from "@/lib/cms/hotel-systems-page";
import {
  SYSTEMS_DICTIONARY_COLUMNS,
  SYSTEMS_INVENTORY_COLUMNS,
  SYSTEMS_INVENTORY_ENVIRONMENTS,
  SYSTEMS_INVENTORY_LABELS,
  SYSTEMS_INVENTORY_VISUAL,
  SYSTEMS_LANDSCAPE_STATUSES,
  SYSTEMS_MAPPING_STATUSES,
  systemsInventoryEnvironment,
  systemsLandscapeStatus,
  systemsMappingStatus,
  systemsRenderableSrc,
} from "@/lib/hotel-systems";
import type { Locale } from "@/lib/seo";

function inventoryCopy(row: CmsSystemsInventoryRow, thai: boolean, sample: boolean) {
  return {
    id: row.id,
    system: thai ? row.systemTh || row.systemEn : row.systemEn || row.systemTh,
    provider: thai ? row.providerTh || row.providerEn : row.providerEn || row.providerTh,
    purpose: thai ? row.purposeTh || row.purposeEn : row.purposeEn || row.purposeTh,
    owner: thai ? row.ownerTh || row.ownerEn : row.ownerEn || row.ownerTh,
    dataIn: thai ? row.dataInTh || row.dataInEn : row.dataInEn || row.dataInTh,
    dataOut: thai ? row.dataOutTh || row.dataOutEn : row.dataOutEn || row.dataOutTh,
    connector: row.connector,
    environment: systemsInventoryEnvironment(row.environment),
    status: systemsLandscapeStatus((sample || !row.verified) && row.status === "connected" ? "not_configured" : row.status),
    reviewed: row.reviewed,
  };
}

function dictionaryCopy(row: CmsSystemsDictionaryRow, thai: boolean) {
  const required = String(row.required || "").toLowerCase() === "required";
  return {
    id: row.id,
    field: row.field,
    meaning: thai ? row.meaningTh || row.meaningEn : row.meaningEn || row.meaningTh,
    source: thai ? row.sourceTh || row.sourceEn : row.sourceEn || row.sourceTh,
    destination: thai ? row.destinationTh || row.destinationEn : row.destinationEn || row.destinationTh,
    format: row.format,
    required: required ? (thai ? "จำเป็น" : "Required") : thai ? "ไม่บังคับ" : "Optional",
    mapping: systemsMappingStatus(row.mappingStatus),
    owner: thai ? row.ownerTh || row.ownerEn : row.ownerEn || row.ownerTh,
    notes: thai ? row.notesTh || row.notesEn : row.notesEn || row.notesTh,
  };
}

export function HotelSystemsInventory({
  locale,
  src,
  status,
  label,
  caption,
  systemsTitle,
  fieldsTitle,
  rows,
  fields,
}: {
  locale: Locale;
  src?: string;
  status?: string;
  label?: string;
  caption?: string;
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
  const displayLabel = label?.trim() || SYSTEMS_INVENTORY_VISUAL.labelEn;
  const displayCaption = caption?.trim() || (thai ? SYSTEMS_INVENTORY_VISUAL.captionTh : SYSTEMS_INVENTORY_VISUAL.captionEn);
  const systems = rows.map((row) => inventoryCopy(row, thai, sample));
  const dictionary = fields.map((row) => dictionaryCopy(row, thai));
  const usedStatuses = SYSTEMS_LANDSCAPE_STATUSES.filter(
    (item) => item.id !== "connected" && systems.some((row) => row.status.id === item.id),
  );
  const usedMapping = SYSTEMS_MAPPING_STATUSES.filter((item) => dictionary.some((row) => row.mapping.id === item.id));

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
              alt={thai ? SYSTEMS_INVENTORY_VISUAL.altTh : SYSTEMS_INVENTORY_VISUAL.altEn}
              width={SYSTEMS_INVENTORY_VISUAL.displayWidth}
              height={SYSTEMS_INVENTORY_VISUAL.displayHeight}
              style={{ aspectRatio: `${SYSTEMS_INVENTORY_VISUAL.displayWidth} / ${SYSTEMS_INVENTORY_VISUAL.displayHeight}` }}
              loading="lazy"
              decoding="async"
            />
            {sample ? <span className="hsi-visual-badge">System Inventory and Data Mapping — Sample</span> : null}
          </div>
        ) : (
          <div className="hsi-inv-board" role="img" aria-label={thai ? SYSTEMS_INVENTORY_VISUAL.altTh : SYSTEMS_INVENTORY_VISUAL.altEn}>
            {sample ? <span className="hsi-visual-badge">System Inventory and Data Mapping — Sample</span> : null}
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
        {usedStatuses.map((item) => (
          <li key={item.id}>
            <span className={`hsi-status is-${item.tone} kpi-latin`}>{item.label}</span>
          </li>
        ))}
        {usedMapping
          .filter((item) => !usedStatuses.some((status) => status.id === item.id))
          .map((item) => (
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
                ? "ตารางตัวอย่าง System Inventory แสดงระบบ ผู้ให้บริการ วัตถุประสงค์ ผู้รับผิดชอบ ข้อมูลเข้า ข้อมูลออก API หรือ Connector สภาพแวดล้อม สถานะ และวันที่ตรวจล่าสุด ไม่มีรหัสบัญชี รหัสการจอง ข้อมูลแขก หรือรหัสผ่าน"
                : "Sample System Inventory of system, provider, purpose, owner, data in, data out, API or connector, environment, status, and last reviewed. No account IDs, booking IDs, guest data, or passwords."}
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
                  <td data-label={thai ? invCols.owner.th : invCols.owner.en}>{row.owner}</td>
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
                    <span className={`hsi-inv-env is-${row.environment.id} kpi-latin`}>{row.environment.label}</span>
                  </td>
                  <td data-label={thai ? invCols.status.th : invCols.status.en}>
                    <em className={`hsi-status is-${row.status.tone} kpi-latin`}>{row.status.label}</em>
                  </td>
                  <td data-label={thai ? invCols.reviewed.th : invCols.reviewed.en} className="kpi-latin">
                    {row.reviewed}
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
                ? "ตารางตัวอย่าง Data Dictionary แสดงชื่อฟิลด์ ความหมายทางธุรกิจ ระบบต้นทาง ระบบปลายทาง รูปแบบ จำเป็นหรือไม่บังคับ สถานะการจับคู่ ผู้รับผิดชอบ และหมายเหตุ ไม่มีรหัสบัญชี รหัสการจอง ข้อมูลแขก หรือรหัสผ่าน"
                : "Sample Data Dictionary of field name, business meaning, source system, destination system, format, required or optional, mapping status, owner, and notes. No account IDs, booking IDs, guest data, or passwords."}
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
                    <em className={`hsi-status is-${row.mapping.tone} kpi-latin`}>{row.mapping.label}</em>
                  </td>
                  <td data-label={thai ? dictCols.owner.th : dictCols.owner.en}>{row.owner}</td>
                  <td data-label={thai ? dictCols.notes.th : dictCols.notes.en}>{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="hsi-inv-footnote">
        {thai
          ? "ตารางนี้แก้ไขได้ใน CMS หน้าสาธารณะแสดงข้อมูลตัวอย่างเท่านั้น ไม่มีรหัสบัญชี รหัสการจอง ข้อมูลแขก หรือรหัสผ่าน"
          : "This table is editable in the CMS. The public page shows sample values only. No account IDs, booking IDs, guest data, or passwords."}
      </p>
    </div>
  );
}
