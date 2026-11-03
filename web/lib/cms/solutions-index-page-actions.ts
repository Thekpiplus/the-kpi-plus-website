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
  SOLUTIONS_INDEX_CMS_INTENTS,
  SOLUTIONS_INDEX_CMS_TEMPLATE,
  SOLUTIONS_INDEX_PAGE_ROUTE,
  SOLUTIONS_INDEX_PAGE_SLUG,
  defaultSolutionsIndexCms,
  editorStateFromSolutionsIndexDocument,
  isSolutionsIndexCmsBody,
  isSolutionsIndexPageDocument,
  parseSolutionsIndexPageBody,
  serializeSolutionsIndexPageBody,
  validateSolutionsIndexPage,
  type CmsSolutionsIndexPage,
  type CmsSolutionsIndexVisual,
  type SolutionsIndexCmsIntent,
  type SolutionsIndexCmsSaveResult,
} from "./solutions-index-page";
import { localizePath, pages, type Locale } from "@/lib/seo";

async function requireCms() {
  const user = await requireUser();
  if (!isFullAccessRole(user.role) && !hasModule(user, "cms")) redirect("/crm?error=forbidden");
  return user;
}

function asIntent(value: unknown): SolutionsIndexCmsIntent {
  return SOLUTIONS_INDEX_CMS_INTENTS.includes(value as SolutionsIndexCmsIntent) ? (value as SolutionsIndexCmsIntent) : "save";
}

function asLocale(value: string): Locale {
  return value === "en" || value === "ru" || value === "zh" ? value : "th";
}

function revalidateSolutionsIndex(doc: Pick<CmsDocumentRow, "slug" | "locale" | "kind">) {
  const path = documentPath(doc);
  revalidatePath("/crm/cms");
  revalidatePath("/crm/cms/pages");
  revalidatePath("/crm/cms/solutions-index");
  revalidatePath("/", "layout");
  revalidatePath(SOLUTIONS_INDEX_PAGE_ROUTE);
  revalidatePath("/en/solutions");
  revalidatePath("/ru/solutions");
  revalidatePath("/zh/solutions");
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
  visual: CmsSolutionsIndexVisual,
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

export async function hydrateSolutionsIndexDocument(doc: CmsDocumentRow) {
  if (!isSolutionsIndexPageDocument(doc)) return doc;
  const locale = asLocale(doc.locale);
  const parsed = isSolutionsIndexCmsBody(doc.body) ? parseSolutionsIndexPageBody(doc.body, locale) : null;
  if (doc.template === SOLUTIONS_INDEX_CMS_TEMPLATE && parsed) return doc;
  const content = parsed ?? defaultSolutionsIndexCms(locale);
  const db = await cmsDb();
  return db.cmsDocument.update({
    where: { id: doc.id },
    data: {
      template: SOLUTIONS_INDEX_CMS_TEMPLATE,
      body: serializeSolutionsIndexPageBody(content),
    },
  });
}

function applyIntent(status: string, intent: SolutionsIndexCmsIntent) {
  if (intent === "draft" || intent === "unpublish") return "draft";
  if (intent === "publish") return "published";
  return status === "published" ? "published" : status || "draft";
}

export async function saveSolutionsIndexPage(formData: FormData): Promise<SolutionsIndexCmsSaveResult> {
  const user = await requireCms();
  const id = String(formData.get("id") ?? "");
  const intent = asIntent(formData.get("intent"));
  const existing = id ? await documentById(id) : null;
  if (!existing || existing.kind !== "page") return { ok: false, error: "missing" };

  const locale = asLocale(String(formData.get("locale") ?? existing.locale));
  const parsed = parseSolutionsIndexPageBody(String(formData.get("contentJson") ?? ""), locale);
  if (!parsed) return { ok: false, error: "invalid_json" };
  const content: CmsSolutionsIndexPage = parsed;

  const uploads = [
    await applyVisualUpload(formData, content.hero.visual, "heroImageFile", "clearHeroImage"),
    await applyVisualUpload(formData, content.cta.visual, "ctaImageFile", "clearCtaImage"),
    await applyVisualUpload(formData, content.seo.social, "ogImageFile", "clearOgImage"),
  ];
  for (const card of content.cards.items) {
    uploads.push(await applyVisualUpload(formData, card.icon, `cardIconFile-${card.id}`, `clearCardIcon-${card.id}`));
  }
  const uploadError = uploads.find(Boolean);
  if (uploadError) return { ok: false, error: uploadError };

  const seoTitle = String(formData.get("seoTitle") ?? "").trim();
  const metaDescription = String(formData.get("metaDescription") ?? "").trim();
  if (intent === "publish" && (!seoTitle || !metaDescription)) return { ok: false, error: "required_fields" };

  const invalid = validateSolutionsIndexPage(content, intent);
  if (invalid) return { ok: false, error: invalid };

  const nextStatus = applyIntent(existing.status, intent);
  const published = nextStatus === "published";
  const title = String(formData.get("title") ?? existing.title).trim() || content.hero.title;
  const excerpt = String(formData.get("excerpt") ?? "").trim() || metaDescription;
  const db = await cmsDb();
  const saved = await db.cmsDocument.update({
    where: { id: existing.id },
    data: {
      title,
      locale,
      status: nextStatus,
      template: SOLUTIONS_INDEX_CMS_TEMPLATE,
      excerpt,
      body: serializeSolutionsIndexPageBody(content),
      featuredImage: content.hero.visual.src,
      imageAlt: content.hero.visual.altTh || content.hero.visual.altEn,
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
  revalidateSolutionsIndex(saved);
  revalidatePath(`/crm/cms/pages/${saved.id}`);
  revalidatePath(`/crm/cms/pages/${saved.id}/preview`);
  return { ok: true, id: saved.id, intent };
}

export async function ensureSolutionsIndexPageFromSite(locale: Locale = "th") {
  const user = await requireCms();
  const slug = SOLUTIONS_INDEX_PAGE_SLUG;
  const existing = await pageDocumentBySlug(slug, locale);
  const db = await cmsDb();
  if (existing) {
    if (existing.trashedAt) {
      await db.cmsDocument.update({
        where: { id: existing.id },
        data: { trashedAt: null, updatedBy: user.email },
      });
    }
    const hydrated = await hydrateSolutionsIndexDocument(existing);
    return hydrated.id;
  }

  const sitePage = pages.find((page) => page.route === localizePath(SOLUTIONS_INDEX_PAGE_ROUTE, locale) && page.language === locale);
  const content = defaultSolutionsIndexCms(locale);
  const created = await db.cmsDocument.create({
    data: {
      kind: "page",
      title: sitePage?.title || content.hero.title,
      slug,
      locale,
      status: "draft",
      template: SOLUTIONS_INDEX_CMS_TEMPLATE,
      excerpt: sitePage?.description || content.hero.body,
      body: serializeSolutionsIndexPageBody(content),
      seoTitle: sitePage?.title || content.hero.title,
      metaDescription: sitePage?.description || content.hero.body,
      canonical: localizePath(SOLUTIONS_INDEX_PAGE_ROUTE, locale),
      author: user.email,
      updatedBy: user.email,
    },
  });
  await refreshCmsFiles();
  revalidateSolutionsIndex(created);
  return created.id;
}

/** Re-seed the language-specific copy for the destination locale; keep structure, links, images, approvals. */
function contentForLocaleCopy(content: CmsSolutionsIndexPage, locale: Locale): CmsSolutionsIndexPage {
  const seeded = defaultSolutionsIndexCms(locale);
  return {
    ...content,
    hero: {
      ...content.hero,
      eyebrow: seeded.hero.eyebrow,
      title: seeded.hero.title,
      body: seeded.hero.body,
      supportLine: seeded.hero.supportLine,
      primaryCta: seeded.hero.primaryCta,
      secondaryCta: seeded.hero.secondaryCta,
    },
    finder: { ...content.finder, ...seeded.finder, challenges: content.finder.challenges },
    categories: { ...content.categories, title: seeded.categories.title },
    cards: {
      ...content.cards,
      suitableForLabel: seeded.cards.suitableForLabel,
      deliverableLabel: seeded.cards.deliverableLabel,
      viewDetails: seeded.cards.viewDetails,
    },
    relationships: { ...content.relationships, title: seeded.relationships.title, note: seeded.relationships.note },
    proof: { ...content.proof, title: seeded.proof.title, noProofNote: seeded.proof.noProofNote },
    cta: {
      ...content.cta,
      title: seeded.cta.title,
      body: seeded.cta.body,
      primaryCta: seeded.cta.primaryCta,
      secondaryCta: seeded.cta.secondaryCta,
      visual: { ...content.cta.visual, label: seeded.cta.visual.label },
    },
    process: { ...content.process, eyebrow: seeded.process.eyebrow, title: seeded.process.title, lead: seeded.process.lead },
    seo: { ...content.seo, canonical: localizePath(SOLUTIONS_INDEX_PAGE_ROUTE, locale) },
  };
}

export async function duplicateSolutionsIndexPageToLocale(formData: FormData): Promise<SolutionsIndexCmsSaveResult> {
  const user = await requireCms();
  const id = String(formData.get("id") ?? "");
  const locale = asLocale(String(formData.get("targetLocale") ?? ""));
  if (!locale || locale === String(formData.get("locale") ?? "")) return { ok: false, error: "invalid_locale" };
  const existing = id ? await documentById(id) : null;
  if (!existing || existing.kind !== "page" || !isSolutionsIndexPageDocument(existing)) return { ok: false, error: "missing" };
  const duplicate = await pageDocumentBySlug(SOLUTIONS_INDEX_PAGE_SLUG, locale);
  if (duplicate && !duplicate.trashedAt) return { ok: false, error: "locale_exists" };

  const parsed = parseSolutionsIndexPageBody(existing.body, asLocale(existing.locale)) ?? defaultSolutionsIndexCms(locale);
  const content = contentForLocaleCopy(parsed, locale);
  const canonical = localizePath(SOLUTIONS_INDEX_PAGE_ROUTE, locale);
  const db = await cmsDb();
  const shared = {
    title: `${existing.title} (${locale})`,
    locale,
    status: "draft",
    template: SOLUTIONS_INDEX_CMS_TEMPLATE,
    excerpt: existing.excerpt,
    body: serializeSolutionsIndexPageBody(content),
    featuredImage: content.hero.visual.src,
    imageAlt: content.hero.visual.altTh || content.hero.visual.altEn,
    ogImage: content.seo.social.src,
    seoTitle: existing.seoTitle,
    metaDescription: existing.metaDescription,
    canonical,
    updatedBy: user.email,
  };

  if (duplicate?.trashedAt) {
    const restored = await db.cmsDocument.update({
      where: { id: duplicate.id },
      data: { ...shared, publishedAt: null, scheduledAt: null, trashedAt: null },
    });
    await refreshCmsFiles();
    revalidateSolutionsIndex(restored);
    return { ok: true, id: restored.id, intent: "draft" };
  }

  const created = await db.cmsDocument.create({
    data: { ...shared, kind: "page", slug: SOLUTIONS_INDEX_PAGE_SLUG, author: user.email },
  });
  await refreshCmsFiles();
  revalidateSolutionsIndex(created);
  return { ok: true, id: created.id, intent: "draft" };
}

export async function editorStateForSolutionsIndexDocument(id: string) {
  const document = await documentById(id);
  if (!document || document.kind !== "page" || !isSolutionsIndexPageDocument(document)) return null;
  const hydrated = await hydrateSolutionsIndexDocument(document);
  const locales = await pageDocumentsBySlug(SOLUTIONS_INDEX_PAGE_SLUG);
  return {
    document: hydrated,
    state: editorStateFromSolutionsIndexDocument(hydrated),
    locales: locales.map((row) => ({
      id: row.id,
      locale: row.locale,
      status: row.status,
      title: row.title,
    })),
  };
}
