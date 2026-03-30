import Link from 'next/link'
import { CheckCircle2, Package, ArrowRight, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/layout/footer'

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
    return (
        <main className="min-h-screen pt-32 pb-20 relative overflow-hidden flex flex-col">
            <div className="flex-grow container mx-auto px-4 flex flex-col items-center justify-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

                <div className="glass border border-primary-500/10 p-12 rounded-[2.5rem] max-w-2xl w-full text-center shadow-2xl relative">
                    <div className="w-24 h-24 rounded-3xl bg-primary-500/10 flex items-center justify-center text-primary-500 mx-auto mb-10 shadow-inner">
                        <CheckCircle2 size={48} />
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary-500 mb-4 block">Order Successful</span>
                    <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-white mb-6">
                        THANK YOU <br/>FOR YOUR <span className="text-gradient">TRUST</span>
                    </h1>
                    
                    <p className="text-text-secondary text-lg mb-10 leading-relaxed">
                        Your order <span className="text-white font-mono font-bold">#{params.id.slice(0, 8).toUpperCase()}</span> has been placed successfully and is being processed by our team.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                        <div className="p-6 rounded-2xl bg-bg-void/40 border border-primary-500/5 flex flex-col items-center gap-3">
                            <Package className="text-primary-500" size={24} />
                            <span className="text-xs font-bold text-white uppercase tracking-widest">Processing</span>
                            <span className="text-[10px] text-text-muted uppercase">Ready in 24h</span>
                        </div>
                        <div className="p-6 rounded-2xl bg-bg-void/40 border border-primary-500/5 flex flex-col items-center gap-3">
                            <ShoppingBag className="text-primary-500" size={24} />
                            <span className="text-xs font-bold text-white uppercase tracking-widest">Delivery</span>
                            <span className="text-[10px] text-text-muted uppercase">2-3 Business Days</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/products" className="flex-1">
                            <Button variant="outline" className="w-full h-16 rounded-2xl font-black uppercase tracking-widest gap-3 border-primary-500/10 hover:bg-white/5 transition-all">
                                Continue Shopping
                            </Button>
                        </Link>
                        <Link href="/" className="flex-1">
                            <Button className="w-full h-16 rounded-2xl font-black uppercase tracking-widest gap-3 shadow-2xl shadow-primary-500/20">
                                Back to Home <ArrowRight size={20} />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            
            <div className="mt-20 border-t border-primary-500/5">
                <Footer />
            </div>
        </main>
    )
}
