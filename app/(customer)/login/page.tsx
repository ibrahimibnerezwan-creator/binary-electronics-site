import { Metadata } from "next";
import { getPublicStoreSettings } from "@/lib/data";
import { LoginForm } from "@/components/auth/login-form";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicStoreSettings();
  const storeName = settings.storeName || "Binary Electronics";
  return {
    title: `Login | ${storeName}`,
    description: `Secure access to your ${storeName} account.`,
  };
}

export default function LoginPage() {
  return (
    <section className="sf-auth-page">
      <LoginForm />
    </section>
  );
}
