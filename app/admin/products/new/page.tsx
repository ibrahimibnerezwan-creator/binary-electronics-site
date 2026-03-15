'use client'

import { motion } from 'framer-motion'
import { Plus, Package, Info, Image as ImageIcon, Tag, BarChart2, Save, X, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function AddProductPage() {
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8 pb-20">
      {/* Header */}
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
             <Button variant="secondary" className="h-14 px-8 rounded-2xl glass border-primary-500/10">Discard</Button>
             <Button className="h-14 px-10 rounded-2xl shadow-xl shadow-primary-500/20 gap-2">
               <Save size={20} /> Publish Product
             </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Info */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <Card className="p-8 flex flex-col gap-8 bg-bg-elevated/30 border-primary-500/5">
             <div className="flex items-center gap-3 border-b border-primary-500/10 pb-6">
               <div className="p-2 rounded-lg glass text-primary-500"><Info size={20}/></div>
               <h3 className="font-display font-black uppercase tracking-widest text-sm">General Information</h3>
             </div>

             <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-col gap-3">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Product Name</label>
                   <Input placeholder="e.g. MacBook Pro M3 Max" className="h-14 bg-bg-void/40 border-primary-500/10" />
                </div>

                <div className="flex flex-col gap-3">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Description</label>
                   <textarea 
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
                <button className="aspect-square rounded-2xl glass border-2 border-dashed border-primary-500/20 flex flex-col items-center justify-center gap-2 text-text-muted hover:text-primary-500 hover:border-primary-500/40 transition-all">
                   <Plus size={32} />
                   <span className="text-[10px] font-bold uppercase">Upload</span>
                </button>
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
                   <Input placeholder="0.00" className="h-14 bg-bg-void/40 border-primary-500/10" />
                </div>
                <div className="flex flex-col gap-3">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Sale Price (৳)</label>
                   <Input placeholder="0.00" className="h-14 bg-bg-void/40 border-primary-500/10" />
                </div>
                <div className="flex flex-col gap-3">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">SKU Code</label>
                   <Input placeholder="IPH-15-TIT" className="h-14 bg-bg-void/40 border-primary-500/10" />
                </div>
                <div className="flex flex-col gap-3">
                   <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Stock Quantity</label>
                   <Input type="number" placeholder="0" className="h-14 bg-bg-void/40 border-primary-500/10" />
                </div>
             </div>
          </Card>
        </div>

        {/* Right Column: Meta Info */}
        <div className="flex flex-col gap-8">
           <Card className="p-8 flex flex-col gap-8 bg-bg-elevated/30 border-primary-500/5">
              <div className="flex items-center gap-3 border-b border-primary-500/10 pb-6">
                <div className="p-2 rounded-lg glass text-gold-500"><Tag size={20}/></div>
                <h3 className="font-display font-black uppercase tracking-widest text-sm">Organization</h3>
              </div>

              <div className="flex flex-col gap-6">
                 <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Category</label>
                    <select className="h-14 bg-bg-void/40 border border-primary-500/10 rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary-500">
                       <option>Select Category</option>
                       <option>Computing</option>
                       <option>Phones</option>
                       <option>Audio</option>
                    </select>
                 </div>
                 <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Brand</label>
                    <select className="h-14 bg-bg-void/40 border border-primary-500/10 rounded-2xl px-4 text-sm font-bold focus:outline-none focus:border-primary-500">
                       <option>Select Brand</option>
                       <option>Apple</option>
                       <option>Samsung</option>
                       <option>Sony</option>
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
                 <label className="flex items-center justify-between p-4 glass rounded-xl border border-primary-500/10 cursor-pointer group">
                    <div className="flex flex-col gap-1">
                       <span className="text-sm font-bold">Visibility</span>
                       <span className="text-[10px] text-text-muted uppercase">Ready for customers</span>
                    </div>
                    <div className="w-12 h-6 rounded-full bg-primary-500/20 relative transition-all group-hover:bg-primary-500/30">
                       <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-primary-500 shadow-lg" />
                    </div>
                 </label>
                 
                 <label className="flex items-center justify-between p-4 glass rounded-xl border border-primary-500/10 cursor-pointer group">
                    <div className="flex flex-col gap-1">
                       <span className="text-sm font-bold">Flash Sale</span>
                       <span className="text-[10px] text-text-muted uppercase">Discount limited time</span>
                    </div>
                    <div className="w-12 h-6 rounded-full bg-bg-void/50 relative">
                       <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-text-muted" />
                    </div>
                 </label>
              </div>
           </Card>
        </div>
      </div>
    </div>
  )
}
