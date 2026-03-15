import { Hero } from '@/components/layout/hero'
import { Footer } from '@/components/layout/footer'
import { CategoryGrid } from '@/components/home/category-grid'
import { FeaturedProducts } from '@/components/home/featured-products'
import { WhatsAppCTA } from '@/components/layout/whatsapp-cta'
import { getNewArrivals } from '@/lib/data'

export const revalidate = 60;

export default async function Home() {
  const products = await getNewArrivals(8);
  
  // Mock data if DB is empty
  const mockProducts = [
    { id: '1', name: 'MacBook Pro M3 Max', price: 345000, oldPrice: 380000, image: 'https://images.unsplash.com/photo-1517336715481-4d9e50ef50c2?q=80&w=400', slug: 'macbook-pro-m3', rating: 5, reviews: 124, isNew: true },
    { id: '2', name: 'iPhone 15 Pro Titanium', price: 165000, oldPrice: 175000, image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba3f21?q=80&w=400', slug: 'iphone-15-pro', rating: 4, reviews: 86 },
    { id: '3', name: 'Sony WH-1000XM5', price: 38000, oldPrice: 42000, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400', slug: 'sony-wh1000xm5', rating: 5, reviews: 342 },
    { id: '4', name: 'ROG Zephyrus G14', price: 210000, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=400', slug: 'rog-zephyrus-g14', rating: 4, reviews: 54, isNew: true },
    { id: '5', name: 'Logitech G Pro X Superlight', price: 12500, image: 'https://images.unsplash.com/photo-1527814050087-379371546a30?q=80&w=400', slug: 'g-pro-x-superlight', rating: 5, reviews: 215 },
    { id: '6', name: 'Samsung Odyssey Neo G9', price: 185000, oldPrice: 205000, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=400', slug: 'odyssey-neo-g9', rating: 4, reviews: 32 },
    { id: '7', name: 'Keychron Q1 Pro', price: 18500, image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=400', slug: 'keychron-q1-pro', rating: 5, reviews: 89, isNew: true },
    { id: '8', name: 'DJI Mavic 3 Pro', price: 245000, oldPrice: 265000, image: 'https://images.unsplash.com/photo-1473968512647-3e44a224fe8f?q=80&w=400', slug: 'dji-mavic-3-pro', rating: 5, reviews: 12 },
  ]

  const displayProducts = products.length > 0 ? products : (mockProducts as any);

  return (
    <div className="flex flex-col">
      <Hero />
      
      <CategoryGrid />

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

      <FeaturedProducts products={displayProducts} />

      {/* Newsletter Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="glass-card p-12 lg:p-20 flex flex-col items-center text-center gap-8 relative overflow-hidden">
           <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/10 rounded-full blur-[100px]" />
           <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-accent-500/10 rounded-full blur-[100px]" />
           
           <h2 className="text-4xl lg:text-6xl font-display font-black leading-tight">JOIN THE <br/><span className="text-gradient">BINARY REVOLUTION</span></h2>
           <p className="text-text-secondary max-w-xl">Subscribe to get early access to flash sales, exclusive discounts, and the latest tech reviews.</p>
           
           <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
             <input 
               type="email" 
               placeholder="Enter your email" 
               className="flex-grow h-14 rounded-full bg-bg-primary border border-primary-500/20 px-8 text-sm focus:outline-none focus:border-primary-500 transition-all"
             />
             <button className="h-14 px-8 rounded-full bg-primary-500 text-white font-bold hover:bg-primary-600 transition-all">Subscribe</button>
           </div>
        </div>
      </section>

      <Footer />
      <WhatsAppCTA />
    </div>
  )
}
