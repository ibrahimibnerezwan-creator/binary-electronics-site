'use client'

import { motion } from 'framer-motion'
import { Award, ShieldCheck, Zap, Heart, Users, Globe } from 'lucide-react'
import Image from 'next/image'
import { Footer } from '@/components/layout/footer'

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-bg-void z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-[160px]" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[140px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            <span className="text-xs font-bold uppercase tracking-[0.5em] text-primary-500">Our Story</span>
            <h1 className="text-6xl lg:text-8xl font-display font-black leading-tight uppercase tracking-tight">
              THE <span className="text-gradient">BINARY</span> <br /> REVOLUTION
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed mt-4">
              We are not just a store. We are a destination for tech enthusiasts who demand the absolute best in innovation, luxury, and performance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative aspect-square glass rounded-3xl overflow-hidden border border-primary-500/10 p-4">
             <Image 
               src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000" 
               alt="Team" 
               fill 
               className="object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-700" 
             />
          </div>
          
          <div className="flex flex-col gap-8">
            <h2 className="text-4xl font-display font-black uppercase tracking-tight">CRAFTING <span className="text-primary-500">EXCELLENCE</span></h2>
            <div className="flex flex-col gap-6 text-text-secondary leading-relaxed text-lg">
              <p>
                Founded in Dhaka with a vision to redefine the electronics shopping experience, Binary Electronics was born out of a simple need: a platform that treats technology as a form of art.
              </p>
              <p>
                Every product in our collection is handpicked by our team of engineers to ensure it meets our strict "Binary Standard" — perfect performance, stunning design, and bulletproof reliability.
              </p>
              <p>
                Today, we serve thousands of customers across Bangladesh, providing them with more than just gadgets — we provide the tools to build their future.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 mt-4">
               <div className="flex flex-col gap-2">
                 <span className="text-4xl font-black text-primary-500">10K+</span>
                 <span className="text-xs uppercase font-bold tracking-widest text-text-muted">Happy Clients</span>
               </div>
               <div className="flex flex-col gap-2">
                 <span className="text-4xl font-black text-accent-500">100%</span>
                 <span className="text-xs uppercase font-bold tracking-widest text-text-muted">Genuine Goods</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="bg-bg-elevated/20 py-24 border-y border-primary-500/5">
        <div className="container mx-auto px-4">
           <div className="text-center mb-16">
             <h2 className="text-4xl font-display font-black uppercase tracking-tight">OUR <span className="text-gradient">CORE VALUES</span></h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'AUTHENTICITY', desc: 'We never compromise. Every item is 100% genuine and verified.', icon: ShieldCheck },
                { title: 'INNOVATION', desc: 'We stay ahead of the curve, bringing you the latest tech before anyone else.', icon: Zap },
                { title: 'CUSTOMER FIRST', desc: 'Our relationship begins when you make a purchase, and it lasts a lifetime.', icon: Heart },
              ].map((value, i) => (
                <div key={i} className="glass-card p-10 flex flex-col gap-6 text-center group hover:bg-primary-500/5 transition-all">
                   <div className="w-16 h-16 rounded-2xl glass border border-primary-500/10 flex items-center justify-center mx-auto text-primary-500 group-hover:scale-110 transition-transform">
                     <value.icon size={32} />
                   </div>
                   <h3 className="text-xl font-display font-black tracking-widest uppercase">{value.title}</h3>
                   <p className="text-text-muted text-sm leading-relaxed">{value.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
