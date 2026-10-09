import { NextResponse } from "next/server";
import { getShippingMethods } from "@/lib/settings";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const subtotal = Number(url.searchParams.get("subtotal") ?? 0);
  const methods = await getShippingMethods(subtotal);
  return NextResponse.json({ methods });
}
