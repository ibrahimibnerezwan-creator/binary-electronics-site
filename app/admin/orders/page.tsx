export const dynamic = 'force-dynamic'
import { getAllOrders } from '@/lib/data'
import { formatPrice } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import {
  ShoppingBag,
  Clock,
  User,
  MapPin,
  CreditCard
} from 'lucide-react'
import { SteadfastButton } from './steadfast-button'
import { OrderStatusSelect } from './order-status-select'

export default async function AdminOrdersPage() {
    const orders = await getAllOrders()

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-1 lg:gap-2 px-1">
                <h1 className="text-3xl lg:text-4xl font-display font-black uppercase tracking-tight">ORDERS</h1>
                <p className="text-xs lg:text-sm text-text-secondary">Manage customer orders and fulfillment</p>
            </div>

            {/* Quick Stats Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <Card className="p-4 lg:p-6 glass border-primary-500/5">
                    <div className="flex items-center gap-3 lg:gap-4">
                        <div className="p-2 lg:p-3 rounded-xl bg-primary-500/10 text-primary-500"><ShoppingBag size={20} className="lg:hidden"/><ShoppingBag size={24} className="hidden lg:block"/></div>
                        <div>
                            <p className="text-[8px] lg:text-[10px] font-bold uppercase tracking-widest text-text-muted">Total</p>
                            <p className="text-xl lg:text-2xl font-black text-white">{orders.length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 lg:p-6 glass border-amber-500/5">
                    <div className="flex items-center gap-3 lg:gap-4">
                        <div className="p-2 lg:p-3 rounded-xl bg-amber-500/10 text-amber-500"><Clock size={20} className="lg:hidden"/><Clock size={24} className="hidden lg:block"/></div>
                        <div>
                            <p className="text-[8px] lg:text-[10px] font-bold uppercase tracking-widest text-text-muted">Pending</p>
                            <p className="text-xl lg:text-2xl font-black text-white">{orders.filter(o => o.status === 'pending').length}</p>
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
                                        <td className="px-4 lg:px-6 py-4 lg:py-6">
                                            <div className="flex flex-col gap-0.5 lg:gap-1">
                                                <span className="font-black text-white text-xs lg:text-sm tracking-tight border-b border-primary-500/20 w-fit pb-0.5 mb-1 group-hover:border-primary-500 transition-colors">#{order.id.slice(0, 8).toUpperCase()}</span>
                                                <span className="text-[8px] lg:text-[10px] text-text-muted uppercase font-bold tracking-widest">
                                                    {new Date(order.createdAt!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 lg:px-6 py-4 lg:py-6">
                                            <div className="flex flex-col gap-0.5 lg:gap-1">
                                                <div className="flex items-center gap-1.5 lg:gap-2">
                                                    <User size={10} className="text-primary-500" />
                                                    <span className="font-bold text-xs lg:text-sm text-white">{order.customerName}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 lg:gap-2">
                                                    <MapPin size={10} className="text-text-muted" />
                                                    <span className="text-[10px] lg:text-xs text-text-secondary">{order.shippingCity}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 lg:px-6 py-4 lg:py-6">
                                            <div className="flex flex-col gap-0.5 lg:gap-1">
                                                <span className="font-black text-primary-500 text-xs lg:text-sm">{formatPrice(order.total)}</span>
                                                <div className="flex items-center gap-1.5 lg:gap-2">
                                                    <CreditCard size={10} className="text-accent-500" />
                                                    <span className="text-[8px] lg:text-[10px] text-text-muted uppercase font-bold tracking-widest">{order.paymentMethod}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 lg:px-6 py-4 lg:py-6">
                                            <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                                        </td>
                                        <td className="px-4 lg:px-6 py-4 lg:py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 lg:gap-3">
                                                <SteadfastButton orderId={order.id} trackingId={order.courierTrackingId} />
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
