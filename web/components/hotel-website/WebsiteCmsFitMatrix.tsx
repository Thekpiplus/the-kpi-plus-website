import { WEBSITE_CMS_FIT_ROWS, WEBSITE_CMS_VISUAL, websiteSampleLabel } from "@/lib/hotel-website";
import type { Locale } from "@/lib/seo";

function markLatin(text: string) {
  const parts = text.split(
    /(WordPress|Cursor|Claude|Manus|Booking Engine|Search Console|Analytics|CMS|API|URL|QA|CRM)/g,
  );
  return parts.map((part, index) =>
    /^(WordPress|Cursor|Claude|Manus|Booking Engine|Search Console|Analytics|CMS|API|URL|QA|CRM)$/.test(part) ? (
      <span key={`${part}-${index}`} className="kpi-latin">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export type WebsiteCmsFitRowView = {
  id?: string;
  need?: string;
  option?: string;
  suitable?: string;
  verify?: string;
  ownership?: string;
};

export function WebsiteCmsFitMatrix({ locale, rows: overrideRows }: { locale: Locale; rows?: WebsiteCmsFitRowView[] }) {
  const thai = locale === "th";
  const columns = {
    need: thai ? "ความต้องการ" : "Need",
    option: thai ? "ตัวเลือกที่เป็นไปได้" : "Possible option",
    suitable: thai ? "เหมาะเมื่อ" : "Suitable when",
    verify: thai ? "สิ่งที่ต้องตรวจ" : "What to verify",
    ownership: thai ? "กรรมสิทธิ์หลังส่งมอบ" : "Ownership after handover",
  };
  const source = overrideRows?.length ? overrideRows : WEBSITE_CMS_FIT_ROWS;
  const rows = source.map((row, index) => {
    const known = WEBSITE_CMS_FIT_ROWS[index];
    const override = overrideRows?.[index];
    return {
      id: override?.id || ("id" in row ? row.id : known?.id) || `fit-${index + 1}`,
      need: override?.need?.trim() || ("needTh" in row ? (thai ? row.needTh : row.needEn) : row.need) || "",
      option: override?.option?.trim() || ("optionTh" in row ? (thai ? row.optionTh : row.optionEn) : row.option) || "",
      suitable: override?.suitable?.trim() || ("suitableTh" in row ? (thai ? row.suitableTh : row.suitableEn) : row.suitable) || "",
      verify: override?.verify?.trim() || ("verifyTh" in row ? (thai ? row.verifyTh : row.verifyEn) : row.verify) || "",
      ownership: override?.ownership?.trim() || ("ownershipTh" in row ? (thai ? row.ownershipTh : row.ownershipEn) : row.ownership) || "",
    };
  });

  return (
    <div className="web-cms-matrix">
      <p className="web-cms-kicker">
        <span className="web-cms-badge">{websiteSampleLabel(locale)}</span>
        <span className="kpi-latin">{thai ? WEBSITE_CMS_VISUAL.labelTh : WEBSITE_CMS_VISUAL.labelEn}</span>
      </p>
      <div className="web-cms-table-wrap">
        <table className="web-cms-table">
          <caption>
            {thai
              ? "ตาราง Technology Fit แสดงความต้องการ ตัวเลือก เงื่อนไข สิ่งที่ต้องตรวจ และกรรมสิทธิ์หลังส่งมอบ"
              : "Technology Fit Matrix showing need, possible option, suitable when, what to verify, and ownership after handover"}
          </caption>
          <thead>
            <tr>
              <th scope="col">{columns.need}</th>
              <th scope="col">{columns.option}</th>
              <th scope="col">{columns.suitable}</th>
              <th scope="col">{columns.verify}</th>
              <th scope="col">{columns.ownership}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <th scope="row" data-label={columns.need}>
                  <span className="kpi-latin web-cms-need">{row.need}</span>
                </th>
                <td data-label={columns.option}>{markLatin(row.option)}</td>
                <td data-label={columns.suitable}>{row.suitable}</td>
                <td data-label={columns.verify}>{markLatin(row.verify)}</td>
                <td data-label={columns.ownership}>
                  <span className="web-cms-ownership">{row.ownership}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
