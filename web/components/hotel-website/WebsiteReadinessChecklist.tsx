import { WEBSITE_READINESS_ROWS, WEBSITE_READINESS_VISUAL, websiteSampleLabel } from "@/lib/hotel-website";
import type { Locale } from "@/lib/seo";

export type WebsiteReadinessRowView = {
  id?: string;
  question?: string;
  evidence?: string;
  status?: string;
  action?: string;
  output?: string;
};

export function WebsiteReadinessChecklist({
  locale,
  questions,
  rows: overrideRows,
}: {
  locale: Locale;
  questions?: string[];
  rows?: WebsiteReadinessRowView[];
}) {
  const thai = locale === "th";
  const columns = {
    question: thai ? "คำถาม" : "Question",
    evidence: thai ? "หลักฐานที่ควรแสดง" : "Evidence to show",
    status: thai ? "สถานะปัจจุบัน" : "Current status",
    action: thai ? "แนวทางที่แนะนำ" : "Recommended action",
    output: thai ? "ผลลัพธ์" : "Output",
  };
  const base = overrideRows?.length ? overrideRows : WEBSITE_READINESS_ROWS.map((row) => ({
    id: row.id,
    question: thai ? row.questionTh : row.questionEn,
    evidence: thai ? row.evidenceTh : row.evidenceEn,
    status: thai ? row.statusTh : row.statusEn,
    action: thai ? row.actionTh : row.actionEn,
    output: row.output,
  }));
  const rows = base.map((row, index) => {
    const known = WEBSITE_READINESS_ROWS[index];
    const questionOverride = overrideRows?.[index]?.question?.trim() || questions?.[index]?.trim();
    return {
      id: row.id || known?.id || `ready-${index + 1}`,
      question: questionOverride || row.question || (thai ? known?.questionTh : known?.questionEn) || "",
      evidence: overrideRows?.[index]?.evidence?.trim() || row.evidence || (thai ? known?.evidenceTh : known?.evidenceEn) || "",
      status: overrideRows?.[index]?.status?.trim() || row.status || (thai ? known?.statusTh : known?.statusEn) || "",
      action: overrideRows?.[index]?.action?.trim() || row.action || (thai ? known?.actionTh : known?.actionEn) || "",
      output: overrideRows?.[index]?.output?.trim() || row.output || known?.output || "",
    };
  });

  return (
    <div className="web-readiness">
      <p className="web-readiness-kicker">
        <span className="web-readiness-badge">{websiteSampleLabel(locale)}</span>
        <span className="kpi-latin">{thai ? WEBSITE_READINESS_VISUAL.labelTh : WEBSITE_READINESS_VISUAL.labelEn}</span>
      </p>
      <div className="web-readiness-table-wrap">
        <table className="web-readiness-table">
          <caption>
            {thai
              ? "ตารางตรวจความพร้อมของเว็บไซต์โรงแรม ตัวอย่าง ไม่ใช่คะแนนโรงแรมรายใด"
              : "Hotel website readiness checklist. Sample data, not a scored hotel website."}
          </caption>
          <thead>
            <tr>
              <th scope="col">{columns.question}</th>
              <th scope="col">{columns.evidence}</th>
              <th scope="col">{columns.status}</th>
              <th scope="col">{columns.action}</th>
              <th scope="col">{columns.output}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id}>
                <th scope="row" data-label={columns.question}>
                  <span className="kpi-latin web-readiness-num">{String(index + 1).padStart(2, "0")}</span>{" "}
                  {row.question}
                </th>
                <td data-label={columns.evidence}>{row.evidence}</td>
                <td data-label={columns.status}>
                  <span className="web-readiness-status">{row.status}</span>
                </td>
                <td data-label={columns.action}>{row.action}</td>
                <td data-label={columns.output}>
                  <span className="kpi-latin web-readiness-output">{row.output}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
