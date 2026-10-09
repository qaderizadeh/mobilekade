"use client";

import Link from "next/link";
import { Search, ShoppingBag, Menu, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { toFa } from "@/lib/format";
import { MobileDrawer } from "./MobileDrawer";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 safe-top transition-shadow ${
          scrolled ? "shadow-[0_2px_12px_-4px_rgb(15_23_42_/_0.12)]" : ""
        }`}
      >
        <div className="bg-brand-600 text-white">
          <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
            <button
              type="button"
              aria-label="باز کردن منو"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 active:bg-white/20 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 text-lg font-extrabold tracking-tight"
            >
              <span className="grid h-8 w-8 place-items-center rounded-xl bg-white text-brand-700">
                م
              </span>
              <span className="hidden sm:inline">موبایل‌کده</span>
            </Link>

            <Link
              href="/search"
              className="flex h-10 flex-1 items-center gap-2 rounded-xl bg-white/15 px-3 text-sm text-white/80 active:bg-white/25"
            >
              <Search size={18} className="shrink-0" />
              <span className="truncate">جستجو در لوازم جانبی…</span>
            </Link>

            <Link
              href="/cart"
              aria-label="سبد خرید"
              className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 active:bg-white/20"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -left-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white">
                  {toFa(cartCount)}
                </span>
              )}
            </Link>
            <Link
              href="/account"
              aria-label="حساب من"
              className="hidden h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 active:bg-white/20 sm:grid"
            >
              <User size={20} />
            </Link>
          </div>
        </div>
      </header>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
