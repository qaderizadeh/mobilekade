"use client";

import { useState } from "react";
import { ChevronDown, Phone, MapPin, Copy, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatPrice, toFa } from "@/lib/format";
import { formatJalaliWithTime } from "@/lib/date";

type Order = {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  paymentMethod: string;
  shippingMethod: string;
  createdAt: string;
  receiver: string;
  phone: string;
  city: string;
  province: string;
  line1: string;
  itemCount: number;
  itemsSummary: string;
};

const statusMap: Record<string, { label: string; cls: string }> = {
  pending:    { label: "در انتظار", cls: "bg-amber-50 text-amber-600" },
  paid:       { label: "پرداخت شده", cls: "bg-emerald-50 text-emerald-600" },
  processing: { label: "در حال پردازش", cls: "bg-blue-50 text-blue-600" },
  shipped:    { label: "ارسال شده", cls: "bg-indigo-50 text-indigo-600" },
  delivered:  { label: "تحویل شده", cls: "bg-emerald-50 text-emerald-600" },
  cancelled:  { label: "لغو شده", cls: "bg-red-50 text-red-600" },
};

const statusOptions = [
  { value: "pending", label: "در انتظار" },
  { value: "paid", label: "پرداخت شده" },
  { value: "processing", label: "در حال پردازش" },
  { value: "shipped", label: "ارسال شده" },
  { value: "delivered", label: "تحویل شده" },
  { value: "cancelled", label: "لغو شده" },
];

export function OrderRow({ order }: { order: Order }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [updating, setUpdating] = useState(false);
  const [copied, setCopied] = useState(false);

  const updateStatus = async (newStatus: string) => {
    setUpdating(true);
    setStatus(newStatus);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setStatus(order.status);
    } finally {
      setUpdating(false);
    }
  };

  const copyAddress = async () => {
    await navigator.clipboard.writeText(
      `${order.receiver} - ${order.phone}\n${order.province}، ${order.city}، ${order.line1}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const pill = statusMap[status] ?? { label: status, cls: "bg-surface-2 text-ink-500" };

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 p-3 text-right"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold text-ink-900">
              {order.orderNumber}
            </span>
            <span className={`rounded-pill px-2 py-0.5 text-[10px] font-bold ${pill.cls}`}>
              {pill.label}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-ink-500">
            {order.receiver} · {toFa(order.itemCount)} کالا ·{" "}
            {formatJalaliWithTime(order.createdAt)}
          </div>
        </div>
        <div className="text-left">
          <div className="text-[13px] font-extrabold text-ink-900">
            {formatPrice(order.total)}
          </div>
          <div className="mt-0.5 text-[10px] text-ink-500">
            {order.shippingMethod === "free"
              ? "ارسال رایگان"
              : order.shippingMethod === "tipax"
              ? "تیپاکس"
              : "پست پیشتاز"}
          </div>
        </div>
        <ChevronDown
          size={18}
          className={`shrink-0 text-ink-500 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="space-y-3 border-t border-line p-3">
          <div className="rounded-xl bg-surface-2 p-3 text-[12px]">
            <div className="mb-2 flex items-center gap-1.5 font-bold text-ink-900">
              <MapPin size={14} />
              آدرس تحویل
            </div>
            <div className="leading-6 text-ink-700">
              {order.receiver} — {order.province}، {order.city}، {order.line1}
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-ink-500">
              <Phone size={12} />
              <span>{toFa(order.phone)}</span>
              <button
                onClick={copyAddress}
                className="mr-auto flex items-center gap-1 text-[11px] text-brand-600"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "کپی شد" : "کپی"}
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-surface-2 p-3 text-[12px] leading-6 text-ink-700">
            <span className="font-bold text-ink-900">کالاها: </span>
            {order.itemsSummary}
          </div>

          <div>
            <label className="mb-1 block text-[12px] text-ink-500">
              تغییر وضعیت سفارش
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {statusOptions.map((o) => (
                <button
                  key={o.value}
                  disabled={updating}
                  onClick={() => updateStatus(o.value)}
                  className={`rounded-xl border px-3 py-2 text-[12px] transition ${
                    status === o.value
                      ? "border-brand-500 bg-brand-50 font-bold text-brand-700"
                      : "border-line bg-white text-ink-700 hover:border-brand-300"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
