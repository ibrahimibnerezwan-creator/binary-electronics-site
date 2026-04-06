'use client'

import { motion } from 'framer-motion'
import { ShoppingCart, Star, Eye, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/lib/cart-context'

interface Product {
  id: string
  name: string
  price: number
  oldPrice?: number
  image: string
  slug: string
  rating: number
  reviews: number
  isNew?: boolean
}

export function FeaturedProducts({ products, noLayout = false }: { products: Product[], noLayout?: boolean }) {
  if (noLayout) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    )
  }

  return (
    <section className="container mx-auto px-4 py-24 relative overflow-hidden">
      {/* Background Decorative Tech Element */}
      <div className="absolute top-0 right-0 w-1/3 h-full tech-grid opacity-[0.03] pointer-events-none" />
      
      <div className="flex flex-col gap-4 mb-16 relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-[2px] w-10 bg-primary-500" />
          <span className="text-[10px] font-black tracking-[0.4em] text-primary-500 uppercase font-mono italic">Syncing_Inventory...</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tighter leading-none">
          FEATURED <span className="text-gradient">SYSTEMS</span>
        </h2>
        <p className="text-text-muted/60 max-w-xl font-mono text-xs uppercase tracking-widest">High-performance hardware for the digital elite.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      <div className="mt-20 flex justify-center">
        <Link href="/products">
          <Button variant="outline" className="h-14 px-12 font-mono font-black text-xs uppercase tracking-[0.3em] border-primary-500/20 hover:border-primary-500 hover:bg-primary-500/5 transition-all group backdrop-blur-sm">
            Access_Full_Archive
            <Zap className="ml-3 w-4 h-4 fill-primary-500/20 group-hover:fill-primary-500 transition-colors" />
          </Button>
        </Link>
      </div>
    </section>
  )
}

export function ProductCard({ product, index }: { product: Product, index: number }) {
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      slug: product.slug
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      viewport={{ once: true }}
      className="group relative flex flex-col font-mono"
    >
      {/* Visual Container */}
      <div className="relative aspect-[4/5] w-full bg-black border border-primary-500/10 overflow-hidden group-hover:border-primary-500/40 transition-colors">
        {/* Animated Scanning Line (Hover) */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-primary-500/60 shadow-[0_0_15px_rgba(var(--color-primary-500),0.8)] z-20 opacity-0 group-hover:animate-scan group-hover:opacity-100 pointer-events-none" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 z-30 flex flex-col gap-2">
          {product.isNew && (
            <div className="px-2 py-0.5 bg-primary-500 text-black text-[9px] font-black uppercase tracking-widest shadow-[4px_4px_0_rgba(0,0,0,1)]">
              NEW_CORE
            </div>
          )}
          {product.oldPrice && (
            <div className="px-2 py-0.5 bg-accent-500 text-white text-[9px] font-black uppercase tracking-widest shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
              -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%_REDUCTION
            </div>
          )}
        </div>
        
        <Link href={`/product/${product.slug}`} className="block h-full w-full relative">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 desaturate-[0.3] group-hover:desaturate-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        </Link>

        {/* Action Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 z-30">
           <Link href={`/product/${product.slug}`} className="flex-grow">
             <Button className="w-full h-10 bg-white/10 hover:bg-white text-white hover:text-black text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20 transition-all rounded-none">
               Details
             </Button>
           </Link>
           <Button 
            className="w-12 h-10 bg-primary-500 hover:bg-primary-400 text-black border-0 transition-all rounded-none"
            onClick={handleAddToCart}
           >
             <ShoppingCart size={16} strokeWidth={3} />
           </Button>
        </div>
      </div>

      {/* Info Area */}
      <div className="pt-6 flex flex-col flex-grow relative">
        {/* Technical Label (Kicker) */}
        <div className="flex items-center gap-2 mb-2 text-[8px] text-primary-500/40 uppercase tracking-[0.3em] font-black">
          <span>UID: {product.slug.substring(0, 8).toUpperCase()}</span>
          <span className="w-1 h-1 bg-primary-500/20 rounded-full" />
          <span>STATUS: ONLINE</span>
        </div>
        
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-bold text-lg mb-4 line-clamp-1 text-white group-hover:text-primary-500 transition-colors uppercase tracking-tight">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto flex items-end justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-2xl font-black text-white tracking-widest">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-[10px] text-text-muted/50 line-through tracking-widest">{formatPrice(product.oldPrice)}</span>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-1">
             <div className="flex gap-0.5 text-accent-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={8} fill={i < product.rating ? 'currentColor' : 'none'} className={i < product.rating ? 'drop-shadow-[0_0_2px_rgba(var(--color-accent-500),0.5)]' : ''} />
              ))}
            </div>
            <span className="text-[8px] text-text-muted/40 font-bold uppercase tracking-widest">Verified_User_Ref</span>
          </div>
        </div>
        
        {/* Background Decorative Index */}
        <div className="absolute -bottom-4 -right-2 text-4xl font-black text-primary-500/5 select-none pointer-events-none">
          #{String(index + 1).padStart(2, '0')}
        </div>
      </div>
    </motion.div>
  )
}
