'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/lib/cart-context'
import { cn } from '@/lib/utils'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { cartCount } = useCart()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Products', href: '/products' },
    { name: 'Categories', href: '/categories' },
    { name: 'Deals', href: '/#deals' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'glass h-16' : 'bg-transparent h-20'
      )}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-10 h-10">
            <Image
              src="/logo.png"
              alt="Binary Electronics"
              fill
              className="object-contain group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <span className="text-xl font-display font-bold tracking-tight text-gradient">
            BINARY
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-text-secondary hover:text-primary-500 transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-text-secondary hover:text-primary-500 transition-colors">
            <Search size={20} />
          </button>
          <Link href="/cart" className="relative p-2 text-text-secondary hover:text-primary-500 transition-colors">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-primary-500 text-white text-[10px] flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
          <Link href="/login" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-primary-500/20 hover:border-primary-500 transition-all text-sm group">
            <User size={18} className="text-primary-500" />
            <span className="text-text-secondary group-hover:text-text-primary transition-colors">Login</span>
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-text-secondary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 glass border-t border-primary-500/10 p-4 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-text-secondary p-2 hover:bg-primary-500/10 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/login"
                className="flex items-center gap-2 p-2 text-primary-500 font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User size={20} /> Login / Register
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
