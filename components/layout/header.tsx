'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, ShoppingCart, User, Menu, X, LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/lib/cart-context'
import { useSettings } from '@/lib/settings-context'
import { cn } from '@/lib/utils'

interface HeaderProps {
  user?: { id: string; name: string; email: string } | null
}

export function Header({ user }: HeaderProps = {}) {
  const settings = useSettings()
  const { cartCount } = useCart()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await fetch('/api/auth/login', { method: 'DELETE' })
      router.refresh()
      router.push('/')
    } finally {
      setLoggingOut(false)
      setIsMobileMenuOpen(false)
    }
  }

  const navLinks = [
    { name: 'Categories', href: '/categories' },
    { name: 'Products', href: '/products' },
    { name: 'Deals', href: '/#featured' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b',
        isScrolled 
          ? 'glass h-16 border-primary-500/20' 
          : 'bg-transparent h-20 border-transparent'
      )}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between relative">
        {/* Status Indicator - Tech Vibe */}
        <div className="absolute top-0 left-4 hidden lg:flex items-center gap-2 py-1 px-2 bg-bg-void/50 border border-t-0 border-primary-500/20 rounded-b-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
          </span>
          <span className="text-[10px] font-mono leading-none tracking-widest text-primary-400 opacity-80 uppercase">
            System: Online
          </span>
        </div>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group relative">
          <div className="relative w-10 h-10 overflow-hidden rounded-lg border border-primary-500/10 group-hover:border-primary-500/30 transition-all">
            <Image
              src="/logo.png"
              alt={settings.storeName || "Binary Electronics"}
              fill
              className="object-contain p-1 group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-primary-500/5 group-hover:bg-primary-500/10 transition-colors" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-display font-bold tracking-tighter text-gradient leading-none">
              {settings.storeName?.split(' ')[0] || "BINARY"}
            </span>
            <span className="text-[10px] font-mono tracking-[0.2em] text-text-muted uppercase leading-none mt-1 group-hover:text-primary-400 transition-colors">
              Electronics
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="px-4 py-2 text-xs font-mono tracking-widest uppercase text-text-secondary hover:text-primary-400 transition-all relative group"
            >
              <span className="relative z-10">{link.name}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-primary-500 transition-all duration-300 group-hover:w-full" />
              <span className="absolute top-0 left-0 w-1 h-1 border-t border-l border-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          <Link href="/products" className="p-2 text-text-secondary hover:text-primary-400 transition-all hover:bg-primary-500/5 rounded-lg border border-transparent hover:border-primary-500/10">
            <Search size={18} />
          </Link>
          <Link href="/cart" className="relative p-2 text-text-secondary hover:text-primary-400 transition-all hover:bg-primary-500/5 rounded-lg border border-transparent hover:border-primary-500/10">
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-primary-500 text-bg-void text-[9px] font-bold flex items-center justify-center rounded-sm animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <span className="flex items-center gap-2 pl-3 pr-3 py-2 rounded-sm border border-primary-500/10 bg-primary-500/5">
                <User size={14} className="text-primary-500" />
                <span className="text-[11px] font-mono tracking-widest uppercase text-text-primary max-w-[100px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              </span>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-2 pl-3 pr-3 py-2 rounded-sm border border-primary-500/10 hover:border-red-500/40 hover:bg-red-500/5 transition-all disabled:opacity-50"
                aria-label="Logout"
              >
                <LogOut size={14} className="text-text-muted" />
                <span className="text-[11px] font-mono tracking-widest uppercase text-text-secondary">
                  {loggingOut ? '...' : 'Exit'}
                </span>
              </button>
            </div>
          ) : (
            <Link href="/login" className="hidden md:flex items-center gap-2 pl-3 pr-4 py-2 rounded-sm border border-primary-500/10 hover:border-primary-500/40 bg-primary-500/5 hover:bg-primary-500/10 transition-all group overflow-hidden relative">
              <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-primary-500/10 to-transparent -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000" />
              <User size={16} className="text-primary-500 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-mono tracking-widest uppercase text-text-secondary group-hover:text-text-primary transition-colors">Access</span>
            </Link>
          )}
          
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-text-secondary hover:text-primary-400"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 glass border-t border-primary-500/20 overflow-hidden md:hidden"
          >
            <div className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-mono tracking-[0.2em] uppercase text-text-secondary p-3 hover:bg-primary-500/10 rounded-sm border border-transparent hover:border-primary-500/10 transition-all flex items-center justify-between group"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                  <span className="w-1.5 h-1.5 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_8px_var(--color-primary-500)]" />
                </Link>
              ))}
              {user ? (
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center justify-between p-3 mt-2 bg-primary-500 text-bg-void font-mono text-xs tracking-[0.2em] uppercase rounded-sm disabled:opacity-50"
                >
                  {loggingOut ? 'Exiting...' : `Exit (${user.name.split(' ')[0]})`} <LogOut size={16} />
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center justify-between p-3 mt-2 bg-primary-500 text-bg-void font-mono text-xs tracking-[0.2em] uppercase rounded-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Access System <User size={16} />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
