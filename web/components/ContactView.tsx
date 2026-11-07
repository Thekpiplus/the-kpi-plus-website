import { ContactCard } from "@/components/ContactCard";
import { ContactChannels } from "@/components/ContactChannels";
import { ContactEnquiryForm } from "@/components/ContactEnquiryForm";
import { ContactLocationMap } from "@/components/ContactLocationMap";
import { ContactNextSteps } from "@/components/ContactNextSteps";
import { HeroCta } from "@/components/HeroCta";
import { SiteShell } from "@/components/SiteShell";
import { loadContactPageCopy } from "@/lib/cms/contact-page-public";
import { COMPANY, contactInfoFromCompany } from "@/lib/company";
import { getPublicCompany } from "@/lib/company-public";
import { localizePath, type Locale } from "@/lib/seo";

export async function ContactView({ locale }: { locale: Locale }) {
  const t = await loadContactPageCopy(locale);
  const company = await getPublicCompany();
  const contact = contactInfoFromCompany(company, locale);
  const isTh = locale === "th";
  const officePhoto = company.officePhoto?.trim() || COMPANY.officePhoto;
  const officePhotoAlt = company.officePhotoAlt?.trim() || COMPANY.officePhotoAlt || t.officePhotoAlt;
  const addressAlt = isTh ? company.addressEn : company.addressTh;
  const showAddressAlt =
    Boolean(addressAlt?.trim()) &&
    addressAlt.trim().toLowerCase() !== (contact.address ?? "").trim().toLowerCase();

  return (
    <SiteShell locale={locale} route={localizePath("/contact-us", locale)}>
      <section className="kpi-hero kpi-home-hero-section kpi-contact-hero">
        <div className="kpi-wrap">
          <div className="kpi-home-hero kpi-contact-hero-grid">
            <div className="kpi-home-hero-copy">
              <p className={`kpi-home-eyebrow${isTh ? "" : " kpi-latin"}`}>{t.eyebrow}</p>
              <h1 className="kpi-h1 kpi-home-h1 kpi-contact-hero-title">
                <span className="kpi-home-h1-lead">{t.titleLead}</span>
                <span className="kpi-home-h1-rest kpi-home-accent">{t.titleRest}</span>
              </h1>
              <p className="kpi-lead kpi-home-lead">{t.lead}</p>
              <div className="kpi-actions">
                <HeroCta locale={locale} className="" />
              </div>
            </div>

            <div className="kpi-contact-hero-aside">
              <figure className="kpi-contact-hero-media">
                <img src={officePhoto} alt={officePhotoAlt} width={1200} height={900} />
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section className="kpi-contact-main">
        <div className="kpi-section kpi-contact-main-stack">
          <ContactChannels
            locale={locale}
            contact={contact}
            heading={t.channelsHeading}
            help={t.channelsHelp}
            emailLabel={t.emailLabel}
            phoneLabel={t.phoneLabel}
            whatsappLabel={t.whatsappLabel}
          />
          <div className="kpi-contact-main-grid">
            <div className="kpi-contact-location">
              <p className={`kpi-contact-eyebrow${isTh ? "" : " kpi-latin"}`}>{t.locationEyebrow}</p>
              <h2 className="kpi-h2 kpi-contact-h2">{t.office}</h2>
              <ContactLocationMap
                locale={locale}
                title={t.mapTitle}
                address={contact.address}
                addressAlt={showAddressAlt ? addressAlt : undefined}
                mapsUrl={contact.googleMapsUrl}
                embedSrc={company.mapsEmbed}
                openMapLabel={t.openMap}
              />
              <ContactCard locale={locale} contact={contact} variant="section" showAddress={false} />
            </div>

            <ContactEnquiryForm
              locale={locale}
              title={t.formTitle}
              body={t.formBody}
              email={contact.email}
              phone={contact.phone}
              sectionId="contact-enquiry"
            />
          </div>
        </div>
      </section>

      <ContactNextSteps
        locale={locale}
        contact={contact}
        title={t.nextTitle}
        steps={t.nextSteps}
        realTeam={t.realTeam}
        confidential={t.confidential}
      />
    </SiteShell>
  );
}
