'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Laptop, Smartphone, Headphones, Watch, Camera, Cpu, Package } from 'lucide-react'

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
    <section className="container mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-display font-black tracking-tight">SHOP BY <span className="text-primary-500 text-gradient">CATEGORY</span></h2>
          <p className="text-text-secondary">Explore our curated collection of high-end gadgets.</p>
        </div>
        <Link href="/categories" className="text-primary-500 font-bold hover:underline transition-all">View all categories →</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.slice(0, 6).map((cat, i) => {
          const Icon = iconMap[cat.slug] || defaultIcon
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Link 
                href={`/category/${cat.slug}`}
                className="group flex flex-col items-center p-8 glass-card border-primary-500/5 hover:border-primary-500/30 transition-all duration-300 relative overflow-hidden h-full"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-primary-500/5 rounded-full blur-2xl -mr-8 -mt-8 group-hover:bg-primary-500/10 transition-colors" />
                <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-text-secondary group-hover:text-primary-500 group-hover:scale-110 transition-all duration-300 relative z-10 shadow-inner">
                  <Icon size={32} />
                </div>
                <h3 className="mt-6 font-bold text-center group-hover:text-primary-500 transition-colors uppercase tracking-tight">{cat.name}</h3>
                <p className="text-[10px] uppercase font-bold text-text-muted mt-2 tracking-widest">{cat.productCount} items</p>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
