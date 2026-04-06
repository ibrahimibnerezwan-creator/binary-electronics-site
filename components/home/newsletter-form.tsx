'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Send, Cpu, ShieldCheck, AlertCircle } from 'lucide-react'

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
        setMessage("PROTOCOL_SUCCEEDED: UPLINK_ESTABLISHED")
        setEmail('')
      } else {
        throw new Error(data.error || 'Failed to subscribe')
      }
    } catch (error: any) {
      console.error('Newsletter Error:', error)
      setStatus('error')
      setMessage(`PROTOCOL_FAILURE: ${error.message || "UPLINK_TERMINATED"}`)
    }
    
    setTimeout(() => {
      setStatus('idle')
      setMessage('')
    }, 8000)
  }

  return (
    <div className="w-full max-w-lg flex flex-col gap-6 font-mono relative">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 w-full group">
        <div className="relative flex-grow">
          <input 
            type="email" 
            placeholder="IDENTIFIER@COMM_LINK.ORG" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === 'loading'}
            className="w-full h-14 bg-black/40 border border-primary-500/20 px-8 text-xs uppercase tracking-widest text-white focus:outline-none focus:border-primary-500/60 focus:bg-primary-500/5 transition-all disabled:opacity-50 placeholder:text-text-muted/20"
          />
          {/* Internal corner decoration */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary-500/30" />
        </div>
        
        <Button 
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className="h-14 px-10 bg-primary-500 text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-white transition-all min-w-[160px] border-l-0 border border-primary-500/20 active:scale-[0.98] relative"
        >
          {status === 'loading' ? (
            <span className="flex items-center gap-2"><Cpu className="animate-spin w-4 h-4" /> UPLINKING...</span>
          ) : status === 'success' ? (
            <span className="flex items-center gap-2 text-black"><ShieldCheck className="w-4 h-4" /> SECURED</span>
          ) : (
            <span className="flex items-center gap-2 italic">START_UPLINK <Send className="w-3 h-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></span>
          )}
        </Button>
      </form>
      
      {message && (
        <div className="flex items-center gap-3 animate-reveal-up overflow-hidden">
          {status === 'error' ? <AlertCircle className="text-red-500 w-4 h-4 shrink-0" /> : <ShieldCheck className="text-primary-500 w-4 h-4 shrink-0" /> }
          <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${status === 'error' ? 'text-red-500' : 'text-primary-500'}`}>
            {message}
          </p>
          <div className="h-[1px] flex-grow bg-current/10" />
        </div>
      )}

      {/* Background Decorative Data-Line */}
      {!message && (
        <div className="flex items-center gap-3 opacity-20 animate-pulse">
           <div className="flex-grow h-[1px] bg-primary-500/20" />
           <span className="text-[9px] font-black tracking-widest text-primary-500/30">PENDING_USER_IDENTIFICATION_V8</span>
        </div>
      )}
    </div>
  )
}
