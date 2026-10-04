import { getAllProducts, getAllCategories } from '@/lib/data'
import { ProductCard } from '@/components/home/featured-products'
import Link from 'next/link'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'Products', alternates: { canonical: '/products' } }
export default async function ProductsPage({ searchParams }: { searchParams: Promise<Record<string,string|string[]|undefined>> }) {
  const params = await searchParams
  const q = typeof params.q === 'string' ? params.q.trim().slice(0,200) : ''
  const category = typeof params.category === 'string' ? params.category : ''
  const sort = typeof params.sort === 'string' ? params.sort : 'newest'
  const inStock = params.stock === '1'
  const [all, categories] = await Promise.all([getAllProducts(),getAllCategories()])
  const chosen = categories.find(c => c.slug === category)
  const products = all.filter(p => (!q || `${p.name} ${p.category}`.toLowerCase().includes(q.toLowerCase())) &&
    (!category || !!chosen && p.category === chosen.name) && (!inStock || p.stock > 0))
  if (sort === 'price-asc') products.sort((a,b) => a.price-b.price)
  if (sort === 'price-desc') products.sort((a,b) => b.price-a.price)
  if (sort === 'name') products.sort((a,b) => a.name.localeCompare(b.name))
  return <section className="container mx-auto px-4 pt-28 md:pt-36 pb-20">
    <h1 className="font-display font-black text-4xl md:text-7xl uppercase mb-6">All <span className="text-gradient">Products</span></h1>
    <p className="text-text-secondary mb-8">{products.length} products{q ? ` matching “${q}”` : ''}</p>
    <form action="/products" method="get" className="glass p-5 border border-primary-500/20 grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
      <label className="space-y-2 text-sm">Search products<input name="q" defaultValue={q} type="search" placeholder="Search by name or category" className="w-full bg-black border border-primary-500/30 p-3 rounded" /></label>
      <label className="space-y-2 text-sm">Category<select name="category" defaultValue={category} className="w-full bg-black border border-primary-500/30 p-3 rounded"><option value="">All categories</option>{categories.map(c=><option key={c.id} value={c.slug}>{c.name}</option>)}</select></label>
      <label className="space-y-2 text-sm">Sort by<select name="sort" defaultValue={sort} className="w-full bg-black border border-primary-500/30 p-3 rounded"><option value="newest">Newest first</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name</option></select></label>
      <label className="flex items-center gap-2"><input type="checkbox" name="stock" value="1" defaultChecked={inStock} />In stock only</label>
      <div className="flex items-center gap-4"><button type="submit" className="p-3 bg-primary-500 text-black rounded font-bold">Apply filters</button><Link className="underline" href="/products">Reset</Link></div>
    </form>
    {products.length ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">{products.map((product,index)=><ProductCard key={product.id} product={product} index={index} />)}</div> : <div className="glass p-12 text-center"><p>No products match your search.</p><Link href="/products" className="underline text-primary-500">Clear filters</Link></div>}
  </section>
}
