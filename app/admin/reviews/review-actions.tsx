'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Reply, Loader2 } from 'lucide-react'
import { updateReviewStatus, replyToReview } from './actions'

interface ReviewActionButtonsProps {
  reviewId: string
  status: string | null
  currentReply?: string | null
}

export function ReviewActionButtons({ reviewId, status, currentReply }: ReviewActionButtonsProps) {
  const [reply, setReply] = useState(currentReply || '')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState<string | null>(null)

  const handleAction = async (newStatus: 'approved' | 'rejected') => {
    if (newStatus === 'rejected') {
      if (!confirm('Reject this review? It will be hidden from the storefront.')) return
    }
    setLoading(newStatus)
    try {
      const result = await updateReviewStatus(reviewId, newStatus)
      if (!result.success) alert(result.error || 'Could not update review')
    } catch { alert('Could not update review. Please retry.') } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
      {status !== 'approved' && (
        <Button 
          size="sm" 
          variant="secondary" 
          disabled={!!loading}
          onClick={() => handleAction('approved')}
          className="h-9 px-4 rounded-xl glass border-green-500/10 text-green-500 hover:bg-green-500/10 gap-2"
        >
          {loading === 'approved' ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />} Approve
        </Button>
      )}
      {status !== 'rejected' && (
        <Button 
          size="sm" 
          variant="secondary" 
          disabled={!!loading}
          onClick={() => handleAction('rejected')}
          className="h-9 px-4 rounded-xl glass border-red-500/10 text-red-500 hover:bg-red-500/10 gap-2"
        >
           {loading === 'rejected' ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />} Reject
        </Button>
      )}
      </div>
      <form className="space-y-2" onSubmit={async e => {
        e.preventDefault(); setLoading('reply'); setMessage('')
        try { const result = await replyToReview(reviewId, reply); setMessage(result.success ? 'Reply saved.' : result.error || 'Could not save reply.') }
        catch { setMessage('Could not save reply. Please retry.') }
        finally { setLoading(null) }
      }}>
        <label className="block text-sm" htmlFor={`reply-${reviewId}`}>Store reply</label>
        <textarea id={`reply-${reviewId}`} value={reply} onChange={e => setReply(e.target.value)} required maxLength={2000} className="w-full rounded-lg border p-2 bg-bg-void" />
        <Button type="submit" disabled={!!loading} size="sm"><Reply size={14} /> Save reply</Button>
        {message && <p role="status" className="text-sm">{message}</p>}
      </form>
    </div>
  )
}
