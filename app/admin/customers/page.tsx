import { getUsers } from '@/lib/data'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
    User, 
    Mail, 
    Phone, 
    MapPin, 
    ShoppingBag, 
    Calendar,
    Search,
    Filter,
    ArrowUpRight,
    MoreVertical
} from 'lucide-react'
import { format } from 'date-fns'

export default async function AdminCustomersPage() {
    const customers = await getUsers()

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-display font-black uppercase tracking-tight">CUSTOMERS</h1>
                    <p className="text-text-secondary">View and manage your registered client base</p>
                </div>
                <div className="flex gap-4">
                   <Button variant="secondary" className="h-14 px-8 rounded-2xl glass border-primary-500/10 gap-2 font-bold">
                      Export Users
                   </Button>
                </div>
            </div>

            {/* Customers Table */}
            <Card className="overflow-hidden border-primary-500/5 bg-bg-elevated/20">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-bg-elevated/50 border-b border-primary-500/10">
                                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-text-muted">Customer Profile</th>
                                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-text-muted">Contact info</th>
                                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-text-muted">Location</th>
                                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-text-muted">Joined Date</th>
                                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-text-muted text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary-500/5">
                            {customers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-30">
                                            <User size={64} className="text-primary-500" />
                                            <p className="font-display font-black uppercase tracking-widest text-sm text-text-muted">No customers registered yet</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-primary-500/5 transition-colors group">
                                        <td className="px-6 py-6 font-bold">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full glass border border-primary-500/10 flex items-center justify-center text-primary-500 shrink-0">
                                                    <User size={20} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-lg font-black tracking-tight group-hover:text-primary-500 transition-colors uppercase italic">{customer.name}</span>
                                                    <span className="text-[10px] text-text-muted uppercase tracking-widest font-black">Verified Client</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-xs font-bold text-white">
                                                  <Mail size={12} className="text-primary-500" /> {customer.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-text-muted font-mono">
                                                  <Phone size={12} className="text-primary-500" /> {customer.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col gap-1 max-w-[200px]">
                                               <div className="flex items-start gap-2 text-xs text-text-secondary">
                                                  <MapPin size={14} className="text-primary-500 shrink-0 mt-0.5" />
                                                  <span className="line-clamp-2">{customer.address || "No address saved"}</span>
                                               </div>
                                               {customer.city && (
                                                  <span className="text-[10px] font-black uppercase text-primary-500 tracking-widest ml-5">
                                                     {customer.city}
                                                  </span>
                                               )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2 text-xs text-text-muted">
                                                <Calendar size={14} className="text-primary-500" />
                                                {format(customer.createdAt, 'MMM dd, yyyy')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button size="icon" variant="secondary" className="h-10 w-10 rounded-xl glass border-primary-500/10 hover:text-primary-500">
                                                    <ArrowUpRight size={18} />
                                                </Button>
                                                <Button size="icon" variant="secondary" className="h-10 w-10 rounded-xl glass border-primary-500/10 hover:text-primary-500">
                                                    <MoreVertical size={18} />
                                                </Button>
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
