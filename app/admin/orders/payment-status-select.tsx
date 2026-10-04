'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updatePaymentStatus } from './actions'
export function PaymentStatusSelect({id,value}:{id:string;value:string}) {
  const [saving,setSaving]=useState(false)
  const [error,setError]=useState('')
  const router=useRouter()
  return <div><label className="text-xs">Payment status<select aria-label={`Payment status ${id.slice(0,8)}`} className="block bg-black border border-primary-500/30 rounded p-2" value={value} disabled={saving} onChange={async e=>{
    const status=e.target.value
    if (['PAID','REFUNDED'].includes(status) && !confirm(`Mark payment ${status}? Confirm this against the actual payment or refund first.`)) return
    setSaving(true);setError('')
    try {const result=await updatePaymentStatus(id,status);if(!result.success)setError(result.error || 'Could not save');else router.refresh()}
    catch {setError('Connection failed. Please retry.')}finally{setSaving(false)}
  }}>{['PENDING','VERIFYING','PAID','REFUNDED'].map(s=><option key={s}>{s}</option>)}</select></label>{error&&<p role="alert" className="text-red-400 text-xs">{error}</p>}</div>
}
