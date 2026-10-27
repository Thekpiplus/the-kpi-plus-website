"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import { hasModule } from "@/lib/crm/modules";
import { isFullAccessRole } from "@/lib/crm/roles";
import { randomToken } from "@/lib/crm/security";
import { CASE_STUDY_IMAGE_TYPES, MAX_CASE_STUDY_IMAGE_BYTES } from "./case-studies";
import { documentPath } from "./body";
import { cmsDb, documentById, pageDocumentBySlug, refreshCmsFiles } from "./queries";
import type { CmsDocumentRow } from "./types";
import {
  META_CMS_INTENTS,
  META_ADS_CMS_TEMPLATE,
  META_ADS_PAGE_ROUTE,
  META_ADS_PAGE_SLUG,
  editorStateFromMetaAdsDocument,
  isMetaAdsCmsBody,
  isMetaAdsPageDocument,
  parseMetaAdsPageBody,
  serializeMetaAdsPageBody,
  validateMetaAdsPage,
  type MetaCmsIntent,
  type MetaCmsSaveResult,
  type CmsAdsVisual,
  type CmsMetaAdsPage,
  type CmsMetaCreativeRow,
} from "./meta-ads-page";
import { metaCreativeAssetKindFromSrc } from "@/lib/meta-ads";
import { defaultMetaAdsCms } from "./meta-ads-page-seed";
import { pages, type Locale } from "@/lib/seo";

async function requireCms() {
  const user = await requireUser();
  if (!isFullAccessRole(user.role) && !hasModule(user, "cms")) redirect("/crm?error=forbidden");
  return user;
}

function asIntent(value: unknown): MetaCmsIntent {
  return META_CMS_INTENTS.includes(value as MetaCmsIntent) ? (value as MetaCmsIntent) : "save";
}

function asLocale(value: string): Locale {
  return value === "en" || value === "ru" || value === "zh" ? value : "th";
}

function revalidateAds(doc: Pick<CmsDocumentRow, "slug" | "locale" | "kind">) {
  const path = documentPath(doc);
  revalidatePath("/crm/cms");
  revalidatePath("/crm/cms/pages");
  revalidatePath("/crm/cms/meta-ads");
  revalidatePath("/", "layout");
  revalidatePath(META_ADS_PAGE_ROUTE);
  revalidatePath(META_ADS_PAGE_ROUTE, "page");
  revalidatePath("/en/solutions/meta-ads-management");
  revalidatePath("/ru/solutions/meta-ads-management");
  revalidatePath("/zh/solutions/meta-ads-management");
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
    // File is on disk even if the media library row cannot be written.
  }
  return { ok: true, path };
}

const CREATIVE_ASSET_TYPES = new Set([".jpg", ".jpeg", ".png", ".webp", ".mp4", ".webm"]);
const MAX_CREATIVE_ASSET_BYTES = 15 * 1024 * 1024;

async function storeCreativeAsset(file: File): Promise<{ ok: true; path: string } | { ok: false; error: string }> {
  const original = file.name || "";
  const dot = original.lastIndexOf(".");
  const ext = dot >= 0 ? original.slice(dot).toLowerCase() : "";
  if (!CREATIVE_ASSET_TYPES.has(ext) || file.size > MAX_CREATIVE_ASSET_BYTES) {
    return { ok: false, error: "invalid_asset" };
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const [{ mkdirSync, writeFileSync }, { join }] = await Promise.all([import("node:fs"), import("node:path")]);
  const name = `${randomToken(8)}${ext || ".jpg"}`;
  const dir = join(process.cwd(), "public", "media", "cms");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, name), buffer);
  const path = `/media/cms/${name}`;
  const mime =
    file.type ||
    (ext === ".mp4" ? "video/mp4" : ext === ".webm" ? "video/webm" : ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg");
  try {
    const db = await cmsDb();
    await db.cmsMedia.create({
      data: {
        filename: file.name,
        path,
        alt: "",
        caption: "",
        mime,
        size: file.size,
      },
    });
  } catch {
    // File is on disk even if the media library row cannot be written.
  }
  return { ok: true, path };
}

async function applyCreativeAssetUploads(formData: FormData, rows: CmsMetaCreativeRow[]): Promise<string | null> {
  for (const row of rows) {
    const file = formData.get(`creativeAssetFile-${row.id}`);
    const hasFile = file instanceof File && file.size > 0;
    if (hasFile) {
      const stored = await storeCreativeAsset(file);
      if (!stored.ok) return stored.error;
      row.assetSrc = stored.path;
      row.assetKind = metaCreativeAssetKindFromSrc(stored.path, row.assetKind);
    }
    if (formData.get(`clearCreativeAsset-${row.id}`) === "1" && !hasFile) {
      row.assetSrc = "";
      row.assetKind = "none";
    }
  }
  return null;
}

async function applyVisualUpload(
  formData: FormData,
  visual: CmsAdsVisual,
  fileKey: string,
  clearKey: string,
): Promise<string | null> {
  const file = formData.get(fileKey);
  const hasFile = file instanceof File && file.size > 0;
  if (hasFile) {
    const stored = await storeImage(file);
    if (!stored.ok) return stored.error;
    visual.src = stored.path;
    if (visual.status === "placeholder") visual.status = "sample";
  }
  if (formData.get(clearKey) === "1" && !hasFile) {
    visual.src = "";
    visual.status = "placeholder";
  }
  return null;
}

export async function hydrateMetaAdsDocument(doc: CmsDocumentRow) {
  if (!isMetaAdsPageDocument(doc)) return doc;
  const locale = asLocale(doc.locale);
  const parsed = isMetaAdsCmsBody(doc.body) ? parseMetaAdsPageBody(doc.body, locale) : null;
  if (doc.template === META_ADS_CMS_TEMPLATE && parsed) return doc;
  const content = parsed ?? defaultMetaAdsCms(locale);
  const db = await cmsDb();
  return db.cmsDocument.update({
    where: { id: doc.id },
    data: {
      template: META_ADS_CMS_TEMPLATE,
      body: serializeMetaAdsPageBody(content),
    },
  });
}

function applyIntent(status: string, intent: MetaCmsIntent) {
  if (intent === "draft" || intent === "unpublish") return "draft";
  if (intent === "publish") return "published";
  return status === "published" ? "published" : status || "draft";
}

export async function saveMetaAdsPage(formData: FormData): Promise<MetaCmsSaveResult> {
  const user = await requireCms();
  const id = String(formData.get("id") ?? "");
  const intent = asIntent(formData.get("intent"));
  const existing = id ? await documentById(id) : null;
  if (!existing || existing.kind !== "page") return { ok: false, error: "missing" };

  const locale = asLocale(String(formData.get("locale") ?? existing.locale));
  let content: CmsMetaAdsPage;
  try {
    content = parseMetaAdsPageBody(String(formData.get("contentJson") ?? ""), locale) ?? defaultMetaAdsCms(locale);
  } catch {
    return { ok: false, error: "invalid_json" };
  }

  const uploads = await Promise.all([
    applyVisualUpload(formData, content.hero.visual, "heroImageFile", "clearHeroImage"),
    applyVisualUpload(formData, content.visibility.visual, "visibilityImageFile", "clearVisibilityImage"),
    applyVisualUpload(formData, content.readiness.visual, "readinessImageFile", "clearReadinessImage"),
    applyVisualUpload(formData, content.channels.visual, "channelImageFile", "clearChannelImage"),
    applyVisualUpload(formData, content.scenario.visual, "scenarioImageFile", "clearScenarioImage"),
    applyVisualUpload(formData, content.workflow.visual, "workflowImageFile", "clearWorkflowImage"),
    applyVisualUpload(formData, content.measure.visual, "kpiImageFile", "clearKpiImage"),
    applyVisualUpload(formData, content.related.visual, "relatedImageFile", "clearRelatedImage"),
    applyVisualUpload(formData, content.form.visual, "teamImageFile", "clearTeamImage"),
    applyVisualUpload(formData, content.seo.social, "ogImageFile", "clearOgImage"),
  ]);
  const uploadError = uploads.find(Boolean);
  if (uploadError) return { ok: false, error: uploadError };
  const creativeUploadError = await applyCreativeAssetUploads(formData, content.creative?.rows || []);
  if (creativeUploadError) return { ok: false, error: creativeUploadError };

  const invalid = validateMetaAdsPage(content, intent);
  if (invalid) return { ok: false, error: invalid };

  const nextStatus = applyIntent(existing.status, intent);
  const published = nextStatus === "published";
  const title = String(formData.get("title") ?? existing.title).trim() || content.hero.title;
  const seoTitle = String(formData.get("seoTitle") ?? "").trim();
  const metaDescription = String(formData.get("metaDescription") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim() || metaDescription;
  const db = await cmsDb();
  const saved = await db.cmsDocument.update({
    where: { id: existing.id },
    data: {
      title,
      locale,
      status: nextStatus,
      template: META_ADS_CMS_TEMPLATE,
      excerpt,
      body: serializeMetaAdsPageBody(content),
      featuredImage: content.hero.visual.src,
      imageAlt: content.hero.visual.altTh || content.hero.visual.altEn,
      ogImage: content.seo.social.src,
      seoTitle,
      metaDescription,
      publishedAt: published ? existing.publishedAt ?? new Date() : null,
      scheduledAt: null,
      updatedBy: user.email,
    },
  });
  await refreshCmsFiles();
  revalidateAds(saved);
  revalidatePath(`/crm/cms/pages/${saved.id}`);
  revalidatePath(`/crm/cms/pages/${saved.id}/preview`);
  return { ok: true, id: saved.id, intent };
}

export async function ensureMetaAdsPageFromSite(locale: Locale = "th") {
  const user = await requireCms();
  const slug = META_ADS_PAGE_SLUG;
  const existing = await pageDocumentBySlug(slug, locale);
  const db = await cmsDb();
  if (existing) {
    if (existing.trashedAt) {
      await db.cmsDocument.update({
        where: { id: existing.id },
        data: { trashedAt: null, updatedBy: user.email },
      });
    }
    const hydrated = await hydrateMetaAdsDocument(existing);
    return hydrated.id;
  }

  const sitePage = pages.find((page) => page.route === META_ADS_PAGE_ROUTE && page.language === "th");
  const content = defaultMetaAdsCms(locale);
  const created = await db.cmsDocument.create({
    data: {
      kind: "page",
      title: sitePage?.title || content.hero.title,
      slug,
      locale,
      status: "published",
      template: META_ADS_CMS_TEMPLATE,
      excerpt: sitePage?.description || content.hero.description,
      body: serializeMetaAdsPageBody(content),
      featuredImage: content.hero.visual.src,
      imageAlt: content.hero.visual.altTh || content.hero.visual.altEn,
      ogImage: content.seo.social.src,
      tags: "",
      seoTitle: sitePage?.title || content.hero.title,
      metaDescription: sitePage?.description || content.hero.description,
      publishedAt: new Date(),
      updatedBy: user.email,
    },
  });
  await refreshCmsFiles();
  revalidateAds(created);
  return created.id;
}

export async function editorStateForMetaAdsDocument(id: string) {
  const doc = await documentById(id);
  if (!doc || doc.kind !== "page") return null;
  const hydrated = await hydrateMetaAdsDocument(doc);
  return { document: hydrated, state: editorStateFromMetaAdsDocument(hydrated) };
}
