"use client";

import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { useState } from "react";

const quickQuestions = [
  "این قاب به گوشی من می‌خوره؟",
  "وضعیت سفارشم چیه؟",
  "هزینه ارسال چقدره؟",
  "شرایط مرجوعی چیه؟",
];

export function AssistButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        aria-label="دستیار هوشمند"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-20 left-4 z-50 grid h-14 w-14 place-items-center rounded-full bg-accent-500 text-white shadow-float active:scale-95 transition lg:bottom-6 lg:left-6"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {open && (
        <div className="fixed bottom-36 left-4 z-50 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-white shadow-float lg:bottom-24 lg:left-6">
          <div className="flex items-center gap-2 bg-brand-600 px-4 py-3 text-white">
            <Sparkles size={18} />
            <div className="flex-1">
              <div className="text-sm font-bold">دستیار موبایل‌کده</div>
              <div className="text-[11px] text-white/80">
                هر سوالی داری بپرس 👋
              </div>
            </div>
          </div>

          <div className="max-h-72 space-y-3 overflow-y-auto p-4 text-sm">
            <div className="rounded-2xl rounded-tr-sm bg-surface-2 px-3 py-2 text-ink-700">
              سلام! چطور می‌تونم کمکت کنم؟ یکی از این‌ها رو انتخاب کن یا سوالت
              رو بنویس:
            </div>
            <div className="space-y-2">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  className="block w-full rounded-xl border border-line bg-white px-3 py-2 text-right text-[13px] text-ink-700 hover:border-brand-300 hover:bg-brand-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-line p-3">
            <input
              placeholder="پیامت رو بنویس…"
              className="h-10 flex-1 rounded-xl border border-line bg-surface-2 px-3 text-sm outline-none focus:border-brand-400"
            />
            <button
              aria-label="ارسال"
              className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white active:scale-95"
            >
              <Send size={18} className="-scale-x-100" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
