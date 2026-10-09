import { readdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata = { title: "افزودن محصول" };

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.brand.findMany(),
  ]);

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
      categories={categories}
      brands={brands}
      presetImages={presetImages}
    />
  );
}
