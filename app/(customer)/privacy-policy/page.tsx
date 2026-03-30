'use client'

import { Footer } from '@/components/layout/footer'
import { motion } from 'framer-motion'

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col">
      <section className="container mx-auto px-4 py-20">
         <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="max-w-4xl mx-auto"
         >
            <div className="flex flex-col gap-4 mb-20">
               <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-primary-500">Legal</span>
               <h1 className="text-5xl lg:text-7xl font-display font-black uppercase tracking-tight">PRIVACY <br/><span className="text-gradient">POLICY</span></h1>
               <div className="w-20 h-1 bg-primary-500/20 mt-4" />
            </div>

            <div className="flex flex-col gap-12 text-text-secondary leading-relaxed text-lg">
               <section className="flex flex-col gap-4">
                  <h3 className="text-2xl font-display font-black uppercase tracking-tight text-text-primary">DATA COLLECTION</h3>
                  <p>
                     When you visit Binary Electronics, we collect certain information about your device, your interaction with the Site, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support.
                  </p>
               </section>

               <section className="flex flex-col gap-4">
                  <h3 className="text-2xl font-display font-black uppercase tracking-tight text-text-primary">USAGE OF DATA</h3>
                  <p>
                     We use your personal information to provide our services to you, which includes: offering products for sale, processing payments, shipping and fulfillment of your order, and keeping you up to date on new products, services, and offers.
                  </p>
               </section>

               <section className="flex flex-col gap-4">
                  <h3 className="text-2xl font-display font-black uppercase tracking-tight text-text-primary">COOKIES</h3>
                  <p>
                     A cookie is a small amount of information that’s downloaded to your computer or device when you visit our Site. We use a number of different cookies, including functional, performance, advertising, and social media or content cookies. 
                  </p>
               </section>

               <section className="flex flex-col gap-4">
                  <h3 className="text-2xl font-display font-black uppercase tracking-tight text-text-primary">SECURITY</h3>
                  <p>
                     The security of your Personal Information is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Information, we cannot guarantee its absolute security.
                  </p>
               </section>

               <div className="p-8 glass-card border-accent-500/20 mt-10">
                  <p className="text-sm font-bold text-center italic">
                     "We respect your digital footprint as much as we respect your technology choices."
                  </p>
               </div>
            </div>
         </motion.div>
      </section>
      <Footer />
    </div>
  )
}
