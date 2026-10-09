"use client";

import { Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart";

type Props = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  stock: number;
};

export function AddToCartBar(props: Props) {
  const { productId, slug, name, price, image, stock } = props;
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);
  const router = useRouter();
  const canBuy = stock > 0;

  const handleAdd = () => {
    add({ productId, slug, name, price, image, stock }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="fixed bottom-16 inset-x-0 z-30 border-t border-line bg-white p-3 shadow-[0_-4px_16px_-8px_rgb(15_23_42_/_0.15)] safe-bottom lg:static lg:mt-6 lg:rounded-2xl lg:border lg:shadow-none">
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <div className="flex items-center gap-1 rounded-xl border border-line bg-surface-2 p-1">
          <button
            aria-label="افزایش"
            disabled={!canBuy || qty >= stock}
            onClick={() => setQty((q) => Math.min(q + 1, stock))}
            className="grid h-9 w-9 place-items-center rounded-lg bg-white text-ink-700 disabled:opacity-40"
          >
            <Plus size={16} />
          </button>
          <span className="w-8 text-center text-sm font-bold">
            {qty.toLocaleString("fa-IR")}
          </span>
          <button
            aria-label="کاهش"
            disabled={!canBuy || qty <= 1}
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid h-9 w-9 place-items-center rounded-lg bg-white text-ink-700 disabled:opacity-40"
          >
            <Minus size={16} />
          </button>
        </div>

        <button
          disabled={!canBuy}
          onClick={handleAdd}
          className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-bold text-white transition active:scale-[0.98] disabled:bg-ink-500/40 ${
            added ? "bg-emerald-600" : "bg-brand-600"
          }`}
        >
          {added ? <Check size={18} /> : <ShoppingBag size={18} />}
          {!canBuy
            ? "ناموجود"
            : added
            ? "به سبد اضافه شد"
            : `افزودن به سبد — ${formatPrice(price * qty)}`}
        </button>
      </div>
    </div>
  );
}
