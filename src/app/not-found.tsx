import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-4 text-center">
      <div>
        <div className="text-5xl font-extrabold text-brand-600">۴۰۴</div>
        <h1 className="mt-3 text-lg font-bold text-ink-900">
          صفحه‌ای که دنبالش بودی پیدا نشد
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          ممکن است آدرس اشتباه باشد یا محصول حذف شده باشد.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex h-11 items-center rounded-xl bg-brand-600 px-6 text-sm font-bold text-white"
        >
          بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}
