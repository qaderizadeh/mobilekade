import { NextResponse } from "next/server";
import { signAdmin, ADMIN_COOKIE, getAdminPassword } from "@/lib/admin/auth";

export async function POST(req: Request) {
  const { password } = await req.json();
  if (password !== getAdminPassword()) {
    return NextResponse.json({ error: "رمز عبور اشتباه است" }, { status: 401 });
  }
  const token = await signAdmin();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
