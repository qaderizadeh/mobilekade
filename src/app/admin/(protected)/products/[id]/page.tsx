import { notFound } from "next/navigation";
import { readdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { ProductForm, type ProductFormValues } from "@/components/admin/ProductForm";

export const metadata = { title: "ویرایش محصول" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.brand.findMany(),
  ]);
  if (!product) notFound();

  const images: string[] = product.images ? JSON.parse(product.images) : [];
  const specsObj: Record<string, string> = product.specs ? JSON.parse(product.specs) : {};
  const specs = Object.entries(specsObj).map(([key, value]) => ({ key, value }));

  const initial: ProductFormValues = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDesc: product.shortDesc ?? "",
    price: product.price,
    comparePrice: product.comparePrice,
    stock: product.stock,
    categoryId: product.categoryId,
    brandId: product.brandId,
    images,
    specs,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
  };

  const dir = path.join(process.cwd(), "public/images/products");
  let presetImages: string[] = [];
  try {
    const files = await readdir(dir);
    presetImages = files
      .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .map((f) => `/images/products/${f}`);
  } catch {}

  return (
    <ProductForm
      initial={initial}
      categories={categories}
      brands={brands}
      presetImages={presetImages}
    />
  );
}
