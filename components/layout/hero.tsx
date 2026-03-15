'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, ShieldCheck, RefreshCcw } from 'lucide-react'
import Image from 'next/image'

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-10 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-1/4 right-0 w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[160px]" />
      </div>

      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary-500/20 w-fit">
            <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary-400">New arrivals available</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-display font-black leading-tight">
            ELEVATE <br />
            <span className="text-gradient">YOUR VISION</span>
          </h1>

          <p className="text-lg text-text-secondary max-w-lg leading-relaxed">
            Experience the next generation of premium electronics. From high-end computing to immersive audio, Binary Electronics brings you the world's most innovative technology.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <Button size="lg" className="gap-2 group" asChild>
              <Link href="/products">
                Explore Store <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/products">
                Flash Deals
              </Link>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-primary-500/10">
            <div className="flex flex-col gap-1">
              <Zap size={20} className="text-primary-500" />
              <span className="text-sm font-bold">Fast Delivery</span>
              <span className="text-xs text-text-muted">Nationwide shipping</span>
            </div>
            <div className="flex flex-col gap-1">
              <ShieldCheck size={20} className="text-accent-500" />
              <span className="text-sm font-bold">Genuine Warranty</span>
              <span className="text-xs text-text-muted">Official products</span>
            </div>
            <div className="flex flex-col gap-1">
              <RefreshCcw size={20} className="text-gold-500" />
              <span className="text-sm font-bold">7-Day Returns</span>
              <span className="text-xs text-text-muted">No-hassle policy</span>
            </div>
          </div>
        </motion.div>

        {/* Visual Content - Product Showcase */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative aspect-square lg:aspect-auto lg:h-[600px] flex items-center justify-center"
        >
          {/* Main Product Image (Placeholder - high end drone or something) */}
          <div className="relative w-full h-[80%] lg:h-full group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-transparent rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-700" />
            <Image
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"
              alt="Premium Product"
              fill
              className="object-contain animate-float"
            />
            
            {/* Floating Info Pods */}
            <motion.div 
               animate={{ y: [0, -15, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-1/4 -right-4 glass p-4 rounded-2xl border border-primary-500/20 shadow-2xl hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500">
                  <span className="text-[10px] font-bold">AI</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-primary-500">Smart Features</span>
                  <span className="text-xs font-bold">Enabled</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
               animate={{ y: [0, 15, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="absolute bottom-1/4 -left-4 glass p-4 rounded-2xl border border-accent-500/20 shadow-2xl hidden md:block"
            >
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-accent-500">Premium Build</span>
                <span className="text-xs font-bold">Titanium Alloy</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
