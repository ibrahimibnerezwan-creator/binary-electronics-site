'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createCategory } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Plus, Image as ImageIcon, X, Loader2, Save, Info } from 'lucide-react'

export default function NewCategoryPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [imageUrl, setImageUrl] = useState('')

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploading(true)
        const formData = new FormData()
        formData.append('file', files[0])

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
            if (res.status === 401) {
                alert('Session expired. Please log in again.')
                window.location.href = '/admin/login'
                return
            }
            const data = await res.json()
            if (data.success) {
                setImageUrl(data.files[0].url)
            } else {
                alert(data.error || 'Upload failed')
            }
        } catch (err) {
            alert('Upload failed. Please try again.')
        } finally {
            setUploading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        formData.append('imageUrl', imageUrl)
        
        try {
            const res = await createCategory(formData)
            if (res && res.error) {
                alert(res.error)
            }
            // Transition happens via redirect in server action
        } catch (err) {
            alert('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex flex-col gap-10 pb-20">
            {/* Header */}
            <div className="flex flex-col gap-6">
                <Link href="/admin/categories" className="flex items-center gap-2 text-primary-500 font-bold text-xs uppercase tracking-widest hover:underline">
                    <ArrowLeft size={16} /> Back to Collections
                </Link>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-display font-black uppercase tracking-tight">CREATE <span className="text-gradient">COLLECTION</span></h1>
                        <p className="text-text-secondary">Organize your products into meaningful groups</p>
                    </div>
                    <div className="flex gap-4">
                        <Button type="button" variant="secondary" onClick={() => router.back()} className="h-14 px-8 rounded-2xl glass border-primary-500/10">Discard</Button>
                        <Button disabled={loading || uploading} className="h-14 px-10 rounded-2xl shadow-xl shadow-primary-500/20 gap-2 font-black uppercase tracking-widest">
                            {loading ? <Loader2 className="animate-spin" size={20}/> : <Save size={20} />} 
                            Save Collection
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Details */}
                <Card className="p-8 flex flex-col gap-8 bg-bg-elevated/30 border-primary-500/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/5 rounded-full blur-[60px] -mr-24 -mt-24 group-hover:bg-primary-500/10 transition-colors duration-500" />
                    
                    <div className="flex items-center gap-3 border-b border-primary-500/10 pb-6 relative">
                        <div className="p-2 rounded-lg glass text-primary-500"><Info size={20}/></div>
                        <h3 className="font-display font-black uppercase tracking-widest text-sm">Collection Info</h3>
                    </div>

                    <div className="flex flex-col gap-6 relative">
                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted ml-1">Collection Name</label>
                            <Input 
                                name="name" 
                                required 
                                placeholder="e.g. Mechanical Keyboards" 
                                className="h-14 bg-bg-void/40 border-primary-500/10 focus:border-primary-500 text-lg font-bold" 
                            />
                        </div>
                        <p className="text-[10px] text-text-secondary italic">
                           * The URL slug will be automatically generated based on the name.
                        </p>
                    </div>
                </Card>

                {/* Banner / Image */}
                <Card className="p-8 flex flex-col gap-8 bg-bg-elevated/30 border-primary-500/5">
                    <div className="flex items-center gap-3 border-b border-primary-500/10 pb-6">
                        <div className="p-2 rounded-lg glass text-accent-500"><ImageIcon size={20}/></div>
                        <h3 className="font-display font-black uppercase tracking-widest text-sm">Cover Image</h3>
                    </div>

                    <div className="relative aspect-video rounded-2xl glass border-2 border-dashed border-primary-500/20 overflow-hidden flex flex-col items-center justify-center group transition-all">
                        {imageUrl ? (
                            <>
                                <img src={imageUrl} alt="Category preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button 
                                        type="button"
                                        onClick={() => setImageUrl('')}
                                        className="p-3 rounded-full bg-red-500 text-white shadow-xl shadow-red-500/30"
                                    >
                                        <X size={24}/>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <label className="absolute inset-0 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-primary-500/5 transition-all">
                                <div className="p-4 rounded-2xl glass text-primary-500">
                                    {uploading ? <Loader2 className="animate-spin" size={40}/> : <Plus size={40} />}
                                </div>
                                <div className="flex flex-col items-center">
                                   <span className="text-xs font-black uppercase tracking-widest text-white">{uploading ? 'Processing...' : 'Upload Cover'}</span>
                                   <span className="text-[10px] text-text-muted">Min size 1200x400px recommended</span>
                                </div>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                        )}
                    </div>
                </Card>
            </div>
        </form>
    )
}
