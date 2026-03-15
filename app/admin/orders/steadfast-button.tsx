'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Truck, Loader2, Check } from 'lucide-react'
import { sendToSteadfast } from './actions'

interface SteadfastButtonProps {
  orderId: string
  trackingId?: string | null
}

export function SteadfastButton({ orderId, trackingId }: SteadfastButtonProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(!!trackingId)

  const handleSend = async () => {
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
      disabled={loading}
      onClick={handleSend}
      className="h-10 px-4 rounded-xl glass border-gold-500/20 text-gold-500 hover:bg-gold-500/10 gap-2 font-bold text-xs"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : <Truck size={16} />}
      Send to Steadfast
    </Button>
  )
}
