import { ADS_CHANNEL_ROWS } from "@/lib/google-ads";
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

export function AdsChannelMatrix({
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
      : ADS_CHANNEL_ROWS.map((row) => ({
          id: row.id,
          channel: row.channel,
          useCase: thai ? row.useCaseTh : row.useCaseEn,
          control: thai ? row.controlTh : row.controlEn,
          input: thai ? row.inputTh : row.inputEn,
          output: thai ? row.outputTh : row.outputEn,
          kpi: thai ? row.kpiTh : row.kpiEn,
        }));
  const columns = {
    channel: thai ? "ช่องทาง" : "Channel",
    useCase: thai ? "กรณีที่ใช้ได้ดี" : "Best use case",
    control: thai ? "สิ่งที่ควบคุมได้" : "What can be controlled",
    input: thai ? "สิ่งที่ต้องมี" : "Required input",
    output: thai ? "ผลที่คาดหวัง" : "Expected output",
    kpi: thai ? "ตัวชี้วัดที่ต้องดู" : "KPI to monitor",
  };

  return (
    <div className="ads-channel-table-wrap">
      <table className="ads-channel-table">
        <caption className="ads-channel-caption">
          {thai ? "เปรียบเทียบ Search Ads, Hotel Ads และ Free Booking Links" : "Search Ads vs Hotel Ads vs Free Booking Links"}
        </caption>
        <thead>
          <tr>
            <th scope="col">{columns.channel}</th>
            <th scope="col">{columns.useCase}</th>
            <th scope="col">{columns.control}</th>
            <th scope="col">{columns.input}</th>
            <th scope="col">{columns.output}</th>
            <th scope="col">{columns.kpi}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <th scope="row" data-label={columns.channel}>
                <span className="kpi-latin">{row.channel}</span>
              </th>
              <td data-label={columns.useCase}>{row.useCase}</td>
              <td data-label={columns.control}>{row.control}</td>
              <td data-label={columns.input}>{row.input}</td>
              <td data-label={columns.output}>{row.output}</td>
              <td data-label={columns.kpi}>
                <span className="kpi-latin ads-channel-kpi">{row.kpi}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
