import { test } from 'node:test'
import assert from 'node:assert/strict'
import { orderNowQuantity } from '../lib/cart-quantity'

test('order now adds the chosen quantity when the product is not in the cart yet', () => {
  assert.equal(orderNowQuantity(0, 1, 10), 1)
  assert.equal(orderNowQuantity(0, 3, 10), 3)
})

test('order now never doubles a quantity the shopper already added', () => {
  assert.equal(orderNowQuantity(1, 1, 10), 1)
  assert.equal(orderNowQuantity(4, 1, 10), 4)
})

test('order now raises the cart line to a larger chosen quantity', () => {
  assert.equal(orderNowQuantity(1, 3, 10), 3)
})

test('order now respects stock and the 999 line limit', () => {
  assert.equal(orderNowQuantity(0, 8, 5), 5)
  assert.equal(orderNowQuantity(7, 1, 5), 5)
  assert.equal(orderNowQuantity(0, 5000, undefined), 999)
})

test('order now refuses invalid quantities and sold-out products', () => {
  for (const bad of [0, -1, 1.5, NaN, Infinity]) assert.equal(orderNowQuantity(2, bad, 10), 0)
  assert.equal(orderNowQuantity(0, 1, 0), 0)
})
