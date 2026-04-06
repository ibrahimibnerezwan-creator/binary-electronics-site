import { getStoreSettings } from '@/lib/data'
import { Truck, Clock, Shield } from 'lucide-react'

export default async function ShippingPolicyPage() {
  const settings = await getStoreSettings()
  const sInside = settings.shipping_inside_dhaka || '60'
  const sOutside = settings.shipping_outside_dhaka || '120'

  return (
    <div className="flex flex-col">
      <section className="container mx-auto px-4 pt-32 pb-20">
         <div className="max-w-4xl mx-auto animate-reveal-up">
            <div className="flex flex-col gap-4 mb-16 items-center text-center">
               <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary-500">Logistics</span>
               <h1 className="text-5xl lg:text-7xl font-display font-black uppercase tracking-tight text-white">SHIPPING <span className="text-gradient">POLICY</span></h1>
               <p className="text-text-muted/60 mt-4 uppercase tracking-widest text-xs">Complete details on how we deliver excellence to your doorstep.</p>
            </div>

            <div className="space-y-12">
               <div className="bg-black/40 backdrop-blur-xl p-10 flex flex-col gap-8 md:flex-row items-center border border-primary-500/10 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-primary-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <div className="w-20 h-20 bg-primary-500/5 border border-primary-500/10 flex items-center justify-center text-primary-500 shrink-0 relative z-10">
                     <Truck size={40} strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col gap-4 relative z-10">
                     <h3 className="text-2xl font-display font-black uppercase tracking-tight text-white">NATIONWIDE DELIVERY NETWORK</h3>
                     <p className="text-text-muted/80 leading-relaxed font-mono text-sm uppercase tracking-wider">
                        Binary Electronics maintains a high-speed logistics framework. Flat rate of <span className="text-primary-500 font-bold">৳ {sInside}</span> applies for Dhaka and <span className="text-accent-500 font-bold">৳ {sOutside}</span> for outside Dhaka. Orders over ৳ 50,000 may qualify for priority routing.
                     </p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-black/40 backdrop-blur-xl p-8 border border-primary-500/10 flex flex-col gap-6 font-mono">
                     <div className="flex items-center gap-4">
                        <Clock className="text-primary-500" size={24} strokeWidth={1.5} />
                        <h4 className="font-black uppercase tracking-[0.3em] text-sm text-white">DELIVERY_LATENCY</h4>
                     </div>
                     <ul className="space-y-4 text-xs text-text-muted/60 uppercase tracking-widest">
                        <li className="flex justify-between border-b border-primary-500/5 pb-2">
                           <span>DHAKA_NODE</span>
                           <span className="font-bold text-white">24 - 48 HOURS</span>
                        </li>
                        <li className="flex justify-between border-b border-primary-500/5 pb-2">
                           <span>REGIONAL_NODES</span>
                           <span className="font-bold text-white">3 - 5 DAYS</span>
                        </li>
                        <li className="flex justify-between">
                           <span>EXPRESS_UPLINK</span>
                           <span className="font-bold text-primary-500">PRIORITY_AVAIL</span>
                        </li>
                     </ul>
                  </div>

                  <div className="bg-black/40 backdrop-blur-xl p-8 border border-primary-500/10 flex flex-col gap-6 font-mono text-xs">
                     <div className="flex items-center gap-4">
                        <Shield className="text-accent-500" size={24} strokeWidth={1.5} />
                        <h4 className="font-black uppercase tracking-[0.3em] text-sm text-white">INTEGRITY_SHIELD</h4>
                     </div>
                     <p className="text-text-muted/60 leading-relaxed uppercase tracking-widest">
                        Once orders are dispatched, customers receive an encrypted tracking ID via SMS/Email. Real-time telemetry is available through our terminal interface for all "Binary Excellence" shipments.
                     </p>
                  </div>
               </div>

               <div className="flex flex-col gap-8 py-10 border-t border-primary-500/10">
                  <h3 className="text-3xl font-display font-black uppercase tracking-tight text-white italic underline decoration-primary-500/30 underline-offset-8">DAMAGES & TELEMETRY</h3>
                  <div className="prose prose-invert max-w-none text-text-muted/80 font-mono text-sm uppercase tracking-widest leading-loose">
                     <p>
                        Inspect your cargo upon arrival. If the hardware is defective, damaged, or misrouted, initiate an emergency contact immediately. We prioritize hardware integrity through rigorous verification protocols.
                     </p>
                     <p className="mt-6 border-l-2 border-primary-500/20 pl-6 italic">
                        PROTOCOL_ADVICE: Capture telemetry (video) during unboxing for rapid insurance validation and hardware verification.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  )
}
