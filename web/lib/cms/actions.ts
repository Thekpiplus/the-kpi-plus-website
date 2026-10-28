"use server";

import { mkdirSync, unlinkSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import { hasModule } from "@/lib/crm/modules";
import { isFullAccessRole } from "@/lib/crm/roles";
import { randomToken } from "@/lib/crm/security";
import { SITE } from "@/lib/seo";
import { blocksToMarkdown, bodyFromMarkdown, documentPath, slugify, unwrapCmsBody } from "./body";
import { loadHandoff } from "@/lib/handoff";
import { insightBySlug, insightPosts, type InsightPost } from "@/lib/insights";
import { isInsightImageFit, isInsightImageStatus, parseInsightImageMeta, serializeInsightImageMeta } from "@/lib/insights-media";
import { pages } from "@/lib/seo";
import { isLockedRoute } from "./locked";
import { resolveInsightOrder, saveInsightOrder } from "./insight-order";
import { cmsDb, documentById, insightDocumentBySlug, pageDocumentBySlug, refreshCmsFiles } from "./queries";
import { siteMenuLabel } from "@/lib/nav";
import {
  CONTACT_IMAGE_TYPES,
  MAX_CONTACT_IMAGE_BYTES,
  inputFromForm,
  publicFieldsFromInput,
  validateContactInput,
  type ContactSaveResult,
} from "./contact";
import { parseSiteGlobals } from "@/lib/site-globals";
import { REVENUE_CMS_TEMPLATE, REVENUE_PAGE_ROUTE, serializeRevenuePageBody } from "./revenue-page";
import { defaultRevenueCms } from "./revenue-page-seed";
import {
  RESERVATIONS_CMS_TEMPLATE,
  RESERVATIONS_PAGE_ROUTE,
  serializeReservationsPageBody,
} from "./reservations-page";
import { defaultReservationsCms } from "./reservations-page-seed";
import { B2B_CMS_TEMPLATE, B2B_PAGE_ROUTE, serializeB2bPageBody } from "./b2b-page";
import { defaultB2bCms } from "./b2b-page-seed";
import { GOOGLE_ADS_CMS_TEMPLATE, GOOGLE_ADS_PAGE_ROUTE, serializeGoogleAdsPageBody } from "./google-ads-page";
import { defaultGoogleAdsCms } from "./google-ads-page-seed";
import { META_ADS_CMS_TEMPLATE, META_ADS_PAGE_ROUTE, serializeMetaAdsPageBody } from "./meta-ads-page";
import { defaultMetaAdsCms } from "./meta-ads-page-seed";
import { HOTEL_SEO_CMS_TEMPLATE, HOTEL_SEO_PAGE_ROUTE, serializeHotelSeoPageBody } from "./hotel-seo-page";
import { defaultHotelSeoCms } from "./hotel-seo-page-seed";
import { HOTEL_WEBSITE_CMS_TEMPLATE, HOTEL_WEBSITE_PAGE_ROUTE, serializeHotelWebsitePageBody } from "./hotel-website-page";
import { defaultHotelWebsiteCms } from "./hotel-website-page";

async function requireCms() {
  const user = await requireUser();
  if (!isFullAccessRole(user.role) && !hasModule(user, "cms")) redirect("/crm?error=forbidden");
  return user;
}

const LOCALE_PREFIXED_CMS_SLUGS = new Set(["about-us", "about", "approach", "associations", "contact-us", "contact"]);

function revalidatePublic(path: string) {
  revalidatePath("/crm/cms");
  revalidatePath("/crm/cms/pages");
  revalidatePath("/crm/cms/insights");
  revalidatePath("/crm/cms/media");
  revalidatePath("/crm/cms/redirects");
  revalidatePath("/crm/cms/globals");
  revalidatePath("/", "layout");
  revalidatePath(path);
  revalidatePath(path, "page");
  revalidatePath(path, "layout");
  if (path.startsWith("/insights")) revalidatePath("/insights");

  // Locale variants share the same markdown/CMS body pipelines for these pages.
  const bare = path.replace(/^\/(en|ru|zh)(?=\/|$)/, "") || "/";
  const slug = bare.replace(/^\//, "").split("/")[0] ?? "";
  if (LOCALE_PREFIXED_CMS_SLUGS.has(slug)) {
    for (const localePath of [`/${slug}`, `/en/${slug}`, `/ru/${slug}`, `/zh/${slug}`]) {
      if (localePath === path) continue;
      revalidatePath(localePath);
      revalidatePath(localePath, "page");
      revalidatePath(localePath, "layout");
    }
  }
}

function insightSeedTags(post: InsightPost) {
  return serializeInsightImageMeta({
    imageFit: post.coverImageFit ?? "cover",
    imageStatus: post.coverImageStatus ?? "placeholder",
    authorRole: post.authorRole,
    sources: post.sources,
    relatedArticleIds: post.relatedArticleIds,
    isFeatured: post.isFeatured,
  });
}

function formDocument(formData: FormData, kind: "page" | "insight", existingTags?: string) {
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? title));
  const locale = String(formData.get("locale") ?? "th");
  const status = String(formData.get("status") ?? "draft");
  const scheduledRaw = String(formData.get("scheduledAt") ?? "").trim();
  const scheduledAt = scheduledRaw ? new Date(scheduledRaw) : null;
  const published = status === "published" || (status === "scheduled" && scheduledAt && scheduledAt <= new Date());
  const imageFitRaw = String(formData.get("imageFit") ?? "");
  const imageStatusRaw = String(formData.get("imageStatus") ?? "");
  const existingMeta = parseInsightImageMeta(existingTags);
  return {
    kind,
    title,
    slug,
    locale,
    status: published && status === "scheduled" ? "published" : status,
    template: String(formData.get("template") ?? (kind === "insight" ? "insight" : "general")),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    body: bodyFromMarkdown(unwrapCmsBody(String(formData.get("body") ?? ""))),
    featuredImage: String(formData.get("featuredImage") ?? "").trim(),
    imageAlt: String(formData.get("imageAlt") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    tags:
      kind === "insight"
        ? serializeInsightImageMeta({
            imageFit: isInsightImageFit(imageFitRaw) ? imageFitRaw : "cover",
            imageStatus: isInsightImageStatus(imageStatusRaw) ? imageStatusRaw : "placeholder",
            authorRole: existingMeta.authorRole,
            sources: existingMeta.sources,
            relatedArticleIds: existingMeta.relatedArticleIds,
            isFeatured: existingMeta.isFeatured,
          })
        : String(formData.get("tags") ?? "").trim(),
    author: String(formData.get("author") ?? "").trim(),
    seoTitle: String(formData.get("seoTitle") ?? "").trim(),
    metaDescription: String(formData.get("metaDescription") ?? "").trim(),
    canonical: String(formData.get("canonical") ?? "").trim(),
    ogImage: String(formData.get("ogImage") ?? "").trim(),
    noindex: formData.get("noindex") === "1",
    showInMenu: formData.get("showInMenu") === "1",
    menu: String(formData.get("menu") ?? "none"),
    menuLabel: String(formData.get("menuLabel") ?? "").trim(),
    menuParent: String(formData.get("menuParent") ?? ""),
    menuPosition: Number(formData.get("menuPosition") ?? 0) || 0,
    scheduledAt: status === "scheduled" ? scheduledAt : null,
    publishedAt: published ? new Date() : null,
  };
}

function isNextRedirect(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    String((error as { digest: unknown }).digest).includes("NEXT_REDIRECT")
  );
}

function collisionPath(kind: "page" | "insight", slug: string, locale: string) {
  return documentPath({ kind, slug, locale });
}

function isSitePagePath(path: string) {
  return pages.some((page) => page.route === path);
}

function blocksCmsRoute(kind: "page" | "insight", path: string, mode: "create" | "update") {
  if (kind === "insight" && insightPosts.some((post) => post.href === path)) return false;
  if (mode === "update" && kind === "page" && isSitePagePath(path)) return false;
  return (
    isLockedRoute(path) ||
    (path.startsWith("/insights") && kind === "page") ||
    /^(?:\/admin|\/crm|\/partners|\/api)(?:\/|$)/.test(path)
  );
}

function routeToPageSlug(route: string) {
  if (route === "/" || route === "") return "";
  return route.replace(/^\//, "");
}

export async function ensureInsightFromSite(slug: string) {
  const user = await requireCms();
  const post = insightBySlug(slug);
  if (!post) redirect("/crm/cms/insights?error=missing");
  const existing = await insightDocumentBySlug(post.slug, "th");
  const db = await cmsDb();
  if (existing) {
    if (existing.trashedAt) {
      await db.cmsDocument.update({
        where: { id: existing.id },
        data: { trashedAt: null, status: existing.status === "draft" ? "published" : existing.status, updatedBy: user.email },
      });
    }
    return existing.id;
  }
  const markdown = blocksToMarkdown(loadHandoff(post.href));
  const created = await db.cmsDocument.create({
    data: {
      kind: "insight",
      title: post.title.th,
      slug: post.slug,
      locale: "th",
      status: "published",
      template: "insight",
      excerpt: post.excerpt.th,
      body: bodyFromMarkdown(markdown),
      featuredImage: post.coverImage,
      imageAlt: post.coverImageAlt,
      category: post.category.th,
      tags: insightSeedTags(post),
      author: post.authorName ?? "",
      seoTitle: post.title.th,
      metaDescription: post.excerpt.th,
      publishedAt: new Date(`${post.publishedAt}T00:00:00.000Z`),
      updatedBy: user.email,
    },
  });
  await refreshCmsFiles();
  revalidatePublic(post.href);
  return created.id;
}

export async function ensurePageFromSite(route: string) {
  const user = await requireCms();
  const normalized = route === "" ? "/" : route.startsWith("/") ? route : `/${route}`;
  const sitePage = pages.find((page) => page.route === normalized && page.language === "th");
  if (!sitePage) redirect("/crm/cms?error=missing");
  if (/^(?:\/admin|\/crm|\/partners|\/api)(?:\/|$)/.test(normalized)) redirect("/crm/cms?error=locked");

  const slug = routeToPageSlug(normalized);
  const existing = await pageDocumentBySlug(slug, "th");
  const db = await cmsDb();
  if (existing) {
    if (existing.trashedAt) {
      await db.cmsDocument.update({
        where: { id: existing.id },
        data: {
          trashedAt: null,
          status: existing.status === "draft" ? "published" : existing.status,
          updatedBy: user.email,
        },
      });
    }
    if (normalized === REVENUE_PAGE_ROUTE) {
      const { hydrateRevenueDocument } = await import("./revenue-page-actions");
      const hydrated = await hydrateRevenueDocument(existing);
      return hydrated.id;
    }
    if (normalized === RESERVATIONS_PAGE_ROUTE) {
      const { hydrateReservationsDocument } = await import("./reservations-page-actions");
      const hydrated = await hydrateReservationsDocument(existing);
      return hydrated.id;
    }
    if (normalized === B2B_PAGE_ROUTE) {
      const { hydrateB2bDocument } = await import("./b2b-page-actions");
      const hydrated = await hydrateB2bDocument(existing);
      return hydrated.id;
    }
    if (normalized === GOOGLE_ADS_PAGE_ROUTE) {
      const { hydrateGoogleAdsDocument } = await import("./google-ads-page-actions");
      const hydrated = await hydrateGoogleAdsDocument(existing);
      return hydrated.id;
    }
    if (normalized === META_ADS_PAGE_ROUTE) {
      const { hydrateMetaAdsDocument } = await import("./meta-ads-page-actions");
      const hydrated = await hydrateMetaAdsDocument(existing);
      return hydrated.id;
    }
    if (normalized === HOTEL_SEO_PAGE_ROUTE) {
      const { hydrateHotelSeoDocument } = await import("./hotel-seo-page-actions");
      const hydrated = await hydrateHotelSeoDocument(existing);
      return hydrated.id;
    }
    return existing.id;
  }

  let markdown = "";
  try {
    markdown = blocksToMarkdown(loadHandoff(normalized));
  } catch {
    markdown = `# ${sitePage.title}\n\n${sitePage.description || ""}`;
  }

  const menuLabel = (() => {
    const label = siteMenuLabel(normalized, "th");
    return label === "—" ? "" : label;
  })();
  const isRevenue = normalized === REVENUE_PAGE_ROUTE;
  const isReservations = normalized === RESERVATIONS_PAGE_ROUTE;
  const isB2b = normalized === B2B_PAGE_ROUTE;
  const isGoogleAds = normalized === GOOGLE_ADS_PAGE_ROUTE;
  const isMetaAds = normalized === META_ADS_PAGE_ROUTE;
  const isHotelSeo = normalized === HOTEL_SEO_PAGE_ROUTE;
  const isHotelWebsite = normalized === HOTEL_WEBSITE_PAGE_ROUTE;
  const created = await db.cmsDocument.create({
    data: {
      kind: "page",
      title: sitePage.title,
      slug,
      locale: "th",
      status: "published",
      template: isRevenue
        ? REVENUE_CMS_TEMPLATE
        : isReservations
          ? RESERVATIONS_CMS_TEMPLATE
          : isB2b
            ? B2B_CMS_TEMPLATE
            : isGoogleAds
              ? GOOGLE_ADS_CMS_TEMPLATE
              : isMetaAds
                ? META_ADS_CMS_TEMPLATE
                : isHotelSeo
                  ? HOTEL_SEO_CMS_TEMPLATE
                  : isHotelWebsite
                    ? HOTEL_WEBSITE_CMS_TEMPLATE
                : "general",
      excerpt: sitePage.description || "",
      body: isRevenue
        ? serializeRevenuePageBody(defaultRevenueCms("th"))
        : isReservations
          ? serializeReservationsPageBody(defaultReservationsCms("th"))
          : isB2b
            ? serializeB2bPageBody(defaultB2bCms("th"))
            : isGoogleAds
              ? serializeGoogleAdsPageBody(defaultGoogleAdsCms("th"))
              : isMetaAds
                ? serializeMetaAdsPageBody(defaultMetaAdsCms("th"))
                : isHotelSeo
                  ? serializeHotelSeoPageBody(defaultHotelSeoCms("th"))
                  : isHotelWebsite
                    ? serializeHotelWebsitePageBody(defaultHotelWebsiteCms("th"))
                : bodyFromMarkdown(markdown),
      tags: "",
      seoTitle: sitePage.title,
      metaDescription: sitePage.description || "",
      menuLabel,
      publishedAt: new Date(),
      updatedBy: user.email,
    },
  });
  await refreshCmsFiles();
  revalidatePublic(normalized);
  return created.id;
}

export async function trashSiteInsight(formData: FormData) {
  await requireCms();
  const slug = String(formData.get("slug") ?? "");
  const id = await ensureInsightFromSite(slug);
  const db = await cmsDb();
  const existing = await documentById(id);
  if (!existing) redirect("/crm/cms/insights?error=missing");
  await db.cmsDocument.update({
    where: { id },
    data: { trashedAt: new Date(), status: "draft", showInMenu: false },
  });
  await refreshCmsFiles();
  revalidatePublic(documentPath(existing));
  revalidatePath("/crm/cms/trash");
  redirect("/crm/cms/insights?deleted=1");
}

export async function createDocument(formData: FormData) {
  const user = await requireCms();
  const kind = String(formData.get("kind") ?? "page") === "insight" ? "insight" : "page";
  const data = formDocument(formData, kind);
  const editorBase = kind === "insight" ? "/crm/cms/insights" : "/crm/cms/pages";
  // Insights and pages need a slug. Thai-only titles slugify to "" — require a latin slug for pages.
  if (!data.title || !data.slug) {
    redirect(`${editorBase}/new?error=invalid`);
  }
  const path = collisionPath(kind, data.slug, data.locale);
  if (blocksCmsRoute(kind, path, "create")) {
    redirect(`${editorBase}/new?error=locked`);
  }
  const db = await cmsDb();
  try {
    const created = await db.cmsDocument.create({
      data: { ...data, updatedBy: user.email },
    });
    await refreshCmsFiles();
    revalidatePublic(path);
    redirect(`${editorBase}/${created.id}`);
  } catch (error) {
    if (isNextRedirect(error)) throw error;
    redirect(`${editorBase}/new?error=exists`);
  }
}

export async function updateDocument(formData: FormData) {
  const user = await requireCms();
  const id = String(formData.get("id") ?? "");
  const existing = await documentById(id);
  if (!existing) redirect("/crm/cms?error=missing");
  const kind = existing.kind === "insight" ? "insight" : "page";
  const data = formDocument(formData, kind, existing.tags);
  const editorBase = kind === "insight" ? "/crm/cms/insights" : "/crm/cms/pages";
  // Insights need a slug. Homepage keeps slug ""; other pages must keep a non-empty slug.
  if (!data.title || (kind === "insight" && !data.slug) || (kind === "page" && !data.slug && existing.slug !== "")) {
    redirect(`${editorBase}/${id}?error=invalid`);
  }
  const path = collisionPath(kind, data.slug, data.locale);
  if (blocksCmsRoute(kind, path, "update")) {
    redirect(`${editorBase}/${id}?error=locked`);
  }
  const db = await cmsDb();
  const publishedAt =
    data.status === "published"
      ? existing.publishedAt ?? new Date()
      : data.status === "scheduled"
        ? existing.publishedAt
        : null;
  await db.cmsDocument.update({
    where: { id },
    data: { ...data, publishedAt, updatedBy: user.email },
  });
  await refreshCmsFiles();
  revalidatePublic(path);
  redirect(`${editorBase}/${id}?saved=1`);
}

export async function trashDocument(formData: FormData) {
  await requireCms();
  const id = String(formData.get("id") ?? "");
  const returnTo = String(formData.get("returnTo") ?? "").trim();
  const existing = await documentById(id);
  if (!existing) redirect("/crm/cms?error=missing");
  const db = await cmsDb();
  await db.cmsDocument.update({
    where: { id },
    data: { trashedAt: new Date(), status: "draft", showInMenu: false },
  });
  await refreshCmsFiles();
  revalidatePublic(documentPath(existing));
  revalidatePath("/crm/cms/trash");
  if (returnTo.startsWith("/crm/cms")) {
    redirect(returnTo.includes("?") ? `${returnTo}&deleted=1` : `${returnTo}?deleted=1`);
  }
  redirect(existing.kind === "insight" ? "/crm/cms/insights?deleted=1" : "/crm/cms?deleted=1");
}

export async function restoreDocument(formData: FormData) {
  const user = await requireCms();
  const id = String(formData.get("id") ?? "");
  const publish = String(formData.get("publish") ?? "") === "1";
  const existing = await documentById(id);
  if (!existing?.trashedAt) redirect("/crm/cms/trash?error=missing");
  const db = await cmsDb();
  await db.cmsDocument.update({
    where: { id },
    data: {
      trashedAt: null,
      status: publish ? "published" : existing.status === "scheduled" ? "draft" : existing.status || "draft",
      publishedAt: publish ? existing.publishedAt ?? new Date() : existing.publishedAt,
      updatedBy: user.email,
    },
  });
  await refreshCmsFiles();
  revalidatePublic(documentPath(existing));
  revalidatePath("/crm/cms/trash");
  revalidatePath(existing.kind === "insight" ? "/crm/cms/insights" : "/crm/cms");
  redirect("/crm/cms/trash?restored=1");
}

export async function purgeDocument(formData: FormData) {
  await requireCms();
  const id = String(formData.get("id") ?? "");
  const existing = await documentById(id);
  if (!existing?.trashedAt) redirect("/crm/cms/trash?error=missing");
  const path = documentPath(existing);
  const db = await cmsDb();
  await db.cmsDocument.delete({ where: { id } });
  await refreshCmsFiles();
  revalidatePublic(path);
  revalidatePath("/crm/cms/trash");
  redirect("/crm/cms/trash?purged=1");
}

export async function trashSitePage(formData: FormData) {
  await requireCms();
  const route = String(formData.get("route") ?? "").trim();
  if (!route) redirect("/crm/cms?error=missing");
  const id = await ensurePageFromSite(route);
  const db = await cmsDb();
  const existing = await documentById(id);
  if (!existing) redirect("/crm/cms?error=missing");
  await db.cmsDocument.update({
    where: { id },
    data: { trashedAt: new Date(), status: "draft", showInMenu: false },
  });
  await refreshCmsFiles();
  revalidatePublic(documentPath(existing));
  revalidatePath("/crm/cms/trash");
  redirect("/crm/cms?deleted=1");
}

async function ensureInsightDocFast(slug: string, online: boolean, updatedBy: string) {
  const post = insightBySlug(slug);
  if (!post) throw new Error("missing insight");
  const existing = await insightDocumentBySlug(post.slug, "th");
  const db = await cmsDb();
  if (existing) {
    if (existing.trashedAt) {
      await db.cmsDocument.update({
        where: { id: existing.id },
        data: {
          trashedAt: null,
          status: online ? "published" : "draft",
          updatedBy,
        },
      });
    }
    return existing.id;
  }
  const created = await db.cmsDocument.create({
    data: {
      kind: "insight",
      title: post.title.th,
      slug: post.slug,
      locale: "th",
      status: online ? "published" : "draft",
      template: "insight",
      excerpt: post.excerpt.th,
      body: bodyFromMarkdown(`# ${post.title.th}\n\n${post.excerpt.th}`),
      featuredImage: post.coverImage,
      imageAlt: post.coverImageAlt,
      category: post.category.th,
      tags: insightSeedTags(post),
      author: post.authorName ?? "",
      seoTitle: post.title.th,
      metaDescription: post.excerpt.th,
      publishedAt: online ? new Date(`${post.publishedAt}T00:00:00.000Z`) : null,
      updatedBy,
    },
  });
  return created.id;
}

export async function togglePageOnline(formData: FormData) {
  const user = await requireCms();
  const kind = String(formData.get("kind") ?? "page") === "insight" ? "insight" : "page";
  const route = String(formData.get("route") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const online = String(formData.get("online") ?? "") === "1";
  let id = String(formData.get("id") ?? "").trim();

  if (!id) {
    if (kind === "insight") {
      const insightSlug = slug || route.replace(/^\/insights\//, "");
      if (!insightSlug) throw new Error("missing slug");
      id = await ensureInsightDocFast(insightSlug, online, user.email);
    } else {
      if (!route) throw new Error("missing route");
      id = await ensurePageFromSite(route);
    }
  }

  const existing = await documentById(id);
  if (!existing || existing.kind !== kind) throw new Error("missing document");

  const db = await cmsDb();
  await db.cmsDocument.update({
    where: { id },
    data: {
      status: online ? "published" : "draft",
      publishedAt: online ? existing.publishedAt ?? new Date() : existing.publishedAt,
      scheduledAt: null,
      updatedBy: user.email,
    },
  });

  const path = documentPath(existing);
  if (kind === "page" && existing.showInMenu) {
    await refreshCmsFiles();
  }

  if (kind === "insight") {
    revalidatePath("/crm/cms/insights");
    revalidatePath("/insights");
    revalidatePath("/");
    revalidatePath(path);
  } else {
    revalidatePublic(path);
    revalidatePath(path, "page");
    revalidatePath(path, "layout");
  }
  return { id, online, path };
}

export async function moveInsightOrder(formData: FormData) {
  await requireCms();
  const slug = String(formData.get("slug") ?? "").trim();
  const direction = String(formData.get("direction") ?? "").trim();
  const orderRaw = String(formData.get("order") ?? "").trim();

  let next: string[] | null = null;
  if (orderRaw) {
    try {
      const parsed = JSON.parse(orderRaw) as unknown;
      if (Array.isArray(parsed) && parsed.every((item) => typeof item === "string")) {
        next = parsed.map((item) => item.trim()).filter(Boolean);
      }
    } catch {
      next = null;
    }
  }

  if (!next) {
    if (!slug || (direction !== "up" && direction !== "down")) return;
    const order = await resolveInsightOrder();
    const index = order.indexOf(slug);
    if (index < 0) return;
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= order.length) return;
    next = [...order];
    [next[index], next[target]] = [next[target], next[index]];
  }

  if (!next.length) return;
  await saveInsightOrder(next);
  // Public pages only — CRM list already updated optimistically on the client.
  revalidatePath("/insights");
  revalidatePath("/");
}

export async function uploadMedia(formData: FormData) {
  await requireCms();
  const file = formData.get("file");
  if (!(file instanceof File) || !file.size) redirect("/crm/cms/media?error=invalid");
  const ext = extname(file.name || "").toLowerCase() || ".bin";
  const allowed = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".pdf"]);
  if (!allowed.has(ext)) redirect("/crm/cms/media?error=type");
  const name = `${randomToken(8)}${ext}`;
  const dir = join(process.cwd(), "public", "media", "cms");
  mkdirSync(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  writeFileSync(join(dir, name), buffer);
  const db = await cmsDb();
  await db.cmsMedia.create({
    data: {
      filename: file.name,
      path: `/media/cms/${name}`,
      alt: String(formData.get("alt") ?? "").trim(),
      caption: String(formData.get("caption") ?? "").trim(),
      mime: file.type || "application/octet-stream",
      size: file.size,
    },
  });
  revalidatePath("/crm/cms/media");
  redirect("/crm/cms/media?saved=1");
}

export async function updateMedia(formData: FormData) {
  await requireCms();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const db = await cmsDb();
  await db.cmsMedia.update({
    where: { id },
    data: {
      alt: String(formData.get("alt") ?? "").trim(),
      caption: String(formData.get("caption") ?? "").trim(),
    },
  });
  revalidatePath("/crm/cms/media");
}

export async function deleteMedia(formData: FormData) {
  await requireCms();
  const id = String(formData.get("id") ?? "");
  const path = String(formData.get("path") ?? "");
  const db = await cmsDb();
  await db.cmsMedia.delete({ where: { id } }).catch(() => undefined);
  if (path.startsWith("/media/cms/")) {
    try {
      unlinkSync(join(process.cwd(), "public", path));
    } catch {
      // File may already be gone.
    }
  }
  revalidatePath("/crm/cms/media");
}

export async function createRedirect(formData: FormData) {
  await requireCms();
  const fromPath = String(formData.get("fromPath") ?? "").trim();
  const toPath = String(formData.get("toPath") ?? "").trim();
  const statusCode = Number(formData.get("statusCode") ?? 301) || 301;
  if (!fromPath.startsWith("/") || !toPath) redirect("/crm/cms/redirects?error=invalid");
  const db = await cmsDb();
  try {
    await db.cmsRedirect.create({
      data: { fromPath, toPath, statusCode, active: true },
    });
  } catch {
    redirect("/crm/cms/redirects?error=exists");
  }
  await refreshCmsFiles();
  revalidatePath("/crm/cms/redirects");
  redirect("/crm/cms/redirects?saved=1");
}

export async function toggleRedirect(formData: FormData) {
  await requireCms();
  const id = String(formData.get("id") ?? "");
  const active = formData.get("active") === "1";
  const db = await cmsDb();
  await db.cmsRedirect.update({ where: { id }, data: { active } });
  await refreshCmsFiles();
  revalidatePath("/crm/cms/redirects");
}

export async function deleteRedirect(formData: FormData) {
  await requireCms();
  const id = String(formData.get("id") ?? "");
  const db = await cmsDb();
  await db.cmsRedirect.delete({ where: { id } }).catch(() => undefined);
  await refreshCmsFiles();
  revalidatePath("/crm/cms/redirects");
}

export async function saveGlobals(formData: FormData) {
  await requireCms();
  const db = await cmsDb();
  const existing = parseSiteGlobals((await db.cmsSetting.findUnique({ where: { id: "site" } }))?.value);
  const value = JSON.stringify({
    ...existing,
    defaultOg: String(formData.get("defaultOg") ?? "").trim(),
    siteLine: String(formData.get("siteLine") ?? "").trim(),
    canonicalHost: String(formData.get("canonicalHost") ?? SITE).trim() || SITE,
  });
  await db.cmsSetting.upsert({
    where: { id: "site" },
    create: { id: "site", value },
    update: { value },
  });
  revalidatePath("/crm/cms/globals");
  revalidatePath("/", "layout");
  redirect("/crm/cms/globals?saved=1");
}

function revalidateContactPublic() {
  revalidatePath("/crm/cms/contacts");
  revalidatePath("/", "layout");
  revalidatePath("/contact-us");
  revalidatePath("/en/contact-us");
  revalidatePath("/ru/contact-us");
  revalidatePath("/zh/contact-us");
}

async function storeContactImage(file: File) {
  const ext = extname(file.name || "").toLowerCase() || "";
  if (!CONTACT_IMAGE_TYPES.has(ext) || file.size > MAX_CONTACT_IMAGE_BYTES) return "";
  const name = `${randomToken(8)}${ext}`;
  const dir = join(process.cwd(), "public", "media", "cms");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, name), Buffer.from(await file.arrayBuffer()));
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
  return path;
}

export async function saveContact(formData: FormData): Promise<ContactSaveResult> {
  await requireCms();
  const input = inputFromForm(formData);
  const locationFile = formData.get("locationImageFile");
  const consultantFile = formData.get("consultantImageFile");
  const hasLocationFile = locationFile instanceof File && locationFile.size > 0;
  const hasConsultantFile = consultantFile instanceof File && consultantFile.size > 0;
  if (hasLocationFile) {
    const path = await storeContactImage(locationFile);
    if (!path) return { ok: false, error: "invalid_image" };
    input.locationImage = path;
  }
  if (hasConsultantFile) {
    const path = await storeContactImage(consultantFile);
    if (!path) return { ok: false, error: "invalid_image" };
    input.consultantImage = path;
  }
  if (formData.get("clearLocationImage") === "1" && !hasLocationFile) input.locationImage = "";
  if (formData.get("clearConsultantImage") === "1" && !hasConsultantFile) input.consultantImage = "";

  const invalid = validateContactInput(input);
  if (invalid) return { ok: false, error: invalid };

  const {
    clearPrimaryExcept,
    contactCount,
    findContact,
    findPrimaryContact,
    insertContact,
    updateContactRow,
  } = await import("./contact-store");
  const count = await contactCount();
  const makePrimary = input.isPrimary || count === 0 || (Boolean(input.id) && count === 1);
  const publicData = publicFieldsFromInput({ ...input, isPrimary: makePrimary });

  let id = input.id ?? "";
  if (id) {
    const existing = await findContact(id);
    if (!existing) return { ok: false, error: "missing" };
    await updateContactRow(id, { ...publicData, adminNotes: input.adminNotes, sortOrder: existing.sortOrder });
  } else {
    const created = await insertContact({ ...publicData, adminNotes: input.adminNotes, sortOrder: count });
    id = created.id;
  }

  if (makePrimary) {
    await clearPrimaryExcept(id);
    await updateContactRow(id, { isPrimary: true });
  } else if (!(await findPrimaryContact())) {
    await updateContactRow(id, { isPrimary: true });
  }

  revalidateContactPublic();
  return { ok: true, id };
}

export async function setPrimaryContact(formData: FormData) {
  await requireCms();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  const { clearAllPrimary, findContact, updateContactRow } = await import("./contact-store");
  const existing = await findContact(id);
  if (!existing) return;
  await clearAllPrimary();
  await updateContactRow(id, { isPrimary: true });
  revalidateContactPublic();
  redirect(`/crm/cms/contacts?id=${id}&primary=1`);
}

export async function deleteContact(formData: FormData) {
  await requireCms();
  const id = String(formData.get("id") ?? "").trim();
  const { contactCount, deleteContactRow, findContact, findPrimaryContact, listContactRows, updateContactRow } =
    await import("./contact-store");
  const existing = await findContact(id);
  if (!existing) redirect("/crm/cms/contacts?error=missing");
  const count = await contactCount();
  if (existing.isPrimary && count === 1) redirect("/crm/cms/contacts?error=last_primary");
  await deleteContactRow(id);
  if (existing.isPrimary) {
    const next = (await listContactRows())[0] ?? (await findPrimaryContact());
    if (next) await updateContactRow(next.id, { isPrimary: true });
  }
  revalidateContactPublic();
  redirect("/crm/cms/contacts?deleted=1");
}
