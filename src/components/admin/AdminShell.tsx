"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Plus,
  LogOut,
  Menu,
  X,
  Truck,
} from "lucide-react";
import { useState } from "react";

const links = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/products", label: "محصولات", icon: Package },
  { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingCart },
  { href: "/admin/products/new", label: "افزودن محصول", icon: Plus },
  { href: "/admin/settings", label: "تنظیمات ارسال", icon: Truck },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const Nav = () => (
    <nav className="flex flex-col gap-1">
      {links.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] transition ${
              active
                ? "bg-brand-600 text-white"
                : "text-ink-700 hover:bg-surface-2"
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-surface-2">
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-white px-4 lg:hidden">
        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2"
          aria-label="منو"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="flex-1 text-sm font-bold">پنل مدیریت موبایل‌کده</div>
        <button
          onClick={logout}
          className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2 text-ink-500"
          aria-label="خروج"
        >
          <LogOut size={18} />
        </button>
      </header>

      {open && (
        <div className="border-b border-line bg-white p-3 lg:hidden">
          <Nav />
        </div>
      )}

      <div className="flex">
        <aside className="hidden w-64 shrink-0 border-l border-line bg-white p-4 lg:block">
          <div className="mb-6 flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-sm font-bold text-white">
              م
            </span>
            <div>
              <div className="text-sm font-extrabold">موبایل‌کده</div>
              <div className="text-[11px] text-ink-500">پنل مدیریت</div>
            </div>
          </div>
          <Nav />
          <button
            onClick={logout}
            className="mt-6 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            خروج از حساب
          </button>
        </aside>

        <main className="min-w-0 flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
