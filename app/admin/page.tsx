import { Card } from '@/components/ui/card'
import { 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'

export default function AdminDashboard() {
  const stats = [
    { name: 'Total Revenue', value: 1245000, trend: '+12.5%', icon: TrendingUp, color: 'text-green-500' },
    { name: 'Active Orders', value: 42, trend: '+8', icon: ShoppingCart, color: 'text-primary-500' },
    { name: 'New Customers', value: 156, trend: '+24', icon: Users, color: 'text-accent-500' },
    { name: 'Products Sold', value: 892, trend: '-2%', icon: Package, color: 'text-orange-500' },
  ]

  return (
    <div className="flex flex-col gap-10">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-display font-black uppercase tracking-tight">OVERVIEW</h1>
        <p className="text-text-secondary text-lg">Welcome back. Here's what's happening today at Binary Electronics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6 group hover:translate-y-[-4px] transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-2xl glass border-primary-500/10", stat.color)}>
                <stat.icon size={24} />
              </div>
              <span className={cn(
                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full glass border",
                stat.trend.startsWith('+') ? "text-green-500 border-green-500/20" : "text-red-500 border-red-500/20"
              )}>
                {stat.trend} {stat.trend.startsWith('+') ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-text-secondary uppercase tracking-widest">{stat.name}</span>
              <span className="text-3xl font-display font-black tracking-tight">
                {stat.name.includes('Revenue') ? formatPrice(stat.value) : stat.value.toLocaleString()}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders - Placeholder */}
        <Card className="lg:col-span-2 p-8 flex flex-col gap-8">
           <div className="flex justify-between items-center">
             <div className="flex flex-col gap-1">
               <h3 className="text-xl font-display font-black uppercase tracking-tight">RECENT ORDERS</h3>
               <p className="text-xs text-text-muted">Review the latest customer activity</p>
             </div>
             <button className="text-xs font-bold text-primary-500 uppercase tracking-widest hover:underline">View All</button>
           </div>

           <div className="flex flex-col gap-4">
             {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-bg-primary/50 rounded-2xl border border-primary-500/5 hover:border-primary-500/20 transition-all cursor-pointer group">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full glass flex items-center justify-center font-bold text-primary-500">
                        #00{i}
                      </div>
                      <div className="flex flex-col">
                         <span className="font-bold text-sm">Anwar Hossain</span>
                         <span className="text-[10px] text-text-muted">2 mins ago • bKash</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="flex flex-col text-right">
                         <span className="font-black text-sm">৳ 45,000</span>
                         <span className="text-[10px] text-green-500 uppercase font-bold tracking-widest">Paid</span>
                      </div>
                      <div className="p-2 text-text-muted group-hover:text-primary-500 transition-colors">
                        <ChevronRight size={18} />
                      </div>
                   </div>
                </div>
             ))}
           </div>
        </Card>

        {/* Stock Alerts - Placeholder */}
        <Card className="p-8 flex flex-col gap-8 h-fit">
           <div className="flex flex-col gap-1">
             <h3 className="text-xl font-display font-black uppercase tracking-tight">STOCK ALERTS</h3>
             <p className="text-xs text-text-muted">Low inventory warnings</p>
           </div>
           
           <div className="flex flex-col gap-6">
              {[
                { name: 'iPhone 15 Pro', stock: 2 },
                { name: 'Sony WH-1000XM5', stock: 3 },
                { name: 'MacBook Pro M3', stock: 1 },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-2">
                   <div className="flex justify-between items-center text-sm font-bold">
                      <span>{item.name}</span>
                      <span className="text-red-500">{item.stock} left</span>
                   </div>
                   <div className="h-1.5 w-full bg-primary-500/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 transition-all duration-1000" 
                        style={{ width: `${(item.stock / 10) * 100}%` }} 
                      />
                   </div>
                </div>
              ))}
           </div>

           <div className="mt-4 p-4 glass rounded-xl border-accent-500/20 flex gap-4">
              <Clock className="text-accent-500 shrink-0" size={20} />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold">New Review Pending</span>
                <p className="text-[10px] text-text-muted leading-relaxed">Someone just reviewed the 'iPhone 15 Pro'. Check it out in the reviews section.</p>
              </div>
           </div>
        </Card>
      </div>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
