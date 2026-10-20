import { test, before, beforeEach, after } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createClient, type Client } from '@libsql/client'
import { detectImageType, validateItemRequestFields, requestReference, parseImageKeys, photoUrls, REQUEST_LIMITS } from '../lib/item-request'
import { ValidationError } from '../lib/commerce'

const jpeg = (size = 64) => Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(size - 4, 7)])
const png = (size = 64) => Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(size - 8, 9)])
const webp = (size = 64) => Buffer.concat([Buffer.from('RIFF'), Buffer.alloc(4, 1), Buffer.from('WEBP'), Buffer.alloc(size - 12, 3)])
const fields = (extra: Record<string, unknown> = {}) => ({ requestId: crypto.randomUUID(), name: 'Rafiq Ahmed', phone: '01712345678', note: 'Need this IC', website: '', ...extra })

test('detects JPEG, PNG and WebP by their first bytes', () => {
  assert.deepEqual(detectImageType(jpeg()), { ext: 'jpg', type: 'image/jpeg' })
  assert.deepEqual(detectImageType(png()), { ext: 'png', type: 'image/png' })
  assert.deepEqual(detectImageType(webp()), { ext: 'webp', type: 'image/webp' })
})

test('refuses GIF, SVG, HTML and tiny files however they are named', () => {
  assert.equal(detectImageType(Buffer.from('GIF89a' + 'x'.repeat(30))), null)
  assert.equal(detectImageType(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>')), null)
  assert.equal(detectImageType(Buffer.from('<html><script>alert(1)</script></html>')), null)
  assert.equal(detectImageType(Buffer.from([0xff, 0xd8])), null)
})

test('valid fields are trimmed and the phone number is normalised', () => {
  const id = crypto.randomUUID()
  assert.deepEqual(validateItemRequestFields(fields({ requestId: id, name: '  Rafiq Ahmed ', phone: '+880 1712-345678', note: '  ' })), { id, name: 'Rafiq Ahmed', phone: '01712345678', note: null })
})

test('invalid fields are rejected with a message for the customer', () => {
  const bad: Array<[string, Record<string, unknown>]> = [
    ['missing name', { name: '  ' }], ['name too long', { name: 'x'.repeat(101) }], ['not a Bangladesh mobile', { phone: '12345' }],
    ['note too long', { note: 'x'.repeat(1001) }], ['spam field filled', { website: 'http://spam.example' }], ['request id not a uuid', { requestId: 'abc' }],
  ]
  for (const [label, extra] of bad) assert.throws(() => validateItemRequestFields(fields(extra)), ValidationError, label)
})

test('reference code is the first eight characters of the id', () => {
  assert.equal(requestReference('7f3a9c21-1111-4222-8333-444455556666'), 'REQ-7F3A9C21')
})

test('stored photo keys become public addresses, and bad data becomes an empty list', () => {
  assert.deepEqual(photoUrls(['requests/a.jpg', 'requests/b.png'], 'https://pub.example.dev/'), ['https://pub.example.dev/requests/a.jpg', 'https://pub.example.dev/requests/b.png'])
  assert.deepEqual(parseImageKeys('["requests/a.jpg"]'), ['requests/a.jpg'])
  assert.deepEqual(parseImageKeys('not json'), [])
  assert.deepEqual(parseImageKeys('{"a":1}'), [])
})

// ---------- saving, using a real temporary database and an in-memory photo store ----------
let client: Client
let save: typeof import('../lib/item-request-service').saveItemRequest
let remove: typeof import('../lib/item-request-service').deleteItemRequest
const directory = mkdtempSync(join(tmpdir(), 'binary-requests-'))

class MemoryStorage {
  objects = new Map<string, { bytes: Buffer; contentType: string }>()
  puts = 0
  failOnPut = 0 // fail the Nth put (1-based); 0 = never
  async put(key: string, bytes: Buffer, contentType: string) {
    this.puts++
    if (this.failOnPut && this.puts === this.failOnPut) throw new Error('storage down')
    this.objects.set(key, { bytes, contentType })
  }
  async remove(key: string) { this.objects.delete(key) }
}

before(async () => {
  process.env.TURSO_DATABASE_URL = `file:${directory}/test.db`; delete process.env.TURSO_AUTH_TOKEN
  client = createClient({ url: process.env.TURSO_DATABASE_URL })
  await client.executeMultiple(readFileSync('drizzle/0000_careful_shiver_man.sql', 'utf8'))
  ;({ saveItemRequest: save, deleteItemRequest: remove } = await import('../lib/item-request-service'))
})
beforeEach(async () => { await client.execute('DELETE FROM item_requests') })
after(() => { client.close(); rmSync(directory, { recursive: true, force: true }) })
const rows = async () => (await client.execute('SELECT * FROM item_requests')).rows

test('saves the request and stores each photo under an unguessable key with its true type', async () => {
  const storage = new MemoryStorage(), data = fields()
  const result = await save(data, [jpeg(), png()], storage)
  assert.equal(result.duplicate, false)
  assert.equal(result.reference, requestReference(data.requestId))
  const [row] = await rows()
  assert.equal(row.phone, '01712345678'); assert.equal(row.status, 'NEW'); assert.equal(row.name, 'Rafiq Ahmed')
  const keys = parseImageKeys(String(row.image_keys))
  assert.equal(keys.length, 2)
  assert.match(keys[0], /^requests\/[0-9a-f-]{36}\.jpg$/); assert.match(keys[1], /^requests\/[0-9a-f-]{36}\.png$/)
  assert.ok(!keys.some(k => k.includes(data.requestId)), 'keys must not be derived from the client-supplied id')
  assert.deepEqual([...storage.objects.keys()].sort(), [...keys].sort())
  assert.equal(storage.objects.get(keys[0])!.contentType, 'image/jpeg'); assert.equal(storage.objects.get(keys[1])!.contentType, 'image/png')
})

test('the answer lists the stored photo keys, also when the request was already saved', async () => {
  const storage = new MemoryStorage(), data = fields()
  const first = await save(data, [jpeg(), png()], storage), again = await save(data, [jpeg(), png()], storage)
  assert.equal(first.keys.length, 2); assert.deepEqual(again.keys, first.keys)
  assert.deepEqual(first.keys, parseImageKeys(String((await rows())[0].image_keys)))
})

test('sending the same request twice keeps one row and uploads once', async () => {
  const storage = new MemoryStorage(), data = fields()
  const first = await save(data, [jpeg()], storage), second = await save(data, [jpeg()], storage)
  assert.equal(first.duplicate, false); assert.equal(second.duplicate, true); assert.equal(second.reference, first.reference)
  assert.equal((await rows()).length, 1); assert.equal(storage.puts, 1)
})

test('two identical requests at the same moment still leave one row and no orphaned photos', async () => {
  const storage = new MemoryStorage(), data = fields()
  await Promise.all([save(data, [jpeg(), webp()], storage), save(data, [jpeg(), webp()], storage)])
  const all = await rows()
  assert.equal(all.length, 1)
  assert.deepEqual([...storage.objects.keys()].sort(), parseImageKeys(String(all[0].image_keys)).sort())
})

test('refuses bad photo sets before anything is uploaded or saved', async () => {
  const cases: Array<[string, Buffer[]]> = [
    ['no photo', []], ['four photos', [jpeg(), jpeg(), jpeg(), jpeg()]],
    ['one photo over 2 MB', [jpeg(REQUEST_LIMITS.maxPhotoBytes + 1)]],
    ['photos over 4 MB together', [jpeg(1_900_000), jpeg(1_900_000), jpeg(1_900_000)]],
    ['a text file renamed .jpg', [Buffer.from('this is not an image at all')]],
    ['a GIF', [Buffer.from('GIF89a' + 'x'.repeat(40))]],
  ]
  for (const [label, photos] of cases) {
    const storage = new MemoryStorage()
    await assert.rejects(save(fields(), photos, storage), ValidationError, label)
    assert.equal(storage.puts, 0, label); assert.equal((await rows()).length, 0, label)
  }
})

test('a failed upload saves nothing and removes photos already uploaded', async () => {
  const storage = new MemoryStorage(); storage.failOnPut = 2
  await assert.rejects(save(fields(), [jpeg(), png()], storage))
  assert.equal((await rows()).length, 0); assert.equal(storage.objects.size, 0)
})

test('a failed database save removes the uploaded photos', async () => {
  await client.execute("CREATE TRIGGER fail_request BEFORE INSERT ON item_requests BEGIN SELECT RAISE(ABORT,'injected failure'); END")
  try {
    const storage = new MemoryStorage()
    await assert.rejects(save(fields(), [jpeg(), png()], storage))
    assert.equal(storage.puts, 2); assert.equal(storage.objects.size, 0); assert.equal((await rows()).length, 0)
  } finally { await client.execute('DROP TRIGGER fail_request') }
})

test('deleting a request removes its row and all of its photos', async () => {
  const storage = new MemoryStorage(), data = fields()
  await save(data, [jpeg(), png(), webp()], storage)
  assert.equal(storage.objects.size, 3)
  assert.equal(await remove(data.requestId, storage), true)
  assert.equal((await rows()).length, 0); assert.equal(storage.objects.size, 0)
  assert.equal(await remove(data.requestId, storage), false)
})
