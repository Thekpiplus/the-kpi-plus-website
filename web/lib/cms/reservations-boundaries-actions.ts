"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cmsDb } from "@/lib/cms/queries";
import { hasModule } from "@/lib/crm/modules";
import { isFullAccessRole } from "@/lib/crm/roles";
import { requireUser } from "@/lib/crm/auth";
import {
  RESERVATIONS_BOUNDARIES_SETTING,
  boundariesFromForm,
  serializeReservationBoundaries,
} from "@/lib/cms/reservations-boundaries";

async function requireCms() {
  const user = await requireUser();
  if (!isFullAccessRole(user.role) && !hasModule(user, "cms")) redirect("/crm?error=forbidden");
  return user;
}

export async function saveReservationBoundaries(formData: FormData) {
  await requireCms();
  const boundaries = boundariesFromForm(formData);
  const db = await cmsDb();
  await db.cmsSetting.upsert({
    where: { id: RESERVATIONS_BOUNDARIES_SETTING },
    create: { id: RESERVATIONS_BOUNDARIES_SETTING, value: serializeReservationBoundaries(boundaries) },
    update: { value: serializeReservationBoundaries(boundaries) },
  });
  revalidatePath("/crm/cms/reservations");
  revalidatePath("/solutions/outsourced-hotel-reservations");
  revalidatePath("/en/solutions/outsourced-hotel-reservations");
  revalidatePath("/ru/solutions/outsourced-hotel-reservations");
  revalidatePath("/zh/solutions/outsourced-hotel-reservations");
  redirect("/crm/cms/reservations?saved=1");
}
