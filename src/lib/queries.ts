import { prisma } from './prisma'
import type { ProductCardData } from '@/components/product/ProductCard'

export function parseImages(images: string): string[] {
  try {
    const arr = JSON.parse(images)
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

export function toCard(p: {
  id: string
  slug: string
  name: string
  price: number
  comparePrice: number | null
  stock: number
  images: string
  rating: number
  reviewCount: number
}): ProductCardData {
  const imgs = parseImages(p.images)
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    comparePrice: p.comparePrice,
    stock: p.stock,
    image: imgs[0] ?? '/images/placeholder.png',
    rating: p.rating,
    reviewCount: p.reviewCount,
  }
}

export async function getFeaturedProducts(limit = 8) {
  const items = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    take: limit,
    orderBy: { soldCount: 'desc' },
  })
  return items.map(toCard)
}

export async function getNewestProducts(limit = 8) {
  const items = await prisma.product.findMany({
    where: { isActive: true },
    take: limit,
    orderBy: { createdAt: 'desc' },
  })
  return items.map(toCard)
}

export async function getBestSellers(limit = 8) {
  const items = await prisma.product.findMany({
    where: { isActive: true },
    take: limit,
    orderBy: { soldCount: 'desc' },
  })
  return items.map(toCard)
}

export async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true, brand: true, reviews: { where: { isApproved: true }, take: 5, orderBy: { createdAt: 'desc' } } },
  })
}

export async function getRelatedProducts(categoryId: string, excludeId: string, limit = 6) {
  const items = await prisma.product.findMany({
    where: { isActive: true, categoryId, id: { not: excludeId } },
    take: limit,
  })
  return items.map(toCard)
}
