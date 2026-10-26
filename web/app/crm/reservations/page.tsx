import { redirect } from "next/navigation";
import { ReservationQueue } from "@/components/reservations-ops/ReservationQueue";
import { PageHeader } from "@/components/crm/ui/PageHeader";
import { requireUser } from "@/lib/crm/auth";
import { hasModule } from "@/lib/crm/modules";
import { staffDirectory } from "@/lib/crm/queries";
import { isFullAccessRole } from "@/lib/crm/roles";
import { canViewReservationGuestData } from "@/lib/reservations-ops/privacy";
import { listReservationOperations } from "@/lib/reservations-ops/queries";

export default async function ReservationOperationsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string; status?: string; channel?: string; assigneeId?: string }>;
}) {
  const user = await requireUser();
  if (!isFullAccessRole(user.role) && !hasModule(user, "reservations")) redirect("/crm?error=forbidden");
  const filters = await searchParams;
  const [items, staff] = await Promise.all([
    listReservationOperations(filters, user),
    staffDirectory().catch(() => [] as Array<{ id: string; name: string }>),
  ]);

  return (
    <div className="crm-ops-page">
      <PageHeader
        eyebrow="Reservation Operations"
        title="คิวงานจอง"
        description="Inquiry, Booking, Modification, Cancellation และ Confirmation — ข้อมูลแขกถูกปกปิดจนกว่าผู้มีสิทธิ์จะเปิดดู"
      />
      <ReservationQueue
        items={items}
        staff={staff.map((item) => ({ id: item.id, name: item.name }))}
        canRevealGuest={canViewReservationGuestData(user)}
        filters={filters}
      />
    </div>
  );
}
