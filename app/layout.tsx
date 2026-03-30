import type { Metadata } from 'next'
import { Sora, DM_Sans } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

const sora = Sora({ subsets: ['latin'], variable: '--font-display' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-body' })

export const metadata: Metadata = {
  metadataBase: new URL('https://binary-electronics-site.vercel.app'),
  title: {
    default: 'Binary Electronics | Premium Gadgets & Parts in Bangladesh',
    template: '%s | Binary Electronics'
  },
  description: 'Premium electronics and gadgets for the modern world. Quality guaranteed, innovation delivered. Best tech prices in Bangladesh.',
  keywords: ['electronics', 'gadgets', 'Bangladesh', 'Multiplan Center', 'tech accessories', 'high-end computing'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://binary-electronics-site.vercel.app',
    siteName: 'Binary Electronics',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Binary Electronics',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Binary Electronics',
    description: 'Premium gadgets and components at the best prices.',
    images: ['/og-image.png'],
  },
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
        <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[120px] animate-float mr-[-300px]" />
          <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-accent-500/5 rounded-full blur-[120px] animate-float ml-[-300px]" style={{ animationDelay: '2s' }} />
        </div>
      </body>
    </html>
  )
}
