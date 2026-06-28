/**
 * Pure draft-vs-published comparison. Decides `has_unpublished_changes`:
 * whether the persisted draft differs from the last published snapshot in any
 * publish-facing field. Volatile bookkeeping (timestamps, status, publish meta)
 * is ignored so it never produces false "unpublished changes".
 */

const VOLATILE_KEYS = new Set([
  'updated_at',
  'updatedAt',
  'created_at',
  'createdAt',
  'updated_by',
  'updatedBy',
  'status',
  'published_at',
  'published_by',
  'has_unpublished_changes',
  'published_card',
  '_autosave_at',
])

function stripVolatile(o: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const key of Object.keys(o)) {
    if (!VOLATILE_KEYS.has(key)) out[key] = o[key]
  }
  return out
}

/** Order-independent for object keys, order-sensitive for arrays (arrays are content). */
function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null'
  if (Array.isArray(value)) return '[' + value.map(stableStringify).join(',') + ']'
  const obj = value as Record<string, unknown>
  const keys = Object.keys(obj).sort()
  return '{' + keys.map((k) => JSON.stringify(k) + ':' + stableStringify(obj[k])).join(',') + '}'
}

/**
 * @param draft    current persisted draft fields (parent doc fields)
 * @param snapshot last published snapshot fields, or null if never published
 * @returns true when the draft has changes that have not been published
 */
export function diffExceedsPublished(
  draft: Record<string, unknown>,
  snapshot: Record<string, unknown> | null
): boolean {
  if (!snapshot) return true
  return stableStringify(stripVolatile(draft)) !== stableStringify(stripVolatile(snapshot))
}
