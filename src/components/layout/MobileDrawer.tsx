"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  X,
  Home,
  LayoutGrid,
  Search,
  ShoppingBag,
  Heart,
  User,
  Phone,
  HelpCircle,
  Package,
  Info,
  ShieldCheck,
  Headset,
} from "lucide-react";

const mainLinks = [
  { href: "/", label: "خانه", icon: Home },
  { href: "/categories", label: "دسته‌بندی‌ها", icon: LayoutGrid },
  { href: "/search", label: "جستجو", icon: Search },
  { href: "/cart", label: "سبد خرید", icon: ShoppingBag },
  { href: "/wishlist", label: "علاقه‌مندی‌ها", icon: Heart },
  { href: "/account", label: "حساب من", icon: User },
];

const supportLinks = [
  { href: "/track", label: "پیگیری سفارش", icon: Package },
  { href: "/faq", label: "سوالات متداول", icon: HelpCircle },
  { href: "/returns", label: "شرایط مرجوعی", icon: ShieldCheck },
  { href: "/contact", label: "تماس با ما", icon: Phone },
  { href: "/about", label: "درباره ما", icon: Info },
];

export function MobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  // Lock scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 z-[70] h-full w-[85vw] max-w-sm overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="منوی اصلی"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line bg-brand-600 px-4 py-4 text-white safe-top">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-sm font-extrabold text-brand-700">
              م
            </span>
            <div>
              <div className="text-sm font-bold">موبایل‌کده</div>
              <div className="text-[11px] text-white/80">فروشگاه لوازم جانبی</div>
            </div>
          </div>
          <button
            aria-label="بستن منو"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 active:bg-white/20"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main nav */}
        <nav className="p-3">
          <p className="px-3 pb-2 pt-2 text-[11px] font-bold text-ink-500">
            منوی اصلی
          </p>
          <ul className="space-y-1">
            {mainLinks.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-[13px] text-ink-700 hover:bg-surface-2"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
                    <Icon size={18} />
                  </span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Support */}
        <nav className="border-t border-line p-3">
          <p className="px-3 pb-2 pt-2 text-[11px] font-bold text-ink-500">
            خدمات مشتریان
          </p>
          <ul className="space-y-1">
            {supportLinks.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-ink-700 hover:bg-surface-2"
                >
                  <Icon size={16} className="text-ink-500" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div className="border-t border-line p-4">
          <div className="rounded-2xl bg-surface-2 p-4">
            <div className="flex items-center gap-2 text-[13px] font-bold text-ink-900">
              <Headset size={16} className="text-brand-600" />
              پشتیبانی
            </div>
            <a
              href="tel:02112345678"
              dir="ltr"
              className="mt-2 block text-[15px] font-extrabold text-brand-700"
            >
              ۰۲۱-۱۲۳۴۵۶۷۸
            </a>
            <p className="mt-1 text-[11px] leading-5 text-ink-500">
              شنبه تا پنجشنبه، ۹ صبح تا ۶ عصر
            </p>
          </div>
        </div>

        {/* Admin link (subtle) */}
        <div className="border-t border-line p-4 pb-8">
          <Link
            href="/admin/login"
            onClick={onClose}
            className="block text-center text-[11px] text-ink-500 hover:text-ink-700"
          >
            ورود مدیریت
          </Link>
        </div>
      </aside>
    </>
  );
}
