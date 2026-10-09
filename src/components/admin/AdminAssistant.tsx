"use client";

import { Sparkles, X, Send } from "lucide-react";
import { useState } from "react";

const tips = [
  {
    q: "چطور محصول جدید اضافه کنم؟",
    a: "از منوی کنار، روی «افزودن محصول» بزن. نام، قیمت، موجودی و تصویرها رو وارد کن و ذخیره کن. اگه تصویر محصول رو نداری، از گالری پیش‌فرض می‌تونی استفاده کنی.",
  },
  {
    q: "چطور وضعیت سفارش رو تغییر بدم؟",
    a: "به بخش «سفارش‌ها» برو، روی سفارش موردنظر بزن و از منوی کشویی وضعیت رو به «ارسال شده» یا «تحویل شده» تغییر بده.",
  },
  {
    q: "چطور قیمت یک محصول رو ویرایش کنم؟",
    a: "از بخش «محصولات»، روی محصول بزن تا فرم ویرایش باز بشه. قیمت جدید رو وارد کن و ذخیره کن.",
  },
  {
    q: "چرا بعضی محصولات کم‌موجود نشان داده می‌شن؟",
    a: "هر محصولی که موجودی‌اش کمتر از ۱۰ عدد باشه، در داشبورد به‌عنوان کم‌موجود نمایش داده می‌شه تا سریع‌تر شارژ کنی.",
  },
];

export function AdminAssistant() {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex w-full items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50 p-4 text-right"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-600 text-white">
            <Sparkles size={20} />
          </span>
          <span className="flex-1">
            <span className="block text-[13px] font-bold text-brand-800">
              دستیار مدیریت
            </span>
            <span className="block text-[11px] text-brand-700/80">
              سوال داری؟ این‌جا راهنمایی می‌گیرم
            </span>
          </span>
        </button>
      )}

      {open && (
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <header className="flex items-center gap-2 bg-brand-600 px-4 py-3 text-white">
            <Sparkles size={18} />
            <div className="flex-1">
              <div className="text-sm font-bold">دستیار مدیریت</div>
              <div className="text-[11px] text-white/80">
                راهنمای سریع برای پنل
              </div>
            </div>
            <button
              onClick={() => {
                setOpen(false);
                setAnswer(null);
              }}
              aria-label="بستن"
              className="grid h-8 w-8 place-items-center rounded-lg bg-white/10"
            >
              <X size={16} />
            </button>
          </header>

          <div className="space-y-3 p-4">
            {!answer && (
              <div className="space-y-2">
                <p className="text-[13px] text-ink-700">
                  سلام 👋 یکی از سوال‌ها رو انتخاب کن:
                </p>
                {tips.map((t) => (
                  <button
                    key={t.q}
                    onClick={() => setAnswer(t.a)}
                    className="block w-full rounded-xl border border-line bg-surface-2 px-3 py-2 text-right text-[12px] text-ink-700 hover:border-brand-300 hover:bg-brand-50"
                  >
                    {t.q}
                  </button>
                ))}
              </div>
            )}

            {answer && (
              <div className="space-y-3">
                <div className="rounded-2xl bg-brand-50 px-3 py-2 text-[13px] leading-6 text-brand-800">
                  {answer}
                </div>
                <button
                  onClick={() => setAnswer(null)}
                  className="text-[12px] text-brand-600"
                >
                  ← سوال دیگری بپرس
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
