import { prisma } from "@/lib/prisma";
import { formatPrice, formatNumber, toFa } from "@/lib/format";
import { formatJalaliWithTime } from "@/lib/date";
import { OrderRow } from "@/components/admin/OrderRow";
import { Package } from "lucide-react";

export const metadata = { title: "سفارش‌ها" };

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
    take: 200,
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-extrabold text-ink-900">سفارش‌ها</h1>
        <p className="mt-1 text-[12px] text-ink-500">
          {formatNumber(orders.length)} سفارش
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-10 text-center">
          <Package size={32} className="mx-auto text-ink-500" />
          <p className="mt-3 text-[13px] text-ink-500">سفارشی ثبت نشده</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {orders.map((o) => {
            const address = JSON.parse(o.addressJson);
            return (
              <li key={o.id}>
                <OrderRow
                  order={{
                    id: o.id,
                    orderNumber: o.orderNumber,
                    status: o.status,
                    total: o.total,
                    paymentMethod: o.paymentMethod,
                    shippingMethod: o.shippingMethod,
                    createdAt: o.createdAt.toISOString(),
                    receiver: address.receiver,
                    phone: address.phone,
                    city: address.city,
                    province: address.province,
                    line1: address.line1,
                    itemCount: o.items.reduce((n, i) => n + i.quantity, 0),
                    itemsSummary: o.items
                      .map((i) => `${i.nameSnapshot} (×${i.quantity})`)
                      .join("، "),
                  }}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
