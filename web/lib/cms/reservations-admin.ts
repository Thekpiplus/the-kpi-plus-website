import { currentUser } from "@/lib/crm/auth";
import { hasModule } from "@/lib/crm/modules";
import { isFullAccessRole } from "@/lib/crm/roles";

export async function isReservationsAdminViewer() {
  try {
    const user = await currentUser();
    if (!user) return false;
    return isFullAccessRole(user.role) || hasModule(user, "cms");
  } catch {
    return false;
  }
}
