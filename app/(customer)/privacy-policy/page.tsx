import { getStoreSettings } from '@/lib/data'
import { Network, ShieldAlert, Fingerprint, Lock, FileText, Database } from 'lucide-react'

export const revalidate = 3600 // Legal info rarely changes, cache for 1 hour

export default async function PrivacyPolicyPage() {
  const settings = await getStoreSettings()
  const storeName = settings?.storeName || 'Binary Electronics'

  return (
    <div className="flex flex-col relative overflow-hidden min-h-screen">
      {/* Tech Grid & Overlays */}
      <div className="tech-grid absolute inset-0 opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-500/20 to-transparent" />
      
      <section className="container mx-auto px-4 pt-40 pb-20 relative z-10">
         <div className="max-w-4xl mx-auto">
            <div className="flex flex-col gap-6 mb-24 animate-reveal-up text-center md:text-left">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-500 text-[10px] font-mono font-bold uppercase tracking-[0.4em] self-center md:self-start">
                 <Lock size={12} /> PROTOCOL_SECURE: ACTIVE
               </div>
               <h1 className="text-5xl lg:text-7xl font-display font-black uppercase tracking-tight">PRIVACY <br/><span className="text-gradient">ENCRYPTION</span></h1>
               <p className="text-text-secondary font-mono text-xs uppercase tracking-widest opacity-60">Last Updated: {new Date().getFullYear()}.Q1</p>
            </div>

            <div className="flex flex-col gap-16 text-text-secondary leading-relaxed text-lg">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {[
                    { 
                      title: 'DATA_COLLECTION', 
                      icon: Database,
                      desc: `When you interface with ${storeName}, we harvest essential technical telemetry — device parameters, interaction logs, and transactional data necessary for order execution.`
                    },
                    { 
                      title: 'DATA_UTILIZATION', 
                      icon: Network,
                      desc: 'Collected data is processed to optimize fulfillment protocols, maintain account security, and deploy localized firmware (product updates) across our network.'
                    },
                    { 
                      title: 'COOKIE_INTEGRATION', 
                      icon: Fingerprint,
                      desc: 'Our interface utilizes functional, performance, and security tokens (cookies) to maintain session stability and enhance user-system latency.'
                    },
                    { 
                      title: 'SECURITY_ENCRYPTION', 
                      icon: ShieldAlert,
                      desc: 'While we implement multi-layer encryption across all nodes, total security is a persistent vulnerability. We utilize industry-redundant systems to protect your data.'
                    },
                  ].map((section, i) => (
                    <div key={i} className="glass-card p-10 flex flex-col gap-6 group hover:border-primary-500/40 transition-all animate-reveal-up" style={{ animationDelay: `${i * 0.15}s` }}>
                       <div className="w-14 h-14 rounded-xl bg-bg-elevated border border-primary-500/10 flex items-center justify-center text-primary-500 group-hover:scale-110 group-hover:text-glow transition-all">
                         <section.icon size={28} />
                       </div>
                       <h3 className="text-xl font-display font-black uppercase tracking-widest text-text-primary underline decoration-primary-500/20 underline-offset-8 decoration-2">{section.title}</h3>
                       <p className="text-sm leading-relaxed text-text-muted italic group-hover:text-text-secondary transition-colors">
                          {section.desc}
                       </p>
                    </div>
                  ))}
               </div>

               <section className="glass-card p-12 lg:p-16 border-accent-500/10 relative overflow-hidden animate-reveal-up" style={{ animationDelay: '0.6s' }}>
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <FileText size={120} />
                  </div>
                  <h3 className="text-2xl font-display font-black uppercase tracking-tight text-text-primary mb-6 flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" /> SYSTEM_ETHICS
                  </h3>
                  <p className="text-lg italic font-display font-bold leading-relaxed">
                     "WE PRIORITIZE YOUR DIGITAL FOOTPRINT AS INTEGRAL TO OUR HARDWARE ETHOS. TRANSPARENCY IS OUR DEFAULT CONFIGURATION."
                  </p>
                  <div className="mt-8 pt-8 border-t border-primary-500/5 flex justify-between items-center text-[10px] font-mono font-bold tracking-widest text-primary-500/40 uppercase">
                    <span>AUTHORIZED_DOC: 404-PRIVATE</span>
                    <span>VER: 2024.1.0</span>
                  </div>
               </section>
            </div>
         </div>
      </section>
    </div>
  )
}
