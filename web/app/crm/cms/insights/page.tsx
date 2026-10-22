import Link from "next/link";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { InsightsTable, type InsightTableRow } from "@/components/crm/ui/InsightsTable";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { documentPath } from "@/lib/cms/body";
import { resolveInsightOrder } from "@/lib/cms/insight-order";
import { isCmsPageLive } from "@/lib/cms/public";
import { listDocuments, trashedInsightSlugs } from "@/lib/cms/queries";
import { insightPosts } from "@/lib/insights";

export default async function CmsInsightsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; deleted?: string }>;
}) {
  const params = await searchParams;
  const [posts, trashedSlugs] = await Promise.all([
    listDocuments("insight", { q: params.q, status: params.status }),
    trashedInsightSlugs(),
  ]);
  const cmsSlugs = new Set(posts.map((post) => post.slug));
  const hiddenSite = new Set(trashedSlugs);
  const query = params.q?.trim().toLowerCase() ?? "";
  const sitePosts = params.status
    ? []
    : insightPosts.filter((post) => {
        if (cmsSlugs.has(post.slug) || hiddenSite.has(post.slug)) return false;
        if (!query) return true;
        return post.title.th.toLowerCase().includes(query) || post.slug.toLowerCase().includes(query);
      });

  const rows: InsightTableRow[] = [
    ...posts.map((post) => {
      const metaTag = post.seoTitle?.trim() || post.title;
      const description = post.metaDescription?.trim() || post.excerpt?.trim() || "—";
      return {
        key: post.id,
        kind: "cms" as const,
        slug: post.slug,
        title: post.title,
        path: documentPath(post),
        metaTag,
        description,
        online: isCmsPageLive(post),
        id: post.id,
      };
    }),
    ...sitePosts.map((post) => ({
      key: post.slug,
      kind: "site" as const,
      slug: post.slug,
      title: post.title.th,
      path: post.href,
      metaTag: post.title.th,
      description: post.excerpt.th,
      online: true,
    })),
  ];

  const filtered = Boolean(params.q?.trim() || params.status);
  const order = await resolveInsightOrder(rows.map((row) => row.slug));
  const rank = new Map(order.map((slug, index) => [slug, index]));
  rows.sort((a, b) => (rank.get(a.slug) ?? 9999) - (rank.get(b.slug) ?? 9999));

  const total = rows.length;

  return (
    <div className="crm-cms">
      <PageHeader
        eyebrow="Content Management"
        title="บทความ"
        description="เพิ่ม แก้ไข จัดลำดับ และลบบทความได้จากหน้านี้ — ลำดับที่ 1 จะแสดงเป็นบทความเด่นบน /insights"
        actions={
          <Link href="/crm/cms/insights/new" className="kpi-button">
            สร้างบทความ
          </Link>
        }
      />

      {params.deleted === "1" ? (
        <p className="crm-users-alert is-ok" role="status">
          ย้ายเข้าถังขยะแล้ว —{" "}
          <Link href="/crm/cms/trash" className="crm-cms-inline-link">
            เปิดถังขยะ
          </Link>
        </p>
      ) : null}

      <section className="crm-cms-toolbar">
        <form className="crm-cms-filters" method="get">
          <label>
            ค้นหา
            <input className="crm-field" name="q" defaultValue={params.q} placeholder="ชื่อบทความ หรือ slug" />
          </label>
          <label>
            สถานะ
            <select className="crm-select" name="status" defaultValue={params.status ?? ""}>
              <option value="">ทั้งหมด</option>
              <option value="draft">ฉบับร่าง</option>
              <option value="published">เผยแพร่</option>
              <option value="scheduled">ตั้งเวลา</option>
            </select>
          </label>
          <div className="crm-cms-filters-actions">
            <button className="kpi-button" type="submit">
              กรอง
            </button>
            {filtered ? (
              <Link href="/crm/cms/insights" className="crm-users-secondary">
                ล้างตัวกรอง
              </Link>
            ) : null}
          </div>
        </form>
        <p className="crm-cms-count">แสดง {total} บทความ</p>
      </section>

      <section className="crm-cms-panel">
        {total === 0 ? (
          <EmptyState
            title="ยังไม่มีบทความ"
            body="สร้างบทความใหม่เพื่อเผยแพร่ที่ /insights/[slug]"
            action={
              <Link href="/crm/cms/insights/new" className="kpi-button">
                สร้างบทความ
              </Link>
            }
          />
        ) : (
          <InsightsTable rows={rows} orderDisabled={filtered} />
        )}
      </section>
    </div>
  );
}
