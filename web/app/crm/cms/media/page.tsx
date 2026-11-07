import { MediaThumbnailGrid } from "@/components/cms/MediaThumbnailGrid";
import { UploadMediaButton } from "@/components/cms/UploadMediaModal";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { PageHeader } from "@/components/crm/ui/PageHeader";
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

export default async function CmsMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string; new?: string }>;
}) {
  const params = await searchParams;
  const media = await listMedia();
  const imageCount = media.filter((item) => item.mime.startsWith("image/")).length;
  const items = media.map((item) => ({
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

  return (
    <div className="crm-cms crm-cms-media">
      <PageHeader
        eyebrow="Content Management"
        title="สื่อ/ไฟล์รูปภาพ"
        description="คลิกที่รูปเพื่อคัดลอกพาธหรือแก้ไขรายละเอียด — อัปโหลดไฟล์ไปที่ /media/cms"
        actions={<UploadMediaButton autoOpen={params.new === "1"} />}
      />

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

      <section className="crm-cms-media-library" aria-labelledby="crm-cms-media-heading">
        <div className="crm-cms-media-library-head">
          <div>
            <p className="crm-cms-media-kicker">คลังไฟล์</p>
            <h2 id="crm-cms-media-heading">
              ไฟล์ทั้งหมด
              <span className="crm-leads-count">{media.length}</span>
            </h2>
          </div>
          <div className="crm-cms-media-head-actions">
            <div className="crm-cms-media-stats" aria-label="สรุปคลังไฟล์">
              <span>
                <strong>{media.length}</strong> ไฟล์
              </span>
              <span>
                <strong>{imageCount}</strong> รูป
              </span>
            </div>
            <UploadMediaButton className="kpi-button crm-users-primary" />
          </div>
        </div>

        {items.length === 0 ? (
          <EmptyState
            title="ยังไม่มีไฟล์"
            body="กดอัปโหลดไฟล์เพื่อเพิ่มรูปหรือ PDF แล้วคลิกที่รูปเพื่อคัดลอกพาธ"
          />
        ) : (
          <MediaThumbnailGrid items={items} />
        )}
      </section>
    </div>
  );
}
