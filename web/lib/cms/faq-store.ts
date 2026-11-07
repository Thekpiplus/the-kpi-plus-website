import { prisma } from "@/lib/crm/db";
import {
  codeFaqRouteKeys,
  codeFaqsForRoute,
  normalizeFaqRoute,
  resolveFaqRouteKey,
  type FaqItem,
} from "@/lib/faqs";
import { ensureCmsSchema } from "./ensure";

export type CmsFaqSetRow = {
  id: string;
  route: string;
  itemsJson: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
};

type FaqClient = {
  cmsFaqSet: {
    findMany: (args?: object) => Promise<CmsFaqSetRow[]>;
    findUnique: (args: object) => Promise<CmsFaqSetRow | null>;
    upsert: (args: {
      where: { route: string };
      create: Record<string, unknown>;
      update: Record<string, unknown>;
    }) => Promise<CmsFaqSetRow>;
    delete: (args: { where: { route: string } }) => Promise<CmsFaqSetRow>;
  };
};

async function faqDb() {
  await ensureCmsSchema();
  return prisma() as unknown as FaqClient;
}

function newId() {
  return `faq_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function parseFaqItems(raw: string | null | undefined): FaqItem[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const row = item as { q?: unknown; a?: unknown };
        const q = typeof row.q === "string" ? row.q.trim() : "";
        const a = typeof row.a === "string" ? row.a.trim() : "";
        if (!q && !a) return null;
        return { q, a };
      })
      .filter((item): item is FaqItem => Boolean(item));
  } catch {
    return [];
  }
}

export function serializeFaqItems(items: FaqItem[]): string {
  return JSON.stringify(
    items
      .map((item) => ({ q: item.q.trim(), a: item.a.trim() }))
      .filter((item) => item.q || item.a),
  );
}

export async function listFaqSets(): Promise<CmsFaqSetRow[]> {
  try {
    const db = await faqDb();
    return db.cmsFaqSet.findMany({ orderBy: { route: "asc" } });
  } catch {
    return [];
  }
}

export async function getFaqSet(route: string): Promise<CmsFaqSetRow | null> {
  const key = normalizeFaqRoute(resolveFaqRouteKey(route));
  try {
    const db = await faqDb();
    return db.cmsFaqSet.findUnique({ where: { route: key } });
  } catch {
    return null;
  }
}

/** CMS override when a row exists; otherwise null (caller falls back to template/code). */
export async function loadCmsFaqsForRoute(route: string): Promise<FaqItem[] | null> {
  const row = await getFaqSet(route);
  if (!row) return null;
  return parseFaqItems(row.itemsJson);
}

export async function saveFaqSet(route: string, items: FaqItem[], updatedBy = "") {
  const key = normalizeFaqRoute(resolveFaqRouteKey(route));
  const db = await faqDb();
  const itemsJson = serializeFaqItems(items);
  return db.cmsFaqSet.upsert({
    where: { route: key },
    create: {
      id: newId(),
      route: key,
      itemsJson,
      updatedBy,
      updatedAt: new Date(),
    },
    update: {
      itemsJson,
      updatedBy,
      updatedAt: new Date(),
    },
  });
}

export async function deleteFaqSet(route: string) {
  const key = normalizeFaqRoute(resolveFaqRouteKey(route));
  const db = await faqDb();
  await db.cmsFaqSet.delete({ where: { route: key } }).catch(() => undefined);
}

export type FaqAdminRoute = {
  route: string;
  label: string;
  source: "cms" | "code" | "empty";
  count: number;
};

export async function listFaqAdminRoutes(): Promise<FaqAdminRoute[]> {
  const stored = await listFaqSets();
  const byRoute = new Map(stored.map((row) => [row.route, row]));
  const keys = new Set<string>([...codeFaqRouteKeys(), ...stored.map((row) => row.route)]);
  return [...keys]
    .map((route) => {
      const row = byRoute.get(route);
      if (row) {
        const items = parseFaqItems(row.itemsJson);
        return { route, label: routeLabel(route), source: "cms" as const, count: items.length };
      }
      const code = codeFaqsForRoute(route);
      return {
        route,
        label: routeLabel(route),
        source: code.length ? ("code" as const) : ("empty" as const),
        count: code.length,
      };
    })
    .sort((a, b) => a.route.localeCompare(b.route));
}

export async function loadFaqEditorItems(route: string): Promise<{ items: FaqItem[]; source: "cms" | "code" | "empty" }> {
  const key = normalizeFaqRoute(resolveFaqRouteKey(route));
  const row = await getFaqSet(key);
  if (row) {
    return { items: parseFaqItems(row.itemsJson), source: "cms" };
  }
  const code = codeFaqsForRoute(key);
  return { items: code, source: code.length ? "code" : "empty" };
}

function routeLabel(route: string) {
  if (route === "/") return "หน้าแรก (ไทย)";
  if (route === "/en") return "Home (EN)";
  if (route === "/ru") return "Home (RU)";
  if (route === "/zh") return "Home (ZH)";
  return route;
}
