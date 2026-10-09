import Link from "next/link";
import {
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Plus,
  ChevronLeft,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatNumber } from "@/lib/format";
import { formatJalaliWithTime } from "@/lib/date";
import { AdminAssistant } from "@/components/admin/AdminAssistant";

export const metadata = { title: "داشبورد" };

export default async function AdminDashboard() {
  const [productCount, orderCount, orders, lowStock, recentOrders] =
    await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.findMany({ select: { total: true } }),
      prisma.product.findMany({
        where: { stock: { lt: 10 }, isActive: true },
        orderBy: { stock: "asc" },
        take: 5,
        select: { id: true, name: true, stock: true, slug: true },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          orderNumber: true,
          total: true,
          status: true,
          createdAt: true,
          addressJson: true,
        },
      }),
    ]);

  const revenue = orders.reduce((n, o) => n + o.total, 0);

  const stats = [
    { label: "درآمد کل", value: formatPrice(revenue), icon: TrendingUp, cls: "bg-emerald-50 text-emerald-600" },
    { label: "تعداد سفارش", value: formatNumber(orderCount), icon: ShoppingCart, cls: "bg-brand-50 text-brand-600" },
    { label: "محصولات فعال", value: formatNumber(productCount), icon: Package, cls: "bg-accent-50 text-accent-600" },
    { label: "کم‌موجود", value: formatNumber(lowStock.length), icon: AlertTriangle, cls: "bg-red-50 text-red-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-extrabold text-ink-900">داشبورد</h1>
          <p className="mt-1 text-[12px] text-ink-500">
            نمای کلی فروشگاه و سفارش‌ها
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex h-10 items-center gap-2 rounded-xl bg-brand-600 px-4 text-[13px] font-bold text-white"
        >
          <Plus size={16} />
          افزودن محصول
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, cls }) => (
          <div
            key={label}
            className="rounded-2xl border border-line bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <span className={`grid h-9 w-9 place-items-center rounded-xl ${cls}`}>
                <Icon size={18} />
              </span>
            </div>
            <div className="mt-3 text-[11px] text-ink-500">{label}</div>
            <div className="mt-0.5 text-base font-extrabold text-ink-900">
              {value}
            </div>
          </div>
        ))}
      </div>

      <AdminAssistant />

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent orders */}
        <section className="rounded-2xl border border-line bg-white">
          <header className="flex items-center justify-between border-b border-line px-4 py-3">
            <h2 className="text-sm font-bold text-ink-900">آخرین سفارش‌ها</h2>
            <Link
              href="/admin/orders"
              className="flex items-center gap-1 text-[12px] text-brand-600"
            >
              همه سفارش‌ها
              <ChevronLeft size={14} />
            </Link>
          </header>
          {recentOrders.length === 0 ? (
            <p className="p-6 text-center text-[13px] text-ink-500">
              سفارشی ثبت نشده
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {recentOrders.map((o) => {
                let name = "—";
                try {
                  name = JSON.parse(o.addressJson).receiver ?? "—";
                } catch {}
                return (
                  <li key={o.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="flex-1">
                      <div className="text-[13px] font-bold text-ink-900">
                        {o.orderNumber}
                      </div>
                      <div className="mt-0.5 text-[11px] text-ink-500">
                        {name} · {formatJalaliWithTime(o.createdAt)}
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-[12px] font-bold text-ink-900">
                        {formatPrice(o.total)}
                      </div>
                      <StatusPill status={o.status} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Low stock */}
        <section className="rounded-2xl border border-line bg-white">
          <header className="border-b border-line px-4 py-3">
            <h2 className="text-sm font-bold text-ink-900">کالاهای کم‌موجود</h2>
          </header>
          {lowStock.length === 0 ? (
            <p className="p-6 text-center text-[13px] text-ink-500">
              همه‌چیز مرتبه 👌
            </p>
          ) : (
            <ul className="divide-y divide-line">
              {lowStock.map((p) => (
                <li key={p.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex-1">
                    <div className="line-clamp-1 text-[13px] font-medium text-ink-900">
                      {p.name}
                    </div>
                  </div>
                  <span
                    className={`rounded-pill px-2 py-0.5 text-[11px] font-bold ${
                      p.stock === 0
                        ? "bg-red-50 text-red-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {formatNumber(p.stock)} عدد
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    pending:    { label: "در انتظار", cls: "bg-amber-50 text-amber-600" },
    paid:       { label: "پرداخت شده", cls: "bg-emerald-50 text-emerald-600" },
    processing: { label: "در حال پردازش", cls: "bg-blue-50 text-blue-600" },
    shipped:    { label: "ارسال شده", cls: "bg-indigo-50 text-indigo-600" },
    delivered:  { label: "تحویل شده", cls: "bg-emerald-50 text-emerald-600" },
    cancelled:  { label: "لغو شده", cls: "bg-red-50 text-red-600" },
  };
  const v = map[status] ?? { label: status, cls: "bg-surface-2 text-ink-500" };
  return (
    <span className={`mt-1 inline-block rounded-pill px-2 py-0.5 text-[10px] font-bold ${v.cls}`}>
      {v.label}
    </span>
  );
}
