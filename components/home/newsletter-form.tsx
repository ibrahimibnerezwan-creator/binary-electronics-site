'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setStatus('loading')
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message || "Thank you for joining our newsletter.")
        setEmail('')
      } else {
        throw new Error(data.error || 'Failed to subscribe')
      }
    } catch (error: any) {
      console.error('Newsletter Error:', error)
      setStatus('error')
      setMessage(error.message || "An error occurred. Please try again.")
    }
    
    setTimeout(() => {
      setStatus('idle')
      setMessage('')
    }, 5000)
  }

  return (
    <div className="w-full max-w-md flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 w-full">
        <input 
          type="email" 
          placeholder="Enter your email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === 'loading'}
          className="flex-grow h-14 rounded-full bg-bg-primary border border-primary-500/20 px-8 text-sm focus:outline-none focus:border-primary-500 transition-all disabled:opacity-50"
        />
        <Button 
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="h-14 px-8 rounded-full bg-primary-500 text-white font-bold hover:bg-primary-600 transition-all min-w-[120px]"
        >
          {status === 'loading' ? 'Joining...' : status === 'success' ? 'Joined!' : 'Subscribe'}
        </Button>
      </form>
      
      {message && (
        <p className={`text-xs font-bold uppercase tracking-widest ${status === 'error' ? 'text-red-500' : 'text-primary-500'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
