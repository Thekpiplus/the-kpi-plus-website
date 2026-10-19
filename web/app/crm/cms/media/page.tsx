import Link from "next/link";
import { ConfirmDeleteButton } from "@/components/crm/ui/ConfirmDeleteButton";
import { CopyPathButton } from "@/components/crm/ui/CopyPathButton";
import { EmptyState } from "@/components/crm/ui/EmptyState";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { deleteMedia, updateMedia, uploadMedia } from "@/lib/cms/actions";
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
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const params = await searchParams;
  const media = await listMedia();
  const imageCount = media.filter((item) => item.mime.startsWith("image/")).length;

  return (
    <div className="crm-cms crm-cms-media">
      <PageHeader
        eyebrow="Content Management"
        title="สื่อ/ไฟล์รูปภาพ"
        description="อัปโหลดรูปและไฟล์ไปที่ /media/cms แล้วคัดลอกพาธไปใส่ในหน้าหรือบทความ"
        actions={
          <div className="crm-cms-actions">
            <Link href="/crm/cms" className="crm-users-secondary">
              หน้าเพจทั้งหมด
            </Link>
          </div>
        }
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

      <div className="crm-cms-media-layout">
        <aside className="crm-cms-media-upload">
          <div className="crm-cms-media-upload-head">
            <p className="crm-cms-media-kicker">อัปโหลด</p>
            <h2>เพิ่มไฟล์ใหม่</h2>
            <p>รองรับรูปภาพและ PDF — เก็บที่ `/media/cms`</p>
          </div>
          <form action={uploadMedia} className="crm-cms-media-upload-form" encType="multipart/form-data">
            <label className="crm-cms-media-drop">
              <span className="crm-cms-media-drop-mark" aria-hidden="true">
                ↑
              </span>
              <span className="crm-cms-media-drop-title">เลือกไฟล์จากเครื่อง</span>
              <span className="crm-cms-media-drop-hint">JPG · PNG · WEBP · GIF · SVG · PDF</span>
              <input className="crm-cms-media-file" type="file" name="file" accept="image/*,.pdf" required />
            </label>
            <label className="crm-cms-field">
              <span>Alt text</span>
              <input className="crm-field" name="alt" placeholder="คำอธิบายรูปสำหรับ SEO / accessibility" />
            </label>
            <label className="crm-cms-field">
              <span>คำบรรยาย</span>
              <input className="crm-field" name="caption" placeholder="ใช้ประกอบในหน้าเว็บ (ถ้ามี)" />
            </label>
            <button className="kpi-button crm-cms-media-upload-btn" type="submit">
              อัปโหลดไฟล์
            </button>
          </form>
        </aside>

        <section className="crm-cms-media-library">
          <div className="crm-cms-media-library-head">
            <div>
              <p className="crm-cms-media-kicker">คลังไฟล์</p>
              <h2>ไฟล์ทั้งหมด</h2>
            </div>
            <div className="crm-cms-media-stats" aria-label="สรุปคลังไฟล์">
              <span>
                <strong>{media.length}</strong> ไฟล์
              </span>
              <span>
                <strong>{imageCount}</strong> รูป
              </span>
            </div>
          </div>

          {media.length === 0 ? (
            <EmptyState
              title="ยังไม่มีไฟล์"
              body="อัปโหลดรูปหรือ PDF จากแผงด้านซ้าย แล้วคัดลอกพาธไปใช้ในหน้าเพจหรือบทความ"
            />
          ) : (
            <ul className="crm-cms-media-grid">
              {media.map((item) => {
                const isImage = item.mime.startsWith("image/");
                return (
                  <li key={item.id} className="crm-cms-media-card">
                    <div className={`crm-cms-media-thumb${isImage ? "" : " is-file"}`}>
                      {isImage ? <img src={item.path} alt={item.alt || item.filename} loading="lazy" /> : (
                        <span className="crm-cms-media-file-badge">{mimeLabel(item.mime)}</span>
                      )}
                      <span className="crm-cms-media-type">{mimeLabel(item.mime)}</span>
                    </div>

                    <div className="crm-cms-media-body">
                      <div className="crm-cms-media-meta">
                        <h3 title={item.filename}>{item.filename}</h3>
                        <p>
                          {formatBytes(item.size)} · {formatDate(item.createdAt)}
                        </p>
                      </div>

                      <CopyPathButton path={item.path} />

                      <form action={updateMedia} className="crm-cms-media-edit">
                        <input type="hidden" name="id" value={item.id} />
                        <label className="crm-cms-field">
                          <span>Alt</span>
                          <input className="crm-field" name="alt" defaultValue={item.alt} placeholder="alt text" />
                        </label>
                        <label className="crm-cms-field">
                          <span>คำบรรยาย</span>
                          <input
                            className="crm-field"
                            name="caption"
                            defaultValue={item.caption}
                            placeholder="caption"
                          />
                        </label>
                        <div className="crm-cms-media-card-actions">
                          <button className="kpi-button" type="submit">
                            บันทึก
                          </button>
                          <ConfirmDeleteButton
                            action={deleteMedia}
                            fields={{ id: item.id, path: item.path }}
                            itemName={item.filename}
                            eyebrow="Media"
                            title="ลบไฟล์"
                            message={`ยืนยันลบไฟล์ “${item.filename}”? การดำเนินการนี้ย้อนกลับไม่ได้`}
                            buttonLabel="ลบ"
                            confirmLabel="ลบไฟล์"
                            className="crm-users-secondary crm-cms-media-delete"
                          />
                        </div>
                      </form>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
