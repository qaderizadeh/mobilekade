import { Phone, Mail, MapPin, Clock, Headset } from "lucide-react";

export const metadata = { title: "تماس با ما" };

export default function ContactPage() {
  const items = [
    {
      icon: Phone,
      title: "تلفن پشتیبانی",
      value: "۰۲۱-۱۲۳۴۵۶۷۸",
      href: "tel:02112345678",
      dir: "ltr" as const,
    },
    {
      icon: Mail,
      title: "ایمیل",
      value: "support@mobilekade.ir",
      href: "mailto:support@mobilekade.ir",
      dir: "ltr" as const,
    },
    {
      icon: Clock,
      title: "ساعات پاسخگویی",
      value: "شنبه تا پنجشنبه، ۹ صبح تا ۶ عصر",
    },
    {
      icon: MapPin,
      title: "آدرس",
      value: "تهران، خیابان ولیعصر، پلاک ۱۰، طبقه ۳",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-600">
          <Headset size={24} />
        </span>
        <div>
          <h1 className="text-lg font-extrabold text-ink-900">تماس با ما</h1>
          <p className="text-[12px] text-ink-500">
            خوشحال می‌شویم با ما در ارتباط باشی
          </p>
        </div>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map(({ icon: Icon, title, value, href, dir }) => {
          const Inner = (
            <div className="flex h-full items-start gap-3 rounded-2xl border border-line bg-white p-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Icon size={18} />
              </span>
              <div className="min-w-0">
                <div className="text-[11px] text-ink-500">{title}</div>
                <div
                  dir={dir}
                  className="mt-0.5 break-words text-[13px] font-bold text-ink-900"
                >
                  {value}
                </div>
              </div>
            </div>
          );
          return (
            <li key={title}>
              {href ? (
                <a href={href} className="block h-full">
                  {Inner}
                </a>
              ) : (
                Inner
              )}
            </li>
          );
        })}
      </ul>

      <section className="mt-6 rounded-2xl border border-line bg-white p-5">
        <h2 className="text-sm font-bold text-ink-900">پیام بفرست</h2>
        <form className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-[12px] text-ink-500">
                نام و نام خانوادگی
              </span>
              <input className="input" placeholder="نام شما" />
            </label>
            <label className="block">
              <span className="mb-1 block text-[12px] text-ink-500">
                شماره تماس
              </span>
              <input className="input" placeholder="۰۹۱۲۳۴۵۶۷۸۹" inputMode="numeric" />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-[12px] text-ink-500">پیام</span>
            <textarea
              rows={4}
              className="input resize-none"
              placeholder="پیام خود را بنویسید…"
            />
          </label>
          <button
            type="button"
            className="flex h-11 items-center justify-center rounded-xl bg-brand-600 px-5 text-[13px] font-bold text-white"
          >
            ارسال پیام
          </button>
          <p className="text-[11px] text-ink-500">
            در اسرع وقت با شما تماس می‌گیریم. برای پاسخ سریع‌تر با شماره
            پشتیبانی تماس بگیرید.
          </p>
        </form>
      </section>
    </div>
  );
}
