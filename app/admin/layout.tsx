'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Tag, 
  Star, 
  Settings, 
  LogOut,
  ChevronRight,
  Menu,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const adminNav = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Categories', href: '/admin/categories', icon: Tag },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Reviews', href: '/admin/reviews', icon: Star },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const router = useRouter()

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'DELETE',
      })
      if (res.ok) {
        router.push('/admin/login')
        router.refresh()
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-bg-void flex overflow-hidden relative">
      {/* Sidebar Backdrop for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 glass border-r border-primary-500/10 transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none",
          isSidebarOpen ? "w-72 translate-x-0" : "w-72 -translate-x-full lg:w-20 lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-primary-500/10 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image src="/logo.png" alt="Logo" fill className="object-contain" />
              </div>
              {(isSidebarOpen || (typeof window !== 'undefined' && window.innerWidth < 1024)) && (
                <span className="text-xl font-display font-black text-gradient">BINARY</span>
              )}
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 text-text-muted hover:text-primary-500 glass rounded-lg border-primary-500/10"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-grow p-4 space-y-2 overflow-y-auto custom-scrollbar">
            {adminNav.map((item) => {
              const isActive = pathname === item.href
              const showText = isSidebarOpen || (typeof window !== 'undefined' && window.innerWidth < 1024)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024) setIsSidebarOpen(false)
                  }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group",
                    isActive 
                      ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20" 
                      : "text-text-secondary hover:bg-primary-500/10 hover:text-primary-500"
                  )}
                >
                  <item.icon size={22} className={cn(isActive ? "text-white" : "text-primary-500 flex-shrink-0")} />
                  {showText && (
                    <span className="font-bold text-sm tracking-wide whitespace-nowrap">{item.name}</span>
                  )}
                  {isActive && showText && (
                    <ChevronRight size={16} className="ml-auto opacity-70 flex-shrink-0" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Footer / User Session */}
          <div className="p-4 border-t border-primary-500/10">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:bg-red-500/10 hover:text-red-500 transition-all group"
            >
              <LogOut size={22} className="flex-shrink-0" />
              {(isSidebarOpen || (typeof window !== 'undefined' && window.innerWidth < 1024)) && <span className="font-bold text-sm">Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>


      {/* Main Content Area */}
      <main className="flex-grow flex flex-col h-screen overflow-hidden w-full">
        {/* Top Navbar */}
        <header className="h-16 lg:h-20 glass border-b border-primary-500/10 flex items-center justify-between px-4 lg:px-8 shrink-0 relative z-30">
           <div className="flex items-center gap-3 lg:gap-4">
              <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="flex p-2 text-text-muted hover:text-primary-500 glass rounded-lg border-primary-500/10 transition-colors"
                aria-label="Toggle Sidebar"
              >
                <Menu size={20} />
              </button>
              <div className="flex flex-col">
                <span className="text-[8px] lg:text-[10px] uppercase font-bold text-primary-500 tracking-widest hidden sm:block">Portal</span>
                <h2 className="text-base lg:text-xl font-display font-black uppercase tracking-tight line-clamp-1">Admin Dashboard</h2>
              </div>
           </div>

           <div className="flex items-center gap-3 lg:gap-6">
              <div className="flex items-center gap-2 lg:gap-3 bg-bg-primary/50 border border-primary-500/10 rounded-full px-3 py-1.5 lg:px-4 lg:py-2">
                 <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-primary-500 flex items-center justify-center text-white text-[10px] lg:text-xs font-bold font-display shadow-lg shadow-primary-500/30">
                    AD
                 </div>
                 <div className="hidden xs:flex flex-col leading-tight">
                    <span className="text-[10px] lg:text-xs font-bold">Admin</span>
                    <span className="text-[8px] lg:text-[10px] text-text-muted uppercase tracking-tighter">Master Access</span>
                 </div>
              </div>
           </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-grow overflow-y-auto p-4 lg:p-8 custom-scrollbar relative">
           {/* Background decorative glow */}
           <div className="absolute top-0 right-0 w-[200px] lg:w-[400px] h-[200px] lg:h-[400px] bg-primary-500/5 rounded-full blur-[60px] lg:blur-[100px] pointer-events-none" />
           <div className="relative z-10">
              {children}
           </div>
        </div>
      </main>
    </div>
  )
}
