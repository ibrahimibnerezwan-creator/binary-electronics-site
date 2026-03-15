import { Footer } from '@/components/layout/footer'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Laptop, Smartphone, Headphones, Watch, Camera, CPU, MousePointer, Monitor } from 'lucide-react'

const categories = [
  { name: 'Computing', icon: Laptop, count: 124, slug: 'computing', desc: 'Powerful laptops and desktops for every need.' },
  { name: 'Phones', icon: Smartphone, count: 86, slug: 'phones', desc: 'The latest smartphones and mobile tech.' },
  { name: 'Audio', icon: Headphones, count: 42, slug: 'audio', desc: 'Immersive sound from premium headphones and speakers.' },
  { name: 'Smartwatch', icon: Watch, count: 28, slug: 'smartwatch', desc: 'Stay connected with stylish wearables.' },
  { name: 'Camera', icon: Camera, count: 115, slug: 'camera', desc: 'Capture every moment with professional optics.' },
  { name: 'Components', icon: CPU, count: 56, slug: 'components', desc: 'High-performance parts for your custom build.' },
  { name: 'Accessories', icon: MousePointer, count: 215, slug: 'accessories', desc: 'Essential add-ons for your favorite devices.' },
  { name: 'Displays', icon: Monitor, count: 32, slug: 'displays', desc: 'Crystal clear monitors and home cinema setups.' },
]

export default function CategoriesPage() {
  return (
    <div className="flex flex-col">
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col gap-4 mb-20 text-center max-w-2xl mx-auto">
          <h1 className="text-5xl lg:text-7xl font-display font-black uppercase tracking-tight">SHOP BY <br/><span className="text-gradient">CATEGORY</span></h1>
          <p className="text-lg text-text-secondary">Discover innovation across our wide range of premium electronics categories.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`}>
              <Card className="group p-8 h-full flex flex-col gap-6 text-center hover:bg-primary-500/5 transition-all duration-500">
                <div className="w-20 h-20 rounded-3xl glass border-primary-500/10 flex items-center justify-center mx-auto text-text-secondary group-hover:text-primary-500 group-hover:scale-110 transition-all duration-300">
                  <cat.icon size={40} />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-display font-black uppercase tracking-tight">{cat.name}</h3>
                  <p className="text-sm text-text-muted line-clamp-2">{cat.desc}</p>
                </div>
                <div className="mt-auto pt-6 border-t border-primary-500/10">
                   <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-500">{cat.count} PRODUCTS AVAILABLE</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
