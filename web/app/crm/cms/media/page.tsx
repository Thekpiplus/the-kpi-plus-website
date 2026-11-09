import Link from "next/link";
import { MediaThumbnailGrid } from "@/components/cms/MediaThumbnailGrid";
import { UploadMediaButton } from "@/components/cms/UploadMediaModal";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { listMedia } from "@/lib/cms/queries";

function formatBytes(size: number) {
  if (!Number.isFinite(size) || size <= 0) return "—";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value instanceof Date ? value : new Date(value));
}

function mimeLabel(mime: string) {
  if (mime.startsWith("image/")) return mime.replace("image/", "").toUpperCase();
  if (mime === "application/pdf") return "PDF";
  return mime || "FILE";
}

function mediaKind(mime: string): "image" | "document" | "other" {
  if (mime.startsWith("image/")) return "image";
  if (mime === "application/pdf") return "document";
  return "other";
}

export default async function CmsMediaPage({
  searchParams,
}: {
  searchParams: Promise<{
    saved?: string;
    error?: string;
    new?: string;
    q?: string;
    type?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;
  const media = await listMedia();
  const q = params.q?.trim().toLowerCase() ?? "";
  const type = params.type?.trim() ?? "";
  const sort = params.sort?.trim() || "date-desc";
  const filtered = Boolean(q || type || (sort && sort !== "date-desc"));

  const imageCount = media.filter((item) => mediaKind(item.mime) === "image").length;
  const documentCount = media.filter((item) => mediaKind(item.mime) === "document").length;

  let items = media
    .filter((item) => {
      if (type === "image") return mediaKind(item.mime) === "image";
      if (type === "document") return mediaKind(item.mime) === "document";
      if (type === "other") return mediaKind(item.mime) === "other";
      return true;
    })
    .filter((item) => {
      if (!q) return true;
      return (
        item.filename.toLowerCase().includes(q) ||
        item.path.toLowerCase().includes(q) ||
        item.alt.toLowerCase().includes(q) ||
        item.caption.toLowerCase().includes(q)
      );
    })
    .map((item) => ({
      id: item.id,
      filename: item.filename,
      path: item.path,
      alt: item.alt,
      caption: item.caption,
      mime: item.mime,
      size: item.size,
      createdAt: (item.createdAt instanceof Date ? item.createdAt : new Date(item.createdAt)).toISOString(),
      sizeLabel: formatBytes(item.size),
      dateLabel: formatDate(item.createdAt),
      typeLabel: mimeLabel(item.mime),
    }));

  items = [...items].sort((a, b) => {
    if (sort === "name-asc") return a.filename.localeCompare(b.filename, "th");
    if (sort === "name-desc") return b.filename.localeCompare(a.filename, "th");
    if (sort === "size-desc") return b.size - a.size;
    if (sort === "size-asc") return a.size - b.size;
    if (sort === "date-asc") return a.createdAt.localeCompare(b.createdAt);
    return b.createdAt.localeCompare(a.createdAt);
  });

  return (
    <div className="crm-cms crm-cms-media">
      <header className="crm-cms-overview-head">
        <div>
          <p className="crm-cms-overview-kicker">Content Management</p>
          <h1 className="crm-cms-overview-title">คลังสื่อ</h1>
          <p className="crm-cms-overview-desc">
            อัปโหลด ดูตัวอย่าง และคัดลอกพาธไฟล์สำหรับใช้ในหน้าเว็บ — รวม {media.length} ไฟล์
            {imageCount > 0 || documentCount > 0
              ? ` · รูป ${imageCount}${documentCount > 0 ? ` · เอกสาร ${documentCount}` : ""}`
              : ""}
          </p>
        </div>
        <div className="crm-cms-overview-head-actions">
          <UploadMediaButton autoOpen={params.new === "1"} />
        </div>
      </header>

      {params.saved === "1" ? (
        <p className="crm-users-alert is-ok" role="status">
          อัปโหลดสำเร็จแล้ว
        </p>
      ) : null}
      {params.error === "invalid" ? (
        <p className="crm-users-alert is-warn" role="status">
          เลือกไฟล์ก่อนอัปโหลด
        </p>
      ) : null}
      {params.error === "type" ? (
        <p className="crm-users-alert is-warn" role="status">
          ใช้ได้เฉพาะ JPG PNG WEBP GIF SVG และ PDF
        </p>
      ) : null}

      <section className="crm-cms-toolbar crm-cms-media-toolbar" aria-label="ค้นหาและกรองสื่อ">
        <form className="crm-cms-filters crm-cms-media-filters" method="get">
          <label className="crm-cms-media-search">
            ค้นหา
            <input
              className="crm-field"
              name="q"
              defaultValue={params.q}
              placeholder="ชื่อไฟล์หรือพาธ"
              autoComplete="off"
            />
          </label>
          <label>
            ประเภท
            <select className="crm-select" name="type" defaultValue={type}>
              <option value="">ทั้งหมด</option>
              <option value="image">รูปภาพ ({imageCount})</option>
              <option value="document">เอกสาร ({documentCount})</option>
              {media.length - imageCount - documentCount > 0 ? (
                <option value="other">อื่น ๆ ({media.length - imageCount - documentCount})</option>
              ) : null}
            </select>
          </label>
          <label>
            เรียงลำดับ
            <select className="crm-select" name="sort" defaultValue={sort}>
              <option value="date-desc">วันที่ใหม่สุด</option>
              <option value="date-asc">วันที่เก่าสุด</option>
              <option value="name-asc">ชื่อ ก–ฮ</option>
              <option value="name-desc">ชื่อ ฮ–ก</option>
              <option value="size-desc">ขนาดมาก→น้อย</option>
              <option value="size-asc">ขนาดน้อย→มาก</option>
            </select>
          </label>
          <div className="crm-cms-filters-actions">
            <button className="kpi-button" type="submit">
              กรอง
            </button>
            {filtered ? (
              <Link href="/crm/cms/media" className="crm-users-secondary">
                ล้างตัวกรอง
              </Link>
            ) : null}
          </div>
        </form>
        <p className="crm-cms-count">
          {items.length === 0
            ? filtered
              ? "ไม่พบไฟล์ตามเงื่อนไข"
              : "ยังไม่มีไฟล์"
            : `แสดง ${items.length} จาก ${media.length} ไฟล์`}
        </p>
      </section>

      <section className="crm-cms-media-library" aria-labelledby="crm-cms-media-heading">
        <div className="crm-cms-media-library-head">
          <h2 id="crm-cms-media-heading" className="crm-cms-media-library-title">
            {type === "image" ? "รูปภาพ" : type === "document" ? "เอกสาร" : type === "other" ? "ไฟล์อื่น ๆ" : "ไฟล์ทั้งหมด"}
          </h2>
        </div>

        {items.length === 0 ? (
          <EmptyState
            filtered={filtered}
            title={filtered ? "ไม่พบไฟล์ตามเงื่อนไข" : "ยังไม่มีไฟล์"}
            body={
              filtered
                ? "ลองเปลี่ยนคำค้น ประเภท หรือล้างตัวกรอง"
                : "อัปโหลดรูปหรือ PDF แล้วคลิกที่ไฟล์เพื่อคัดลอกพาธหรือแก้ไขรายละเอียด"
            }
            action={<UploadMediaButton />}
          />
        ) : (
          <MediaThumbnailGrid items={items} />
        )}
      </section>
    </div>
  );
}
