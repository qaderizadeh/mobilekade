import { Suspense } from "react";
import Link from "next/link";
import { SearchBox } from "@/components/product/SearchBox";
import { SortBar } from "@/components/product/SortBar";
import { ProductGrid } from "@/components/product/ProductGrid";
import { listProducts } from "@/lib/listQuery";
import { formatNumber } from "@/lib/format";

export const metadata = { title: "جستجو" };

type SearchParams = { q?: string; sort?: string; page?: string };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim();
  const sort = (sp.sort as any) ?? "newest";
  const page = Number(sp.page ?? 1);

  const data = q
    ? await listProducts({ q, sort, page })
    : { items: [], total: 0, page: 1, perPage: 24, totalPages: 0 };

  return (
    <div className="mx-auto max-w-6xl pb-6">
      <div className="sticky top-14 z-20 border-b border-line bg-surface-2/95 px-4 py-3 backdrop-blur">
        <Suspense fallback={<div className="h-12" />}>
          <SearchBox autoFocus={!q} />
        </Suspense>
      </div>

      {q ? (
        <>
          <div className="flex items-center justify-between px-4 pt-3">
            <h1 className="text-[13px] text-ink-700">
              نتایج جستجو برای:{" "}
              <span className="font-bold text-ink-900">«{q}»</span>
            </h1>
            <span className="text-[11px] text-ink-500">
              {formatNumber(data.total)} کالا
            </span>
          </div>

          <SortBar />

          <div className="px-4">
            <ProductGrid
              products={data.items}
              emptyMessage="برای این جستجو محصولی پیدا نشد. عبارت دیگری را امتحان کنید."
            />
          </div>
        </>
      ) : (
        <div className="px-4 py-10">
          <h2 className="mb-3 text-sm font-bold text-ink-900">
            جستجوهای پرطرفدار
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              "قاب آیفون",
              "گلس سامسونگ",
              "شارژر GaN",
              "پاوربانک انکر",
              "هندزفری بی‌سیم",
              "کابل تایپ سی",
              "بند اپل واچ",
            ].map((s) => (
              <Link
                key={s}
                href={`/search?q=${encodeURIComponent(s)}`}
                className="rounded-pill border border-line bg-white px-3 py-2 text-[12px] text-ink-700"
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
