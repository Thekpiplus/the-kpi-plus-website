import { allInsightPosts } from "@/lib/cms/public";
import { SITE } from "@/lib/seo";

export async function GET() {
  const items = (await allInsightPosts())
    .sort((a, b) => b.published.localeCompare(a.published))
    .map(
      (post) => `    <item>
      <title><![CDATA[${post.title.th}]]></title>
      <link>${SITE}${post.href}</link>
      <guid>${SITE}${post.href}</guid>
      <pubDate>${new Date(`${post.published}T00:00:00Z`).toUTCString()}</pubDate>
      <description><![CDATA[${post.description.th}]]></description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>The KPI Plus Insights</title>
    <link>${SITE}/insights</link>
    <description>บทความสำหรับเจ้าของ ผู้บริหาร และทีมโรงแรม เกี่ยวกับ Revenue, Demand, Marketing, Technology และการพัฒนาธุรกิจโรงแรม</description>
    <language>th</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
