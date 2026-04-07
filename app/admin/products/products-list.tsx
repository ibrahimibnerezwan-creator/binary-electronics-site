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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
        <div className="flex flex-col gap-1 lg:gap-2">
          <h1 className="text-3xl lg:text-4xl font-display font-black uppercase tracking-tight">PRODUCTS</h1>
          <p className="text-xs lg:text-sm text-text-secondary">Manage your inventory and listings</p>
        </div>
        <Link href="/admin/products/new" className="w-full md:w-auto">
          <Button className="w-full md:w-auto gap-2 h-12 lg:h-14 px-8 rounded-xl lg:rounded-2xl shadow-xl shadow-primary-500/20 text-sm">
            <Plus size={20} /> Add Product
          </Button>
        </Link>
      </div>

      <Card className="p-3 lg:p-4 flex flex-col lg:flex-row gap-3 lg:gap-4 items-center bg-bg-elevated/30 border-primary-500/5">
         <div className="relative flex-grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
            <Input 
              placeholder="Search products..." 
              className="pl-12 h-11 lg:h-12 bg-bg-void/40 border-primary-500/10 focus:border-primary-500 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
         </div>
         <div className="flex gap-2 lg:gap-4 w-full lg:w-auto">
            <Button variant="secondary" className="flex-1 lg:flex-none gap-2 h-11 lg:h-12 rounded-xl border border-primary-500/10 text-xs">
              <Filter size={16} /> Filters
            </Button>
            <select className="flex-1 lg:flex-none h-11 lg:h-12 bg-bg-void/40 border border-primary-500/10 rounded-xl px-3 text-xs font-bold focus:outline-none focus:border-primary-500 cursor-pointer">
               <option>Newest First</option>
               <option>Price: Low-High</option>
               <option>Price: High-Low</option>
               <option>Low Stock</option>
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
                    <div className="flex items-center justify-end gap-1 lg:gap-2">
                       <Link href={`/product/${product.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 text-text-muted hover:text-primary-500 transition-all" title="View Store Page">
                         <ExternalLink size={16} />
                       </Link>
                       {/* Note: Edit functionality will be implemented in future tasks */}
                       <Button size="icon" variant="ghost" className="h-8 w-8 text-text-muted hover:text-primary-500 hover:bg-primary-500/10" disabled>
                         <Edit size={14} />
                       </Button>
                       <Button 
                         type="button" 
                         size="icon" 
                         variant="ghost" 
                         className="h-8 w-8 text-text-muted hover:text-red-500 hover:bg-red-500/10"
                         onClick={async () => {
                           if (confirm('Are you sure you want to delete this product?')) {
                              await deleteProduct(product.id)
                           }
                         }}
                       >
                         <Trash2 size={14} />
                       </Button>
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
