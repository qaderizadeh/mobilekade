const FA_DIGITS = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹']

export function toFa(input: string | number | null | undefined): string {
  if (input === null || input === undefined) return ''
  return String(input).replace(/\d/g, (d) => FA_DIGITS[Number(d)])
}

export function toEn(input: string): string {
  return input
    .replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
}

export function formatPrice(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  const s = Math.round(value).toLocaleString('en-US')
  return toFa(s) + ' تومان'
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  return toFa(Math.round(value).toLocaleString('en-US'))
}

export function digitsOnly(input: string): string {
  return toEn(input).replace(/\D/g, '')
}
