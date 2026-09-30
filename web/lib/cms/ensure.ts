import { prisma } from "@/lib/crm/db";

export async function ensureCmsSchema() {
  const db = prisma();
  await db.$executeRawUnsafe(`ALTER TABLE "User" ADD COLUMN "modules" TEXT NOT NULL DEFAULT ''`).catch(() => undefined);
  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "CmsDocument" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "kind" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "slug" TEXT NOT NULL,
      "locale" TEXT NOT NULL DEFAULT 'th',
      "status" TEXT NOT NULL DEFAULT 'draft',
      "template" TEXT NOT NULL DEFAULT 'general',
      "excerpt" TEXT NOT NULL DEFAULT '',
      "body" TEXT NOT NULL DEFAULT '[]',
      "featuredImage" TEXT NOT NULL DEFAULT '',
      "imageAlt" TEXT NOT NULL DEFAULT '',
      "category" TEXT NOT NULL DEFAULT '',
      "tags" TEXT NOT NULL DEFAULT '',
      "author" TEXT NOT NULL DEFAULT '',
      "seoTitle" TEXT NOT NULL DEFAULT '',
      "metaDescription" TEXT NOT NULL DEFAULT '',
      "canonical" TEXT NOT NULL DEFAULT '',
      "ogImage" TEXT NOT NULL DEFAULT '',
      "noindex" BOOLEAN NOT NULL DEFAULT false,
      "showInMenu" BOOLEAN NOT NULL DEFAULT false,
      "menu" TEXT NOT NULL DEFAULT 'none',
      "menuParent" TEXT NOT NULL DEFAULT '',
      "menuPosition" INTEGER NOT NULL DEFAULT 0,
      "publishedAt" DATETIME,
      "scheduledAt" DATETIME,
      "trashedAt" DATETIME,
      "updatedBy" TEXT NOT NULL DEFAULT '',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await db.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "CmsDocument_kind_slug_locale_key" ON "CmsDocument"("kind", "slug", "locale")`);
  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "CmsMedia" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "filename" TEXT NOT NULL,
      "path" TEXT NOT NULL,
      "alt" TEXT NOT NULL DEFAULT '',
      "caption" TEXT NOT NULL DEFAULT '',
      "mime" TEXT NOT NULL,
      "size" INTEGER NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "CmsRedirect" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "fromPath" TEXT NOT NULL,
      "toPath" TEXT NOT NULL,
      "statusCode" INTEGER NOT NULL DEFAULT 301,
      "active" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await db.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "CmsRedirect_fromPath_key" ON "CmsRedirect"("fromPath")`);
  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "CmsSetting" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "value" TEXT NOT NULL DEFAULT '{}',
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}
