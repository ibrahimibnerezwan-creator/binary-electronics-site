import { db } from '@/db'
import { contactMessages,newsletter } from '@/db/schema'
import { requireAdmin } from '@/lib/auth'
import { desc } from 'drizzle-orm'
import { markRead } from './actions'
export const dynamic='force-dynamic'
export default async function MessagesPage(){
  await requireAdmin()
  const [messages,subscribers]=await Promise.all([db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt)),db.select().from(newsletter).orderBy(desc(newsletter.createdAt))])
  return <div className="space-y-8"><h1 className="text-3xl font-bold">Messages & subscribers</h1><h2 className="text-xl">Customer enquiries ({messages.length})</h2>
    {!messages.length&&<p>No enquiries yet.</p>}
    {messages.map(m=><article className="glass p-5 rounded-xl space-y-3" key={m.id}><h3 className="font-bold">{m.subject} — {m.status}</h3><p>{m.name} · <a className="underline" href={`mailto:${m.email}`}>{m.email}</a></p><p className="whitespace-pre-wrap break-words">{m.message}</p><p className="text-xs text-text-muted">{m.createdAt.toISOString()}</p>{m.status==='NEW'&&<form action={markRead}><input type="hidden" name="id" value={m.id}/><button className="p-2 bg-primary-500 text-black rounded">Mark read</button></form>}</article>)}
    <h2 className="text-xl">Newsletter subscribers ({subscribers.length})</h2><p className="text-sm text-text-secondary">Subscriptions are saved here. Email campaigns are sent through your own mailing service.</p><ul>{subscribers.map(s=><li key={s.id} className="py-2 break-all">{s.email}</li>)}</ul>
  </div>
}
