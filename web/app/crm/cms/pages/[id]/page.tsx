import Link from "next/link";
import { notFound } from "next/navigation";
import { CmsDocumentForm } from "@/components/cms/CmsDocumentForm";
import { B2bPageEditor } from "@/components/cms/B2bPageEditor";
import { ReservationsPageEditor } from "@/components/cms/ReservationsPageEditor";
import { RevenuePageEditor } from "@/components/cms/RevenuePageEditor";
import { ConfirmDeleteButton } from "@/components/crm/ui/ConfirmDeleteButton";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { trashDocument } from "@/lib/cms/actions";
import { editorStateForDocument, saveRevenuePage } from "@/lib/cms/revenue-page-actions";
import { isRevenuePageDocument } from "@/lib/cms/revenue-page";
import {
  editorStateForReservationsDocument,
  saveReservationsPage,
} from "@/lib/cms/reservations-page-actions";
import { isReservationsPageDocument } from "@/lib/cms/reservations-page";
import { editorStateForB2bDocument, saveB2bPage } from "@/lib/cms/b2b-page-actions";
import { isB2bPageDocument } from "@/lib/cms/b2b-page";
import { GoogleAdsPageEditor } from "@/components/cms/GoogleAdsPageEditor";
import { editorStateForGoogleAdsDocument, saveGoogleAdsPage } from "@/lib/cms/google-ads-page-actions";
import { isGoogleAdsPageDocument } from "@/lib/cms/google-ads-page";
import { MetaAdsPageEditor } from "@/components/cms/MetaAdsPageEditor";
import { editorStateForMetaAdsDocument, saveMetaAdsPage } from "@/lib/cms/meta-ads-page-actions";
import { isMetaAdsPageDocument } from "@/lib/cms/meta-ads-page";
import { HotelSeoPageEditor } from "@/components/cms/HotelSeoPageEditor";
import { editorStateForHotelSeoDocument, saveHotelSeoPage } from "@/lib/cms/hotel-seo-page-actions";
import { isHotelSeoPageDocument } from "@/lib/cms/hotel-seo-page";
import { HotelWebsitePageEditor } from "@/components/cms/HotelWebsitePageEditor";
import { duplicateHotelWebsitePageToLocale, editorStateForHotelWebsiteDocument, saveHotelWebsitePage } from "@/lib/cms/hotel-website-page-actions";
import { isHotelWebsitePageDocument } from "@/lib/cms/hotel-website-page";
import { HotelDirectBookingsPageEditor } from "@/components/cms/HotelDirectBookingsPageEditor";
import { duplicateDirectBookingPageToLocale, editorStateForDirectBookingDocument, saveDirectBookingPage } from "@/lib/cms/hotel-direct-bookings-page-actions";
import { isHotelDirectBookingsPageDocument } from "@/lib/cms/hotel-direct-bookings-page";
import { documentById } from "@/lib/cms/queries";
import { documentPath } from "@/lib/cms/body";

export default async function EditCmsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string; tab?: string }>;
}) {
  const { id } = await params;
  const { error, saved, tab } = await searchParams;
  const document = await documentById(id);
  if (!document || document.kind !== "page") notFound();

  const path = documentPath(document);
  const revenue = isRevenuePageDocument(document);
  const reservations = isReservationsPageDocument(document);
  const b2b = isB2bPageDocument(document);
  const googleAds = isGoogleAdsPageDocument(document);
  const metaAds = isMetaAdsPageDocument(document);
  const hotelSeo = isHotelSeoPageDocument(document);
  const hotelWebsite = isHotelWebsitePageDocument(document);
  const hotelDirectBookings = isHotelDirectBookingsPageDocument(document);

  if (googleAds) {
    const hydrated = await editorStateForGoogleAdsDocument(id);
    if (!hydrated) notFound();
    return (
      <div className="crm-cms">
        <PageHeader
          eyebrow="Content Management"
          title={hydrated.document.title}
          description={path}
          actions={
            <div className="crm-cms-actions">
              <Link href="/crm/cms" className="crm-users-secondary">
                ← หน้าเพจทั้งหมด
              </Link>
              <Link href={`/crm/cms/pages/${hydrated.document.id}/preview`} className="crm-users-secondary">
                ดูตัวอย่าง
              </Link>
            </div>
          }
        />
        <GoogleAdsPageEditor
          initial={hydrated.state}
          notice={saved === "1" ? "บันทึกแล้ว" : undefined}
          error={error}
          saveAction={saveGoogleAdsPage}
          updatedAt={hydrated.document.updatedAt.toISOString()}
          initialTab={tab}
          previewHref={`/crm/cms/pages/${hydrated.document.id}/preview`}
          publicHref={path}
        />
        <div className="crm-cms-editor-danger">
          <div>
            <p>ลบหน้าเพจ</p>
            <span>ย้ายเข้าถังขยะ หน้าสาธารณะจะกลับไปใช้เนื้อหาในโค้ด</span>
          </div>
          <ConfirmDeleteButton
            action={trashDocument}
            fields={{ id: hydrated.document.id, returnTo: "/crm/cms" }}
            itemName={hydrated.document.title}
            eyebrow="Content"
            title="ย้ายเข้าถังขยะ"
            message={`ยืนยันย้าย “${hydrated.document.title}” เข้าถังขยะ?`}
            buttonLabel="ลบหน้าเพจ"
            confirmLabel="ลบหน้าเพจ"
            className="kpi-button crm-users-delete-btn"
          />
        </div>
      </div>
    );
  }

  if (hotelDirectBookings) {
    const hydrated = await editorStateForDirectBookingDocument(id);
    if (!hydrated) notFound();
    return (
      <div className="crm-cms">
        <PageHeader
          eyebrow="Content Management"
          title={hydrated.document.title}
          description={path}
          actions={
            <div className="crm-cms-actions">
              <Link href="/crm/cms" className="crm-users-secondary">
                ← หน้าเพจทั้งหมด
              </Link>
              <Link href={`/crm/cms/pages/${hydrated.document.id}/preview`} className="crm-users-secondary">
                ดูตัวอย่าง
              </Link>
            </div>
          }
        />
        <HotelDirectBookingsPageEditor
          initial={hydrated.state}
          notice={saved === "1" ? "บันทึกแล้ว" : undefined}
          error={error}
          saveAction={saveDirectBookingPage}
          duplicateAction={duplicateDirectBookingPageToLocale}
          updatedAt={hydrated.document.updatedAt.toISOString()}
          initialTab={tab}
          previewHref={`/crm/cms/pages/${hydrated.document.id}/preview`}
          publicHref={path}
          locales={hydrated.locales}
        />
        <div className="crm-cms-editor-danger">
          <div>
            <p>ลบหน้าเพจ</p>
            <span>ย้ายเข้าถังขยะ หน้าสาธารณะจะกลับไปใช้เนื้อหาในโค้ด</span>
          </div>
          <ConfirmDeleteButton
            action={trashDocument}
            fields={{ id: hydrated.document.id, returnTo: "/crm/cms" }}
            itemName={hydrated.document.title}
            eyebrow="Content"
            title="ย้ายเข้าถังขยะ"
            message={`ยืนยันย้าย “${hydrated.document.title}” เข้าถังขยะ?`}
            buttonLabel="ลบหน้าเพจ"
            confirmLabel="ลบหน้าเพจ"
            className="kpi-button crm-users-delete-btn"
          />
        </div>
      </div>
    );
  }

  if (hotelWebsite) {
    const hydrated = await editorStateForHotelWebsiteDocument(id);
    if (!hydrated) notFound();
    return (
      <div className="crm-cms">
        <PageHeader
          eyebrow="Content Management"
          title={hydrated.document.title}
          description={path}
          actions={
            <div className="crm-cms-actions">
              <Link href="/crm/cms" className="crm-users-secondary">
                ← หน้าเพจทั้งหมด
              </Link>
              <Link href={`/crm/cms/pages/${hydrated.document.id}/preview`} className="crm-users-secondary">
                ดูตัวอย่าง
              </Link>
            </div>
          }
        />
        <HotelWebsitePageEditor
          initial={hydrated.state}
          notice={saved === "1" ? "บันทึกแล้ว" : undefined}
          error={error}
          saveAction={saveHotelWebsitePage}
          duplicateAction={duplicateHotelWebsitePageToLocale}
          updatedAt={hydrated.document.updatedAt.toISOString()}
          initialTab={tab}
          previewHref={`/crm/cms/pages/${hydrated.document.id}/preview`}
          publicHref={path}
          locales={hydrated.locales}
        />
        <div className="crm-cms-editor-danger">
          <div>
            <p>ลบหน้าเพจ</p>
            <span>ย้ายเข้าถังขยะ หน้าสาธารณะจะกลับไปใช้เนื้อหาในโค้ด</span>
          </div>
          <ConfirmDeleteButton
            action={trashDocument}
            fields={{ id: hydrated.document.id, returnTo: "/crm/cms" }}
            itemName={hydrated.document.title}
            eyebrow="Content"
            title="ย้ายเข้าถังขยะ"
            message={`ยืนยันย้าย “${hydrated.document.title}” เข้าถังขยะ?`}
            buttonLabel="ลบหน้าเพจ"
            confirmLabel="ลบหน้าเพจ"
            className="kpi-button crm-users-delete-btn"
          />
        </div>
      </div>
    );
  }

  if (hotelSeo) {
    const hydrated = await editorStateForHotelSeoDocument(id);
    if (!hydrated) notFound();
    return (
      <div className="crm-cms">
        <PageHeader
          eyebrow="Content Management"
          title={hydrated.document.title}
          description={path}
          actions={
            <div className="crm-cms-actions">
              <Link href="/crm/cms" className="crm-users-secondary">
                ← หน้าเพจทั้งหมด
              </Link>
              <Link href={`/crm/cms/pages/${hydrated.document.id}/preview`} className="crm-users-secondary">
                ดูตัวอย่าง
              </Link>
            </div>
          }
        />
        <HotelSeoPageEditor
          initial={hydrated.state}
          notice={saved === "1" ? "บันทึกแล้ว" : undefined}
          error={error}
          saveAction={saveHotelSeoPage}
          updatedAt={hydrated.document.updatedAt.toISOString()}
          initialTab={tab}
          previewHref={`/crm/cms/pages/${hydrated.document.id}/preview`}
          publicHref={path}
        />
        <div className="crm-cms-editor-danger">
          <div>
            <p>ลบหน้าเพจ</p>
            <span>ย้ายเข้าถังขยะ หน้าสาธารณะจะกลับไปใช้เนื้อหาในโค้ด</span>
          </div>
          <ConfirmDeleteButton
            action={trashDocument}
            fields={{ id: hydrated.document.id, returnTo: "/crm/cms" }}
            itemName={hydrated.document.title}
            eyebrow="Content"
            title="ย้ายเข้าถังขยะ"
            message={`ยืนยันย้าย “${hydrated.document.title}” เข้าถังขยะ?`}
            buttonLabel="ลบหน้าเพจ"
            confirmLabel="ลบหน้าเพจ"
            className="kpi-button crm-users-delete-btn"
          />
        </div>
      </div>
    );
  }

  if (metaAds) {
    const hydrated = await editorStateForMetaAdsDocument(id);
    if (!hydrated) notFound();
    return (
      <div className="crm-cms">
        <PageHeader
          eyebrow="Content Management"
          title={hydrated.document.title}
          description={path}
          actions={
            <div className="crm-cms-actions">
              <Link href="/crm/cms" className="crm-users-secondary">
                ← หน้าเพจทั้งหมด
              </Link>
              <Link href={`/crm/cms/pages/${hydrated.document.id}/preview`} className="crm-users-secondary">
                ดูตัวอย่าง
              </Link>
            </div>
          }
        />
        <MetaAdsPageEditor
          initial={hydrated.state}
          notice={saved === "1" ? "บันทึกแล้ว" : undefined}
          error={error}
          saveAction={saveMetaAdsPage}
          updatedAt={hydrated.document.updatedAt.toISOString()}
          initialTab={tab}
          previewHref={`/crm/cms/pages/${hydrated.document.id}/preview`}
          publicHref={path}
        />
        <div className="crm-cms-editor-danger">
          <div>
            <p>ลบหน้าเพจ</p>
            <span>ย้ายเข้าถังขยะ หน้าสาธารณะจะกลับไปใช้เนื้อหาในโค้ด</span>
          </div>
          <ConfirmDeleteButton
            action={trashDocument}
            fields={{ id: hydrated.document.id, returnTo: "/crm/cms" }}
            itemName={hydrated.document.title}
            eyebrow="Content"
            title="ย้ายเข้าถังขยะ"
            message={`ยืนยันย้าย “${hydrated.document.title}” เข้าถังขยะ?`}
            buttonLabel="ลบหน้าเพจ"
            confirmLabel="ลบหน้าเพจ"
            className="kpi-button crm-users-delete-btn"
          />
        </div>
      </div>
    );
  }

  if (b2b) {
    const hydrated = await editorStateForB2bDocument(id);
    if (!hydrated) notFound();
    return (
      <div className="crm-cms">
        <PageHeader
          eyebrow="Content Management"
          title={hydrated.document.title}
          description={path}
          actions={
            <div className="crm-cms-actions">
              <Link href="/crm/cms" className="crm-users-secondary">
                ← หน้าเพจทั้งหมด
              </Link>
              <Link href={`/crm/cms/pages/${hydrated.document.id}/preview`} className="crm-users-secondary">
                ดูตัวอย่าง
              </Link>
            </div>
          }
        />
        <B2bPageEditor
          initial={hydrated.state}
          notice={saved === "1" ? "บันทึกแล้ว" : undefined}
          error={error}
          saveAction={saveB2bPage}
          updatedAt={hydrated.document.updatedAt.toISOString()}
          initialTab={tab}
          previewHref={`/crm/cms/pages/${hydrated.document.id}/preview`}
          publicHref={path}
        />
        <div className="crm-cms-editor-danger">
          <div>
            <p>ลบหน้าเพจ</p>
            <span>ย้ายเข้าถังขยะ หน้าสาธารณะจะกลับไปใช้เนื้อหาในโค้ด</span>
          </div>
          <ConfirmDeleteButton
            action={trashDocument}
            fields={{ id: hydrated.document.id, returnTo: "/crm/cms" }}
            itemName={hydrated.document.title}
            eyebrow="Content"
            title="ย้ายเข้าถังขยะ"
            message={`ยืนยันย้าย “${hydrated.document.title}” เข้าถังขยะ?`}
            buttonLabel="ลบหน้าเพจ"
            confirmLabel="ลบหน้าเพจ"
            className="kpi-button crm-users-delete-btn"
          />
        </div>
      </div>
    );
  }

  if (reservations) {
    const hydrated = await editorStateForReservationsDocument(id);
    if (!hydrated) notFound();
    return (
      <div className="crm-cms">
        <PageHeader
          eyebrow="Content Management"
          title={hydrated.document.title}
          description={path}
          actions={
            <div className="crm-cms-actions">
              <Link href="/crm/cms" className="crm-users-secondary">
                ← หน้าเพจทั้งหมด
              </Link>
              <Link href={`/crm/cms/pages/${hydrated.document.id}/preview`} className="crm-users-secondary">
                ดูตัวอย่าง
              </Link>
            </div>
          }
        />
        <ReservationsPageEditor
          initial={hydrated.state}
          notice={saved === "1" ? "บันทึกแล้ว" : undefined}
          error={error}
          saveAction={saveReservationsPage}
          updatedAt={hydrated.document.updatedAt.toISOString()}
          initialTab={tab}
          previewHref={`/crm/cms/pages/${hydrated.document.id}/preview`}
          publicHref={path}
        />
        <div className="crm-cms-editor-danger">
          <div>
            <p>ลบหน้าเพจ</p>
            <span>ย้ายเข้าถังขยะ หน้าสาธารณะจะกลับไปใช้เนื้อหาในโค้ด</span>
          </div>
          <ConfirmDeleteButton
            action={trashDocument}
            fields={{ id: hydrated.document.id, returnTo: "/crm/cms" }}
            itemName={hydrated.document.title}
            eyebrow="Content"
            title="ย้ายเข้าถังขยะ"
            message={`ยืนยันย้าย “${hydrated.document.title}” เข้าถังขยะ?`}
            buttonLabel="ลบหน้าเพจ"
            confirmLabel="ลบหน้าเพจ"
            className="kpi-button crm-users-delete-btn"
          />
        </div>
      </div>
    );
  }

  if (revenue) {
    const hydrated = await editorStateForDocument(id);
    if (!hydrated) notFound();
    return (
      <div className="crm-cms">
        <PageHeader
          eyebrow="Content Management"
          title={hydrated.document.title}
          description={path}
          actions={
            <div className="crm-cms-actions">
              <Link href="/crm/cms" className="crm-users-secondary">
                ← หน้าเพจทั้งหมด
              </Link>
              <Link href={`/crm/cms/pages/${hydrated.document.id}/preview`} className="crm-users-secondary">
                ดูตัวอย่าง
              </Link>
            </div>
          }
        />
        <RevenuePageEditor
          initial={hydrated.state}
          notice={saved === "1" ? "บันทึกแล้ว" : undefined}
          error={error}
          saveAction={saveRevenuePage}
          updatedAt={hydrated.document.updatedAt.toISOString()}
          initialTab={tab}
          previewHref={`/crm/cms/pages/${hydrated.document.id}/preview`}
          publicHref={path}
        />
        <div className="crm-cms-editor-danger">
          <div>
            <p>ลบหน้าเพจ</p>
            <span>ย้ายเข้าถังขยะ หน้าสาธารณะจะกลับไปใช้เนื้อหาในโค้ด</span>
          </div>
          <ConfirmDeleteButton
            action={trashDocument}
            fields={{ id: hydrated.document.id, returnTo: "/crm/cms" }}
            itemName={hydrated.document.title}
            eyebrow="Content"
            title="ย้ายเข้าถังขยะ"
            message={`ยืนยันย้าย “${hydrated.document.title}” เข้าถังขยะ?`}
            buttonLabel="ลบหน้าเพจ"
            confirmLabel="ลบหน้าเพจ"
            className="kpi-button crm-users-delete-btn"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="crm-cms">
      <PageHeader
        eyebrow="Content Management"
        title={document.title}
        description={path}
        actions={
          <div className="crm-cms-actions">
            <Link href="/crm/cms" className="crm-users-secondary">
              ← หน้าเพจทั้งหมด
            </Link>
            {document.status === "published" ? (
              <a href={path} className="crm-users-secondary" target="_blank" rel="noreferrer">
                เปิดดู
              </a>
            ) : null}
          </div>
        }
      />
      <CmsDocumentForm kind="page" document={document} error={error} saved={saved === "1"} />
      <div className="crm-cms-editor-danger">
        <div>
          <p>ลบหน้าเพจ</p>
          <span>ย้ายเข้าถังขยะ หน้านี้จะไม่แสดงบนเว็บ</span>
        </div>
        <ConfirmDeleteButton
          action={trashDocument}
          fields={{ id: document.id, returnTo: "/crm/cms" }}
          itemName={document.title}
          eyebrow="Content"
          title="ย้ายเข้าถังขยะ"
          message={`ยืนยันย้าย “${document.title}” เข้าถังขยะ?`}
          buttonLabel="ลบหน้าเพจ"
          confirmLabel="ลบหน้าเพจ"
          className="kpi-button crm-users-delete-btn"
        />
      </div>
    </div>
  );
}
