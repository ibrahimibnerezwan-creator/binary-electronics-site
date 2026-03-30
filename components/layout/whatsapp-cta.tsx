'use client'

import { motion } from 'framer-motion'
import { MessageSquare } from 'lucide-react'
import Link from 'next/link'

export function WhatsAppCTA() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring' }}
      className="fixed bottom-8 right-8 z-50"
    >
      <Link
        href="https://wa.me/8801911857987"
        target="_blank"
        className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-[#25D366] text-white shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] transition-all duration-300"
      >
        <MessageSquare size={32} />
        
        {/* Pulsing rings */}
        <span className="absolute inset-0 rounded-full border-2 border-[#25D366] animate-ping opacity-20" />
        
        {/* Tooltip */}
        <div className="absolute right-full mr-4 bg-bg-elevated border border-primary-500/10 px-4 py-2 rounded-xl opacity-0 translate-x-10 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap">
          <p className="text-sm font-bold text-text-primary">Chat with us</p>
          <p className="text-[10px] text-text-muted">We're online now!</p>
        </div>
      </Link>
    </motion.div>
  )
}
