"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice, toFa } from "@/lib/format";

export function CartView() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto grid min-h-[50vh] max-w-6xl place-items-center px-4">
        <div className="text-center">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-surface-2 text-ink-500">
            <ShoppingBag size={32} />
          </span>
          <h1 className="mt-4 text-base font-bold text-ink-900">
            سبد خریدت خالیه
          </h1>
          <p className="mt-1 text-sm text-ink-500">
            یه سر به فروشگاه بزن و کالای مورد علاقه‌ت رو اضافه کن.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-bold text-white"
          >
            <ArrowLeft size={16} />
            بازگشت به فروشگاه
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl pb-40 lg:pb-10">
      <h1 className="px-4 pt-4 text-lg font-extrabold text-ink-900">
        سبد خرید ({toFa(items.length)} کالا)
      </h1>

      <div className="mt-4 grid gap-4 px-4 lg:grid-cols-[1fr_360px]">
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.productId}
              className="flex gap-3 rounded-2xl border border-line bg-white p-3"
            >
              <Link
                href={`/product/${item.slug}`}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-surface-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-col gap-1">
                <Link
                  href={`/product/${item.slug}`}
                  className="line-clamp-2 text-[13px] font-medium leading-6 text-ink-900"
                >
                  {item.name}
                </Link>

                <div className="mt-auto flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 rounded-lg border border-line bg-surface-2 p-0.5">
                    <button
                      aria-label="افزایش"
                      disabled={item.quantity >= item.stock}
                      onClick={() => setQty(item.productId, item.quantity + 1)}
                      className="grid h-7 w-7 place-items-center rounded bg-white text-ink-700 disabled:opacity-40"
                    >
                      <Plus size={14} />
                    </button>
                    <span className="w-7 text-center text-[13px] font-bold">
                      {toFa(item.quantity)}
                    </span>
                    <button
                      aria-label="کاهش"
                      disabled={item.quantity <= 1}
                      onClick={() => setQty(item.productId, item.quantity - 1)}
                      className="grid h-7 w-7 place-items-center rounded bg-white text-ink-700 disabled:opacity-40"
                    >
                      <Minus size={14} />
                    </button>
                  </div>

                  <div className="text-[13px] font-extrabold text-ink-900">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              </div>

              <button
                aria-label="حذف"
                onClick={() => remove(item.productId)}
                className="self-start rounded-lg p-2 text-ink-500 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-line bg-white p-4">
            <h2 className="text-sm font-bold text-ink-900">خلاصه سفارش</h2>
            <dl className="mt-3 space-y-2 text-[13px]">
              <div className="flex justify-between">
                <dt className="text-ink-500">جمع کالاها</dt>
                <dd className="font-medium text-ink-900">
                  {formatPrice(subtotal)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-500">هزینه ارسال</dt>
                <dd className="text-ink-700">محاسبه در مرحله بعد</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2 text-[14px]">
                <dt className="font-bold text-ink-900">قابل پرداخت</dt>
                <dd className="font-extrabold text-brand-700">
                  {formatPrice(subtotal)}
                </dd>
              </div>
            </dl>

            <Link
              href="/checkout"
              className="mt-4 flex h-12 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white active:scale-[0.98]"
            >
              ادامه فرآیند خرید
            </Link>
          </div>
        </aside>
      </div>

      <div className="fixed bottom-16 inset-x-0 z-30 border-t border-line bg-white p-3 safe-bottom lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="text-[11px] text-ink-500">قابل پرداخت</div>
            <div className="text-[14px] font-extrabold text-ink-900">
              {formatPrice(subtotal)}
            </div>
          </div>
          <Link
            href="/checkout"
            className="flex h-11 items-center rounded-xl bg-brand-600 px-5 text-sm font-bold text-white"
          >
            ادامه خرید
          </Link>
        </div>
      </div>
    </div>
  );
}
