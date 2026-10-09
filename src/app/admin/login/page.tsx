"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "خطا");
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-surface-2 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-line bg-white p-6 shadow-card"
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand-600">
          <Lock size={26} />
        </div>
        <h1 className="mt-4 text-center text-base font-extrabold text-ink-900">
          ورود به پنل مدیریت
        </h1>
        <p className="mt-1 text-center text-[12px] text-ink-500">
          رمز عبور مدیریت را وارد کنید
        </p>

        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="رمز عبور"
          className="input mt-5"
        />

        {error && (
          <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-[12px] text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-bold text-white disabled:opacity-60"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          ورود
        </button>
      </form>
    </div>
  );
}
