"use client";

import { useState } from "react";
import { Save, Loader2, Truck, Zap, Gift, Check } from "lucide-react";
import { toEn } from "@/lib/format";

export function ShippingSettingsForm({
  initial,
}: {
  initial: Record<string, string>;
}) {
  const [v, setV] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = (k: string, val: string) => setV((s) => ({ ...s, [k]: val }));

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/settings/shipping", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
      });
      if (!res.ok) throw new Error("خطا در ذخیره");
      setSavedAt(Date.now());
      setTimeout(() => setSavedAt(null), 2000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-extrabold text-ink-900">تنظیمات ارسال</h1>
          <p className="mt-1 text-[12px] text-ink-500">
            هزینه و شرایط روش‌های ارسال را این‌جا تعیین کنید
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex h-10 items-center gap-2 rounded-xl bg-brand-600 px-4 text-[13px] font-bold text-white disabled:opacity-60"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : savedAt ? (
            <Check size={16} />
          ) : (
            <Save size={16} />
          )}
          {savedAt ? "ذخیره شد" : "ذخیره"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-3 py-2 text-[12px] text-red-600">
          {error}
        </div>
      )}

      {/* FREE */}
      <section className="rounded-2xl border border-line bg-white p-4 space-y-3">
        <header className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
            <Gift size={18} />
          </span>
          <div className="flex-1">
            <div className="text-sm font-bold text-ink-900">ارسال رایگان</div>
            <div className="text-[11px] text-ink-500">
              وقتی جمع سبد به حد مشخصی برسه
            </div>
          </div>
          <Toggle
            checked={v.shipping_free_enabled === "true"}
            onChange={(c) => set("shipping_free_enabled", c ? "true" : "false")}
          />
        </header>
        <Field label="حداقل مبلغ سبد برای ارسال رایگان (تومان)">
          <input
            inputMode="numeric"
            value={v.shipping_free_min}
            onChange={(e) =>
              set(
                "shipping_free_min",
                toEn(e.target.value).replace(/\D/g, "")
              )
            }
            className="input"
            disabled={v.shipping_free_enabled !== "true"}
          />
        </Field>
      </section>

      {/* POST */}
      <section className="rounded-2xl border border-line bg-white p-4 space-y-3">
        <header className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-600">
            <Truck size={18} />
          </span>
          <div className="flex-1">
            <div className="text-sm font-bold text-ink-900">پست پیشتاز</div>
            <div className="text-[11px] text-ink-500">ارسال به سراسر ایران</div>
          </div>
          <Toggle
            checked={v.shipping_post_enabled === "true"}
            onChange={(c) => set("shipping_post_enabled", c ? "true" : "false")}
          />
        </header>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="نام نمایشی">
            <input
              value={v.shipping_post_label}
              onChange={(e) => set("shipping_post_label", e.target.value)}
              className="input"
              disabled={v.shipping_post_enabled !== "true"}
            />
          </Field>
          <Field label="هزینه (تومان)">
            <input
              inputMode="numeric"
              value={v.shipping_post_price}
              onChange={(e) =>
                set("shipping_post_price", toEn(e.target.value).replace(/\D/g, ""))
              }
              className="input"
              disabled={v.shipping_post_enabled !== "true"}
            />
          </Field>
          <Field label="زمان تحویل">
            <input
              value={v.shipping_post_days}
              onChange={(e) => set("shipping_post_days", e.target.value)}
              className="input"
              disabled={v.shipping_post_enabled !== "true"}
            />
          </Field>
        </div>
      </section>

      {/* TIPAX */}
      <section className="rounded-2xl border border-line bg-white p-4 space-y-3">
        <header className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-50 text-accent-600">
            <Zap size={18} />
          </span>
          <div className="flex-1">
            <div className="text-sm font-bold text-ink-900">تیپاکس</div>
            <div className="text-[11px] text-ink-500">ارسال سریع درون‌شهری و بین‌شهری</div>
          </div>
          <Toggle
            checked={v.shipping_tipax_enabled === "true"}
            onChange={(c) => set("shipping_tipax_enabled", c ? "true" : "false")}
          />
        </header>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="نام نمایشی">
            <input
              value={v.shipping_tipax_label}
              onChange={(e) => set("shipping_tipax_label", e.target.value)}
              className="input"
              disabled={v.shipping_tipax_enabled !== "true"}
            />
          </Field>
          <Field label="هزینه (تومان)">
            <input
              inputMode="numeric"
              value={v.shipping_tipax_price}
              onChange={(e) =>
                set("shipping_tipax_price", toEn(e.target.value).replace(/\D/g, ""))
              }
              className="input"
              disabled={v.shipping_tipax_enabled !== "true"}
            />
          </Field>
          <Field label="زمان تحویل">
            <input
              value={v.shipping_tipax_days}
              onChange={(e) => set("shipping_tipax_days", e.target.value)}
              className="input"
              disabled={v.shipping_tipax_enabled !== "true"}
            />
          </Field>
        </div>
      </section>

      <p className="rounded-xl bg-amber-50 px-3 py-2 text-[12px] leading-6 text-amber-700">
        💡 هزینه‌های پیشنهادی به‌عنوان پیش‌فرض برای سال ۱۴۰۴ تنظیم شده‌اند: پست پیشتاز حدود ۶۵٬۰۰۰ تومان و تیپاکس حدود ۱۲۰٬۰۰۰ تومان برای بسته‌های سبک. با توجه به وزن و مقصد، قیمت‌ها را ویرایش کنید.
      </p>
    </div>
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

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (c: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition ${
        checked ? "bg-brand-600" : "bg-line"
      }`}
      aria-pressed={checked}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
          checked ? "right-0.5" : "right-[22px]"
        }`}
      />
    </button>
  );
}
