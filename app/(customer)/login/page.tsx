'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    // Auth logic will be added here
    setTimeout(() => setIsLoading(false), 1500)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center container mx-auto px-4 py-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-primary-500/10 shadow-2xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary-500 to-accent-500" />
          
          <CardHeader className="pt-10 pb-6 flex flex-col items-center text-center gap-4">
            <Link href="/" className="mb-2">
              <div className="relative w-12 h-12">
                <Image src="/logo.png" alt="Binary Electronics" fill className="object-contain" />
              </div>
            </Link>
            <h1 className="text-3xl font-display font-black tracking-tight">WELCOME <span className="text-primary-500">BACK</span></h1>
            <p className="text-sm text-text-muted">Enter your credentials to access your account</p>
          </CardHeader>

          <CardContent className="px-8 pb-10">
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary-500 transition-colors" size={18} />
                  <Input type="email" placeholder="name@example.com" className="pl-12" required />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Password</label>
                  <Link href="/login" className="text-[10px] font-bold text-primary-500 hover:underline uppercase tracking-widest">Forgot?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary-500 transition-colors" size={18} />
                  <Input type="password" placeholder="••••••••" className="pl-12" required />
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full gap-2 group mt-2" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-primary-500/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-bg-elevated px-2 text-text-muted">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
               <Button variant="secondary" className="gap-2">
                 <Github size={18} /> Github
               </Button>
            </div>

            <p className="mt-8 text-center text-sm text-text-muted">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-primary-500 font-bold hover:underline">Register Now</Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
