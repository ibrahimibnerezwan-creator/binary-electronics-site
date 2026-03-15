import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Star, Shield, Truck, RefreshCcw, ShoppingCart, Zap, Heart, Share2 } from 'lucide-react'
import { ProductGallery } from '@/components/product/product-gallery'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Footer } from '@/components/layout/footer'
import { formatPrice, cn } from '@/lib/utils'
import { FeaturedProducts } from '@/components/home/featured-products'

import { getProductBySlug, getRelatedProducts } from '@/lib/data'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  if (!product) return { title: 'Product Not Found | Binary Electronics' }
  
  return {
    title: `${product.name} | Binary Electronics`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)
  if (!product) notFound()

  const relatedProducts = await getRelatedProducts(product.categoryId, product.id, 4)

  return (
    <div className="flex flex-col">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumbs Placeholder */}
        <div className="flex items-center gap-2 text-xs text-text-muted mb-8 uppercase tracking-widest font-bold">
          <span className="hover:text-primary-500 cursor-pointer">Store</span>
          <span>/</span>
          <span className="hover:text-primary-500 cursor-pointer">{product.categoryName}</span>
          <span>/</span>
          <span className="text-text-primary">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Gallery */}
          <ProductGallery images={product.images} />

          {/* Right: Info */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <Badge variant="gold" className="px-3 py-1">Best Seller</Badge>
                <div className="flex items-center gap-1">
                  <div className="flex text-accent-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < product.rating ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  <span className="text-sm text-text-muted">({product.reviewsCount} customer reviews)</span>
                </div>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-display font-black leading-tight uppercase tracking-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-6 mt-2">
                <span className="text-3xl font-black text-primary-500">
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice && (
                  <span className="text-xl text-text-muted line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
                {product.comparePrice && (
                  <Badge variant="destructive" className="rounded-md">
                   SAVE {formatPrice(product.comparePrice - product.price)}
                  </Badge>
                )}
              </div>
            </div>

            <p className="text-lg text-text-secondary leading-relaxed border-l-2 border-primary-500/20 pl-6">
              {product.description}
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 glass rounded-2xl border-primary-500/10">
              <div className="flex flex-col items-center text-center gap-2">
                 <Shield size={20} className="text-primary-500" />
                 <span className="text-[10px] font-bold uppercase text-text-muted">Warranty</span>
                 <span className="text-xs font-bold">{product.warranty}</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 border-l border-primary-500/10">
                 <Truck size={20} className="text-accent-500" />
                 <span className="text-[10px] font-bold uppercase text-text-muted">Delivery</span>
                 <span className="text-xs font-bold">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 border-l border-primary-500/10">
                 <RefreshCcw size={20} className="text-gold-500" />
                 <span className="text-[10px] font-bold uppercase text-text-muted">Returns</span>
                 <span className="text-xs font-bold">7 Days</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 border-l border-primary-500/10">
                 <Zap size={20} className="text-primary-500" />
                 <span className="text-[10px] font-bold uppercase text-text-muted">Availability</span>
                 <span className={cn("text-xs font-bold", product.stock > 0 ? "text-green-500" : "text-red-500")}>
                   {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
                 </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="flex-grow h-16 gap-3 text-lg font-black uppercase tracking-widest shadow-2xl">
                <ShoppingCart size={24} /> Add to Cart
              </Button>
              <div className="flex gap-4">
                <Button variant="secondary" size="icon" className="h-16 w-16 rounded-2xl glass hover:bg-primary-500/10">
                  <Heart size={24} />
                </Button>
                <Button variant="secondary" size="icon" className="h-16 w-16 rounded-2xl glass hover:bg-primary-500/10">
                  <Share2 size={24} />
                </Button>
              </div>
            </div>

            {/* Spec Cards */}
            <div className="mt-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-primary-500 mb-6">Key Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {Object.entries(product.specs).map(([key, value]) => (
                   <div key={key} className="flex flex-col p-4 bg-bg-elevated/30 border border-primary-500/5 rounded-xl">
                     <span className="text-[10px] uppercase font-bold text-text-muted mb-1">{key}</span>
                     <span className="text-sm font-bold">{value as string}</span>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 border-t border-primary-500/5">
        <h3 className="text-2xl font-display font-black uppercase mb-12">Related <span className="text-gradient">Products</span></h3>
        <FeaturedProducts products={relatedProducts} />
      </div>

      <Footer />
    </div>
  )
}
