# موبایل‌کده — فروشگاه لوازم جانبی موبایل

فروشگاه اینترنتی فارسی، موبایل-اول، با پنل مدیریت اختصاصی.

## مستندات

| سند | مخاطب |
|---|---|
| [docs/DEVELOPER.md](docs/DEVELOPER.md) | توسعه‌دهندگان |
| [docs/ADMIN.md](docs/ADMIN.md) | مدیر فروشگاه |
| [docs/CUSTOMER.md](docs/CUSTOMER.md) | مشتریان |
| [AGENTS.md](AGENTS.md) | ایجنت‌های هوش مصنوعی |

## راه‌اندازی سریع

    npm install
    cp .env.example .env
    npx prisma migrate deploy
    npx tsx prisma/seed.ts
    npm run dev

سپس:
- فروشگاه: http://localhost:3000
- پنل مدیریت: http://localhost:3000/admin/login (رمز پیش‌فرض: `admin1234`)

## امکانات

### فروشگاه (مشتری)
- صفحهٔ اصلی: هیرو، دسته‌بندی‌ها، پیشنهاد ویژه، پرفروش‌ترین‌ها، جدیدترین‌ها
- صفحهٔ محصول: گالری، مشخصات فنی، محصولات مشابه، افزودن به سبد
- دسته‌بندی و جستجوی هوشمند با مرتب‌سازی
- سبد خرید (localStorage) + تسویه حساب مهمان
- انتخاب روش ارسال (رایگان / پست پیشتاز / تیپاکس) با هزینهٔ زنده
- پرداخت: پرداخت در محل یا کارت‌به‌کارت
- پیگیری سفارش با شماره پیگیری و نمایش مراحل
- دستیار هوشمند شناور
- منوی کناری (Drawer) با لینک‌های اصلی و پشتیبانی
- صفحات: سوالات متداول، شرایط مرجوعی، درباره ما، تماس، حساب من
- موبایل‌اول، RTL، فونت وزیرمتن، اعداد و تاریخ شمسی

### پنل مدیریت
- داشبورد: درآمد، تعداد سفارش، محصولات فعال، کم‌موجود
- دستیار مدیریت فارسی
- محصولات: CRUD کامل، آپلود تصویر + گالری پیش‌فرض، soft delete
- سفارش‌ها: تغییر وضعیت، کپی آدرس، جزئیات کالاها
- تنظیمات ارسال: پیکربندی رایگان / پست / تیپاکس

## تکنولوژی

- Next.js 16 (App Router) + TypeScript + Tailwind v4
- Prisma 7 + SQLite (قابل تغییر به PostgreSQL)
- Zustand (سبد) + jose (JWT ادمین) + dayjs + jalaliday
- فونت وزیرمتن (لوکال، ۴ وزن)

## ساختار

    src/app/(shop)          صفحات فروشگاه
    src/app/admin           پنل مدیریت (login آزاد، بقیه محافظت‌شده)
    src/app/api             API سفارش و ادمین
    src/components          layout, product, cart, admin
    src/lib                 prisma, cart, format, date, queries, settings, auth
    prisma/schema.prisma    اسکیمای دیتابیس
    prisma/seed.ts          داده نمونه (۸ دسته، ۸ برند، ۱۹ محصول)
    public/fonts            وزیرمتن
    public/images/products  ۳۳ تصویر محصول (بهینه‌شده)
    public/uploads/products محل آپلود تصاویر جدید
    docs/                   مستندات

## نکات پروداکشن

- `ADMIN_PASSWORD` و `ADMIN_SECRET` را در `.env` عوض کنید.
- برای PostgreSQL: `provider` را در `schema.prisma` به `postgresql` تغییر دهید و adapter را به `@prisma/adapter-pg` سوییچ کنید.
- برای درگاه پرداخت واقعی (زرین‌پال / زیبال / آیدی‌پی)، API route جدید اضافه کنید.
- برای پیامک OTP، از کاوه‌نگار / قاصدک / ملی‌پیامک استفاده کنید.
- برای سرعت واقعی: `npm run build && npm start` (dev mode کش را غیرفعال می‌کند).

## مجوز

کلیه حقوق محفوظ است.
