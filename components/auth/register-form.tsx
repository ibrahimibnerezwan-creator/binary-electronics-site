'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, Phone, ArrowRight, UserPlus, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function RegisterForm() {
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
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          password: formData.get('password'),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Registration failed')
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
    <div className="w-full max-w-2xl relative font-mono animate-reveal-up">
      {/* Decorative Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-primary-500/10 border-x border-t border-primary-500/20 rounded-t-lg backdrop-blur-md">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
        </div>
        <span className="text-[10px] text-primary-500/50 uppercase tracking-widest font-bold">New Agent Enrollment Interface // v2.1.0</span>
      </div>

      <Card className="border-primary-500/20 bg-black/60 backdrop-blur-xl shadow-2xl rounded-t-none border-t-0 p-0 overflow-hidden relative group">
        {/* Animated Scanning Line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-500/50 to-transparent animate-scan z-20" />
        
        <CardHeader className="pt-12 pb-6 flex flex-col items-center text-center gap-2 relative">
          <div className="w-16 h-16 rounded-full bg-primary-500/5 border border-primary-500/10 flex items-center justify-center mb-4 relative overflow-hidden group-hover:border-primary-500/30 transition-colors">
            <UserPlus className="text-primary-500 w-8 h-8 relative z-10" />
            <div className="absolute inset-0 bg-primary-500/5 animate-pulse" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white uppercase">
            PROFILE <span className="text-primary-500">ENROLLMENT</span>
          </h1>
          <p className="text-[10px] text-text-muted/60 uppercase tracking-[0.2em]">Initialize Digital ID // Sync to Blockchain Archive</p>
        </CardHeader>

        <CardContent className="px-10 pb-12 mt-4">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center font-bold uppercase tracking-wider">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-text-muted/80 ml-1">
                <span>[ AGENT_NAME ]</span>
              </div>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/40 group-focus-within:text-primary-500 transition-colors" size={16} />
                <Input
                  name="name"
                  type="text"
                  placeholder="AGENT-001"
                  className="pl-12 bg-white/5 border-primary-500/10 focus:border-primary-500/50 focus:ring-primary-500/20 text-sm placeholder:text-text-muted/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-text-muted/80 ml-1">
                <span>[ COMMS_LINK ]</span>
              </div>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/40 group-focus-within:text-primary-500 transition-colors" size={16} />
                <Input
                  name="phone"
                  type="tel"
                  placeholder="+880-XXXX-XXXX"
                  className="pl-12 bg-white/5 border-primary-500/10 focus:border-primary-500/50 focus:ring-primary-500/20 text-sm placeholder:text-text-muted/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2 mt-2">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-text-muted/80 ml-1">
                <span>[ NETWORK_IDENTIFIER ]</span>
              </div>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/40 group-focus-within:text-primary-500 transition-colors" size={16} />
                <Input
                  name="email"
                  type="email"
                  placeholder="IDENTITY@BINARY.IO"
                  className="pl-12 bg-white/5 border-primary-500/10 focus:border-primary-500/50 focus:ring-primary-500/20 text-sm placeholder:text-text-muted/20"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2 mt-2 mb-4">
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-text-muted/80 ml-1">
                <span>[ ENCRYPTED_PASS_SECRET ]</span>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/40 group-focus-within:text-primary-500 transition-colors" size={16} />
                <Input
                  name="password"
                  type="password"
                  placeholder="••••••••••••"
                  className="pl-12 bg-white/5 border-primary-500/10 focus:border-primary-500/50 focus:ring-primary-500/20 text-sm"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-12 bg-white text-black hover:bg-primary-500 transition-all duration-500 font-black tracking-widest border-0 flex items-center justify-center gap-3 md:col-span-2 active:scale-[0.98]" 
              disabled={isLoading}
            >
              <Database className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'ENCRYPTING DATA...' : 'INITIATE ENROLLMENT'}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="mt-12 pt-6 border-t border-primary-500/10 text-center">
             <p className="text-[11px] text-text-muted/40 uppercase tracking-widest flex items-center justify-center gap-2">
              Identity already exists?
              <Link href="/login" className="text-primary-500 font-bold hover:text-white transition-colors underline underline-offset-4">REESTABLISH_SESSION</Link>
            </p>
          </div>
        </CardContent>

        {/* Decorative Grid Pattern for Form */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] tech-grid z-0" />
      </Card>
      
      {/* Small UI decorative nodes */}
      <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-primary-500/20 blur-sm rounded-full" />
      <div className="absolute -top-2 -left-2 w-4 h-4 bg-primary-500/20 blur-sm rounded-full" />
    </div>
  )
}
