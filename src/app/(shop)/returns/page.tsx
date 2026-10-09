import { ShieldCheck, CheckCircle2, XCircle } from "lucide-react";

export const metadata = { title: "شرایط مرجوعی" };

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
          <ShieldCheck size={24} />
        </span>
        <div>
          <h1 className="text-lg font-extrabold text-ink-900">شرایط مرجوعی</h1>
          <p className="text-[12px] text-ink-500">
            ۷ روز ضمانت بازگشت بدون قید و شرط
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-line bg-white p-4">
        <h2 className="flex items-center gap-2 text-sm font-bold text-emerald-700">
          <CheckCircle2 size={16} />
          شرایط پذیرش مرجوعی
        </h2>
        <ul className="mt-3 space-y-2 text-[13px] leading-7 text-ink-700">
          <li>• حداکثر تا ۷ روز پس از تحویل کالا</li>
          <li>• کالا و بسته‌بندی سالم و بدون آسیب باشد</li>
          <li>• لوازم همراه (کابل، دفترچه، جعبه) کامل باشد</li>
          <li>• برچسب و پلمب کالا باز نشده باشد</li>
          <li>• فاکتور یا شماره سفارش همراه داشته باشید</li>
        </ul>
      </section>

      <section className="mt-4 rounded-2xl border border-line bg-white p-4">
        <h2 className="flex items-center gap-2 text-sm font-bold text-red-700">
          <XCircle size={16} />
          موارد غیرقابل مرجوعی
        </h2>
        <ul className="mt-3 space-y-2 text-[13px] leading-7 text-ink-700">
          <li>• گلس و محافظ صفحه پس از باز شدن بسته</li>
          <li>• هندزفری و هدفون به دلیل مسائل بهداشتی</li>
          <li>• کالاهای سفارشی یا حکاکی‌شده</li>
          <li>• آسیب‌های ناشی از استفاده نادرست</li>
        </ul>
      </section>

      <section className="mt-4 rounded-2xl bg-surface-2 p-4">
        <h2 className="text-sm font-bold text-ink-900">مراحل مرجوعی</h2>
        <ol className="mt-3 space-y-2 text-[13px] leading-7 text-ink-700">
          <li>
            <span className="font-bold text-ink-900">۱.</span> تماس با پشتیبانی
            یا ثبت درخواست
          </li>
          <li>
            <span className="font-bold text-ink-900">۲.</span> تأیید کارشناس
            پس از بررسی
          </li>
          <li>
            <span className="font-bold text-ink-900">۳.</span> ارسال کالا به
            آدرس فروشگاه
          </li>
          <li>
            <span className="font-bold text-ink-900">۴.</span> بازگشت مبلغ یا
            تعویض کالا
          </li>
        </ol>
      </section>

      <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-[12px] leading-6 text-amber-700">
        هزینه ارسال مرجوعی در صورت ایراد کالا با فروشگاه است و در صورت انصراف
        مشتری، به عهده خریدار خواهد بود.
      </p>
    </div>
  );
}
