import type { CmsSystemsResponsibilityRow, CmsSystemsScopeRow } from "@/lib/cms/hotel-systems-page";
import {
  SYSTEMS_SCOPE_BOUNDARY,
  SYSTEMS_SCOPE_COLUMNS,
  SYSTEMS_SCOPE_VISUAL,
  systemsRenderableSrc,
} from "@/lib/hotel-systems";
import type { Locale } from "@/lib/seo";

function listItems(row: CmsSystemsScopeRow, thai: boolean) {
  const raw = thai ? row.itemsTh || row.itemsEn : row.itemsEn || row.itemsTh;
  return String(raw || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function matrixCopy(row: CmsSystemsResponsibilityRow, thai: boolean) {
  return {
    id: row.id,
    event: thai ? row.eventTh || row.eventEn : row.eventEn || row.eventTh,
    hotel: thai ? row.hotelTh || row.hotelEn : row.hotelEn || row.hotelTh,
    provider: thai ? row.providerTh || row.providerEn : row.providerEn || row.providerTh,
    implementation: thai ? row.implTh || row.implEn : row.implEn || row.implTh,
    approval: thai ? row.approvalTh || row.approvalEn : row.approvalEn || row.approvalTh,
    escalation: thai ? row.escalationTh || row.escalationEn : row.escalationEn || row.escalationTh,
  };
}

export function HotelSystemsResponsibility({
  locale,
  src,
  alt,
  status,
  label,
  caption,
  supportTitle,
  hotelTitle,
  matrixTitle,
  rows,
  matrix,
  boundary,
}: {
  locale: Locale;
  src?: string;
  alt?: string;
  status?: string;
  label?: string;
  caption?: string;
  supportTitle?: string;
  hotelTitle?: string;
  matrixTitle?: string;
  rows: CmsSystemsScopeRow[];
  matrix: CmsSystemsResponsibilityRow[];
  boundary?: string;
}) {
  const thai = locale === "th";
  const sample = status !== "approved" && status !== "real";
  const fileSrc = systemsRenderableSrc(src, status);
  const cols = SYSTEMS_SCOPE_COLUMNS;
  const displayLabel = label?.trim() || SYSTEMS_SCOPE_VISUAL.labelEn;
  const displayCaption = caption?.trim() || (thai ? SYSTEMS_SCOPE_VISUAL.captionTh : SYSTEMS_SCOPE_VISUAL.captionEn);
  const displayAlt = alt?.trim() || (thai ? SYSTEMS_SCOPE_VISUAL.altTh : SYSTEMS_SCOPE_VISUAL.altEn);
  const support = rows.find((row) => row.id === "support") || rows[0];
  const hotel = rows.find((row) => row.id === "hotel") || rows[1];
  const events = matrix.map((row) => matrixCopy(row, thai));

  return (
    <div className="hsi-resp">
      <ul className="hsi-resp-flags" aria-label={thai ? "ป้ายขอบเขตงานตัวอย่าง" : "Sample boundary labels"}>
        <li className="kpi-latin">{thai ? "ข้อมูลตัวอย่าง" : "Sample data"}</li>
        <li className="kpi-latin">{thai ? "ขึ้นกับขอบเขตที่ตกลง" : "Subject to agreed scope"}</li>
        <li className="kpi-latin">{thai ? "ไม่การันตีพฤติกรรมผู้ให้บริการ" : "Does not guarantee provider behaviour"}</li>
      </ul>

      <figure className="hsi-resp-figure">
        {fileSrc ? (
          <div className="hsi-resp-photo">
            <img
              src={fileSrc}
              alt={displayAlt}
              width={SYSTEMS_SCOPE_VISUAL.displayWidth}
              height={SYSTEMS_SCOPE_VISUAL.displayHeight}
              style={{ aspectRatio: `${SYSTEMS_SCOPE_VISUAL.displayWidth} / ${SYSTEMS_SCOPE_VISUAL.displayHeight}` }}
              loading="lazy"
              decoding="async"
            />
            {sample ? <span className="hsi-visual-badge">Implementation Responsibility Matrix — Sample</span> : null}
          </div>
        ) : (
          <div className="hsi-resp-board" role="img" aria-label={thai ? SYSTEMS_SCOPE_VISUAL.altTh : SYSTEMS_SCOPE_VISUAL.altEn}>
            {sample ? <span className="hsi-visual-badge">Implementation Responsibility Matrix — Sample</span> : null}
            <p className="hsi-mock-kicker kpi-latin">Sample boundary · Subject to agreed scope</p>
            <p className="hsi-resp-board-title">
              {thai ? "ขอบเขตงาน ไม่ใช่การรับผิดชอบทุกระบบภายนอก" : "Boundary, not ownership of every external system"}
            </p>
            <ul className="hsi-resp-preview">
              <li>
                <strong className="kpi-latin">{thai ? "อาจช่วย" : "May support"}</strong>
                <span className="kpi-latin">Discovery · Mapping · Test Cases · Handover</span>
              </li>
              <li>
                <strong className="kpi-latin">{thai ? "ยังเป็นของโรงแรม/ผู้ให้บริการ" : "Hotel / provider owned"}</strong>
                <span className="kpi-latin">Licence · API · Payments · Go-live</span>
              </li>
            </ul>
          </div>
        )}
        <figcaption className="hsi-visual-caption">
          <strong>{displayLabel}</strong>
          <span className="hsi-visual-meta">{thai ? SYSTEMS_SCOPE_VISUAL.metaTh : SYSTEMS_SCOPE_VISUAL.metaEn}</span>
          <span>{displayCaption}</span>
        </figcaption>
      </figure>

      <div className="hsi-resp-split">
        <article className="hsi-resp-card is-support">
          <h3>{supportTitle?.trim() || (thai ? support?.titleTh : support?.titleEn)}</h3>
          <ul>
            {support ? listItems(support, thai).map((item) => <li key={item}>{item}</li>) : null}
          </ul>
        </article>
        <article className="hsi-resp-card is-hotel">
          <h3>{hotelTitle?.trim() || (thai ? hotel?.titleTh : hotel?.titleEn)}</h3>
          <ul>
            {hotel ? listItems(hotel, thai).map((item) => <li key={item}>{item}</li>) : null}
          </ul>
        </article>
      </div>

      <div className="hsi-resp-block">
        <h3 className="hsi-resp-heading kpi-latin">{matrixTitle?.trim() || "Responsibility Matrix"}</h3>
        <div className="hsi-resp-table-wrap">
          <table className="hsi-resp-table">
            <caption className="sr-only">
              {thai
                ? "ตารางตัวอย่างความรับผิดชอบเมื่อเกิดเหตุการณ์ระบบโรงแรม แสดงทีมโรงแรม ผู้ให้บริการ ทีมนำไปใช้ จุดที่ต้องอนุมัติ และเส้นทางยกระดับ ไม่ได้หมายความว่าเดอะ เคพีไอ พลัสเป็นเจ้าของระบบภายนอก"
                : "Sample responsibility matrix for hotel systems events, showing the hotel team, provider, implementation team, approval required, and escalation path. The KPI Plus does not own external systems."}
            </caption>
            <thead>
              <tr>
                <th scope="col">{thai ? cols.event.th : cols.event.en}</th>
                <th scope="col">{thai ? cols.hotel.th : cols.hotel.en}</th>
                <th scope="col">{thai ? cols.provider.th : cols.provider.en}</th>
                <th scope="col">{thai ? cols.implementation.th : cols.implementation.en}</th>
                <th scope="col">{thai ? cols.approval.th : cols.approval.en}</th>
                <th scope="col">{thai ? cols.escalation.th : cols.escalation.en}</th>
              </tr>
            </thead>
            <tbody>
              {events.map((row) => (
                <tr key={row.id}>
                  <th scope="row">{row.event}</th>
                  <td data-label={thai ? cols.hotel.th : cols.hotel.en}>{row.hotel}</td>
                  <td data-label={thai ? cols.provider.th : cols.provider.en}>{row.provider}</td>
                  <td data-label={thai ? cols.implementation.th : cols.implementation.en}>{row.implementation}</td>
                  <td data-label={thai ? cols.approval.th : cols.approval.en}>{row.approval}</td>
                  <td data-label={thai ? cols.escalation.th : cols.escalation.en}>{row.escalation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="hsi-resp-note">{boundary?.trim() || (thai ? SYSTEMS_SCOPE_BOUNDARY.th : SYSTEMS_SCOPE_BOUNDARY.en)}</p>
    </div>
  );
}
