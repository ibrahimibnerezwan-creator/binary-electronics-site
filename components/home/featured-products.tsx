'use client'

import { motion } from 'framer-motion'
import { ShoppingCart, Star, Eye } from 'lucide-react'
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
    <section className="container mx-auto px-4 py-20">
      <div className="flex flex-col gap-2 mb-12">
        <h2 className="text-4xl font-display font-black uppercase tracking-tight">FEATURED <span className="text-gradient">COLLECTION</span></h2>
        <p className="text-text-secondary">Our most popular and highly rated electronics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      <div className="mt-16 flex justify-center">
        <Link href="/products">
          <Button variant="outline" size="lg" className="rounded-full px-12">View All Products</Button>
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
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group glass-card overflow-hidden flex flex-col"
    >
      {/* Image Area */}
      <div className="relative aspect-[4/5] w-full bg-bg-void/50 overflow-hidden">
        {product.isNew && (
          <Badge className="absolute top-4 left-4 z-10" variant="gold">NEW</Badge>
        )}
        {product.oldPrice && (
          <Badge className="absolute top-4 right-4 z-10" variant="destructive">
            -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
          </Badge>
        )}
        
        <Link href={`/product/${product.slug}`} className="block h-full w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </Link>

        {/* Quick Actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity bg-bg-void/40 backdrop-blur-sm duration-300">
           <Link href={`/product/${product.slug}`}>
             <Button variant="secondary" size="icon" className="rounded-full">
               <Eye size={18} />
             </Button>
           </Link>
           <Button 
            variant="primary" 
            size="icon" 
            className="rounded-full"
            onClick={handleAddToCart}
           >
             <ShoppingCart size={18} />
           </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-accent-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill={i < product.rating ? 'currentColor' : 'none'} />
            ))}
          </div>
          <span className="text-[10px] text-text-muted">({product.reviews} reviews)</span>
        </div>
        
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary-500 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto flex items-center justify-between gap-4 pt-4 border-t border-primary-500/5">
          <div className="flex flex-col">
            <span className="text-xl font-black text-text-primary">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-sm text-text-muted line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8"
            onClick={handleAddToCart}
          >
            Add +
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
