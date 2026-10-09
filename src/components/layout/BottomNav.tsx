"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingBag, Heart, User } from "lucide-react";

const items = [
  { href: "/", label: "خانه", icon: Home },
  { href: "/categories", label: "دسته‌ها", icon: LayoutGrid },
  { href: "/cart", label: "سبد خرید", icon: ShoppingBag },
  { href: "/wishlist", label: "علاقه‌مندی", icon: Heart },
  { href: "/account", label: "حساب من", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-line bg-white/95 backdrop-blur safe-bottom lg:hidden">
      <ul className="mx-auto flex max-w-6xl items-stretch justify-between px-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] ${
                  active ? "text-brand-600" : "text-ink-500"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
