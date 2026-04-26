import Link from 'next/link'
export const dynamic = 'force-dynamic'
import { getAllCategoriesWithCount } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Plus,
  FolderOpen,
  Image as ImageIcon,
  Layers,
  ChevronRight
} from 'lucide-react'
import { DeleteCategoryButton } from './delete-category-button'

export default async function AdminCategoriesPage() {
    const categories = await getAllCategoriesWithCount()

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-display font-black uppercase tracking-tight">CATEGORIES</h1>
                    <p className="text-text-secondary">Organize and manage your product collections</p>
                </div>
                <Link href="/admin/categories/new">
                    <Button className="h-14 px-8 rounded-2xl gap-2 shadow-xl shadow-primary-500/20 text-sm font-black uppercase tracking-widest">
                        <Plus size={20} /> Add Category
                    </Button>
                </Link>
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <Card className="p-6 bg-primary-500/5 border-primary-500/10 flex items-center gap-4">
                  <div className="p-3 rounded-xl glass text-primary-500"><Layers size={24}/></div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Total Categories</p>
                    <p className="text-2xl font-black text-white">{categories.length}</p>
                  </div>
               </Card>
            </div>

            {/* Categories Table */}
            <Card className="overflow-hidden border-primary-500/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-bg-elevated/50 border-b border-primary-500/10">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Collection</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Slug</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted text-center">Items</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary-500/5">
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-30">
                                            <FolderOpen size={64} className="text-primary-500" />
                                            <p className="font-display font-black uppercase tracking-widest text-sm text-text-muted">No collections found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-primary-500/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-xl glass border border-primary-500/10 overflow-hidden shrink-0">
                                                    {category.image ? (
                                                        <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-primary-500/30">
                                                            <ImageIcon size={24} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-lg tracking-tight group-hover:text-primary-500 transition-colors">{category.name}</span>
                                                    <span className="text-[10px] text-text-muted uppercase tracking-widest">Master Collection</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs text-text-secondary bg-bg-void/40 px-2 py-1 rounded">/{category.slug}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-500 text-xs font-black border border-primary-500/10">
                                                {category.productCount}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/category/${category.slug}`} target="_blank" rel="noopener noreferrer">
                                                    <div className="p-2 text-text-secondary hover:text-primary-500 hover:glass rounded-lg transition-all" title="View on store">
                                                        <ChevronRight size={18} />
                                                    </div>
                                                </Link>
                                                <DeleteCategoryButton
                                                    categoryId={category.id}
                                                    categoryName={category.name}
                                                    productCount={Number(category.productCount)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}
