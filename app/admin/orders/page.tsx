'use client'

import { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Eye,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  MoreVertical,
  Check,
  X,
  Truck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { formatPrice } from '@/lib/utils'

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('')

  const orders = [
    { id: '1001', customer: 'Anwar Hossain', date: 'Oct 24, 2023', total: 345000, status: 'processing', payment: 'bKash', items: 1 },
    { id: '1002', customer: 'Bipu Ahmed', date: 'Oct 23, 2023', total: 165000, status: 'shipped', payment: 'COD', items: 2 },
    { id: '1003', customer: 'John Doe', date: 'Oct 22, 2023', total: 38000, status: 'delivered', payment: 'Card', items: 1 },
    { id: '1004', customer: 'Sarah Miller', date: 'Oct 21, 2023', total: 18500, status: 'cancelled', payment: 'Nagad', items: 3 },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-display font-black uppercase tracking-tight">ORDERS</h1>
          <p className="text-text-secondary">Track and manage customer transactions</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
           <Button variant="secondary" className="gap-2 h-14 px-6 rounded-2xl glass border-primary-500/10">
              Export CSV
           </Button>
        </div>
      </div>

       {/* Tabs / Filter Summary */}
       <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
          {['All Orders', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((tab, i) => (
             <button 
               key={tab} 
               className={cn(
                 "px-6 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all",
                 i === 0 ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20" : "glass border border-primary-500/10 text-text-muted hover:text-primary-500 hover:border-primary-500/30"
               )}
             >
               {tab} <span className="ml-2 text-[10px] opacity-70">({i === 0 ? 124 : 12})</span>
             </button>
          ))}
       </div>

      {/* Search & Filter Bar */}
      <Card className="p-4 flex flex-col md:flex-row gap-4 items-center bg-bg-elevated/30 border-primary-500/5">
         <div className="relative flex-grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <Input 
              placeholder="Search by Order ID, customer, phone..." 
              className="pl-12 h-12 bg-bg-void/40 border-primary-500/10 focus:border-primary-500"
            />
         </div>
         <Button variant="secondary" className="gap-2 h-12 rounded-xl border border-primary-500/10">
           <Filter size={18} /> Advanced Filters
         </Button>
      </Card>

      {/* Orders Table */}
      <Card className="overflow-hidden border-primary-500/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-bg-elevated/50 border-b border-primary-500/10">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Order ID</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Customer</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Total</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Payment</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary-500/5">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-primary-500/5 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-bold text-primary-500">#{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm tracking-tight">{order.customer}</span>
                      <span className="text-[10px] text-text-muted">{order.items} item(s)</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-text-secondary">{order.date}</td>
                  <td className="px-6 py-4 font-black text-sm">{formatPrice(order.total)}</td>
                  <td className="px-6 py-4">
                    <Badge variant="secondary" className="bg-primary-500/5 text-primary-500 border-none text-[10px] uppercase tracking-widest">
                      {order.payment}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {order.status === 'processing' && <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 gap-1"><Clock size={12}/> Processing</Badge>}
                    {order.status === 'shipped' && <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 gap-1"><Truck size={12}/> Shipped</Badge>}
                    {order.status === 'delivered' && <Badge className="bg-green-500/10 text-green-500 border-green-500/20 gap-1"><Check size={12}/> Delivered</Badge>}
                    {order.status === 'cancelled' && <Badge className="bg-red-500/10 text-red-500 border-red-500/20 gap-1"><X size={12}/> Cancelled</Badge>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <Button size="sm" variant="secondary" className="h-8 gap-1.5 rounded-lg glass border-primary-500/10 text-xs">
                         <Eye size={14} /> Details
                       </Button>
                       <button className="p-2 text-text-muted hover:text-primary-500 hover:glass rounded-lg transition-all">
                         <MoreVertical size={18} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ')
}
