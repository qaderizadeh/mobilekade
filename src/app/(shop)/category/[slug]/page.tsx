import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { listProducts } from "@/lib/listQuery";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SortBar } from "@/components/product/SortBar";
import { formatNumber } from "@/lib/format";

type SearchParams = { sort?: string; page?: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = await prisma.category.findUnique({ where: { slug } });
  return { title: cat?.name ?? "دسته‌بندی" };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const data = await listProducts({
    categorySlug: slug,
    sort: (sp.sort as any) ?? "newest",
    page: Number(sp.page ?? 1),
  });

  return (
    <div className="mx-auto max-w-6xl pb-6">
      <nav className="flex items-center gap-1 px-4 pt-3 text-[11px] text-ink-500">
        <Link href="/">خانه</Link>
        <span className="px-1">/</span>
        <Link href="/categories">دسته‌بندی‌ها</Link>
        <span className="px-1">/</span>
        <span className="text-ink-700">{category.name}</span>
      </nav>

      <div className="flex items-center justify-between px-4 pt-2">
        <h1 className="text-lg font-extrabold text-ink-900">{category.name}</h1>
        <span className="text-[11px] text-ink-500">
          {formatNumber(data.total)} کالا
        </span>
      </div>

      <SortBar />

      <div className="px-4">
        <ProductGrid products={data.items} />
      </div>

      <Pagination page={data.page} totalPages={data.totalPages} baseQuery={`sort=${sp.sort ?? "newest"}`} basePath={`/category/${slug}`} />
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  baseQuery,
  basePath,
}: {
  page: number;
  totalPages: number;
  baseQuery: string;
  basePath: string;
}) {
  if (totalPages <= 1) return null;
  const prev = page > 1;
  const next = page < totalPages;
  return (
    <div className="mt-8 flex items-center justify-center gap-3 px-4">
      {prev ? (
        <Link
          href={`${basePath}?${baseQuery}&page=${page - 1}`}
          className="rounded-xl border border-line bg-white px-4 py-2 text-[13px] font-medium"
        >
          قبلی
        </Link>
      ) : (
        <span className="rounded-xl border border-line bg-surface-2 px-4 py-2 text-[13px] text-ink-500">
          قبلی
        </span>
      )}
      <span className="text-[12px] text-ink-500">
        صفحه {formatNumber(page)} از {formatNumber(totalPages)}
      </span>
      {next ? (
        <Link
          href={`${basePath}?${baseQuery}&page=${page + 1}`}
          className="rounded-xl border border-line bg-white px-4 py-2 text-[13px] font-medium"
        >
          بعدی
        </Link>
      ) : (
        <span className="rounded-xl border border-line bg-surface-2 px-4 py-2 text-[13px] text-ink-500">
          بعدی
        </span>
      )}
    </div>
  );
}
