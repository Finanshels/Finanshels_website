import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calcVat, VAT_STANDARD_RATE } from '../vat'

test('standard UAE VAT rate is 5 percent', () => {
  assert.equal(VAT_STANDARD_RATE, 5)
})

test('add: VAT on a net amount at 5%', () => {
  const r = calcVat({ amount: 1000, ratePct: 5, direction: 'add' })
  assert.equal(r.net, 1000)
  assert.equal(r.vat, 50)
  assert.equal(r.gross, 1050)
})

test('remove: extract VAT from a gross amount at 5%', () => {
  const r = calcVat({ amount: 1050, ratePct: 5, direction: 'remove' })
  assert.equal(r.net, 1000)
  assert.equal(r.vat, 50)
  assert.equal(r.gross, 1050)
})

test('rounds to 2 decimals', () => {
  const r = calcVat({ amount: 99.99, ratePct: 5, direction: 'add' })
  assert.equal(r.vat, 5)
  assert.equal(r.gross, 104.99)
})

test('zero rate yields zero VAT', () => {
  const r = calcVat({ amount: 500, ratePct: 0, direction: 'add' })
  assert.equal(r.vat, 0)
  assert.equal(r.gross, 500)
})

test('negative amount throws', () => {
  assert.throws(() => calcVat({ amount: -1, ratePct: 5, direction: 'add' }))
})

test('rate outside 0–100 throws', () => {
  assert.throws(() => calcVat({ amount: 100, ratePct: 101, direction: 'add' }))
})
