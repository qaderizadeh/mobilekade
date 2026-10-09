import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Package,
  PackageCheck,
  Truck,
  Home,
  Clock,
  Search,
  ChevronLeft,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatNumber, toFa } from "@/lib/format";
import { formatJalaliWithTime } from "@/lib/date";

export const metadata = { title: "پیگیری سفارش" };

const steps = [
  { key: "pending", label: "ثبت شده", icon: Clock },
  { key: "paid", label: "پرداخت شده", icon: PackageCheck },
  { key: "processing", label: "در حال آماده‌سازی", icon: Package },
  { key: "shipped", label: "ارسال شده", icon: Truck },
  { key: "delivered", label: "تحویل شده", icon: Home },
];

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const sp = await searchParams;
  const num = sp.order?.trim();

  let order: any = null;
  if (num) {
    const cleaned = num.replace(/[۰-۹]/g, (d) =>
      String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))
    );
    order = await prisma.order.findUnique({
      where: { orderNumber: cleaned },
      include: { items: true },
    });
  }

  const currentIdx = order
    ? steps.findIndex((s) => s.key === order.status)
    : -1;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <Package size={24} />
        </span>
        <div>
          <h1 className="text-lg font-extrabold text-ink-900">پیگیری سفارش</h1>
          <p className="text-[12px] text-ink-500">
            شماره پیگیری خود را وارد کنید
          </p>
        </div>
      </div>

      <form className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2">
        <Search size={18} className="shrink-0 text-ink-500" />
        <input
          name="order"
          defaultValue={num ?? ""}
          placeholder="مثلاً MK-12345678"
          dir="ltr"
          className="h-10 flex-1 bg-transparent text-sm outline-none"
        />
        <button
          type="submit"
          className="grid h-10 w-10 place-items-center rounded-lg bg-brand-600 text-white active:scale-95"
          aria-label="جستجو"
        >
          <Search size={16} />
        </button>
      </form>

      {num && !order && (
        <div className="mt-6 rounded-2xl border border-line bg-white p-6 text-center">
          <Package size={32} className="mx-auto text-ink-500" />
          <p className="mt-3 text-[13px] font-bold text-ink-900">
            سفارشی با این شماره پیدا نشد
          </p>
          <p className="mt-1 text-[12px] text-ink-500">
            شماره پیگیری را دقیقاً همان‌طور که هنگام ثبت سفارش دریافت کردید
            وارد کنید.
          </p>
        </div>
      )}

      {order && (
        <>
          <section className="mt-4 rounded-2xl border border-line bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] text-ink-500">شماره سفارش</div>
                <div className="text-[14px] font-extrabold text-ink-900">
                  {toFa(order.orderNumber)}
                </div>
              </div>
              <div className="text-left">
                <div className="text-[11px] text-ink-500">تاریخ ثبت</div>
                <div className="text-[12px] text-ink-700">
                  {formatJalaliWithTime(order.createdAt)}
                </div>
              </div>
            </div>
          </section>

          {/* Progress */}
          <section className="mt-4 rounded-2xl border border-line bg-white p-4">
            <h2 className="mb-4 text-sm font-bold text-ink-900">
              وضعیت سفارش
            </h2>
            <ol className="space-y-3">
              {steps.map((s, i) => {
                const Icon = s.icon;
                const done = i <= currentIdx;
                const active = i === currentIdx;
                return (
                  <li key={s.key} className="flex items-center gap-3">
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                        done
                          ? "bg-brand-600 text-white"
                          : "bg-surface-2 text-ink-500"
                      } ${active ? "ring-4 ring-brand-100" : ""}`}
                    >
                      <Icon size={16} />
                    </span>
                    <span
                      className={`text-[13px] ${
                        done
                          ? "font-bold text-ink-900"
                          : "text-ink-500"
                      }`}
                    >
                      {s.label}
                    </span>
                  </li>
                );
              })}
            </ol>
            {order.status === "cancelled" && (
              <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-[12px] text-red-600">
                این سفارش لغو شده است.
              </p>
            )}
          </section>

          {/* Items */}
          <section className="mt-4 rounded-2xl border border-line bg-white p-4">
            <h2 className="mb-3 text-sm font-bold text-ink-900">کالاها</h2>
            <ul className="space-y-2">
              {order.items.map((it: any) => (
                <li
                  key={it.id}
                  className="flex items-center justify-between gap-3 border-b border-line pb-2 text-[13px] last:border-b-0 last:pb-0"
                >
                  <span className="line-clamp-1 flex-1 text-ink-700">
                    {it.nameSnapshot}
                  </span>
                  <span className="text-[11px] text-ink-500">
                    ×{formatNumber(it.quantity)}
                  </span>
                  <span className="font-bold text-ink-900">
                    {formatPrice(it.priceSnapshot * it.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-line pt-3 text-[14px]">
              <span className="font-bold text-ink-900">مبلغ کل</span>
              <span className="font-extrabold text-brand-700">
                {formatPrice(order.total)}
              </span>
            </div>
          </section>
        </>
      )}

      {!num && (
        <div className="mt-6 rounded-2xl bg-surface-2 p-5 text-[12px] leading-6 text-ink-700">
          شماره پیگیری هنگام ثبت سفارش با فرمت <span dir="ltr" className="font-bold">MK-XXXXXXXX</span> به
          شما نمایش داده شده است. اگر آن را ندارید، با پشتیبانی تماس بگیرید.
        </div>
      )}
    </div>
  );
}
