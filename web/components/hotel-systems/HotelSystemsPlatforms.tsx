import type { CmsSystemsFitScenario, CmsSystemsLine } from "@/lib/cms/hotel-systems-page";
import {
  SYSTEMS_FIT_COLUMNS,
  SYSTEMS_FIT_NOT,
  SYSTEMS_FIT_VISUAL,
  SYSTEMS_PLATFORM_STATUSES,
  systemsPlatformLogoSrc,
  systemsPlatformStatus,
  systemsRenderableSrc,
} from "@/lib/hotel-systems";
import type { Locale } from "@/lib/seo";

function rowCopy(row: CmsSystemsFitScenario, thai: boolean) {
  return {
    id: row.id,
    category: thai ? row.categoryTh || row.situationTh || row.categoryEn : row.categoryEn || row.situationEn || row.categoryTh,
    example: row.example || row.output,
    logoSrc: systemsPlatformLogoSrc(row.logoSrc, row.logoStatus),
    role: thai ? row.roleTh || row.symptomTh || row.roleEn : row.roleEn || row.symptomEn || row.roleTh,
    flow: thai ? row.flowTh || row.questionTh || row.flowEn : row.flowEn || row.questionEn || row.flowTh,
    provider: thai ? row.providerTh || row.supportTh || row.providerEn : row.providerEn || row.supportEn || row.providerTh,
    integration: systemsPlatformStatus(row.integrationStatus),
    verification: systemsPlatformStatus(row.verificationStatus),
  };
}

export function HotelSystemsPlatforms({
  locale,
  src,
  alt,
  status,
  label,
  caption,
  rows,
  notTitle,
  notItems,
}: {
  locale: Locale;
  src?: string;
  alt?: string;
  status?: string;
  label?: string;
  caption?: string;
  rows: CmsSystemsFitScenario[];
  notTitle?: string;
  notItems: CmsSystemsLine[];
}) {
  const thai = locale === "th";
  const sample = status !== "approved" && status !== "real";
  const fileSrc = systemsRenderableSrc(src, status);
  const cols = SYSTEMS_FIT_COLUMNS;
  const displayLabel = label?.trim() || SYSTEMS_FIT_VISUAL.labelEn;
  const displayCaption = caption?.trim() || (thai ? SYSTEMS_FIT_VISUAL.captionTh : SYSTEMS_FIT_VISUAL.captionEn);
  const displayAlt = alt?.trim() || (thai ? SYSTEMS_FIT_VISUAL.altTh : SYSTEMS_FIT_VISUAL.altEn);
  const copies = rows.map((row) => rowCopy(row, thai));
  const notes = notItems.length ? notItems : SYSTEMS_FIT_NOT.map((item) => ({ id: item.id, th: item.th, en: item.en }));

  return (
    <div className="hsi-plat">
      <figure className="hsi-plat-figure">
        {fileSrc ? (
          <div className="hsi-plat-photo">
            <img
              src={fileSrc}
              alt={displayAlt}
              width={SYSTEMS_FIT_VISUAL.displayWidth}
              height={SYSTEMS_FIT_VISUAL.displayHeight}
              style={{ aspectRatio: `${SYSTEMS_FIT_VISUAL.displayWidth} / ${SYSTEMS_FIT_VISUAL.displayHeight}` }}
              loading="lazy"
              decoding="async"
            />
            {sample ? <span className="hsi-visual-badge">Hotel Technology Landscape — Example Categories</span> : null}
          </div>
        ) : (
          <div className="hsi-plat-board" role="img" aria-label={displayAlt}>
            {sample ? <span className="hsi-visual-badge">Hotel Technology Landscape — Example Categories</span> : null}
            <p className="hsi-mock-kicker kpi-latin">Examples / Subject to technical verification</p>
            <p className="hsi-plat-board-title">{thai ? "แผนที่หมวด ไม่ใช่โลโก้วอลล์" : "Category map, not a logo wall"}</p>
            <ul className="hsi-plat-preview">
              {copies.map((row) => (
                <li key={row.id} className={`is-${row.integration.tone}`}>
                  <strong className="kpi-latin">{row.category}</strong>
                  <span className="kpi-latin">{row.example}</span>
                  <em className={`hsi-status is-${row.integration.tone} kpi-latin`}>{row.integration.label}</em>
                </li>
              ))}
            </ul>
          </div>
        )}
        <figcaption className="hsi-visual-caption">
          <strong>{displayLabel}</strong>
          <span className="hsi-visual-meta">{thai ? SYSTEMS_FIT_VISUAL.metaTh : SYSTEMS_FIT_VISUAL.metaEn}</span>
          <span>{displayCaption}</span>
        </figcaption>
      </figure>

      <p className="hsi-plat-note kpi-latin">Examples / Subject to technical verification</p>

      <ul className="hsi-plat-legend" aria-label={thai ? "คำอธิบายสถานะตัวอย่าง ไม่ใช่สถานะเชื่อมต่อของโรงแรมจริง" : "Sample status legend. Not a live hotel integration status."}>
        {SYSTEMS_PLATFORM_STATUSES.map((item) => (
          <li key={item.id}>
            <span className={`hsi-status is-${item.tone} kpi-latin`}>{item.label}</span>
          </li>
        ))}
      </ul>

      <div className="hsi-plat-table-wrap">
        <table className="hsi-plat-table">
          <caption className="sr-only">
            {thai
              ? "ตารางหมวดเทคโนโลยีโรงแรมตัวอย่าง แสดงหมวด ตัวอย่าง บทบาท เส้นทางข้อมูล สถานะการเชื่อมต่อ สถานะการตรวจทางเทคนิค และสิ่งที่ต้องพึ่งผู้ให้บริการ ไม่ใช่โลโก้วอลล์ และไม่ใช่สถานะเชื่อมต่อที่ตรวจแล้ว"
              : "Sample hotel technology landscape of category, example or existing system, role, possible data flow, integration status, technical verification status, and provider dependency. Not a logo wall, and not a verified integration status."}
          </caption>
          <thead>
            <tr>
              <th scope="col">{thai ? cols.category.th : cols.category.en}</th>
              <th scope="col">{thai ? cols.example.th : cols.example.en}</th>
              <th scope="col">{thai ? cols.role.th : cols.role.en}</th>
              <th scope="col">{thai ? cols.flow.th : cols.flow.en}</th>
              <th scope="col">{thai ? cols.integration.th : cols.integration.en}</th>
              <th scope="col">{thai ? cols.verification.th : cols.verification.en}</th>
              <th scope="col">{thai ? cols.provider.th : cols.provider.en}</th>
            </tr>
          </thead>
          <tbody>
            {copies.map((row) => (
              <tr key={row.id}>
                <th scope="row">{row.category}</th>
                <td data-label={thai ? cols.example.th : cols.example.en}>
                  {row.logoSrc ? (
                    <span className="hsi-plat-mark">
                      <img
                        src={row.logoSrc}
                        alt={row.example || row.category}
                        width={96}
                        height={32}
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="kpi-latin">{row.example}</span>
                      <small className="kpi-latin">Example / Subject to technical verification</small>
                    </span>
                  ) : (
                    <span className="kpi-latin">{row.example}</span>
                  )}
                </td>
                <td data-label={thai ? cols.role.th : cols.role.en}>{row.role}</td>
                <td data-label={thai ? cols.flow.th : cols.flow.en}>{row.flow}</td>
                <td data-label={thai ? cols.integration.th : cols.integration.en}>
                  <em className={`hsi-status is-${row.integration.tone} kpi-latin`}>{row.integration.label}</em>
                </td>
                <td data-label={thai ? cols.verification.th : cols.verification.en}>
                  <em className={`hsi-status is-${row.verification.tone} kpi-latin`}>{row.verification.label}</em>
                </td>
                <td data-label={thai ? cols.provider.th : cols.provider.en}>{row.provider}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <aside className="kpi-systems-fit-not">
        <h3>{notTitle?.trim() || (thai ? "หน้านี้ไม่ได้หมายความว่า…" : "This page does not mean…")}</h3>
        <ul>
          {notes.map((item) => (
            <li key={item.id}>{thai ? item.th : item.en}</li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
