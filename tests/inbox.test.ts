import { test } from 'node:test'
import assert from 'node:assert/strict'
import { buildInbox } from '../lib/inbox'

const at = (minutes: number) => new Date(Date.UTC(2026, 9, 20, 12, minutes))
const enquiry = (id: string, minutes: number, status = 'NEW') => ({ id, name: 'Karim', email: 'karim@example.com', subject: 'Stock?', message: 'Is G3MB in stock?', status, createdAt: at(minutes) })
const photo = (id: string, minutes: number, status = 'NEW', imageKeys = '["requests/a.jpg","requests/b.png"]') => ({ id, name: 'Rafiq', phone: '01712345678', note: null, imageKeys, status, createdAt: at(minutes) })

test('enquiries and photo requests share one list, newest first', () => {
  const { items } = buildInbox([enquiry('e1', 5), enquiry('e2', 30)], [photo('p1', 20), photo('p2', 1)])
  assert.deepEqual(items.map(item => `${item.kind}:${item.id}`), ['enquiry:e2', 'photo:p1', 'enquiry:e1', 'photo:p2'])
})

test('the count includes only items nobody has read yet', () => {
  assert.equal(buildInbox([enquiry('e1', 5, 'READ'), enquiry('e2', 6)], [photo('p1', 7), photo('p2', 8, 'READ')]).newCount, 2)
})

test('a photo request carries its photo keys and reference code', () => {
  const photoItem = buildInbox([], [photo('7f3a9c21-1111-4222-8333-444455556666', 1)]).items[0]
  assert.equal(photoItem.kind, 'photo')
  if (photoItem.kind === 'photo') { assert.deepEqual(photoItem.keys, ['requests/a.jpg', 'requests/b.png']); assert.equal(photoItem.reference, 'REQ-7F3A9C21') }
})

test('a photo request with unreadable photo data still appears, without photos', () => {
  const photoItem = buildInbox([], [photo('p1', 1, 'NEW', 'garbage')]).items[0]
  assert.equal(photoItem.kind === 'photo' && photoItem.keys.length, 0)
})

test('an empty inbox is empty', () => {
  assert.deepEqual(buildInbox([], []), { items: [], newCount: 0 })
})
