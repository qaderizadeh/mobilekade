import dayjs from 'dayjs'
import jalaliday from 'jalaliday'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/fa'

dayjs.extend(jalaliday)
dayjs.extend(relativeTime)
dayjs.calendar('jalali')
dayjs.locale('fa')

const FA_DIGITS = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹']
const toFa = (s: string) => s.replace(/\d/g, (d) => FA_DIGITS[Number(d)])

export function formatJalali(date: Date | string | number, fmt = 'YYYY/MM/DD'): string {
  return toFa(dayjs(date).calendar('jalali').format(fmt))
}

export function formatJalaliWithTime(date: Date | string | number): string {
  return toFa(dayjs(date).calendar('jalali').format('YYYY/MM/DD - HH:mm'))
}

export function timeAgo(date: Date | string | number): string {
  return dayjs(date).locale('fa').fromNow()
}

export { dayjs }
