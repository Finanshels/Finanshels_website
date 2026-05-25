import { test, mock } from 'node:test'
import assert from 'node:assert/strict'
import { createAssetMigrator } from '../assetMigrator'

function fetchStub(body: Buffer, contentType = 'image/png') {
  return mock.fn(async () =>
    new Response(body as unknown as BodyInit, {
      status: 200,
      headers: { 'content-type': contentType },
    })
  )
}

test('migrates a CDN url and returns new url', async () => {
  const upload = mock.fn(async () => ({
    url: 'https://storage.googleapis.com/b/cms-media/team_members/jane/photo.png',
    storagePath: 'cms-media/team_members/jane/photo.png',
    size: 123,
  }))
  const migrator = createAssetMigrator({
    fetch: fetchStub(Buffer.from([1, 2, 3])),
    upload,
  })

  const result = await migrator.migrate({
    sourceUrl: 'https://uploads-ssl.webflow.com/abc/photo.png',
    collection: 'team_members',
    slug: 'jane',
  })

  assert.ok(result)
  assert.equal(result!.url, 'https://storage.googleapis.com/b/cms-media/team_members/jane/photo.png')
  assert.equal(upload.mock.callCount(), 1)
})

test('returns null for empty/falsy sourceUrl', async () => {
  const migrator = createAssetMigrator({
    fetch: mock.fn() as never,
    upload: mock.fn() as never,
  })
  assert.equal(await migrator.migrate({ sourceUrl: '', collection: 'x', slug: 'y' }), null)
  assert.equal(await migrator.migrate({ sourceUrl: null as unknown as string, collection: 'x', slug: 'y' }), null)
})

test('dry-run skips fetch and upload, returns synthetic url', async () => {
  const fetch = mock.fn()
  const upload = mock.fn()
  const migrator = createAssetMigrator({ fetch: fetch as never, upload: upload as never, dryRun: true })
  const result = await migrator.migrate({
    sourceUrl: 'https://uploads-ssl.webflow.com/abc/photo.png',
    collection: 'team_members',
    slug: 'jane',
  })
  assert.ok(result)
  assert.ok(result!.url.includes('DRY-RUN'))
  assert.equal(fetch.mock.callCount(), 0)
  assert.equal(upload.mock.callCount(), 0)
})

test('infers filename from URL pathname', async () => {
  const upload = mock.fn(async (params: { filename: string }) => ({
    url: `https://storage.googleapis.com/b/cms-media/x/y/${params.filename}`,
    storagePath: `cms-media/x/y/${params.filename}`,
    size: 0,
  }))
  const migrator = createAssetMigrator({
    fetch: fetchStub(Buffer.from([1])),
    upload: upload as never,
  })
  await migrator.migrate({
    sourceUrl: 'https://uploads-ssl.webflow.com/some/path/specific-file.jpg?v=1',
    collection: 'x',
    slug: 'y',
  })
  const call = upload.mock.calls[0]
  assert.equal((call.arguments[0] as { filename: string }).filename, 'specific-file.jpg')
})
