import Link from 'next/link'
export const dynamic = 'force-dynamic'
import { getAllOrders } from '@/lib/data'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  ChevronRight,
  ArrowUpRight,
  User,
  MapPin,
  CreditCard
} from 'lucide-react'
import { SteadfastButton } from './steadfast-button'

export default async function AdminOrdersPage() {
    const orders = await getAllOrders()

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
            case 'processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
            case 'shipped': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
            case 'delivered': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
            case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20'
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20'
        }
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-display font-black uppercase tracking-tight">ORDERS</h1>
                <p className="text-text-secondary">Manage customer orders and fulfillment</p>
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6 glass border-primary-500/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-primary-500/10 text-primary-500"><ShoppingBag size={24}/></div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Total Orders</p>
                            <p className="text-2xl font-black text-white">{orders.length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-6 glass border-amber-500/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500"><Clock size={24}/></div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Pending</p>
                            <p className="text-2xl font-black text-white">{orders.filter(o => o.status === 'pending').length}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Orders Table */}
            <Card className="overflow-hidden border-primary-500/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-bg-elevated/50 border-b border-primary-500/10">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Order Info</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Customer</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Details</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary-500/5">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-30">
                                            <ShoppingBag size={64} className="text-primary-500" />
                                            <p className="font-display font-black uppercase tracking-widest text-sm text-text-muted">No orders yet</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-primary-500/5 transition-colors group">
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-black text-white">#{order.id.slice(0, 8).toUpperCase()}</span>
                                                <span className="text-[10px] text-text-muted uppercase tracking-widest">
                                                    {new Date(order.createdAt!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <User size={12} className="text-primary-500" />
                                                    <span className="font-bold text-sm text-white">{order.customerName}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={12} className="text-text-muted" />
                                                    <span className="text-xs text-text-secondary">{order.shippingCity}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-black text-primary-500">{formatPrice(order.total)}</span>
                                                <div className="flex items-center gap-2">
                                                    <CreditCard size={12} className="text-accent-500" />
                                                    <span className="text-[10px] text-text-muted uppercase tracking-widest">{order.paymentMethod}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <Badge className={`rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <SteadfastButton orderId={order.id} trackingId={order.courierTrackingId} />
                                                <Link href={`/admin/orders`}>
                                                    <div className="p-2 text-text-secondary hover:text-primary-500 hover:glass rounded-lg transition-all" title="View details (Coming soon)">
                                                        <ChevronRight size={18} />
                                                    </div>
                                                </Link>
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
