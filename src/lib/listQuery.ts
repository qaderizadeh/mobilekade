import { prisma } from "./prisma"
import { toCard } from "./queries"

export type ListParams = {
  categorySlug?: string
  q?: string
  sort?: "newest" | "cheap" | "expensive" | "best" | "discount"
  minPrice?: number
  maxPrice?: number
  brandSlug?: string
  page?: number
  perPage?: number
}

export async function listProducts(p: ListParams) {
  const where: any = { isActive: true }

  if (p.categorySlug) {
    const cat = await prisma.category.findUnique({
      where: { slug: p.categorySlug },
    })
    if (cat) where.categoryId = cat.id
  }
  if (p.brandSlug) {
    const brand = await prisma.brand.findUnique({ where: { slug: p.brandSlug } })
    if (brand) where.brandId = brand.id
  }

  if (p.q) {
    // Split user query into words and require all words to appear somewhere
    // in name / shortDesc / description (AND logic across words, OR across fields).
    const words = p.q
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0)

    if (words.length > 0) {
      where.AND = words.map((w) => ({
        OR: [
          { name: { contains: w } },
          { shortDesc: { contains: w } },
          { description: { contains: w } },
        ],
      }))
    }
  }

  if (p.minPrice || p.maxPrice) {
    where.price = {}
    if (p.minPrice) where.price.gte = p.minPrice
    if (p.maxPrice) where.price.lte = p.maxPrice
  }

  let orderBy: any = { createdAt: "desc" }
  if (p.sort === "cheap") orderBy = { price: "asc" }
  else if (p.sort === "expensive") orderBy = { price: "desc" }
  else if (p.sort === "best") orderBy = { soldCount: "desc" }
  else if (p.sort === "newest") orderBy = { createdAt: "desc" }

  const perPage = p.perPage ?? 24
  const page = Math.max(1, p.page ?? 1)

  let [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ])

  // Fallback: if strict AND search found nothing, retry with OR (partial match)
  if (total === 0 && p.q) {
    const words = p.q
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0)

    if (words.length > 1) {
      const orWhere: any = {
        isActive: true,
        OR: words.flatMap((w) => [
          { name: { contains: w } },
          { shortDesc: { contains: w } },
          { description: { contains: w } },
        ]),
      }
      if (p.categorySlug) {
        const cat = await prisma.category.findUnique({ where: { slug: p.categorySlug } })
        if (cat) orWhere.categoryId = cat.id
      }
      if (p.brandSlug) {
        const brand = await prisma.brand.findUnique({ where: { slug: p.brandSlug } })
        if (brand) orWhere.brandId = brand.id
      }
      if (p.minPrice || p.maxPrice) {
        orWhere.price = {}
        if (p.minPrice) orWhere.price.gte = p.minPrice
        if (p.maxPrice) orWhere.price.lte = p.maxPrice
      }

      const [items2, total2] = await Promise.all([
        prisma.product.findMany({
          where: orWhere,
          orderBy,
          skip: (page - 1) * perPage,
          take: perPage,
        }),
        prisma.product.count({ where: orWhere }),
      ])
      items = items2
      total = total2
    }
  }

  return {
    items: items.map(toCard),
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  }
}
