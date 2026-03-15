'use client'

import { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, cn } from '@/lib/utils'
import { deleteProduct } from '@/app/admin/actions'

interface AdminProductsListProps {
  products: any[]
}

export function AdminProductsList({ products }: AdminProductsListProps) {
  const [search, setSearch] = useState('')

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.sku?.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-display font-black uppercase tracking-tight">PRODUCTS</h1>
          <p className="text-text-secondary">Manage your inventory and product listings</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="gap-2 h-14 px-8 rounded-2xl shadow-xl shadow-primary-500/20">
            <Plus size={20} /> Add New Product
          </Button>
        </Link>
      </div>

      <Card className="p-4 flex flex-col md:flex-row gap-4 items-center bg-bg-elevated/30 border-primary-500/5">
         <div className="relative flex-grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <Input 
              placeholder="Search products, SKU, or categories..." 
              className="pl-12 h-12 bg-bg-void/40 border-primary-500/10 focus:border-primary-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <div className="flex gap-4 w-full md:w-auto">
            <Button variant="secondary" className="gap-2 h-12 rounded-xl border border-primary-500/10">
              <Filter size={18} /> Filters
            </Button>
            <div className="flex-grow md:hidden" />
            <select className="h-12 bg-bg-void/40 border border-primary-500/10 rounded-xl px-4 text-sm font-bold focus:outline-none focus:border-primary-500">
               <option>Sort by: Newest</option>
               <option>Price: Low to High</option>
               <option>Price: High to Low</option>
               <option>Stock: Low to High</option>
            </select>
         </div>
      </Card>

      <Card className="overflow-hidden border-primary-500/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-bg-elevated/50 border-b border-primary-500/10">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Product</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">SKU</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Price</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Stock</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-500/5">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-primary-500/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                       <div className="relative w-12 h-12 rounded-lg glass border border-primary-500/10 overflow-hidden flex-shrink-0 p-1">
                         <Image src={product.image} alt={product.name} fill className="object-contain" />
                       </div>
                       <div className="flex flex-col">
                          <span className="font-bold text-sm tracking-tight group-hover:text-primary-500 transition-colors uppercase">{product.name}</span>
                          <span className="text-[10px] text-text-muted uppercase font-bold tracking-widest">ID: #{product.id.slice(0,8)}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-text-secondary">{product.sku}</td>
                  <td className="px-6 py-4">
                    <Badge variant="secondary" className="bg-primary-500/5 text-primary-500 border-none rounded-md px-2 py-0.5 text-[10px] uppercase font-bold">
                      {product.category}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-black text-sm">{formatPrice(product.price)}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold">{product.stock}</span>
                      <div className="w-20 h-1 bg-primary-500/10 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all",
                            product.stock > 10 ? "bg-green-500" : product.stock > 0 ? "bg-orange-500" : "bg-red-500"
                          )}
                          style={{ width: `${Math.min(product.stock, 20) * 5}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {product.status === 'active' && <Badge className="bg-green-500/10 text-green-500 border-green-500/20 gap-1"><CheckCircle2 size={12}/> Active</Badge>}
                    {product.status === 'low_stock' && <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 gap-1"><Clock size={12}/> Low Stock</Badge>}
                    {product.status === 'out_of_stock' && <Badge className="bg-red-500/10 text-red-500 border-red-500/20 gap-1"><XCircle size={12}/> Out of Stock</Badge>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Link href={`/product/${product.slug}`} target="_blank" className="p-2 text-text-muted hover:text-primary-500 hover:glass rounded-lg transition-all" title="View Store Page">
                         <ExternalLink size={18} />
                       </Link>
                       <Link href={`/admin/products`}>
                          <Button size="icon" variant="ghost" className="h-9 w-9 text-text-muted hover:text-primary-500 hover:bg-primary-500/10">
                            <Edit size={16} />
                          </Button>
                       </Link>
                       <form action={async () => {
                         await deleteProduct(product.id)
                       }}>
                         <Button type="submit" size="icon" variant="ghost" className="h-9 w-9 text-text-muted hover:text-red-500 hover:bg-red-500/10">
                           <Trash2 size={16} />
                         </Button>
                       </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
