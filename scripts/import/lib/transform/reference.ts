import type { ReferenceMap } from '../referenceMap'

export function transformReference(
  value: unknown,
  targetCollection: string,
  map: ReferenceMap
): string | null {
  if (typeof value !== 'string' || !value) return null
  return map.resolve(targetCollection, value) ?? null
}

export function transformMultiReference(
  value: unknown,
  targetCollection: string,
  map: ReferenceMap
): string[] {
  if (!Array.isArray(value)) return []
  const out: string[] = []
  for (const v of value) {
    if (typeof v !== 'string') continue
    const resolved = map.resolve(targetCollection, v)
    if (resolved) out.push(resolved)
  }
  return out
}
