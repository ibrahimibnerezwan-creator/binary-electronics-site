import { Hero } from '@/components/layout/hero'
import { CategoryGrid } from '@/components/home/category-grid'
import { FeaturedProducts } from '@/components/home/featured-products'
import { NewsletterForm } from '@/components/home/newsletter-form'
import { getNewArrivals, getAllCategoriesWithCount } from '@/lib/data'

export const revalidate = 60;

export default async function Home() {
  const products = await getNewArrivals(8);
  const categories = await getAllCategoriesWithCount();
  
  return (
    <div className="flex flex-col">
      <Hero />
      
      {/* Category Grid */}
      <div className="py-12 md:py-0">
        <CategoryGrid categories={categories} />
      </div>

      {/* Trust Quote / Stats */}
      <section className="bg-bg-void py-16 md:py-24 border-y border-primary-500/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-primary-500 rounded-full blur-[100px]" />
          <div className="absolute inset-0 tech-grid opacity-[0.2]" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-[1px] w-8 bg-primary-500/30" />
            <span className="text-[10px] font-black tracking-[0.4em] text-primary-500 uppercase font-mono italic">Trust_Verification_Link... OK</span>
            <div className="h-[1px] w-8 bg-primary-500/30" />
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-black mb-8 max-w-4xl mx-auto leading-tight uppercase tracking-tighter">
            "TRUSTED BY <span className="text-gradient">OVER 10,000+</span> TECH ENTHUSIASTS ACROSS BANGLADESH"
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 mt-12 max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-black text-primary-500 tracking-tighter">24H</span>
              <span className="text-[10px] uppercase font-bold text-text-muted mt-2 tracking-[0.3em]">System_Support</span>
            </div>
            <div className="hidden sm:block w-[1px] h-12 bg-primary-500/20 self-center" />
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-black text-accent-500 tracking-tighter">100%</span>
              <span className="text-[10px] uppercase font-bold text-text-muted mt-2 tracking-[0.3em]">Verified_Hardware</span>
            </div>
            <div className="hidden sm:block w-[1px] h-12 bg-primary-500/20 self-center" />
            <div className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-black text-gold-500 tracking-tighter">FAST</span>
              <span className="text-[10px] uppercase font-bold text-text-muted mt-2 tracking-[0.3em]">Data_Delivery</span>
            </div>
          </div>
        </div>
      </section>

      <div className="py-12 md:py-0">
        <FeaturedProducts products={products} />
      </div>

      {/* Newsletter Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="glass-card p-8 sm:p-12 lg:p-20 flex flex-col items-center text-center gap-8 relative overflow-hidden border border-primary-500/10">
           <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/10 rounded-full blur-[100px]" />
           <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent-500/10 rounded-full blur-[100px]" />
           <div className="absolute inset-0 tech-grid opacity-[0.05]" />
           
           <div className="relative z-10 flex flex-col items-center gap-6">
             <h2 className="text-3xl sm:text-4xl lg:text-6xl font-display font-black leading-tight uppercase tracking-tighter">
               JOIN THE <br/>
               <span className="text-gradient">BINARY REVOLUTION</span>
             </h2>
             <p className="text-text-secondary max-w-xl text-xs sm:text-sm uppercase tracking-widest leading-relaxed">
               Subscribe to get early access to flash sales, exclusive discounts, and the latest tech reviews.
             </p>
             
             <div className="w-full max-w-md mt-4">
               <NewsletterForm />
             </div>
             
             <div className="flex items-center gap-8 mt-4 text-[8px] text-primary-500/30 font-black uppercase tracking-[0.4em]">
                <span>Status: Online</span>
                <span>Encrypted: SSL</span>
                <span>Version: v2.1</span>
             </div>
           </div>
        </div>
      </section>
    </div>
  )
}
