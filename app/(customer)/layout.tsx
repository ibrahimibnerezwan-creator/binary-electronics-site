import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { WhatsAppCTA } from '@/components/layout/whatsapp-cta'

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="pt-20">
        {children}
      </main>
      <Footer />
      <WhatsAppCTA />
    </>
  )
}
