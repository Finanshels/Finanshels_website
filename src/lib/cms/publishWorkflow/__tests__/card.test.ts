import { test } from 'node:test'
import assert from 'node:assert/strict'
import { extractPublishedCard } from '../card'

test('extracts only the listing card subset', () => {
  const card = extractPublishedCard({
    title: 'Hello',
    slug: 'hello',
    card_description: 'desc',
    card_image: 'img.png',
    featured: true,
    sort_order: 5,
    body: 'ignored',
    extra: 'ignored',
  })
  assert.deepEqual(card, {
    title: 'Hello',
    slug: 'hello',
    card_description: 'desc',
    card_image: 'img.png',
    featured: true,
    sort_order: 5,
  })
})

test('missing/typed-wrong fields default safely', () => {
  const card = extractPublishedCard({ title: 'X' })
  assert.equal(card.title, 'X')
  assert.equal(card.slug, null)
  assert.equal(card.card_description, null)
  assert.equal(card.card_image, null)
  assert.equal(card.featured, false)
  assert.equal(card.sort_order, 0)
})
