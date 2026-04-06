import { Metadata } from 'next'
import { FeaturedProducts } from '@/components/home/featured-products'
import { Button } from '@/components/ui/button'
import { Sliders } from 'lucide-react' // Mock icon for filter toggle
import { cn } from '@/lib/utils'

import { getCategoryBySlug, getProductsByCategory } from '@/lib/data'
import { notFound } from 'next/navigation'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug)
  if (!category) return { title: 'Category Not Found | Binary Electronics' }
  
  return {
    title: `${category.name} | Binary Electronics`,
    description: `Browse the latest ${category.name} from Binary Electronics.`,
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategoryBySlug(params.slug)
  if (!category) notFound()

  const products = await getProductsByCategory(category.id)
  const categoryName = category.name

  return (
    <div className="flex flex-col">
      <div className="container mx-auto px-4 pt-32 pb-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 border-b border-primary-500/10 pb-12">
          <div className="flex flex-col gap-4">
             <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-primary-500">Browsing Category</span>
             <h1 className="text-6xl font-display font-black uppercase tracking-tight">{categoryName}</h1>
          </div>
          <p className="text-text-muted text-sm max-w-sm text-right">
            Showing {products.length} superior items in {categoryName}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
           {/* Sidebar Filters - Desktop */}
           <aside className="hidden lg:flex flex-col gap-10 lg:sticky lg:top-24">
             <div>
               <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                 <span className="w-4 h-1 bg-primary-500 rounded-full" /> Filters
               </h3>
               <div className="flex flex-col gap-4">
                  <div className="space-y-4">
                    <span className="text-sm font-bold">Price Range</span>
                    <div className="h-1 w-full bg-primary-500/10 rounded-full relative">
                       <div className="absolute left-0 right-1/4 h-full bg-primary-500 rounded-full" />
                    </div>
                    <div className="flex justify-between text-xs font-bold text-text-muted">
                      <span>৳ 0</span>
                      <span>৳ 500,000+</span>
                    </div>
                  </div>
               </div>
             </div>

             <div>
               <h3 className="text-sm font-bold mb-4">Availability</h3>
               <div className="flex flex-col gap-3">
                  {['In Stock', 'On Sale', 'New Arrivals'].map((label) => (
                    <label key={label} className="flex items-center gap-3 cursor-pointer group">
                       <div className="w-5 h-5 rounded border border-primary-500/20 group-hover:border-primary-500 flex items-center justify-center transition-all">
                          <div className="w-2.5 h-2.5 bg-primary-500 rounded-sm opacity-0 group-hover:opacity-20" />
                       </div>
                       <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">{label}</span>
                    </label>
                  ))}
               </div>
             </div>

             <Button variant="outline" className="w-full">Reset All</Button>
           </aside>

           {/* Product Grid */}
           <div className="lg:col-span-3">
             <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 bg-bg-elevated/30 p-4 rounded-2xl border border-primary-500/5">
                <div className="flex items-center gap-4">
                   <Button variant="secondary" size="sm" className="lg:hidden">Filters</Button>
                   <span className="text-sm text-text-muted">Sort by: <span className="text-text-primary font-bold ml-1">Newest Arrivals</span></span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded bg-primary-500 flex items-center justify-center text-white cursor-pointer"><Grid size={16}/></div>
                   <div className="w-8 h-8 rounded glass flex items-center justify-center text-text-muted hover:text-primary-500 cursor-pointer"><List size={16}/></div>
                </div>
             </div>
             
             <FeaturedProducts products={products as any} noLayout />
           </div>
        </div>
      </div>

    </div>
  )
}

function Grid({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
}

function List({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
}
