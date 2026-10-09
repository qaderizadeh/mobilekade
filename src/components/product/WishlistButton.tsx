"use client";

import { Heart } from "lucide-react";

export function WishlistButton({ productId }: { productId: string }) {
  return (
    <button
      type="button"
      aria-label="افزودن به علاقه‌مندی‌ها"
      data-product={productId}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="absolute bottom-2 left-2 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-ink-500 shadow-sm backdrop-blur active:scale-90"
    >
      <Heart size={18} />
    </button>
  );
}
