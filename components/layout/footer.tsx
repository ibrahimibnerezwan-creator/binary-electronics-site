'use client'
 
import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from 'lucide-react'
import { useSettings } from '@/lib/settings-context'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const settings = useSettings()

  const socialLinks = [
    { Icon: Facebook, url: settings.facebook },
    { Icon: Instagram, url: settings.instagram },
    { Icon: Youtube, url: settings.youtube },
    { Icon: Twitter, url: settings.twitter },
  ].filter(link => link.url && link.url !== '#')

  return (
    <footer className="relative bg-bg-void pt-20 pb-10 overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-10 h-10">
                <Image src="/logo.png" alt={settings.storeName || "Binary Electronics"} fill className="object-contain" />
              </div>
              <span className="text-2xl font-display font-bold text-gradient">
                {settings.storeName?.split(' ')[0] || "BINARY"}
              </span>
            </Link>
            <p className="text-text-secondary leading-relaxed">
              {settings.storeDescription || "Premium electronics and gadgets for the modern world. Quality guaranteed, innovation delivered."}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-4">
                {socialLinks.map(({ Icon, url }, i) => (
                  <Link 
                    key={i} 
                    href={url} 
                    target="_blank" 
                    className="w-10 h-10 rounded-full glass border border-primary-500/10 flex items-center justify-center text-text-secondary hover:text-primary-500 hover:border-primary-500/30 transition-all"
                  >
                    <Icon size={18} />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-display font-bold mb-6 text-text-primary">Quick Links</h4>
            <ul className="flex flex-col gap-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'New Arrivals', href: '/#new-arrivals' },
                { name: 'Categories', href: '/categories' },
                { name: 'Products', href: '/products' },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-text-secondary hover:text-primary-500 transition-colors">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-display font-bold mb-6 text-text-primary">Support</h4>
            <ul className="flex flex-col gap-3">
              {[
                { name: 'Contact Us', href: '/contact' },
                { name: 'Shipping Policy', href: '/shipping-policy' },
                { name: 'Privacy Policy', href: '/privacy-policy' },
                { name: 'About Us', href: '/about' },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-text-secondary hover:text-primary-500 transition-colors">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-display font-bold mb-6 text-text-primary">Contact Us</h4>
            <ul className="flex flex-col gap-6">
              <li className="flex gap-3">
                <MapPin className="text-primary-500 shrink-0" size={20} />
                <span className="text-text-secondary">{settings.address || "Level-5, Multiplan Center, Dhaka, Bangladesh"}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="text-primary-500 shrink-0" size={20} />
                <span className="text-text-secondary">{settings.phone || "+880 1911-857987"}</span>
              </li>
              <li className="flex gap-3">
                <Mail className="text-primary-500 shrink-0" size={20} />
                <span className="text-text-secondary">{settings.email || "support@binary-electronics.com"}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-500/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-muted">
          <p>© {currentYear} {settings.storeName || "Binary Electronics"}. All rights reserved.</p>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Secure Payments:</span>
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 glass rounded-lg border border-primary-500/10 text-[10px] font-black text-rose-500 tracking-tighter shadow-inner">bKash</div>
              <div className="px-3 py-1 glass rounded-lg border border-primary-500/10 text-[10px] font-black text-orange-500 tracking-tighter shadow-inner">Nagad</div>
              <div className="px-3 py-1 glass rounded-lg border border-primary-500/10 text-[10px] font-black text-primary-500 tracking-tighter shadow-inner">COD</div>
              <div className="px-3 py-1 glass rounded-lg border border-primary-500/10 text-[10px] font-black text-white tracking-tighter shadow-inner">VISA/MC</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
