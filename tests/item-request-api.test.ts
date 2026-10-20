import { test, before, beforeEach, after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createClient, type Client } from '@libsql/client'

const jpeg = (size = 64) => Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(size - 4, 7)])
let client: Client
let handle: typeof import('../lib/item-request-api').handleItemRequest
const directory = mkdtempSync(join(tmpdir(), 'binary-request-api-'))

class MemoryStorage {
  objects = new Map<string, string>(); puts = 0; broken = false
  async put(key: string, _bytes: Buffer, contentType: string) { this.puts++; if (this.broken) throw new Error('R2 credentials rejected: secret-detail'); this.objects.set(key, contentType) }
  async remove(key: string) { this.objects.delete(key) }
}
const allowAll = async () => true

function formWith(overrides: Record<string, string | Blob | null> = {}, photos: Buffer[] = [jpeg()]) {
  const form = new FormData()
  const base: Record<string, string> = { requestId: crypto.randomUUID(), name: 'Rafiq Ahmed', phone: '01712345678', note: 'Need this IC', website: '' }
  for (const [key, value] of Object.entries({ ...base, ...overrides })) if (value !== null) form.append(key, value)
  photos.forEach((bytes, index) => form.append('photo', new Blob([new Uint8Array(bytes)], { type: 'image/jpeg' }), `photo-${index + 1}.jpg`))
  return form
}
const post = (form: FormData, headers: Record<string, string> = {}) => new Request('http://localhost/api/item-requests', { method: 'POST', body: form, headers })
const rows = async () => (await client.execute('SELECT * FROM item_requests')).rows

before(async () => {
  process.env.TURSO_DATABASE_URL = `file:${directory}/test.db`; delete process.env.TURSO_AUTH_TOKEN
  client = createClient({ url: process.env.TURSO_DATABASE_URL })
  await client.executeMultiple(readFileSync('drizzle/0000_careful_shiver_man.sql', 'utf8'))
  ;({ handleItemRequest: handle } = await import('../lib/item-request-api'))
})
beforeEach(async () => { await client.execute('DELETE FROM item_requests') })
after(() => { client.close(); rmSync(directory, { recursive: true, force: true }) })

test('a good request is saved and answered with a reference', async () => {
  const storage = new MemoryStorage()
  const response = await handle(post(formWith({}, [jpeg(), jpeg()])), { storage, allow: allowAll })
  const body = await response.json()
  assert.equal(response.status, 200); assert.equal(body.success, true); assert.match(body.reference, /^REQ-[0-9A-F]{8}$/)
  assert.equal((await rows()).length, 1); assert.equal(storage.objects.size, 2)
})

test('the answer includes public photo addresses when a storage domain is set, and none otherwise', async () => {
  const withDomain = await (await handle(post(formWith({}, [jpeg()])), { storage: new MemoryStorage(), allow: allowAll, publicDomain: 'https://pub.example.dev/' })).json()
  assert.equal(withDomain.photoUrls.length, 1); assert.match(withDomain.photoUrls[0], /^https:\/\/pub\.example\.dev\/requests\/[0-9a-f-]{36}\.jpg$/)
  const without = await (await handle(post(formWith({}, [jpeg()])), { storage: new MemoryStorage(), allow: allowAll })).json()
  assert.deepEqual(without.photoUrls, [])
})

test('too many requests from one address get 429 and nothing is saved', async () => {
  const storage = new MemoryStorage()
  const response = await handle(post(formWith()), { storage, allow: async () => false })
  assert.equal(response.status, 429); assert.match((await response.json()).error, /try again/i)
  assert.equal(storage.puts, 0); assert.equal((await rows()).length, 0)
})

test('a body declared larger than the limit is refused with 413 before it is read', async () => {
  const storage = new MemoryStorage()
  const request = post(formWith(), { 'content-length': String(9 * 1024 * 1024) })
  const response = await handle(request, { storage, allow: allowAll })
  assert.equal(response.status, 413); assert.equal(request.bodyUsed, false)
  assert.equal(storage.puts, 0)
})

test('a bad phone number gets 400 with a message the customer can act on', async () => {
  const storage = new MemoryStorage()
  const response = await handle(post(formWith({ phone: '12345' })), { storage, allow: allowAll })
  assert.equal(response.status, 400); assert.match((await response.json()).error, /Bangladesh mobile number/)
  assert.equal(storage.puts, 0); assert.equal((await rows()).length, 0)
})

test('the hidden spam field makes the request fail', async () => {
  const response = await handle(post(formWith({ website: 'http://spam.example' })), { storage: new MemoryStorage(), allow: allowAll })
  assert.equal(response.status, 400); assert.equal((await rows()).length, 0)
})

test('plain text sent in the photo field is refused', async () => {
  const form = formWith({}, [])
  form.append('photo', 'not a file')
  const response = await handle(post(form), { storage: new MemoryStorage(), allow: allowAll })
  assert.equal(response.status, 400); assert.equal((await rows()).length, 0)
})

test('a text file renamed to .jpg is refused', async () => {
  const form = formWith({}, [])
  form.append('photo', new Blob(['definitely not an image'], { type: 'image/jpeg' }), 'photo-1.jpg')
  const storage = new MemoryStorage()
  const response = await handle(post(form), { storage, allow: allowAll })
  assert.equal(response.status, 400); assert.match((await response.json()).error, /JPEG, PNG or WebP/)
  assert.equal(storage.puts, 0)
})

test('a storage failure gives a generic 503 that does not leak internals, and saves nothing', async () => {
  const storage = new MemoryStorage(); storage.broken = true
  const original = console.error; const logged: string[] = []; console.error = (...args: unknown[]) => { logged.push(args.map(String).join(' ')) }
  try {
    const response = await handle(post(formWith()), { storage, allow: allowAll })
    const body = await response.json()
    assert.equal(response.status, 503); assert.doesNotMatch(JSON.stringify(body), /R2|secret-detail/)
    assert.match(logged.join('\n'), /secret-detail/, 'the real cause must reach the server log')
  } finally { console.error = original }
  assert.equal((await rows()).length, 0)
})
