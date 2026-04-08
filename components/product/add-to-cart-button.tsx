'use client'

import { useState } from 'react'
import { ShoppingCart, Heart, Share2 } from 'lucide-react'
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

  const handleAddToCart = () => {
    addItem({
      ...product,
      quantity
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          url: window.location.href
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  return (
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
          onClick={() => {
            setWishlisted(!wishlisted)
            alert(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!')
          }}
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
  )
}
