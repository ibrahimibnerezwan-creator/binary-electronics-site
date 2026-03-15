import { Hero } from '@/components/layout/hero'
import { Footer } from '@/components/layout/footer'
import { CategoryGrid } from '@/components/home/category-grid'
import { FeaturedProducts } from '@/components/home/featured-products'
import { NewsletterForm } from '@/components/home/newsletter-form'
import { WhatsAppCTA } from '@/components/layout/whatsapp-cta'
import { getNewArrivals, getAllCategoriesWithCount } from '@/lib/data'

export const revalidate = 60;

export default async function Home() {
  const products = await getNewArrivals(8);
  const categories = await getAllCategoriesWithCount();
  
  return (
    <div className="flex flex-col">
      <Hero />
      
      <CategoryGrid categories={categories} />

      {/* Trust Quote / Stats */}
      <section className="bg-bg-void py-24 border-y border-primary-500/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] bg-primary-500 rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl lg:text-5xl font-display font-black mb-8 max-w-4xl mx-auto leading-tight">
            "TRUSTED BY <span className="text-gradient">OVER 10,000+</span> TECH ENTHUSIASTS ACROSS BANGLADESH"
          </h2>
          <div className="flex justify-center gap-12 mt-12">
            <div className="flex flex-col">
              <span className="text-4xl font-black text-primary-500">24H</span>
              <span className="text-xs uppercase font-bold text-text-muted mt-2 tracking-widest">Support</span>
            </div>
            <div className="w-[1px] h-12 bg-primary-500/20" />
            <div className="flex flex-col">
              <span className="text-4xl font-black text-accent-500">100%</span>
              <span className="text-xs uppercase font-bold text-text-muted mt-2 tracking-widest">Genuine</span>
            </div>
            <div className="w-[1px] h-12 bg-primary-500/20" />
            <div className="flex flex-col">
              <span className="text-4xl font-black text-gold-500">FAST</span>
              <span className="text-xs uppercase font-bold text-text-muted mt-2 tracking-widest">Delivery</span>
            </div>
          </div>
        </div>
      </section>

      <FeaturedProducts products={products} />

      {/* Newsletter Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="glass-card p-12 lg:p-20 flex flex-col items-center text-center gap-8 relative overflow-hidden">
           <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/10 rounded-full blur-[100px]" />
           <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent-500/10 rounded-full blur-[100px]" />
           
           <h2 className="text-4xl lg:text-6xl font-display font-black leading-tight">JOIN THE <br/><span className="text-gradient">BINARY REVOLUTION</span></h2>
           <p className="text-text-secondary max-w-xl">Subscribe to get early access to flash sales, exclusive discounts, and the latest tech reviews.</p>
           
           <NewsletterForm />
        </div>
      </section>

      <Footer />
      <WhatsAppCTA />
    </div>
  )
}
