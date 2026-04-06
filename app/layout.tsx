import type { Metadata } from 'next'
import { Sora, DM_Sans, JetBrains_Mono } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const sora = Sora({ subsets: ['latin'], variable: '--font-display' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-body' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

import { getStoreSettings } from '@/lib/data'

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings()
  const storeName = settings.storeName || 'Binary Electronics'
  const storeDescription = settings.storeDescription || 'Premium electronics and gadgets for the modern world. Quality guaranteed, innovation delivered. Best tech prices in Bangladesh.'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://binary-electronics-site.vercel.app'

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${storeName} | Premium Gadgets & Parts in Bangladesh`,
      template: `%s | ${storeName}`
    },
    description: storeDescription,
    keywords: ['electronics', 'gadgets', 'Bangladesh', 'Multiplan Center', 'tech accessories', 'high-end computing'],
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      siteName: storeName,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: storeName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: storeName,
      description: storeDescription,
      images: ['/og-image.png'],
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${sora.variable} ${dmSans.variable} ${jetbrainsMono.variable} font-body min-h-screen bg-bg-void text-text-primary overflow-x-hidden digital-noise`} suppressHydrationWarning>
        <div className="fixed inset-0 -z-50 tech-grid pointer-events-none opacity-40 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
        <Providers>
          {children}
        </Providers>

        {/* Analytics & Tracking */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          />
        )}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `,
            }}
          />
        )}
        {process.env.NEXT_PUBLIC_FB_PIXEL_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
                fbq('track', 'PageView');
              `,
            }}
          />
        )}

        {/* Dynamic Background Glow */}
        <div className="fixed inset-0 -z-40 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-500/10 rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent-500/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
        </div>
      </body>
    </html>
  )
}
