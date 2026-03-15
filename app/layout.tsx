import type { Metadata } from 'next'
import { Sora, DM_Sans } from 'next/font/google'
import { Header } from '@/components/layout/header'
import { Providers } from './providers'
import './globals.css'

const sora = Sora({ subsets: ['latin'], variable: '--font-display' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-body' })

export const metadata: Metadata = {
  title: 'Binary Electronics | Premium Gadgets',
  description: 'Future of electronics. Premium products, unmatched quality.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${sora.variable} ${dmSans.variable} font-body min-h-screen bg-bg-primary text-text-primary overflow-x-hidden binary-bg`} suppressHydrationWarning>
        <Providers>
          <Header />
          <main className="pt-20">
            {children}
          </main>
        </Providers>

        {/* Dynamic Background Glow */}
        <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[120px] animate-float mr-[-300px]" />
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-[120px] animate-float ml-[-300px]" style={{ animationDelay: '2s' }} />
        </div>
      </body>
    </html>
  )
}
