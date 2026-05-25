import { test, mock } from 'node:test'
import assert from 'node:assert/strict'
import { transformImage } from '../transform/image'

test('migrates a Webflow image field shape', async () => {
  const migrator = {
    migrate: mock.fn(async () => ({
      url: 'https://storage.googleapis.com/b/cms-media/x/y/photo.png',
      storagePath: 'cms-media/x/y/photo.png',
      size: 100,
      sourceUrl: 'https://uploads-ssl.webflow.com/abc/photo.png',
    })),
  }
  const result = await transformImage(
    { url: 'https://uploads-ssl.webflow.com/abc/photo.png', alt: 'Jane' },
    { collection: 'team_members', slug: 'jane' },
    migrator
  )
  assert.ok(result)
  assert.equal(result!.url, 'https://storage.googleapis.com/b/cms-media/x/y/photo.png')
  assert.equal(result!.alt, 'Jane')
})

test('returns null for empty/falsy input', async () => {
  const migrator = { migrate: mock.fn() }
  assert.equal(await transformImage(null, { collection: 'x', slug: 'y' }, migrator as never), null)
  assert.equal(await transformImage(undefined, { collection: 'x', slug: 'y' }, migrator as never), null)
  assert.equal(await transformImage({}, { collection: 'x', slug: 'y' }, migrator as never), null)
  assert.equal(migrator.migrate.mock.callCount(), 0)
})

test('accepts plain URL string', async () => {
  const migrator = {
    migrate: mock.fn(async () => ({
      url: 'new-url',
      storagePath: 'p',
      size: 1,
      sourceUrl: 'old-url',
    })),
  }
  const result = await transformImage(
    'https://uploads-ssl.webflow.com/abc/photo.png',
    { collection: 'x', slug: 'y' },
    migrator
  )
  assert.ok(result)
  assert.equal(result!.url, 'new-url')
  assert.equal(result!.alt, '')
})
