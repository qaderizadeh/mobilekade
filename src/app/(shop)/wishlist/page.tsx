import Link from "next/link";
import { Heart, Home } from "lucide-react";

export const metadata = { title: "علاقه‌مندی‌ها" };

export default function WishlistPage() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-2xl place-items-center px-4">
      <div className="text-center">
        <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-surface-2 text-ink-500">
          <Heart size={32} />
        </span>
        <h1 className="mt-4 text-base font-bold text-ink-900">
          لیست علاقه‌مندی‌ها خالی است
        </h1>
        <p className="mt-2 text-[13px] leading-6 text-ink-500">
          با زدن آیکن قلب روی هر محصول، می‌توانید آن را این‌جا ذخیره کنید
          و بعداً سریع‌تر پیدایش کنید.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-brand-600 px-5 text-[13px] font-bold text-white"
        >
          <Home size={16} />
          رفتن به فروشگاه
        </Link>
      </div>
    </div>
  );
}
