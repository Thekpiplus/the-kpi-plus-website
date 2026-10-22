import { Clock, Mail, MapPin, MessageCircle, Phone } from "@/components/Icons";
import {
  formatPhoneDisplay,
  isHttpUrl,
  mailtoHref,
  telHref,
  whatsappHrefFromNumber,
  type ContactInfo,
  type ContactSocialLink,
} from "@/lib/company";
import type { Locale } from "@/lib/seo";

const copy = {
  th: {
    address: "ที่อยู่",
    phone: "โทร",
    email: "อีเมล",
    whatsapp: "WhatsApp",
    maps: "Google Maps",
    hours: "เวลาทำการ",
    social: "ช่องทางอื่น",
  },
  en: {
    address: "Address",
    phone: "Phone",
    email: "Email",
    whatsapp: "WhatsApp",
    maps: "Google Maps",
    hours: "Hours",
    social: "Other channels",
  },
  ru: {
    address: "Адрес",
    phone: "Телефон",
    email: "Email",
    whatsapp: "WhatsApp",
    maps: "Google Maps",
    hours: "Часы работы",
    social: "Другие каналы",
  },
  zh: {
    address: "地址",
    phone: "電話",
    email: "電郵",
    whatsapp: "WhatsApp",
    maps: "Google Maps",
    hours: "營業時間",
    social: "其他渠道",
  },
} as const;

const SOCIAL_ICONS: Record<string, string> = {
  LINE: "/brand/line/line.svg",
  Facebook: "/brand/meta/facebook.svg",
  Instagram: "/brand/meta/instagram.svg",
  LinkedIn: "/brand/linkedin/linkedin.svg",
  TikTok: "/brand/tiktok/tiktok.svg",
};

export type ContactCardVariant = "hero" | "section" | "footer" | "preview";

function present(value: string | undefined) {
  return Boolean(value?.trim());
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="kpi-contact-card-row">
      <span className="kpi-contact-card-icon" aria-hidden="true">
        {icon}
      </span>
      <div className="kpi-contact-card-copy">
        <span className="kpi-contact-card-label">{label}</span>
        {children}
      </div>
    </div>
  );
}

function SocialRow({
  label,
  links,
}: {
  label: string;
  links: ContactSocialLink[];
}) {
  if (!links.length) return null;
  return (
    <div className="kpi-contact-card-row kpi-contact-card-socials">
      <span className="kpi-contact-card-label">{label}</span>
      <ul>
        {links.map((item) => (
          <li key={item.href}>
            <a href={item.href} aria-label={item.name}>
              {SOCIAL_ICONS[item.name] ? (
                <img src={SOCIAL_ICONS[item.name]} alt="" width={20} height={20} />
              ) : (
                item.name
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ContactCard({
  contact,
  locale,
  variant = "section",
  eyebrow,
  headingId,
  showName = true,
  showSocials = true,
}: {
  contact: ContactInfo;
  locale: Locale;
  variant?: ContactCardVariant;
  eyebrow?: string;
  headingId?: string;
  showName?: boolean;
  showSocials?: boolean;
}) {
  const t = copy[locale] ?? copy.en;
  const directOnly = variant === "hero";
  const phone = formatPhoneDisplay(contact.phone);
  const secondaryPhone = formatPhoneDisplay(contact.secondaryPhone);
  const phoneLink = telHref(phone);
  const secondaryLink = telHref(secondaryPhone);
  const email = contact.email?.trim() ?? "";
  const emailLink = mailtoHref(email);
  const address = contact.address?.trim() ?? "";
  const maps = isHttpUrl(contact.googleMapsUrl) ? contact.googleMapsUrl!.trim() : "";
  const hours = contact.businessHours?.trim() ?? "";
  const whatsappHref = whatsappHrefFromNumber(contact.whatsappNumber);
  const whatsappLabel = formatPhoneDisplay(contact.whatsappNumber) || t.whatsapp;
  const socialLinks = (contact.socialLinks ?? []).filter((item) => item.name && isHttpUrl(item.href));
  const companyName = contact.companyName?.trim() ?? "";
  const heading = showName && companyName ? companyName : "";

  const Tag = variant === "footer" ? "div" : "aside";
  const locationRow = address ? (
    <Row icon={<MapPin />} label={t.address}>
      {maps ? (
        <a href={maps} className="kpi-contact-card-value">
          {address}
        </a>
      ) : (
        <p className="kpi-contact-card-value">{address}</p>
      )}
    </Row>
  ) : maps ? (
    <Row icon={<MapPin />} label={t.maps}>
      <a href={maps} className="kpi-contact-card-value">
        {t.maps}
      </a>
    </Row>
  ) : null;

  return (
    <Tag
      className={`kpi-contact-card kpi-contact-card--${variant}${variant === "hero" ? " kpi-contact-hero-card" : ""}`}
      aria-labelledby={headingId || undefined}
      aria-label={!headingId && heading ? heading : undefined}
    >
      {eyebrow ? (
        <p className={`kpi-contact-card-eyebrow${locale === "th" ? "" : " kpi-latin"}`}>{eyebrow}</p>
      ) : null}
      {heading ? (
        variant === "footer" ? (
          <p className="kpi-contact-card-title">{heading}</p>
        ) : (
          <h2 id={headingId} className="kpi-contact-card-title">
            {heading}
          </h2>
        )
      ) : null}

      <div className="kpi-contact-card-list">
        {directOnly ? (
          <>
            {phone && phoneLink ? (
              <Row icon={<Phone />} label={t.phone}>
                <a href={phoneLink} className="kpi-contact-card-value kpi-contact-card-primary kpi-latin">
                  {phone}
                </a>
              </Row>
            ) : null}
            {email && emailLink ? (
              <Row icon={<Mail />} label={t.email}>
                <a href={emailLink} className="kpi-contact-card-value kpi-latin">
                  {email}
                </a>
              </Row>
            ) : null}
            {whatsappHref ? (
              <Row icon={<MessageCircle />} label={t.whatsapp}>
                <a href={whatsappHref} className="kpi-contact-card-value kpi-latin">
                  {whatsappLabel}
                </a>
              </Row>
            ) : null}
            {locationRow}
          </>
        ) : (
          <>
            {address ? (
              <Row icon={<MapPin />} label={t.address}>
                {maps ? (
                  <a href={maps} className="kpi-contact-card-value">
                    {address}
                  </a>
                ) : (
                  <p className="kpi-contact-card-value">{address}</p>
                )}
              </Row>
            ) : maps ? (
              <Row icon={<MapPin />} label={t.maps}>
                <a href={maps} className="kpi-contact-card-value">
                  {t.maps}
                </a>
              </Row>
            ) : null}

            {phone && phoneLink ? (
              <Row icon={<Phone />} label={t.phone}>
                <a href={phoneLink} className="kpi-contact-card-value kpi-contact-card-primary kpi-latin">
                  {phone}
                </a>
              </Row>
            ) : null}

            {secondaryPhone && secondaryLink && secondaryPhone !== phone ? (
              <Row icon={<Phone />} label={t.phone}>
                <a href={secondaryLink} className="kpi-contact-card-value kpi-latin">
                  {secondaryPhone}
                </a>
              </Row>
            ) : null}

            {email && emailLink ? (
              <Row icon={<Mail />} label={t.email}>
                <a href={emailLink} className="kpi-contact-card-value kpi-latin">
                  {email}
                </a>
              </Row>
            ) : null}

            {whatsappHref ? (
              <Row icon={<MessageCircle />} label={t.whatsapp}>
                <a href={whatsappHref} className="kpi-contact-card-value kpi-latin">
                  {whatsappLabel}
                </a>
              </Row>
            ) : null}

            {hours ? (
              <Row icon={<Clock />} label={t.hours}>
                <p className="kpi-contact-card-value">{hours}</p>
              </Row>
            ) : null}

            {showSocials ? <SocialRow label={t.social} links={socialLinks} /> : null}
          </>
        )}
      </div>
    </Tag>
  );
}

export function hasContactDetails(contact: ContactInfo) {
  return (
    present(contact.address) ||
    present(contact.phone) ||
    present(contact.email) ||
    present(contact.whatsappNumber) ||
    present(contact.googleMapsUrl) ||
    present(contact.businessHours) ||
    Boolean(contact.socialLinks?.length)
  );
}
