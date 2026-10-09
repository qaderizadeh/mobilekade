import Link from "next/link";
import { Plus, Pencil, Package, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatNumber, toFa } from "@/lib/format";
import { parseImages } from "@/lib/queries";

export const metadata = { title: "محصولات" };

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim();
  const products = await prisma.product.findMany({
    where: q
      ? { OR: [{ name: { contains: q } }, { slug: { contains: q } }] }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: { category: true, brand: true },
    take: 100,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-extrabold text-ink-900">محصولات</h1>
          <p className="mt-1 text-[12px] text-ink-500">
            {formatNumber(products.length)} محصول
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex h-10 items-center gap-2 rounded-xl bg-brand-600 px-4 text-[13px] font-bold text-white"
        >
          <Plus size={16} />
          افزودن محصول
        </Link>
      </div>

      <form className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2">
        <Search size={16} className="text-ink-500" />
        <input
          name="q"
          defaultValue={q}
          placeholder="جستجوی محصول…"
          className="h-9 flex-1 bg-transparent text-sm outline-none"
        />
      </form>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-10 text-center">
          <Package size={32} className="mx-auto text-ink-500" />
          <p className="mt-3 text-[13px] text-ink-500">محصولی یافت نشد</p>
        </div>
      ) : (
        <ul className="overflow-hidden rounded-2xl border border-line bg-white">
          {products.map((p) => {
            const imgs = parseImages(p.images);
            return (
              <li
                key={p.id}
                className="flex items-center gap-3 border-b border-line p-3 last:border-b-0"
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgs[0] ?? "/images/placeholder.jpg"}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="line-clamp-1 text-[13px] font-medium text-ink-900">
                    {p.name}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-ink-500">
                    <span>{p.category.name}</span>
                    {p.brand && <span>· {p.brand.name}</span>}
                    <span
                      className={`rounded-pill px-2 py-0.5 ${
                        p.stock === 0
                          ? "bg-red-50 text-red-600"
                          : p.stock < 10
                          ? "bg-amber-50 text-amber-600"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      موجودی: {toFa(p.stock)}
                    </span>
                  </div>
                </div>
                <div className="hidden text-left sm:block">
                  <div className="text-[12px] font-bold text-ink-900">
                    {formatPrice(p.price)}
                  </div>
                </div>
                <Link
                  href={`/admin/products/${p.id}`}
                  className="grid h-9 w-9 place-items-center rounded-lg bg-surface-2 text-ink-700 hover:bg-brand-50 hover:text-brand-600"
                  aria-label="ویرایش"
                >
                  <Pencil size={16} />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
