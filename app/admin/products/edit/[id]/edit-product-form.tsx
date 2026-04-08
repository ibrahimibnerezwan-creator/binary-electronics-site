'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Info, Image as ImageIcon, Tag, BarChart2, Save, X, ChevronLeft, Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { updateProduct } from './actions'

interface EditProductFormProps {
  product: {
    id: string
    name: string
    slug: string
    description: string
    price: number
    comparePrice: number | null
    stock: number
    categoryId: string | null
    brandId: string | null
    sku: string | null
    isFeatured: boolean
    images: string[]
  }
  categories: { id: string; name: string }[]
  brands: { id: string; name: string }[]
}

export function EditProductForm({ product, categories, brands }: EditProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState<string[]>(product.images)

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
        body: formData,
      })
      if (res.status === 401) {
        alert('Session expired. Please log in again.')
        window.location.href = '/admin/login'
        return
      }
      const data = await res.json()
      if (data.success) {
        setImages(prev => [...prev, ...data.files.map((f: any) => f.url)])
      } else {
        alert(data.error || 'Upload failed')
      }
    } catch {
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.append('images', JSON.stringify(images))
    formData.append('slug', product.slug)

    try {
      const res = await updateProduct(product.id, formData)
      if (res.success) {
        alert('Product updated successfully.')
        router.push('/admin/products')
        router.refresh()
      } else {
        alert(res.error || 'Failed to update product')
      }
    } catch {
      alert('Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-5xl mx-auto flex flex-col gap-6 lg:gap-8 pb-20">
      <div className="flex flex-col gap-6">
        <Link href="/admin/products" className="flex items-center gap-2 text-primary-500 font-bold text-[10px] lg:text-xs uppercase tracking-widest hover:underline px-1">
          <ChevronLeft size={14} className="lg:hidden" />
          <ChevronLeft size={16} className="hidden lg:block" /> Back to Products
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-1">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl lg:text-4xl font-display font-black uppercase tracking-tight">EDIT <span className="text-gradient">PRODUCT</span></h1>
            <p className="text-xs lg:text-sm text-text-secondary">Update product details and inventory</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <Button type="button" variant="secondary" onClick={() => router.back()} className="flex-1 md:flex-none h-12 lg:h-14 px-6 lg:px-8 rounded-xl lg:rounded-2xl glass border-primary-500/10 text-xs lg:text-sm">Discard</Button>
            <Button disabled={loading || uploading} className="flex-[2] md:flex-none h-12 lg:h-14 px-8 lg:px-10 rounded-xl lg:rounded-2xl shadow-xl shadow-primary-500/20 gap-2 text-xs lg:text-sm">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <Card className="p-5 lg:p-8 flex flex-col gap-6 lg:gap-8 bg-bg-elevated/30 border-primary-500/5">
            <div className="flex items-center gap-3 border-b border-primary-500/10 pb-5 lg:pb-6">
              <div className="p-2 rounded-lg glass text-primary-500"><Info size={18} className="lg:hidden" /><Info size={20} className="hidden lg:block" /></div>
              <h3 className="font-display font-black uppercase tracking-widest text-xs lg:text-sm">General Information</h3>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col gap-3">
                <label className="text-[8px] lg:text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Product Name</label>
                <Input name="name" required defaultValue={product.name} className="h-12 lg:h-14 bg-bg-void/40 border-primary-500/10 text-sm" />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[8px] lg:text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Description</label>
                <textarea
                  name="description"
                  required
                  rows={6}
                  defaultValue={product.description}
                  className="w-full rounded-xl lg:rounded-2xl border border-primary-500/10 bg-bg-void/40 p-4 lg:p-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500/50 transition-all resize-none"
                ></textarea>
              </div>
            </div>
          </Card>

          <Card className="p-5 lg:p-8 flex flex-col gap-6 lg:gap-8 bg-bg-elevated/30 border-primary-500/5">
            <div className="flex items-center gap-3 border-b border-primary-500/10 pb-5 lg:pb-6">
              <div className="p-2 rounded-lg glass text-accent-500"><ImageIcon size={18} className="lg:hidden" /><ImageIcon size={20} className="hidden lg:block" /></div>
              <h3 className="font-display font-black uppercase tracking-widest text-xs lg:text-sm">Product Images</h3>
            </div>

            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-4 gap-4">
              {images.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-xl lg:rounded-2xl glass border border-primary-500/10 overflow-hidden group">
                  <img src={url} alt="Product" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  <button
                    type="button"
                    onClick={() => setImages(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white shadow-lg shadow-red-500/20 active:scale-95 transition-transform"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              {images.length < 5 && (
                <label className="aspect-square rounded-xl lg:rounded-2xl glass border-2 border-dashed border-primary-500/20 flex flex-col items-center justify-center gap-2 text-text-muted hover:text-primary-500 hover:border-primary-500/40 transition-all cursor-pointer active:scale-95">
                  {uploading ? <Loader2 className="animate-spin" size={24} /> : <Plus size={24} />}
                  <span className="text-[8px] lg:text-[10px] font-bold uppercase">{uploading ? 'Uploading...' : 'Upload'}</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>
            <p className="text-[8px] lg:text-[10px] text-text-muted uppercase tracking-widest text-center">Recommended: 1000x1000px. Max 5 images.</p>
          </Card>

          <Card className="p-5 lg:p-8 flex flex-col gap-6 lg:gap-8 bg-bg-elevated/30 border-primary-500/5">
            <div className="flex items-center gap-3 border-b border-primary-500/10 pb-5 lg:pb-6">
              <div className="p-2 rounded-lg glass text-primary-500"><BarChart2 size={18} className="lg:hidden" /><BarChart2 size={20} className="hidden lg:block" /></div>
              <h3 className="font-display font-black uppercase tracking-widest text-xs lg:text-sm">Inventory & Pricing</h3>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-6 lg:gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-[8px] lg:text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Regular Price (&#2547;)</label>
                <Input name="price" type="number" step="0.01" required defaultValue={product.price} className="h-12 lg:h-14 bg-bg-void/40 border-primary-500/10 text-sm" />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[8px] lg:text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Sale Price (&#2547;)</label>
                <Input name="comparePrice" type="number" step="0.01" defaultValue={product.comparePrice ?? ''} className="h-12 lg:h-14 bg-bg-void/40 border-primary-500/10 text-sm" />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[8px] lg:text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">SKU Code</label>
                <Input name="sku" defaultValue={product.sku ?? ''} className="h-12 lg:h-14 bg-bg-void/40 border-primary-500/10 text-sm" />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[8px] lg:text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Stock Quantity</label>
                <Input name="stock" type="number" required defaultValue={product.stock} className="h-12 lg:h-14 bg-bg-void/40 border-primary-500/10 text-sm" />
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-8">
          <Card className="p-5 lg:p-8 flex flex-col gap-6 lg:gap-8 bg-bg-elevated/30 border-primary-500/5">
            <div className="flex items-center gap-3 border-b border-primary-500/10 pb-5 lg:pb-6">
              <div className="p-2 rounded-lg glass text-gold-500"><Tag size={18} className="lg:hidden" /><Tag size={20} className="hidden lg:block" /></div>
              <h3 className="font-display font-black uppercase tracking-widest text-xs lg:text-sm">Organization</h3>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <label className="text-[8px] lg:text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Category</label>
                <select name="categoryId" defaultValue={product.categoryId ?? ''} className="h-12 lg:h-14 bg-bg-void/40 border border-primary-500/10 rounded-xl lg:rounded-2xl px-4 text-xs lg:text-sm font-bold focus:outline-none focus:border-primary-500">
                  <option>Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[8px] lg:text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Brand</label>
                <select name="brandId" defaultValue={product.brandId ?? ''} className="h-12 lg:h-14 bg-bg-void/40 border border-primary-500/10 rounded-xl lg:rounded-2xl px-4 text-xs lg:text-sm font-bold focus:outline-none focus:border-primary-500">
                  <option>Select Brand</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            </div>
          </Card>

          <Card className="p-5 lg:p-8 flex flex-col gap-6 lg:gap-8 bg-bg-elevated/30 border-primary-500/5">
            <div className="flex items-center gap-3 border-b border-primary-500/10 pb-5 lg:pb-6">
              <div className="p-2 rounded-lg glass text-primary-500"><Save size={18} className="lg:hidden" /><Save size={20} className="hidden lg:block" /></div>
              <h3 className="font-display font-black uppercase tracking-widest text-xs lg:text-sm">Status</h3>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <label className="text-[8px] lg:text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Featured Product</label>
                <select name="isFeatured" defaultValue={product.isFeatured ? 'true' : 'false'} className="h-12 lg:h-14 bg-bg-void/40 border border-primary-500/10 rounded-xl lg:rounded-2xl px-4 text-xs lg:text-sm font-bold focus:outline-none focus:border-primary-500">
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
