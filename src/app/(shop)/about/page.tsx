import Link from "next/link";
import { Sparkles, Store, Heart, Award } from "lucide-react";

export const metadata = { title: "درباره ما" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="rounded-3xl bg-gradient-to-l from-brand-700 via-brand-600 to-brand-500 p-6 text-white">
        <span className="inline-flex items-center gap-2 rounded-pill bg-white/15 px-3 py-1 text-[11px]">
          <Sparkles size={12} />
          از سال ۱۴۰۰ در کنار شما
        </span>
        <h1 className="mt-4 text-xl font-extrabold leading-8">
          موبایل‌کده، مرجع لوازم جانبی موبایل
        </h1>
        <p className="mt-3 text-[13px] leading-7 text-white/90">
          ما یک فروشگاه اینترنتی تخصصی لوازم جانبی موبایل هستیم که با تمرکز
          بر اصالت کالا، قیمت منصفانه و ارسال سریع، تجربه‌ای مطمئن برای
          خرید آنلاین فراهم می‌کنیم.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat icon={Store} value="۱۰٬۰۰۰+" label="سفارش موفق" />
        <Stat icon={Heart} value="۹۸٪" label="رضایت مشتری" />
        <Stat icon={Award} value="۱۵۰+" label="برند معتبر" />
      </div>

      <section className="mt-6 rounded-2xl border border-line bg-white p-5">
        <h2 className="text-sm font-bold text-ink-900">چرا موبایل‌کده؟</h2>
        <ul className="mt-3 space-y-3 text-[13px] leading-7 text-ink-700">
          <li>
            <span className="font-bold text-ink-900">ضمانت اصالت</span> — تمام
            کالاها اورجینال و با ضمانت عرضه می‌شوند.
          </li>
          <li>
            <span className="font-bold text-ink-900">ارسال سریع</span> — ارسال
            به سراسر ایران با پست پیشتاز و تیپاکس.
          </li>
          <li>
            <span className="font-bold text-ink-900">قیمت مناسب</span> — با
            حذف واسطه‌ها، کالا با قیمت واقعی به دست شما می‌رسد.
          </li>
          <li>
            <span className="font-bold text-ink-900">پشتیبانی واقعی</span> — تیم
            پشتیبانی ۶ روز هفته پاسخگوی سوالات شماست.
          </li>
        </ul>
      </section>

      <div className="mt-6 rounded-2xl bg-surface-2 p-5 text-center">
        <p className="text-[13px] text-ink-700">
          سوال یا پیشنهادی داری؟ خوشحال می‌شویم بشنویم.
        </p>
        <Link
          href="/contact"
          className="mt-3 inline-flex h-10 items-center rounded-xl bg-brand-600 px-5 text-[13px] font-bold text-white"
        >
          تماس با ما
        </Link>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 text-center">
      <span className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-600">
        <Icon size={18} />
      </span>
      <div className="mt-2 text-base font-extrabold text-ink-900">{value}</div>
      <div className="text-[11px] text-ink-500">{label}</div>
    </div>
  );
}
