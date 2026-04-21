import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Star, Shield, Truck, RefreshCcw, ShoppingCart, Zap, Heart, Share2 } from 'lucide-react'
import { ProductGallery } from '@/components/product/product-gallery'
import { AddToCartButton } from '@/components/product/add-to-cart-button'
import { ReviewForm } from '@/components/product/review-form'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatPrice, cn } from '@/lib/utils'
import { FeaturedProducts } from '@/components/home/featured-products'

import { getProductBySlug, getRelatedProducts, getProductReviews, getStoreSettings } from '@/lib/data'
import { getCurrentUser } from '@/lib/auth'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getStoreSettings()
  ])
  
  const storeName = settings.storeName || 'Binary Electronics'
  if (!product) return { title: `Product Not Found | ${storeName}` }
  
  return {
    title: `${product.name} | ${storeName}`,
    description: product.description,
    openGraph: {
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const [relatedProducts, productReviews, currentUser] = await Promise.all([
    getRelatedProducts(product.categoryId, product.id, 4),
    getProductReviews(product.id),
    getCurrentUser(),
  ])

  return (
    <div className="flex flex-col">
      <div className="container mx-auto px-4 pt-24 md:pt-32 pb-16 md:pb-24">
        {/* Breadcrumbs Placeholder */}
        <div className="flex items-center gap-2 text-[10px] md:text-xs text-text-muted mb-6 md:mb-8 uppercase tracking-widest font-bold overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link href="/products" className="hover:text-primary-500 transition-colors shrink-0">Store</Link>
          <span className="shrink-0">/</span>
          <Link href={`/category/${product.category?.slug}`} className="hover:text-primary-500 transition-colors uppercase shrink-0">{product.categoryName}</Link>
          <span className="shrink-0">/</span>
          <span className="text-text-primary truncate">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
          {/* Left: Gallery */}
          <ProductGallery images={product.images} />

          {/* Right: Info */}
          <div className="flex flex-col gap-6 md:gap-8">
            <div className="flex flex-col gap-3 md:gap-4">
              <div className="flex items-center gap-3 md:gap-4">
                {product.isFeatured && (
                  <Badge variant="gold" className="px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs">Featured</Badge>
                )}
                <div className="flex items-center gap-1">
                  <div className="flex text-accent-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < product.rating ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  <span className="text-[10px] md:text-sm text-text-muted">({product.reviewsCount} reviews)</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-black leading-tight uppercase tracking-tight">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 md:gap-6 mt-1 md:mt-2">
                <span className="text-2xl md:text-3xl font-black text-primary-500">
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice && (
                  <span className="text-lg md:text-xl text-text-muted line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
                {product.comparePrice && (
                  <Badge variant="destructive" className="rounded-md text-[9px] md:text-[10px]">
                   -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                  </Badge>
                )}
              </div>
            </div>

            <p className="text-sm md:text-lg text-text-secondary leading-relaxed border-l-2 border-primary-500/20 pl-4 md:pl-6">
              {product.description}
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4 p-4 md:p-6 glass rounded-2xl border-primary-500/10">
              <div className="flex flex-col items-center text-center gap-1.5 md:gap-2">
                 <Shield className="w-4 h-4 md:w-5 md:h-5 text-primary-500" />
                 <span className="text-[8px] md:text-[10px] font-bold uppercase text-text-muted">Warranty</span>
                 <span className="text-[10px] md:text-xs font-bold">{product.warranty}</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5 md:gap-2 sm:border-l border-primary-500/10">
                 <Truck className="w-4 h-4 md:w-5 md:h-5 text-accent-500" />
                 <span className="text-[8px] md:text-[10px] font-bold uppercase text-text-muted">Delivery</span>
                 <span className="text-[10px] md:text-xs font-bold">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5 md:gap-2 md:border-l border-primary-500/10 pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l">
                 <RefreshCcw className="w-4 h-4 md:w-5 md:h-5 text-gold-500" />
                 <span className="text-[8px] md:text-[10px] font-bold uppercase text-text-muted">Returns</span>
                 <span className="text-[10px] md:text-xs font-bold">7 Days</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5 md:gap-2 md:border-l border-primary-500/10 pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l">
                 <Zap className="w-4 h-4 md:w-5 md:h-5 text-primary-500" />
                 <span className="text-[8px] md:text-[10px] font-bold uppercase text-text-muted">Availability</span>
                 <span className={cn("text-[10px] md:text-xs font-bold", product.stock > 0 ? "text-green-500" : "text-red-500")}>
                   {product.stock > 0 ? `In Stock` : "Out of Stock"}
                 </span>
              </div>
            </div>

            {/* Actions */}
            <AddToCartButton 
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                slug: product.slug
              }} 
            />

            {/* Spec Cards */}
            <div className="mt-4 md:mt-8">
              <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-primary-500 mb-4 md:mb-6">Key Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                 {Object.entries(product.specs).map(([key, value]) => (
                   <div key={key} className="flex flex-col p-3 md:p-4 bg-bg-elevated/30 border border-primary-500/5 rounded-xl">
                     <span className="text-[8px] md:text-[10px] uppercase font-bold text-text-muted mb-1">{key}</span>
                     <span className="text-[10px] md:text-sm font-bold">{value as string}</span>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="container mx-auto px-4 py-16 md:py-20 border-t border-primary-500/5">
        <div className="flex items-center gap-3 mb-8 md:mb-12">
          <h3 className="text-2xl md:text-3xl font-display font-black uppercase">Customer <span className="text-gradient">Reviews</span></h3>
          <span className="text-sm text-text-muted">({productReviews.length})</span>
        </div>

        {productReviews.length === 0 ? (
          <p className="text-text-muted text-sm mb-8">No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="grid gap-4 md:gap-6 max-w-3xl">
            {productReviews.map((review) => (
              <div key={review.id} className="glass rounded-2xl p-4 md:p-6 border border-primary-500/5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-xs font-bold text-primary-500">
                      {review.reviewerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-sm font-bold">{review.reviewerName}</span>
                      <div className="flex items-center gap-1 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className="text-accent-500" fill={i < review.rating ? 'currentColor' : 'none'} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-text-muted">
                    {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm text-text-secondary leading-relaxed">{review.comment}</p>
                )}
                {review.adminReply && (
                  <div className="mt-3 pl-4 border-l-2 border-primary-500/30">
                    <span className="text-[10px] font-bold text-primary-500 uppercase tracking-wider">Store Reply</span>
                    <p className="text-sm text-text-muted mt-1">{review.adminReply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-10">
          <ReviewForm
            productId={product.id}
            productSlug={product.slug}
            loggedInName={currentUser?.name}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-20 border-t border-primary-500/5">
        <h3 className="text-2xl font-display font-black uppercase mb-12">Related <span className="text-gradient">Products</span></h3>
        <FeaturedProducts products={relatedProducts as any} noLayout />
      </div>

    </div>
  )
}
