import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Package, Truck, Phone, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatNumber, toFa } from "@/lib/format";
import { formatJalaliWithTime } from "@/lib/date";

export const metadata = { title: "جزئیات سفارش" };

export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: true },
  });
  if (!order) notFound();

  const address = JSON.parse(order.addressJson);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-600 text-white">
          <CheckCircle2 size={32} />
        </span>
        <h1 className="mt-4 text-lg font-extrabold text-ink-900">
          سفارش شما با موفقیت ثبت شد
        </h1>
        <p className="mt-2 text-sm text-ink-700">
          شماره پیگیری:{" "}
          <span className="font-bold text-brand-700">
            {toFa(order.orderNumber)}
          </span>
        </p>
        <p className="mt-1 text-xs text-ink-500">
          {formatJalaliWithTime(order.createdAt)}
        </p>
      </div>

      <section className="mt-6 rounded-2xl border border-line bg-white p-4">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink-900">
          <Package size={16} className="text-brand-600" />
          کالاهای سفارش
        </h2>
        <ul className="space-y-2">
          {order.items.map((it) => (
            <li
              key={it.id}
              className="flex items-center justify-between gap-3 border-b border-line pb-2 last:border-b-0 last:pb-0"
            >
              <div className="flex-1">
                <div className="text-[13px] font-medium text-ink-900">
                  {it.nameSnapshot}
                </div>
                <div className="mt-0.5 text-[11px] text-ink-500">
                  {formatNumber(it.quantity)} × {formatPrice(it.priceSnapshot)}
                </div>
              </div>
              <div className="text-[13px] font-bold text-ink-900">
                {formatPrice(it.priceSnapshot * it.quantity)}
              </div>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-2 border-t border-line pt-3 text-[13px]">
          <Row label="جمع کالاها" value={formatPrice(order.subtotal)} />
          <Row label="هزینه ارسال" value={order.shipping === 0 ? "رایگان" : formatPrice(order.shipping)} />
          <div className="flex justify-between border-t border-line pt-2">
            <dt className="font-bold text-ink-900">مبلغ کل</dt>
            <dd className="font-extrabold text-brand-700">
              {formatPrice(order.total)}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-4 rounded-2xl border border-line bg-white p-4">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink-900">
          <Truck size={16} className="text-brand-600" />
          اطلاعات تحویل
        </h2>
        <div className="space-y-2 text-[13px] text-ink-700">
          <div className="flex items-start gap-2">
            <MapPin size={14} className="mt-1 shrink-0 text-ink-500" />
            <span>
              {address.province}، {address.city}، {address.line1}
              {address.postalCode && ` — کد پستی: ${toFa(address.postalCode)}`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Phone size={14} className="shrink-0 text-ink-500" />
            <span>{toFa(address.phone)}</span>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
          <div className="rounded-xl bg-surface-2 px-3 py-2 text-ink-500">
            روش پرداخت:{" "}
            <span className="font-bold text-ink-900">
              {order.paymentMethod === "cod" ? "پرداخت در محل" : "کارت به کارت"}
            </span>
          </div>
          <div className="rounded-xl bg-surface-2 px-3 py-2 text-ink-500">
            روش ارسال:{" "}
            <span className="font-bold text-ink-900">
              {order.shippingMethod === "free"
                ? "ارسال رایگان"
                : order.shippingMethod === "tipax"
                ? "تیپاکس"
                : "پست پیشتاز"}
            </span>
          </div>
        </div>
      </section>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Link
          href="/"
          className="flex h-12 flex-1 items-center justify-center rounded-xl border border-line bg-white text-sm font-bold text-ink-900"
        >
          بازگشت به خانه
        </Link>
        <Link
          href="/search"
          className="flex h-12 flex-1 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white"
        >
          ادامه خرید
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-ink-500">{label}</dt>
      <dd className="font-medium text-ink-900">{value}</dd>
    </div>
  );
}
