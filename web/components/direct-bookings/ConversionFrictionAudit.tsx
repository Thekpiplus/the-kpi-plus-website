import {
  DIRECT_BOOKING_AUDIT_GROUPS,
  DIRECT_BOOKING_AUDIT_ROWS,
  DIRECT_BOOKING_AUDIT_STATUS,
  DIRECT_BOOKING_AUDIT_VISUAL,
  directBookingAuditSampleStatusLabel,
  directBookingAuditStatusLabel,
  type DirectBookingAuditStatus,
} from "@/lib/direct-bookings";
import type { Locale } from "@/lib/seo";
import { ConversionVisualFrame } from "./ConversionVisualFrame";

const COLUMNS = {
  item: { th: "รายการ", en: "Item" },
  status: { th: "สถานะ", en: "Status" },
  owner: { th: "ผู้รับผิดชอบ", en: "Owner" },
  note: { th: "หมายเหตุ", en: "Note" },
  action: { th: "แนวทางที่แนะนำ", en: "Recommended action" },
  reviewed: { th: "ตรวจล่าสุด", en: "Last reviewed" },
} as const;

function statusClass(status: DirectBookingAuditStatus) {
  if (status === "clear") return "is-green";
  if (status === "blocked") return "is-blocked";
  if (status === "not-configured") return "is-muted";
  return "is-yellow";
}

export type ConversionAuditRowView = {
  id: string;
  group: string;
  item: string;
  status: string;
  owner: string;
  note: string;
  action: string;
  lastReviewed: string;
};

function asAuditStatus(value: string): DirectBookingAuditStatus {
  if (value === "clear" || value === "blocked" || value === "not-configured") return value;
  return "needs-review";
}

export function ConversionFrictionAudit({
  locale,
  src,
  rows,
  visual,
}: {
  locale: Locale;
  src?: string;
  rows?: ConversionAuditRowView[];
  visual?: { alt?: string; label?: string; caption?: string; status?: string };
}) {
  const thai = locale === "th";
  const label = visual?.label?.trim() || (thai ? DIRECT_BOOKING_AUDIT_VISUAL.labelTh : DIRECT_BOOKING_AUDIT_VISUAL.labelEn);
  const caption = visual?.caption?.trim() || (thai ? DIRECT_BOOKING_AUDIT_VISUAL.captionTh : DIRECT_BOOKING_AUDIT_VISUAL.captionEn);
  const alt = visual?.alt?.trim() || (thai ? DIRECT_BOOKING_AUDIT_VISUAL.altTh : DIRECT_BOOKING_AUDIT_VISUAL.altEn);
  const visualStatus = visual?.status || DIRECT_BOOKING_AUDIT_VISUAL.status;
  const items =
    rows?.length
      ? rows.map((row) => ({
          ...row,
          status: asAuditStatus(row.status),
        }))
      : DIRECT_BOOKING_AUDIT_ROWS.map((row) => ({
          id: row.id,
          group: row.group,
          item: thai ? row.itemTh : row.item,
          status: row.status,
          owner: thai ? row.ownerTh : row.ownerEn,
          note: thai ? row.noteTh : row.noteEn,
          action: thai ? row.actionTh : row.actionEn,
          lastReviewed: row.lastReviewed,
        }));
  const sample = directBookingAuditSampleStatusLabel(locale);
  const notReviewed = thai ? "ยังไม่ตรวจ" : "Not reviewed";
  const cols = {
    item: thai ? COLUMNS.item.th : COLUMNS.item.en,
    status: thai ? COLUMNS.status.th : COLUMNS.status.en,
    owner: thai ? COLUMNS.owner.th : COLUMNS.owner.en,
    note: thai ? COLUMNS.note.th : COLUMNS.note.en,
    action: thai ? COLUMNS.action.th : COLUMNS.action.en,
    reviewed: thai ? COLUMNS.reviewed.th : COLUMNS.reviewed.en,
  };

  return (
    <div className="db-audit">
      <p className="db-friction-kicker">
        <span className="db-visual-badge">{sample}</span>
        <span className="kpi-latin">{label}</span>
      </p>
      <ConversionVisualFrame
        locale={locale}
        src={src}
        alt={alt}
        label={label}
        caption={caption}
        meta={thai ? DIRECT_BOOKING_AUDIT_VISUAL.metaTh : DIRECT_BOOKING_AUDIT_VISUAL.metaEn}
        status={visualStatus}
        width={DIRECT_BOOKING_AUDIT_VISUAL.displayWidth}
        height={DIRECT_BOOKING_AUDIT_VISUAL.displayHeight}
        variant="audit"
      >
        <div className="db-audit-mock" role="img" aria-label={alt}>
          <span className="db-visual-badge">{sample}</span>
          <p className="db-audit-mock-kicker kpi-latin">Sample status</p>
          <p className="db-audit-mock-title kpi-latin">{DIRECT_BOOKING_AUDIT_VISUAL.labelEn}</p>
          <ol className="db-audit-mock-flow">
            {DIRECT_BOOKING_AUDIT_GROUPS.map((group) => (
              <li key={group.id}>
                <strong className="kpi-latin">{thai ? group.th : group.en}</strong>
                <small className="kpi-latin">{sample}</small>
              </li>
            ))}
          </ol>
          <p className="db-audit-mock-note kpi-latin">Not automatically checked</p>
        </div>
      </ConversionVisualFrame>
      <ul className="db-audit-legend" aria-label={thai ? "ความหมายสถานะ" : "Status key"}>
        {DIRECT_BOOKING_AUDIT_STATUS.map((status) => (
          <li key={status}>
            <span className={`db-status ${statusClass(status)}`}>{directBookingAuditStatusLabel(status, locale)}</span>
          </li>
        ))}
      </ul>
      <div className="db-audit-wrap">
        <table className="db-audit-table">
          <caption>
            {thai
              ? "รายการตรวจ Friction Audit สำหรับทีมโรงแรม สถานะตัวอย่าง ไม่ตรวจอัตโนมัติ และไม่ใช่ผลโรงแรมจริง"
              : "Friction Audit Checklist for a hotel team. Sample status. Items are not automatically checked, and this is not a live hotel result."}
          </caption>
          <thead>
            <tr>
              <th scope="col">{cols.item}</th>
              <th scope="col">{cols.status}</th>
              <th scope="col">{cols.owner}</th>
              <th scope="col">{cols.note}</th>
              <th scope="col">{cols.action}</th>
              <th scope="col">{cols.reviewed}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row, index) => (
              <tr key={row.id}>
                <th scope="row" data-label={cols.item}>
                  <span className="kpi-latin db-audit-num">{String(index + 1).padStart(2, "0")}</span>
                  <span className={thai ? undefined : "kpi-latin"}>{row.item}</span>
                </th>
                <td data-label={cols.status}>
                  <span className={`db-status ${statusClass(row.status)}`}>
                    {directBookingAuditStatusLabel(row.status, locale)}
                  </span>
                  <span className="db-audit-sample kpi-latin">{sample}</span>
                </td>
                <td data-label={cols.owner}>{row.owner}</td>
                <td data-label={cols.note}>{row.note}</td>
                <td data-label={cols.action}>{row.action}</td>
                <td data-label={cols.reviewed}>
                  {row.lastReviewed ? <time dateTime={row.lastReviewed}>{row.lastReviewed}</time> : notReviewed}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
