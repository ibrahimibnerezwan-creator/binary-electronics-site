import { test } from 'node:test'
import assert from 'node:assert/strict'
import { retryReads } from '../db/retry-fetch'

const pipeline = (...sql: string[]) => new Request('https://db.example/v2/pipeline', {
  method: 'POST',
  body: JSON.stringify({ requests: sql.map(s => ({ type: 'execute', stmt: { sql: s } })).concat({ type: 'close' } as never) }),
})
const reset = () => Object.assign(new Error('socket hang up'), { code: 'ECONNRESET' })

// Fails `failures` times, then answers; records every body it was sent.
function flaky(failures: number) {
  const bodies: string[] = []
  const fn = async (_url: string, init: { body?: string }) => { bodies.push(init.body ?? ''); if (bodies.length <= failures) throw reset(); return new Response('ok') }
  return { fn, bodies }
}

test('a read dropped by a reset socket is retried with the same body', async () => {
  const { fn, bodies } = flaky(2)
  const res = await retryReads(fn, 0)(pipeline('select * from products'))
  assert.equal(await res.text(), 'ok')
  assert.equal(bodies.length, 3)
  assert.ok(bodies.every(b => b === bodies[0]))
})

test('a write is never replayed', async () => {
  const { fn, bodies } = flaky(1)
  await assert.rejects(retryReads(fn, 0)(pipeline('insert into orders values (1)')), /socket hang up/)
  assert.equal(bodies.length, 1)
})

test('a batch containing any write is never replayed', async () => {
  const { fn, bodies } = flaky(1)
  await assert.rejects(retryReads(fn, 0)(pipeline('select 1', 'update orders set status = 1')))
  assert.equal(bodies.length, 1)
})

test('gives up after three attempts and surfaces the error', async () => {
  const { fn, bodies } = flaky(99)
  await assert.rejects(retryReads(fn, 0)(pipeline('select 1')), /socket hang up/)
  assert.equal(bodies.length, 3)
})

test('only network errors are retried, not other failures', async () => {
  let calls = 0
  const fn = async () => { calls++; throw new TypeError('bad input') }
  await assert.rejects(retryReads(fn, 0)(pipeline('select 1')), /bad input/)
  assert.equal(calls, 1)
})
