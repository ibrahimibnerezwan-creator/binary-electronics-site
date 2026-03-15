'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Info, Image as ImageIcon, Tag, BarChart2, Save, X, ChevronLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { createProduct } from './actions'

interface ProductFormProps {
  categories: { id: string, name: string }[]
  brands: { id: string, name: string }[]
}

export function ProductForm({ categories, brands }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<string[]>([])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const formData = new FormData()
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i])
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.success) {
        setImages(prev => [...prev, ...data.files.map((f: any) => f.url)])
      } else {
        alert(data.error || 'Upload failed')
      }
    } catch (err) {
      alert('Failed to connect to upload server')
    } finally {
      setUploading(false)
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.append('images', JSON.stringify(images))

    try {
      const res = await createProduct(formData)
      if (res.success) {
        alert('Listing has been published.')
        router.push('/admin/products')
      } else {
        alert(res.error || 'Failed to create product')
      }
    } catch (err) {
      alert('Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-5xl mx-auto flex flex-col gap-8 pb-20">
      <div className="flex flex-col gap-6">
        <Link href="/admin/products" className="flex items-center gap-2 text-primary-500 font-bold text-xs uppercase tracking-widest hover:underline">
          <ChevronLeft size={16} /> Back to Products
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-display font-black uppercase tracking-tight">ADD NEW <span className="text-gradient">PRODUCT</span></h1>
            <p className="text-text-secondary">Fill in the details to list a new item on Binary Electronics</p>
          </div>
          <div className="flex gap-4">
             <Button type="button" variant="secondary" onClick={() => router.back()} className="h-14 px-8 rounded-2xl glass border-primary-500/10">Discard</Button>
             <Button disabled={loading || uploading} className="h-14 px-10 rounded-2xl shadow-xl shadow-primary-500/20 gap-2">
               {loading ? <Loader2 className="animate-spin" size={20}/> : <Save size={20} />} 
               Publish Product
             </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <Card className="p-8 flex flex-col gap-8 bg-bg-elevated/30 border-primary-500/5">
             <div className="flex items-center gap-3 border-b border-primary-500/10 pb-6">
               <div className="p-2 rounded-lg glass text-primary-500"><Info size={20}/></div>
               <h3 className="font-display font-black uppercase tracking-widest text-sm">General Information</h3>
             </div>

             <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-col gap-3">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Product Name</label>
                   <Input name="name" required placeholder="e.g. MacBook Pro M3 Max" className="h-14 bg-bg-void/40 border-primary-500/10" />
                </div>

                <div className="flex flex-col gap-3">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Description</label>
                   <textarea 
                     name="description"
                     required
                     rows={8}
                     placeholder="Write a detailed product description..."
                     className="w-full rounded-2xl border border-primary-500/10 bg-bg-void/40 p-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all resize-none"
                   ></textarea>
                </div>
             </div>
          </Card>

          <Card className="p-8 flex flex-col gap-8 bg-bg-elevated/30 border-primary-500/5">
             <div className="flex items-center gap-3 border-b border-primary-500/10 pb-6">
               <div className="p-2 rounded-lg glass text-accent-500"><ImageIcon size={20}/></div>
               <h3 className="font-display font-black uppercase tracking-widest text-sm">Product Images</h3>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl glass border border-primary-500/10 overflow-hidden">
                    <img src={url} alt="Product" className="w-full h-full object-cover" />
                    <button 
                      type="button"
                      onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white shadow-lg shadow-red-500/20"
                    >
                      <X size={12}/>
                    </button>
                  </div>
                ))}
                
                <label className="aspect-square rounded-2xl glass border-2 border-dashed border-primary-500/20 flex flex-col items-center justify-center gap-2 text-text-muted hover:text-primary-500 hover:border-primary-500/40 transition-all cursor-pointer">
                   {uploading ? <Loader2 className="animate-spin" size={32}/> : <Plus size={32} />}
                   <span className="text-[10px] font-bold uppercase">{uploading ? 'Uploading...' : 'Upload'}</span>
                   <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
             </div>
             <p className="text-[10px] text-text-muted uppercase tracking-widest text-center">Recommended size: 1000x1000px. Max 5 images.</p>
          </Card>

          <Card className="p-8 flex flex-col gap-8 bg-bg-elevated/30 border-primary-500/5">
             <div className="flex items-center gap-3 border-b border-primary-500/10 pb-6">
               <div className="p-2 rounded-lg glass text-primary-500"><BarChart2 size={20}/></div>
               <h3 className="font-display font-black uppercase tracking-widest text-sm">Inventory & Pricing</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Regular Price (৳)</label>
                   <Input name="price" type="number" step="0.01" required placeholder="0.00" className="h-14 bg-bg-void/40 border-primary-500/10" />
                </div>
                <div className="flex flex-col gap-3">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Sale Price (৳)</label>
                   <Input name="comparePrice" type="number" step="0.01" placeholder="0.00" className="h-14 bg-bg-void/40 border-primary-500/10" />
                </div>
                <div className="flex flex-col gap-3">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">SKU Code</label>
                   <Input name="sku" placeholder="IPH-15-TIT" className="h-14 bg-bg-void/40 border-primary-500/10" />
                </div>
                <div className="flex flex-col gap-3">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Stock Quantity</label>
                   <Input name="stock" type="number" required placeholder="0" className="h-14 bg-bg-void/40 border-primary-500/10" />
                </div>
             </div>
          </Card>
        </div>

        <div className="flex flex-col gap-8">
           <Card className="p-8 flex flex-col gap-8 bg-bg-elevated/30 border-primary-500/5">
              <div className="flex items-center gap-3 border-b border-primary-500/10 pb-6">
                <div className="p-2 rounded-lg glass text-gold-500"><Tag size={20}/></div>
                <h3 className="font-display font-black uppercase tracking-widest text-sm">Organization</h3>
              </div>

              <div className="flex flex-col gap-6">
                 <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Category</label>
                    <select name="categoryId" className="h-14 bg-bg-void/40 border border-primary-500/10 rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary-500">
                       <option>Select Category</option>
                       {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                 </div>
                 <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Brand</label>
                    <select name="brandId" className="h-14 bg-bg-void/40 border border-primary-500/10 rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary-500">
                       <option>Select Brand</option>
                       {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                 </div>
              </div>
           </Card>

           <Card className="p-8 flex flex-col gap-8 bg-bg-elevated/30 border-primary-500/5">
              <div className="flex items-center gap-3 border-b border-primary-500/10 pb-6">
                <div className="p-2 rounded-lg glass text-primary-500"><Save size={20}/></div>
                <h3 className="font-display font-black uppercase tracking-widest text-sm">Status</h3>
              </div>

              <div className="flex flex-col gap-4">
                 <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Featured Product</label>
                    <select name="isFeatured" className="h-14 bg-bg-void/40 border border-primary-500/10 rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary-500">
                       <option value="false">No</option>
                       <option value="true">Yes (Show on Homepage)</option>
                    </select>
                 </div>
              </div>
           </Card>
        </div>
      </div>
    </form>
  )
}
