/** Firestore returns Timestamp objects; Zod expects Date or ISO strings. */
export function normalizeFirestoreTimestamps(data: Record<string, unknown>): Record<string, unknown> {
  const out = { ...data }
  for (const key of Object.keys(out)) {
    const v = out[key]
    if (v != null && typeof v === 'object' && 'toDate' in v && typeof (v as { toDate: () => Date }).toDate === 'function') {
      out[key] = (v as { toDate: () => Date }).toDate()
    }
  }
  return out
}
