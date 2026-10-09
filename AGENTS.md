# AGENTS.md — راهنمای ایجنت‌های هوش مصنوعی

این فایل برای ابزارهای هوش مصنوعی (Claude Code، Cursor، Copilot، Codex و ...) نوشته شده است تا بدون خواندن کل کدبیس، پروژه را بفهمند و درست تغییر دهند.

---

## ۱. معرفی پروژه

**موبایل‌کده** یک فروشگاه اینترنتی **کاملاً فارسی و RTL** برای فروش لوازم جانبی موبایل است. موبایل-اول طراحی شده، با پنل مدیریت اختصاصی، و بدون سیستم احراز هویت مشتری (خرید مهمان).

- **استک:** Next.js 16 (App Router) + TypeScript + Tailwind v4 + Prisma 7 + SQLite
- **زبان UI:** فارسی (fa-IR)
- **جهت:** راست‌به‌چپ (RTL)
- **فونت:** Vazirmatn (۴ وزن، لوکال در public/fonts/)
- **تقویم:** جلالی (شمسی) — با dayjs + jalaliday
- **اعداد:** فارسی (۰۱۲۳۴۵۶۷۸۹) در UI
- **واحد پول:** تومان

---

## ۲. قوانین طلایی

۱. **همه‌چیز فارسی و RTL** — اگر متن UI جدید اضافه می‌کنی، باید فارسی باشد. از toFa() برای اعداد استفاده کن. تاریخ‌ها را با formatJalali* بفرست.

۲. **موبایل-اول** — هر کامپوننت جدید را اول برای صفحهٔ ۳۶۰–۴۳۰ پیکسل طراحی کن، سپس با lg: برای دسکتاپ.

۳. **برای لینک‌های داخلی از Link استفاده کن، نه a** — چون a باعث reload کامل می‌شود.

۴. **قیمت‌ها در دیتابیس به‌صورت عدد صحیح (تومان)** ذخیره می‌شوند. نمایش با formatPrice().

۵. **محاسبات قیمت‌محور در سرور** — قیمت سبد، هزینهٔ ارسال و تخفیف هرگز از سمت کلاینت اعتماد نمی‌شوند. مسیر /api/orders دوباره محاسبه می‌کند.

۶. **دیتابیس SQLite در dev.db** در ریشهٔ پروژه است. Migration‌ها در prisma/migrations/.

۷. **route group محافظت‌شده** — تمام صفحات ادمین به‌جز /admin/login داخل src/app/admin/(protected)/ هستند و توسط layout.tsx با isAdmin() محافظت می‌شوند.

۸. **route group فروشگاه** — تمام صفحات فروشگاه داخل src/app/(shop)/ هستند و layout.tsx هدر، فوتر، نوار پایین و دستیار را می‌سازد.

---

## ۳. نقشهٔ پوشه‌ها

src/app/(shop)/ صفحات فروشگاه (با هدر و نوار پایین)
- page.tsx صفحهٔ اصلی
- product/[slug]/ صفحهٔ محصول
- category/[slug]/ لیست محصولات دسته
- search/ جستجو
- cart/ سبد خرید
- checkout/ تسویه حساب
- order/[orderNumber]/ تأیید سفارش
- track/ پیگیری سفارش
- account/ حساب من
- wishlist/ علاقه‌مندی‌ها (placeholder)
- categories/ همهٔ دسته‌ها
- about/ faq/ contact/ returns/ صفحات ثابت
- layout.tsx

src/app/admin/
- login/ صفحهٔ ورود (بدون محافظت)
- (protected)/ داشبورد، محصولات، سفارش‌ها، تنظیمات

src/app/api/
- orders/ POST ثبت سفارش
- shipping/ GET روش‌های ارسال
- admin/ login, logout, products, upload, orders, settings

src/components/
- layout/ Header, BottomNav, Footer, MobileDrawer, AssistButton
- product/ ProductCard, ProductGrid, ProductRail, CategoryRail, ImageGallery, AddToCartBar, SearchBox, SortBar, WishlistButton
- cart/ CartView, CheckoutForm, CartBadge
- admin/ AdminShell, AdminAssistant, ProductForm, OrderRow, ShippingSettingsForm

src/lib/
- prisma.ts PrismaClient singleton با adapter
- format.ts toFa, toEn, formatPrice, formatNumber, digitsOnly
- date.ts formatJalali, formatJalaliWithTime, timeAgo
- utils.ts cn, slugify
- cart.ts Zustand store + persist در localStorage
- queries.ts کوئری‌های فروشگاه
- listQuery.ts جستجو + فیلتر + صفحه‌بندی (با fallback OR)
- settings.ts تنظیمات ارسال
- admin/auth.ts jose JWT برای ادمین

src/generated/prisma/ کلاینت Prisma (تولیدشده — دست نزن)

---

## ۴. جریان‌های کلیدی

### سفارش مهمان
۱. کاربر سبد را در Zustand (useCart) نگه می‌دارد → در localStorage.
۲. /checkout سبد را می‌خواند، GET /api/shipping?subtotal=X می‌زند و روش‌های ارسال را می‌گیرد.
۳. کاربر فرم آدرس + روش ارسال + روش پرداخت را پر می‌کند.
۴. POST /api/orders → دوباره محاسبهٔ subtotal، shipping، total از دیتابیس → تراکنش: ساخت Order و OrderItemها، کاهش stock و افزایش soldCount هر محصول.
۵. پاسخ orderNumber → ریدایرکت به /order/[orderNumber].

### جستجو
listProducts() در listQuery.ts:
- عبارت را با فاصله به کلمات تقسیم می‌کند
- منطق AND بین کلمات، OR بین فیلدها (name / shortDesc / description)
- اگر نتیجه صفر بود، با منطق OR بین کلمات دوباره می‌گردد (fallback)

### ادمین
- ورود: POST /api/admin/login با رمز → کوکی mk_admin (jose JWT، ۷ روزه)
- محافظت: src/app/admin/(protected)/layout.tsx با isAdmin()
- آپلود تصویر: POST /api/admin/upload → ذخیره در public/uploads/products/

---

## ۵. الگوهای طراحی (طراحی سیستم)

**رنگ‌ها (در globals.css به‌عنوان @theme):**
- brand-{50..900} — آبی برند (اصلی: brand-600)
- accent-{50,400,500,600} — نارنجی برای CTA
- ink-{500,700,900} — متن
- surface, surface-2, line — پس‌زمینه و مرز

**شعاع گوشه‌ها:** rounded-xl (12px)، rounded-2xl (16px)، rounded-card (16px)، rounded-pill

**سایه:** shadow-card, shadow-float

**کلاس .input** در globals.css برای همهٔ input/textarea/select.

**Safe-area:** .safe-top و .safe-bottom برای iOS.

---

## ۶. دیتابیس

مدل‌های اصلی: User, Address, Category, Brand, Product, Cart, CartItem, Order, OrderItem, Review, Coupon, Setting.

- Order.userId nullable است (خرید مهمان).
- Order.shippingMethod یکی از free | post | tipax.
- Order.paymentMethod یکی از cod | card.
- Order.addressJson اسنپ‌شات آدرس در زمان سفارش.
- Product.images و Product.specs رشته JSON هستند.
- Setting جدول key/value برای پیکربندی (هزینه‌های ارسال، نام سایت).

**پس از تغییر schema.prisma:**
    npx prisma migrate dev --name <description>
    npx prisma generate

---

## ۷. کارهای پرتکرار

**افزودن صفحهٔ فروشگاه:**
    mkdir -p "src/app/(shop)/new-page"
    cat > "src/app/(shop)/new-page/page.tsx"
خودکار در (shop)/layout.tsx قرار می‌گیرد.

**افزودن API route:**
    mkdir -p src/app/api/xyz
    cat > src/app/api/xyz/route.ts

**افزودن فیلد به Product:**
۱. prisma/schema.prisma را تغییر بده
۲. npx prisma migrate dev --name add_field
۳. ProductForm.tsx (تایپ + فرم) را ویرایش کن
۴. /api/admin/products (POST) و [id]/route.ts (PATCH) را ویرایش کن
۵. queries.ts → toCard() را چک کن

**افزودن متغیر محیطی:**
.env + .env.example را هر دو به‌روزرسانی کن.

---

## ۸. چه کارهایی بکن، چه کارهایی نکن

بکن:
- تمام متن‌های UI را فارسی بنویس
- اعداد را با toFa() بفرست
- از Link استفاده کن
- قیمت‌محور در سرور محاسبه کن
- برای موبایل طراحی کن

نکن:
- از a برای لینک داخلی استفاده نکن
- متن انگلیسی در UI نگذار (به‌جز نام برندها)
- منطق قیمت را در کلاینت نگذار
- src/generated/prisma/ را دستی تغییر نده
- در سرور از formatPrice() برای منطق استفاده نکن (فقط نمایش)

---

## ۹. تست و build

    npm run dev     # سرور توسعه روی :3000
    npm run build   # بیلد پروداکشن
    npm start       # اجرای بیلد
    npx tsc --noEmit   # چک تایپ

سرور توسعه روی پورت ۳۰۰۰ اجرا می‌شود. اگر سرور قبلی بالاست، با pkill -f "next dev" ببندش.

---

## ۱۰. کارهای باقی‌مانده / نقشهٔ راه

- [ ] تبدیل img به next/image برای lazy-loading و responsive sizes
- [ ] لیست علاقه‌مندی واقعی (localStorage مثل سبد خرید)
- [ ] احراز هویت مشتری با شمارهٔ موبایل + OTP (کاوه‌نگار / قاصدک / ملی‌پیامک)
- [ ] درگاه پرداخت واقعی (زرین‌پال / زیبال / آیدی‌پی)
- [ ] کد تخفیف در تسویه
- [ ] نظرات و امتیاز مشتری روی محصول
- [ ] ارسال هزینه بر اساس استان (وزن + مقصد)
- [ ] مهاجرت از SQLite به PostgreSQL اگر ترافیک بالا رفت
- [ ] گزارش‌های ادمین (پرفروش‌ترین‌ها، درآمد ماهانه)
- [ ] ارسال ایمیل/پیامک تأیید سفارش

---

## ۱۱. دستورات عیب‌یابی

**سرور کار نمی‌کند:**
    ps aux | grep "[n]ext dev"
    pkill -f "next dev"; sleep 2
    npm run dev -- --port 3000

**خطای Prisma:**
    npx prisma generate
    npx prisma migrate deploy

**دیتابیس را ریست کن (توجه: همهٔ داده پاک می‌شود):**
    npx prisma migrate reset
    npx tsx prisma/seed.ts

---

## ۱۲. اطلاعات تماس پروژه

- کاربر git: Qaderizadeh
- ایمیل: ramadan86@gmail.com
- رمز ادمین پیش‌فرض: admin1234 (در .env قابل تغییر)
