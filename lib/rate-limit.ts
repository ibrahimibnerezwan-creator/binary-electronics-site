import { createHash } from 'node:crypto'
import { db } from '@/db'
import { rateLimits } from '@/db/schema'
import { sql } from 'drizzle-orm'

export async function allowRequest(headers: Headers, action: string, limit = 10, minutes = 15) {
  const now = Date.now()
  // Bound cleanup so stale anonymous counters do not accumulate forever.
  await db.run(sql`DELETE FROM rate_limits WHERE key IN (SELECT key FROM rate_limits WHERE expires_at < ${now} LIMIT 100)`)
  const address = headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const key = createHash('sha256').update(`${action}:${address}`).digest('hex')
  const result = await db.insert(rateLimits).values({ key, count: 1, expiresAt: now + minutes * 60000 })
    .onConflictDoUpdate({ target: rateLimits.key, set: {
      count: sql`CASE WHEN ${rateLimits.expiresAt} <= ${now} THEN 1 ELSE ${rateLimits.count} + 1 END`,
      expiresAt: sql`CASE WHEN ${rateLimits.expiresAt} <= ${now} THEN ${now + minutes * 60000} ELSE ${rateLimits.expiresAt} END`,
    } }).returning({ count: rateLimits.count })
  return result[0].count <= limit
}
