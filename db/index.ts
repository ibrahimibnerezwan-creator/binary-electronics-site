import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client, { schema });

// Each write owns its connection, including rollback/close after a failed concurrent write.
// This also avoids retaining a busy SQLite statement in local LibSQL clients.
type WriteTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
export async function writeTransaction<T>(work: (tx: WriteTransaction) => Promise<T>): Promise<T> {
  const writer = createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN });
  try { return await drizzle(writer, { schema }).transaction(work); }
  finally { writer.close(); }
}
