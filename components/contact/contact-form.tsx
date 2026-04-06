'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Send, MessageSquare, Facebook, Twitter, Instagram, Youtube, Linkedin, Network, Cpu, ShieldCheck, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ContactFormProps {
  settings: Record<string, string>
}

export function ContactForm({ settings }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setStatus('success')
    setTimeout(() => setStatus('idle'), 3000)
  }

  const socialLinks = [
    { Icon: Facebook, href: settings.facebook },
    { Icon: Twitter, href: settings.twitter },
    { Icon: Instagram, href: settings.instagram },
    { Icon: Youtube, href: settings.youtube },
    { Icon: Linkedin, href: settings.linkedin },
    { Icon: Globe, href: settings.tiktok },
  ].filter(link => link.href && link.href !== '#' && link.href !== '')

  return (
    <div className="flex flex-col lg:flex-row gap-16 items-start font-mono">
      {/* Left Side: System Information */}
      <div className="flex-1 flex flex-col gap-12 animate-reveal-up">
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none bg-primary-500/10 border border-primary-500/20 text-primary-500 text-[10px] font-bold uppercase tracking-[0.4em]">
            <Network size={12} className="animate-pulse" /> PROTOCOL: ESTABLISH_LINK
          </div>
          <h1 className="text-6xl lg:text-8xl font-display font-black leading-tight uppercase tracking-tighter text-white">
            LINKING <br />
            <span className="text-gradient">INTERFACE</span>
          </h1>
          <p className="text-sm text-text-muted/60 leading-relaxed max-w-md uppercase tracking-widest border-l border-primary-500/20 pl-4 py-2">
            Initiate communication with our technical support core. Average response latency: <span className="text-primary-500 font-bold">120ms</span>. Static node verified.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {[
            { label: 'COMMS_CHANNEL', value: settings.email, icon: Mail, color: 'text-primary-500' },
            { label: 'VOICE_UPLINK', value: settings.phone, icon: Phone, color: 'text-accent-500' },
            { label: 'COORDINATES_XYZ', value: settings.address, icon: MapPin, color: 'text-primary-400' },
          ].filter(item => item.value).map((item, i) => (
            <div key={i} className="bg-black/40 border border-primary-500/10 p-6 flex gap-6 items-center group hover:border-primary-500/40 transition-all backdrop-blur-xl relative overflow-hidden">
              {/* Scan effect for card */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-primary-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <div className={`w-14 h-14 rounded-none bg-primary-500/5 border border-primary-500/10 flex items-center justify-center ${item.color} group-hover:bg-primary-500/10 transition-all`}>
                <item.icon size={24} strokeWidth={1.5} />
              </div>
              <div className="flex flex-col gap-1 relative z-10">
                <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary-500/40">{item.label}</span>
                <span className="text-base font-black text-white group-hover:text-primary-500 transition-colors">{item.value}</span>
              </div>
            </div>
          ))}
        </div>

        {socialLinks.length > 0 && (
          <div className="flex flex-col gap-6 mt-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-primary-500/40">_SOCIAL_NODES</span>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ Icon, href }, i) => (
                <a 
                  key={i} 
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 border border-primary-500/10 flex items-center justify-center text-primary-500/40 hover:text-primary-500 hover:border-primary-500/40 transition-all hover:bg-primary-500/5"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Side: Data Input Interface */}
      <div className="flex-1 w-full lg:max-w-xl animate-reveal-up delay-150">
        <div className="bg-black/60 backdrop-blur-2xl p-8 lg:p-12 relative overflow-hidden border border-primary-500/20">
           {/* Decorative scanning line */}
           <div className="absolute top-0 left-0 w-full h-[1px] bg-primary-500/40 animate-scan z-20 pointer-events-none" />
           
           <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-8">
              <div className="flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="flex flex-col gap-3">
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-500/40 ml-1">USER_NAME</label>
                      <Input placeholder="IDENT_STRING" className="h-12 bg-white/5 border-primary-500/10 focus:border-primary-500/50 rounded-none text-xs uppercase tracking-widest text-white placeholder:text-text-muted/20" />
                   </div>
                   <div className="flex flex-col gap-3">
                      <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-500/40 ml-1">UPLINK_ADDR</label>
                      <Input type="email" placeholder="COMM_ID@NODE.LOCAL" className="h-12 bg-white/5 border-primary-500/10 focus:border-primary-500/50 rounded-none text-xs uppercase tracking-widest text-white placeholder:text-text-muted/20" />
                   </div>
                </div>

                <div className="flex flex-col gap-3">
                   <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-500/40 ml-1">TRANSMISSION_SUBJECT</label>
                   <Input placeholder="GENERAL_INQUIRY_REQ" className="h-12 bg-white/5 border-primary-500/10 focus:border-primary-500/50 rounded-none text-xs uppercase tracking-widest text-white placeholder:text-text-muted/20" />
                </div>

                <div className="flex flex-col gap-3">
                   <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary-500/40 ml-1">PAYLOAD_DATA</label>
                   <textarea 
                     rows={5}
                     placeholder="INPUT_MESSAGE_HERE..."
                     className="w-full border border-primary-500/10 bg-white/5 p-6 text-xs font-mono focus:outline-none focus:border-primary-500/50 transition-all resize-none text-white uppercase tracking-widest placeholder:text-text-muted/20"
                   ></textarea>
                </div>
              </div>

              <Button 
                type="submit"
                size="lg" 
                disabled={status !== 'idle'}
                className="h-16 w-full text-xs font-black uppercase tracking-[0.4em] gap-3 relative overflow-hidden group bg-primary-500 text-black border-0 rounded-none transition-all hover:bg-white"
              >
                {status === 'loading' ? (
                   <span className="flex items-center gap-3">
                     <Cpu className="animate-spin w-5 h-5" /> ENCRYPTING...
                   </span>
                ) : status === 'success' ? (
                   <span className="flex items-center gap-3 text-black">
                     <ShieldCheck className="w-5 h-5" /> UPLINK_ESTABLISHED
                   </span>
                ) : (
                  <>
                    <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> TRANSMIT_SIGNAL
                  </>
                )}
                
                {/* Glow bar */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Button>

              <div className="flex items-center justify-center gap-3 mt-4 text-[9px] font-bold tracking-[0.5em] text-primary-500/20 uppercase">
                <MessageSquare size={12} className="text-primary-500/40" /> STATUS: ENCRYPTED_LINK_ACTIVE
              </div>
           </form>
        </div>
        
        {/* Metadata Footer */}
        <div className="mt-8 flex justify-between font-mono text-[8px] text-primary-500/20 px-4 uppercase tracking-[0.5em]">
          <div>LOC: {settings.address?.split(',')[0].toUpperCase() || 'DHAKA_NODE'}</div>
          <div className="flex gap-4">
             <span>BIT_RATE: 1.2 GBPS</span>
             <span>ID: 200_OK</span>
          </div>
        </div>
      </div>
    </div>
  )
}
