'use client'

import { useEffect, useState } from 'react'
import { ShoppingCart, Heart, Share2, Minus, Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart-context'

interface AddToCartButtonProps {
  product: {
    id: string
    name: string
    price: number
    image: string
    slug: string
  }
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('binary_wishlist') || '[]') as string[]
      setWishlisted(stored.includes(product.id))
    } catch {}
  }, [product.id])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(t)
  }, [toast])

  const handleAddToCart = () => {
    addItem({ ...product, quantity })
    setToast(`Added ${quantity} × ${product.name} to cart`)
  }

  const toggleWishlist = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('binary_wishlist') || '[]') as string[]
      let next: string[]
      if (stored.includes(product.id)) {
        next = stored.filter((id) => id !== product.id)
        setWishlisted(false)
        setToast('Removed from wishlist')
      } else {
        next = [...stored, product.id]
        setWishlisted(true)
        setToast('Added to wishlist')
      }
      localStorage.setItem('binary_wishlist', JSON.stringify(next))
    } catch {
      setToast('Could not update wishlist')
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url: window.location.href })
        return
      }
      await navigator.clipboard.writeText(window.location.href)
      setToast('Link copied to clipboard')
    } catch {
      setToast('Could not share link')
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Quantity</span>
        <div className="inline-flex items-center glass rounded-xl border border-primary-500/10">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="h-10 w-10 flex items-center justify-center hover:text-primary-500 disabled:opacity-40"
            disabled={quantity <= 1}
          >
            <Minus size={16} />
          </button>
          <span className="w-10 text-center text-sm font-bold">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Increase quantity"
            className="h-10 w-10 flex items-center justify-center hover:text-primary-500"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          size="lg"
          className="flex-grow h-16 gap-3 text-lg font-black uppercase tracking-widest shadow-2xl"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={24} /> Add to Cart
        </Button>
        <div className="flex gap-4">
          <Button
            variant="secondary"
            size="icon"
            className={`h-16 w-16 rounded-2xl glass hover:bg-primary-500/10 ${wishlisted ? 'text-red-500' : ''}`}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={wishlisted}
            onClick={toggleWishlist}
          >
            <Heart size={24} fill={wishlisted ? 'currentColor' : 'none'} />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-16 w-16 rounded-2xl glass hover:bg-primary-500/10"
            onClick={handleShare}
            aria-label="Share product"
          >
            <Share2 size={24} />
          </Button>
        </div>
      </div>

      {toast && (
        <div className="flex items-center gap-2 text-xs text-primary-500 animate-reveal-up" role="status" aria-live="polite">
          <Check size={14} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  )
}
