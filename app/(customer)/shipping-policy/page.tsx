'use client'

import { Footer } from '@/components/layout/footer'
import { motion } from 'framer-motion'
import { Truck, Clock, Shield, MapPin } from 'lucide-react'

export default function ShippingPolicyPage() {
  return (
    <div className="flex flex-col">
      <section className="container mx-auto px-4 py-20">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="max-w-4xl mx-auto"
         >
            <div className="flex flex-col gap-4 mb-16 items-center text-center">
               <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary-500">Logistics</span>
               <h1 className="text-5xl lg:text-7xl font-display font-black uppercase tracking-tight">SHIPPING <span className="text-gradient">POLICY</span></h1>
               <p className="text-text-muted mt-4">Complete details on how we deliver excellence to your doorstep.</p>
            </div>

            <div className="space-y-12">
               <div className="glass-card p-10 flex flex-col gap-8 md:flex-row items-center border-primary-500/10">
                  <div className="w-20 h-20 rounded-3xl glass flex items-center justify-center text-primary-500 shrink-0">
                     <Truck size={40} />
                  </div>
                  <div className="flex flex-col gap-4">
                     <h3 className="text-2xl font-display font-black uppercase tracking-tight">FREE NATIONWIDE DELIVERY</h3>
                     <p className="text-text-secondary leading-relaxed">
                        We are proud to offer **Free Shipping** on all orders above ৳ 50,000. For orders below this amount, a flat rate of ৳ 100 applies for Dhaka and ৳ 200 for outside Dhaka.
                     </p>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="glass p-8 rounded-3xl border border-primary-500/5 flex flex-col gap-6">
                     <div className="flex items-center gap-4">
                        <Clock className="text-accent-500" size={24} />
                        <h4 className="font-bold uppercase tracking-widest">Delivery Time</h4>
                     </div>
                     <ul className="space-y-3 text-sm text-text-secondary">
                        <li className="flex justify-between border-b border-primary-500/5 pb-2">
                           <span>Inside Dhaka</span>
                           <span className="font-bold text-text-primary">24 - 48 Hours</span>
                        </li>
                        <li className="flex justify-between border-b border-primary-500/5 pb-2">
                           <span>Outside Dhaka</span>
                           <span className="font-bold text-text-primary">3 - 5 Days</span>
                        </li>
                        <li className="flex justify-between">
                           <span>Express Delivery</span>
                           <span className="font-bold text-primary-500">Same Day Available</span>
                        </li>
                     </ul>
                  </div>

                  <div className="glass p-8 rounded-3xl border border-primary-500/5 flex flex-col gap-6">
                     <div className="flex items-center gap-4">
                        <Shield className="text-primary-500" size={24} />
                        <h4 className="font-bold uppercase tracking-widest">Order Tracking</h4>
                     </div>
                     <p className="text-sm text-text-secondary leading-relaxed">
                        Once your order is dispatched, you will receive an SMS and Email with your tracking number. You can track your "Binary Excellence" in real-time through our portal.
                     </p>
                  </div>
               </div>

               <div className="flex flex-col gap-8 py-10">
                  <h3 className="text-3xl font-display font-black uppercase tracking-tight">DAMAGES & ISSUES</h3>
                  <div className="prose prose-invert max-w-none text-text-secondary">
                     <p>
                        Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.
                     </p>
                     <p className="mt-4">
                        We recommend filming a video while unboxing your package for faster insurance claims and verification.
                     </p>
                  </div>
               </div>
            </div>
         </motion.div>
      </section>
      <Footer />
    </div>
  )
}
