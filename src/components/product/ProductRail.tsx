import Link from "next/link";
import { ProductCard, type ProductCardData } from "./ProductCard";

export function ProductRail({
  title,
  href,
  products,
}: {
  title: string;
  href?: string;
  products: ProductCardData[];
}) {
  if (products.length === 0) return null;
  return (
    <section className="mt-6">
      <div className="mb-3 flex items-center justify-between px-4">
        <h2 className="text-base font-extrabold text-ink-900">{title}</h2>
        {href && (
          <Link href={href} className="text-xs font-medium text-brand-600">
            مشاهده همه
          </Link>
        )}
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1">
        {products.map((p) => (
          <div key={p.id} className="w-[160px] shrink-0 sm:w-[180px]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
