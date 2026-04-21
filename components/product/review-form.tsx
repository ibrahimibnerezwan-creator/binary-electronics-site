'use client'

import { useState } from 'react'
import { Star, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { submitReview } from '@/app/(customer)/product/[slug]/actions'

interface ReviewFormProps {
  productId: string
  productSlug: string
  loggedInName?: string
}

export function ReviewForm({ productId, productSlug, loggedInName }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [reviewerName, setReviewerName] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (rating < 1) {
      setStatus('error')
      setMessage('Please select a rating.')
      return
    }

    setStatus('loading')
    const result = await submitReview({
      productId,
      productSlug,
      rating,
      comment,
      reviewerName,
      honeypot,
    })

    if ('error' in result && result.error) {
      setStatus('error')
      setMessage(result.error)
      return
    }

    setStatus('success')
    setMessage('Thank you! Your review is pending approval by the store.')
    setRating(0)
    setComment('')
    setReviewerName('')
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-2xl p-5 md:p-6 border border-primary-500/5 max-w-3xl flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h4 className="text-sm md:text-base font-black uppercase tracking-wider">Write a review</h4>
        <p className="text-xs text-text-muted">Your review will be visible after admin approval.</p>
      </div>

      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            className="p-1"
          >
            <Star
              size={26}
              className="text-accent-500 transition-transform hover:scale-110"
              fill={n <= (hover || rating) ? 'currentColor' : 'none'}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="text-xs text-text-muted ml-2">{rating} / 5</span>
        )}
      </div>

      {!loggedInName && (
        <input
          type="text"
          value={reviewerName}
          onChange={(e) => setReviewerName(e.target.value)}
          placeholder="Your name (optional)"
          maxLength={60}
          className="bg-bg-elevated/40 border border-primary-500/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500/40"
        />
      )}

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this product..."
        rows={4}
        maxLength={2000}
        className="bg-bg-elevated/40 border border-primary-500/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500/40 resize-y"
      />

      <input
        type="text"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      {message && (
        <div className={`flex items-center gap-2 text-xs ${status === 'error' ? 'text-red-500' : 'text-primary-500'}`}>
          {status === 'error' ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
          <span>{message}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={status === 'loading'}
        className="self-start h-11 px-6 rounded-xl text-xs font-black uppercase tracking-widest"
      >
        {status === 'loading' ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  )
}
