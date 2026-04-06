'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck, Trash2, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCart } from '@/lib/cart-context'
import { useSettings } from '@/lib/settings-context'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
    const { cart, removeItem, updateQuantity, cartTotal, cartCount } = useCart()
    const settings = useSettings()

    const vatPercentage = parseFloat(settings.vat_percentage || '0')
    const vatAmount = cartTotal * (vatPercentage / 100)
    const finalTotal = cartTotal + vatAmount

    return (
        <div className="py-12 md:py-20 min-h-screen relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="flex flex-col gap-2 mb-8 md:mb-12">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-500">Your Selection</span>
                    <h1 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight text-white">
                        SHOPPING <span className="text-gradient">BAG</span>
                    </h1>
                </div>

                {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 px-6 text-center glass border-dashed border-primary-500/10 rounded-3xl">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary-500/5 flex items-center justify-center text-primary-500 mb-8">
                            <ShoppingBag size={48} />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 uppercase tracking-wide">Your bag is empty</h2>
                        <p className="text-text-secondary mb-10 max-w-md text-sm md:text-base">Discovery awaits! Explore our latest premium tech arrivals and find something extraordinary.</p>
                        <Link href="/products">
                            <Button className="h-14 md:h-16 px-10 md:px-12 rounded-2xl shadow-2xl shadow-primary-500/30 gap-3 font-black uppercase tracking-widest text-base md:text-lg">
                                <ArrowLeft size={20} /> Start Shopping
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 flex flex-col gap-4 md:gap-6">
                            {cart.map((item) => (
                                <Card key={item.id} className="p-4 md:p-6 glass border-primary-500/5 hover:border-primary-500/10 transition-all flex flex-col sm:flex-row gap-4 md:gap-6 items-start sm:items-center">
                                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-xl md:rounded-2xl glass border border-primary-500/5 overflow-hidden p-2 flex-shrink-0">
                                        <Image src={item.image} alt={item.name} fill className="object-contain" />
                                    </div>
                                    <div className="flex flex-col flex-grow gap-1 md:gap-2 w-full">
                                        <div className="flex justify-between items-start gap-4">
                                            <Link href={`/product/${item.slug}`}>
                                                <h3 className="font-bold text-white hover:text-primary-500 transition-colors line-clamp-2 uppercase tracking-tight text-sm md:text-base">{item.name}</h3>
                                            </Link>
                                            <button 
                                                onClick={() => removeItem(item.id)}
                                                className="text-text-muted hover:text-red-500 transition-colors p-1"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-1 mb-1 md:mb-2 text-xl md:text-2xl font-black text-primary-500">
                                            <span>{formatPrice(item.price)}</span>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-start gap-6 mt-1 md:mt-2">
                                            <div className="flex items-center glass rounded-xl border border-primary-500/10 overflow-hidden">
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-2 hover:bg-white/5 text-text-muted hover:text-white transition-all disabled:opacity-30"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="w-8 md:w-10 text-center font-bold text-xs md:text-sm text-white">{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-2 hover:bg-white/5 text-text-muted hover:text-white transition-all"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                            <span className="text-[10px] md:text-xs font-bold text-text-secondary uppercase tracking-widest">
                                                Subtotal: <span className="text-white">{formatPrice(item.price * item.quantity)}</span>
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                            
                            <Link href="/products" className="flex items-center gap-2 text-primary-500 font-bold text-xs md:text-sm uppercase tracking-widest hover:gap-4 transition-all w-fit mt-2 md:mt-4">
                                <ArrowLeft size={16} /> Return to Shop
                            </Link>
                        </div>

                        {/* Order Summary */}
                        <div className="flex flex-col gap-6 md:gap-8">
                            <Card className="p-6 md:p-8 glass border-primary-500/10 lg:sticky lg:top-32 h-fit">
                                <h3 className="font-display font-black uppercase tracking-widest text-xs md:text-sm border-b border-primary-500/10 pb-4 md:pb-6 mb-6 md:mb-8 text-white">Summary</h3>
                                <div className="flex flex-col gap-4 md:gap-6">
                                    <div className="flex justify-between items-center text-text-secondary">
                                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Bag Subtotal ({cartCount} items)</span>
                                        <span className="font-bold text-white text-sm md:text-base">{formatPrice(cartTotal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-text-secondary">
                                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Shipping</span>
                                        <span className="text-[9px] md:text-[10px] font-black uppercase px-2 py-0.5 md:py-1 bg-emerald-500/10 text-emerald-500 rounded border border-emerald-500/20">FREE</span>
                                    </div>
                                    <div className="flex justify-between items-center text-text-secondary">
                                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Tax (VAT {vatPercentage}%)</span>
                                        <span className="font-bold text-white text-sm md:text-base">{formatPrice(vatAmount)}</span>
                                    </div>
                                    <div className="border-t border-primary-500/10 pt-4 md:pt-6 mt-2 flex justify-between items-center">
                                        <span className="font-display font-black uppercase tracking-widest text-white text-xs md:text-sm">Total Amount</span>
                                        <span className="text-2xl md:text-3xl font-black text-primary-500 tracking-tight">{formatPrice(finalTotal)}</span>
                                    </div>
                                    <Link href="/checkout">
                                        <Button className="h-14 md:h-16 w-full rounded-2xl font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-base md:text-lg shadow-2xl shadow-primary-500/20 mt-2 md:mt-4 group">
                                            Proceed to Checkout
                                        </Button>
                                    </Link>
                                    <p className="text-[9px] md:text-[10px] text-center text-text-muted uppercase font-bold tracking-widest">Tax & Shipping calculated at checkout</p>
                                </div>
                            </Card>

                            {/* Trust Badges */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4 p-5 rounded-2xl glass border border-primary-500/5">
                                    <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 shadow-inner">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-white uppercase tracking-tight">Purchase Protection</span>
                                        <span className="text-[10px] text-text-muted uppercase tracking-widest mt-0.5">Secure Transaction</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-5 rounded-2xl glass border border-primary-500/5">
                                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-inner">
                                        <Truck size={24} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-white uppercase tracking-tight">Express Delivery</span>
                                        <span className="text-[10px] text-text-muted uppercase tracking-widest mt-0.5">64 Districts Supported</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
