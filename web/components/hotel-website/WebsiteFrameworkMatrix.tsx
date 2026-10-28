import {
  WEBSITE_FRAMEWORK_PILLARS,
  WEBSITE_FRAMEWORK_VISUAL,
  hotelWebsiteFrameworkIsStale,
  websiteSampleLabel,
} from "@/lib/hotel-website";
import type { Locale } from "@/lib/seo";

export type WebsiteFrameworkStepView = {
  id?: string;
  num?: string;
  title?: string;
  body?: string;
  input?: string;
  action?: string;
  output?: string;
  approval?: string;
  stage?: string;
};

export function WebsiteFrameworkMatrix({
  locale,
  steps,
}: {
  locale: Locale;
  steps?: WebsiteFrameworkStepView[];
}) {
  const thai = locale === "th";
  const columns = {
    pillar: thai ? "ด้านบริการ" : "Service pillar",
    input: thai ? "ข้อมูลตั้งต้น" : "Input",
    action: thai ? "สิ่งที่ทำ" : "Action",
    output: thai ? "ผลลัพธ์" : "Output",
    approval: thai ? "จุดที่โรงแรมอนุมัติ" : "Hotel approval point",
  };
  const stale = hotelWebsiteFrameworkIsStale(steps);
  const rows = WEBSITE_FRAMEWORK_PILLARS.map((known, index) => {
    const override = stale ? undefined : steps?.find((step) => step.id === known.id) || steps?.[index];
    return {
      id: known.id,
      stage: known.stage,
      title: override?.title?.trim() || (thai ? known.titleTh : known.titleEn),
      action: override?.action?.trim() || override?.body?.trim() || (thai ? known.actionTh : known.actionEn),
      input: override?.input?.trim() || (thai ? known.inputTh : known.inputEn),
      output: known.output,
      approval: override?.approval?.trim() || (thai ? known.approvalTh : known.approvalEn),
      num: known.num,
    };
  });

  return (
    <div className="web-framework-matrix">
      <p className="web-framework-kicker">
        <span className="web-framework-badge">{websiteSampleLabel(locale)}</span>
        <span className="kpi-latin">{thai ? WEBSITE_FRAMEWORK_VISUAL.labelTh : WEBSITE_FRAMEWORK_VISUAL.labelEn}</span>
      </p>
      <div className="web-framework-table-wrap">
        <table className="web-framework-table">
          <caption>
            {thai
              ? "กรอบบริการเว็บไซต์โรงแรม แสดงข้อมูลตั้งต้น สิ่งที่ทำ ผลลัพธ์ และจุดที่โรงแรมอนุมัติ"
              : "Hotel website service framework showing input, action, output, and hotel approval point"}
          </caption>
          <thead>
            <tr>
              <th scope="col">{columns.pillar}</th>
              <th scope="col">{columns.input}</th>
              <th scope="col">{columns.action}</th>
              <th scope="col">{columns.output}</th>
              <th scope="col">{columns.approval}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <th scope="row" data-label={columns.pillar}>
                  <span className="kpi-latin web-framework-num">{row.num}</span>
                  <span className="web-framework-pillar-title">{row.title}</span>
                  <span className="kpi-latin web-framework-stage">{row.stage}</span>
                </th>
                <td data-label={columns.input}>{row.input}</td>
                <td data-label={columns.action}>{row.action}</td>
                <td data-label={columns.output}>
                  <span className="kpi-latin web-framework-output">{row.output}</span>
                </td>
                <td data-label={columns.approval}>{row.approval}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
