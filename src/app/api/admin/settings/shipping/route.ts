import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin/auth";
import { SHIPPING_KEYS, setSetting } from "@/lib/settings";

export async function PATCH(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  const allowed = new Set<string>(Object.values(SHIPPING_KEYS));
  for (const [k, v] of Object.entries(body)) {
    if (allowed.has(k)) {
      await setSetting(k, String(v));
    }
  }
  return NextResponse.json({ ok: true });
}
