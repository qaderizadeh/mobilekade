"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const options = [
  { value: "newest", label: "جدیدترین" },
  { value: "best", label: "پرفروش‌ترین" },
  { value: "cheap", label: "ارزان‌ترین" },
  { value: "expensive", label: "گران‌ترین" },
] as const;

export function SortBar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const current = params.get("sort") ?? "newest";

  const setSort = (value: string) => {
    const sp = new URLSearchParams(params.toString());
    sp.set("sort", value);
    sp.delete("page");
    router.push(`${pathname}?${sp.toString()}`);
  };

  return (
    <div className="no-scrollbar flex items-center gap-2 overflow-x-auto px-4 py-3">
      <span className="shrink-0 text-[11px] text-ink-500">مرتب‌سازی:</span>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => setSort(o.value)}
          className={`shrink-0 rounded-pill border px-3 py-1.5 text-[12px] transition ${
            current === o.value
              ? "border-brand-500 bg-brand-50 text-brand-700"
              : "border-line bg-white text-ink-700"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
