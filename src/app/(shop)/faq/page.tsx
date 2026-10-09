import { HelpCircle } from "lucide-react";

export const metadata = { title: "سوالات متداول" };

const faqs = [
  {
    q: "هزینه ارسال چقدر است؟",
    a: "هزینه ارسال بستگی به روش انتخابی دارد. پست پیشتاز از ۶۵٬۰۰۰ تومان و تیپاکس از ۱۲۰٬۰۰۰ تومان شروع می‌شود. برای سبدهای بالای ۲ میلیون تومان، ارسال رایگان است.",
  },
  {
    q: "چند روز طول می‌کشد تا سفارش به دستم برسد؟",
    a: "پست پیشتاز بین ۳ تا ۷ روز کاری و تیپاکس بین ۱ تا ۳ روز کاری به دست شما می‌رسد. زمان‌ها از لحظه تأیید سفارش محاسبه می‌شود.",
  },
  {
    q: "چطور می‌توانم سفارشم را پیگیری کنم؟",
    a: "پس از ثبت سفارش، یک شماره پیگیری (مثل MK-XXXXXXXX) دریافت می‌کنید. با وارد کردن آن در صفحه «پیگیری سفارش» می‌توانید وضعیت را ببینید.",
  },
  {
    q: "آیا امکان پرداخت در محل وجود دارد؟",
    a: "بله، برای تمام سفارش‌ها امکان پرداخت در محل هنگام تحویل وجود دارد. همچنین می‌توانید کارت‌به‌کارت کنید که پس از ثبت سفارش، اطلاعات کارت برای شما ارسال می‌شود.",
  },
  {
    q: "اگر کالا مشکل داشت، چطور مرجوع کنم؟",
    a: "تا ۷ روز پس از دریافت، در صورت سالم بودن بسته‌بندی و کالا، می‌توانید درخواست مرجوعی ثبت کنید. با پشتیبانی تماس بگیرید تا راهنمایی‌تان کنیم.",
  },
  {
    q: "کالاها اصل هستند؟",
    a: "بله، تمام کالاها با ضمانت اصالت عرضه می‌شوند. در صورت مشاهده هرگونه مغایرت، کالا با هزینه ما تعویض یا مبلغ بازگردانده می‌شود.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <HelpCircle size={24} />
        </span>
        <div>
          <h1 className="text-lg font-extrabold text-ink-900">سوالات متداول</h1>
          <p className="text-[12px] text-ink-500">
            پاسخ پرتکرارترین سوالات مشتریان
          </p>
        </div>
      </div>

      <ul className="space-y-3">
        {faqs.map((f, i) => (
          <li
            key={i}
            className="rounded-2xl border border-line bg-white p-4"
          >
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between gap-3 text-[13px] font-bold text-ink-900 [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-surface-2 text-ink-500 transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-[13px] leading-7 text-ink-700">{f.a}</p>
            </details>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-2xl bg-surface-2 p-4 text-center">
        <p className="text-[13px] text-ink-700">جواب سوالت را پیدا نکردی؟</p>
        <a
          href="tel:02112345678"
          className="mt-2 inline-flex h-10 items-center rounded-xl bg-brand-600 px-5 text-[13px] font-bold text-white"
        >
          تماس با پشتیبانی
        </a>
      </div>
    </div>
  );
}
