'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, ArrowRight, Github, ShieldCheck, Cpu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }

      router.push('/')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md relative font-mono animate-reveal-up">
      {/* Decorative Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-primary-500/10 border-x border-t border-primary-500/20 rounded-t-lg backdrop-blur-md">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
        </div>
        <span className="text-[10px] text-primary-500/50 uppercase tracking-widest font-bold">Secure Access Node v1.0.4</span>
      </div>

      <Card className="border-primary-500/20 bg-black/60 backdrop-blur-xl shadow-2xl rounded-t-none border-t-0 p-0 overflow-hidden relative group">
        {/* Animated Scanning Line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-500/50 to-transparent animate-scan z-20" />
        
        <CardHeader className="pt-12 pb-6 flex flex-col items-center text-center gap-2 relative">
          <div className="w-16 h-16 rounded-full bg-primary-500/5 border border-primary-500/10 flex items-center justify-center mb-4 relative overflow-hidden group-hover:border-primary-500/30 transition-colors">
            <ShieldCheck className="text-primary-500 w-8 h-8 relative z-10" />
            <div className="absolute inset-0 bg-primary-500/5 animate-pulse" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase flex items-center gap-3">
            SYSTEM <span className="text-primary-500">ACCESS</span>
          </h1>
          <p className="text-[10px] text-text-muted/60 uppercase tracking-[0.2em]">Authorized Personnel Only // Establish Secure Link</p>
        </CardHeader>

        <CardContent className="px-10 pb-12">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center font-bold uppercase tracking-wider">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-text-muted/80">
                <span>[ IDENTIFIER ]</span>
              </div>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/40 group-focus-within:text-primary-500 transition-colors" size={16} />
                <Input
                  name="email"
                  type="email"
                  placeholder="USER@NETWORK.LOCAL"
                  className="pl-12 bg-white/5 border-primary-500/10 focus:border-primary-500/50 focus:ring-primary-500/20 text-sm placeholder:text-text-muted/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-text-muted/80">
                <span>[ PASSCODE ]</span>
                <Link href="/login" className="text-primary-500 hover:text-primary-400 transition-colors">LOST_ACCESS?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/40 group-focus-within:text-primary-500 transition-colors" size={16} />
                <Input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-12 bg-white/5 border-primary-500/10 focus:border-primary-500/50 focus:ring-primary-500/20 text-sm"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-12 bg-primary-500 text-black hover:bg-white transition-all duration-500 font-black tracking-widest border-0 flex items-center justify-center gap-3 active:scale-[0.98]" 
              disabled={isLoading}
            >
              <Cpu className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'INITIATING...' : 'ESTABLISH LINK'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="relative my-8 border-t border-primary-500/10 flex justify-center">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-4 text-[10px] font-bold text-text-muted/30 uppercase tracking-[0.3em]">External Modules</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
             <Button variant="outline" className="border-primary-500/10 hover:border-primary-400/50 hover:bg-primary-500/5 text-primary-500/70 text-xs tracking-widest uppercase transition-all duration-300 gap-2">
               <Github size={16} /> Protocol: GITHUB
             </Button>
          </div>

          <div className="mt-10 pt-4 border-t border-primary-500/10 text-center">
            <p className="text-[11px] text-text-muted/40 uppercase tracking-widest flex items-center justify-center gap-2">
              No Profile Found?
              <Link href="/register" className="text-primary-500 font-bold hover:text-white transition-colors underline underline-offset-4">ENROLL_NEW_AGENT</Link>
            </p>
          </div>
        </CardContent>

        {/* Decorative Grid Pattern for Form */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] tech-grid z-0" />
      </Card>
    </div>
  )
}
