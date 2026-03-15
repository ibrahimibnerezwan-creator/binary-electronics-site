'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Laptop, Smartphone, Headphones, Watch, Camera, Cpu } from 'lucide-react'

const categories = [
  { name: 'Computing', icon: Laptop, count: 124, slug: 'computing', color: 'bg-blue-500' },
  { name: 'Phones', icon: Smartphone, count: 86, slug: 'phones', color: 'bg-green-500' },
  { name: 'Audio', icon: Headphones, count: 42, slug: 'audio', color: 'bg-purple-500' },
  { name: 'Smartwatch', icon: Watch, count: 28, slug: 'smartwatch', color: 'bg-orange-500' },
  { name: 'Camera', icon: Camera, count: 15, slug: 'camera', color: 'bg-pink-500' },
  { name: 'Components', icon: Cpu, count: 56, slug: 'components', color: 'bg-cyan-500' },
]

export function CategoryGrid() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div className="flex flex-col gap-2">
          <h2 className="text-4xl font-display font-black tracking-tight">SHOP BY <span className="text-primary-500">CATEGORY</span></h2>
          <p className="text-text-secondary">Explore our curated collection of high-end gadgets.</p>
        </div>
        <Link href="/categories" className="text-primary-500 font-bold hover:underline">View all categories →</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <Link 
              href={`/category/${cat.slug}`}
              className="group flex flex-col items-center p-8 glass-card border-primary-500/5 hover:border-primary-500/30 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center text-text-secondary group-hover:text-primary-500 group-hover:scale-110 transition-all duration-300">
                <cat.icon size={32} />
              </div>
              <h3 className="mt-6 font-bold text-center group-hover:text-primary-500 transition-colors">{cat.name}</h3>
              <p className="text-[10px] uppercase font-bold text-text-muted mt-2 tracking-widest">{cat.count} items</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
