import { prisma } from "@/lib/crm/db";
import { randomToken } from "@/lib/crm/security";
import type { CmsDocumentRow, CmsMediaRow, CmsRedirectRow, CmsSettingRow } from "./types";
import { asBool } from "./types";

function id(prefix = "c") {
  return `${prefix}${randomToken(10)}`;
}

function toDate(value: unknown) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

function mapDoc(row: Record<string, unknown>): CmsDocumentRow {
  return {
    id: String(row.id),
    kind: String(row.kind),
    title: String(row.title),
    slug: String(row.slug),
    locale: String(row.locale ?? "th"),
    status: String(row.status ?? "draft"),
    template: String(row.template ?? "general"),
    excerpt: String(row.excerpt ?? ""),
    body: String(row.body ?? "[]"),
    featuredImage: String(row.featuredImage ?? ""),
    imageAlt: String(row.imageAlt ?? ""),
    category: String(row.category ?? ""),
    tags: String(row.tags ?? ""),
    author: String(row.author ?? ""),
    seoTitle: String(row.seoTitle ?? ""),
    metaDescription: String(row.metaDescription ?? ""),
    canonical: String(row.canonical ?? ""),
    ogImage: String(row.ogImage ?? ""),
    noindex: asBool(row.noindex),
    showInMenu: asBool(row.showInMenu),
    menu: String(row.menu ?? "none"),
    menuParent: String(row.menuParent ?? ""),
    menuPosition: Number(row.menuPosition ?? 0),
    publishedAt: toDate(row.publishedAt),
    scheduledAt: toDate(row.scheduledAt),
    trashedAt: toDate(row.trashedAt),
    updatedBy: String(row.updatedBy ?? ""),
    createdAt: toDate(row.createdAt) ?? new Date(),
    updatedAt: toDate(row.updatedAt) ?? new Date(),
  };
}

function iso(value: Date | null | undefined) {
  return value ? value.toISOString() : null;
}

export function rawCmsClient(db: ReturnType<typeof prisma>) {
  return {
    cmsDocument: {
      async findMany(args: { where?: Record<string, unknown>; orderBy?: Record<string, string> } = {}) {
  const rows = await db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM "CmsDocument" WHERE "trashedAt" IS NULL`);
        let docs = rows.map(mapDoc);
        const where = args.where ?? {};
        if (where.kind) docs = docs.filter((item) => item.kind === where.kind);
        if (typeof where.status === "string") docs = docs.filter((item) => item.status === where.status);
        if (where.status && typeof where.status === "object" && Array.isArray((where.status as { in?: string[] }).in)) {
          const allowed = new Set((where.status as { in: string[] }).in);
          docs = docs.filter((item) => allowed.has(item.status));
        }
        if (where.trashedAt === null) docs = docs.filter((item) => !item.trashedAt);
        if (Array.isArray((where as { OR?: { title?: { contains: string }; slug?: { contains: string } }[] }).OR)) {
          const q = (where as { OR: { title?: { contains: string } }[] }).OR[0]?.title?.contains?.toLowerCase() ?? "";
          if (q) docs = docs.filter((item) => item.title.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q));
        }
        const order = args.orderBy ?? {};
        if (order.updatedAt === "desc") docs.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
        if (order.publishedAt === "desc") {
          docs.sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0));
        }
        if (order.createdAt === "desc") docs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        return docs;
      },
      async findUnique(args: { where: { id: string } }) {
        const rows = await db.$queryRawUnsafe<Record<string, unknown>[]>(
          `SELECT * FROM "CmsDocument" WHERE "id" = ?`,
          args.where.id,
        );
        return rows[0] ? mapDoc(rows[0]) : null;
      },
      async findFirst(args: { where?: Record<string, unknown> } = {}) {
        const all = await this.findMany(args);
        return all[0] ?? null;
      },
      async create(args: { data: Record<string, unknown> }) {
        const data = args.data;
        const rowId = String(data.id ?? id());
        const now = new Date();
        await db.$executeRawUnsafe(
          `INSERT INTO "CmsDocument" ("id","kind","title","slug","locale","status","template","excerpt","body","featuredImage","imageAlt","category","tags","author","seoTitle","metaDescription","canonical","ogImage","noindex","showInMenu","menu","menuParent","menuPosition","publishedAt","scheduledAt","trashedAt","updatedBy","createdAt","updatedAt")
           VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
          rowId,
          String(data.kind),
          String(data.title),
          String(data.slug),
          String(data.locale ?? "th"),
          String(data.status ?? "draft"),
          String(data.template ?? "general"),
          String(data.excerpt ?? ""),
          String(data.body ?? "[]"),
          String(data.featuredImage ?? ""),
          String(data.imageAlt ?? ""),
          String(data.category ?? ""),
          String(data.tags ?? ""),
          String(data.author ?? ""),
          String(data.seoTitle ?? ""),
          String(data.metaDescription ?? ""),
          String(data.canonical ?? ""),
          String(data.ogImage ?? ""),
          data.noindex ? 1 : 0,
          data.showInMenu ? 1 : 0,
          String(data.menu ?? "none"),
          String(data.menuParent ?? ""),
          Number(data.menuPosition ?? 0),
          iso(data.publishedAt as Date | null),
          iso(data.scheduledAt as Date | null),
          iso(data.trashedAt as Date | null),
          String(data.updatedBy ?? ""),
          iso(now),
          iso(now),
        );
        return (await this.findUnique({ where: { id: rowId } }))!;
      },
      async update(args: { where: { id: string }; data: Record<string, unknown> }) {
        const current = await this.findUnique({ where: { id: args.where.id } });
        if (!current) throw new Error("missing");
        const next = { ...current, ...args.data, updatedAt: new Date() } as CmsDocumentRow;
        await db.$executeRawUnsafe(
          `UPDATE "CmsDocument" SET "kind"=?, "title"=?, "slug"=?, "locale"=?, "status"=?, "template"=?, "excerpt"=?, "body"=?, "featuredImage"=?, "imageAlt"=?, "category"=?, "tags"=?, "author"=?, "seoTitle"=?, "metaDescription"=?, "canonical"=?, "ogImage"=?, "noindex"=?, "showInMenu"=?, "menu"=?, "menuParent"=?, "menuPosition"=?, "publishedAt"=?, "scheduledAt"=?, "trashedAt"=?, "updatedBy"=?, "updatedAt"=? WHERE "id"=?`,
          next.kind,
          next.title,
          next.slug,
          next.locale,
          next.status,
          next.template,
          next.excerpt,
          next.body,
          next.featuredImage,
          next.imageAlt,
          next.category,
          next.tags,
          next.author,
          next.seoTitle,
          next.metaDescription,
          next.canonical,
          next.ogImage,
          next.noindex ? 1 : 0,
          next.showInMenu ? 1 : 0,
          next.menu,
          next.menuParent,
          next.menuPosition,
          iso(next.publishedAt),
          iso(next.scheduledAt),
          iso(next.trashedAt),
          next.updatedBy,
          iso(next.updatedAt),
          args.where.id,
        );
        return next;
      },
      async delete(args: { where: { id: string } }) {
        const current = await this.findUnique({ where: { id: args.where.id } });
        await db.$executeRawUnsafe(`DELETE FROM "CmsDocument" WHERE "id"=?`, args.where.id);
        return current!;
      },
      async count(args: { where?: Record<string, unknown> } = {}) {
        const rows = await this.findMany({ where: args.where });
        return rows.length;
      },
    },
    cmsMedia: {
      async findMany() {
        const rows = await db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM "CmsMedia" ORDER BY "createdAt" DESC`);
        return rows.map((row) => ({
          id: String(row.id),
          filename: String(row.filename),
          path: String(row.path),
          alt: String(row.alt ?? ""),
          caption: String(row.caption ?? ""),
          mime: String(row.mime),
          size: Number(row.size ?? 0),
          createdAt: toDate(row.createdAt) ?? new Date(),
        })) as CmsMediaRow[];
      },
      async create(args: { data: Record<string, unknown> }) {
        const rowId = id("m");
        const now = new Date();
        await db.$executeRawUnsafe(
          `INSERT INTO "CmsMedia" ("id","filename","path","alt","caption","mime","size","createdAt") VALUES (?,?,?,?,?,?,?,?)`,
          rowId,
          String(args.data.filename),
          String(args.data.path),
          String(args.data.alt ?? ""),
          String(args.data.caption ?? ""),
          String(args.data.mime),
          Number(args.data.size ?? 0),
          iso(now),
        );
        return {
          id: rowId,
          filename: String(args.data.filename),
          path: String(args.data.path),
          alt: String(args.data.alt ?? ""),
          caption: String(args.data.caption ?? ""),
          mime: String(args.data.mime),
          size: Number(args.data.size ?? 0),
          createdAt: now,
        } as CmsMediaRow;
      },
      async update(args: { where: { id: string }; data: Record<string, unknown> }) {
        await db.$executeRawUnsafe(
          `UPDATE "CmsMedia" SET "alt"=?, "caption"=? WHERE "id"=?`,
          String(args.data.alt ?? ""),
          String(args.data.caption ?? ""),
          args.where.id,
        );
        const all = await this.findMany();
        return all.find((item) => item.id === args.where.id)!;
      },
      async delete(args: { where: { id: string } }) {
        const all = await this.findMany();
        const current = all.find((item) => item.id === args.where.id);
        await db.$executeRawUnsafe(`DELETE FROM "CmsMedia" WHERE "id"=?`, args.where.id);
        return current!;
      },
      async count() {
        const rows = await this.findMany();
        return rows.length;
      },
    },
    cmsRedirect: {
      async findMany() {
        const rows = await db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM "CmsRedirect" ORDER BY "createdAt" DESC`);
        return rows.map((row) => ({
          id: String(row.id),
          fromPath: String(row.fromPath),
          toPath: String(row.toPath),
          statusCode: Number(row.statusCode ?? 301),
          active: asBool(row.active),
          createdAt: toDate(row.createdAt) ?? new Date(),
        })) as CmsRedirectRow[];
      },
      async create(args: { data: Record<string, unknown> }) {
        const rowId = id("r");
        await db.$executeRawUnsafe(
          `INSERT INTO "CmsRedirect" ("id","fromPath","toPath","statusCode","active","createdAt") VALUES (?,?,?,?,?,?)`,
          rowId,
          String(args.data.fromPath),
          String(args.data.toPath),
          Number(args.data.statusCode ?? 301),
          args.data.active === false ? 0 : 1,
          iso(new Date()),
        );
        const all = await this.findMany();
        return all.find((item) => item.id === rowId)!;
      },
      async update(args: { where: { id: string }; data: Record<string, unknown> }) {
        if ("active" in args.data) {
          await db.$executeRawUnsafe(`UPDATE "CmsRedirect" SET "active"=? WHERE "id"=?`, args.data.active ? 1 : 0, args.where.id);
        }
        const all = await this.findMany();
        return all.find((item) => item.id === args.where.id)!;
      },
      async delete(args: { where: { id: string } }) {
        const all = await this.findMany();
        const current = all.find((item) => item.id === args.where.id);
        await db.$executeRawUnsafe(`DELETE FROM "CmsRedirect" WHERE "id"=?`, args.where.id);
        return current!;
      },
    },
    cmsSetting: {
      async findUnique(args: { where: { id: string } }) {
        const rows = await db.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM "CmsSetting" WHERE "id"=?`, args.where.id);
        const row = rows[0];
        if (!row) return null;
        return {
          id: String(row.id),
          value: String(row.value ?? "{}"),
          updatedAt: toDate(row.updatedAt) ?? new Date(),
        } as CmsSettingRow;
      },
      async upsert(args: { where: { id: string }; create: Record<string, unknown>; update: Record<string, unknown> }) {
        const existing = await this.findUnique({ where: { id: args.where.id } });
        const value = String((existing ? args.update.value : args.create.value) ?? "{}");
        if (existing) {
          await db.$executeRawUnsafe(`UPDATE "CmsSetting" SET "value"=?, "updatedAt"=? WHERE "id"=?`, value, iso(new Date()), args.where.id);
        } else {
          await db.$executeRawUnsafe(
            `INSERT INTO "CmsSetting" ("id","value","updatedAt") VALUES (?,?,?)`,
            args.where.id,
            value,
            iso(new Date()),
          );
        }
        return (await this.findUnique({ where: { id: args.where.id } }))!;
      },
    },
  };
}
