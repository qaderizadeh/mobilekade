import Link from "next/link";
import { Star } from "lucide-react";
import { WishlistButton } from "./WishlistButton";
import { formatPrice, formatNumber } from "@/lib/format";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  price: number;
  comparePrice?: number | null;
  image: string;
  rating?: number;
  reviewCount?: number;
  stock: number;
  badge?: string | null;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(
          ((product.comparePrice - product.price) / product.comparePrice) * 100
        )
      : 0;

  const outOfStock = product.stock <= 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-line bg-white transition active:scale-[0.98] hover:shadow-card"
    >
      <div className="relative aspect-square overflow-hidden bg-surface-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />

        {discount > 0 && (
          <span className="absolute top-2 right-2 rounded-pill bg-red-500 px-2 py-0.5 text-[11px] font-bold text-white">
            {formatNumber(discount)}٪
          </span>
        )}

        {product.badge && (
          <span className="absolute top-2 left-2 rounded-pill bg-brand-600 px-2 py-0.5 text-[11px] font-bold text-white">
            {product.badge}
          </span>
        )}

        {outOfStock && (
          <div className="absolute inset-0 grid place-items-center bg-white/70 backdrop-blur-[1px]">
            <span className="rounded-pill bg-ink-900/90 px-3 py-1 text-xs font-bold text-white">
              ناموجود
            </span>
          </div>
        )}

        <WishlistButton productId={product.id} />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-2 text-[13px] font-medium leading-6 text-ink-900">
          {product.name}
        </h3>

        {product.reviewCount !== undefined && product.reviewCount > 0 && (
          <div className="flex items-center gap-1 text-[11px] text-ink-500">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span>{formatNumber(product.rating ?? 0)}</span>
            <span>({formatNumber(product.reviewCount)})</span>
          </div>
        )}

        <div className="mt-auto flex flex-col gap-1">
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-[11px] text-ink-500 line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
          <span className="text-sm font-extrabold text-ink-900">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </Link>
  );
}
