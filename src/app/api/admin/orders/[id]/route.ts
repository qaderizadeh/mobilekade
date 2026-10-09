import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const { status } = await req.json();
  const allowed = ["pending","paid","processing","shipped","delivered","cancelled"];
  if (!allowed.includes(status)) {
    return NextResponse.json({ error: "وضعیت نامعتبر" }, { status: 400 });
  }
  await prisma.order.update({ where: { id }, data: { status } });
  return NextResponse.json({ ok: true });
}
