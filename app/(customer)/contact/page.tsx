import { Metadata } from 'next'
import { getStoreSettings } from '@/lib/data'
import { ContactForm } from '@/components/contact/contact-form'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings()
  const storeName = settings.storeName || 'Binary Electronics'
  
  return {
    title: `Contact | ${storeName}`,
    description: `Get in touch with ${storeName} technical support. Secure uplink for inquiries and services.`,
  }
}

export default async function ContactPage() {
  const settings = await getStoreSettings()

  return (
    <main className="relative min-h-screen pt-32 pb-24 overflow-hidden bg-black selection:bg-primary-500 selection:text-black">
      {/* Background System Grid */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e910_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e910_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
      </div>

      <div className="container relative z-10 px-6 mx-auto">
        <ContactForm settings={settings} />
      </div>

      {/* Background Decorative Element */}
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />
    </main>
  )
}
