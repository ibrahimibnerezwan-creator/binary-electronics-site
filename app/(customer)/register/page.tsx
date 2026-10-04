import { Metadata } from "next";
import { getPublicStoreSettings } from "@/lib/data";
import { RegisterForm } from "@/components/auth/register-form";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicStoreSettings();
  const storeName = settings.storeName || "Binary Electronics";
  return {
    title: `Register | ${storeName}`,
    description: `Create your ${storeName} account and join the local tech revolution.`,
  };
}

export default function RegisterPage() {
  return (
    <section className="sf-auth-page">
      <RegisterForm />
    </section>
  );
}
