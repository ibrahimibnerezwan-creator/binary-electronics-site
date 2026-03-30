import { getAllProducts, getAllCategories } from '@/lib/data'
import { ProductCard } from '@/components/home/featured-products'
import { Card } from '@/components/ui/card'
import { Search, Filter, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
    const [products, categories] = await Promise.all([
        getAllProducts(),
        getAllCategories()
    ])

    return (
        <div className="py-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col gap-4 mb-12">
                    <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-white">
                        ALL <span className="text-gradient">PRODUCTS</span>
                    </h1>
                    <p className="text-text-secondary max-w-2xl">
                        Explore our full catalog of premium electronic components and devices.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <aside className="hidden lg:flex flex-col gap-8">
                        <Card className="p-6 glass border-primary-500/10">
                            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-primary-500/10">
                                <Search size={18} className="text-primary-500" />
                                <h3 className="font-display font-black uppercase tracking-widest text-sm">Search</h3>
                            </div>
                            <div className="relative">
                                <Input 
                                    placeholder="Find a product..." 
                                    className="bg-bg-void/40 border-primary-500/10 focus:border-primary-500 h-12"
                                />
                            </div>
                        </Card>

                        <Card className="p-6 glass border-primary-500/10">
                            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-primary-500/10">
                                <Filter size={18} className="text-accent-500" />
                                <h3 className="font-display font-black uppercase tracking-widest text-sm">Categories</h3>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Link href="/products" className="text-sm font-bold text-primary-500">All Products</Link>
                                {categories.map(cat => (
                                    <Link 
                                        key={cat.id} 
                                        href={`/category/${cat.slug}`}
                                        className="text-sm font-medium text-text-muted hover:text-white transition-colors"
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </Card>
                    </aside>

                    {/* Product Grid */}
                    <div className="lg:col-span-3">
                        {/* Mobile Controls */}
                        <div className="flex lg:hidden gap-4 mb-8">
                            <Button className="flex-grow glass border-primary-500/10 h-12 gap-2">
                                <Search size={18} /> Search
                            </Button>
                            <Button className="flex-grow glass border-accent-500/10 h-12 gap-2 text-accent-500">
                                <SlidersHorizontal size={18} /> Filter
                            </Button>
                        </div>

                        {products.length === 0 ? (
                            <div className="py-20 text-center glass border-dashed border-primary-500/20 rounded-3xl">
                                <p className="text-text-muted font-bold uppercase tracking-widest">No products found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {products.map((product, index) => (
                                    <ProductCard key={product.id} product={product} index={index} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
