import { META_HOTEL_SCENARIO_ROWS } from "@/lib/meta-ads";
import type { Locale } from "@/lib/seo";

export type AdsHotelScenarioRow = {
  id: string;
  situation: string;
  question: string;
  action: string;
  output: string;
  next: string;
};

export function MetaHotelScenarioMatrix({
  locale,
  rows,
}: {
  locale: Locale;
  rows?: AdsHotelScenarioRow[];
}) {
  const thai = locale === "th";
  const data =
    rows?.length
      ? rows
      : META_HOTEL_SCENARIO_ROWS.map((row) => ({
          id: row.id,
          situation: thai ? row.situationTh : row.situationEn,
          question: thai ? row.questionTh : row.questionEn,
          action: thai ? row.actionTh : row.actionEn,
          output: thai ? row.outputTh : row.outputEn,
          next: thai ? row.nextTh : row.nextEn,
        }));
  const columns = {
    situation: thai ? "สถานการณ์" : "Situation",
    question: thai ? "คำถามวินิจฉัยแรก" : "First diagnostic question",
    action: thai ? "สิ่งที่ควรเริ่ม" : "Recommended starting action",
    output: thai ? "สิ่งที่ได้" : "Output",
    next: thai ? "การตัดสินใจขั้นถัดไป" : "Next decision",
  };

  return (
    <div className="ads-channel-table-wrap">
      <table className="ads-channel-table ads-hotel-scenario-table">
        <caption className="ads-channel-caption">
          {thai ? "ตารางสถานการณ์ Meta Ads ของโรงแรม" : "Hotel Meta Ads Scenario Matrix"}
        </caption>
        <thead>
          <tr>
            <th scope="col">{columns.situation}</th>
            <th scope="col">{columns.question}</th>
            <th scope="col">{columns.action}</th>
            <th scope="col">{columns.output}</th>
            <th scope="col">{columns.next}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <th scope="row" data-label={columns.situation}>
                {row.situation}
              </th>
              <td data-label={columns.question}>{row.question}</td>
              <td data-label={columns.action}>
                <span className="kpi-latin ads-channel-kpi">{row.action}</span>
              </td>
              <td data-label={columns.output}>
                <span className="kpi-latin ads-channel-output">{row.output}</span>
              </td>
              <td data-label={columns.next}>{row.next}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
