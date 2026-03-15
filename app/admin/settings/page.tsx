import { getStoreSettings } from '@/lib/data'
export const dynamic = 'force-dynamic'
import { updateSettings } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { 
  Save, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Share2, 
  Server, 
  CreditCard, 
  Truck,
  Globe
} from 'lucide-react'

export default async function SettingsPage() {
    const settings = await getStoreSettings()

    return (
        <div className="flex flex-col gap-10 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-display font-black uppercase tracking-tight">STORE SETTINGS</h1>
                <p className="text-text-secondary text-lg">Manage your business information and third-party integrations.</p>
            </div>

            <form action={updateSettings} className="flex flex-col gap-8">
                
                {/* Contact Information */}
                <Card className="p-8 border-primary-500/10 bg-bg-elevated/30 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-primary-500/10 transition-colors duration-500" />
                    
                    <div className="flex items-center gap-3 text-primary-500 mb-8 pb-4 border-b border-primary-500/10 relative">
                        <div className="p-2 glass rounded-lg border-primary-500/10">
                            <Globe size={20} />
                        </div>
                        <h2 className="text-xl font-display font-black uppercase tracking-tight">Business Profile</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="storeName" className="text-xs font-bold uppercase tracking-widest text-text-muted">Store Name</Label>
                            <Input 
                                id="storeName" 
                                name="storeName" 
                                defaultValue={settings.storeName || "Binary Electronics"} 
                                className="h-12 bg-bg-void/40 border-primary-500/10 focus:border-primary-500 text-white font-bold" 
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-widest text-text-muted">Phone Number</Label>
                            <Input 
                                id="phone" 
                                name="phone" 
                                placeholder="+880 1XXX-XXXXXX"
                                defaultValue={settings.phone} 
                                className="h-12 bg-bg-void/40 border-primary-500/10 focus:border-primary-500 text-white font-bold" 
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="whatsapp" className="text-xs font-bold uppercase tracking-widest text-text-muted">WhatsApp Number</Label>
                            <Input 
                                id="whatsapp" 
                                name="whatsapp" 
                                placeholder="01XXX-XXXXXX"
                                defaultValue={settings.whatsapp} 
                                className="h-12 bg-bg-void/40 border-primary-500/10 focus:border-primary-500 text-white font-bold" 
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-text-muted">Support Email</Label>
                            <Input 
                                id="email" 
                                name="email" 
                                type="email" 
                                placeholder="support@binary-electronics.com"
                                defaultValue={settings.email} 
                                className="h-12 bg-bg-void/40 border-primary-500/10 focus:border-primary-500 text-white font-bold" 
                            />
                        </div>

                        <div className="flex flex-col gap-2 md:col-span-2">
                            <Label htmlFor="address" className="text-xs font-bold uppercase tracking-widest text-text-muted">Physical Address</Label>
                            <Input 
                                id="address" 
                                name="address" 
                                placeholder="Enter store location"
                                defaultValue={settings.address} 
                                className="h-12 bg-bg-void/40 border-primary-500/10 focus:border-primary-500 text-white font-bold" 
                            />
                        </div>
                    </div>
                </Card>

                {/* Integrations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* bKash & Nagad */}
                    <Card className="p-8 border-primary-500/10 bg-bg-elevated/30">
                        <div className="flex items-center gap-3 text-accent-500 mb-8 pb-4 border-b border-primary-500/10">
                            <div className="p-2 glass rounded-lg border-accent-500/10">
                                <CreditCard size={20} />
                            </div>
                            <h2 className="text-xl font-display font-black uppercase tracking-tight">Payments</h2>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="p-5 rounded-2xl bg-primary-500/5 border border-primary-500/10 flex flex-col gap-4">
                               <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-primary-500" />
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500">bKash (Personal/Merchant)</span>
                               </div>
                               <Input 
                                 id="bkash_number" 
                                 name="bkash_number" 
                                 placeholder="Receive Money Number" 
                                 defaultValue={settings.bkash_number} 
                                 className="h-12 bg-bg-void/40 border-primary-500/20 focus:border-primary-500"
                               />
                            </div>

                            <div className="p-5 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex flex-col gap-4">
                               <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-orange-500">Nagad (Personal)</span>
                               </div>
                               <Input 
                                 id="nagad_number" 
                                 name="nagad_number" 
                                 placeholder="Nagad Number" 
                                 defaultValue={settings.nagad_number} 
                                 className="h-12 bg-bg-void/40 border-orange-500/20 focus:border-orange-500"
                               />
                            </div>
                        </div>
                    </Card>

                    {/* Steadfast Courier */}
                    <Card className="p-8 border-primary-500/10 bg-bg-elevated/30">
                        <div className="flex items-center gap-3 text-gold-500 mb-8 pb-4 border-b border-primary-500/10">
                            <div className="p-2 glass rounded-lg border-gold-500/10">
                                <Truck size={20} />
                            </div>
                            <h2 className="text-xl font-display font-black uppercase tracking-tight">Logistics</h2>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="steadfast_api_key" className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Steadfast API Key</Label>
                                <Input 
                                    id="steadfast_api_key" 
                                    name="steadfast_api_key" 
                                    placeholder="Enter API Key" 
                                    className="h-12 bg-bg-void/40 border-primary-500/10 focus:border-primary-500 font-mono text-xs" 
                                    defaultValue={settings.steadfast_api_key}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="steadfast_secret_key" className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Steadfast Secret Key</Label>
                                <Input 
                                    id="steadfast_secret_key" 
                                    name="steadfast_secret_key" 
                                    type="password"
                                    placeholder="Enter Secret Key" 
                                    className="h-12 bg-bg-void/40 border-primary-500/10 focus:border-primary-500 font-mono text-xs" 
                                    defaultValue={settings.steadfast_secret_key}
                                />
                            </div>
                            <div className="mt-2 p-3 rounded-xl bg-gold-500/5 border border-gold-500/10 flex gap-3">
                                <Server size={16} className="text-gold-500 shrink-0 mt-0.5" />
                                <p className="text-[10px] text-text-muted leading-relaxed">
                                   Connect your Steadfast account to automate order fulfillment and generation of consignment IDs.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Social Media */}
                <Card className="p-8 border-primary-500/10 bg-bg-elevated/30">
                    <div className="flex items-center gap-3 text-primary-500 mb-8 pb-4 border-b border-primary-500/10">
                        <div className="p-2 glass rounded-lg border-primary-500/10">
                            <Share2 size={20} />
                        </div>
                        <h2 className="text-xl font-display font-black uppercase tracking-tight">Social Media</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {['Facebook', 'Instagram', 'YouTube', 'TikTok'].map((social) => (
                            <div key={social} className="flex flex-col gap-2">
                                <Label htmlFor={social.toLowerCase()} className="text-[10px] font-bold uppercase tracking-widest text-text-muted">{social} URL</Label>
                                <Input 
                                    id={social.toLowerCase()} 
                                    name={social.toLowerCase()} 
                                    placeholder={`https://${social.toLowerCase()}.com/...`}
                                    defaultValue={settings[social.toLowerCase()]} 
                                    className="h-12 bg-bg-void/40 border-primary-500/10 focus:border-primary-500" 
                                />
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Submit */}
                <div className="flex justify-end pt-4">
                    <Button type="submit" size="lg" className="h-16 px-12 gap-3 text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary-500/30">
                        <Save size={24} /> Save Calculations
                    </Button>
                </div>
            </form>
        </div>
    )
}
