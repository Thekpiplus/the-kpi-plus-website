"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/crm/auth";
import { hasModule } from "@/lib/crm/modules";
import { isFullAccessRole } from "@/lib/crm/roles";
import { normalizeFaqRoute, resolveFaqRouteKey, type FaqItem } from "@/lib/faqs";
import { deleteFaqSet, saveFaqSet } from "./faq-store";

async function requireCms() {
  const user = await requireUser();
  if (!isFullAccessRole(user.role) && !hasModule(user, "cms")) {
    throw new Error("Forbidden");
  }
  return user;
}

function itemsFromForm(formData: FormData): FaqItem[] {
  const questions = formData.getAll("q").map((value) => String(value ?? ""));
  const answers = formData.getAll("a").map((value) => String(value ?? ""));
  const length = Math.max(questions.length, answers.length);
  const items: FaqItem[] = [];
  for (let index = 0; index < length; index += 1) {
    const q = (questions[index] ?? "").trim();
    const a = (answers[index] ?? "").trim();
    if (!q && !a) continue;
    items.push({ q, a });
  }
  return items;
}

export async function saveFaqsInline(formData: FormData): Promise<{ ok: true; route: string } | { ok: false; error: string }> {
  const user = await requireCms();
  const route = normalizeFaqRoute(resolveFaqRouteKey(String(formData.get("route") ?? "")));
  if (!route) return { ok: false, error: "invalid" };
  const items = itemsFromForm(formData);
  await saveFaqSet(route, items, user.id);
  revalidatePath("/crm/cms/faqs");
  revalidatePath("/crm/cms/faqs/edit");
  revalidatePath(route === "/" ? "/" : route);
  revalidatePath(route === "/" ? "/" : route, "page");
  revalidatePath("/", "layout");
  return { ok: true, route };
}

export async function saveFaqs(formData: FormData) {
  const result = await saveFaqsInline(formData);
  if (!result.ok) redirect("/crm/cms/faqs?error=invalid");
  redirect(`/crm/cms/faqs/edit?route=${encodeURIComponent(result.route)}&saved=1`);
}

export async function resetFaqsToCode(formData: FormData) {
  await requireCms();
  const route = normalizeFaqRoute(resolveFaqRouteKey(String(formData.get("route") ?? "")));
  if (!route) redirect("/crm/cms/faqs?error=invalid");
  await deleteFaqSet(route);
  revalidatePath("/crm/cms/faqs");
  revalidatePath(route === "/" ? "/" : route);
  redirect(`/crm/cms/faqs/edit?route=${encodeURIComponent(route)}&reset=1`);
}
