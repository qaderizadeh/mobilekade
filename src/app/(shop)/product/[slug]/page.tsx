import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronLeft,
  Store,
} from "lucide-react";
import { getProductBySlug, getRelatedProducts, parseImages } from "@/lib/queries";
import { formatPrice, formatNumber, toFa } from "@/lib/format";
import { ImageGallery } from "@/components/product/ImageGallery";
import { AddToCartBar } from "@/components/product/AddToCartBar";
import { ProductRail } from "@/components/product/ProductRail";

export const metadata = { title: "جزئیات محصول" };

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const images = parseImages(product.images);
  const specs: Record<string, string> = product.specs
    ? JSON.parse(product.specs)
    : {};
  const related = await getRelatedProducts(product.categoryId, product.id, 8);

  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(
          ((product.comparePrice - product.price) / product.comparePrice) * 100
        )
      : 0;

  return (
    <div className="pb-32 lg:pb-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 px-4 py-3 text-[11px] text-ink-500">
        <Link href="/">خانه</Link>
        <ChevronLeft size={12} />
        <Link href={`/category/${product.category.slug}`}>
          {product.category.name}
        </Link>
        <ChevronLeft size={12} />
        <span className="truncate text-ink-700">{product.name}</span>
      </nav>

      <div className="lg:mx-auto lg:grid lg:max-w-6xl lg:grid-cols-2 lg:gap-8 lg:px-4">
        {/* Gallery */}
        <div className="px-4 lg:px-0">
          <ImageGallery images={images} alt={product.name} />
        </div>

        {/* Details */}
        <div className="mt-4 px-4 lg:mt-0 lg:px-0">
          <h1 className="text-base font-extrabold leading-7 text-ink-900 lg:text-xl lg:leading-9">
            {product.name}
          </h1>

          {product.shortDesc && (
            <p className="mt-2 text-[13px] leading-6 text-ink-500">
              {product.shortDesc}
            </p>
          )}

          {/* Rating */}
          <div className="mt-3 flex items-center gap-3 text-[12px] text-ink-500">
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-amber-400 text-amber-400" />
              <span className="font-bold text-ink-700">
                {toFa(product.rating.toFixed(1))}
              </span>
            </div>
            <span className="text-line">|</span>
            <span>{formatNumber(product.reviewCount)} نظر</span>
            <span className="text-line">|</span>
            <span>{formatNumber(product.soldCount)} فروش</span>
          </div>

          {/* Price card */}
          <div className="mt-4 rounded-2xl border border-line bg-white p-4">
            {product.comparePrice && product.comparePrice > product.price && (
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-pill bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-600">
                  {formatNumber(discount)}٪ تخفیف
                </span>
                <span className="text-xs text-ink-500 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              </div>
            )}
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[11px] text-ink-500">قیمت نهایی</div>
                <div className="text-xl font-extrabold text-ink-900">
                  {formatPrice(product.price)}
                </div>
              </div>
              {product.brand && (
                <div className="text-left">
                  <div className="text-[11px] text-ink-500">برند</div>
                  <div className="text-sm font-bold text-brand-700">
                    {product.brand.name}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Trust badges */}
          <ul className="mt-4 grid grid-cols-3 gap-2 text-[11px] text-ink-700">
            <li className="flex flex-col items-center gap-1 rounded-xl border border-line bg-white p-3 text-center">
              <Truck size={18} className="text-brand-600" />
              <span>ارسال سریع</span>
            </li>
            <li className="flex flex-col items-center gap-1 rounded-xl border border-line bg-white p-3 text-center">
              <ShieldCheck size={18} className="text-brand-600" />
              <span>ضمانت اصالت</span>
            </li>
            <li className="flex flex-col items-center gap-1 rounded-xl border border-line bg-white p-3 text-center">
              <RotateCcw size={18} className="text-brand-600" />
              <span>۷ روز مرجوعی</span>
            </li>
          </ul>

          {/* Add to cart — desktop inline */}
          <div className="hidden lg:block">
            <AddToCartBar
              productId={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              image={images[0] ?? "/images/placeholder.jpg"}
              stock={product.stock}
            />
          </div>
        </div>
      </div>

      {/* Specs */}
      {Object.keys(specs).length > 0 && (
        <section className="mt-6 px-4 lg:mx-auto lg:max-w-6xl">
          <h2 className="mb-3 text-base font-extrabold text-ink-900">
            مشخصات فنی
          </h2>
          <dl className="overflow-hidden rounded-2xl border border-line bg-white">
            {Object.entries(specs).map(([k, v], i) => (
              <div
                key={k}
                className={`flex items-center justify-between gap-4 px-4 py-3 text-[13px] ${
                  i !== 0 ? "border-t border-line" : ""
                }`}
              >
                <dt className="text-ink-500">{k}</dt>
                <dd className="font-medium text-ink-900">{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Seller card */}
      <section className="mt-6 px-4 lg:mx-auto lg:max-w-6xl">
        <div className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-600">
            <Store size={22} />
          </span>
          <div className="flex-1">
            <div className="text-[13px] font-bold text-ink-900">فروشنده</div>
            <div className="text-[12px] text-ink-500">موبایل‌کده — رسمی</div>
          </div>
          <span className="rounded-pill bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-600">
            عملکرد عالی
          </span>
        </div>
      </section>

      {related.length > 0 && (
        <div className="mt-6 lg:mx-auto lg:max-w-6xl">
          <ProductRail title="محصولات مشابه" products={related} />
        </div>
      )}

      {/* Add to cart — mobile sticky */}
      <div className="lg:hidden">
        <AddToCartBar
          productId={product.id}
          slug={product.slug}
          name={product.name}
          price={product.price}
          image={images[0] ?? "/images/placeholder.jpg"}
          stock={product.stock}
        />
      </div>
    </div>
  );
}
