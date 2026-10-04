'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Truck, Loader2, Check } from 'lucide-react'
import { sendToSteadfast, resolveCourierBooking } from './actions'

interface SteadfastButtonProps {
  orderId: string
  trackingId?: string | null
  status: string
}

export function SteadfastButton({ orderId, trackingId, status }: SteadfastButtonProps) {
  const router = useRouter()
  const [recoveredTracking, setRecoveredTracking] = useState('')
  const [absent, setAbsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(!!trackingId)

  const handleSend = async () => {
    if (!confirm('Book a real courier collection for this order?')) return
    setLoading(true)
    try {
      const res = await sendToSteadfast(orderId)
      if (res.success) {
        setSuccess(true)
        alert(`Order sent to Steadfast! Tracking ID: ${res.trackingId}`)
      } else {
        alert(res.error || 'Failed to send to Steadfast')
      }
    } catch (err) {
      alert('Network error')
    } finally {
      setLoading(false)
    }
  }

  if (['DISPATCHING','DISPATCH_REVIEW'].includes(status)) return (
    <form className="space-y-2 max-w-xs text-xs" onSubmit={async e => {
      e.preventDefault()
      if (!confirm('Confirm you checked this invoice in the Steadfast portal and the entered outcome is correct?')) return
      setLoading(true)
      try { const result = await resolveCourierBooking(orderId, recoveredTracking.trim(), absent); if (!result.success) alert(result.error); else router.refresh() }
      catch { alert('Could not save the courier outcome. Please retry.') }
      finally { setLoading(false) }
    }}>
      <p>Check invoice {orderId} in the Steadfast portal before resolving this booking.</p>
      <input aria-label="Existing courier tracking code" value={recoveredTracking} onChange={e => setRecoveredTracking(e.target.value)} placeholder="Tracking code, if booked" className="w-full bg-bg-void border rounded p-2" />
      <label className="flex gap-2"><input type="checkbox" checked={absent} onChange={e => setAbsent(e.target.checked)} /> I confirmed no booking exists</label>
      <Button size="sm" disabled={loading || (!recoveredTracking.trim() && !absent)} type="submit">Save courier outcome</Button>
    </form>
  )

  if (success) {
    return (
      <div className="flex items-center gap-2 bg-green-500/10 text-green-500 px-3 py-1.5 rounded-lg border border-green-500/20 text-[10px] font-black uppercase tracking-widest">
         <Check size={14} /> Tracking: {trackingId || 'Generated'}
      </div>
    )
  }

  return (
    <Button 
      size="sm" 
      variant="secondary" 
      disabled={loading || status !== 'PROCESSING'}
      onClick={handleSend}
      className="h-10 px-4 rounded-xl glass border-gold-500/20 text-gold-500 hover:bg-gold-500/10 gap-2 font-bold text-xs"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Truck size={16} />}
      Send to Steadfast
    </Button>
  )
}
