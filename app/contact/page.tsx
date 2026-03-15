'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Mail, Phone, MapPin, Send, MessageSquare, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Footer } from '@/components/layout/footer'

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setStatus('success')
    setTimeout(() => setStatus('idle'), 3000)
    
    const formData = new FormData(e.target as HTMLFormElement)
    console.log('Contact form submitted:', Object.fromEntries(formData))
  }

  return (
    <div className="flex flex-col">
      <div className="container mx-auto px-4 py-20 relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-500/5 rounded-full blur-[160px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row gap-20 items-stretch">
          {/* Left Side: Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 flex flex-col justify-between py-6"
          >
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-500">Contact Us</span>
                <h1 className="text-5xl lg:text-7xl font-display font-black leading-tight uppercase tracking-tight">
                  LET&apos;S <br />
                  <span className="text-gradient">CONNECT</span>
                </h1>
                <p className="text-lg text-text-secondary leading-relaxed max-w-md mt-4">
                  Have a question about a product, order, or just want to talk tech? Our team is always here to help.
                </p>
              </div>

              <div className="flex flex-col gap-10 mt-8">
                <div className="flex gap-6 items-start">
                   <div className="w-14 h-14 rounded-3xl glass border border-primary-500/10 flex items-center justify-center text-primary-500 shrink-0">
                     <Mail size={24} />
                   </div>
                   <div className="flex flex-col gap-1">
                     <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Email Us</span>
                     <span className="text-xl font-bold">support@binaryelectronics.com</span>
                   </div>
                </div>
                
                <div className="flex gap-6 items-start">
                   <div className="w-14 h-14 rounded-3xl glass border border-primary-500/10 flex items-center justify-center text-accent-500 shrink-0">
                     <Phone size={24} />
                   </div>
                   <div className="flex flex-col gap-1">
                     <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Call Us</span>
                     <span className="text-xl font-bold">+880 1234 567890</span>
                   </div>
                </div>

                <div className="flex gap-6 items-start">
                   <div className="w-14 h-14 rounded-3xl glass border border-primary-500/10 flex items-center justify-center text-primary-500 shrink-0">
                     <MapPin size={24} />
                   </div>
                   <div className="flex flex-col gap-1">
                     <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Our Store</span>
                     <span className="text-xl font-bold">Level-5, Multiplan Center, Dhaka, BD</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 mt-16 pt-16 border-t border-primary-500/10">
               <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Follow our journey</span>
               <div className="flex items-center gap-4">
                  {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                    <button key={i} className="w-12 h-12 rounded-full glass border border-primary-500/10 flex items-center justify-center text-text-secondary hover:text-primary-500 hover:border-primary-500/30 transition-all">
                      <Icon size={20} />
                    </button>
                  ))}
               </div>
            </div>
          </motion.div>

          {/* Right Side: Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <div className="glass-card p-8 lg:p-12 relative overflow-hidden h-full">
               {/* Ambient Glow */}
               <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/10 rounded-full blur-[80px]" />
               
               <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Your Name</label>
                        <Input placeholder="John Doe" className="h-14 bg-bg-void/40" />
                     </div>
                     <div className="flex flex-col gap-3">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Your Email</label>
                        <Input type="email" placeholder="john@example.com" className="h-14 bg-bg-void/40" />
                     </div>
                  </div>

                  <div className="flex flex-col gap-3">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Subject</label>
                     <Input placeholder="Tech Inquiry" className="h-14 bg-bg-void/40" />
                  </div>

                  <div className="flex flex-col gap-3">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Your Message</label>
                     <textarea 
                       rows={6}
                       placeholder="How can we help?"
                       className="w-full rounded-2xl border border-primary-500/10 bg-bg-void/40 p-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all resize-none"
                     ></textarea>
                  </div>

                  <Button 
                    type="submit"
                    size="lg" 
                    disabled={status !== 'idle'}
                    className="h-16 w-full text-lg font-black uppercase tracking-[0.2em] gap-3"
                  >
                    {status === 'loading' ? 'Sending...' : status === 'success' ? 'Message Sent!' : (
                      <>
                        <Send size={20} /> Send Message
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 mt-4 text-[10px] font-bold tracking-widest text-text-muted uppercase">
                    <MessageSquare size={14} /> Average response time: 2 hours
                  </div>
               </form>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
