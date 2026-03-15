import { getAllOrders } from '@/lib/data'
export const dynamic = 'force-dynamic'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'
import { 
    Search, 
    Filter, 
    Eye, 
    Clock, 
    Check, 
    X, 
    Truck, 
    CreditCard, 
    Smartphone,
    User,
    Calendar,
    ArrowUpRight
} from 'lucide-react'
import { format } from 'date-fns'
import { SteadfastButton } from './steadfast-button'
import Link from 'next/link'

export default async function AdminOrdersPage() {
    const orders = await getAllOrders()

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-display font-black uppercase tracking-tight">ORDER MANAGEMENT</h1>
                    <p className="text-text-secondary">Process sales, track shipments, and verify payments.</p>
                </div>
                <Button variant="secondary" className="h-14 px-8 rounded-2xl glass border-primary-500/10 gap-2 font-bold">
                   Export Data
                </Button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6 bg-primary-500/5 border-primary-500/10">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Total Sales</p>
                    <p className="text-2xl font-black text-white">{formatPrice(orders.reduce((acc, curr) => acc + curr.total, 0))}</p>
                </Card>
                <Card className="p-6 bg-orange-500/5 border-orange-500/10">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">Pending Orders</p>
                    <p className="text-2xl font-black text-white">{orders.filter(o => o.status === 'PENDING').length}</p>
                </Card>
            </div>

            {/* Orders Table */}
            <Card className="overflow-hidden border-primary-500/5 bg-bg-elevated/20">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-bg-elevated/50 border-b border-primary-500/10">
                                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-text-muted">Order info</th>
                                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-text-muted">Customer</th>
                                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-text-muted">Payment & Total</th>
                                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-text-muted">Status</th>
                                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-text-muted text-right">Fulfillment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary-500/5">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-30">
                                            <Calendar size={64} className="text-primary-500" />
                                            <p className="font-display font-black uppercase tracking-widest text-sm text-text-muted">No orders found in database</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-primary-500/5 transition-colors group">
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-mono text-xs font-black text-primary-500">#{order.id.slice(0, 8).toUpperCase()}</span>
                                                <span className="text-[10px] text-text-muted flex items-center gap-1 font-bold">
                                                   <Clock size={10}/> {format(order.createdAt, 'MMM dd, HH:mm')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full glass border border-primary-500/10 flex items-center justify-center text-primary-500 shrink-0">
                                                    <User size={18} />
                                                </div>
                                                <div className="flex flex-col leading-tight">
                                                    <span className="font-black text-sm tracking-tight">{order.customerName}</span>
                                                    <span className="text-[10px] text-text-muted">{order.customerPhone}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                   <Badge variant="secondary" className="bg-primary-500/10 text-primary-500 border-none text-[9px] uppercase tracking-tighter h-5 px-1.5 font-black">
                                                      {order.paymentMethod}
                                                   </Badge>
                                                   <span className="font-black text-sm">{formatPrice(order.total)}</span>
                                                </div>
                                                {order.transactionId && (
                                                   <div className="flex items-center gap-1 text-[10px] font-mono text-accent-500 bg-accent-500/5 px-2 py-0.5 rounded border border-accent-500/10 w-fit">
                                                      <CreditCard size={10} /> {order.transactionId}
                                                   </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col gap-2">
                                                {order.status === 'PENDING' && <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 gap-1 w-fit"><Clock size={12}/> Pending</Badge>}
                                                {order.status === 'PROCESSING' && <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 gap-1 w-fit"><Smartphone size={12}/> Processing</Badge>}
                                                {order.status === 'SHIPPED' && <Badge className="bg-gold-500/10 text-gold-500 border-gold-500/20 gap-1 w-fit"><Truck size={12}/> Shipped</Badge>}
                                                {order.status === 'DELIVERED' && <Badge className="bg-green-500/10 text-green-500 border-green-500/20 gap-1 w-fit"><Check size={12}/> Delivered</Badge>}
                                                {order.status === 'CANCELLED' && <Badge className="bg-red-500/10 text-red-500 border-red-500/20 gap-1 w-fit"><X size={12}/> Cancelled</Badge>}
                                                
                                                {order.paymentStatus === 'PAID' && (
                                                   <span className="text-[9px] font-black text-green-500 uppercase tracking-widest flex items-center gap-1">
                                                      <Check size={10}/> Paid
                                                   </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <SteadfastButton orderId={order.id} trackingId={order.courierTrackingId} />
                                                <Link href={`/admin/orders/${order.id}`}>
                                                   <Button size="icon" variant="secondary" className="h-10 w-10 rounded-xl glass border-primary-500/10 hover:text-primary-500">
                                                      <ArrowUpRight size={18} />
                                                   </Button>
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
