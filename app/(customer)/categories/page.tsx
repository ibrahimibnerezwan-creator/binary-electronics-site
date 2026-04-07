import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Laptop, Smartphone, Headphones, Watch, Camera, Cpu, MousePointer, Monitor, ShoppingBag } from 'lucide-react'
import { getAllCategoriesWithCount } from '@/lib/data'

const iconMap: Record<string, any> = {
  'computing': Laptop,
  'phones': Smartphone,
  'audio': Headphones,
  'smartwatch': Watch,
  'camera': Camera,
  'components': Cpu,
  'accessories': MousePointer,
  'displays': Monitor,
}

export const revalidate = 60;

export default async function CategoriesPage() {
  const categories = await getAllCategoriesWithCount();

  return (
    <div className="flex flex-col">
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="flex flex-col gap-4 mb-20 text-center max-w-2xl mx-auto">
          <h1 className="text-5xl lg:text-7xl font-display font-black uppercase tracking-tight">SHOP BY <br/><span className="text-gradient">CATEGORY</span></h1>
          <p className="text-lg text-text-secondary">Discover innovation across our wide range of premium electronics categories.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat) => {
            const Icon = iconMap[cat.slug] || ShoppingBag;
            return (
              <Link key={cat.id} href={`/category/${cat.slug}`}>
                <Card className="group p-8 h-full flex flex-col gap-6 text-center hover:bg-primary-500/5 transition-all duration-500">
                  <div className="w-20 h-20 rounded-3xl glass border-primary-500/10 flex items-center justify-center mx-auto text-text-secondary group-hover:text-primary-500 group-hover:scale-110 transition-all duration-300">
                    <Icon size={40} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-display font-black uppercase tracking-tight">{cat.name}</h3>
                    <p className="text-sm text-text-muted line-clamp-2">Premium {cat.name} products curated for excellence.</p>
                  </div>
                  <div className="mt-auto pt-6 border-t border-primary-500/10">
                     <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-500">{cat.productCount} PRODUCTS AVAILABLE</span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  )
}
