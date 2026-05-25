import { slugifyForCms } from '../../../../src/lib/cms/slugify'

export function transformDirect(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  return String(value)
}

export function transformSlug(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    throw new Error('Slug source value is empty')
  }
  const str = typeof value === 'string' ? value : String(value)
  if (!str.trim()) {
    throw new Error('Slug source value is empty after trim')
  }
  return slugifyForCms(str)
}

export function transformDate(value: unknown): Date | null {
  if (typeof value !== 'string' || !value.trim()) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

export function transformBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim()
    return lower === 'true' || lower === '1' || lower === 'yes'
  }
  if (typeof value === 'number') return value !== 0
  return false
}

export function transformNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const n = Number(value)
    return Number.isFinite(n) ? n : null
  }
  return null
}

export function transformOption(value: unknown, table: Record<string, string>): string | null {
  if (typeof value !== 'string') return null
  return table[value] ?? null
}
