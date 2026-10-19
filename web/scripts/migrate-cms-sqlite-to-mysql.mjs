import "dotenv/config";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";

const require = createRequire(import.meta.url);
const Database = require("better-sqlite3");

const root = resolve(import.meta.dirname, "..");
const sqlite = new Database(resolve(root, "prisma", "dev.db"), { readonly: true });
const prisma = new PrismaClient();

function toDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function asBool(value) {
  return value === true || value === 1 || value === "1";
}

/** Unwrap bodies that were accidentally saved as JSON-inside-paragraph. */
function normalizeBody(raw) {
  let current = String(raw ?? "[]");
  for (let i = 0; i < 5; i += 1) {
    const trimmed = current.trim();
    if (!trimmed.startsWith("[")) break;
    try {
      const parsed = JSON.parse(trimmed);
      if (!Array.isArray(parsed)) break;
      if (
        parsed.length === 1 &&
        parsed[0]?.type === "p" &&
        typeof parsed[0]?.text === "string" &&
        parsed[0].text.trim().startsWith("[")
      ) {
        current = parsed[0].text;
        continue;
      }
      return JSON.stringify(parsed);
    } catch {
      break;
    }
  }
  return current;
}

async function main() {
  const docs = sqlite.prepare("SELECT * FROM CmsDocument").all();
  const settings = sqlite.prepare("SELECT * FROM CmsSetting").all();
  console.log("sqlite_docs", docs.length);

  let upserted = 0;
  for (const doc of docs) {
    const data = {
      id: String(doc.id),
      kind: String(doc.kind),
      title: String(doc.title ?? ""),
      slug: String(doc.slug ?? ""),
      locale: String(doc.locale ?? "th"),
      status: String(doc.status ?? "draft"),
      template: String(doc.template ?? "general"),
      excerpt: String(doc.excerpt ?? ""),
      body: normalizeBody(doc.body),
      featuredImage: String(doc.featuredImage ?? ""),
      imageAlt: String(doc.imageAlt ?? ""),
      category: String(doc.category ?? ""),
      tags: String(doc.tags ?? ""),
      author: String(doc.author ?? ""),
      seoTitle: String(doc.seoTitle ?? ""),
      metaDescription: String(doc.metaDescription ?? ""),
      canonical: String(doc.canonical ?? ""),
      ogImage: String(doc.ogImage ?? ""),
      noindex: asBool(doc.noindex),
      showInMenu: asBool(doc.showInMenu),
      menu: String(doc.menu ?? "none"),
      menuLabel: String(doc.menuLabel ?? ""),
      menuParent: String(doc.menuParent ?? ""),
      menuPosition: Number(doc.menuPosition ?? 0),
      publishedAt: toDate(doc.publishedAt),
      scheduledAt: toDate(doc.scheduledAt),
      trashedAt: toDate(doc.trashedAt),
      updatedBy: String(doc.updatedBy ?? ""),
      createdAt: toDate(doc.createdAt) ?? new Date(),
      updatedAt: toDate(doc.updatedAt) ?? new Date(),
    };
    await prisma.cmsDocument.upsert({
      where: { id: data.id },
      create: data,
      update: {
        kind: data.kind,
        title: data.title,
        slug: data.slug,
        locale: data.locale,
        status: data.status,
        template: data.template,
        excerpt: data.excerpt,
        body: data.body,
        featuredImage: data.featuredImage,
        imageAlt: data.imageAlt,
        category: data.category,
        tags: data.tags,
        author: data.author,
        seoTitle: data.seoTitle,
        metaDescription: data.metaDescription,
        canonical: data.canonical,
        ogImage: data.ogImage,
        noindex: data.noindex,
        showInMenu: data.showInMenu,
        menu: data.menu,
        menuLabel: data.menuLabel,
        menuParent: data.menuParent,
        menuPosition: data.menuPosition,
        publishedAt: data.publishedAt,
        scheduledAt: data.scheduledAt,
        trashedAt: data.trashedAt,
        updatedBy: data.updatedBy,
      },
    });
    upserted += 1;
    console.log("restored", data.kind, data.slug || "(home)", "body_ok", data.body.trim().startsWith("[{"));
  }

  for (const setting of settings) {
    await prisma.cmsSetting.upsert({
      where: { id: String(setting.id) },
      create: { id: String(setting.id), value: String(setting.value ?? "{}") },
      update: { value: String(setting.value ?? "{}") },
    });
  }

  // Fix any already-corrupted MySQL rows that are not in SQLite.
  const mysqlDocs = await prisma.cmsDocument.findMany({ select: { id: true, body: true, slug: true, kind: true } });
  for (const doc of mysqlDocs) {
    const next = normalizeBody(doc.body);
    if (next !== doc.body) {
      await prisma.cmsDocument.update({ where: { id: doc.id }, data: { body: next } });
      console.log("unwrapped", doc.kind, doc.slug || "(home)");
    }
  }

  console.log("done", { upserted, mysql: mysqlDocs.length });
}

main()
  .catch((error) => {
    console.error("ERR", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    sqlite.close();
    await prisma.$disconnect();
  });
