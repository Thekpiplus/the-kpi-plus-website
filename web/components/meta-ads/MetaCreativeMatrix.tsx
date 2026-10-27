import {
  META_CREATIVE_FORMAT_LABEL,
  META_CREATIVE_ROWS,
  META_CREATIVE_STATUS_LABEL,
  metaCreativeKpiTags,
  metaCreativePublicAssetSrc,
  metaCreativeRowsAreStale,
} from "@/lib/meta-ads";
import type { Locale } from "@/lib/seo";
import { MetaCreativePreview } from "./MetaCreativePreview";

export type AdsCreativeRow = {
  id: string;
  audience: string;
  market: string;
  hook: string;
  offer: string;
  format: string;
  formatLabel: string;
  landing: string;
  kpi: string;
  status: string;
  assetSrc: string;
  assetKind: string;
  assetAlt: string;
};

function formatLabel(row: AdsCreativeRow, thai: boolean) {
  if (row.formatLabel.trim()) return row.formatLabel.trim();
  const known = row.format as keyof typeof META_CREATIVE_FORMAT_LABEL;
  if (META_CREATIVE_FORMAT_LABEL[known]) return thai ? META_CREATIVE_FORMAT_LABEL[known].th : META_CREATIVE_FORMAT_LABEL[known].en;
  return row.format;
}

function statusLabel(status: string, thai: boolean) {
  const known = status as keyof typeof META_CREATIVE_STATUS_LABEL;
  if (META_CREATIVE_STATUS_LABEL[known]) return thai ? META_CREATIVE_STATUS_LABEL[known].th : META_CREATIVE_STATUS_LABEL[known].en;
  return status;
}

export function defaultMetaCreativeRows(locale: Locale): AdsCreativeRow[] {
  const thai = locale === "th";
  return META_CREATIVE_ROWS.map((row) => ({
    id: row.id,
    audience: thai ? row.audienceTh : row.audienceEn,
    market: thai ? row.marketTh : row.marketEn,
    hook: thai ? row.hookTh : row.hookEn,
    offer: thai ? row.offerTh : row.offerEn,
    format: row.format,
    formatLabel: row.formatLabel,
    landing: thai ? row.landingTh : row.landingEn,
    kpi: thai ? row.kpiTh : row.kpiEn,
    status: row.status,
    assetSrc: "",
    assetKind: "none",
    assetAlt: "",
  }));
}

export function MetaCreativeMatrix({
  locale,
  rows,
}: {
  locale: Locale;
  rows?: AdsCreativeRow[];
}) {
  const thai = locale === "th";
  const source = rows?.length ? rows : defaultMetaCreativeRows(locale);
  const data = (metaCreativeRowsAreStale(source) ? defaultMetaCreativeRows(locale) : source).filter(
    (row) => row.status !== "archived" && row.audience && row.hook && row.format && row.landing && row.kpi,
  );
  const columns = {
    preview: thai ? "ตัวอย่างครีเอทีฟ" : "Creative preview",
    audience: thai ? "กลุ่มลูกค้า" : "Audience segment",
    market: thai ? "ตลาด / ภาษา" : "Market/language",
    hook: thai ? "Creative hook" : "Creative hook",
    offer: thai ? "ข้อเสนอหรือข้อความ" : "Offer or message",
    format: thai ? "รูปแบบ" : "Format",
    landing: thai ? "หน้าปลายทาง" : "Landing page",
    kpi: "Primary KPI",
    status: thai ? "สถานะ" : "Status",
  };
  const chain = [
    { id: "audience", label: thai ? "กลุ่มลูกค้า" : "Audience" },
    { id: "message", label: thai ? "ข้อความ" : "Message" },
    { id: "format", label: thai ? "รูปแบบ" : "Format" },
    { id: "destination", label: thai ? "หน้าปลายทาง" : "Destination" },
    { id: "kpi", label: "KPI" },
  ];

  return (
    <div className="ads-creative-matrix">
      <ol className="ads-creative-chain" aria-label={thai ? "ลำดับ Creative Matrix" : "Creative Matrix sequence"}>
        {chain.map((item) => (
          <li key={item.id}>
            <span className="kpi-latin">{item.label}</span>
          </li>
        ))}
      </ol>
      <div className="ads-channel-table-wrap ads-creative-table-wrap">
        <table className="ads-channel-table ads-creative-table">
          <caption className="ads-channel-caption">
            {thai
              ? "ตาราง Creative Matrix เชื่อมกลุ่มลูกค้า ข้อความ รูปแบบ หน้าปลายทาง และ KPI"
              : "Creative Matrix connecting audience, message, format, destination, and KPI"}
          </caption>
          <thead>
            <tr>
              <th scope="col">{columns.preview}</th>
              <th scope="col">{columns.audience}</th>
              <th scope="col">{columns.market}</th>
              <th scope="col">{columns.hook}</th>
              <th scope="col">{columns.offer}</th>
              <th scope="col">{columns.format}</th>
              <th scope="col">{columns.landing}</th>
              <th scope="col">{columns.kpi}</th>
              <th scope="col">{columns.status}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td data-label={columns.preview} className="ads-creative-preview-cell">
                  <MetaCreativePreview
                    format={row.format}
                    formatLabel={formatLabel(row, thai)}
                    src={metaCreativePublicAssetSrc(row.assetSrc)}
                    kind={row.assetKind}
                    alt={row.assetAlt || row.audience}
                  />
                </td>
                <th scope="row" data-label={columns.audience}>
                  {row.audience}
                </th>
                <td data-label={columns.market}>
                  <span className="kpi-latin ads-creative-tag">{row.market}</span>
                </td>
                <td data-label={columns.hook}>{row.hook}</td>
                <td data-label={columns.offer}>{row.offer}</td>
                <td data-label={columns.format}>
                  <span className="kpi-latin ads-creative-tag ads-creative-tag--format">{formatLabel(row, thai)}</span>
                </td>
                <td data-label={columns.landing}>
                  <span className="kpi-latin ads-channel-output">{row.landing}</span>
                </td>
                <td data-label={columns.kpi}>
                  <span className="ads-channel-kpis">
                    {metaCreativeKpiTags(row.kpi).map((tag) => (
                      <span key={tag} className="kpi-latin ads-channel-kpi">
                        {tag}
                      </span>
                    ))}
                  </span>
                </td>
                <td data-label={columns.status}>
                  <span className={`kpi-latin ads-creative-status is-${row.status || "draft"}`}>{statusLabel(row.status, thai)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="ads-creative-note">
        {thai
          ? "แถวตัวอย่างสำหรับวางแผน ไม่ใช่ผลบัญชีโฆษณาหรือยอดจอง"
          : "Planning sample rows, not ad-account results or bookings"}
      </p>
    </div>
  );
}
