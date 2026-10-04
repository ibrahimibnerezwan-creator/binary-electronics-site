'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
export interface CartItem { id: string; name: string; price: number; quantity: number; image: string; slug: string; stock?: number }
interface CartContextType {
  cart: CartItem[]; addItem: (item: CartItem) => void; removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void; clearCart: () => void
  cartTotal: number; cartCount: number; ready: boolean; syncError: string | null
}
const CartContext = createContext<CartContextType | undefined>(undefined)
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)
  const [ready, setReady] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)
  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem('binary_cart') || '[]')
      if (Array.isArray(saved)) setCart(saved.filter(i => i && typeof i.id === 'string' && typeof i.name === 'string' && typeof i.slug === 'string' && typeof i.image === 'string' && Number.isFinite(i.price) && i.price > 0 && Number.isSafeInteger(i.quantity) && i.quantity > 0 && i.quantity <= 999))
    } catch {}
    setLoaded(true)
  }, [])
  useEffect(() => {
    if (!loaded) return
    try { localStorage.setItem('binary_cart', JSON.stringify(cart)) } catch {}
  }, [cart, loaded])
  useEffect(() => {
    if (!loaded) return
    let active = true
    const sync = async () => {
      try {
        const response = await fetch('/api/catalogue', { cache: 'no-store' })
        if (!response.ok) throw new Error()
        const data = await response.json()
        if (!Array.isArray(data.products)) throw new Error()
        if (!active) return
        setCart(previous => previous.map(item => {
          const live = data.products.find((p: CartItem) => p.id === item.id)
          return live ? { ...item, name: live.name, price: live.price, image: live.image, slug: live.slug, stock: live.stock } : { ...item, stock: 0 }
        }))
        setSyncError(null)
      } catch { if (active) setSyncError('Could not verify current prices and stock. Please retry before checkout.') }
      finally { if (active) setReady(true) }
    }
    void sync()
    window.addEventListener('focus', sync)
    return () => { active = false; window.removeEventListener('focus', sync) }
  }, [loaded])
  const addItem = (item: CartItem) => {
    if (!Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.stock === 0) return
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      const quantity = Math.min(999, item.stock ?? 999, (existing?.quantity || 0) + item.quantity)
      return existing ? prev.map(i => i.id === item.id ? { ...item, quantity } : i) : [...prev, { ...item, quantity }]
    })
  }
  const removeItem = (id: string) => setCart(prev => prev.filter(i => i.id !== id))
  const updateQuantity = (id: string, quantity: number) => {
    if (!Number.isSafeInteger(quantity)) return
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock || 999, 999)) } : i))
  }
  return <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart: () => setCart([]),
    cartTotal: cart.reduce((n, i) => n + i.price * i.quantity, 0), cartCount: cart.reduce((n, i) => n + i.quantity, 0), ready, syncError }}>{children}</CartContext.Provider>
}
export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('CartProvider is required')
  return context
}
