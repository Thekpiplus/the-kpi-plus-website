import type { ReactNode } from "react";
import { Mail, MessageCircle, Phone } from "@/components/Icons";
import {
  formatPhoneDisplay,
  mailtoHref,
  telHref,
  whatsappHrefFromNumber,
  type ContactInfo,
} from "@/lib/company";
import type { Locale } from "@/lib/seo";

const copy = {
  th: {
    heading: "ช่องทางติดต่อ",
    help: "เลือกช่องทางที่สะดวกได้เลย",
    email: "อีเมล",
    phone: "โทร",
    whatsapp: "WhatsApp",
  },
  en: {
    heading: "Contact channels",
    help: "Choose the channel that works for you",
    email: "Email",
    phone: "Phone",
    whatsapp: "WhatsApp",
  },
} as const;

type ChannelItem = {
  key: "email" | "phone" | "whatsapp";
  label: string;
  value: string;
  href: string;
  icon: ReactNode;
};

function copyFor(locale: Locale) {
  return locale === "th" ? copy.th : copy.en;
}

function channelsFor(contact: ContactInfo, t: (typeof copy)["th"] | (typeof copy)["en"]): ChannelItem[] {
  const items: ChannelItem[] = [];
  const email = contact.email?.trim() ?? "";
  const emailLink = mailtoHref(email);
  const phone = formatPhoneDisplay(contact.phone);
  const phoneLink = telHref(phone);
  const whatsappHref = whatsappHrefFromNumber(contact.whatsappNumber);
  const whatsappLabel = formatPhoneDisplay(contact.whatsappNumber);

  if (email && emailLink) {
    items.push({
      key: "email",
      label: t.email,
      value: email,
      href: emailLink,
      icon: <Mail />,
    });
  }

  if (phone && phoneLink) {
    items.push({
      key: "phone",
      label: t.phone,
      value: phone,
      href: phoneLink,
      icon: <Phone />,
    });
  }

  if (whatsappHref && whatsappLabel) {
    items.push({
      key: "whatsapp",
      label: t.whatsapp,
      value: whatsappLabel,
      href: whatsappHref,
      icon: <MessageCircle />,
    });
  }

  return items;
}

export function ContactChannels({
  locale,
  contact,
}: {
  locale: Locale;
  contact: ContactInfo;
}) {
  const t = copyFor(locale);
  const items = channelsFor(contact, t);
  if (!items.length) return null;

  return (
    <section className="kpi-contact-channels" aria-labelledby="contact-channels-heading">
      <h2 id="contact-channels-heading" className="sr-only">
        {t.heading}
      </h2>
      <p className="kpi-contact-channels-help">{t.help}</p>
      <ul className="kpi-contact-channels-list">
        {items.map((item) => (
          <li key={item.key}>
            <a className="kpi-contact-channel" href={item.href}>
              <span className="kpi-contact-channel-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="kpi-contact-channel-copy">
                <span className="kpi-contact-channel-label">{item.label}</span>
                <span className={`kpi-contact-channel-value kpi-latin`}>{item.value}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
