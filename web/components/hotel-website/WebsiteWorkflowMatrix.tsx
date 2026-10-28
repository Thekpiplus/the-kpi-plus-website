import { WEBSITE_WORKFLOW_STEPS, WEBSITE_WORKFLOW_VISUAL, websiteSampleLabel } from "@/lib/hotel-website";
import type { Locale } from "@/lib/seo";

export type WebsiteWorkflowStepView = {
  id?: string;
  num?: string;
  title?: string;
  body?: string;
  owner?: string;
  input?: string;
  action?: string;
  output?: string;
  approval?: string;
  next?: string;
  label?: string;
};

function markLatin(text: string) {
  const parts = text.split(
    /(Discovery Brief|Sitemap and Content Map|Technology Decision|Responsive Website and Integration|QA Report, CMS Guide, and Access Handover|Booking Engine|CMS|SEO|Analytics)/g,
  );
  return parts.map((part, index) =>
    /^(Discovery Brief|Sitemap and Content Map|Technology Decision|Responsive Website and Integration|QA Report, CMS Guide, and Access Handover|Booking Engine|CMS|SEO|Analytics)$/.test(
      part,
    ) ? (
      <span key={`${part}-${index}`} className="kpi-latin">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export function WebsiteWorkflowMatrix({
  locale,
  steps,
}: {
  locale: Locale;
  steps?: WebsiteWorkflowStepView[];
}) {
  const thai = locale === "th";
  const columns = {
    step: thai ? "ขั้นตอน" : "Step",
    owner: thai ? "ผู้รับผิดชอบ" : "Owner",
    input: thai ? "ข้อมูลตั้งต้น" : "Input",
    action: thai ? "สิ่งที่ทำ" : "Action",
    output: thai ? "ผลลัพธ์" : "Output",
    approval: thai ? "จุดที่โรงแรมอนุมัติ" : "Approval point",
    next: thai ? "การตัดสินใจถัดไป" : "Next decision",
  };
  const source = steps?.length ? steps : WEBSITE_WORKFLOW_STEPS;
  const rows = source.map((step, index) => {
    const known = WEBSITE_WORKFLOW_STEPS[index];
    const override = steps?.[index];
    return {
      id: override?.id || ("id" in step ? step.id : known?.id) || `step-${index + 1}`,
      label: override?.label || ("label" in step ? step.label : known?.label) || "",
      title: override?.title?.trim() || ("titleTh" in step ? (thai ? step.titleTh : step.titleEn) : step.title) || "",
      action: override?.action?.trim() || override?.body?.trim() || ("actionTh" in step ? (thai ? step.actionTh : step.actionEn) : "") || "",
      owner: override?.owner?.trim() || ("ownerTh" in step ? (thai ? step.ownerTh : step.ownerEn) : "") || (thai ? known?.ownerTh : known?.ownerEn) || "",
      input: override?.input?.trim() || ("inputTh" in step ? (thai ? step.inputTh : step.inputEn) : "") || (thai ? known?.inputTh : known?.inputEn) || "",
      output: override?.output?.trim() || ("output" in step ? step.output : known?.output) || "",
      approval: override?.approval?.trim() || ("approvalTh" in step ? (thai ? step.approvalTh : step.approvalEn) : "") || (thai ? known?.approvalTh : known?.approvalEn) || "",
      next: override?.next?.trim() || ("nextTh" in step ? (thai ? step.nextTh : step.nextEn) : "") || (thai ? known?.nextTh : known?.nextEn) || "",
      num: override?.num?.trim() || ("num" in step ? step.num : known?.num) || String(index + 1).padStart(2, "0"),
    };
  });

  return (
    <div className="web-workflow-matrix">
      <p className="web-workflow-kicker">
        <span className="web-workflow-badge">{websiteSampleLabel(locale)}</span>
        <span className="kpi-latin">{thai ? WEBSITE_WORKFLOW_VISUAL.labelTh : WEBSITE_WORKFLOW_VISUAL.labelEn}</span>
      </p>
      <div className="web-workflow-table-wrap">
        <table className="web-workflow-table">
          <caption>
            {thai
              ? "ไทม์ไลน์งานเว็บไซต์โรงแรม แสดงผู้รับผิดชอบ ข้อมูลตั้งต้น สิ่งที่ทำ ผลลัพธ์ จุดอนุมัติ และการตัดสินใจถัดไป"
              : "Hotel website project workflow showing owner, input, action, output, approval point, and next decision"}
          </caption>
          <thead>
            <tr>
              <th scope="col">{columns.step}</th>
              <th scope="col">{columns.owner}</th>
              <th scope="col">{columns.input}</th>
              <th scope="col">{columns.action}</th>
              <th scope="col">{columns.output}</th>
              <th scope="col">{columns.approval}</th>
              <th scope="col">{columns.next}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <th scope="row" data-label={columns.step}>
                  <span className="kpi-latin web-workflow-num">{row.num}</span>
                  <span className="kpi-latin web-workflow-label">{row.label}</span>
                  <span className="web-workflow-title">{row.title}</span>
                </th>
                <td data-label={columns.owner}>{markLatin(row.owner)}</td>
                <td data-label={columns.input}>{markLatin(row.input)}</td>
                <td data-label={columns.action}>{markLatin(row.action)}</td>
                <td data-label={columns.output}>
                  <span className="kpi-latin web-workflow-output">{row.output}</span>
                </td>
                <td data-label={columns.approval}>{markLatin(row.approval)}</td>
                <td data-label={columns.next}>{markLatin(row.next)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
