'use client'

import { ThemeProvider } from 'next-themes'
import { CartProvider } from '@/lib/cart-context'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <CartProvider>
        {children}
      </CartProvider>
    </ThemeProvider>
  )
}
