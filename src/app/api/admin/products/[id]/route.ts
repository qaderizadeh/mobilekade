import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/admin/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const { name, slug, shortDesc, price, comparePrice, stock, categoryId, brandId, images, specs, isActive, isFeatured } = body;

  const dup = await prisma.product.findFirst({ where: { slug, NOT: { id } } });
  if (dup) return NextResponse.json({ error: "اسلاگ تکراری است" }, { status: 400 });

  await prisma.product.update({
    where: { id },
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
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  // soft delete to preserve order history
  await prisma.product.update({
    where: { id },
    data: { isActive: false, stock: 0 },
  });
  return NextResponse.json({ ok: true });
}
