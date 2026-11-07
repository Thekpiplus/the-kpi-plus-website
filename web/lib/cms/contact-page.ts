import { codeFaqsForRoute, type FaqItem } from "@/lib/faqs";
import type { Locale } from "@/lib/seo";

export const CONTACT_CMS_TEMPLATE = "contact-page";
export const CONTACT_PAGE_SLUG = "contact-us";
export const CONTACT_PAGE_ROUTE = "/contact-us";

export const CONTACT_CMS_INTENTS = ["save", "draft", "publish", "unpublish"] as const;
export type ContactCmsIntent = (typeof CONTACT_CMS_INTENTS)[number];

export type ContactLocalized = {
  th: string;
  en: string;
  ru: string;
  zh: string;
};

export type CmsContactPageStep = {
  id: string;
  title: ContactLocalized;
  body: ContactLocalized;
};

export type CmsContactFaq = {
  id: string;
  q: ContactLocalized;
  a: ContactLocalized;
};

export type CmsContactPage = {
  version: 1;
  template: typeof CONTACT_CMS_TEMPLATE;
  hero: {
    eyebrow: ContactLocalized;
    titleLead: ContactLocalized;
    titleRest: ContactLocalized;
    lead: ContactLocalized;
  };
  channels: {
    heading: ContactLocalized;
    help: ContactLocalized;
    emailLabel: ContactLocalized;
    phoneLabel: ContactLocalized;
    whatsappLabel: ContactLocalized;
  };
  location: {
    eyebrow: ContactLocalized;
    office: ContactLocalized;
    mapTitle: ContactLocalized;
    openMap: ContactLocalized;
    officePhotoAlt: ContactLocalized;
  };
  form: {
    title: ContactLocalized;
    body: ContactLocalized;
  };
  nextSteps: {
    title: ContactLocalized;
    steps: CmsContactPageStep[];
    realTeam: ContactLocalized;
    confidential: ContactLocalized;
  };
  faqs: CmsContactFaq[];
};

export type ContactPageCopy = {
  eyebrow: string;
  titleLead: string;
  titleRest: string;
  lead: string;
  channelsHeading: string;
  channelsHelp: string;
  emailLabel: string;
  phoneLabel: string;
  whatsappLabel: string;
  locationEyebrow: string;
  office: string;
  mapTitle: string;
  openMap: string;
  officePhotoAlt: string;
  formTitle: string;
  formBody: string;
  nextTitle: string;
  nextSteps: Array<{ num: string; title: string; body: string }>;
  realTeam: string;
  confidential: string;
};

export type ContactCmsSaveResult = { ok: true; id: string; intent: ContactCmsIntent } | { ok: false; error: string };

export type ContactEditorState = {
  documentId: string;
  title: string;
  status: string;
  seoTitle: string;
  metaDescription: string;
  content: CmsContactPage;
};

export function emptyLocalized(seed = ""): ContactLocalized {
  return { th: seed, en: seed, ru: seed, zh: seed };
}

export function pickLocalized(value: ContactLocalized | undefined, locale: Locale): string {
  if (!value) return "";
  const direct = value[locale]?.trim();
  if (direct) return direct;
  if (locale === "th") return value.th?.trim() || value.en?.trim() || "";
  return value.en?.trim() || value.th?.trim() || "";
}

export function localizeContactPage(content: CmsContactPage, locale: Locale): ContactPageCopy {
  return {
    eyebrow: pickLocalized(content.hero.eyebrow, locale),
    titleLead: pickLocalized(content.hero.titleLead, locale),
    titleRest: pickLocalized(content.hero.titleRest, locale),
    lead: pickLocalized(content.hero.lead, locale),
    channelsHeading: pickLocalized(content.channels.heading, locale),
    channelsHelp: pickLocalized(content.channels.help, locale),
    emailLabel: pickLocalized(content.channels.emailLabel, locale),
    phoneLabel: pickLocalized(content.channels.phoneLabel, locale),
    whatsappLabel: pickLocalized(content.channels.whatsappLabel, locale),
    locationEyebrow: pickLocalized(content.location.eyebrow, locale),
    office: pickLocalized(content.location.office, locale),
    mapTitle: pickLocalized(content.location.mapTitle, locale),
    openMap: pickLocalized(content.location.openMap, locale),
    officePhotoAlt: pickLocalized(content.location.officePhotoAlt, locale),
    formTitle: pickLocalized(content.form.title, locale),
    formBody: pickLocalized(content.form.body, locale),
    nextTitle: pickLocalized(content.nextSteps.title, locale),
    nextSteps: content.nextSteps.steps.map((step, index) => ({
      num: String(index + 1),
      title: pickLocalized(step.title, locale),
      body: pickLocalized(step.body, locale),
    })),
    realTeam: pickLocalized(content.nextSteps.realTeam, locale),
    confidential: pickLocalized(content.nextSteps.confidential, locale),
  };
}

function asLocalized(value: unknown, fallback: ContactLocalized = emptyLocalized()): ContactLocalized {
  if (!value || typeof value !== "object") return { ...fallback };
  const row = value as Partial<ContactLocalized>;
  return {
    th: typeof row.th === "string" ? row.th : fallback.th,
    en: typeof row.en === "string" ? row.en : fallback.en,
    ru: typeof row.ru === "string" ? row.ru : fallback.ru,
    zh: typeof row.zh === "string" ? row.zh : fallback.zh,
  };
}

export function isContactCmsBody(raw: string): boolean {
  try {
    const parsed = JSON.parse(raw) as { template?: string; version?: number };
    return parsed?.template === CONTACT_CMS_TEMPLATE && parsed?.version === 1;
  } catch {
    return false;
  }
}

export function parseContactPageBody(raw: string): CmsContactPage | null {
  try {
    const parsed = JSON.parse(raw) as Partial<CmsContactPage> & { template?: string; version?: number };
    if (parsed.template !== CONTACT_CMS_TEMPLATE || parsed.version !== 1) return null;
    const fallback = defaultContactCms();
    return {
      version: 1,
      template: CONTACT_CMS_TEMPLATE,
      hero: {
        eyebrow: asLocalized(parsed.hero?.eyebrow, fallback.hero.eyebrow),
        titleLead: asLocalized(parsed.hero?.titleLead, fallback.hero.titleLead),
        titleRest: asLocalized(parsed.hero?.titleRest, fallback.hero.titleRest),
        lead: asLocalized(parsed.hero?.lead, fallback.hero.lead),
      },
      channels: {
        heading: asLocalized(parsed.channels?.heading, fallback.channels.heading),
        help: asLocalized(parsed.channels?.help, fallback.channels.help),
        emailLabel: asLocalized(parsed.channels?.emailLabel, fallback.channels.emailLabel),
        phoneLabel: asLocalized(parsed.channels?.phoneLabel, fallback.channels.phoneLabel),
        whatsappLabel: asLocalized(parsed.channels?.whatsappLabel, fallback.channels.whatsappLabel),
      },
      location: {
        eyebrow: asLocalized(parsed.location?.eyebrow, fallback.location.eyebrow),
        office: asLocalized(parsed.location?.office, fallback.location.office),
        mapTitle: asLocalized(parsed.location?.mapTitle, fallback.location.mapTitle),
        openMap: asLocalized(parsed.location?.openMap, fallback.location.openMap),
        officePhotoAlt: asLocalized(parsed.location?.officePhotoAlt, fallback.location.officePhotoAlt),
      },
      form: {
        title: asLocalized(parsed.form?.title, fallback.form.title),
        body: asLocalized(parsed.form?.body, fallback.form.body),
      },
      nextSteps: {
        title: asLocalized(parsed.nextSteps?.title, fallback.nextSteps.title),
        steps: Array.isArray(parsed.nextSteps?.steps) && parsed.nextSteps.steps.length
          ? parsed.nextSteps.steps.map((step, index) => ({
              id: typeof step?.id === "string" && step.id ? step.id : `step-${index + 1}`,
              title: asLocalized(step?.title, fallback.nextSteps.steps[index]?.title ?? emptyLocalized()),
              body: asLocalized(step?.body, fallback.nextSteps.steps[index]?.body ?? emptyLocalized()),
            }))
          : fallback.nextSteps.steps,
        realTeam: asLocalized(parsed.nextSteps?.realTeam, fallback.nextSteps.realTeam),
        confidential: asLocalized(parsed.nextSteps?.confidential, fallback.nextSteps.confidential),
      },
      faqs:
        Array.isArray(parsed.faqs) && parsed.faqs.length
          ? parsed.faqs.map((item, index) => ({
              id: typeof item?.id === "string" && item.id ? item.id : `faq-${index + 1}`,
              q: asLocalized(item?.q, fallback.faqs[index]?.q ?? emptyLocalized()),
              a: asLocalized(item?.a, fallback.faqs[index]?.a ?? emptyLocalized()),
            }))
          : fallback.faqs,
    };
  } catch {
    return null;
  }
}

export function serializeContactPageBody(content: CmsContactPage): string {
  return JSON.stringify(content);
}

export function isContactPageDocument(doc: { template?: string; slug?: string } | null | undefined) {
  if (!doc) return false;
  return doc.template === CONTACT_CMS_TEMPLATE || doc.slug === CONTACT_PAGE_SLUG || doc.slug === "contact";
}

export function newContactStepId() {
  return `step_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function newContactFaqId() {
  return `faq_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function contactFaqsForLocale(content: CmsContactPage, locale: Locale): FaqItem[] {
  return content.faqs
    .map((item) => ({
      q: pickLocalized(item.q, locale),
      a: pickLocalized(item.a, locale),
    }))
    .filter((item) => item.q || item.a);
}

function seedContactFaqs(): CmsContactFaq[] {
  const th = codeFaqsForRoute("/contact-us");
  const en = codeFaqsForRoute("/en/contact-us");
  const ru = codeFaqsForRoute("/ru/contact-us");
  const zh = codeFaqsForRoute("/zh/contact-us");
  const length = Math.max(th.length, en.length, ru.length, zh.length, 1);
  return Array.from({ length }, (_, index) => ({
    id: `faq-${index + 1}`,
    q: {
      th: th[index]?.q ?? "",
      en: en[index]?.q ?? "",
      ru: ru[index]?.q ?? "",
      zh: zh[index]?.q ?? "",
    },
    a: {
      th: th[index]?.a ?? "",
      en: en[index]?.a ?? "",
      ru: ru[index]?.a ?? "",
      zh: zh[index]?.a ?? "",
    },
  }));
}

export function defaultContactCms(): CmsContactPage {
  return {
    version: 1,
    template: CONTACT_CMS_TEMPLATE,
    hero: {
      eyebrow: {
        th: "เริ่มต้นบทสนทนา",
        en: "Start the conversation",
        ru: "Начать разговор",
        zh: "開始對話",
      },
      titleLead: {
        th: "เห็นข้อมูลให้ชัด",
        en: "Find the signal.",
        ru: "Find the signal.",
        zh: "Find the signal.",
      },
      titleRest: {
        th: "แล้วเลือกสิ่งที่ควรทำต่อ",
        en: "Make the move.",
        ru: "Make the move.",
        zh: "Make the move.",
      },
      lead: {
        th: "พูดคุยกับ เดอะ เคพีไอ พลัส เรื่องรายได้ Demand การจองตรง การมองเห็นบนออนไลน์ เทคโนโลยี และการลงมือทำเพื่อเพิ่มรายได้และการเติบโตของโรงแรม",
        en: "Contact The KPI Plus for a focused conversation about hotel revenue, demand, direct booking, local presence, technology, and commercial execution.",
        ru: "Свяжитесь с The KPI Plus, чтобы обсудить доход отеля, спрос, прямые бронирования, локальный поиск, технологии и коммерческое исполнение.",
        zh: "聯絡 The KPI Plus，討論酒店收益、需求、直訂、在地搜尋、科技與商業執行。",
      },
    },
    channels: {
      heading: {
        th: "ช่องทางติดต่อ",
        en: "Contact channels",
        ru: "Contact channels",
        zh: "Contact channels",
      },
      help: {
        th: "เลือกช่องทางที่สะดวกได้เลย",
        en: "Choose the channel that works for you",
        ru: "Choose the channel that works for you",
        zh: "Choose the channel that works for you",
      },
      emailLabel: { th: "อีเมล", en: "Email", ru: "Email", zh: "電郵" },
      phoneLabel: { th: "โทร", en: "Phone", ru: "Телефон", zh: "電話" },
      whatsappLabel: { th: "WhatsApp", en: "WhatsApp", ru: "WhatsApp", zh: "WhatsApp" },
    },
    location: {
      eyebrow: {
        th: "ที่ตั้งสำนักงาน",
        en: "Location",
        ru: "Location",
        zh: "Location",
      },
      office: {
        th: "เดอะ เคพีไอ พลัส, ภูเก็ต",
        en: "The KPI Plus, Phuket",
        ru: "The KPI Plus, Пхукет",
        zh: "The KPI Plus，普吉",
      },
      mapTitle: {
        th: "แผนที่สำนักงาน เดอะ เคพีไอ พลัส",
        en: "Map of The KPI Plus office",
        ru: "Карта офиса The KPI Plus",
        zh: "The KPI Plus 辦公室地圖",
      },
      openMap: {
        th: "เปิดใน Google Maps",
        en: "Open in Google Maps",
        ru: "Открыть в Google Maps",
        zh: "在 Google Maps 開啟",
      },
      officePhotoAlt: {
        th: "สำนักงาน เดอะ เคพีไอ พลัส",
        en: "The KPI Plus office",
        ru: "Офис The KPI Plus",
        zh: "The KPI Plus 辦公室",
      },
    },
    form: {
      title: {
        th: "ส่งข้อความถึงทีม",
        en: "Send a message to the team",
        ru: "Написать команде",
        zh: "傳送訊息給團隊",
      },
      body: {
        th: "กรอกเฉพาะข้อมูลที่จำเป็น ทีมจะติดต่อกลับเพื่อถามรายละเอียดต่อหากต้องการ",
        en: "Share only what is needed to start. The team will ask for more detail later if useful.",
        ru: "Укажите только необходимое для старта. Команда уточнит детали позже, если нужно.",
        zh: "先填啟動所需資料即可，若有需要團隊稍後再補問細節。",
      },
    },
    nextSteps: {
      title: {
        th: "หลังจากส่งข้อมูลแล้ว",
        en: "What happens next",
        ru: "What happens next",
        zh: "What happens next",
      },
      steps: [
        {
          id: "step-1",
          title: {
            th: "ส่งข้อมูลเบื้องต้น",
            en: "Send the basics",
            ru: "Send the basics",
            zh: "Send the basics",
          },
          body: {
            th: "กรอกเฉพาะข้อมูลที่จำเป็น เพื่อให้ทีมรู้ว่าควรติดต่อกลับอย่างไร",
            en: "Share the details needed so the team knows how to reach you.",
            ru: "Share the details needed so the team knows how to reach you.",
            zh: "Share the details needed so the team knows how to reach you.",
          },
        },
        {
          id: "step-2",
          title: {
            th: "ทีมงานตรวจสอบความต้องการ",
            en: "The team reviews the request",
            ru: "The team reviews the request",
            zh: "The team reviews the request",
          },
          body: {
            th: "ทีมอ่านข้อมูลที่ส่งมา และดูว่าโรงแรมต้องการความช่วยเหลือด้านใด",
            en: "They read what you sent and what the hotel needs help with.",
            ru: "They read what you sent and what the hotel needs help with.",
            zh: "They read what you sent and what the hotel needs help with.",
          },
        },
        {
          id: "step-3",
          title: {
            th: "นัดพูดคุยหรือแนะนำขั้นตอนถัดไป",
            en: "Talk or agree the next step",
            ru: "Talk or agree the next step",
            zh: "Talk or agree the next step",
          },
          body: {
            th: "ทีมจะติดต่อกลับเพื่อนัดคุย หรือแนะนำสิ่งที่ควรทำต่อ",
            en: "The team will get in touch to talk, or suggest what to do next.",
            ru: "The team will get in touch to talk, or suggest what to do next.",
            zh: "The team will get in touch to talk, or suggest what to do next.",
          },
        },
      ],
      realTeam: {
        th: "ตอบกลับโดยทีมงานจริง",
        en: "A real team member replies",
        ru: "A real team member replies",
        zh: "A real team member replies",
      },
      confidential: {
        th: "ข้อมูลของคุณเป็นความลับ",
        en: "Your information is kept confidential",
        ru: "Your information is kept confidential",
        zh: "Your information is kept confidential",
      },
    },
    faqs: seedContactFaqs(),
  };
}
