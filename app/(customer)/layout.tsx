import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { WhatsAppCTA } from '@/components/layout/whatsapp-cta'
import { getStoreSettings } from '@/lib/data'
import { SettingsProvider } from '@/lib/settings-context'

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getStoreSettings()

  return (
    <SettingsProvider settings={settings}>
      <Header />
      <main>
        {children}
      </main>
      <Footer />
      <WhatsAppCTA />
    </SettingsProvider>
  )
}
