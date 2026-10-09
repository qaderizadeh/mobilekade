"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Upload, X, Image as ImageIcon, Save, Trash2 } from "lucide-react";
import { toEn } from "@/lib/format";

type Category = { id: string; name: string };
type Brand = { id: string; name: string };

export type ProductFormValues = {
  id?: string;
  name: string;
  slug: string;
  shortDesc: string;
  price: number;
  comparePrice: number | null;
  stock: number;
  categoryId: string;
  brandId: string | null;
  images: string[];
  specs: { key: string; value: string }[];
  isActive: boolean;
  isFeatured: boolean;
};

const empty: ProductFormValues = {
  name: "",
  slug: "",
  shortDesc: "",
  price: 0,
  comparePrice: null,
  stock: 0,
  categoryId: "",
  brandId: null,
  images: [],
  specs: [],
  isActive: true,
  isFeatured: false,
};

export function ProductForm({
  initial,
  categories,
  brands,
  presetImages,
}: {
  initial?: ProductFormValues;
  categories: Category[];
  brands: Brand[];
  presetImages: string[];
}) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [v, setV] = useState<ProductFormValues>(initial ?? {
    ...empty,
    categoryId: categories[0]?.id ?? "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const update = <K extends keyof ProductFormValues>(k: K, val: ProductFormValues[K]) =>
    setV((s) => ({ ...s, [k]: val }));

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "خطای بارگذاری");
      update("images", [...v.images, data.url]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (idx: number) =>
    update("images", v.images.filter((_, i) => i !== idx));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = {
        ...v,
        price: Number(v.price) || 0,
        comparePrice: v.comparePrice ? Number(v.comparePrice) : null,
        stock: Number(v.stock) || 0,
        specs: Object.fromEntries(
          v.specs.filter((s) => s.key.trim()).map((s) => [s.key.trim(), s.value])
        ),
      };
      const url = isEdit
        ? `/api/admin/products/${initial!.id}`
        : "/api/admin/products";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "خطا در ذخیره");
      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const del = async () => {
    if (!isEdit) return;
    if (!confirm("این محصول حذف شود؟")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${initial!.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("خطا در حذف");
      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-extrabold text-ink-900">
          {isEdit ? "ویرایش محصول" : "افزودن محصول جدید"}
        </h1>
        <div className="flex items-center gap-2">
          {isEdit && (
            <button
              type="button"
              onClick={del}
              className="flex h-10 items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 text-[13px] font-bold text-red-600"
            >
              <Trash2 size={16} />
              حذف
            </button>
          )}
          <button
            type="submit"
            disabled={saving}
            className="flex h-10 items-center gap-2 rounded-xl bg-brand-600 px-4 text-[13px] font-bold text-white disabled:opacity-60"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            ذخیره
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-3 py-2 text-[12px] text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <section className="rounded-2xl border border-line bg-white p-4 space-y-3">
            <h2 className="text-sm font-bold text-ink-900">اطلاعات اصلی</h2>
            <Field label="نام محصول *">
              <input
                required
                value={v.name}
                onChange={(e) => update("name", e.target.value)}
                className="input"
              />
            </Field>
            <Field label="اسلاگ (انگلیسی، یکتا) *">
              <input
                required
                dir="ltr"
                value={v.slug}
                onChange={(e) => update("slug", e.target.value)}
                className="input text-left"
              />
            </Field>
            <Field label="توضیح کوتاه">
              <textarea
                rows={3}
                value={v.shortDesc}
                onChange={(e) => update("shortDesc", e.target.value)}
                className="input resize-none"
              />
            </Field>
          </section>

          <section className="rounded-2xl border border-line bg-white p-4 space-y-3">
            <h2 className="text-sm font-bold text-ink-900">قیمت و موجودی</h2>
            <div className="grid grid-cols-2 gap-3">
              <Field label="قیمت (تومان) *">
                <input
                  required
                  inputMode="numeric"
                  value={v.price}
                  onChange={(e) => update("price", Number(toEn(e.target.value).replace(/\D/g, "")) || 0)}
                  className="input"
                />
              </Field>
              <Field label="قیمت قبل از تخفیف">
                <input
                  inputMode="numeric"
                  value={v.comparePrice ?? ""}
                  onChange={(e) => {
                    const raw = toEn(e.target.value).replace(/\D/g, "");
                    update("comparePrice", raw ? Number(raw) : null);
                  }}
                  className="input"
                />
              </Field>
              <Field label="موجودی *">
                <input
                  required
                  inputMode="numeric"
                  value={v.stock}
                  onChange={(e) => update("stock", Number(toEn(e.target.value).replace(/\D/g, "")) || 0)}
                  className="input"
                />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-white p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-ink-900">مشخصات فنی</h2>
              <button
                type="button"
                onClick={() => update("specs", [...v.specs, { key: "", value: "" }])}
                className="text-[12px] font-bold text-brand-600"
              >
                + افزودن
              </button>
            </div>
            {v.specs.length === 0 && (
              <p className="text-[12px] text-ink-500">مشخصاتی اضافه نشده</p>
            )}
            {v.specs.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  placeholder="عنوان"
                  value={s.key}
                  onChange={(e) => {
                    const arr = [...v.specs];
                    arr[i].key = e.target.value;
                    update("specs", arr);
                  }}
                  className="input flex-1"
                />
                <input
                  placeholder="مقدار"
                  value={s.value}
                  onChange={(e) => {
                    const arr = [...v.specs];
                    arr[i].value = e.target.value;
                    update("specs", arr);
                  }}
                  className="input flex-1"
                />
                <button
                  type="button"
                  onClick={() =>
                    update("specs", v.specs.filter((_, x) => x !== i))
                  }
                  className="grid h-10 w-10 place-items-center rounded-lg bg-red-50 text-red-600"
                  aria-label="حذف"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-line bg-white p-4">
            <h2 className="mb-3 text-sm font-bold text-ink-900">تصاویر</h2>
            <div className="grid grid-cols-3 gap-2">
              {v.images.map((src, i) => (
                <div
                  key={src + i}
                  className="relative aspect-square overflow-hidden rounded-xl bg-surface-2"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-red-600 text-white"
                    aria-label="حذف تصویر"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              <label className="grid aspect-square cursor-pointer place-items-center rounded-xl border-2 border-dashed border-line bg-surface-2 text-ink-500 hover:border-brand-300 hover:text-brand-600">
                {uploading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Upload size={20} />
                )}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) upload(f);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>

            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-line bg-surface-2 py-2 text-[12px] text-ink-700"
            >
              <ImageIcon size={14} />
              انتخاب از گالری پیش‌فرض
            </button>
          </section>

          <section className="rounded-2xl border border-line bg-white p-4 space-y-3">
            <h2 className="text-sm font-bold text-ink-900">دسته و برند</h2>
            <Field label="دسته‌بندی *">
              <select
                required
                value={v.categoryId}
                onChange={(e) => update("categoryId", e.target.value)}
                className="input"
              >
                <option value="">انتخاب کنید…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="برند">
              <select
                value={v.brandId ?? ""}
                onChange={(e) => update("brandId", e.target.value || null)}
                className="input"
              >
                <option value="">—</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </Field>
          </section>

          <section className="rounded-2xl border border-line bg-white p-4 space-y-2">
            <label className="flex items-center justify-between text-[13px]">
              <span className="text-ink-700">فعال (نمایش در فروشگاه)</span>
              <input
                type="checkbox"
                checked={v.isActive}
                onChange={(e) => update("isActive", e.target.checked)}
                className="h-5 w-5 accent-brand-600"
              />
            </label>
            <label className="flex items-center justify-between text-[13px]">
              <span className="text-ink-700">نمایش در پیشنهاد ویژه</span>
              <input
                type="checkbox"
                checked={v.isFeatured}
                onChange={(e) => update("isFeatured", e.target.checked)}
                className="h-5 w-5 accent-brand-600"
              />
            </label>
          </section>
        </aside>
      </div>

      {pickerOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
          onClick={() => setPickerOpen(false)}
        >
          <div
            className="max-h-[80vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold">گالری پیش‌فرض</h3>
              <button
                onClick={() => setPickerOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg bg-surface-2"
              >
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {presetImages.map((src) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => {
                    update("images", [...v.images, src]);
                    setPickerOpen(false);
                  }}
                  className="aspect-square overflow-hidden rounded-lg border-2 border-transparent hover:border-brand-500"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] text-ink-500">{label}</span>
      {children}
    </label>
  );
}
