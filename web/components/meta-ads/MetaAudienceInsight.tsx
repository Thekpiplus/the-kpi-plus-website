import {
  META_AUDIENCE_LAYERS,
  META_PLATFORM_AUDIENCE,
  META_PLATFORM_AUDIENCE_SOURCE,
  metaAudienceText,
  metaPlatformAudienceValue,
} from "@/lib/meta-ads";
import type { CmsMetaAudienceStat } from "@/lib/cms/meta-ads-page";
import type { Locale } from "@/lib/seo";

function platformIcon(platform: string) {
  const key = platform.trim().toLowerCase();
  const match = META_PLATFORM_AUDIENCE.find((item) => item.platform.toLowerCase() === key);
  return match?.icon;
}

export function MetaAudienceInsight({
  locale,
  stats,
  sourceLabel,
  sourceHref,
}: {
  locale: Locale;
  stats?: CmsMetaAudienceStat[];
  sourceLabel?: string;
  sourceHref?: string;
}) {
  const thai = locale === "th";
  const source = {
    label: sourceLabel?.trim() || META_PLATFORM_AUDIENCE_SOURCE.label,
    href: sourceHref?.trim() || META_PLATFORM_AUDIENCE_SOURCE.href,
  };
  const rows =
    stats?.length
      ? stats
      : META_PLATFORM_AUDIENCE.map((stat) => ({
          id: stat.id,
          platform: stat.platform,
          value: metaPlatformAudienceValue(stat.value, locale),
          kind: metaAudienceText(stat.kind, locale),
          period: metaAudienceText(stat.period, locale),
          market: metaAudienceText(stat.market, locale),
          definition: metaAudienceText(stat.definition, locale),
          status: metaAudienceText(stat.status, locale),
          dataStatus: "sample" as const,
        }));

  return (
    <div className="kpi-meta-ads-audience-insight">
      <ol className="kpi-meta-ads-audience-layers" aria-label={thai ? "ชั้นข้อมูลกลุ่มลูกค้าถึงผลจอง" : "Audience estimate to booking-result layers"}>
        {META_AUDIENCE_LAYERS.map((layer, index) => (
          <li key={layer.id}>
            <span className="kpi-latin kpi-meta-ads-audience-layer-index">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h3 className="kpi-latin">{metaAudienceText(layer.title, locale)}</h3>
              <p>{metaAudienceText(layer.body, locale)}</p>
              <p className="kpi-meta-ads-audience-layer-result">{metaAudienceText(layer.result, locale)}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="kpi-meta-ads-audience-brand-note">
        {thai
          ? "เครื่องหมาย Facebook และ Instagram ใช้ระบุแพลตฟอร์มตามที่มาที่อ้าง ไม่ใช่ภาพบัญชีลูกค้า และไม่ใช่การรับรองจาก Meta"
          : "Facebook and Instagram marks identify the platforms named in the cited source. They are not a client-account screenshot and not a Meta endorsement."}
      </p>
      <div className="kpi-meta-ads-audience-stats" aria-label={thai ? "ประมาณการกลุ่มเป้าหมายโฆษณาระดับประเทศ" : "Country-level platform audience estimates"}>
        {rows.map((stat) => {
          const icon = platformIcon(stat.platform);
          const sample = stat.dataStatus === "sample";
          return (
            <article key={stat.id}>
              <p className="kpi-latin kpi-meta-ads-audience-kind">{stat.kind}</p>
              {icon ? <img src={icon} alt="" width={18} height={18} className="kpi-meta-ads-compare-mark" aria-hidden="true" /> : null}
              <p className="kpi-latin kpi-meta-ads-audience-number">{stat.value}</p>
              <h3 className="kpi-latin">{stat.platform}</h3>
              {sample ? <p className="kpi-meta-ads-sample-flag">{thai ? "ตัวอย่างข้อมูล" : "Sample data"}</p> : null}
              <dl>
                <div>
                  <dt>{thai ? "ที่มา" : "Source"}</dt>
                  <dd>
                    <a className="kpi-latin" href={source.href} target="_blank" rel="noreferrer">
                      {source.label}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt>{thai ? "วัตถุประสงค์" : "Objective"}</dt>
                  <dd>{thai ? "ประมาณการแพลตฟอร์ม ไม่ใช่วัตถุประสงค์แคมเปญโรงแรม" : "Platform sizing, not a hotel campaign objective"}</dd>
                </div>
                <div>
                  <dt>{thai ? "ช่วงเวลา" : "Period"}</dt>
                  <dd>{stat.period}</dd>
                </div>
                <div>
                  <dt>{thai ? "ตลาด / กลุ่ม" : "Market / audience"}</dt>
                  <dd>{stat.market}</dd>
                </div>
                <div>
                  <dt>{thai ? "หน่วย / คำนิยาม" : "Unit / definition"}</dt>
                  <dd>
                    {thai ? "คน · " : "people · "}
                    {stat.definition}
                  </dd>
                </div>
                <div>
                  <dt>{thai ? "สถานะข้อมูล" : "Data status"}</dt>
                  <dd>{stat.status}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
    </div>
  );
}
