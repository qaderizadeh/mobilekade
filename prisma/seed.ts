import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client.js'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

const p = (name: string) => `/images/products/${name}`

async function main() {
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.review.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.brand.deleteMany()

  const categories = await Promise.all([
    prisma.category.create({ data: { slug: 'case',       name: 'قاب و کاور',       sortOrder: 1 } }),
    prisma.category.create({ data: { slug: 'glass',      name: 'گلس و محافظ صفحه', sortOrder: 2 } }),
    prisma.category.create({ data: { slug: 'charger',    name: 'شارژر و آداپتور',   sortOrder: 3 } }),
    prisma.category.create({ data: { slug: 'powerbank',  name: 'پاوربانک',         sortOrder: 4 } }),
    prisma.category.create({ data: { slug: 'headphone',  name: 'هندزفری و هدفون',  sortOrder: 5 } }),
    prisma.category.create({ data: { slug: 'holder',     name: 'هولدر و پایه',     sortOrder: 6 } }),
    prisma.category.create({ data: { slug: 'watch-band', name: 'بند ساعت هوشمند',  sortOrder: 7 } }),
    prisma.category.create({ data: { slug: 'cable',      name: 'کابل شارژ',        sortOrder: 8 } }),
  ])
  const [caseC, glassC, chargerC, powerC, headC, holderC, bandC, cableC] = categories

  const brands = await Promise.all([
    prisma.brand.create({ data: { slug: 'baseus',     name: 'بیسوس' } }),
    prisma.brand.create({ data: { slug: 'anker',      name: 'انکر' } }),
    prisma.brand.create({ data: { slug: 'spigen',     name: 'اسپیگن' } }),
    prisma.brand.create({ data: { slug: 'xiaomi',     name: 'شیائومی' } }),
    prisma.brand.create({ data: { slug: 'green-lion', name: 'گرین لاین' } }),
    prisma.brand.create({ data: { slug: 'esr',        name: 'ای اس آر' } }),
    prisma.brand.create({ data: { slug: 'joyroom',    name: 'جویروم' } }),
    prisma.brand.create({ data: { slug: 'samsung',    name: 'سامسونگ' } }),
  ])
  const [baseus, anker, spigen, xiaomi, greenLion, esr, joyroom, samsung] = brands

  const products: any[] = [
    { slug: 'spigen-case-iphone-15-pro-max', name: 'قاب شفاف اسپیگن مدل Ultra Hybrid برای آیفون ۱۵ پرو مکس', shortDesc: 'قاب شفاف با فریم ضدضربه و تکنولوژی Air Cushion', price: 890000, comparePrice: 1180000, stock: 24, categoryId: caseC.id, brandId: spigen.id, images: [p('case-1.jpg'), p('case-1-alt.jpg'), p('extra-1.jpg')], isFeatured: true, rating: 4.8, reviewCount: 132, soldCount: 214, specs: { 'جنس': 'پلی‌کربنات + TPU', 'سازگاری': 'آیفون ۱۵ پرو مکس', 'قابلیت مگ‌سیف': 'ندارد' } },
    { slug: 'esr-magsafe-case-iphone-15', name: 'قاب مگ‌سیف ESR مدل HaloLock برای آیفون ۱۵', shortDesc: 'سازگار با مگ‌سیف، شارژ بی‌سیم بدون برداشتن قاب', price: 650000, comparePrice: 890000, stock: 40, categoryId: caseC.id, brandId: esr.id, images: [p('case-2.jpg'), p('extra-2.jpg')], isFeatured: true, rating: 4.6, reviewCount: 87, soldCount: 156, specs: { 'جنس': 'سیلیکون نرم', 'سازگاری': 'آیفون ۱۵', 'قابلیت مگ‌سیف': 'دارد' } },
    { slug: 'baseus-case-samsung-s24', name: 'قاب بیسوس مدل Magnetic برای سامسونگ گلکسی S24', shortDesc: 'قاب مگنتی شفاف با محافظ لنز', price: 480000, stock: 15, categoryId: caseC.id, brandId: baseus.id, images: [p('case-3.jpg')], rating: 4.4, reviewCount: 42, soldCount: 88, specs: { 'جنس': 'پلی‌کربنات', 'سازگاری': 'گلکسی S24', 'قابلیت مگ‌سیف': 'دارد' } },
    { slug: 'joyroom-case-iphone-14', name: 'قاب جویروم مدل Liquid Silicone برای آیفون ۱۴', shortDesc: 'سیلیکون نرم با حس مخملی', price: 320000, comparePrice: 420000, stock: 55, categoryId: caseC.id, brandId: joyroom.id, images: [p('extra-3.jpg')], rating: 4.3, reviewCount: 61, soldCount: 120 },

    { slug: 'glass-iphone-15-pro-ceramic', name: 'گلس سرامیکی بیسوس برای آیفون ۱۵ پرو - بسته ۲ عددی', shortDesc: 'ضد خش، ضد ضربه، ضد اثر انگشت', price: 320000, comparePrice: 450000, stock: 60, categoryId: glassC.id, brandId: baseus.id, images: [p('glass-1.jpg'), p('glass-1-alt.jpg')], isFeatured: true, rating: 4.9, reviewCount: 210, soldCount: 430, specs: { 'ضخامت': '۰.۳ میلی‌متر', 'سختی': '۹H', 'تعداد در بسته': '۲ عدد' } },
    { slug: 'glass-samsung-s24-privacy', name: 'گلس حریم شخصی سامسونگ S24 - پرایوسی', shortDesc: 'مخفی‌کننده دید از زاویه کناری', price: 280000, stock: 35, categoryId: glassC.id, images: [p('glass-2.jpg')], rating: 4.5, reviewCount: 51, soldCount: 102, specs: { 'ضخامت': '۰.۴ میلی‌متر', 'سختی': '۹H', 'ویژگی': 'Anti-Spy' } },

    { slug: 'charger-anker-30w-gan', name: 'شارژر دیواری انکر ۳۰ وات مدل PowerPort Atom PD', shortDesc: 'فناوری GaN، شارژ سریع ۳۰ وات', price: 1150000, comparePrice: 1450000, stock: 18, categoryId: chargerC.id, brandId: anker.id, images: [p('charger-1.jpg')], isFeatured: true, rating: 4.9, reviewCount: 189, soldCount: 320, specs: { 'توان': '۳۰ وات', 'پورت': 'USB-C', 'فناوری': 'GaN' } },
    { slug: 'charger-baseus-20w-usbc', name: 'شارژر بیسوس ۲۰ وات USB-C مدل Compact', shortDesc: 'سایز کوچک، قدرت بالا', price: 390000, stock: 50, categoryId: chargerC.id, brandId: baseus.id, images: [p('charger-2.jpg'), p('extra-4.jpg')], rating: 4.6, reviewCount: 95, soldCount: 210 },

    { slug: 'powerbank-xiaomi-20000', name: 'پاوربانک شیائومی ۲۰۰۰۰ میلی‌آمپر مدل 3 Pro', shortDesc: 'شارژ سریع ۵۰ وات، سه پورت', price: 1780000, comparePrice: 2100000, stock: 12, categoryId: powerC.id, brandId: xiaomi.id, images: [p('power-1.jpg'), p('power-1-alt.jpg')], isFeatured: true, rating: 4.8, reviewCount: 156, soldCount: 240, specs: { 'ظرفیت': '۲۰۰۰۰mAh', 'توان': '۵۰ وات', 'تعداد پورت': '۳' } },
    { slug: 'powerbank-anker-10000-magsafe', name: 'پاوربانک مگ‌سیف انکر ۱۰۰۰۰ میلی‌آمپر مدل MagGo', shortDesc: 'شارژ بی‌سیم مغناطیسی', price: 2350000, stock: 8, categoryId: powerC.id, brandId: anker.id, images: [p('power-2.jpg')], rating: 4.7, reviewCount: 74, soldCount: 90 },

    { slug: 'headphone-xiaomi-buds-5', name: 'هندزفری بی‌سیم شیائومی مدل Redmi Buds 5', shortDesc: 'نویز کنسلینگ فعال، باتری ۴۰ ساعته', price: 1490000, comparePrice: 1890000, stock: 22, categoryId: headC.id, brandId: xiaomi.id, images: [p('buds-1.jpg'), p('buds-1-alt.jpg')], isFeatured: true, rating: 4.7, reviewCount: 302, soldCount: 540, specs: { 'نوع': 'درون‌گوشی TWS', 'نویز کنسلینگ': 'فعال (ANC)', 'باتری': '۴۰ ساعت با کیس' } },
    { slug: 'headphone-baseus-bowie-e9', name: 'هندزفری بی‌سیم بیسوس مدل Bowie E9', shortDesc: 'باتری ۳۰ ساعته، اتصال پایدار', price: 590000, stock: 45, categoryId: headC.id, brandId: baseus.id, images: [p('buds-2.jpg'), p('extra-5.jpg')], rating: 4.4, reviewCount: 121, soldCount: 198 },
    { slug: 'headphone-joyroom-jr-t03', name: 'هندزفری بلوتوثی جویروم مدل JR-T03 Pro', shortDesc: 'صدای استریو HD', price: 480000, stock: 60, categoryId: headC.id, brandId: joyroom.id, images: [p('extra-6.jpg')], rating: 4.2, reviewCount: 88, soldCount: 145 },

    { slug: 'holder-magnetic-car', name: 'هولدر مگنتی خودرو بیسوس مدل Metal', shortDesc: 'نصب آسان روی دریچه کولر', price: 340000, stock: 30, categoryId: holderC.id, brandId: baseus.id, images: [p('holder-1.jpg'), p('extra-7.jpg')], rating: 4.3, reviewCount: 68, soldCount: 132 },

    { slug: 'band-apple-watch-45', name: 'بند ساعت اپل واچ سایز ۴۵ میلی‌متر - سیلیکونی', shortDesc: 'مقاوم، راحت و ضد تعریق', price: 250000, stock: 60, categoryId: bandC.id, images: [p('band-1.jpg'), p('extra-8.jpg')], rating: 4.5, reviewCount: 44, soldCount: 78 },

    { slug: 'cable-baseus-usbc-100w', name: 'کابل تایپ سی بیسوس ۱۰۰ وات - طول ۲ متر', shortDesc: 'شارژ سریع ۱۰۰ وات، انتقال داده ۴۸۰Mbps', price: 290000, comparePrice: 380000, stock: 100, categoryId: cableC.id, brandId: baseus.id, images: [p('cable-1.jpg'), p('cable-1-alt.jpg')], isFeatured: true, rating: 4.8, reviewCount: 265, soldCount: 620, specs: { 'طول': '۲ متر', 'توان': '۱۰۰ وات', 'نوع': 'USB-C to USB-C' } },
    { slug: 'cable-green-lion-lightning', name: 'کابل لایتنینگ گرین لاین - طول ۱ متر', shortDesc: 'سازگار با آیفون، شارژ سریع', price: 180000, stock: 80, categoryId: cableC.id, brandId: greenLion.id, images: [p('cable-2.jpg'), p('extra-9.jpg')], rating: 4.5, reviewCount: 89, soldCount: 175 },
    { slug: 'cable-samsung-usbc-25w', name: 'کابل تایپ سی سامسونگ ۲۵ وات - طول ۱ متر', shortDesc: 'کابل اورجینال سامسونگ', price: 220000, stock: 70, categoryId: cableC.id, brandId: samsung.id, images: [p('extra-10.jpg'), p('extra-11.jpg')], rating: 4.6, reviewCount: 112, soldCount: 210 },
    { slug: 'cable-joyroom-lightning-2m', name: 'کابل لایتنینگ جویروم مدل S-1L2 - طول ۲ متر', shortDesc: 'روکش نایلونی بافته‌شده', price: 210000, stock: 90, categoryId: cableC.id, brandId: joyroom.id, images: [p('extra-12.jpg'), p('extra-13.jpg')], rating: 4.4, reviewCount: 76, soldCount: 148 },
  ]

  for (const item of products) {
    await prisma.product.create({
      data: {
        slug: item.slug,
        name: item.name,
        description: item.shortDesc,
        shortDesc: item.shortDesc,
        price: item.price,
        comparePrice: item.comparePrice ?? null,
        stock: item.stock,
        categoryId: item.categoryId,
        brandId: item.brandId ?? null,
        images: JSON.stringify(item.images),
        specs: item.specs ? JSON.stringify(item.specs) : null,
        isFeatured: item.isFeatured ?? false,
        rating: item.rating ?? 0,
        reviewCount: item.reviewCount ?? 0,
        soldCount: item.soldCount ?? 0,
      },
    })
  }

  await prisma.setting.upsert({
    where: { key: 'site_name' },
    update: { value: 'موبایل‌کده' },
    create: { key: 'site_name', value: 'موبایل‌کده' },
  })

  console.log('seed done:', { categories: categories.length, brands: brands.length, products: products.length })
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
