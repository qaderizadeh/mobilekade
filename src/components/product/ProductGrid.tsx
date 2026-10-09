import { PackageOpen } from "lucide-react";
import { ProductCard, type ProductCardData } from "./ProductCard";

export function ProductGrid({
  products,
  emptyMessage = "محصولی یافت نشد",
}: {
  products: ProductCardData[];
  emptyMessage?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-surface-2 text-ink-500">
          <PackageOpen size={28} />
        </span>
        <p className="text-sm text-ink-500">{emptyMessage}</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
