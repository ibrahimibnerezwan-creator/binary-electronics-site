'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Reply, Loader2 } from 'lucide-react'
import { updateReviewStatus } from './actions'

interface ReviewActionButtonsProps {
  reviewId: string
  status: string | null
}

export function ReviewActionButtons({ reviewId, status }: ReviewActionButtonsProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleAction = async (newStatus: 'approved' | 'rejected') => {
    setLoading(newStatus)
    try {
      await updateReviewStatus(reviewId, newStatus)
    } finally {
      setLoading(null)
    }
  }

  return (
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
  )
}
