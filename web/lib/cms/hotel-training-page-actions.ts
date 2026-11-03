"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import { hasModule } from "@/lib/crm/modules";
import { isFullAccessRole } from "@/lib/crm/roles";
import { randomToken } from "@/lib/crm/security";
import { CASE_STUDY_IMAGE_TYPES, MAX_CASE_STUDY_IMAGE_BYTES } from "./case-studies";
import { documentPath } from "./body";
import { cmsDb, documentById, pageDocumentBySlug, pageDocumentsBySlug, refreshCmsFiles } from "./queries";
import type { CmsDocumentRow } from "./types";
import {
  HOTEL_TRAINING_CMS_INTENTS,
  HOTEL_TRAINING_CMS_TEMPLATE,
  HOTEL_TRAINING_PAGE_ROUTE,
  HOTEL_TRAINING_PAGE_SLUG,
  defaultHotelTrainingCms,
  editorStateFromHotelTrainingDocument,
  isHotelTrainingCmsBody,
  isHotelTrainingPageDocument,
  parseHotelTrainingPageBody,
  serializeHotelTrainingPageBody,
  validateHotelTrainingPage,
  type CmsHotelTrainingPage,
  type CmsHotelTrainingVisual,
  type HotelTrainingCmsIntent,
  type HotelTrainingCmsSaveResult,
} from "./hotel-training-page";
import { pages, type Locale } from "@/lib/seo";

async function requireCms() {
  const user = await requireUser();
  if (!isFullAccessRole(user.role) && !hasModule(user, "cms")) redirect("/crm?error=forbidden");
  return user;
}

function asIntent(value: unknown): HotelTrainingCmsIntent {
  return HOTEL_TRAINING_CMS_INTENTS.includes(value as HotelTrainingCmsIntent) ? (value as HotelTrainingCmsIntent) : "save";
}

function asLocale(value: string): Locale {
  return value === "en" || value === "ru" || value === "zh" ? value : "th";
}

function revalidateHotelTraining(doc: Pick<CmsDocumentRow, "slug" | "locale" | "kind">) {
  const path = documentPath(doc);
  revalidatePath("/crm/cms");
  revalidatePath("/crm/cms/pages");
  revalidatePath("/crm/cms/hotel-training");
  revalidatePath("/", "layout");
  revalidatePath(HOTEL_TRAINING_PAGE_ROUTE);
  revalidatePath("/en/solutions/hotel-training-team-development");
  revalidatePath("/ru/solutions/hotel-training-team-development");
  revalidatePath("/zh/solutions/hotel-training-team-development");
  revalidatePath(path);
  revalidatePath(path, "page");
}

async function storeImage(file: File): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
  const original = file.name || "";
  const dot = original.lastIndexOf(".");
  const ext = dot >= 0 ? original.slice(dot).toLowerCase() : "";
  if (!CASE_STUDY_IMAGE_TYPES.has(ext) || file.size > MAX_CASE_STUDY_IMAGE_BYTES) {
    return { ok: false, error: "invalid_image" };
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const [{ mkdirSync, writeFileSync }, { join }] = await Promise.all([import("node:fs"), import("node:path")]);
  const name = `${randomToken(8)}${ext || ".jpg"}`;
  const dir = join(process.cwd(), "public", "media", "cms");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, name), buffer);
  const path = `/media/cms/${name}`;
  try {
    const db = await cmsDb();
    await db.cmsMedia.create({
      data: {
        filename: file.name,
        path,
        alt: "",
        caption: "",
        mime: file.type || "image/jpeg",
        size: file.size,
      },
    });
  } catch {
    /* media table optional */
  }
  return { ok: true, path };
}

async function applyVisualUpload(
  formData: FormData,
  visual: CmsHotelTrainingVisual,
  fileKey: string,
  clearKey: string,
): Promise<string | null> {
  const file = formData.get(fileKey);
  const hasFile = file instanceof File && file.size > 0;
  if (hasFile) {
    const stored = await storeImage(file);
    if (!stored.ok) return stored.error;
    visual.src = stored.path;
    if (visual.status === "replace") visual.status = "sample";
  }
  if (formData.get(clearKey) === "1" && !hasFile) {
    visual.src = "";
    visual.status = "replace";
  }
  return null;
}

async function applySrcUpload(formData: FormData, target: { src: string }, fileKey: string, clearKey: string) {
  const file = formData.get(fileKey);
  const hasFile = file instanceof File && file.size > 0;
  if (hasFile) {
    const stored = await storeImage(file);
    if (!stored.ok) return stored.error;
    target.src = stored.path;
  }
  if (formData.get(clearKey) === "1" && !hasFile) target.src = "";
  return null;
}

export async function hydrateHotelTrainingDocument(doc: CmsDocumentRow) {
  if (!isHotelTrainingPageDocument(doc)) return doc;
  const locale = asLocale(doc.locale);
  const parsed = isHotelTrainingCmsBody(doc.body) ? parseHotelTrainingPageBody(doc.body, locale) : null;
  if (doc.template === HOTEL_TRAINING_CMS_TEMPLATE && parsed) return doc;
  const content = parsed ?? defaultHotelTrainingCms(locale);
  const db = await cmsDb();
  return db.cmsDocument.update({
    where: { id: doc.id },
    data: {
      template: HOTEL_TRAINING_CMS_TEMPLATE,
      body: serializeHotelTrainingPageBody(content),
    },
  });
}

function applyIntent(status: string, intent: HotelTrainingCmsIntent) {
  if (intent === "draft" || intent === "unpublish") return "draft";
  if (intent === "publish") return "published";
  return status === "published" ? "published" : status || "draft";
}

export async function saveHotelTrainingPage(formData: FormData): Promise<HotelTrainingCmsSaveResult> {
  const user = await requireCms();
  const id = String(formData.get("id") ?? "");
  const intent = asIntent(formData.get("intent"));
  const existing = id ? await documentById(id) : null;
  if (!existing || existing.kind !== "page") return { ok: false, error: "missing" };

  const locale = asLocale(String(formData.get("locale") ?? existing.locale));
  const parsed = parseHotelTrainingPageBody(String(formData.get("contentJson") ?? ""), locale);
  if (!parsed) return { ok: false, error: "invalid_json" };
  const content: CmsHotelTrainingPage = parsed;

  const uploads = [
    await applyVisualUpload(formData, content.hero.visual, "heroImageFile", "clearHeroImage"),
    await applyVisualUpload(formData, content.needs.visual, "needsImageFile", "clearNeedsImage"),
    await applyVisualUpload(formData, content.seo.social, "ogImageFile", "clearOgImage"),
    await applySrcUpload(formData, content.trainer, "trainerImageFile", "clearTrainerImage"),
  ];
  for (const item of content.gallery.items) {
    uploads.push(await applySrcUpload(formData, item, `galleryImageFile-${item.id}`, `clearGalleryImage-${item.id}`));
  }
  const uploadError = uploads.find(Boolean);
  if (uploadError) return { ok: false, error: uploadError };

  const seoTitle = String(formData.get("seoTitle") ?? "").trim();
  const metaDescription = String(formData.get("metaDescription") ?? "").trim();
  if (intent === "publish" && (!seoTitle || !metaDescription)) return { ok: false, error: "required_fields" };

  const invalid = validateHotelTrainingPage(content, intent);
  if (invalid) return { ok: false, error: invalid };

  const nextStatus = applyIntent(existing.status, intent);
  const published = nextStatus === "published";
  const title = String(formData.get("title") ?? existing.title).trim() || `${content.hero.titleLead} ${content.hero.titleAccent}`.trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim() || metaDescription;
  const db = await cmsDb();
  const saved = await db.cmsDocument.update({
    where: { id: existing.id },
    data: {
      title,
      locale,
      status: nextStatus,
      template: HOTEL_TRAINING_CMS_TEMPLATE,
      excerpt,
      body: serializeHotelTrainingPageBody(content),
      featuredImage: content.hero.visual.src || content.trainer.src,
      imageAlt: content.hero.visual.altTh || content.hero.visual.altEn || content.trainer.altTh,
      ogImage: content.seo.social.src,
      seoTitle,
      metaDescription,
      canonical: content.seo.canonical || existing.canonical,
      publishedAt: published ? existing.publishedAt ?? new Date() : null,
      scheduledAt: null,
      updatedBy: user.email,
    },
  });
  await refreshCmsFiles();
  revalidateHotelTraining(saved);
  revalidatePath(`/crm/cms/pages/${saved.id}`);
  revalidatePath(`/crm/cms/pages/${saved.id}/preview`);
  return { ok: true, id: saved.id, intent };
}

export async function ensureHotelTrainingPageFromSite(locale: Locale = "th") {
  const user = await requireCms();
  const slug = HOTEL_TRAINING_PAGE_SLUG;
  const existing = await pageDocumentBySlug(slug, locale);
  const db = await cmsDb();
  if (existing) {
    if (existing.trashedAt) {
      await db.cmsDocument.update({
        where: { id: existing.id },
        data: { trashedAt: null, updatedBy: user.email },
      });
    }
    const hydrated = await hydrateHotelTrainingDocument(existing);
    return hydrated.id;
  }

  const sitePage = pages.find((page) => page.route === HOTEL_TRAINING_PAGE_ROUTE && page.language === "th");
  const content = defaultHotelTrainingCms(locale);
  const created = await db.cmsDocument.create({
    data: {
      kind: "page",
      title: sitePage?.title || `${content.hero.titleLead} ${content.hero.titleAccent}`.trim(),
      slug,
      locale,
      status: "draft",
      template: HOTEL_TRAINING_CMS_TEMPLATE,
      excerpt: sitePage?.description || content.hero.description,
      body: serializeHotelTrainingPageBody(content),
      seoTitle: sitePage?.title || `${content.hero.titleLead} ${content.hero.titleAccent}`.trim(),
      metaDescription: sitePage?.description || content.hero.description,
      canonical: HOTEL_TRAINING_PAGE_ROUTE,
      author: user.email,
      updatedBy: user.email,
    },
  });
  await refreshCmsFiles();
  revalidateHotelTraining(created);
  return created.id;
}

function contentForLocaleCopy(content: CmsHotelTrainingPage, locale: Locale): CmsHotelTrainingPage {
  const seeded = defaultHotelTrainingCms(locale);
  const canonical = locale === "th" ? HOTEL_TRAINING_PAGE_ROUTE : `/${locale}${HOTEL_TRAINING_PAGE_ROUTE}`;
  return {
    ...content,
    hero: {
      ...content.hero,
      eyebrow: seeded.hero.eyebrow,
      titleLead: seeded.hero.titleLead,
      titleAccent: seeded.hero.titleAccent,
      titleRest: seeded.hero.titleRest,
      description: seeded.hero.description,
      close: seeded.hero.close,
      underCta: seeded.hero.underCta,
      primaryCta: seeded.hero.primaryCta,
      secondaryCta: seeded.hero.secondaryCta,
    },
    needs: { ...content.needs, title: seeded.needs.title, lead: seeded.needs.lead },
    journey: { ...content.journey, title: seeded.journey.title, lead: seeded.journey.lead },
    programs: { ...content.programs, title: seeded.programs.title, lead: seeded.programs.lead },
    assess: seeded.assess,
    gallery: { ...content.gallery, title: seeded.gallery.title, lead: seeded.gallery.lead },
    matrix: { ...content.matrix, title: seeded.matrix.title, lead: seeded.matrix.lead, caption: seeded.matrix.caption },
    outcomes: { ...content.outcomes, title: seeded.outcomes.title, lead: seeded.outcomes.lead, caption: seeded.outcomes.caption },
    trainer: {
      ...content.trainer,
      title: seeded.trainer.title,
      lead: seeded.trainer.lead,
      name: seeded.trainer.name,
      nameEn: seeded.trainer.nameEn,
    },
    follow: { ...content.follow, title: seeded.follow.title, lead: seeded.follow.lead },
    partners: seeded.partners,
    related: { ...content.related, title: seeded.related.title, lead: seeded.related.lead },
    form: seeded.form,
    faqLead: seeded.faqLead,
    faqLeadEn: seeded.faqLeadEn,
    faqs: seeded.faqs,
    seo: { ...content.seo, canonical },
  };
}

export async function duplicateHotelTrainingPageToLocale(formData: FormData): Promise<HotelTrainingCmsSaveResult> {
  const user = await requireCms();
  const id = String(formData.get("id") ?? "");
  const locale = asLocale(String(formData.get("targetLocale") ?? ""));
  if (!locale || locale === String(formData.get("locale") ?? "")) return { ok: false, error: "invalid_locale" };
  const existing = id ? await documentById(id) : null;
  if (!existing || existing.kind !== "page" || !isHotelTrainingPageDocument(existing)) return { ok: false, error: "missing" };
  const duplicate = await pageDocumentBySlug(HOTEL_TRAINING_PAGE_SLUG, locale);
  if (duplicate && !duplicate.trashedAt) return { ok: false, error: "locale_exists" };

  const parsed = parseHotelTrainingPageBody(existing.body, asLocale(existing.locale)) ?? defaultHotelTrainingCms(locale);
  const content = contentForLocaleCopy(parsed, locale);
  const canonical = locale === "th" ? HOTEL_TRAINING_PAGE_ROUTE : `/${locale}${HOTEL_TRAINING_PAGE_ROUTE}`;
  const db = await cmsDb();
  if (duplicate?.trashedAt) {
    const restored = await db.cmsDocument.update({
      where: { id: duplicate.id },
      data: {
        title: `${existing.title} (${locale})`,
        locale,
        status: "draft",
        template: HOTEL_TRAINING_CMS_TEMPLATE,
        excerpt: existing.excerpt,
        body: serializeHotelTrainingPageBody(content),
        featuredImage: content.hero.visual.src || content.trainer.src,
        imageAlt: content.hero.visual.altTh || content.hero.visual.altEn,
        ogImage: content.seo.social.src,
        seoTitle: existing.seoTitle,
        metaDescription: existing.metaDescription,
        canonical,
        publishedAt: null,
        scheduledAt: null,
        trashedAt: null,
        updatedBy: user.email,
      },
    });
    await refreshCmsFiles();
    revalidateHotelTraining(restored);
    return { ok: true, id: restored.id, intent: "draft" };
  }

  const created = await db.cmsDocument.create({
    data: {
      kind: "page",
      title: `${existing.title} (${locale})`,
      slug: HOTEL_TRAINING_PAGE_SLUG,
      locale,
      status: "draft",
      template: HOTEL_TRAINING_CMS_TEMPLATE,
      excerpt: existing.excerpt,
      body: serializeHotelTrainingPageBody(content),
      featuredImage: content.hero.visual.src || content.trainer.src,
      imageAlt: content.hero.visual.altTh || content.hero.visual.altEn,
      ogImage: content.seo.social.src,
      seoTitle: existing.seoTitle,
      metaDescription: existing.metaDescription,
      canonical,
      author: user.email,
      updatedBy: user.email,
    },
  });
  await refreshCmsFiles();
  revalidateHotelTraining(created);
  return { ok: true, id: created.id, intent: "draft" };
}

export async function editorStateForHotelTrainingDocument(id: string) {
  const document = await documentById(id);
  if (!document || document.kind !== "page" || !isHotelTrainingPageDocument(document)) return null;
  const hydrated = await hydrateHotelTrainingDocument(document);
  const locales = await pageDocumentsBySlug(HOTEL_TRAINING_PAGE_SLUG);
  return {
    document: hydrated,
    state: editorStateFromHotelTrainingDocument(hydrated),
    locales: locales.map((row) => ({
      id: row.id,
      locale: row.locale,
      status: row.status,
      title: row.title,
    })),
  };
}
