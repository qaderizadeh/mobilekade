import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin/auth";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  const { name, slug, shortDesc, price, comparePrice, stock, categoryId, brandId, images, specs, isActive, isFeatured } = body;
  if (!name || !slug || !categoryId) {
    return NextResponse.json({ error: "نام، اسلاگ و دسته الزامی است" }, { status: 400 });
  }
  const exists = await prisma.product.findUnique({ where: { slug } });
  if (exists) return NextResponse.json({ error: "این اسلاگ قبلاً استفاده شده" }, { status: 400 });

  const p = await prisma.product.create({
    data: {
      name,
      slug,
      shortDesc: shortDesc || null,
      description: shortDesc || null,
      price: Number(price) || 0,
      comparePrice: comparePrice ? Number(comparePrice) : null,
      stock: Number(stock) || 0,
      categoryId,
      brandId: brandId || null,
      images: JSON.stringify(images ?? []),
      specs: specs && Object.keys(specs).length ? JSON.stringify(specs) : null,
      isActive: isActive ?? true,
      isFeatured: isFeatured ?? false,
    },
  });
  return NextResponse.json({ ok: true, id: p.id });
}
