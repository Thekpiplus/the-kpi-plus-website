import { readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { NextResponse } from "next/server";
import { canOpenSystems } from "@/lib/systems-ops/access";
import { getSystemsSubtaskFile } from "@/lib/systems-ops/queries";
import { currentUser } from "@/lib/crm/auth";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await currentUser();
  if (!user) return new NextResponse("Unauthorized", { status: 401 });
  if (!canOpenSystems(user)) return new NextResponse("Forbidden", { status: 403 });

  const { id } = await params;
  const attachment = await getSystemsSubtaskFile(id);
  if (!attachment) return new NextResponse("Not found", { status: 404 });

  const root = resolve(process.cwd(), "private", "systems-ops");
  const abs = resolve(process.cwd(), String(attachment.path ?? ""));
  if (abs !== root && !abs.startsWith(`${root}${sep}`)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const buffer = await readFile(abs);
    const filename = String(attachment.filename ?? "file").replace(/"/g, "");
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": String(attachment.mime || "application/octet-stream"),
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
