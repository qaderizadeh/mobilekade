import Link from "next/link";
import {
  User,
  Package,
  Heart,
  MapPin,
  HelpCircle,
  ChevronLeft,
  Truck,
  Phone,
} from "lucide-react";

export const metadata = { title: "حساب من" };

const links = [
  { href: "/track", label: "پیگیری سفارش", desc: "وضعیت سفارش‌های خود را ببینید", icon: Package },
  { href: "/wishlist", label: "علاقه‌مندی‌ها", desc: "کالاهای ذخیره‌شده", icon: Heart },
  { href: "/faq", label: "سوالات متداول", desc: "پاسخ سوالات پرتکرار", icon: HelpCircle },
  { href: "/contact", label: "تماس با پشتیبانی", desc: "۰۲۱-۱۲۳۴۵۶۷۸", icon: Phone },
  { href: "/returns", label: "شرایط مرجوعی", desc: "۷ روز ضمانت بازگشت", icon: Truck },
];

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="rounded-3xl bg-gradient-to-l from-brand-700 to-brand-500 p-5 text-white">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-white/15">
          <User size={26} />
        </span>
        <h1 className="mt-3 text-lg font-extrabold">حساب من</h1>
        <p className="mt-1 text-[12px] text-white/85">
          در حال حاضر خرید مهمان فعال است — برای پیگیری سفارش از شماره
          پیگیری استفاده کنید.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/track"
            className="rounded-xl bg-white px-4 py-2 text-[13px] font-bold text-brand-700"
          >
            پیگیری سفارش
          </Link>
          <Link
            href="/"
            className="rounded-xl bg-white/15 px-4 py-2 text-[13px] font-medium text-white"
          >
            ادامه خرید
          </Link>
        </div>
      </div>

      <ul className="mt-5 space-y-2">
        {links.map(({ href, label, desc, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 active:scale-[0.99]"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Icon size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-bold text-ink-900">
                  {label}
                </div>
                <div className="mt-0.5 text-[11px] text-ink-500">{desc}</div>
              </div>
              <ChevronLeft size={16} className="shrink-0 text-ink-500" />
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-6 rounded-xl bg-surface-2 px-4 py-3 text-center text-[11px] leading-6 text-ink-500">
        در نسخه‌های بعدی، ورود و ثبت‌نام با شماره موبایل و کد پیامکی اضافه
        می‌شود تا تاریخچه سفارش‌ها و آدرس‌های شما ذخیره شود.
      </p>
    </div>
  );
}
