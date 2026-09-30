"use server";

import { mkdirSync, unlinkSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import { hasModule } from "@/lib/crm/modules";
import { randomToken } from "@/lib/crm/security";
import { SITE } from "@/lib/seo";
import { bodyFromMarkdown, documentPath, slugify } from "./body";
import { isLockedRoute } from "./locked";
import { cmsDb, documentById, refreshCmsFiles } from "./queries";

async function requireCms() {
  const user = await requireUser();
  if (user.role !== "owner" && !hasModule(user, "cms")) redirect("/crm?error=forbidden");
  return user;
}

function revalidatePublic(path: string) {
  revalidatePath("/crm/cms");
  revalidatePath("/crm/cms/pages");
  revalidatePath("/crm/cms/insights");
  revalidatePath("/crm/cms/media");
  revalidatePath("/crm/cms/redirects");
  revalidatePath("/crm/cms/globals");
  revalidatePath("/", "layout");
  revalidatePath(path);
  if (path.startsWith("/insights")) revalidatePath("/insights");
}

function formDocument(formData: FormData, kind: "page" | "insight") {
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? title));
  const locale = String(formData.get("locale") ?? "th");
  const status = String(formData.get("status") ?? "draft");
  const scheduledRaw = String(formData.get("scheduledAt") ?? "").trim();
  const scheduledAt = scheduledRaw ? new Date(scheduledRaw) : null;
  const published = status === "published" || (status === "scheduled" && scheduledAt && scheduledAt <= new Date());
  return {
    kind,
    title,
    slug,
    locale,
    status: published && status === "scheduled" ? "published" : status,
    template: String(formData.get("template") ?? (kind === "insight" ? "insight" : "general")),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    body: bodyFromMarkdown(String(formData.get("body") ?? "")),
    featuredImage: String(formData.get("featuredImage") ?? "").trim(),
    imageAlt: String(formData.get("imageAlt") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    tags: String(formData.get("tags") ?? "").trim(),
    author: String(formData.get("author") ?? "").trim(),
    seoTitle: String(formData.get("seoTitle") ?? "").trim(),
    metaDescription: String(formData.get("metaDescription") ?? "").trim(),
    canonical: String(formData.get("canonical") ?? "").trim(),
    ogImage: String(formData.get("ogImage") ?? "").trim(),
    noindex: formData.get("noindex") === "1",
    showInMenu: formData.get("showInMenu") === "1",
    menu: String(formData.get("menu") ?? "none"),
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

export async function createDocument(formData: FormData) {
  const user = await requireCms();
  const kind = String(formData.get("kind") ?? "page") === "insight" ? "insight" : "page";
  const data = formDocument(formData, kind);
  const listPath = kind === "insight" ? "/crm/cms/insights" : "/crm/cms/pages";
  if (!data.title || !data.slug) redirect(`${listPath}/new?error=invalid`);
  const path = collisionPath(kind, data.slug, data.locale);
  if (
    isLockedRoute(path) ||
    (path.startsWith("/insights") && kind === "page") ||
    /^(?:\/admin|\/crm|\/partners|\/api)(?:\/|$)/.test(path)
  ) {
    redirect(`${listPath}/new?error=locked`);
  }
  const db = await cmsDb();
  try {
    const created = await db.cmsDocument.create({
      data: { ...data, updatedBy: user.email },
    });
    await refreshCmsFiles();
    revalidatePublic(path);
    redirect(`${listPath}/${created.id}`);
  } catch (error) {
    if (isNextRedirect(error)) throw error;
    redirect(`${listPath}/new?error=exists`);
  }
}

export async function updateDocument(formData: FormData) {
  const user = await requireCms();
  const id = String(formData.get("id") ?? "");
  const existing = await documentById(id);
  if (!existing) redirect("/crm/cms?error=missing");
  const kind = existing.kind === "insight" ? "insight" : "page";
  const data = formDocument(formData, kind);
  const listPath = kind === "insight" ? "/crm/cms/insights" : "/crm/cms/pages";
  if (!data.title || !data.slug) redirect(`${listPath}/${id}?error=invalid`);
  const path = collisionPath(kind, data.slug, data.locale);
  if (isLockedRoute(path) || (path.startsWith("/insights") && kind === "page") || /^(?:\/admin|\/crm|\/partners|\/api)(?:\/|$)/.test(path)) {
    redirect(`${listPath}/${id}?error=locked`);
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
  redirect(`${listPath}/${id}?saved=1`);
}

export async function trashDocument(formData: FormData) {
  await requireCms();
  const id = String(formData.get("id") ?? "");
  const existing = await documentById(id);
  if (!existing) redirect("/crm/cms?error=missing");
  const db = await cmsDb();
  await db.cmsDocument.update({
    where: { id },
    data: { trashedAt: new Date(), status: "draft", showInMenu: false },
  });
  await refreshCmsFiles();
  revalidatePublic(documentPath(existing));
  redirect(existing.kind === "insight" ? "/crm/cms/insights?deleted=1" : "/crm/cms/pages?deleted=1");
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
  const value = JSON.stringify({
    defaultOg: String(formData.get("defaultOg") ?? "").trim(),
    siteLine: String(formData.get("siteLine") ?? "").trim(),
    canonicalHost: String(formData.get("canonicalHost") ?? SITE).trim() || SITE,
  });
  const db = await cmsDb();
  await db.cmsSetting.upsert({
    where: { id: "site" },
    create: { id: "site", value },
    update: { value },
  });
  revalidatePath("/crm/cms/globals");
  redirect("/crm/cms/globals?saved=1");
}
