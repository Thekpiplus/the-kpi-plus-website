import Link from "next/link";
import { notFound } from "next/navigation";
import { B2bView } from "@/components/B2bView";
import { GoogleAdsView } from "@/components/GoogleAdsView";
import { MetaAdsView } from "@/components/MetaAdsView";
import { SeoLocalView } from "@/components/SeoLocalView";
import { ConversionView } from "@/components/ConversionView";
import { IndependentHotelView } from "@/components/IndependentHotelView";
import { WebsiteView } from "@/components/WebsiteView";
import { ReservationsView } from "@/components/ReservationsView";
import { RevenueView } from "@/components/RevenueView";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { loadB2bPagePreview } from "@/lib/cms/b2b-page-public";
import { isB2bPageDocument } from "@/lib/cms/b2b-page";
import { loadGoogleAdsPagePreview } from "@/lib/cms/google-ads-page-public";
import { isGoogleAdsPageDocument } from "@/lib/cms/google-ads-page";
import { loadMetaAdsPagePreview } from "@/lib/cms/meta-ads-page-public";
import { isMetaAdsPageDocument } from "@/lib/cms/meta-ads-page";
import { isHotelSeoPageDocument } from "@/lib/cms/hotel-seo-page";
import { loadHotelSeoPagePreview } from "@/lib/cms/hotel-seo-page-public";
import { isHotelWebsitePageDocument } from "@/lib/cms/hotel-website-page";
import { loadHotelWebsitePagePreview } from "@/lib/cms/hotel-website-page-public";
import { isHotelDirectBookingsPageDocument } from "@/lib/cms/hotel-direct-bookings-page";
import { loadDirectBookingPagePreview } from "@/lib/cms/hotel-direct-bookings-page-public";
import { isIndependentHotelPageDocument } from "@/lib/cms/independent-hotel-page";
import { loadIndependentHotelPagePreview } from "@/lib/cms/independent-hotel-page-public";
import { loadReservationsPagePreview } from "@/lib/cms/reservations-page-public";
import { isReservationsPageDocument } from "@/lib/cms/reservations-page";
import { loadRevenuePagePreview } from "@/lib/cms/revenue-page-public";
import { isRevenuePageDocument } from "@/lib/cms/revenue-page";
import { documentById } from "@/lib/cms/queries";
import { documentPath } from "@/lib/cms/body";

export default async function PreviewCmsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const document = await documentById(id);
  if (!document || document.kind !== "page" || document.trashedAt) notFound();

  const reservations = isReservationsPageDocument(document);
  const revenue = isRevenuePageDocument(document);
  const b2b = isB2bPageDocument(document);
  const googleAds = isGoogleAdsPageDocument(document);
  const metaAds = isMetaAdsPageDocument(document);
  const hotelSeo = isHotelSeoPageDocument(document);
  const hotelWebsite = isHotelWebsitePageDocument(document);
  const hotelDirectBookings = isHotelDirectBookingsPageDocument(document);
  const independentHotel = isIndependentHotelPageDocument(document);
  if (!reservations && !revenue && !b2b && !googleAds && !metaAds && !hotelSeo && !hotelWebsite && !hotelDirectBookings && !independentHotel) notFound();

  const preview = reservations ? await loadReservationsPagePreview(id) : null;
  const revenuePreview = revenue ? await loadRevenuePagePreview(id) : null;
  const b2bPreview = b2b ? await loadB2bPagePreview(id) : null;
  const adsPreview = googleAds ? await loadGoogleAdsPagePreview(id) : null;
  const metaPreview = metaAds ? await loadMetaAdsPagePreview(id) : null;
  const hotelSeoPreview = hotelSeo ? await loadHotelSeoPagePreview(id) : null;
  const hotelWebsitePreview = hotelWebsite ? await loadHotelWebsitePagePreview(id) : null;
  const hotelDirectBookingsPreview = hotelDirectBookings ? await loadDirectBookingPagePreview(id) : null;
  const independentHotelPreview = independentHotel ? await loadIndependentHotelPagePreview(id) : null;
  const live =
    preview?.live ??
    revenuePreview?.live ??
    b2bPreview?.live ??
    adsPreview?.live ??
    metaPreview?.live ??
    hotelSeoPreview?.live ??
    hotelWebsitePreview?.live ??
    hotelDirectBookingsPreview?.live ??
    independentHotelPreview?.live ??
    false;
  if (!preview && !revenuePreview && !b2bPreview && !adsPreview && !metaPreview && !hotelSeoPreview && !hotelWebsitePreview && !hotelDirectBookingsPreview && !independentHotelPreview) notFound();
  const path = documentPath(document);
  const title = reservations
    ? "ตัวอย่างหน้า Outsourced Hotel Reservations"
    : b2b
      ? "ตัวอย่างหน้า B2B Agent Sales"
      : googleAds
        ? "ตัวอย่างหน้า Google Ads Management"
        : metaAds
          ? "ตัวอย่างหน้า Meta Ads Management"
          : hotelSeo
            ? "ตัวอย่างหน้า Hotel SEO, Google Maps และ AI Search"
          : hotelWebsite
            ? "ตัวอย่างหน้า Hotel Website Design"
          : hotelDirectBookings
            ? "ตัวอย่างหน้า Hotel Direct Bookings"
          : independentHotel
            ? "ตัวอย่างหน้า Independent Hotel Management"
          : "ตัวอย่างหน้า Revenue & Commercial";

  return (
    <div className="crm-cms crm-cs-preview">
      <PageHeader
        eyebrow="Content Management"
        title={title}
        description={live ? "มุมมองสาธารณะของหน้าที่เผยแพร่แล้ว" : "ตัวอย่างในระบบ — ยังไม่แทนที่เนื้อหาในโค้ดบนเว็บสาธารณะ"}
        actions={
          <div className="crm-cms-actions">
            <Link href={`/crm/cms/pages/${document.id}`} className="crm-users-secondary">
              ← กลับไปแก้ไข
            </Link>
            <Link href="/crm/cms" className="crm-users-secondary">
              หน้าเพจทั้งหมด
            </Link>
          </div>
        }
      />
      <p className={`crm-users-alert ${live ? "is-ok" : "is-warn"}`} role="status">
        {live
          ? `หน้านี้อยู่ในสถานะ Published และจะแสดงบน ${path}`
          : "บันทึกแล้ว — ตัวอย่างนี้ยังไม่เป็นสาธารณะ จนกว่าจะเผยแพร่"}
      </p>
      <div className="crm-cs-preview-frame">
        {preview ? (
          <ReservationsView locale={preview.locale} previewContent={preview.content} embedded />
        ) : revenuePreview ? (
          <RevenueView locale={revenuePreview.locale} previewContent={revenuePreview.content} embedded />
        ) : b2bPreview ? (
          <B2bView locale={b2bPreview.locale} previewContent={b2bPreview.content} embedded />
        ) : adsPreview ? (
          <GoogleAdsView locale={adsPreview.locale} previewContent={adsPreview.content} embedded />
        ) : metaPreview ? (
          <MetaAdsView locale={metaPreview.locale} previewContent={metaPreview.content} embedded />
        ) : hotelSeoPreview ? (
          <SeoLocalView
            locale={hotelSeoPreview.locale === "en" || hotelSeoPreview.locale === "ru" || hotelSeoPreview.locale === "zh" ? hotelSeoPreview.locale : "th"}
            previewContent={hotelSeoPreview.content}
            embedded
          />
        ) : hotelWebsitePreview ? (
          <WebsiteView
            locale={hotelWebsitePreview.locale === "en" || hotelWebsitePreview.locale === "ru" || hotelWebsitePreview.locale === "zh" ? hotelWebsitePreview.locale : "th"}
            previewContent={hotelWebsitePreview.content}
            embedded
          />
        ) : hotelDirectBookingsPreview ? (
          <ConversionView
            locale={hotelDirectBookingsPreview.locale === "en" || hotelDirectBookingsPreview.locale === "ru" || hotelDirectBookingsPreview.locale === "zh" ? hotelDirectBookingsPreview.locale : "th"}
            previewContent={hotelDirectBookingsPreview.content}
            embedded
          />
        ) : independentHotelPreview ? (
          <IndependentHotelView
            locale={independentHotelPreview.locale === "en" || independentHotelPreview.locale === "ru" || independentHotelPreview.locale === "zh" ? independentHotelPreview.locale : "th"}
            previewContent={independentHotelPreview.content}
            embedded
          />
        ) : null}
      </div>
    </div>
  );
}
