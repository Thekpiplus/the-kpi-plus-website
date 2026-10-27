import { ADS_CHANNEL_DECISIONS } from "@/lib/google-ads";
import type { Locale } from "@/lib/seo";

export function AdsChannelDecisions({ locale }: { locale: Locale }) {
  const thai = locale === "th";

  return (
    <aside className="ads-channel-decisions" aria-labelledby="ads-channel-decisions-title">
      <h3 id="ads-channel-decisions-title">
        {thai ? "ก่อนเลือกช่องทาง ถามสี่ข้อนี้" : "Before choosing a channel, ask these four questions"}
      </h3>
      <ol>
        {ADS_CHANNEL_DECISIONS.map((item, index) => (
          <li key={item.id}>
            <span className="kpi-latin ads-channel-decisions-num">{String(index + 1).padStart(2, "0")}</span>
            <p>{thai ? item.th : item.en}</p>
          </li>
        ))}
      </ol>
    </aside>
  );
}
