"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import { hasModule } from "@/lib/crm/modules";
import { isFullAccessRole } from "@/lib/crm/roles";
import { pages } from "@/lib/seo";
import { documentPath } from "./body";
import {
  CONTACT_CMS_INTENTS,
  CONTACT_CMS_TEMPLATE,
  CONTACT_PAGE_ROUTE,
  CONTACT_PAGE_SLUG,
  contactFaqsForLocale,
  defaultContactCms,
  isContactCmsBody,
  isContactPageDocument,
  parseContactPageBody,
  serializeContactPageBody,
  type ContactCmsIntent,
  type ContactCmsSaveResult,
  type ContactEditorState,
  type CmsContactPage,
} from "./contact-page";
import { saveFaqSet } from "./faq-store";
import { cmsDb, documentById, pageDocumentBySlug, refreshCmsFiles } from "./queries";
import type { CmsDocumentRow } from "./types";
import type { Locale } from "@/lib/seo";

async function requireCms() {
  const user = await requireUser();
  if (!isFullAccessRole(user.role) && !hasModule(user, "cms")) redirect("/crm?error=forbidden");
  return user;
}

function asIntent(value: unknown): ContactCmsIntent {
  return CONTACT_CMS_INTENTS.includes(value as ContactCmsIntent) ? (value as ContactCmsIntent) : "save";
}

function applyIntent(status: string, intent: ContactCmsIntent) {
  if (intent === "draft" || intent === "unpublish") return "draft";
  if (intent === "publish") return "published";
  return status === "published" ? "published" : status || "draft";
}

function revalidateContact(doc: Pick<CmsDocumentRow, "slug" | "locale" | "kind">) {
  const path = documentPath(doc);
  revalidatePath("/crm/cms");
  revalidatePath("/crm/cms/pages");
  revalidatePath("/crm/cms/contact-us");
  revalidatePath("/", "layout");
  revalidatePath(CONTACT_PAGE_ROUTE);
  revalidatePath("/en/contact-us");
  revalidatePath("/ru/contact-us");
  revalidatePath("/zh/contact-us");
  revalidatePath(path);
  revalidatePath(path, "page");
}

export async function hydrateContactDocument(doc: CmsDocumentRow) {
  if (!isContactPageDocument(doc)) return doc;
  const parsed = isContactCmsBody(doc.body) ? parseContactPageBody(doc.body) : null;
  if (doc.template === CONTACT_CMS_TEMPLATE && parsed) return doc;
  const content = parsed ?? defaultContactCms();
  const db = await cmsDb();
  return db.cmsDocument.update({
    where: { id: doc.id },
    data: {
      template: CONTACT_CMS_TEMPLATE,
      slug: CONTACT_PAGE_SLUG,
      body: serializeContactPageBody(content),
    },
  });
}

export async function editorStateForContactDocument(id: string): Promise<ContactEditorState | null> {
  const existing = await documentById(id);
  if (!existing || existing.kind !== "page") return null;
  const doc = await hydrateContactDocument(existing);
  const content = parseContactPageBody(doc.body) ?? defaultContactCms();
  return {
    documentId: doc.id,
    title: doc.title,
    status: doc.status,
    seoTitle: doc.seoTitle,
    metaDescription: doc.metaDescription,
    content,
  };
}

export async function saveContactPage(formData: FormData): Promise<ContactCmsSaveResult> {
  const user = await requireCms();
  const id = String(formData.get("id") ?? "");
  const intent = asIntent(formData.get("intent"));
  const existing = id ? await documentById(id) : null;
  if (!existing || existing.kind !== "page") return { ok: false, error: "missing" };

  const parsed = parseContactPageBody(String(formData.get("contentJson") ?? ""));
  if (!parsed) return { ok: false, error: "invalid_json" };
  const content: CmsContactPage = parsed;

  const seoTitle = String(formData.get("seoTitle") ?? "").trim();
  const metaDescription = String(formData.get("metaDescription") ?? "").trim();
  if (intent === "publish" && (!seoTitle || !metaDescription)) return { ok: false, error: "required_fields" };

  const nextStatus = applyIntent(existing.status, intent);
  const published = nextStatus === "published";
  const title = String(formData.get("title") ?? existing.title).trim() || content.hero.titleLead.th;
  const excerpt = String(formData.get("excerpt") ?? "").trim() || metaDescription || content.hero.lead.th;
  const db = await cmsDb();
  const saved = await db.cmsDocument.update({
    where: { id: existing.id },
    data: {
      title,
      slug: CONTACT_PAGE_SLUG,
      locale: "th",
      status: nextStatus,
      template: CONTACT_CMS_TEMPLATE,
      excerpt,
      body: serializeContactPageBody(content),
      seoTitle,
      metaDescription,
      publishedAt: published ? existing.publishedAt ?? new Date() : null,
      scheduledAt: null,
      updatedBy: user.email,
    },
  });

  const locales: Locale[] = ["th", "en", "ru", "zh"];
  for (const locale of locales) {
    const route = locale === "th" ? CONTACT_PAGE_ROUTE : `/${locale}${CONTACT_PAGE_ROUTE}`;
    await saveFaqSet(route, contactFaqsForLocale(content, locale), user.id).catch(() => undefined);
    revalidatePath(`/crm/cms/faqs/edit?route=${encodeURIComponent(route)}`);
  }
  revalidatePath("/crm/cms/faqs");

  await refreshCmsFiles();
  revalidateContact(saved);
  revalidatePath(`/crm/cms/pages/${saved.id}`);
  return { ok: true, id: saved.id, intent };
}

export async function ensureContactPageFromSite() {
  const user = await requireCms();
  const existing = await pageDocumentBySlug(CONTACT_PAGE_SLUG, "th");
  const db = await cmsDb();
  if (existing) {
    if (existing.trashedAt) {
      await db.cmsDocument.update({
        where: { id: existing.id },
        data: { trashedAt: null, updatedBy: user.email },
      });
    }
    const hydrated = await hydrateContactDocument(existing);
    return hydrated.id;
  }

  const sitePage = pages.find((page) => page.route === CONTACT_PAGE_ROUTE && page.language === "th");
  const content = defaultContactCms();
  const created = await db.cmsDocument.create({
    data: {
      kind: "page",
      title: sitePage?.title || "ติดต่อเรา",
      slug: CONTACT_PAGE_SLUG,
      locale: "th",
      status: "published",
      template: CONTACT_CMS_TEMPLATE,
      excerpt: sitePage?.description || content.hero.lead.th,
      body: serializeContactPageBody(content),
      seoTitle: sitePage?.title || "ติดต่อเรา",
      metaDescription: sitePage?.description || content.hero.lead.th,
      canonical: CONTACT_PAGE_ROUTE,
      author: user.email,
      updatedBy: user.email,
      publishedAt: new Date(),
    },
  });
  await refreshCmsFiles();
  revalidateContact(created);
  return created.id;
}
