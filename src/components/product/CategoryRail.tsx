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
  type LucideIcon,
} from "lucide-react";

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

export type CategoryItem = {
  id: string;
  slug: string;
  name: string;
};

export function CategoryRail({ categories }: { categories: CategoryItem[] }) {
  return (
    <section className="mt-6">
      <div className="mb-3 px-4">
        <h2 className="text-base font-extrabold text-ink-900">دسته‌بندی‌ها</h2>
      </div>
      <div className="no-scrollbar flex gap-4 overflow-x-auto px-4 pb-1">
        {categories.map((c) => {
          const Icon = iconMap[c.slug] ?? Smartphone;
          return (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="flex w-20 shrink-0 flex-col items-center gap-2"
            >
              <span className="grid h-16 w-16 place-items-center rounded-2xl border border-line bg-white text-brand-600 shadow-sm active:scale-95">
                <Icon size={26} strokeWidth={1.8} />
              </span>
              <span className="line-clamp-2 text-center text-[11px] leading-4 text-ink-700">
                {c.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
