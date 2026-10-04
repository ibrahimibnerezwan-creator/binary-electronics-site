import 'dotenv/config'
import { createClient } from '@libsql/client'
async function main() {
const client = createClient({url:process.env.TURSO_DATABASE_URL!,authToken:process.env.TURSO_AUTH_TOKEN})
const statements = [
  'CREATE TABLE IF NOT EXISTS newsletter (id text PRIMARY KEY NOT NULL, email text NOT NULL UNIQUE, created_at integer NOT NULL)',
  "CREATE TABLE IF NOT EXISTS contact_messages (id text PRIMARY KEY NOT NULL, name text NOT NULL, email text NOT NULL, subject text NOT NULL, message text NOT NULL, status text NOT NULL DEFAULT 'NEW', created_at integer NOT NULL)",
  'CREATE TABLE IF NOT EXISTS rate_limits (key text PRIMARY KEY NOT NULL, count integer NOT NULL, expires_at integer NOT NULL)',
]
if (process.argv.includes('--apply')) {
  await client.batch(statements,'write')
  console.log('Additive migration applied: newsletter, contact_messages, rate_limits. Existing tables preserved.')
} else console.log('Dry run: would create missing newsletter, contact_messages and rate_limits tables. Pass --apply to execute.')
client.close()

}
main().catch(() => { console.error('Migration failed. No existing tables were dropped.'); process.exitCode=1 })
