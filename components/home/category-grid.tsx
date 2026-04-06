'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Laptop, Smartphone, Headphones, Watch, Camera, Cpu, Package, Layers } from 'lucide-react'

const iconMap: Record<string, any> = {
  computing: Laptop,
  phones: Smartphone,
  audio: Headphones,
  smartwatch: Watch,
  camera: Camera,
  components: Cpu,
}

const defaultIcon = Package

export function CategoryGrid({ categories }: { categories: any[] }) {
  return (
    <section className="container mx-auto px-4 py-24 relative overflow-hidden font-mono">
      {/* Decorative Meta-data (Vertical) */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-12 text-[8px] text-primary-500/20 font-black uppercase tracking-[0.5em] [writing-mode:vertical-lr] rotate-180">
        <span>DIRECTORY_INDEX_ROOT</span>
        <span>MAPPED_NODES: 0x{categories.length.toString(16).toUpperCase()}</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 relative z-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Layers className="text-primary-500 w-4 h-4 animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.4em] text-primary-500 uppercase italic">Parsing_Module_Structures...</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-black tracking-tighter leading-none uppercase">
            SYSTEM <span className="text-gradient">DIRECTORIES</span>
          </h2>
          <p className="text-text-muted/60 max-w-xl text-xs uppercase tracking-widest">Select hardware category for deep-link integration.</p>
        </div>
        <Link 
          href="/categories" 
          className="group flex items-center gap-3 text-primary-500 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors py-2 px-4 border border-primary-500/10 hover:border-primary-500/50 bg-primary-500/5 backdrop-blur-sm"
        >
          EXPLORE_ALL_NODES <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative z-10">
        {categories.slice(0, 6).map((cat, i) => {
          const Icon = iconMap[cat.slug] || defaultIcon
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              viewport={{ once: true }}
              className="h-full"
            >
              <Link 
                href={`/category/${cat.slug}`}
                className="group flex flex-col items-center p-8 bg-black/40 border border-primary-500/10 hover:border-primary-500/60 transition-all duration-500 relative overflow-hidden h-full backdrop-blur-xl group"
              >
                {/* Background ID */}
                <div className="absolute top-2 right-3 text-[8px] font-black text-primary-500/20 uppercase tracking-widest">
                  DIR_{cat.slug.substring(0, 3).toUpperCase()}
                </div>
                
                {/* Scanning line for individual card (short) */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-primary-500/40 -translate-y-full group-hover:translate-y-20 transition-all duration-1000 ease-in-out opacity-0 group-hover:opacity-100" />
                
                <div className="w-20 h-20 rounded-none bg-primary-500/5 flex items-center justify-center text-primary-500/40 group-hover:text-primary-500 group-hover:bg-primary-500/10 transition-all duration-500 relative border border-primary-500/5 group-hover:border-primary-500/20 group-hover:shadow-[0_0_20px_rgba(var(--color-primary-500),0.1)]">
                  <Icon size={40} strokeWidth={1.5} />
                  
                  {/* Small decorative corner nodes */}
                  <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-primary-500/0 group-hover:border-primary-500 transition-colors" />
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-primary-500/0 group-hover:border-primary-500 transition-colors" />
                </div>
                
                <h3 className="mt-8 font-black text-center text-sm md:text-base group-hover:text-primary-500 transition-colors uppercase tracking-widest text-white leading-tight">
                  {cat.name}
                </h3>
                
                <div className="mt-4 flex items-center gap-2 text-[9px] font-bold text-text-muted/40 uppercase tracking-[0.2em] group-hover:text-primary-500/60 transition-colors italic">
                  <span className="w-1.5 h-[1px] bg-current" />
                  {cat.productCount} FILES
                </div>

                {/* Bottom status decoration */}
                <div className="absolute bottom-2 left-0 w-full flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="text-[7px] text-primary-500 font-black animate-pulse">STATUS: READY</div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>
      
      {/* Background Decorative Tech Pattern (Full Section) */}
      <div className="absolute inset-0 tech-grid opacity-[0.02] pointer-events-none" />
    </section>
  )
}
