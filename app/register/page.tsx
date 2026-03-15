'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Phone, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center container mx-auto px-4 py-20 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        <Card className="border-primary-500/10 shadow-2xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary-500 to-accent-500" />
          
          <CardHeader className="pt-10 pb-6 flex flex-col items-center text-center gap-4">
            <Link href="/" className="mb-2">
              <div className="relative w-12 h-12">
                <Image src="/logo.png" alt="Binary Electronics" fill className="object-contain" />
              </div>
            </Link>
            <h1 className="text-3xl font-display font-black tracking-tight tracking-tight uppercase">CREATE <span className="text-primary-500 text-gradient">ACCOUNT</span></h1>
            <p className="text-sm text-text-muted">Join the Binary Revolution today</p>
          </CardHeader>

          <CardContent className="px-8 pb-10">
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary-500 transition-colors" size={18} />
                  <Input type="text" placeholder="John Doe" className="pl-12" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary-500 transition-colors" size={18} />
                  <Input type="tel" placeholder="+880" className="pl-12" required />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary-500 transition-colors" size={18} />
                  <Input type="email" placeholder="name@example.com" className="pl-12" required />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary-500 transition-colors" size={18} />
                  <Input type="password" placeholder="••••••••" className="pl-12" required />
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full gap-2 group md:col-span-2 mt-4" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-text-muted">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-500 font-bold hover:underline">Login Now</Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
