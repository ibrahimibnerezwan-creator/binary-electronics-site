import { getStoreSettings } from '@/lib/data'
import { getCurrentUser } from '@/lib/auth'
import CheckoutClient from './checkout-client'
import { Footer } from '@/components/layout/footer'

export const dynamic = 'force-dynamic'

export default async function CheckoutPage() {
    const settings = await getStoreSettings()
    const user = await getCurrentUser()

    return (
        <main className="min-h-screen pt-32 pb-20 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-[160px] pointer-events-none -z-10" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

            <div className="container mx-auto px-4">
                <div className="flex flex-col gap-2 mb-8">
                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary-500">Secure Checkout</span>
                    <h1 className="text-3xl md:text-5xl font-display font-black uppercase tracking-tight text-white mb-4">
                        COMPLETE <span className="text-gradient">PURCHASE</span>
                    </h1>
                </div>

                <div className="max-w-7xl">
                    <CheckoutClient 
                        settings={settings} 
                        user={user} 
                    />
                </div>
            </div>
            
            <div className="mt-20 border-t border-primary-500/5">
                <Footer />
            </div>
        </main>
    )
}
