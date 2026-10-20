import { db } from '@/db'
import { contactMessages,itemRequests,newsletter } from '@/db/schema'
import { requireAdmin } from '@/lib/auth'
import { whatsappNumber } from '@/lib/commerce'
import { buildInbox } from '@/lib/inbox'
import { desc } from 'drizzle-orm'
import { markRead,markRequestRead } from './actions'
import { DeleteRequestButton } from './delete-request-button'
import { PhotoThumbs } from './photo-thumbs'
export const dynamic='force-dynamic'
const dhaka=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Dhaka',dateStyle:'medium',timeStyle:'short'})
export default async function MessagesPage(){
  await requireAdmin()
  const [messages,subscribers]=await Promise.all([db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt)),db.select().from(newsletter).orderBy(desc(newsletter.createdAt))])
  // Photo requests live in a newer table. If it cannot be read, the enquiries must still load.
  let requests:(typeof itemRequests.$inferSelect)[]=[],photosUnavailable=false
  try{requests=await db.select().from(itemRequests).orderBy(desc(itemRequests.createdAt))}catch(error){photosUnavailable=true;console.error('[admin/messages] photo requests could not be loaded',error)}
  const {items,newCount}=buildInbox(messages,requests)
  return <div className="space-y-8"><h1 className="text-3xl font-bold">Messages & subscribers</h1><h2 className="text-xl">Customer enquiries and photo requests ({items.length}){newCount>0&&<span className="text-base text-text-muted"> · {newCount} new</span>}</h2>
    {photosUnavailable&&<p role="alert" className="text-sm text-amber-400">Photo requests could not be loaded right now. Customer enquiries are shown below.</p>}
    {!items.length&&<p>No enquiries yet.</p>}
    {items.map(item=>item.kind==='enquiry'
      ?<article className="glass p-5 rounded-xl space-y-3" key={item.id}><h3 className="font-bold">{item.subject} — {item.status}</h3><p>{item.name} · <a className="underline" href={`mailto:${item.email}`}>{item.email}</a></p><p className="whitespace-pre-wrap break-words">{item.message}</p><p className="text-xs text-text-muted">{dhaka.format(item.createdAt)}</p>{item.status==='NEW'&&<form action={markRead}><input type="hidden" name="id" value={item.id}/><button className="p-2 bg-primary-500 text-black rounded">Mark read</button></form>}</article>
      :<article className="glass p-5 rounded-xl space-y-3" key={item.id}><h3 className="font-bold">Photo request — {item.status}</h3><p>{item.name} · <a className="underline" href={`tel:${item.phone}`}>{item.phone}</a></p>
        {item.keys.length>0&&<PhotoThumbs keys={item.keys} name={item.name}/>}
        {item.note&&<p className="whitespace-pre-wrap break-words">{item.note}</p>}
        <p className="text-xs text-text-muted">{item.reference} · {dhaka.format(item.createdAt)}</p>
        <div className="flex flex-wrap gap-2"><a className="p-2 rounded bg-emerald-700 text-white" href={`https://wa.me/${whatsappNumber(item.phone)}?text=${encodeURIComponent(`Hello ${item.name}, this is Binary Electronics about your photo request ${item.reference}.`)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a><a className="p-2 rounded glass" href={`tel:${item.phone}`}>Call</a>{item.status==='NEW'&&<form action={markRequestRead}><input type="hidden" name="id" value={item.id}/><button className="p-2 bg-primary-500 text-black rounded">Mark read</button></form>}<DeleteRequestButton id={item.id} reference={item.reference}/></div></article>)}
    <h2 className="text-xl">Newsletter subscribers ({subscribers.length})</h2><p className="text-sm text-text-secondary">Subscriptions are saved here. Email campaigns are sent through your own mailing service.</p><ul>{subscribers.map(s=><li key={s.id} className="py-2 break-all">{s.email}</li>)}</ul>
  </div>
}
