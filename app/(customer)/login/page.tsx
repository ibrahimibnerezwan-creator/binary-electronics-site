import { Metadata } from 'next'
import { getStoreSettings } from '@/lib/data'
import { LoginForm } from '@/components/auth/login-form'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings()
  const storeName = settings.storeName || 'Binary Electronics'
  return {
    title: `Login | ${storeName}`,
    description: `Secure access to your ${storeName} account.`,
  }
}

export default function LoginPage() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center container mx-auto px-4 py-20 relative overflow-hidden font-mono">
      {/* Background Cyber Elements */}
      <div className="absolute inset-0 bg-[#020408]" />
      <div className="absolute inset-0 tech-grid opacity-[0.05]" />
      
      {/* Ambient Glowing Orbs */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-accent-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse delay-700" />

      {/* Main Terminal Grid Structure */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <LoginForm />
        
        {/* Footer Technical Metadata */}
        <div className="mt-12 flex gap-8 text-[9px] text-primary-500/20 uppercase tracking-[0.4em] font-bold">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-primary-500 animate-pulse" />
            SECURE_LINK_ACTIVE
          </div>
          <div className="hidden md:block">ENCRYPTION: AES-256-GCM</div>
          <div className="hidden md:block">NODE: EDGE-SOUTH-01</div>
        </div>
      </div>
    </div>
  )
}
