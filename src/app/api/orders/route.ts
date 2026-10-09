import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { digitsOnly } from "@/lib/format";
import { getShippingMethods } from "@/lib/settings";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      receiver,
      phone,
      province,
      city,
      line1,
      postalCode,
      note,
      paymentMethod,
      shippingMethod,
      items,
    } = body;
    if (!receiver || !phone || !province || !city || !line1) {
      return NextResponse.json({ error: "اطلاعات آدرس ناقص است" }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "سبد خرید خالی است" }, { status: 400 });
    }
    if (!shippingMethod) {
      return NextResponse.json({ error: "روش ارسال انتخاب نشده" }, { status: 400 });
    }
    const productIds = items.map((i: any) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });
    if (products.length !== productIds.length) {
      return NextResponse.json({ error: "برخی کالاها موجود نیستند" }, { status: 400 });
    }
    let subtotal = 0;
    const lines: {
      productId: string;
      nameSnapshot: string;
      priceSnapshot: number;
      quantity: number;
    }[] = [];
    for (const item of items) {
      const p = products.find((x) => x.id === item.productId);
      if (!p) continue;
      const qty = Math.max(1, Number(item.quantity) || 1);
      if (qty > p.stock) {
        return NextResponse.json(
          { error: `موجودی «${p.name}» کافی نیست` },
          { status: 400 }
        );
      }
      subtotal += p.price * qty;
      lines.push({
        productId: p.id,
        nameSnapshot: p.name,
        priceSnapshot: p.price,
        quantity: qty,
      });
    }
    // Recompute shipping on server — never trust client price
    const availableMethods = await getShippingMethods(subtotal);
    const chosen = availableMethods.find((m) => m.id === shippingMethod);
    if (!chosen) {
      return NextResponse.json(
        { error: "روش ارسال انتخاب‌شده در دسترس نیست" },
        { status: 400 }
      );
    }
    const shipping = chosen.price;
    const discount = 0;
    const total = subtotal + shipping - discount;
    const orderNumber = "MK-" + Date.now().toString().slice(-8);
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          orderNumber,
          status: "pending",
          paymentMethod: paymentMethod === "card" ? "card" : "cod",
          shippingMethod: chosen.id,
          subtotal,
          shipping,
          discount,
          total,
          addressJson: JSON.stringify({
            receiver,
            phone: digitsOnly(phone),
            province,
            city,
            line1,
            postalCode: digitsOnly(postalCode || ""),
          }),
          note: note ?? null,
          items: { create: lines },
        },
      });
      for (const line of lines) {
        await tx.product.update({
          where: { id: line.productId },
          data: {
            stock: { decrement: line.quantity },
            soldCount: { increment: line.quantity },
          },
        });
      }
      return created;
    });
    return NextResponse.json({ ok: true, orderNumber: order.orderNumber });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "خطای سرور، دوباره تلاش کنید" }, { status: 500 });
  }
}
