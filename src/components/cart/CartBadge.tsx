"use client";

import { useCart } from "@/lib/cart";
import { toFa } from "@/lib/format";

export function CartBadge() {
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  if (count === 0) return null;
  return <>{toFa(count)}</>;
}
