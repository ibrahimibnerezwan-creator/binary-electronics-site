import { getStoreSettings } from '@/lib/data'
import Image from 'next/image'
import { ShieldCheck, Zap, Heart, Network, Cpu, Radio, Globe } from 'lucide-react'

export const revalidate = 3600 // Cache for 1 hour

export default async function AboutPage() {
  const settings = await getStoreSettings()
  const storeName = settings?.storeName || 'Binary Electronics'
  const storeDescription = settings?.storeDescription || 'We are not just a store. We are a destination for tech enthusiasts who demand the absolute best in innovation and performance.'

  return (
    <div className="flex flex-col relative overflow-hidden min-h-screen">
      {/* Background Tech Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="tech-grid absolute inset-0 opacity-5 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-8 animate-reveal-up">
            <Network size={12} /> SYSTEM_ORIGIN: ESTABLISHED
          </div>
          
          <h1 className="text-5xl lg:text-8xl font-display font-black leading-tight uppercase tracking-tight mb-8 animate-reveal-up">
            THE <span className="text-gradient">{(storeName.split(' ')[0] || 'BINARY').toUpperCase()}</span> <br /> REVOLUTION
          </h1>
          
          <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed animate-reveal-up" style={{ animationDelay: '0.1s' }}>
            {storeDescription}
          </p>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: 'System Uptime', value: '24/7', icon: Radio, delay: '0.2s' },
            { label: 'Active Nodes', value: '10K+', icon: Globe, delay: '0.3s' },
            { label: 'Genuine Logic', value: '100%', icon: Cpu, delay: '0.4s' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-10 text-center relative group overflow-hidden border-primary-500/10 animate-reveal-up" style={{ animationDelay: stat.delay }}>
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center mx-auto mb-4 border border-primary-500/20 text-primary-500">
                <stat.icon size={24} />
              </div>
              <div className="text-4xl font-black mb-1 font-mono tracking-tighter text-primary-400">{stat.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Narrative Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative aspect-square rounded-3xl overflow-hidden border border-primary-500/10 p-2 group animate-reveal-left">
             <div className="absolute inset-0 z-20 animate-scan pointer-events-none opacity-50" />
             <div className="absolute inset-0 bg-primary-500/5 z-10" />
             <Image 
               src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000" 
               alt="Technical Infrastructure" 
               fill 
               className="object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100" 
             />
             {/* Dynamic Metadata */}
             <div className="absolute top-6 left-6 z-30 font-mono text-[10px] text-primary-500 bg-bg-void/80 px-2 py-1 border border-primary-500/20">
               CORE_FACILITY_ID: B-01
             </div>
          </div>
          
          <div className="flex flex-col gap-8 animate-reveal-right">
            <h2 className="text-4xl font-display font-black uppercase tracking-tight">CRAFTING <span className="text-primary-500 text-glow">EXCELLENCE</span></h2>
            <div className="flex flex-col gap-6 text-text-secondary leading-relaxed text-lg">
              <p>
                Founded with a vision to redefine the electronics architecture, {storeName} was engineered to treat hardware as a form of digital art.
              </p>
              <p>
                Every component in our ecosystem is filtered through a rigorous protocol — extreme performance, industrial-grade design, and absolute reliability.
              </p>
              <p>
                Today, we power thousands of digital lives across Bangladesh, providing more than just inventory — we provide the infrastructure for your ambition.
              </p>
            </div>
            
            <div className="flex gap-12 mt-4">
               <div className="flex flex-col gap-1">
                 <span className="text-sm font-mono text-primary-500">_VERSION</span>
                 <span className="text-xl font-black">2024.v4</span>
               </div>
               <div className="flex flex-col gap-1">
                 <span className="text-sm font-mono text-accent-500">_STATUS</span>
                 <span className="text-xl font-black text-green-500">OPERATIONAL</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="bg-bg-elevated/10 py-32 border-y border-primary-500/5 relative">
        <div className="container mx-auto px-4 relative z-10">
           <div className="text-center mb-20 animate-reveal-up">
             <h2 className="text-4xl font-display font-black uppercase tracking-tight">CORE <span className="text-gradient">PROTOCOLS</span></h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'AUTHENTICITY', desc: 'No compromises. Every unit is authenticated and verified for structural integrity.', icon: ShieldCheck },
                { title: 'INNOVATION', desc: 'Sourcing the latest neural hardware and consumer tech ahead of the curve.', icon: Zap },
                { title: 'INTERFACE', desc: 'The relationship begins at transaction. Support is integrated into our DNA.', icon: Heart },
              ].map((value, i) => (
                <div key={i} className="glass-card p-10 flex flex-col gap-6 text-center group hover:border-primary-500/30 transition-all animate-reveal-up" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
                   <div className="w-16 h-16 rounded-2xl bg-bg-elevated border border-primary-500/10 flex items-center justify-center mx-auto text-primary-500 group-hover:text-glow transition-all">
                     <value.icon size={32} />
                   </div>
                   <h3 className="text-xl font-display font-black tracking-widest uppercase">{value.title}</h3>
                   <p className="text-text-muted text-sm leading-relaxed">{value.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Philosophy Callout */}
      <section className="container mx-auto px-4 py-32">
        <div className="glass-card p-12 lg:p-24 text-center relative overflow-hidden border-primary-500/5 animate-reveal-up">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-500 to-transparent" />
          <h2 className="text-3xl lg:text-5xl font-display font-black mb-8 italic leading-tight uppercase">
            "WE ARE THE <span className="text-primary-500 text-glow">INTERFACE</span> BETWEEN <br /> HUMANITY AND THE <span className="text-accent-500">DIGITAL AGE</span>."
          </h2>
          <p className="max-w-2xl mx-auto text-text-secondary leading-relaxed font-mono text-sm opacity-80">
            ENGINEERED_IN_BANGLADESH // EST_2016 // CONNECTING_REALITIES
          </p>
        </div>
      </section>
    </div>
  )
}
