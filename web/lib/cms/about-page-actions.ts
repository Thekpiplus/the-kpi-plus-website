"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import { hasModule } from "@/lib/crm/modules";
import { isFullAccessRole } from "@/lib/crm/roles";
import { pages } from "@/lib/seo";
import { documentPath } from "./body";
import {
  ABOUT_CMS_INTENTS,
  ABOUT_CMS_TEMPLATE,
  ABOUT_PAGE_ROUTE,
  ABOUT_PAGE_SLUG,
  aboutFaqsForLocale,
  defaultAboutCms,
  isAboutCmsBody,
  isAboutPageDocument,
  parseAboutPageBody,
  serializeAboutPageBody,
  type AboutCmsIntent,
  type AboutCmsSaveResult,
  type AboutEditorState,
  type CmsAboutPage,
} from "./about-page";
import { saveFaqSet } from "./faq-store";
import { cmsDb, documentById, pageDocumentBySlug, refreshCmsFiles } from "./queries";
import type { CmsDocumentRow } from "./types";
import type { Locale } from "@/lib/seo";

async function requireCms() {
  const user = await requireUser();
  if (!isFullAccessRole(user.role) && !hasModule(user, "cms")) redirect("/crm?error=forbidden");
  return user;
}

function asIntent(value: unknown): AboutCmsIntent {
  return ABOUT_CMS_INTENTS.includes(value as AboutCmsIntent) ? (value as AboutCmsIntent) : "save";
}

function applyIntent(status: string, intent: AboutCmsIntent) {
  if (intent === "draft" || intent === "unpublish") return "draft";
  if (intent === "publish") return "published";
  return status === "published" ? "published" : status || "draft";
}

function revalidateAbout(doc: Pick<CmsDocumentRow, "slug" | "locale" | "kind">) {
  const path = documentPath(doc);
  revalidatePath("/crm/cms");
  revalidatePath("/crm/cms/pages");
  revalidatePath("/crm/cms/about-us");
  revalidatePath("/", "layout");
  revalidatePath(ABOUT_PAGE_ROUTE);
  revalidatePath("/en/about-us");
  revalidatePath("/ru/about-us");
  revalidatePath("/zh/about-us");
  revalidatePath(path);
  revalidatePath(path, "page");
}

export async function hydrateAboutDocument(doc: CmsDocumentRow) {
  if (!isAboutPageDocument(doc)) return doc;
  const parsed = isAboutCmsBody(doc.body) ? parseAboutPageBody(doc.body) : null;
  if (doc.template === ABOUT_CMS_TEMPLATE && parsed) return doc;
  const content = parsed ?? defaultAboutCms();
  const db = await cmsDb();
  return db.cmsDocument.update({
    where: { id: doc.id },
    data: {
      template: ABOUT_CMS_TEMPLATE,
      slug: ABOUT_PAGE_SLUG,
      body: serializeAboutPageBody(content),
    },
  });
}

export async function editorStateForAboutDocument(id: string): Promise<AboutEditorState | null> {
  const existing = await documentById(id);
  if (!existing || existing.kind !== "page") return null;
  const doc = await hydrateAboutDocument(existing);
  const content = parseAboutPageBody(doc.body) ?? defaultAboutCms();
  return {
    documentId: doc.id,
    title: doc.title,
    status: doc.status,
    seoTitle: doc.seoTitle,
    metaDescription: doc.metaDescription,
    content,
  };
}

export async function saveAboutPage(formData: FormData): Promise<AboutCmsSaveResult> {
  const user = await requireCms();
  const id = String(formData.get("id") ?? "");
  const intent = asIntent(formData.get("intent"));
  const existing = id ? await documentById(id) : null;
  if (!existing || existing.kind !== "page") return { ok: false, error: "missing" };

  const parsed = parseAboutPageBody(String(formData.get("contentJson") ?? ""));
  if (!parsed) return { ok: false, error: "invalid_json" };
  const content: CmsAboutPage = parsed;

  const seoTitle = String(formData.get("seoTitle") ?? "").trim();
  const metaDescription = String(formData.get("metaDescription") ?? "").trim();
  if (intent === "publish" && (!seoTitle || !metaDescription)) return { ok: false, error: "required_fields" };

  const nextStatus = applyIntent(existing.status, intent);
  const published = nextStatus === "published";
  const title = String(formData.get("title") ?? existing.title).trim() || content.hero.h1.th;
  const excerpt = String(formData.get("excerpt") ?? "").trim() || metaDescription || content.hero.heroBody.th;
  const db = await cmsDb();
  const saved = await db.cmsDocument.update({
    where: { id: existing.id },
    data: {
      title,
      slug: ABOUT_PAGE_SLUG,
      locale: "th",
      status: nextStatus,
      template: ABOUT_CMS_TEMPLATE,
      excerpt,
      body: serializeAboutPageBody(content),
      seoTitle,
      metaDescription,
      publishedAt: published ? existing.publishedAt ?? new Date() : null,
      scheduledAt: null,
      updatedBy: user.email,
    },
  });

  const locales: Locale[] = ["th", "en", "ru", "zh"];
  for (const locale of locales) {
    const route = locale === "th" ? ABOUT_PAGE_ROUTE : `/${locale}${ABOUT_PAGE_ROUTE}`;
    await saveFaqSet(route, aboutFaqsForLocale(content, locale), user.id).catch(() => undefined);
    revalidatePath(`/crm/cms/faqs/edit?route=${encodeURIComponent(route)}`);
  }
  revalidatePath("/crm/cms/faqs");

  await refreshCmsFiles();
  revalidateAbout(saved);
  revalidatePath(`/crm/cms/pages/${saved.id}`);
  return { ok: true, id: saved.id, intent };
}

export async function ensureAboutPageFromSite() {
  const user = await requireCms();
  const existing =
    (await pageDocumentBySlug(ABOUT_PAGE_SLUG, "th")) || (await pageDocumentBySlug("about", "th"));
  const db = await cmsDb();
  if (existing) {
    if (existing.trashedAt) {
      await db.cmsDocument.update({
        where: { id: existing.id },
        data: { trashedAt: null, updatedBy: user.email },
      });
    }
    const hydrated = await hydrateAboutDocument(existing);
    return hydrated.id;
  }

  const sitePage = pages.find((page) => page.route === ABOUT_PAGE_ROUTE && page.language === "th");
  const content = defaultAboutCms();
  const created = await db.cmsDocument.create({
    data: {
      kind: "page",
      title: sitePage?.title || "เกี่ยวกับเรา",
      slug: ABOUT_PAGE_SLUG,
      locale: "th",
      status: "published",
      template: ABOUT_CMS_TEMPLATE,
      excerpt: sitePage?.description || content.hero.heroBody.th,
      body: serializeAboutPageBody(content),
      seoTitle: sitePage?.title || "เกี่ยวกับเรา",
      metaDescription: sitePage?.description || content.hero.heroBody.th,
      canonical: ABOUT_PAGE_ROUTE,
      author: user.email,
      updatedBy: user.email,
      publishedAt: new Date(),
    },
  });
  await refreshCmsFiles();
  revalidateAbout(created);
  return created.id;
}
