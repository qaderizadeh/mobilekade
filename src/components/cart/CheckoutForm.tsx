"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/cart";
import { formatPrice, digitsOnly } from "@/lib/format";
import {
  MapPin,
  CreditCard,
  Wallet,
  Loader2,
  Truck,
  Gift,
  Zap,
  type LucideIcon,
} from "lucide-react";

const provinces = [
  "تهران", "البرز", "اصفهان", "فارس", "خراسان رضوی", "آذربایجان شرقی",
  "آذربایجان غربی", "خوزستان", "گیلان", "مازندران", "کرمان", "یزد",
  "قم", "همدان", "کرمانشاه", "گلستان", "سیستان و بلوچستان", "هرمزگان",
  "بوشهر", "اردبیل", "زنجان", "قزوین", "مرکزی", "لرستان", "کردستان",
  "چهارمحال و بختیاری", "کهگیلویه و بویراحمد", "سمنان", "خراسان شمالی",
  "خراسان جنوبی", "ایلام",
];

type ShippingMethod = {
  id: "free" | "post" | "tipax";
  label: string;
  price: number;
  days: string;
};

const shipIcon: Record<string, LucideIcon> = {
  free: Gift,
  post: Truck,
  tipax: Zap,
};

export function CheckoutForm() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const subtotal = useMemo(
    () => items.reduce((n, i) => n + i.price * i.quantity, 0),
    [items]
  );

  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [loadingMethods, setLoadingMethods] = useState(true);
  const [shippingMethod, setShippingMethod] = useState<string | null>(null);

  const [receiver, setReceiver] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("تهران");
  const [city, setCity] = useState("");
  const [line1, setLine1] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [note, setNote] = useState("");
  const [payment, setPayment] = useState<"cod" | "card">("cod");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancel = false;
    setLoadingMethods(true);
    fetch(`/api/shipping?subtotal=${subtotal}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancel) return;
        setMethods(d.methods ?? []);
        setShippingMethod((prev) =>
          prev && d.methods.some((m: ShippingMethod) => m.id === prev)
            ? prev
            : d.methods[0]?.id ?? null
        );
      })
      .finally(() => !cancel && setLoadingMethods(false));
    return () => {
      cancel = true;
    };
  }, [subtotal]);

  const shippingCost =
    methods.find((m) => m.id === shippingMethod)?.price ?? 0;
  const total = subtotal + shippingCost;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p className="text-sm text-ink-500">
          سبد خریدت خالیه. اول یه کالا اضافه کن.
        </p>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!shippingMethod) {
      setError("روش ارسال را انتخاب کنید");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiver,
          phone: digitsOnly(phone),
          province,
          city,
          line1,
          postalCode: digitsOnly(postalCode),
          note,
          paymentMethod: payment,
          shippingMethod,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "خطا در ثبت سفارش");
      clear();
      router.push(`/order/${data.orderNumber}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-6xl pb-40 lg:pb-10">
      <h1 className="px-4 pt-4 text-lg font-extrabold text-ink-900">
        تکمیل خرید
      </h1>

      <div className="mt-4 grid gap-4 px-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {/* Address */}
          <section className="rounded-2xl border border-line bg-white p-4">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink-900">
              <MapPin size={16} className="text-brand-600" />
              آدرس تحویل
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="نام و نام خانوادگی *">
                <input
                  required
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                  className="input"
                />
              </Field>
              <Field label="شماره موبایل *">
                <input
                  required
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  className="input"
                />
              </Field>
              <Field label="استان *">
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="input"
                >
                  {provinces.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="شهر *">
                <input
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="input"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="نشانی کامل *">
                  <textarea
                    required
                    rows={3}
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    placeholder="خیابان، کوچه، پلاک، واحد"
                    className="input resize-none"
                  />
                </Field>
              </div>
              <Field label="کد پستی">
                <input
                  inputMode="numeric"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="input"
                />
              </Field>
            </div>
          </section>

          {/* Shipping */}
          <section className="rounded-2xl border border-line bg-white p-4">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink-900">
              <Truck size={16} className="text-brand-600" />
              روش ارسال
            </h2>
            {loadingMethods ? (
              <div className="flex items-center gap-2 py-4 text-[12px] text-ink-500">
                <Loader2 size={14} className="animate-spin" />
                در حال بارگذاری…
              </div>
            ) : methods.length === 0 ? (
              <p className="text-[12px] text-ink-500">
                هیچ روش ارسالی فعال نیست.
              </p>
            ) : (
              <div className="space-y-2">
                {methods.map((m) => {
                  const Icon = shipIcon[m.id] ?? Truck;
                  const active = shippingMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setShippingMethod(m.id)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-right transition ${
                        active
                          ? "border-brand-500 bg-brand-50"
                          : "border-line bg-white hover:border-brand-300"
                      }`}
                    >
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                          active
                            ? "bg-brand-600 text-white"
                            : "bg-surface-2 text-ink-500"
                        }`}
                      >
                        <Icon size={18} />
                      </span>
                      <span className="flex-1">
                        <span className="block text-[13px] font-bold text-ink-900">
                          {m.label}
                        </span>
                        <span className="block text-[11px] text-ink-500">
                          {m.days}
                        </span>
                      </span>
                      <span className="text-[12px] font-extrabold text-ink-900">
                        {m.price === 0 ? "رایگان" : formatPrice(m.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* Payment */}
          <section className="rounded-2xl border border-line bg-white p-4">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink-900">
              <CreditCard size={16} className="text-brand-600" />
              روش پرداخت
            </h2>
            <div className="space-y-2">
              <PayOption
                active={payment === "cod"}
                onClick={() => setPayment("cod")}
                icon={<Wallet size={18} />}
                title="پرداخت در محل"
                desc="هنگام تحویل کالا پرداخت کنید"
              />
              <PayOption
                active={payment === "card"}
                onClick={() => setPayment("card")}
                icon={<CreditCard size={18} />}
                title="کارت به کارت"
                desc="پس از ثبت سفارش، شماره کارت برای شما ارسال می‌شود"
              />
            </div>
          </section>

          {/* Note */}
          <section className="rounded-2xl border border-line bg-white p-4">
            <h2 className="mb-2 text-sm font-bold text-ink-900">
              توضیحات سفارش (اختیاری)
            </h2>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="input resize-none"
              placeholder="مثلاً: بعد از ساعت ۵ تماس بگیرید"
            />
          </section>
        </div>

        {/* Summary */}
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
                <dd className="font-medium text-ink-900">
                  {shippingCost === 0 ? "رایگان" : formatPrice(shippingCost)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2 text-[14px]">
                <dt className="font-bold text-ink-900">قابل پرداخت</dt>
                <dd className="font-extrabold text-brand-700">
                  {formatPrice(total)}
                </dd>
              </div>
            </dl>

            {error && (
              <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-[12px] text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-bold text-white active:scale-[0.98] disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              ثبت نهایی سفارش
            </button>
          </div>
        </aside>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] text-ink-500">{label}</span>
      {children}
    </label>
  );
}

function PayOption({
  active,
  onClick,
  icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-right transition ${
        active
          ? "border-brand-500 bg-brand-50"
          : "border-line bg-white hover:border-brand-300"
      }`}
    >
      <span
        className={`grid h-10 w-10 place-items-center rounded-full ${
          active ? "bg-brand-600 text-white" : "bg-surface-2 text-ink-500"
        }`}
      >
        {icon}
      </span>
      <span className="flex-1">
        <span className="block text-[13px] font-bold text-ink-900">
          {title}
        </span>
        <span className="block text-[11px] text-ink-500">{desc}</span>
      </span>
      <span
        className={`h-4 w-4 rounded-full border-2 ${
          active ? "border-brand-600 bg-brand-600 ring-2 ring-white" : "border-line"
        }`}
      />
    </button>
  );
}
