import Link from "next/link";
import {
  Smartphone,
  Shield,
  Plug,
  BatteryCharging,
  Headphones,
  Car,
  Watch,
  Cable,
  ChevronLeft,
  type LucideIcon,
} from "lucide-react";
import { getCategories } from "@/lib/queries";

export const metadata = { title: "دسته‌بندی‌ها" };

const iconMap: Record<string, LucideIcon> = {
  case: Smartphone,
  glass: Shield,
  charger: Plug,
  powerbank: BatteryCharging,
  headphone: Headphones,
  holder: Car,
  "watch-band": Watch,
  cable: Cable,
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-6xl px-4 py-4">
      <h1 className="mb-4 text-lg font-extrabold text-ink-900">دسته‌بندی‌ها</h1>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((c) => {
          const Icon = iconMap[c.slug] ?? Smartphone;
          return (
            <li key={c.id}>
              <Link
                href={`/category/${c.slug}`}
                className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4 active:scale-[0.98]"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600">
                  <Icon size={24} />
                </span>
                <span className="flex-1 text-[13px] font-bold text-ink-900">
                  {c.name}
                </span>
                <ChevronLeft size={16} className="text-ink-500" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
