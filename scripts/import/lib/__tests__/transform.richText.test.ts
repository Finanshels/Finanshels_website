import { test, mock } from 'node:test'
import assert from 'node:assert/strict'
import { transformRichText } from '../transform/richText'

let migratedCounter = 0
const noopMigrator = {
  migrate: mock.fn(async (p: { sourceUrl: string }) => ({
    url: `https://storage.googleapis.com/migrated/asset-${++migratedCounter}.png`,
    storagePath: 'p',
    size: 0,
    sourceUrl: p.sourceUrl,
  })),
}

test('returns empty string for empty/null input', async () => {
  assert.equal(await transformRichText('', { collection: 'x', slug: 'y' }, noopMigrator), '')
  assert.equal(await transformRichText(null, { collection: 'x', slug: 'y' }, noopMigrator), '')
})

test('rewrites <img src> via asset migrator', async () => {
  const html = '<p>Hello</p><img src="https://uploads-ssl.webflow.com/abc/photo.png" alt="x">'
  const out = await transformRichText(html, { collection: 'blog_posts', slug: 'post-1' }, noopMigrator)
  assert.ok(out.includes('storage.googleapis.com/migrated'))
  assert.ok(!out.includes('uploads-ssl.webflow.com'))
})

test('calls migrator once per img and keeps original on null result', async () => {
  const migrator = { migrate: mock.fn(async () => null) }
  const html = '<img src="https://example.com/photo.png">'
  const out = await transformRichText(html, { collection: 'x', slug: 'y' }, migrator)
  assert.equal(migrator.migrate.mock.callCount(), 1)
  assert.ok(out.includes('example.com/photo.png'))
})

test('removes script tags via sanitizeCmsHtml', async () => {
  const html = '<p>safe</p><script>alert(1)</script>'
  const out = await transformRichText(html, { collection: 'x', slug: 'y' }, noopMigrator)
  assert.ok(out.includes('safe'))
  assert.ok(!out.includes('<script'))
})

test('rewrites srcset entries', async () => {
  const html = '<img src="https://uploads-ssl.webflow.com/a/x.png" srcset="https://uploads-ssl.webflow.com/a/x-1x.png 1x, https://uploads-ssl.webflow.com/a/x-2x.png 2x">'
  const out = await transformRichText(html, { collection: 'x', slug: 'y' }, noopMigrator)
  assert.ok(!out.includes('uploads-ssl.webflow.com'))
  assert.ok(out.includes('1x'))
  assert.ok(out.includes('2x'))
})
