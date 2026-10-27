import { META_SCENARIO_ROWS, metaKpiTags } from "@/lib/meta-ads";
import type { Locale } from "@/lib/seo";

export type AdsChannelCompareRow = {
  id: string;
  channel: string;
  useCase: string;
  control: string;
  input: string;
  output: string;
  kpi: string;
};

export function MetaScenarioMatrix({
  locale,
  rows,
}: {
  locale: Locale;
  rows?: AdsChannelCompareRow[];
}) {
  const thai = locale === "th";
  const data =
    rows?.length
      ? rows
      : META_SCENARIO_ROWS.map((row) => ({
          id: row.id,
          channel: row.channel,
          useCase: thai ? row.useCaseTh : row.useCaseEn,
          control: thai ? row.controlTh : row.controlEn,
          input: thai ? row.inputTh : row.inputEn,
          output: thai ? row.outputTh : row.outputEn,
          kpi: thai ? row.kpiTh : row.kpiEn,
        }));
  const columns = {
    channel: "Objective",
    useCase: thai ? "การกระทำตัวอย่าง" : "Example action",
    input: thai ? "หน้าปลายทาง / การกระทำ" : "Destination page/action",
    kpi: "KPI",
    output: thai ? "ผลที่คาดหวัง" : "Expected output",
  };

  return (
    <div className="ads-channel-table-wrap">
      <table className="ads-channel-table">
        <caption className="ads-channel-caption">
          {thai
            ? "แผนที่ Objective ถึงการจอง จาก Awareness, Consideration, Inquiry, Direct Booking และ Remarketing"
            : "Objective-to-Booking Map for Awareness, Consideration, Inquiry, Direct Booking, and Remarketing"}
        </caption>
        <thead>
          <tr>
            <th scope="col">{columns.channel}</th>
            <th scope="col">{columns.useCase}</th>
            <th scope="col">{columns.input}</th>
            <th scope="col">{columns.kpi}</th>
            <th scope="col">{columns.output}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <th scope="row" data-label={columns.channel}>
                <span className="kpi-latin">{row.channel}</span>
              </th>
              <td data-label={columns.useCase}>{row.useCase}</td>
              <td data-label={columns.input}>{row.input || row.control}</td>
              <td data-label={columns.kpi}>
                <span className="ads-channel-kpis">
                  {metaKpiTags(row.kpi).map((tag) => (
                    <span key={tag} className="kpi-latin ads-channel-kpi">
                      {tag}
                    </span>
                  ))}
                </span>
              </td>
              <td data-label={columns.output}>
                <span className="kpi-latin ads-channel-output">{row.output}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
