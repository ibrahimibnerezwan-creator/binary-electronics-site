import { getAllProducts, getAllCategories, getStoreSettings } from '@/lib/data'
import { ProductCard } from '@/components/home/featured-products'
import { Card } from '@/components/ui/card'
import { Search, Filter, SlidersHorizontal, Cpu, Network, ShieldCheck, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
    const [products, categories, settings] = await Promise.all([
        getAllProducts(),
        getAllCategories(),
        getStoreSettings()
    ])

    return (
        <div className="pt-24 md:pt-32 pb-16 md:pb-24 font-mono">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="relative mb-12 md:mb-20 animate-reveal-up">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:gap-10">
                        <div className="flex flex-col gap-4 md:gap-6 w-full">
                            <div className="inline-flex items-center gap-3 px-3 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-500 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] w-fit">
                                <Network size={12} className="animate-pulse" /> TARGET: CATALOG_DATA_CORE
                            </div>
                            <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-black leading-none uppercase tracking-tighter text-white">
                                ALL <br />
                                <span className="text-gradient">PRODUCTS</span>
                            </h1>
                        </div>
                        <div className="flex flex-col gap-4 items-start md:items-end text-left md:text-right w-full md:max-w-sm">
                            <div className="p-4 bg-white/5 border border-white/10 rounded-none flex flex-col gap-1 w-full backdrop-blur-sm">
                                <p className="text-[9px] font-bold uppercase tracking-widest text-text-muted/60">NODE_SUMMARY</p>
                                <p className="text-xs md:text-sm text-text-secondary leading-relaxed uppercase tracking-wider">
                                    Displaying <span className="text-primary-500 font-bold">{products.length}</span> unique identifiers within the production mainframe.
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Scanning Line */}
                    <div className="absolute -bottom-6 left-0 w-full h-[1px] bg-primary-500/20">
                        <div className="w-1/2 md:w-1/3 h-full bg-primary-500 animate-scan" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Filters Sidebar */}
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

                        {/* Category Node */}
                        <div className="border border-primary-500/10 bg-black/40 p-6 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-accent-500/40" />
                            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-accent-500 mb-6 flex items-center gap-3">
                                <Filter size={14} /> _CLASS_FILTER
                            </h3>
                            <div className="flex flex-col gap-4">
                                <Link href="/products" className="text-sm font-black text-white hover:text-primary-500 transition-all flex items-center gap-3 group/link">
                                    <Zap size={14} className="text-primary-500 opacity-50 group-hover/link:opacity-100" /> ALL_UNITS
                                </Link>
                                {categories.map(cat => (
                                    <Link 
                                        key={cat.id} 
                                        href={`/category/${cat.slug}`}
                                        className="text-xs font-bold text-text-muted hover:text-white transition-all uppercase tracking-widest pl-6 border-l border-white/5 hover:border-primary-500/40"
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Status Node */}
                        <div className="p-6 border border-white/5 flex flex-col gap-4 text-[9px] font-bold tracking-[0.3em] text-text-muted/40 uppercase">
                            <div className="flex justify-between items-center">
                                <span>LINK_STATUS:</span>
                                <span className="text-primary-500 animate-pulse">ENCRYPTED</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>DB_REF:</span>
                                <span>LIVE_DATA</span>
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
                                    <p className="text-text-muted font-bold uppercase tracking-[0.5em] text-sm">ZERO_RECORDS_MATCHED</p>
                                    <Button variant="outline" className="rounded-none border-primary-500/20 text-xs uppercase tracking-widest px-8">REBOOT_FILTERS</Button>
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
                                VERIFIED_SECURE_PAYLOAD
                            </div>
                            <div className="flex gap-8">
                                <span>LATENCY: 42MS</span>
                                <span>THROUGHPUT: UNLIMITED</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
