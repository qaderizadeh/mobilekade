# Developer Guide

راهنمای کامل برای توسعه‌دهندگان موبایل‌کده.

## فهرست

1. شروع سریع
2. معماری
3. استک
4. ساختار پروژه
5. دیتابیس
6. احراز هویت
7. جریان خرید
8. پنل مدیریت
9. سیستم ارسال
10. جستجو
11. طراحی و رنگ‌ها
12. کنوانسیون‌های فارسی
13. Build و Deploy
14. کارهای پرتکرار
15. عیب‌یابی

---

## ۱. شروع سریع

نیازمندی‌ها: Node.js 20+ و npm 11+

    git clone <your-repo-url> mobilekade
    cd mobilekade
    npm install
    cp .env.example .env
    # ویرایش .env: DATABASE_URL، ADMIN_PASSWORD، ADMIN_SECRET
    npx prisma migrate deploy
    npx tsx prisma/seed.ts
    npm run dev

سپس:
- فروشگاه: http://localhost:3000
- پنل مدیریت: http://localhost:3000/admin/login (رمز پیش‌فرض: admin1234)

---

## ۲. معماری

این یک اپلیکیشن Next.js 16 App Router است — فرانت و بک در یک جا.

- Next.js route handlers به‌عنوان API
- SQLite برای توسعه (قابل سوییچ به Postgres)
- Prisma 7 با driver adapter
- بدون احراز هویت مشتری — خرید مهمان
- ادمین با JWT cookie
- تمام UI فارسی و RTL

### چرخهٔ درخواست

۱. درخواست به Next.js می‌رسد.
۲. Route group (shop) یا admin/(protected) لایوت خود را اعمال می‌کند.
۳. Server Component داده را از Prisma می‌گیرد (lib/queries.ts، lib/listQuery.ts).
۴. Client Componentها (سبد، فرم، drawer) از Zustand استفاده می‌کنند.
۵. API routes (/api/*) نوشتن‌ها را مدیریت می‌کنند.

---

## ۳. استک

- Framework: Next.js 16 App Router
- Language: TypeScript 5
- Styling: Tailwind CSS v4
- Database: SQLite + Prisma 7
- State: Zustand + persist (سبد)
- Auth: jose (JWT ادمین)
- Dates: dayjs + jalaliday
- Icons: lucide-react
- Font: Vazirmatn (لوکال)

---

## ۴. ساختار پروژه

    mobilekade/
    ├── prisma/
    │   ├── schema.prisma
    │   ├── migrations/
    │   └── seed.ts
    ├── public/
    │   ├── fonts/
    │   ├── images/products/
    │   └── uploads/products/
    ├── src/
    │   ├── app/
    │   │   ├── (shop)/
    │   │   ├── admin/
    │   │   ├── api/
    │   │   ├── layout.tsx
    │   │   └── globals.css
    │   ├── components/
    │   │   ├── layout/
    │   │   ├── product/
    │   │   ├── cart/
    │   │   └── admin/
    │   ├── lib/
    │   │   ├── prisma.ts
    │   │   ├── format.ts
    │   │   ├── date.ts
    │   │   ├── cart.ts
    │   │   ├── queries.ts
    │   │   ├── listQuery.ts
    │   │   ├── settings.ts
    │   │   └── admin/auth.ts
    │   └── generated/prisma/
    ├── docs/
    ├── AGENTS.md
    └── README.md

---

## ۵. دیتابیس

مدل‌های اصلی در `prisma/schema.prisma`:

- **User** — role (customer|admin). فعلاً مشتریان استفاده نمی‌شوند.
- **Product** — images و specs رشته JSON هستند.
- **Order** — userId nullable (خرید مهمان). addressJson اسنپ‌شات آدرس. shippingMethod (free|post|tipax). paymentMethod (cod|card).
- **Setting** — جدول key/value برای پیکربندی.

### دستورات پرتکرار

    npx prisma migrate deploy              # اعمال Migration‌ها
    npx prisma migrate dev --name desc     # Migration جدید
    npx prisma generate                    # بازتولید کلاینت
    npx prisma studio                      # GUI
    npx prisma migrate reset               # ریست (مخرب!)
    npx tsx prisma/seed.ts                 # دادهٔ نمونه

### سوییچ به PostgreSQL

۱. `provider` در schema.prisma را `postgresql` کن.
۲. `@prisma/adapter-pg` و `pg` نصب کن.
۳. src/lib/prisma.ts و prisma/seed.ts را به PrismaPg تغییر بده.
۴. `.env` — DATABASE_URL را به Postgres تغییر بده.
۵. prisma/migrations را پاک کن و `migrate dev --name init` بزن.

---

## ۶. احراز هویت

### ادمین (پیاده‌سازی‌شده)

- `POST /api/admin/login` رمز را با `ADMIN_PASSWORD` چک می‌کند.
- کوکی `mk_admin` (httpOnly، JWT ۷ روزه) ست می‌شود.
- همهٔ `/admin/*` به‌جز `/admin/login` توسط `src/app/admin/(protected)/layout.tsx` با `isAdmin()` محافظت می‌شوند.

### مشتری (پیاده‌سازی‌نشده)

خرید مهمان است. برای افزودن:

۱. فیلد PasswordHash یا OtpCode به User اضافه کن.
۲. صفحات `/login` و `/register` زیر `(shop)`.
۳. `POST /api/auth/login` و ...
۴. `Order.userId` را در صورت لاگین ست کن.
۵. برای OTP: از SMS provider (کاوه‌نگار، قاصدک، ...) استفاده کن.

---

## ۷. جریان خرید

۱. گشت — خانه، دسته، جستجو، محصول.
۲. افزودن به سبد — `useCart.add()` در Zustand + localStorage.
۳. تسویه (`/checkout`):
   - فرم آدرس
   - روش ارسال از `GET /api/shipping?subtotal=X`
   - روش پرداخت
۴. ثبت سفارش — `POST /api/orders`:
   - سرور دوباره subtotal را از DB محاسبه می‌کند
   - سرور دوباره shipping را از Setting محاسبه می‌کند
   - تراکنش: Order + OrderItems، کاهش stock، افزایش soldCount
۵. تأیید — ریدایرکت به `/order/[orderNumber]`

---

## ۸. پنل مدیریت

آدرس: `/admin`. ورود: `/admin/login`.

| صفحه | مسیر | کاربرد |
|---|---|---|
| داشبورد | /admin | درآمد، تعداد سفارش، کم‌موجود |
| محصولات | /admin/products | جستجو + ویرایش |
| محصول جدید | /admin/products/new | ایجاد |
| ویرایش | /admin/products/[id] | ویرایش / soft-delete |
| سفارش‌ها | /admin/orders | تغییر وضعیت |
| تنظیمات ارسال | /admin/settings | پیکربندی |

- **آپلود تصویر:** `POST /api/admin/upload` → `public/uploads/products/`
- **Soft delete:** محصولات hard-delete نمی‌شوند. DELETE فقط `isActive=false, stock=0` می‌کند.

---

## ۹. سیستم ارسال

کلیدهای پیکربندی در `lib/settings.ts`. سرور دوباره قیمت را محاسبه می‌کند.

### افزودن روش جدید

۱. کلیدها را به `SHIPPING_KEYS` و `DEFAULTS` اضافه کن.
۲. به `getShippingMethods()` اضافه کن.
۳. فیلدها را به `ShippingSettingsForm.tsx` اضافه کن.
۴. آیکن را در `CheckoutForm.tsx` map کن.
۵. label helper را در `order/[orderNumber]/page.tsx` و `OrderRow.tsx` به‌روز کن.

---

## ۱۰. جستجو

`listProducts()` در `lib/listQuery.ts`:

۱. عبارت را با فاصله به کلمات تقسیم می‌کند.
۲. AND بین کلمات، OR بین فیلدها.
۳. اگر صفر شد، با OR بین کلمات دوباره می‌گردد.

---

## ۱۱. طراحی و رنگ‌ها

در `src/app/globals.css` با `@theme` تعریف شده.

- `brand-{50..900}` — آبی برند
- `accent-{50,400,500,600}` — نارنجی CTA
- `ink-{500,700,900}` — متن
- `surface`, `surface-2`, `line` — پس‌زمینه و مرز

کلاس‌های کمکی: `.input`, `.safe-top`, `.safe-bottom`, `.no-scrollbar`, `.num-fa`, `.rounded-card`, `.rounded-pill`, `.shadow-card`, `.shadow-float`

---

## ۱۲. کنوانسیون‌های فارسی

### اعداد

    import { toFa, toEn, formatPrice, digitsOnly } from "@/lib/format";
    toFa("1234")          // "۱۲۳۴"
    toEn("۱۲۳۴")          // "1234"
    formatPrice(890000)   // "۸۹۰٬۰۰۰ تومان"
    digitsOnly("۰۹۱۲-۳۴")  // "09123"

### تاریخ (شمسی)

    import { formatJalali, formatJalaliWithTime, timeAgo } from "@/lib/date";
    formatJalali(new Date())             // "۱۴۰۴/۰۷/۱۷"
    formatJalaliWithTime(new Date())     // "۱۴۰۴/۰۷/۱۷ - ۱۴:۳۰"

### RTL

- root: `html dir="rtl" lang="fa"`.
- `right-*` = شروع، `left-*` = پایان در RTL.
- برای محتوای LTR (تلفن، ایمیل)، `dir="ltr"` بگذار.

---

## ۱۳. Build و Deploy

### Build لوکال

    npm run build
    npm start

### VPS سنتی (توصیه‌شده برای ایران)

- Provider: آروان، ایران‌سرور، پارس‌پک، یا هر VPS Ubuntu
- PM2 یا systemd برای `npm start`
- Nginx با SSL
- Postgres به‌جای SQLite

### Docker

    FROM node:24-alpine
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci
    COPY . .
    RUN npx prisma generate
    RUN npm run build
    EXPOSE 3000
    CMD ["npm", "start"]

### متغیرهای محیطی پروداکشن

    DATABASE_URL=file:./dev.db
    ADMIN_PASSWORD=<رمز قوی>
    ADMIN_SECRET=<رشتهٔ تصادفی ۶۴ کاراکتری>
    NODE_ENV=production

---

## ۱۴. کارهای پرتکرار

### افزودن دستهٔ جدید

    await prisma.category.create({
      data: { slug: "new-cat", name: "دسته جدید", sortOrder: 9 }
    })

سپس در `src/components/product/CategoryRail.tsx` آیکن map کن.

### افزودن صفحهٔ ثابت

    mkdir -p "src/app/(shop)/my-page"
    cat > "src/app/(shop)/my-page/page.tsx"

### افزودن API route ادمین

    mkdir -p src/app/api/admin/my-thing
    cat > src/app/api/admin/my-thing/route.ts

با این شروع کن:

    import { isAdmin } from "@/lib/admin/auth";
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

---

## ۱۵. عیب‌یابی

### Cannot find module '@prisma/adapter-better-sqlite3'

اسکریپت را از داخل پروژه اجرا کن، نه از `/tmp`.

### Unknown argument 'userId'

کلاینت Prisma قدیمی است. `npx prisma generate` بزن و سرور را ری‌استارت کن.

### Route segment config "dynamic" is not compatible with cacheComponents

یا `dynamic` را حذف کن، یا `cacheComponents` را در `next.config.ts` غیرفعال کن.

### سرور ری‌استارت نمی‌شود

    pkill -f "next dev"
    sleep 2
    npm run dev -- --port 3000

### متن فارسی مربع نشان می‌دهد

فونت وزیرمتن در `public/fonts/` نیست. دوباره دانلود کن:

    cd public/fonts
    for w in Regular:400 Medium:500 Bold:700 ExtraBold:800; do
      name="${w%%:*}"; weight="${w##*:}"
      curl -sL "https://cdn.jsdelivr.net/npm/vazirmatn@33.0.3/fonts/webfonts/Vazirmatn-${name}.woff2" -o "Vazirmatn-${weight}.woff2"
    done
