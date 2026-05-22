export interface WebflowCollection {
  id: string
  slug: string
  displayName?: string
  fields?: WebflowField[]
}

export interface WebflowField {
  id: string
  slug: string
  displayName?: string
  type: string
  isRequired?: boolean
  validations?: Record<string, unknown>
}

export interface WebflowItem {
  id: string
  isArchived?: boolean
  isDraft?: boolean
  fieldData: Record<string, unknown>
  lastPublished?: string
  lastUpdated?: string
  createdOn?: string
}

interface PaginationMeta {
  total: number
  limit: number
  offset: number
}

interface ListItemsResponse {
  items: WebflowItem[]
  pagination: PaginationMeta
}

interface WebflowClientOptions {
  token: string
  siteId: string
  fetch?: typeof fetch
  pageSize?: number
  maxRetries?: number
  baseUrl?: string
}

const DEFAULT_BASE_URL = 'https://api.webflow.com'
const DEFAULT_PAGE_SIZE = 100
const DEFAULT_MAX_RETRIES = 3

export interface WebflowClient {
  listCollections(): Promise<WebflowCollection[]>
  getCollection(collectionId: string): Promise<WebflowCollection>
  listItems(collectionId: string): Promise<WebflowItem[]>
}

export function createWebflowClient(opts: WebflowClientOptions): WebflowClient {
  const fetchFn = opts.fetch ?? globalThis.fetch
  const pageSize = opts.pageSize ?? DEFAULT_PAGE_SIZE
  const maxRetries = opts.maxRetries ?? DEFAULT_MAX_RETRIES
  const baseUrl = opts.baseUrl ?? DEFAULT_BASE_URL

  async function request<T>(path: string): Promise<T> {
    let attempt = 0
    while (true) {
      const req = new Request(`${baseUrl}${path}`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${opts.token}`,
          'accept-version': '2.0.0',
          accept: 'application/json',
        },
      })
      const res = await fetchFn(req)
      if (res.status === 429) {
        attempt++
        if (attempt >= maxRetries) {
          throw new Error(`Webflow rate limit exceeded after ${maxRetries} retries (path: ${path})`)
        }
        const retryAfter = Number(res.headers.get('retry-after') ?? '1')
        await new Promise(r => setTimeout(r, Math.max(retryAfter, 1) * 1000))
        continue
      }
      if (!res.ok) {
        const body = await res.text().catch(() => '')
        throw new Error(`Webflow ${res.status} ${path}: ${body.slice(0, 200)}`)
      }
      return (await res.json()) as T
    }
  }

  return {
    async listCollections() {
      const data = await request<{ collections: WebflowCollection[] }>(
        `/v2/sites/${opts.siteId}/collections`
      )
      return data.collections
    },

    async getCollection(collectionId: string) {
      return request<WebflowCollection>(`/v2/collections/${collectionId}`)
    },

    async listItems(collectionId: string) {
      const all: WebflowItem[] = []
      let offset = 0
      while (true) {
        const data = await request<ListItemsResponse>(
          `/v2/collections/${collectionId}/items?offset=${offset}&limit=${pageSize}`
        )
        all.push(...data.items)
        offset += data.items.length
        if (data.items.length < pageSize || offset >= data.pagination.total) break
      }
      return all
    },
  }
}
