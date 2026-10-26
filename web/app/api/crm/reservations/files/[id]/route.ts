import { readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { NextResponse } from "next/server";
import { currentUser } from "@/lib/crm/auth";
import { prisma } from "@/lib/crm/db";
import { hasModule } from "@/lib/crm/modules";
import { isFullAccessRole } from "@/lib/crm/roles";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });
  if (!isFullAccessRole(user.role) && !hasModule(user, "reservations")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const { id } = await params;
  const attachment = await prisma().reservationOpAttachment.findUnique({ where: { id } }).catch(() => null);
  if (!attachment) return new NextResponse("Not found", { status: 404 });

  const root = resolve(process.cwd(), "private", "reservations-ops");
  const abs = resolve(process.cwd(), attachment.path);
  if (abs !== root && !abs.startsWith(`${root}${sep}`)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const buffer = await readFile(abs);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": attachment.mime || "application/octet-stream",
        "Content-Disposition": `inline; filename="${attachment.filename.replace(/"/g, "")}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
