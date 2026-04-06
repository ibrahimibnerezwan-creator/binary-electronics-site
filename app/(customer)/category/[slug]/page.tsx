import { Metadata } from 'next'
import { ProductCard } from '@/components/home/featured-products'
import { Button } from '@/components/ui/button'
import { Search, Filter, SlidersHorizontal, Cpu, Network, ShieldCheck, Zap, Activity } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { getCategoryBySlug, getProductsByCategory, getStoreSettings } from '@/lib/data'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const [category, settings] = await Promise.all([
    getCategoryBySlug(params.slug),
    getStoreSettings()
  ])
  
  const storeName = settings.storeName || 'Binary Electronics'
  if (!category) return { title: `Category Not Found | ${storeName}` }
  
  return {
    title: `${category.name} | ${storeName}`,
    description: `Browse the latest ${category.name} from ${storeName}.`,
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategoryBySlug(params.slug)
  if (!category) notFound()

  const products = await getProductsByCategory(category.id)
  const categoryName = category.name

  return (
    <div className="pt-32 pb-24 font-mono">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="relative mb-20 animate-reveal-up">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-3 px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-500 text-[10px] font-bold uppercase tracking-[0.4em]">
                <Activity size={14} className="animate-pulse" /> CLASS: {category.slug.toUpperCase()}
              </div>
              <h1 className="text-6xl md:text-8xl font-display font-black leading-tight uppercase tracking-tighter text-white">
                {categoryName.split(' ')[0]} <br />
                <span className="text-gradient">{categoryName.split(' ').slice(1).join(' ') || 'MODE'}</span>
              </h1>
            </div>
            <div className="flex flex-col gap-4 items-end text-right max-w-sm">
              <div className="p-4 bg-white/5 border border-white/10 rounded-none flex flex-col gap-1 w-full">
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted/60">SECTOR_LOADED</p>
                <p className="text-sm text-text-secondary leading-relaxed uppercase tracking-wider">
                  Accessing <span className="text-primary-500 font-bold">{products.length}</span> units within the <span className="text-white">{categoryName}</span> subsystem.
                </p>
              </div>
            </div>
          </div>
          {/* Scanning Line */}
          <div className="absolute -bottom-6 left-0 w-full h-[1px] bg-primary-500/20">
            <div className="w-1/3 h-full bg-primary-500 animate-scan" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Filters */}
          <aside className="hidden lg:flex flex-col gap-10 lg:sticky lg:top-32 animate-reveal-up">
            {/* Search Node */}
            <div className="border border-primary-500/10 bg-black/40 p-6 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary-500/40" />
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-primary-500 mb-6 flex items-center gap-3">
                <Search size={14} /> _QUERY_INIT
              </h3>
              <Input 
                placeholder="IDENT_STRING..." 
                className="h-12 bg-white/5 border-primary-500/10 focus:border-primary-500/50 rounded-none text-xs uppercase tracking-widest text-white placeholder:text-text-muted/20"
              />
            </div>

            {/* Availability Node */}
            <div className="border border-primary-500/10 bg-black/40 p-6 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-accent-500/40" />
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-accent-500 mb-6 flex items-center gap-3">
                <Filter size={14} /> _STATUS_SYNC
              </h3>
              <div className="flex flex-col gap-4">
                {['In Stock', 'On Sale', 'New Arrivals'].map((label) => (
                  <label key={label} className="flex items-center gap-4 cursor-pointer group/label">
                    <div className="w-5 h-5 border border-white/10 group-hover/label:border-primary-500/50 transition-all flex items-center justify-center relative">
                      <div className="w-2 h-2 bg-primary-500 opacity-0 group-hover/label:opacity-20 transition-all" />
                    </div>
                    <span className="text-[10px] font-bold text-text-muted group-hover/label:text-white transition-all uppercase tracking-widest">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Back to Catalog */}
            <Link href="/products" className="group flex items-center justify-between p-4 border border-white/5 hover:border-primary-500/20 transition-all bg-white/[0.02]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted group-hover:text-primary-500 transition-colors">Return to Root</span>
              <Network size={14} className="text-text-muted group-hover:text-primary-500 transition-colors" />
            </Link>

            {/* Status Node */}
            <div className="p-6 border border-white/5 flex flex-col gap-4 text-[9px] font-bold tracking-[0.3em] text-text-muted/40 uppercase">
              <div className="flex justify-between items-center">
                <span>ENCRYPT_LVL:</span>
                <span className="text-primary-500 animate-pulse">AES-256</span>
              </div>
              <div className="flex justify-between items-center">
                <span>BUFFER:</span>
                <span>OPTIMIZED</span>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {/* Mobile Controls */}
            <div className="flex lg:hidden gap-4 mb-12">
              <Button className="flex-grow bg-white/5 border border-primary-500/10 rounded-none h-14 gap-4 text-xs font-bold tracking-[0.3em] uppercase">
                <Search size={18} className="text-primary-500" /> QUERY
              </Button>
              <Button className="flex-grow bg-white/5 border border-accent-500/10 rounded-none h-14 gap-4 text-xs font-bold tracking-[0.3em] uppercase text-accent-500">
                <SlidersHorizontal size={18} /> FILTER
              </Button>
            </div>

            {products.length === 0 ? (
              <div className="py-32 text-center border border-dashed border-primary-500/20 bg-primary-500/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
                <div className="relative z-10 flex flex-col items-center gap-6">
                  <Cpu size={48} className="text-primary-500/20 animate-pulse" />
                  <p className="text-text-muted font-bold uppercase tracking-[0.5em] text-sm">NO_ASSETS_FOUND_IN_SECTOR</p>
                  <Button variant="outline" className="rounded-none border-primary-500/20 text-xs uppercase tracking-widest px-8">REFRESH_NODE</Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {products.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            )}
            
            {/* System Summary Footer */}
            <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-bold tracking-[0.5em] text-primary-500/20 uppercase">
              <div className="flex items-center gap-4">
                <ShieldCheck size={14} className="text-primary-500/40" /> 
                INTEGRITY_CHECK_PASSED
              </div>
              <div className="flex gap-8">
                <span>REGION: BD-EAST-1</span>
                <span>STATUS: OPERATIONAL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
