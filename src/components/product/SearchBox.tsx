"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toEn } from "@/lib/format";

export function SearchBox({ autoFocus }: { autoFocus?: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");

  useEffect(() => {
    setQ(params.get("q") ?? "");
  }, [params]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = toEn(q).trim();
    if (!value) {
      router.push("/search");
      return;
    }
    router.push(`/search?q=${encodeURIComponent(value)}`);
  };

  return (
    <form
      onSubmit={submit}
      className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 shadow-sm"
    >
      <Search size={18} className="shrink-0 text-ink-500" />
      <input
        autoFocus={autoFocus}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="جستجو در لوازم جانبی…"
        className="h-9 flex-1 bg-transparent text-sm outline-none"
      />
      {q && (
        <button
          type="button"
          aria-label="پاک کردن"
          onClick={() => setQ("")}
          className="grid h-7 w-7 place-items-center rounded-full text-ink-500 hover:bg-surface-2"
        >
          <X size={16} />
        </button>
      )}
      <button
        type="submit"
        className="grid h-9 w-9 place-items-center rounded-lg bg-brand-600 text-white active:scale-95"
        aria-label="جستجو"
      >
        <Search size={16} />
      </button>
    </form>
  );
}
