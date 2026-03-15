import Link from 'next/link'
import { ShoppingBag, ArrowLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function CartPage() {
    return (
        <main className="pt-32 pb-20 min-h-screen">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <h1 className="text-3xl md:text-4xl font-display font-black uppercase tracking-tight text-white">
                        YOUR <span className="text-gradient">SHOPPING BAG</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Cart Items Area */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <Card className="p-20 text-center glass border-dashed border-primary-500/10 flex flex-col items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-primary-500/5 flex items-center justify-center text-primary-500">
                                <ShoppingBag size={40} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-xl font-bold text-white">Your bag is empty</h3>
                                <p className="text-text-secondary text-sm">Looks like you haven't added anything to your bag yet.</p>
                            </div>
                            <Link href="/products">
                                <Button className="h-14 px-10 rounded-2xl shadow-xl shadow-primary-500/20 gap-2 font-black uppercase tracking-widest">
                                    <ArrowLeft size={18} /> Continue Shopping
                                </Button>
                            </Link>
                        </Card>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="flex flex-col gap-8">
                        <Card className="p-8 glass border-primary-500/5 flex flex-col gap-6">
                            <h3 className="font-display font-black uppercase tracking-widest text-sm border-b border-primary-500/10 pb-4">Order Summary</h3>
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between text-text-secondary">
                                    <span>Subtotal</span>
                                    <span>BDT 0</span>
                                </div>
                                <div className="flex justify-between text-text-secondary">
                                    <span>Shipping</span>
                                    <span>Calculated later</span>
                                </div>
                                <div className="border-t border-primary-500/10 pt-4 flex justify-between font-black text-white text-lg">
                                    <span>Total</span>
                                    <span>BDT 0</span>
                                </div>
                            </div>
                            <Button disabled className="h-16 w-full rounded-2xl font-black uppercase tracking-widest">
                                Checkout Empty
                            </Button>
                        </Card>

                        {/* Features */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-bg-elevated/20 border border-primary-500/5">
                                <ShieldCheck className="text-primary-500" size={24} />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-white">Secure Checkout</span>
                                    <span className="text-[10px] text-text-muted">100% Encrypted Payment</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-bg-elevated/20 border border-primary-500/5">
                                <Truck className="text-accent-500" size={24} />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-white">Fast Delivery</span>
                                    <span className="text-[10px] text-text-muted">Across Bangladesh</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
