'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setStatus('loading')
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setStatus('success')
    setEmail('')
    
    // In a real app, you'd send this to an API
    console.log('Newsletter subscription for:', email)
    
    setTimeout(() => setStatus('idle'), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
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
        disabled={status !== 'idle'}
        className="h-14 px-8 rounded-full bg-primary-500 text-white font-bold hover:bg-primary-600 transition-all min-w-[120px]"
      >
        {status === 'loading' ? 'Joining...' : status === 'success' ? 'Joined!' : 'Subscribe'}
      </Button>
    </form>
  )
}
