export function Footer() {
  return (
    <footer className="mt-10 border-t border-line bg-white pb-24 lg:pb-8">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-ink-500">
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <h3 className="mb-2 font-bold text-ink-900">موبایل‌کده</h3>
            <p className="leading-7">
              فروشگاه اینترنتی لوازم جانبی موبایل با ضمانت اصالت کالا و ارسال
              سریع به سراسر ایران.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-bold text-ink-900">خدمات مشتریان</h3>
            <ul className="space-y-1.5">
              <li>پیگیری سفارش</li>
              <li>شرایط مرجوعی</li>
              <li>روش‌های ارسال</li>
              <li>سوالات متداول</li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-bold text-ink-900">تماس با ما</h3>
            <ul className="space-y-1.5">
              <li>۰۲۱-۱۲۳۴۵۶۷۸</li>
              <li>support@mobilekade.ir</li>
              <li>پاسخگویی: شنبه تا پنجشنبه ۹ تا ۱۸</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-line pt-4 text-center text-xs">
          © ۱۴۰۴ موبایل‌کده — کلیه حقوق محفوظ است.
        </div>
      </div>
    </footer>
  );
}
