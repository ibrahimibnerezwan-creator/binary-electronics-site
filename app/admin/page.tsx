import { Card } from '@/components/ui/card'
export const dynamic = 'force-dynamic'
import { 
  ShoppingCart, 
  Package, 
  Users, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  ChevronRight,
  Star,
  ShoppingBag
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { 
    getProductCount, 
    getOrderCount, 
    getUserCount, 
    getTotalRevenue, 
    getRecentOrders,
    getLowStockProducts,
    getAllReviews
} from '@/lib/data'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import Link from 'next/link'

export default async function AdminDashboard() {
  const [
      productCount,
      orderCount,
      userCount,
      totalRevenue,
      recentOrders,
      lowStockProducts,
      allReviews
  ] = await Promise.all([
      getProductCount(),
      getOrderCount(),
      getUserCount(),
      getTotalRevenue(),
      getRecentOrders(5),
      getLowStockProducts(10),
      getAllReviews()
  ])

  const stats = [
    { name: 'Total Revenue', value: totalRevenue, trend: '+12.5%', icon: TrendingUp, color: 'text-green-500' },
    { name: 'Active Orders', value: orderCount, trend: '+8', icon: ShoppingCart, color: 'text-primary-500' },
    { name: 'Total Customers', value: userCount, trend: '+24', icon: Users, color: 'text-accent-500' },
    { name: 'Total Products', value: productCount, trend: '+12', icon: Package, color: 'text-orange-500' },
  ]

  const pendingReviews = allReviews.filter(r => r.status === 'pending')

  return (
    <div className="flex flex-col gap-10">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-display font-black uppercase tracking-tight">OVERVIEW</h1>
        <p className="text-text-secondary text-lg">Live business intelligence for Binary Electronics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6 group hover:translate-y-[-4px] transition-all duration-300 bg-bg-elevated/30 border-primary-500/5">
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
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{stat.name}</span>
              <span className="text-3xl font-display font-black tracking-tight">
                {stat.name.includes('Revenue') ? formatPrice(stat.value) : stat.value.toLocaleString()}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 p-8 flex flex-col gap-8 bg-bg-elevated/30 border-primary-500/5">
           <div className="flex justify-between items-center pb-4 border-b border-primary-500/10">
             <div className="flex flex-col gap-1">
               <h3 className="text-xl font-display font-black uppercase tracking-tight">RECENT SALES</h3>
               <p className="text-xs text-text-muted">Review the latest transactions</p>
             </div>
             <Link href="/admin/orders">
                <button className="text-[10px] font-black text-primary-500 uppercase tracking-widest hover:underline flex items-center gap-2">
                    View All Orders <ChevronRight size={14} />
                </button>
             </Link>
           </div>
 
           <div className="flex flex-col gap-4">
             {recentOrders.length === 0 ? (
                 <div className="py-20 text-center opacity-30 flex flex-col items-center gap-2">
                    <ShoppingBag size={48} />
                    <p className="text-xs font-bold uppercase tracking-widest">No orders yet</p>
                 </div>
             ) : (
                recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-bg-void/40 rounded-2xl border border-primary-500/5 hover:border-primary-500/20 transition-all cursor-pointer group">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl glass border border-primary-500/10 flex items-center justify-center font-black text-primary-500 text-[10px]">
                            {order.id.slice(0, 4).toUpperCase()}
                          </div>
                          <div className="flex flex-col leading-tight">
                             <span className="font-bold text-sm">{order.customerName}</span>
                             <span className="text-[10px] text-text-muted">{format(order.createdAt, 'mm')} mins ago • {order.paymentMethod}</span>
                          </div>
                       </div>
                       <div className="flex items-center gap-8">
                          <div className="flex flex-col text-right">
                             <span className="font-black text-sm">{formatPrice(order.total)}</span>
                             <span className={cn(
                                 "text-[9px] uppercase font-black tracking-widest",
                                 order.paymentStatus === 'PAID' ? "text-green-500" : "text-orange-500"
                             )}>{order.paymentStatus}</span>
                          </div>
                          <Link href={`/admin/orders`}>
                             <div className="p-2 text-text-muted group-hover:text-primary-500 transition-colors">
                                <ChevronRight size={18} />
                             </div>
                          </Link>
                       </div>
                    </div>
                 ))
             )}
           </div>
        </Card>

        {/* Tactical Info Area */}
        <div className="flex flex-col gap-8">
            {/* Stock Alerts */}
            <Card className="p-8 flex flex-col gap-8 bg-bg-elevated/30 border-primary-500/5">
                <div className="flex flex-col gap-1 pb-4 border-b border-primary-500/10">
                    <h3 className="text-xl font-display font-black uppercase tracking-tight">STOCK ALERTS</h3>
                    <p className="text-xs text-text-muted">Low inventory warnings</p>
                </div>
                
                <div className="flex flex-col gap-6">
                    {lowStockProducts.length === 0 ? (
                         <p className="text-xs text-green-500 font-bold uppercase tracking-widest text-center py-4">Inventory healthy</p>
                    ) : (
                        lowStockProducts.map((item, i) => (
                            <div key={i} className="flex flex-col gap-2">
                               <div className="flex justify-between items-center text-xs font-bold">
                                  <span className="truncate pr-4">{item.name}</span>
                                  <span className="text-red-500 shrink-0">{item.stock} left</span>
                               </div>
                               <div className="h-1.5 w-full bg-primary-500/10 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-red-500 transition-all duration-1000 shadow-[0_0_8px_rgba(239,68,68,0.5)]" 
                                    style={{ width: `${Math.max((item.stock / 10) * 100, 5)}%` }} 
                                  />
                               </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>

            {/* Moderation Alerts */}
            {pendingReviews.length > 0 && (
                <Card className="p-6 bg-accent-500/5 border-accent-500/20 flex gap-4 animate-pulse-slow">
                    <Star className="text-accent-500 shrink-0" size={20} />
                    <div className="flex flex-col gap-1">
                        <span className="text-xs font-black uppercase tracking-widest text-white">Action Required</span>
                        <p className="text-[10px] text-text-muted leading-relaxed">
                            There are <span className="font-bold text-accent-500">{pendingReviews.length} reviews</span> pending moderation.
                        </p>
                        <Link href="/admin/reviews" className="text-[10px] font-black text-accent-500 underline mt-1">Navigate to Reviews</Link>
                    </div>
                </Card>
            )}
        </div>
      </div>
    </div>
  )
}
