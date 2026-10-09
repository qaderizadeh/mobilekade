import Link from "next/link";
import { Truck, ShieldCheck, BadgePercent, Headset } from "lucide-react";
import {
  getFeaturedProducts,
  getBestSellers,
  getNewestProducts,
  getCategories,
} from "@/lib/queries";
import { CategoryRail } from "@/components/product/CategoryRail";
import { ProductRail } from "@/components/product/ProductRail";


const features = [
  { icon: Truck,       title: "ارسال سریع",     desc: "به سراسر ایران" },
  { icon: ShieldCheck, title: "ضمانت اصالت",    desc: "کالای اورجینال" },
  { icon: BadgePercent,title: "قیمت مناسب",     desc: "تخفیف‌های ویژه" },
  { icon: Headset,     title: "پشتیبانی",       desc: "۷ روز هفته" },
];

export default async function HomePage() {
  const [featured, bestSellers, newest, categories] = await Promise.all([
    getFeaturedProducts(10),
    getBestSellers(10),
    getNewestProducts(10),
    getCategories(),
  ]);

  return (
    <div className="pb-4">
      {/* Hero */}
      <section className="px-4 pt-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-brand-700 via-brand-600 to-brand-500 p-5 text-white shadow-card">
          <div className="relative z-10">
            <span className="inline-block rounded-pill bg-white/15 px-3 py-1 text-[11px] font-medium">
              تا ۳۰٪ تخفیف ویژه
            </span>
            <h1 className="mt-3 text-xl font-extrabold leading-8">
              لوازم جانبی موبایل،
              <br /> با ضمانت اصالت کالا
            </h1>
            <p className="mt-2 max-w-[80%] text-xs leading-6 text-white/85">
              قاب، گلس، شارژر، پاوربانک و هزاران کالای اورجینال با ارسال سریع به
              سراسر کشور.
            </p>
            <Link
              href="/categories"
              className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-brand-700 active:scale-[0.97]"
            >
              مشاهده فروشگاه
            </Link>
          </div>
          <div className="pointer-events-none absolute -left-8 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute left-14 top-4 h-24 w-24 rounded-full bg-accent-500/30 blur-2xl" />
        </div>
      </section>

      {/* Trust features */}
      <section className="mt-5 px-4">
        <div className="grid grid-cols-4 gap-2 rounded-2xl border border-line bg-white p-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center gap-1 text-center">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-600">
                <Icon size={20} />
              </span>
              <span className="text-[11px] font-bold text-ink-900">{title}</span>
              <span className="hidden text-[10px] text-ink-500 xs:block">{desc}</span>
            </div>
          ))}
        </div>
      </section>

      <CategoryRail categories={categories} />

      <ProductRail
        title="پیشنهاد ویژه"
        href="/search?sort=discount"
        products={featured}
      />

      <ProductRail
        title="پرفروش‌ترین‌ها"
        href="/search?sort=best"
        products={bestSellers}
      />

      <ProductRail
        title="جدیدترین‌ها"
        href="/search?sort=newest"
        products={newest}
      />

      {/* Promo banner */}
      <section className="mt-8 px-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-gradient-to-l from-emerald-500 to-emerald-600 p-4 text-white">
            <div className="text-sm font-extrabold">پرداخت در محل</div>
            <p className="mt-1 text-[11px] leading-5 text-white/90">
              با خیال راحت سفارش بده
            </p>
          </div>
          <div className="rounded-2xl bg-gradient-to-l from-accent-500 to-accent-600 p-4 text-white">
            <div className="text-sm font-extrabold">۷ روز ضمانت بازگشت</div>
            <p className="mt-1 text-[11px] leading-5 text-white/90">
              بدون قید و شرط
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
