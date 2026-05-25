export interface ReferenceMiss {
  collection: string
  id: string
}

export interface ReferenceMap {
  set(collection: string, webflowItemId: string, firestoreSlug: string): void
  resolve(collection: string, webflowItemId: string): string | undefined
  unresolved(): ReferenceMiss[]
  size(): number
}

export function createReferenceMap(): ReferenceMap {
  const data = new Map<string, Map<string, string>>()
  const misses: ReferenceMiss[] = []

  function bucket(collection: string): Map<string, string> {
    let b = data.get(collection)
    if (!b) {
      b = new Map()
      data.set(collection, b)
    }
    return b
  }

  return {
    set(collection, webflowItemId, firestoreSlug) {
      bucket(collection).set(webflowItemId, firestoreSlug)
    },
    resolve(collection, webflowItemId) {
      const found = data.get(collection)?.get(webflowItemId)
      if (!found) {
        misses.push({ collection, id: webflowItemId })
      }
      return found
    },
    unresolved() {
      return misses.slice()
    },
    size() {
      let total = 0
      for (const b of data.values()) total += b.size
      return total
    },
  }
}
