import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { documentPath } from "@/lib/cms/body";
import {
  isHotelMarketingInsightDocument,
  parseHotelMarketingInsightBody,
  type CmsHmVisual,
  type LocaleText,
} from "@/lib/cms/hotel-marketing-insight";
import { editorStateForHotelMarketingDocument } from "@/lib/cms/hotel-marketing-insight-actions";
import { documentById } from "@/lib/cms/queries";
import { isCmsPageLive } from "@/lib/cms/public";
import { requireUser } from "@/lib/crm/auth";
import { hasModule } from "@/lib/crm/modules";
import { isFullAccessRole } from "@/lib/crm/roles";

function paragraphs(text: string) {
  return text
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function Body({ text }: { text: string }) {
  const items = paragraphs(text);
  return items.length ? (
    <>
      {items.map((item, index) => (
        <p key={index}>{item}</p>
      ))}
    </>
  ) : (
    <p className="crm-contact-image-hint">— ยังไม่มีเนื้อหา —</p>
  );
}

function Bullets({ items }: { items: string[] }) {
  const list = items.map((item) => item.trim()).filter(Boolean);
  if (!list.length) return null;
  return (
    <ul>
      {list.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

function Visual({ visual, locale }: { visual: CmsHmVisual; locale: string }) {
  const alt = locale === "th" ? visual.alt.th : visual.alt.en || visual.alt.th;
  const caption = locale === "th" ? visual.caption.th : visual.caption.en || visual.caption.th;
  if (!visual.src && !visual.diagramId) return null;
  return (
    <figure className="crm-contact-image-preview">
      {visual.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={visual.src} alt={alt} width={480} height={320} />
      ) : (
        <p className="crm-contact-image-hint">แผนภาพ: {visual.diagramId}</p>
      )}
      <figcaption>
        {[caption, `สถานะ ${visual.status}`, visual.permissionStatus !== "not_applicable" ? `สิทธิ์ ${visual.permissionStatus}` : ""]
          .filter(Boolean)
          .join(" · ")}
      </figcaption>
    </figure>
  );
}

export default async function PreviewCmsInsightPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!isFullAccessRole(user.role) && !hasModule(user, "cms")) redirect("/crm?error=forbidden");

  const { id } = await params;
  const document = await documentById(id);
  if (!document || document.kind !== "insight" || document.trashedAt) notFound();
  // Only the structured Hotel Marketing article has a CMS preview; other insights use the generic editor.
  if (!isHotelMarketingInsightDocument(document)) redirect(`/crm/cms/insights/${id}`);

  const hydrated = await editorStateForHotelMarketingDocument(id);
  const content = hydrated ? parseHotelMarketingInsightBody(hydrated.document.body) : null;
  if (!hydrated || !content) notFound();

  const doc = hydrated.document;
  const locale = doc.locale || "th";
  const t = (text: LocaleText) => (locale === "th" ? text.th : text.en.trim() || text.th);
  const tp = (th: string, en: string) => (locale === "th" ? th : en.trim() || th);
  const live = isCmsPageLive(doc);
  const path = documentPath(doc);
  const refLabel = new Map(content.references.map((ref, index) => [ref.id, `[${index + 1}] ${t(ref.label) || ref.id}`]));
  const cited = (ids: string[]) => ids.map((refId) => refLabel.get(refId)).filter(Boolean);

  return (
    <div className="crm-cms crm-cs-preview">
      <PageHeader
        eyebrow="Content Management"
        title="ตัวอย่างบทความ Hotel Marketing"
        description={live ? "บทความที่เผยแพร่แล้ว — โครงสร้างเนื้อหาจาก CMS" : "ตัวอย่างในระบบ — ยังไม่แสดงบนเว็บสาธารณะ"}
        actions={
          <div className="crm-cms-actions">
            <Link href={`/crm/cms/insights/${doc.id}`} className="crm-users-secondary">
              ← กลับไปแก้ไข
            </Link>
            <Link href="/crm/cms/insights" className="crm-users-secondary">
              บทความทั้งหมด
            </Link>
          </div>
        }
      />
      <p className="crm-users-alert is-warn" role="status">
        ตัวอย่าง CMS — เนื้อหาที่มีโครงสร้างจะแสดงบนเว็บสาธารณะหลัง public renderer พร้อม (หน้านี้แสดงโครงสร้างเพื่อให้บรรณาธิการตรวจทาน
        เส้นทางสาธารณะ {path})
      </p>
      <p className={`crm-users-alert ${live ? "is-ok" : "is-warn"}`} role="status">
        {live ? `สถานะ Published — ${path}` : "สถานะฉบับร่าง — ยังไม่เป็นสาธารณะ"}
      </p>

      <div className="crm-cs-preview-frame">
        <article className="crm-cms-panel">
          <header>
            <p className="crm-modal-eyebrow">{t(content.category) || "—"}</p>
            <h2>{t(content.title) || doc.title}</h2>
            <p>{t(content.excerpt)}</p>
            <p className="crm-contact-image-hint">
              ผู้เขียน: {content.authorName || "—"} {content.authorVerified ? "(ยืนยันแล้ว)" : "(ยังไม่ยืนยัน)"}
              {content.reviewerName ? ` · ผู้ตรวจทาน: ${content.reviewerName} ${content.reviewerVerified ? "(ยืนยันแล้ว)" : "(ยังไม่ยืนยัน)"}` : ""}
              {content.publishedAt ? ` · เผยแพร่ ${content.publishedAt}` : ""}
              {content.updatedAt ? ` · อัปเดต ${content.updatedAt}` : ""}
              {content.readingTimeMinutes ? ` · อ่าน ${content.readingTimeMinutes} นาที` : ""}
            </p>
            {content.journeyLabels.length ? <p>Journey: {content.journeyLabels.join(" → ")}</p> : null}
          </header>
          {t(content.summaryCallout) ? <blockquote>{t(content.summaryCallout)}</blockquote> : null}
          <Visual visual={content.cover} locale={locale} />

          {content.sections.length ? (
            <nav aria-label="สารบัญ">
              <h3>สารบัญ</h3>
              <ol>
                {content.sections
                  .filter((section) => section.showInToc)
                  .map((section) => (
                    <li key={section.id}>
                      {t(section.tocLabel) || t(section.heading) || "(ไม่มีหัวข้อ)"}
                      {section.tocAnchor ? <span className="crm-contact-image-hint"> #{section.tocAnchor}</span> : null}
                    </li>
                  ))}
              </ol>
            </nav>
          ) : null}
        </article>

        {content.sections.map((section) => (
          <section key={section.id} id={section.tocAnchor || undefined} className="crm-cms-panel">
            <p className="crm-contact-image-hint">ประเภท: {section.type}</p>
            <h2>{t(section.heading) || "(ไม่มีหัวข้อ)"}</h2>
            <Body text={tp(section.bodyTh, section.bodyEn)} />
            <Bullets items={locale === "th" ? section.bulletsTh : section.bulletsEn.length ? section.bulletsEn : section.bulletsTh} />
            <Visual visual={section.visual} locale={locale} />
            {cited(section.sourceIds).length ? <p className="crm-contact-image-hint">อ้างอิง: {cited(section.sourceIds).join(", ")}</p> : null}
          </section>
        ))}

        {content.strategies.length ? (
          <section className="crm-cms-panel">
            <h2>กลยุทธ์</h2>
            <ol>
              {content.strategies.map((strategy) => (
                <li key={strategy.id}>
                  <h3>
                    {strategy.num} · {t(strategy.title) || "(ไม่มีชื่อ)"}
                  </h3>
                  <Body text={tp(strategy.bodyTh, strategy.bodyEn)} />
                  <Visual visual={strategy.visual} locale={locale} />
                  {cited(strategy.sourceIds).length ? <p className="crm-contact-image-hint">อ้างอิง: {cited(strategy.sourceIds).join(", ")}</p> : null}
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        {content.metrics.length ? (
          <section className="crm-cms-panel">
            <h2>ตัวชี้วัด</h2>
            <Body text={tp(content.metricsIntroTh, content.metricsIntroEn)} />
            <div className="crm-users-table-wrap">
              <table className="crm-users-table">
                <thead>
                  <tr>
                    <th>ตัวชี้วัด</th>
                    <th>คำถามที่ตอบ</th>
                    <th>คำนิยาม</th>
                    <th>ช่วงเวลา</th>
                    <th>แหล่งข้อมูล</th>
                    <th>ค่า</th>
                    <th>สถานะ</th>
                  </tr>
                </thead>
                <tbody>
                  {content.metrics.map((metric) => (
                    <tr key={metric.id}>
                      <td>{metric.name || "—"}</td>
                      <td>{t(metric.question) || "—"}</td>
                      <td>{t(metric.definition) || "—"}</td>
                      <td>{metric.period || "—"}</td>
                      <td>{metric.source || "—"}</td>
                      <td>{metric.value || "—"}</td>
                      <td>{metric.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Body text={tp(content.metricsNoteTh, content.metricsNoteEn)} />
          </section>
        ) : null}

        {content.compare.lanes.length || content.compare.handoffs.length || t(content.compare.heading) ? (
          <section className="crm-cms-panel">
            <h2>{t(content.compare.heading) || "เปรียบเทียบ"}</h2>
            <Body text={tp(content.compare.bodyTh, content.compare.bodyEn)} />
            <ul>
              {content.compare.lanes.map((lane) => (
                <li key={lane.id}>
                  <strong>{t(lane.role) || "—"}</strong>: {t(lane.focus)}
                </li>
              ))}
            </ul>
            {content.compare.handoffs.length ? (
              <ol>
                {content.compare.handoffs.map((handoff) => (
                  <li key={handoff.id}>
                    <strong>{handoff.from || "—"}</strong> → {t(handoff.text)}
                  </li>
                ))}
              </ol>
            ) : null}
            <Visual visual={content.compare.visual} locale={locale} />
          </section>
        ) : null}

        {content.startHere.steps.length || t(content.startHere.heading) ? (
          <section className="crm-cms-panel">
            <h2>{t(content.startHere.heading) || "เริ่มต้น"}</h2>
            <Body text={tp(content.startHere.introTh, content.startHere.introEn)} />
            <ol>
              {content.startHere.steps.map((step) => (
                <li key={step.id}>{t(step.title) || "—"}</li>
              ))}
            </ol>
            <Body text={tp(content.startHere.closingTh, content.startHere.closingEn)} />
            <Visual visual={content.startHere.visual} locale={locale} />
          </section>
        ) : null}

        <section className="crm-cms-panel">
          <h2>{t(content.conclusion.heading) || "สรุป"}</h2>
          <Body text={tp(content.conclusion.bodyTh, content.conclusion.bodyEn)} />
          {t(content.cta.title) || t(content.cta.buttonLabel) ? (
            <div>
              <h3>{t(content.cta.title)}</h3>
              <p>{t(content.cta.body)}</p>
              {t(content.cta.buttonLabel) ? <span className="kpi-button">{t(content.cta.buttonLabel)}</span> : null}
            </div>
          ) : null}
        </section>

        {content.relatedServices.length || content.relatedArticles.length ? (
          <section className="crm-cms-panel">
            <h2>เนื้อหาที่เกี่ยวข้อง</h2>
            <ul>
              {content.relatedServices.map((service) => (
                <li key={service.id}>
                  {service.href} — {t(service.why)}
                </li>
              ))}
              {content.relatedArticles.map((article) => (
                <li key={article.id}>บทความ: {article.articleId}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {content.references.length ? (
          <section className="crm-cms-panel">
            <h2>แหล่งอ้างอิง</h2>
            <Body text={t(content.referencesNote)} />
            <ol>
              {content.references.map((ref) => (
                <li key={ref.id}>
                  {t(ref.label) || ref.id}
                  {ref.url ? ` — ${ref.url}` : ""}
                  <span className="crm-contact-image-hint">
                    {" "}
                    ({ref.status}
                    {ref.publishedAt ? ` · เผยแพร่ ${ref.publishedAt}` : ""}
                    {ref.accessedAt ? ` · เข้าถึง ${ref.accessedAt}` : ""})
                  </span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </div>
    </div>
  );
}
