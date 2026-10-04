import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { WhatsAppCTA } from "@/components/layout/whatsapp-cta";
import { getPublicStoreSettings } from "@/lib/data";
import { SettingsProvider } from "@/lib/settings-context";
import { getCurrentUser } from "@/lib/auth";
import "../storefront.css";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, user] = await Promise.all([
    getPublicStoreSettings(),
    getCurrentUser(),
  ]);

  const headerUser =
    user && user.id !== "admin-1"
      ? { id: user.id, name: user.name, email: user.email }
      : null;

  return (
    <SettingsProvider settings={settings}>
      <div className="storefront">
        <Header user={headerUser} />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <WhatsAppCTA />
      </div>
    </SettingsProvider>
  );
}
