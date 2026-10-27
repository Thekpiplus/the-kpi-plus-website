import { ADS_FRAMEWORK_ROWS } from "@/lib/google-ads";
import type { Locale } from "@/lib/seo";

export type AdsFrameworkRow = {
  id: string;
  area: string;
  problem: string;
  inspect: string;
  improve: string;
  output: string;
};

export function AdsFrameworkMatrix({
  locale,
  rows,
}: {
  locale: Locale;
  rows?: AdsFrameworkRow[];
}) {
  const thai = locale === "th";
  const data =
    rows?.length
      ? rows
      : ADS_FRAMEWORK_ROWS.map((row) => ({
          id: row.id,
          area: row.area,
          problem: thai ? row.problemTh : row.problemEn,
          inspect: thai ? row.inspectTh : row.inspectEn,
          improve: thai ? row.improveTh : row.improveEn,
          output: thai ? row.outputTh : row.outputEn,
        }));
  const columns = {
    area: thai ? "ด้าน" : "Area",
    problem: thai ? "ปัญหาหรือสถานะปัจจุบัน" : "Problem or current state",
    inspect: thai ? "สิ่งที่ต้องตรวจ" : "What to inspect",
    improve: thai ? "สิ่งที่ต้องปรับ" : "What to improve",
    output: thai ? "ผลที่คาดหวัง" : "Expected output",
  };

  return (
    <div className="ads-framework-table-wrap">
      <table className="ads-framework-table">
        <caption className="ads-framework-caption">
          {thai ? "กรอบความพร้อมจากคำค้นถึงการจอง" : "Search-to-Booking Readiness Framework"}
        </caption>
        <thead>
          <tr>
            <th scope="col">{columns.area}</th>
            <th scope="col">{columns.problem}</th>
            <th scope="col">{columns.inspect}</th>
            <th scope="col">{columns.improve}</th>
            <th scope="col">{columns.output}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <th scope="row" data-label={columns.area}>
                <span className="kpi-latin">{row.area}</span>
              </th>
              <td data-label={columns.problem}>{row.problem}</td>
              <td data-label={columns.inspect}>{row.inspect}</td>
              <td data-label={columns.improve}>{row.improve}</td>
              <td data-label={columns.output}>
                <span className="kpi-latin ads-framework-output">{row.output}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
