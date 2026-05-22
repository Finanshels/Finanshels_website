import { test, mock } from 'node:test'
import assert from 'node:assert/strict'
import { createWebflowClient } from '../webflowClient'

function makeFetchStub(responses: Array<{ status: number, body: unknown, headers?: Record<string, string> }>) {
  let call = 0
  return mock.fn(async () => {
    const r = responses[call++]
    return new Response(JSON.stringify(r.body), {
      status: r.status,
      headers: { 'content-type': 'application/json', ...(r.headers ?? {}) },
    })
  })
}

test('listCollections returns collections array', async () => {
  const fetch = makeFetchStub([
    { status: 200, body: { collections: [{ id: 'c1', slug: 'blog' }] } },
  ])
  const client = createWebflowClient({ token: 't', siteId: 's', fetch })
  const result = await client.listCollections()
  assert.equal(result.length, 1)
  assert.equal(result[0].id, 'c1')
})

test('listItems paginates until empty', async () => {
  const fetch = makeFetchStub([
    { status: 200, body: { items: [{ id: 'i1' }, { id: 'i2' }], pagination: { total: 3, limit: 2, offset: 0 } } },
    { status: 200, body: { items: [{ id: 'i3' }], pagination: { total: 3, limit: 2, offset: 2 } } },
  ])
  const client = createWebflowClient({ token: 't', siteId: 's', fetch, pageSize: 2 })
  const items = await client.listItems('coll_id')
  assert.equal(items.length, 3)
  assert.deepEqual(items.map(i => i.id), ['i1', 'i2', 'i3'])
})

test('retries on 429 with backoff', async () => {
  const fetch = makeFetchStub([
    { status: 429, body: { code: 'rate_limit' }, headers: { 'retry-after': '0' } },
    { status: 200, body: { collections: [] } },
  ])
  const client = createWebflowClient({ token: 't', siteId: 's', fetch })
  const result = await client.listCollections()
  assert.deepEqual(result, [])
  assert.equal(fetch.mock.callCount(), 2)
})

test('throws after maxRetries consecutive 429s', async () => {
  const fetch = makeFetchStub([
    { status: 429, body: {}, headers: { 'retry-after': '0' } },
    { status: 429, body: {}, headers: { 'retry-after': '0' } },
    { status: 429, body: {}, headers: { 'retry-after': '0' } },
  ])
  const client = createWebflowClient({ token: 't', siteId: 's', fetch, maxRetries: 3 })
  await assert.rejects(() => client.listCollections(), /rate limit/i)
})

test('sends Authorization header', async () => {
  const fetch = makeFetchStub([{ status: 200, body: { collections: [] } }])
  const client = createWebflowClient({ token: 'secret_token', siteId: 's', fetch })
  await client.listCollections()
  const call = fetch.mock.calls[0]
  const req = call.arguments[0] as Request
  assert.equal(req.headers.get('authorization'), 'Bearer secret_token')
})
